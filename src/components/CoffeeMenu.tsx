"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import { useCanHover } from "@/lib/useCanHover";

type Category = "Hot" | "Iced" | "Specialty";

interface Pour {
  label: string;
  percent: number;
  color: string;
}

interface MenuItem {
  name: string;
  description: string;
  price: string;
  category: Category;
  tag?: string;
  /** Vessel the drink is built in — drives the glass drawing. */
  vessel: "cup" | "glass";
  served: "hot" | "iced";
  /** Overrides the served/volume caption where neither word fits. */
  serveNote?: string;
  volume: string;
  /** 1–5, espresso intensity in the finished cup. */
  strength: number;
  detail: string;
  /** Top of the drink first; percentages sum to 100. */
  build: Pour[];
}

// Pour colours for the build diagram. Deliberately not palette tokens — these
// stand in for the liquids themselves and read against the cream inset panel.
const POUR = {
  crema: "#B07D3C",
  espresso: "#2C1810",
  coldBrew: "#3A2214",
  cocoa: "#4A2C1A",
  water: "#E3DBCB",
  milk: "#F2E7D4",
  foam: "#FBF7F1",
  gelato: "#F6EBD2",
  ice: "#E2E9EC",
  matcha: "#7E9150",
};

const MENU_ITEMS: MenuItem[] = [
  {
    name: "Espresso",
    description: "Dark chocolate, caramel finish",
    price: "$3.50",
    category: "Hot",
    vessel: "cup",
    served: "hot",
    volume: "1.5 oz",
    strength: 5,
    detail:
      "A single 18g basket pulled to a 36g yield in 27 seconds — the whole drink is coffee and the crema it carries. Nothing to hide behind, which is why we cut every other recipe from this shot first.",
    build: [
      { label: "Crema", percent: 15, color: POUR.crema },
      { label: "Espresso", percent: 85, color: POUR.espresso },
    ],
  },
  {
    name: "Americano",
    description: "Smooth, bold, clean",
    price: "$4.00",
    category: "Hot",
    vessel: "cup",
    served: "hot",
    volume: "6 oz",
    strength: 3,
    detail:
      "Espresso lengthened with hot water at roughly one part coffee to two parts water. The dilution opens up the caramel notes that sit compressed inside a straight shot, without touching the body.",
    build: [
      { label: "Crema", percent: 8, color: POUR.crema },
      { label: "Hot water", percent: 60, color: POUR.water },
      { label: "Espresso", percent: 32, color: POUR.espresso },
    ],
  },
  {
    name: "Cortado",
    description: "Balanced milk, robust espresso",
    price: "$4.50",
    category: "Hot",
    vessel: "glass",
    served: "hot",
    volume: "4 oz",
    strength: 4,
    detail:
      "Equal parts espresso and steamed milk, poured flat into glass so you can see the split. The milk is warmed to 55 °C rather than scalded — just enough to round the acidity and stop short of sweetness.",
    build: [
      { label: "Steamed milk", percent: 50, color: POUR.milk },
      { label: "Espresso", percent: 50, color: POUR.espresso },
    ],
  },
  {
    name: "Flat White",
    description: "Velvety microfoam, strong espresso",
    price: "$5.25",
    category: "Hot",
    vessel: "cup",
    served: "hot",
    volume: "6 oz",
    strength: 4,
    detail:
      "A double ristretto under steamed milk stretched to a glossy paint, with barely a finger of microfoam on top. Less milk than a latte and far less foam than a cappuccino, so the coffee stays in the foreground.",
    build: [
      { label: "Microfoam", percent: 10, color: POUR.foam },
      { label: "Steamed milk", percent: 55, color: POUR.milk },
      { label: "Espresso", percent: 35, color: POUR.espresso },
    ],
  },
  {
    name: "Cappuccino",
    description: "Rich espresso, frothy milk",
    price: "$5.50",
    category: "Hot",
    vessel: "cup",
    served: "hot",
    volume: "6 oz",
    strength: 3,
    detail:
      "The classic thirds: one espresso, one steamed milk, one cap of dry foam. That foam is insulation as much as texture — it keeps the cup hot to the last mouthful and makes the first one taste lighter than it is.",
    build: [
      { label: "Foam", percent: 34, color: POUR.foam },
      { label: "Steamed milk", percent: 33, color: POUR.milk },
      { label: "Espresso", percent: 33, color: POUR.espresso },
    ],
  },
  {
    name: "Latte",
    description: "Smooth, creamy, vanilla notes",
    price: "$5.60",
    category: "Hot",
    vessel: "cup",
    served: "hot",
    volume: "8 oz",
    strength: 2,
    detail:
      "The mildest build on the board — a double shot carrying three and a half times its volume in steamed milk. Milk sugars take over, which is why the vanilla and biscuit notes read so clearly here.",
    build: [
      { label: "Foam", percent: 10, color: POUR.foam },
      { label: "Steamed milk", percent: 70, color: POUR.milk },
      { label: "Espresso", percent: 20, color: POUR.espresso },
    ],
  },
  {
    name: "Mocha",
    description: "Espresso, cocoa, steamed milk",
    price: "$6.00",
    category: "Hot",
    tag: "Popular",
    vessel: "cup",
    served: "hot",
    volume: "8 oz",
    strength: 3,
    detail:
      "70% single-origin cocoa melted into the shot before any milk goes near it, so it emulsifies instead of settling. Built stronger than a latte on purpose — the chocolate would otherwise flatten the coffee entirely.",
    build: [
      { label: "Foam", percent: 10, color: POUR.foam },
      { label: "Steamed milk", percent: 50, color: POUR.milk },
      { label: "Dark cocoa", percent: 15, color: POUR.cocoa },
      { label: "Espresso", percent: 25, color: POUR.espresso },
    ],
  },
  {
    name: "Affogato",
    description: "Espresso poured over vanilla gelato",
    price: "$6.50",
    category: "Specialty",
    tag: "Signature",
    vessel: "glass",
    served: "hot",
    serveNote: "Hot over cold",
    volume: "5 oz",
    strength: 4,
    detail:
      "Two scoops of vanilla bean gelato, a double shot poured over the top at the counter. Drink it in the next ninety seconds: the whole point is the moment the hot shot and the cold cream meet and neither has won yet.",
    build: [
      { label: "Vanilla gelato", percent: 60, color: POUR.gelato },
      { label: "Double espresso", percent: 40, color: POUR.espresso },
    ],
  },
  {
    name: "Cold Brew",
    description: "24-hour steep, smooth & crisp",
    price: "$5.00",
    category: "Iced",
    vessel: "glass",
    served: "iced",
    volume: "12 oz",
    strength: 4,
    detail:
      "Coarse grounds steeped in cold water for 24 hours, then cut back to drinking strength over ice. No heat means no bitter extraction — you get the sweetness and almost none of the edge.",
    build: [
      { label: "Ice", percent: 30, color: POUR.ice },
      { label: "Water", percent: 15, color: POUR.water },
      { label: "Cold brew", percent: 55, color: POUR.coldBrew },
    ],
  },
  {
    name: "Iced Matcha Latte",
    description: "Ceremonial grade, oat milk",
    price: "$5.75",
    category: "Iced",
    vessel: "glass",
    served: "iced",
    volume: "12 oz",
    strength: 1,
    detail:
      "Ceremonial grade matcha whisked with a little warm water, then poured over iced oat milk so it lands in ribbons. The only drink here with no coffee in it at all — stir before the first sip.",
    build: [
      { label: "Matcha", percent: 20, color: POUR.matcha },
      { label: "Ice", percent: 25, color: POUR.ice },
      { label: "Oat milk", percent: 55, color: POUR.milk },
    ],
  },
];

