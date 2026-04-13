"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

const LOCATIONS = [
  {
    day: "Monday",
    date: "Apr 14",
    location: "Downtown Business District",
    address: "Corner of Main & 3rd St",
    hours: "7:00 AM — 2:00 PM",
    vibe: "Quick picks for the morning rush",
  },
  {
    day: "Tuesday",
    date: "Apr 15",
    location: "Riverside Park",
    address: "North Entrance, by the Fountain",
    hours: "7:00 AM — 1:00 PM",
    vibe: "Grab a cup and walk the trail",
  },
  {
    day: "Wednesday",
    date: "Apr 16",
    location: "University Campus",
    address: "Central Quad, near Library",
    hours: "7:00 AM — 3:00 PM",
    vibe: "Study fuel for the ambitious",
  },
  {
    day: "Thursday",
    date: "Apr 17",
    location: "Arts District",
    address: "Gallery Row, 5th & Elm",
    hours: "8:00 AM — 2:00 PM",
    vibe: "Where creativity meets caffeine",
  },
  {
    day: "Friday",
    date: "Apr 18",
    location: "Harbor Square",
    address: "Waterfront Promenade",
    hours: "7:00 AM — 2:00 PM",
    vibe: "Fresh breeze, fresh brew",
  },
  {
    day: "Saturday",
    date: "Apr 19",
    location: "Farmers Market",
    address: "Oak Street Market Grounds",
    hours: "7:00 AM — 1:00 PM",
    vibe: "Our original spot — community staple",
  },
  {
    day: "Sunday",
    date: "Apr 20",
    location: "Beachfront Promenade",
    address: "Lifeguard Tower 5",
    hours: "8:00 AM — 12:00 PM",
    vibe: "Slow mornings, warm cups",
  },
];

function getTodayIndex(): number {
  const jsDay = new Date().getDay();
  return jsDay === 0 ? 6 : jsDay - 1;
}

export default function WeeklyLocations() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const todayIndex = getTodayIndex();
  const [activeDay, setActiveDay] = useState(todayIndex);

  const current = LOCATIONS[activeDay];

  return (
    <section id="find-us-today" ref={ref} className="relative py-24 md:py-32 bg-foam overflow-hidden">
      <div className="max-w-6xl mx-auto px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mb-16"
        >
          <span className="font-body text-xs uppercase tracking-[0.3em] text-amber">
            This Week
          </span>
          <h2 className="font-display text-4xl md:text-6xl text-espresso tracking-tight mt-4 leading-tight">
            Find Us Today
          </h2>
          <p className="font-body text-base text-walnut/60 mt-4 max-w-lg leading-relaxed">
            We roll to a new spot every day. Here&apos;s where we&apos;ll be this week — 
            come say hello.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="lg:col-span-4"
          >
            <div className="space-y-1">
              {LOCATIONS.map((loc, i) => (
                <button
                  key={i}
                  onClick={() => setActiveDay(i)}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 group ${
                    activeDay === i
                      ? "bg-espresso text-cream"
                      : "hover:bg-latte/30 text-walnut/70"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span
                        className={`font-body text-xs font-bold uppercase tracking-wider w-10 ${
                          activeDay === i ? "text-amber" : "text-walnut/40"
                        }`}
                      >
                        {loc.day.slice(0, 3)}
                      </span>
                      <span className="font-body text-sm">
                        {loc.location}
                      </span>
                    </div>
                    {i === todayIndex && (
                      <span
                        className={`text-[10px] font-body uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          activeDay === i
                            ? "bg-amber/20 text-amber"
                            : "bg-amber/10 text-amber"
                        }`}
                      >
                        Today
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="lg:col-span-8"
          >
            <div className="relative bg-cream rounded-2xl p-8 md:p-12 min-h-[320px] border border-latte/20 overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-amber/5 rounded-full blur-[80px]" />
              
              <div className="relative">
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <p className="font-body text-xs uppercase tracking-[0.3em] text-amber">
                      {current.day} — {current.date}
                    </p>
                    <h3 className="font-display text-3xl md:text-4xl text-espresso tracking-tight mt-2">
                      {current.location}
                    </h3>
                  </div>
                  <div className="hidden md:flex items-center gap-2 bg-espresso/5 px-4 py-2 rounded-full">
                    <div className="w-2 h-2 rounded-full bg-green-600 animate-pulse" />
                    <span className="font-body text-xs text-espresso/60">
                      {activeDay === todayIndex ? "Open Now" : "Scheduled"}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <p className="font-body text-xs uppercase tracking-[0.2em] text-walnut/40 mb-2">
                      Address
                    </p>
                    <p className="font-body text-base text-espresso/80">
                      {current.address}
                    </p>
                  </div>
                  <div>
                    <p className="font-body text-xs uppercase tracking-[0.2em] text-walnut/40 mb-2">
                      Hours
                    </p>
                    <p className="font-body text-base text-espresso/80">
                      {current.hours}
                    </p>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-latte/20">
                  <p className="font-body text-sm text-walnut/50 italic">
                    &ldquo;{current.vibe}&rdquo;
                  </p>
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(current.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-espresso text-cream font-body text-sm uppercase tracking-[0.15em] rounded-full hover:bg-walnut transition-colors duration-300"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    Get Directions
                  </a>
                  <a
                    href="#"
                    className="inline-flex items-center gap-2 px-6 py-3 border border-espresso/20 text-espresso font-body text-sm uppercase tracking-[0.15em] rounded-full hover:bg-espresso/5 transition-colors duration-300"
                  >
                    Set Reminder
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
