"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";

const FRAME_COUNT = 40;
const LOADING_TIMEOUT_MS = 3500;

function getFramePath(index: number): string {
  return `/ezgif-frame-${String(index + 1).padStart(3, "0")}.png`;
}

function LoadingScreen({ progress }: { progress: number }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-cream">
      <div className="relative mb-8">
        <div className="w-20 h-20 rounded-full border-2 border-latte" />
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            className="text-walnut"
          >
            <path
              d="M18.5 3H6a4 4 0 0 0-4 4v10a4 4 0 0 0 4 4h12.5c1.93 0 3.5-1.57 3.5-3.5V6.5C22 4.57 20.43 3 18.5 3z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6 3v18"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M22 9h-2a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div
          className="absolute inset-0 rounded-full border-2 border-amber"
          style={{
            clipPath: `inset(${100 - progress}% 0 0 0)`,
          }}
        />
      </div>
      <p className="font-display text-xl text-espresso/80 tracking-tight">
        Brewing...
      </p>
      <p className="font-body text-sm text-walnut/50 mt-2">
        {Math.round(progress)}%
      </p>
    </div>
  );
}

interface TextSection {
  startFadeIn: number;
  startHold: number;
  startFadeOut: number;
  endFadeOut: number;
  content: React.ReactNode;
  position: "center" | "left" | "right" | "top-right" | "bottom-center";
}

const TEXT_SECTIONS: TextSection[] = [
  {
    startFadeIn: 0.0,
    startHold: 0.0,
    startFadeOut: 0.07,
    endFadeOut: 0.10,
    position: "center",
    content: (
      <div className="text-center">
        <h1 className="font-display text-6xl md:text-8xl lg:text-9xl text-cream/90 tracking-tight leading-none">
          Brew & Go
        </h1>
        <p className="font-body text-lg md:text-xl text-cream/60 mt-6 tracking-wide">
          Craft in Every Cup
        </p>
        <div className="mt-8 flex items-center justify-center gap-2 text-cream/40">
          <span className="font-body text-xs uppercase tracking-[0.3em]">
            Scroll to explore
          </span>
          <motion.span
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="block"
          >
            ↓
          </motion.span>
        </div>
      </div>
    ),
  },
  {
    startFadeIn: 0.12,
    startHold: 0.17,
    startFadeOut: 0.19,
    endFadeOut: 0.22,
    position: "top-right" as const,
    content: (
      <div className="text-right max-w-md ml-auto">
        <span className="font-body text-xs uppercase tracking-[0.3em] text-amber">
          01 — The Beans
        </span>
        <h2 className="font-display text-4xl md:text-6xl text-cream/90 tracking-tight mt-4 leading-tight">
          Freshly Roasted Beans
        </h2>
        <p className="font-body text-base text-cream/60 mt-4 leading-relaxed">
          Sourced from highland farms, each bean is roasted to unlock its deepest character.
        </p>
      </div>
    ),
  },
  {
    startFadeIn: 0.24,
    startHold: 0.29,
    startFadeOut: 0.31,
    endFadeOut: 0.34,
    position: "left",
    content: (
      <div className="text-left max-w-md">
        <span className="font-body text-xs uppercase tracking-[0.3em] text-amber">
          02 — Grounded
        </span>
        <h2 className="font-display text-4xl md:text-6xl text-cream/90 tracking-tight mt-4 leading-tight">
          Rooted in Tradition
        </h2>
        <p className="font-body text-base text-cream/60 mt-4 leading-relaxed">
          From soil to sip, we honor the origins of every harvest and the hands that nurture it.
        </p>
      </div>
    ),
  },
  {
    startFadeIn: 0.36,
    startHold: 0.41,
    startFadeOut: 0.43,
    endFadeOut: 0.46,
    position: "top-right" as const,
    content: (
      <div className="text-right max-w-md ml-auto">
        <span className="font-body text-xs uppercase tracking-[0.3em] text-amber">
          03 — The Process
        </span>
        <h2 className="font-display text-4xl md:text-6xl text-cream/90 tracking-tight mt-4 leading-tight">
          Handcrafted with Care
        </h2>
        <p className="font-body text-base text-cream/60 mt-4 leading-relaxed">
          Every pour is intentional. Every cup, a small act of devotion to the craft.
        </p>
      </div>
    ),
  },
  {
    startFadeIn: 0.47,
    startHold: 0.53,
    startFadeOut: 0.94,
    endFadeOut: 1.0,
    position: "center" as const,
    content: (
      <div className="text-center">
        <h2 className="font-display text-4xl md:text-6xl text-espresso tracking-tight mt-4 leading-tight font-bold">
          Taste the Difference
        </h2>
        <motion.a
          href="#find-us-today"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="mt-8 inline-flex items-center justify-center px-8 py-3 bg-espresso text-cream font-body text-sm uppercase tracking-[0.2em] rounded-full font-bold hover:bg-walnut transition-colors duration-300"
        >
          Visit Our Cart
        </motion.a>
      </div>
    ),
  },
];