const CATEGORIES = ["All", "Hot", "Iced", "Specialty"] as const;

const MARQUEE_ITEMS = [
  "ESPRESSO",
  "AMERICANO",
  "CORTADO",
  "FLAT WHITE",
  "CAPPUCCINO",
  "LATTE",
  "MOCHA",
  "AFFOGATO",
  "COLD BREW",
  "MATCHA LATTE",
];

// Interior of each vessel in the 100×112 viewBox: the region the liquid fills.
// `path` clips the pours; `top`/`bottom` give the span to divide between them.
const VESSELS = {
  cup: {
    path: "M20,22 L80,22 L70,78 Q68,86 60,86 L40,86 Q32,86 30,78 Z",
    top: 22,
    bottom: 86,
  },
  glass: {
    path: "M31,14 L69,14 L65,94 Q64,99 59,99 L41,99 Q36,99 35,94 Z",
    top: 14,
    bottom: 99,
  },
};

function DrinkGlass({ item }: { item: MenuItem }) {
  const vessel = VESSELS[item.vessel];
  const span = vessel.bottom - vessel.top;
  const clipId = `pour-${item.name.replace(/\s+/g, "-").toLowerCase()}`;

  let cursor = vessel.top;
  const pours = item.build.map((pour) => {
    const y = cursor;
    const height = (pour.percent / 100) * span;
    cursor += height;
    return { ...pour, y, height };
  });

  return (
    /* Negative top on the viewBox leaves headroom for steam above the rim. */
    <svg viewBox="0 -10 100 122" className="w-full h-full" role="presentation">
      <defs>
        <clipPath id={clipId}>
          <path d={vessel.path} />
        </clipPath>
      </defs>

      {item.served === "hot" && (
        <g stroke="#5C4033" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.35">
          {[38, 50, 62].map((x, i) => {
            const base = vessel.top - 4;
            return (
              <path
                key={x}
                d={`M${x},${base} C${x - 3},${base - 5} ${x + 3},${base - 8} ${x},${base - 13}`}
                className="animate-steam"
                style={{ animationDelay: `${i * 0.45}s`, transformOrigin: `${x}px ${base}px` }}
              />
            );
          })}
        </g>
      )}

      <g clipPath={`url(#${clipId})`}>
        {pours.map((pour) => (
          <rect key={pour.label} x="0" width="100" y={pour.y} height={pour.height + 0.4} fill={pour.color} />
        ))}
        {/* Hairline at each boundary — microfoam on steamed milk is otherwise
            two near-identical creams with an invisible seam. */}
        {pours.slice(1).map((pour) => (
          <line
            key={`${pour.label}-rule`}
            x1="0"
            x2="100"
            y1={pour.y}
            y2={pour.y}
            stroke="#2C1810"
            strokeWidth="0.75"
            opacity="0.18"
          />
        ))}
      </g>

      {/* Vessel outline drawn over the pours so the rim stays crisp. */}
      <path d={vessel.path} fill="none" stroke="#2C1810" strokeWidth="2.5" strokeLinejoin="round" />

      {item.vessel === "cup" ? (
        <>
          <path
            d="M80,32 C92,32 94,50 80,54"
            fill="none"
            stroke="#2C1810"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path d="M22,94 L78,94" stroke="#2C1810" strokeWidth="2.5" strokeLinecap="round" />
        </>
      ) : null}
    </svg>
  );
}

