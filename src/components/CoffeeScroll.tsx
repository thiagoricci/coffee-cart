"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";

const FRAME_COUNT = 40;

// Frames that must decode before the hero is allowed to paint. The rest stream in
// afterwards; drawFrame() falls back to the nearest loaded neighbour until they land.
const PRIORITY_FRAME_COUNT = 5;

// Safety net only — with the priority batch above, this should not fire in practice.
const LOADING_TIMEOUT_MS = 2000;

// Scroll progress at which the strip reaches its final frame. The remaining
// 1 - FRAME_CURVE_END is a deliberate hold on the closing CTA; it used to be 0.65,
// which left ~3.6 screens of frozen frame on mobile before the hero let go.
// TEXT_SECTIONS below are expressed in the same progress space, so a frame is at
// progress * (FRAME_COUNT - 1) / FRAME_CURVE_END — change this and the text beats
// slide off the frames they were composed against.
const FRAME_CURVE_END = 0.9;

// Two encodings of the same 40 frames. The portrait set is a centre *crop* of the
// full frame, not a downscale: drawFrame cover-fits to viewport height, so a phone
// in portrait only ever sees the middle ~26-32% of a 16:9 frame. Cropping to that
// slice renders pixel-for-pixel identically while saving ~26% of the bytes —
// whereas downscaling would soften the view that is already upscaled hardest
// (3.55x on an iPhone 14 Pro, against 1.5x on a 1080p desktop).
const FRAME_SETS = {
  full: { dir: "coffee-frames", aspect: 1280 / 720 },
  portrait: { dir: "coffee-frames-portrait", aspect: 544 / 720 },
} as const;

type FrameSet = keyof typeof FRAME_SETS;

// The crop only holds while the viewport is narrower than the cropped frame; past
// that, cover-fit starts cropping vertically and reframes the shot. 544/720 clears
// every common phone and small tablet in portrait, including the squarest cases
// with the URL bar showing (iPhone SE 0.678, iPad 0.745) — so the set does not
// flip when the mobile toolbar collapses, only on a real rotation.
function pickFrameSet(): FrameSet {
  return window.innerWidth / window.innerHeight <= FRAME_SETS.portrait.aspect
    ? "portrait"
    : "full";
}

function getFramePath(set: FrameSet, index: number): string {
  return `/${FRAME_SETS[set].dir}/frame-${String(index + 1).padStart(3, "0")}.webp`;
}

