"use client";

import { motion, useInView } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

import { useCanHover } from "@/lib/useCanHover";
import { useHasWebGL } from "@/lib/useHasWebGL";

import {
  type Coords,
  LOCATIONS,
  directionsUrl,
  distanceMiles,
  formatMiles,
  mapEmbedUrl,
  mapViewUrl,
  nearestStopIndex,
} from "@/lib/locations";

/** Monday-first index (0 = Monday … 6 = Sunday) for a given date. */
function getDayIndex(now: Date): number {
  const jsDay = now.getDay();
  return jsDay === 0 ? 6 : jsDay - 1;
}

/** "Apr 14"-style labels for Monday…Sunday of the week containing `now`. */
function getWeekDates(now: Date): string[] {
  const monday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - getDayIndex(now)
  );

  return LOCATIONS.map((_, i) => {
    const date = new Date(
      monday.getFullYear(),
      monday.getMonth(),
      monday.getDate() + i
    );
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  });
}

function getLocationStatus(activeDay: number, todayIndex: number | null) {
  if (todayIndex === null) {
    return null;
  }

  if (activeDay === todayIndex) {
    return {
      label: "Open Now",
      dotClassName: "bg-green-600",
    };
  }

  if (activeDay < todayIndex) {
    return {
      label: "Closed",
      dotClassName: "bg-red-500",
    };
  }

  return {
    label: "Coming",
    dotClassName: "bg-amber",
  };
}