function StrengthMeter({ value }: { value: number }) {
  return (
    <span className="flex items-center gap-1" aria-label={`Strength ${value} of 5`}>
      {[1, 2, 3, 4, 5].map((step) => (
        <span
          key={step}
          className={`h-1.5 w-1.5 rounded-full ${step <= value ? "bg-amber-light" : "bg-cream/20"}`}
        />
      ))}
    </span>
  );
}

function MenuCard({ item, isOpen, onToggle, onHover }: {
  item: MenuItem;
  isOpen: boolean;
  onToggle: () => void;
  onHover: (hovering: boolean) => void;
}) {
  return (
    <motion.div
      layout
      transition={{ layout: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] } }}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      className={`relative overflow-hidden rounded-2xl transition-colors duration-500 ${
        isOpen
          ? "bg-espresso text-cream"
          : "bg-foam border border-latte/20 hover:border-latte/40"
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full text-left p-6 md:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3
                className={`font-display text-2xl tracking-tight transition-colors duration-500 ${
                  isOpen ? "text-cream" : "text-espresso"
                }`}
              >
                {item.name}
              </h3>
              {item.tag && (
                <span
                  className={`text-[10px] font-body uppercase tracking-wider px-2 py-0.5 rounded-full transition-colors duration-500 ${
                    isOpen ? "bg-amber-light/15 text-amber-light" : "bg-amber/10 text-amber"
                  }`}
                >
                  {item.tag}
                </span>
              )}
            </div>
            <p
              className={`font-body text-sm transition-colors duration-500 ${
                isOpen ? "text-cream/50" : "text-walnut/50"
              }`}
            >
              {item.description}
            </p>
          </div>

          <div className="flex flex-col items-end gap-2 shrink-0">
            <span
              className={`font-display text-xl tracking-tight transition-colors duration-500 ${
                isOpen ? "text-amber-light" : "text-espresso/80"
              }`}
            >
              {item.price}
            </span>
            <span
              className={`font-body text-[10px] uppercase tracking-[0.15em] transition-colors duration-500 ${
                isOpen ? "text-cream/40" : "text-walnut/35"
              }`}
            >
              {isOpen ? "Close" : "The build"}
            </span>
          </div>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="detail"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="overflow-hidden"
          >
            <div className="px-6 md:px-8 pb-8 pt-2">
              <div className="h-px bg-gradient-to-r from-transparent via-amber-light/25 to-transparent mb-8" />

              <div className="grid gap-7 sm:grid-cols-[9rem,minmax(0,1fr)] sm:gap-8">
                <div className="flex flex-col items-center">
                  <div className="w-32 h-40 rounded-xl bg-cream/95 p-3">
                    <DrinkGlass item={item} />
                  </div>
                  <span className="font-body text-[10px] uppercase tracking-[0.15em] text-cream/35 mt-3 text-center">
                    {item.serveNote ?? (item.served === "hot" ? "Served hot" : "Over ice")} ·{" "}
                    {item.volume}
                  </span>
                  <div className="flex items-center gap-2 mt-4">
                    <span className="font-body text-[10px] uppercase tracking-[0.15em] text-cream/35">
                      Strength
                    </span>
                    <StrengthMeter value={item.strength} />
                  </div>
                </div>

                <div>
                  <p className="font-body text-sm leading-relaxed text-cream/70">{item.detail}</p>

                  <span className="block mt-6 font-body text-[10px] uppercase tracking-[0.2em] text-amber-light">
                    The pour
                  </span>
                  <ul className="mt-4 space-y-3">
                    {item.build.map((pour) => (
                      <li key={pour.label} className="flex items-center gap-3">
                        {/* A chip, not a dot — a dark dot on this dark card reads
                            as an unselected radio, and the bar echoes the stack. */}
                        <span
                          className="h-4 w-2.5 rounded-[2px] ring-1 ring-cream/30 shrink-0"
                          style={{ backgroundColor: pour.color }}
                        />
                        <span className="font-body text-sm text-cream/60 whitespace-nowrap">
                          {pour.label}
                        </span>
                        <span className="flex-1 h-px bg-cream/10" />
                        <span className="font-display text-sm text-cream/90 tabular-nums">
                          {pour.percent}%
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className={`absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent transition-opacity duration-500 ${
          isOpen ? "via-amber-light/20 to-transparent" : "via-latte/40 to-transparent"
        }`}
      />
    </motion.div>
  );
}

export default function CoffeeMenu() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);
  const canHover = useCanHover();
  const [activeCategory, setActiveCategory] = useState<(typeof CATEGORIES)[number]>("All");

  const filteredItems =
    activeCategory === "All"
      ? MENU_ITEMS
      : MENU_ITEMS.filter((item) => item.category === activeCategory);

  // Hover previews the build; a click pins it open so it survives the pointer
  // leaving — and is the only way in on touch, where hover is ignored entirely.
  const isOpen = (name: string) => pinned === name || (canHover && hovered === name);

  return (
    <section className="relative py-24 md:py-32 bg-cream overflow-hidden">
      <div className="relative">
        <div className="overflow-hidden py-4 mb-16 border-y border-latte/20">
          <motion.div
            animate={{ x: [0, -2400] }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="flex whitespace-nowrap"
          >
            {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map(
              (item, i) => (
                <span
                  key={i}
                  className="font-display text-2xl md:text-3xl text-walnut/50 mx-6 tracking-tight"
                >
                  {item}
                </span>
              )
            )}
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8">
        <div className="mb-12">
          <span className="font-body text-xs uppercase tracking-[0.3em] text-amber">
            The Menu
          </span>
          <h2 className="font-display text-4xl md:text-6xl text-espresso tracking-tight mt-4 leading-tight">
            Signature Serves
          </h2>
          <p className="font-body text-base text-walnut/60 mt-4 max-w-lg leading-relaxed">
            Curated for the connoisseur. Every drink is precision-crafted,
            sourced from world-class single-origin estates.
          </p>
          <p className="font-body text-xs uppercase tracking-[0.2em] text-walnut/35 mt-6">
            Hover or tap any drink for its build
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-12">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setPinned(null);
              }}
              className={`inline-flex items-center min-h-[44px] px-5 py-2 rounded-full font-body text-xs uppercase tracking-[0.15em] transition-all duration-300 ${
                activeCategory === cat
                  ? "bg-espresso text-cream"
                  : "bg-latte/30 text-walnut/60 hover:bg-latte/50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          {filteredItems.map((item) => (
            <MenuCard
              key={item.name}
              item={item}
              isOpen={isOpen(item.name)}
              onToggle={() => setPinned(pinned === item.name ? null : item.name)}
              onHover={(hovering) => setHovered(hovering ? item.name : null)}
            />
          ))}
        </motion.div>

        <div className="mt-16 text-center">
          <p className="font-body text-sm text-walnut/40">
            All drinks available with oat, almond, or whole milk
          </p>
        </div>
      </div>
    </section>
  );
}