function LoadingScreen({ progress }: { progress: number }) {
  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-cream">
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
    startFadeOut: 0.0969,
    endFadeOut: 0.1385,
    position: "center",
    content: (
      <div className="text-center">
        <h1 className="font-display text-6xl md:text-8xl lg:text-9xl text-cream tracking-tight leading-none">
          Brew & Go
        </h1>
        <p className="font-body text-lg md:text-xl text-cream mt-6 tracking-wide">
          Craft in Every Cup
        </p>
        <div className="mt-8 flex items-center justify-center gap-2 text-cream">
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
    startFadeIn: 0.1662,
    startHold: 0.2354,
    startFadeOut: 0.2631,
    endFadeOut: 0.3046,
    position: "top-right" as const,
    content: (
      <div className="text-right max-w-md ml-auto">
        <span className="font-body text-xs uppercase tracking-[0.3em] text-amber-light">
          01 — The Beans
        </span>
        <h2 className="font-display text-4xl md:text-6xl text-cream tracking-tight mt-4 leading-tight">
          Freshly Roasted Beans
        </h2>
        <p className="font-body text-base text-cream mt-4 leading-relaxed">
          Sourced from highland farms, each bean is roasted to unlock its deepest character.
        </p>
      </div>
    ),
  },
  {
    startFadeIn: 0.3323,
    startHold: 0.4015,
    startFadeOut: 0.4292,
    endFadeOut: 0.4708,
    position: "left",
    content: (
      <div className="text-left max-w-md">
        <span className="font-body text-xs uppercase tracking-[0.3em] text-amber-light">
          02 — Grounded
        </span>
        <h2 className="font-display text-4xl md:text-6xl text-cream tracking-tight mt-4 leading-tight">
          Rooted in Tradition
        </h2>
        <p className="font-body text-base text-cream mt-4 leading-relaxed">
          From soil to sip, we honor the origins of every harvest and the hands that nurture it.
        </p>
      </div>
    ),
  },
  {
    startFadeIn: 0.4985,
    startHold: 0.5677,
    startFadeOut: 0.5954,
    endFadeOut: 0.6369,
    position: "top-right" as const,
    content: (
      <div className="text-right max-w-md ml-auto">
        <span className="font-body text-xs uppercase tracking-[0.3em] text-amber-light">
          03 — The Process
        </span>
        <h2 className="font-display text-4xl md:text-6xl text-cream tracking-tight mt-4 leading-tight">
          Handcrafted with Care
        </h2>
        <p className="font-body text-base text-cream mt-4 leading-relaxed">
          Every pour is intentional. Every cup, a small act of devotion to the craft.
        </p>
      </div>
    ),
  },
  {
    startFadeIn: 0.6508,
    startHold: 0.7338,
    startFadeOut: 0.94,
    endFadeOut: 1.0,
    position: "center" as const,
    content: (
      <div className="text-center">
        <h2 className="font-display text-4xl md:text-6xl text-cream tracking-tight mt-4 leading-tight font-bold">
          Taste the Difference
        </h2>
        <motion.a
          href="#find-us-today"
          onClick={(e) => {
            // Scroll there without leaving the hash behind. The href stays for
            // middle-click and copy-link, but a plain tap must not rewrite the
            // URL: whatever the visitor keeps afterwards — bookmark, history
            // suggestion, shared link — would then reopen on Find Us Today and
            // skip the hero. `scroll-behavior: smooth` on html keeps the glide.
            e.preventDefault();
            document.getElementById("find-us-today")?.scrollIntoView();
          }}
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
      {/*
        Contrast comes from shadowing the letterforms, not from darkening the frame.
        Every area-based approach was rejected on looks: a full-frame scrim flattened
        the hero, and a radial pool behind each block showed as a brown cloud over the
        opening frame. This leaves the frames untouched at full brightness. The tight
        0/0/3px pass haloes small glyphs on all sides; the wide one lifts them off
        busy frames. Note it buys no *measured* contrast — see plan.md 3.1.
      */}
      <div className="pointer-events-auto relative [filter:drop-shadow(0_0_3px_rgba(44,24,16,0.92))_drop-shadow(0_2px_10px_rgba(44,24,16,0.8))]">
        {section.content}
      </div>
    </div>
  );
}

export default function CoffeeScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [loadedCount, setLoadedCount] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const currentFrameRef = useRef(0);
  const [frameSet, setFrameSet] = useState<FrameSet>(() =>
    typeof window === "undefined" ? "full" : pickFrameSet()
  );

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const frameIndex = useTransform(
    scrollYProgress,
    [0, FRAME_CURVE_END, 1],
    [0, FRAME_COUNT - 1, FRAME_COUNT - 1]
  );

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
    let loadedTotal = 0;
    let prioritySettled = 0;
    let hasRevealedHero = false;
    let hasStartedRemaining = false;

    const settled = Array(FRAME_COUNT).fill(false);
    const images = Array.from({ length: FRAME_COUNT }, () => new Image());

    // On the first load the canvas has nothing to show, so publish the new images
    // straight away and let drawFrame's nearest-neighbour fallback fill the gaps.
    // On a frame-set swap the old images stay on imagesRef until the new set's
    // priority batch is in, so a rotation never blanks the canvas.
    const isInitialLoad = imagesRef.current.length === 0;
    const publishImages = () => {
      imagesRef.current = images;
      drawFrame(currentFrameRef.current);
    };
    if (isInitialLoad) imagesRef.current = images;

    const revealHero = () => {
      if (hasRevealedHero || isCancelled) return;
      hasRevealedHero = true;
      setIsLoaded(true);
    };

    function markFrameSettled(index: number, didLoad: boolean) {
      if (isCancelled || settled[index]) return;

      settled[index] = true;

      // Only successful decodes count — a broken strip must never report 100%.
      if (didLoad) {
        loadedTotal += 1;
        setLoadedCount(loadedTotal);
      }

      if (index === 0 && didLoad) {
        currentFrameRef.current = 0;
      }

      if (index < PRIORITY_FRAME_COUNT) {
        prioritySettled += 1;
        if (prioritySettled >= PRIORITY_FRAME_COUNT) {
          if (!isInitialLoad) publishImages();
          revealHero();
          startRemainingFrames();
        }
      }
    }

    const loadFrame = (index: number) => {
      const img = images[index];
      img.decoding = "async";
      img.onload = () => markFrameSettled(index, true);
      img.onerror = () => markFrameSettled(index, false);
      img.src = getFramePath(frameSet, index);

      // A cached frame can already be complete before the handlers attach.
      if (img.complete) {
        markFrameSettled(index, img.naturalWidth > 0);
      }
    };

    function startRemainingFrames() {
      if (hasStartedRemaining || isCancelled) return;
      hasStartedRemaining = true;
      for (let i = PRIORITY_FRAME_COUNT; i < FRAME_COUNT; i++) {
        loadFrame(i);
      }
    }

    const revealTimer = window.setTimeout(() => {
      if (!isInitialLoad) publishImages();
      revealHero();
      startRemainingFrames();
    }, LOADING_TIMEOUT_MS);

    for (let i = 0; i < PRIORITY_FRAME_COUNT; i++) {
      loadFrame(i);
    }

    return () => {
      isCancelled = true;
      window.clearTimeout(revealTimer);
    };
  }, [frameSet, drawFrame]);

  // Rotation is the only thing that should change the set — pickFrameSet has enough
  // margin that a collapsing mobile URL bar does not cross the threshold.
  useEffect(() => {
    const syncFrameSet = () => setFrameSet(pickFrameSet());
    syncFrameSet();
    window.addEventListener("resize", syncFrameSet);
    return () => window.removeEventListener("resize", syncFrameSet);
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

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[820svh] md:h-[600vh]"
    >
      <div className="sticky top-0 z-20 h-screen min-h-[100svh] w-full">
        {!isLoaded && (
          <LoadingScreen
            progress={Math.min(100, (loadedCount / PRIORITY_FRAME_COUNT) * 100)}
          />
        )}

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
