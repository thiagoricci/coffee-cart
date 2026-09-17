import assert from "node:assert/strict";
import { test } from "node:test";

import {
  LOCATIONS,
  type Stop,
  compactHours,
  distanceMiles,
  formatMiles,
  nearestStopIndex,
  weeklyHours,
} from "../src/lib/locations.ts";

/** The cart's actual range: Stanislaus/Merced counties, generously padded. */
const CENTRAL_VALLEY = { minLat: 37.0, maxLat: 38.0, minLng: -121.5, maxLng: -120.3 };

const WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

test("the week is complete and Monday-first", () => {
  assert.deepEqual(LOCATIONS.map((stop) => stop.day), WEEK);
});

test("every stop sits in the Central Valley", () => {
  // A typo'd sign or digit silently moves the cart to another continent, and
  // the map still renders — it just shows the wrong place.
  for (const stop of LOCATIONS) {
    assert.ok(
      stop.lat >= CENTRAL_VALLEY.minLat && stop.lat <= CENTRAL_VALLEY.maxLat,
      `${stop.day} (${stop.location}): latitude ${stop.lat} is outside the valley`
    );
    assert.ok(
      stop.lng >= CENTRAL_VALLEY.minLng && stop.lng <= CENTRAL_VALLEY.maxLng,
      `${stop.day} (${stop.location}): longitude ${stop.lng} is outside the valley`
    );
  }
});

test("every stop names a place and an opening time", () => {
  for (const stop of LOCATIONS) {
    for (const field of ["location", "address", "city", "hours", "vibe"] as const) {
      assert.ok(stop[field]?.trim(), `${stop.day} is missing ${field}`);
    }
    assert.match(
      stop.hours,
      /^\d{1,2}:\d{2} [AP]M — \d{1,2}:\d{2} [AP]M$/,
      `${stop.day} hours "${stop.hours}" are off-format`
    );
  }
});

test("distanceMiles matches a known drive", () => {
  const turlock = LOCATIONS.find((s) => s.location === "Downtown Turlock") as Stop;
  const modesto = LOCATIONS.find((s) => s.location === "Downtown Modesto") as Stop;
  const miles = distanceMiles(turlock, modesto);
  assert.ok(miles > 12 && miles < 14, `Turlock → Modesto came out as ${miles} mi, expected ~13`);
  // Great-circle distance is symmetric, and a stop is zero miles from itself.
  assert.equal(distanceMiles(modesto, turlock).toFixed(6), miles.toFixed(6));
  assert.equal(distanceMiles(turlock, turlock), 0);
});

test("nearestStopIndex picks the closest stop", () => {
  // Ceres city centre — Whitmore Park is the Tuesday stop, a couple of miles off.
  assert.equal(nearestStopIndex({ lat: 37.5949, lng: -120.9577 }), 1);
  // Standing on a stop returns that stop.
  LOCATIONS.forEach((stop, i) => {
    assert.equal(nearestStopIndex({ lat: stop.lat, lng: stop.lng }), i, `standing on ${stop.location} should pick ${stop.day}`);
  });
});

test("formatMiles keeps close distances honest", () => {
  assert.equal(formatMiles(0.04), "less than 0.1 mi");
  assert.equal(formatMiles(2.345), "2.3 mi");
  assert.equal(formatMiles(13.4), "13 mi");
});

test("compactHours tightens the footer's register", () => {
  assert.equal(compactHours("7:00 AM — 2:00 PM"), "7am — 2pm");
  assert.equal(compactHours("8:30 AM — 12:00 PM"), "8:30am — 12pm");
  // Anything it cannot parse passes through rather than rendering as garbage.
  assert.equal(compactHours("by appointment"), "by appointment");
});

test("weeklyHours covers the week without repeating a day", () => {
  const rows = weeklyHours();
  const days = rows.flatMap((row) => row.days.split(", "));
  assert.equal(new Set(days).size, days.length, "a day appears in two rows");
  for (const row of rows) {
    assert.ok(row.hours.includes("—"), `"${row.hours}" is not a range`);
  }
});

test("weeklyHours groups identical hours and collapses runs", () => {
  const stop = (day: string, hours: string): Stop => ({
    day,
    location: day,
    address: "",
    city: "",
    hours,
    vibe: "",
    lat: 0,
    lng: 0,
  });
  const nineToFive = "9:00 AM — 5:00 PM";

  // A run of three or more reads as a range; the odd day out stands alone.
  assert.deepEqual(
    weeklyHours([
      stop("Monday", nineToFive),
      stop("Tuesday", nineToFive),
      stop("Wednesday", nineToFive),
      stop("Thursday", "10:00 AM — 4:00 PM"),
    ]),
    [
      { days: "Mon — Wed", hours: "9am — 5pm" },
      { days: "Thursday", hours: "10am — 4pm" },
    ]
  );

  // Two days that share hours without being adjacent are listed, not ranged.
  assert.deepEqual(
    weeklyHours([
      stop("Monday", nineToFive),
      stop("Tuesday", "10:00 AM — 4:00 PM"),
      stop("Wednesday", nineToFive),
    ]),
    [
      { days: "Mon, Wed", hours: "9am — 5pm" },
      { days: "Tuesday", hours: "10am — 4pm" },
    ]
  );
});