export default function WeeklyLocations() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // The clock is read on the client only: reading it during render would make SSR
  // (server timezone) and hydration (visitor timezone) disagree across midnight.
  const [todayIndex, setTodayIndex] = useState<number | null>(null);
  const [weekDates, setWeekDates] = useState<string[] | null>(null);
  const [activeDay, setActiveDay] = useState(0);
  const hasPicked = useRef(false);

  // Location is requested on a button press only — never on load or on scroll.
  const [userPos, setUserPos] = useState<Coords | null>(null);
  const [geoStatus, setGeoStatus] = useState<
    "idle" | "locating" | "denied" | "unsupported" | "failed"
  >("idle");

  // On a touch screen the embedded map swallows vertical drags, so the page
  // stops scrolling whenever a thumb lands on it. Shield it until it is asked
  // for; pointer devices scroll with the wheel and never need this.
  const canHover = useCanHover();
  const [mapActive, setMapActive] = useState(false);

  // The OSM embed needs WebGL and renders its own error panel without it.
  // `null` is "still probing" — keep the embed until we know otherwise.
  const hasWebGL = useHasWebGL();

  const locateMe = useCallback(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setGeoStatus("unsupported");
      return;
    }
    setGeoStatus("locating");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserPos({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGeoStatus("idle");
      },
      (err) => setGeoStatus(err.code === err.PERMISSION_DENIED ? "denied" : "failed"),
      { enableHighAccuracy: false, timeout: 10_000, maximumAge: 300_000 }
    );
  }, []);

  useEffect(() => {
    const now = new Date();
    setTodayIndex(getDayIndex(now));
    setWeekDates(getWeekDates(now));
    if (!hasPicked.current) {
      setActiveDay(getDayIndex(now));
    }
  }, []);

  const selectDay = (i: number) => {
    hasPicked.current = true;
    setActiveDay(i);
    setMapActive(false);
  };

  const current = LOCATIONS[activeDay];
  const currentStatus = getLocationStatus(activeDay, todayIndex);
  const nearest = userPos ? nearestStopIndex(userPos) : null;

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
                  onClick={() => selectDay(i)}
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
                      {current.day}
                      {weekDates ? ` — ${weekDates[activeDay]}` : ""}
                    </p>
                    <h3 className="font-display text-3xl md:text-4xl text-espresso tracking-tight mt-2">
                      {current.location}
                    </h3>
                  </div>
                  {currentStatus && (
                    <div className="hidden md:flex items-center gap-2 bg-espresso/5 px-4 py-2 rounded-full">
                      <div
                        className={`w-2 h-2 rounded-full ${currentStatus.dotClassName} ${
                          activeDay === todayIndex ? "animate-pulse" : ""
                        }`}
                      />
                      <span className="font-body text-xs text-espresso/60">
                        {currentStatus.label}
                      </span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <p className="font-body text-xs uppercase tracking-[0.2em] text-walnut/40 mb-2">
                      Address
                    </p>
                    <p className="font-body text-base text-espresso/80">
                      {current.address}
                    </p>
                    <p className="font-body text-sm text-walnut/50 mt-0.5">{current.city}</p>
                    {userPos && (
                      <p className="font-body text-xs uppercase tracking-[0.15em] text-amber mt-2">
                        {formatMiles(distanceMiles(userPos, current))} away
                      </p>
                    )}
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

                <div className="mt-8">
                  <div className="relative rounded-xl overflow-hidden border border-latte/30 bg-latte/10">
                    {hasWebGL === false ? (
                      // No WebGL: show the stop ourselves rather than let the
                      // embed paint its own error panel inside the card.
                      <a
                        href={mapViewUrl(current)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-[220px] md:h-[280px] flex-col items-center justify-center gap-2 px-6 text-center bg-latte/20 hover:bg-latte/30 transition-colors duration-300"
                      >
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-amber">
                          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        <span className="font-body text-base text-espresso/80">
                          {current.location}
                        </span>
                        <span className="font-body text-sm text-walnut/50 max-w-xs">
                          This browser can&apos;t draw the map — open it on
                          OpenStreetMap &#8599;
                        </span>
                      </a>
                    ) : (
                      <>
                        {/* Keyed on the stop so switching days reloads the embed. */}
                        <iframe
                          key={`${current.lat},${current.lng}`}
                          title={`Map showing ${current.location}, ${current.city}`}
                          src={mapEmbedUrl(current)}
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                          className="block w-full h-[220px] md:h-[280px]"
                        />
                        {!canHover && !mapActive && (
                          <button
                            type="button"
                            onClick={() => setMapActive(true)}
                            className="absolute inset-0 flex items-start justify-center pt-4 bg-espresso/5"
                          >
                            <span className="font-body text-[11px] uppercase tracking-[0.15em] text-espresso/70 bg-cream/95 px-4 py-2 rounded-full shadow-sm">
                              Tap to move the map
                            </span>
                          </button>
                        )}
                      </>
                    )}
                  </div>
                  <a
                    href={mapViewUrl(current)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center min-h-[44px] mt-1 font-body text-xs text-walnut/45 hover:text-amber transition-colors duration-300"
                  >
                    Open in a larger map &#8599;
                  </a>
                </div>

                <div className="mt-8 pt-8 border-t border-latte/20">
                  <p className="font-body text-sm text-walnut/50 italic">
                    &ldquo;{current.vibe}&rdquo;
                  </p>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <a
                    href={directionsUrl(current, userPos)}
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

                  <button
                    type="button"
                    onClick={locateMe}
                    disabled={geoStatus === "locating"}
                    className="inline-flex items-center gap-2 px-6 py-3 border border-espresso/15 text-espresso/70 font-body text-sm uppercase tracking-[0.15em] rounded-full hover:border-espresso/40 hover:text-espresso transition-colors duration-300 disabled:opacity-50"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="7" />
                      <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
                    </svg>
                    {geoStatus === "locating"
                      ? "Locating…"
                      : userPos
                        ? "Update my location"
                        : "How far am I?"}
                  </button>
                </div>

                {userPos && nearest !== null && nearest !== activeDay && (
                  <button
                    type="button"
                    onClick={() => selectDay(nearest)}
                    className="mt-4 inline-flex flex-wrap items-center gap-x-2 gap-y-1 text-left font-body text-sm text-walnut/60 hover:text-espresso transition-colors duration-300"
                  >
                    <span className="text-amber uppercase tracking-[0.15em] text-xs">
                      Closest to you
                    </span>
                    <span>
                      {LOCATIONS[nearest].day} — {LOCATIONS[nearest].location},{" "}
                      {LOCATIONS[nearest].city}
                    </span>
                    <span className="text-walnut/40">
                      ({formatMiles(distanceMiles(userPos, LOCATIONS[nearest]))})
                    </span>
                  </button>
                )}

                {geoStatus !== "idle" && geoStatus !== "locating" && (
                  <p className="mt-4 font-body text-xs text-walnut/45 max-w-md leading-relaxed">
                    {geoStatus === "denied"
                      ? "No problem — location stayed off. Get Directions still routes from where you are once Google Maps opens."
                      : geoStatus === "unsupported"
                        ? "This browser doesn't offer location. Get Directions still works."
                        : "Couldn't get a fix on your location. Get Directions still works."}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
