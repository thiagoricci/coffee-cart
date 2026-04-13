"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface MenuItem {
  name: string;
  description: string;
  price: string;
  tag?: string;
}

const MENU_ITEMS: MenuItem[] = [
  {
    name: "Espresso",
    description: "Dark chocolate, caramel finish",
    price: "$3.50",
  },
  {
    name: "Americano",
    description: "Smooth, bold, clean",
    price: "$4.00",
  },
  {
    name: "Cortado",
    description: "Balanced milk, robust espresso",
    price: "$4.50",
  },
  {
    name: "Flat White",
    description: "Velvety microfoam, strong espresso",
    price: "$5.25",
  },
  {
    name: "Cappuccino",
    description: "Rich espresso, frothy milk",
    price: "$5.50",
  },
  {
    name: "Latte",
    description: "Smooth, creamy, vanilla notes",
    price: "$5.60",
  },
  {
    name: "Mocha",
    description: "Espresso, cocoa, steamed milk",
    price: "$6.00",
    tag: "Popular",
  },
  {
    name: "Affogato",
    description: "Espresso poured over vanilla gelato",
    price: "$6.50",
    tag: "Signature",
  },
  {
    name: "Cold Brew",
    description: "24-hour steep, smooth & crisp",
    price: "$5.00",
  },
  {
    name: "Iced Matcha Latte",
    description: "Ceremonial grade, oat milk",
    price: "$5.75",
  },
];

const CATEGORIES = ["All", "Hot", "Iced", "Specialty"];

function getCategory(item: MenuItem): string {
  if (item.name.includes("Cold Brew") || item.name.includes("Iced")) return "Iced";
  if (item.tag === "Signature") return "Specialty";
  return "Hot";
}

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

export default function CoffeeMenu() {
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredItems =
    activeCategory === "All"
      ? MENU_ITEMS
      : MENU_ITEMS.filter((item) => getCategory(item) === activeCategory);

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
        </div>

        <div className="flex gap-2 mb-12">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full font-body text-xs uppercase tracking-[0.15em] transition-all duration-300 ${
                activeCategory === cat
                  ? "bg-espresso text-cream"
                  : "bg-latte/30 text-walnut/60 hover:bg-latte/50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems.map((item, i) => (
            <div
              key={item.name}
              onMouseEnter={() => setHoveredItem(i)}
              onMouseLeave={() => setHoveredItem(null)}
              className={`group relative p-6 md:p-8 rounded-2xl transition-all duration-500 cursor-default ${
                hoveredItem === i
                  ? "bg-espresso text-cream"
                  : "bg-foam border border-latte/20 hover:border-latte/40"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3
                      className={`font-display text-xl tracking-tight transition-colors duration-500 ${
                        hoveredItem === i ? "text-cream" : "text-espresso"
                      }`}
                    >
                      {item.name}
                    </h3>
                    {item.tag && (
                      <span
                        className={`text-[10px] font-body uppercase tracking-wider px-2 py-0.5 rounded-full transition-colors duration-500 ${
                          hoveredItem === i
                            ? "bg-amber/20 text-amber"
                            : "bg-amber/10 text-amber"
                        }`}
                      >
                        {item.tag}
                      </span>
                    )}
                  </div>
                  <p
                    className={`font-body text-sm transition-colors duration-500 ${
                      hoveredItem === i ? "text-cream/50" : "text-walnut/50"
                    }`}
                  >
                    {item.description}
                  </p>
                </div>
                <span
                  className={`font-display text-2xl tracking-tight transition-colors duration-500 ${
                    hoveredItem === i ? "text-amber" : "text-espresso/80"
                  }`}
                >
                  {item.price}
                </span>
              </div>

              <div
                className={`absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent ${
                  hoveredItem === i
                    ? "via-amber/30 to-transparent"
                    : "via-latte/40 to-transparent"
                } transition-opacity duration-500`}
              />
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="font-body text-sm text-walnut/40">
            All drinks available with oat, almond, or whole milk
          </p>
        </div>
      </div>
    </section>
  );
}
