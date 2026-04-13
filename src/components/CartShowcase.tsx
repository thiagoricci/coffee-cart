"use client";

import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function CartShowcase() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-24 md:py-32 bg-espresso overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber rounded-full blur-[128px]" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-latte rounded-full blur-[96px]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mb-16"
        >
          <span className="font-body text-xs uppercase tracking-[0.3em] text-amber">
            The Cart
          </span>
          <h2 className="font-display text-4xl md:text-6xl text-cream/90 tracking-tight mt-4 leading-tight">
            Our Rolling<br />Coffee House
          </h2>
          <p className="font-body text-base text-cream/50 mt-6 max-w-lg leading-relaxed">
            What started as a dream on wheels has become your neighborhood&apos;s 
            favorite morning ritual. We bring the craft to you — one cup, one street, 
            one community at a time.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative aspect-[16/9] md:aspect-[16/9] rounded-2xl overflow-hidden group"
        >
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 -top-[20%] h-[120%]">
              <Image
                src="/coffee-cart.JPG"
                alt="Our coffee cart"
                fill
                className="object-cover object-bottom"
                priority
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-espresso/60 via-espresso/20 to-transparent" />
          </div>
          <div className="absolute inset-0 border border-cream/5 rounded-2xl pointer-events-none" />
          <div className="absolute inset-0 bg-cream/0 group-hover:bg-cream/[0.02] transition-colors duration-700" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16"
        >
          {[
            { number: "500+", label: "Cups Weekly" },
            { number: "7", label: "Locations" },
            { number: "100%", label: "Arabica Beans" },
            { number: "5am", label: "Fresh Roast Daily" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <p className="font-display text-3xl md:text-4xl text-amber tracking-tight">
                {stat.number}
              </p>
              <p className="font-body text-xs uppercase tracking-[0.2em] text-cream/40 mt-2">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
