import assert from "node:assert/strict";
import { test } from "node:test";

import { MENU_ITEMS, POUR } from "../src/lib/drinks.ts";

const POUR_COLORS = new Set(Object.values(POUR));

test("every drink has a build", () => {
  assert.ok(MENU_ITEMS.length > 0, "the menu is empty");
  for (const item of MENU_ITEMS) {
    assert.ok(item.build.length > 0, `${item.name} has no build`);
  }
});

test("build percentages sum to 100", () => {
  // The diagram divides the vessel by these, so a bad sum draws a wrong
  // picture silently — there is no runtime error to catch it.
  for (const item of MENU_ITEMS) {
    const total = item.build.reduce((sum, pour) => sum + pour.percent, 0);
    assert.equal(total, 100, `${item.name} pours sum to ${total}, not 100`);
  }
});

test("every pour is a positive whole percentage", () => {
  for (const item of MENU_ITEMS) {
    for (const pour of item.build) {
      assert.ok(
        Number.isInteger(pour.percent) && pour.percent > 0,
        `${item.name} / ${pour.label}: ${pour.percent} is not a positive whole number`
      );
    }
  }
});

test("pours use the shared POUR palette", () => {
  for (const item of MENU_ITEMS) {
    for (const pour of item.build) {
      assert.ok(
        POUR_COLORS.has(pour.color),
        `${item.name} / ${pour.label} uses ${pour.color}, which is not in POUR`
      );
    }
  }
});

test("strength is 1–5 and drinks carry the fields the card renders", () => {
  for (const item of MENU_ITEMS) {
    assert.ok(
      Number.isInteger(item.strength) && item.strength >= 1 && item.strength <= 5,
      `${item.name} strength ${item.strength} is outside 1–5`
    );
    for (const field of ["name", "description", "price", "volume", "detail"] as const) {
      assert.ok(item[field]?.trim(), `${item.name} is missing ${field}`);
    }
    assert.match(item.price, /^\$\d+\.\d{2}$/, `${item.name} price "${item.price}" is off-format`);
  }
});