function TextOverlay({
  section,
  scrollProgress,
}: {
  section: TextSection;
  scrollProgress: number;
}) {
  const getOpacity = useCallback(() => {
    const { startFadeIn, startHold, startFadeOut, endFadeOut } = section;
    if (scrollProgress < startFadeIn || scrollProgress > endFadeOut) return 0;
    if (scrollProgress >= startFadeIn && scrollProgress < startHold) {
      return (scrollProgress - startFadeIn) / (startHold - startFadeIn);
    }
    if (scrollProgress >= startHold && scrollProgress < startFadeOut) return 1;
    if (scrollProgress >= startFadeOut && scrollProgress <= endFadeOut) {
      return 1 - (scrollProgress - startFadeOut) / (endFadeOut - startFadeOut);
    }
    return 0;
  }, [scrollProgress, section]);

  const opacity = getOpacity();

  if (opacity <= 0.01) return null;

  const positionClasses = {
    center: "items-center justify-center text-center",
    left: "justify-start items-center text-left pl-4 md:pl-8 lg:pl-12",
    "top-right": "items-start justify-end text-right pr-4 md:pr-8 lg:pr-12 pt-16 md:pt-24",
    right: "items-end justify-center text-right pr-8 md:pr-16 lg:pr-24",
    "bottom-center": "justify-center items-end text-center pb-16 md:pb-24",
  };

  return (
    <div
      className={`absolute inset-0 flex ${positionClasses[section.position]} pointer-events-none z-10`}
      style={{ opacity }}
    >
      <div className="pointer-events-auto">{section.content}</div>
    </div>
  );
}

export default function CoffeeScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const loadedFramesRef = useRef<boolean[]>(Array(FRAME_COUNT).fill(false));
  const settledFramesRef = useRef<boolean[]>(Array(FRAME_COUNT).fill(false));
  const [loadedCount, setLoadedCount] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const currentFrameRef = useRef(0);

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const frameIndex = useTransform(scrollYProgress, [0, 0.65, 1], [0, FRAME_COUNT - 1, FRAME_COUNT - 1]);

  useMotionValueEvent(frameIndex, "change", (latest) => {
    const newFrame = Math.round(latest);
    if (newFrame !== currentFrameRef.current) {
      currentFrameRef.current = newFrame;
      requestAnimationFrame(() => drawFrame(newFrame));
    }
  });

  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const frames = imagesRef.current;

    let img: HTMLImageElement | undefined = frames[index];
    if (!img?.complete || img.naturalWidth === 0) {
      img = undefined;

      for (let offset = 1; offset < FRAME_COUNT; offset++) {
        const prev = frames[index - offset];
        if (prev?.complete && prev.naturalWidth > 0) {
          img = prev;
          break;
        }

        const next = frames[index + offset];
        if (next?.complete && next.naturalWidth > 0) {
          img = next;
          break;
        }
      }
    }

    if (!canvas || !ctx || !img) return;

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    ctx.clearRect(0, 0, vw, vh);

    const imgAspect = img.naturalWidth / img.naturalHeight;
    const viewAspect = vw / vh;

    let drawW: number, drawH: number, drawX: number, drawY: number;

    if (imgAspect > viewAspect) {
      drawH = vh;
      drawW = vh * imgAspect;
      drawX = (vw - drawW) / 2;
      drawY = 0;
    } else {
      drawW = vw;
      drawH = vw / imgAspect;
      drawX = 0;
      drawY = (vh - drawH) / 2;
    }

    ctx.drawImage(img, drawX, drawY, drawW, drawH);
  }, []);

  useEffect(() => {
    let isCancelled = false;
    let loaded = 0;
    let hasRevealedHero = false;

    loadedFramesRef.current = Array(FRAME_COUNT).fill(false);
    settledFramesRef.current = Array(FRAME_COUNT).fill(false);

    const images = Array.from({ length: FRAME_COUNT }, () => new Image());
    imagesRef.current = images;

    const revealHero = () => {
      if (hasRevealedHero || isCancelled) return;
      hasRevealedHero = true;
      setIsLoaded(true);
    };

    const markFrameSettled = (index: number, didLoad: boolean) => {
      if (isCancelled || settledFramesRef.current[index]) return;

      settledFramesRef.current[index] = true;
      loadedFramesRef.current[index] = didLoad;
      loaded += 1;
      setLoadedCount(loaded);

      if (index === 0 && didLoad) {
        currentFrameRef.current = 0;
        revealHero();
      }
    };

    const revealTimer = window.setTimeout(() => {
      revealHero();
    }, LOADING_TIMEOUT_MS);

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = images[i];
      img.decoding = "async";
      img.onload = () => markFrameSettled(i, true);
      img.onerror = () => markFrameSettled(i, false);
      img.src = getFramePath(i);

      if (img.complete) {
        markFrameSettled(i, img.naturalWidth > 0);
      }
    }

    return () => {
      isCancelled = true;
      window.clearTimeout(revealTimer);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.scale(dpr, dpr);
      drawFrame(currentFrameRef.current);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [isLoaded, drawFrame]);

  const [scrollProgress, setScrollProgress] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setScrollProgress(v);
  });

  useEffect(() => {
    if (isLoaded) {
      drawFrame(0);
    }
  }, [isLoaded, drawFrame]);

  if (!isLoaded) {
    return <LoadingScreen progress={(loadedCount / FRAME_COUNT) * 100} />;
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[1100svh] md:h-[800vh]"
    >
      <div className="sticky top-0 z-20 h-screen min-h-[100svh] w-full">
        <div className="relative h-full w-full overflow-hidden bg-cream">
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
            style={{ imageRendering: "auto" }}
          />

          {TEXT_SECTIONS.map((section, i) => (
            <TextOverlay
              key={i}
              section={section}
              scrollProgress={scrollProgress}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
