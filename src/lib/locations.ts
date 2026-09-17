/**
 * Where the cart parks each day, and the geo helpers the Find Us Today section
 * needs. Coordinates were resolved against OpenStreetMap's geocoder rather than
 * typed by hand, so the map marker and the directions link agree with the
 * address text.
 */

export interface Stop {
  day: string;
  location: string;
  address: string;
  city: string;
  hours: string;
  vibe: string;
  lat: number;
  lng: number;
}

export const LOCATIONS: Stop[] = [
  {
    day: "Monday",
    location: "Downtown Modesto",
    address: "10th Street Plaza",
    city: "Modesto, CA",
    hours: "7:00 AM — 2:00 PM",
    vibe: "Quick picks for the downtown morning rush",
    lat: 37.64095,
    lng: -121.00073,
  },
  {
    day: "Tuesday",
    location: "Whitmore Park",
    address: "Whitmore Park",
    city: "Ceres, CA",
    hours: "7:00 AM — 1:00 PM",
    vibe: "Grab a cup and take the long way around the park",
    lat: 37.59084,
    lng: -120.95491,
  },
  {
    day: "Wednesday",
    location: "Stanislaus State",
    address: "1 University Circle",
    city: "Turlock, CA",
    hours: "7:00 AM — 3:00 PM",
    vibe: "Study fuel for the ambitious",
    lat: 37.52558,
    lng: -120.85578,
  },
  {
    day: "Thursday",
    location: "Downtown Turlock",
    address: "West Main Street",
    city: "Turlock, CA",
    hours: "8:00 AM — 2:00 PM",
    vibe: "Where Main Street creativity meets caffeine",
    lat: 37.4927,
    lng: -120.8597,
  },
  {
    day: "Friday",
    location: "Livingston City Park",
    address: "Livingston City Park",
    city: "Livingston, CA",
    hours: "7:00 AM — 2:00 PM",
    vibe: "Valley air, fresh brew, end of the week",
    lat: 37.38471,
    lng: -120.72364,
  },
  {
    day: "Saturday",
    location: "Donnelly Park",
    address: "Donnelly Park",
    city: "Turlock, CA",
    hours: "7:00 AM — 1:00 PM",
    vibe: "Our original spot — community staple",
    lat: 37.50924,
    lng: -120.85566,
  },
  {
    day: "Sunday",
    location: "Hilmar",
    address: "Lander Avenue",
    city: "Hilmar, CA",
    hours: "8:00 AM — 12:00 PM",
    vibe: "Slow mornings, warm cups",
    lat: 37.40855,
    lng: -120.8502,
  },
];

export interface Coords {
  lat: number;
  lng: number;
}

/** Great-circle distance in miles. */
export function distanceMiles(from: Coords, to: Coords): number {
  const R = 3958.8;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(to.lat - from.lat);
  const dLng = toRad(to.lng - from.lng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(from.lat)) * Math.cos(toRad(to.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

export function formatMiles(miles: number): string {
  if (miles < 0.1) return "less than 0.1 mi";
  if (miles < 10) return `${miles.toFixed(1)} mi`;
  return `${Math.round(miles)} mi`;
}

/** Index into LOCATIONS of the stop closest to `from`. */
export function nearestStopIndex(from: Coords): number {
  let best = 0;
  let bestDistance = Infinity;
  LOCATIONS.forEach((stop, i) => {
    const d = distanceMiles(from, stop);
    if (d < bestDistance) {
      bestDistance = d;
      best = i;
    }
  });
  return best;
}

/**
 * OpenStreetMap's keyless embed. The bbox is the marker padded by roughly half a
 * mile, which lands the stop at street level without a zoom parameter.
 */
export function mapEmbedUrl(stop: Stop): string {
  const padLat = 0.006;
  const padLng = 0.008;
  const bbox = [stop.lng - padLng, stop.lat - padLat, stop.lng + padLng, stop.lat + padLat].join(",");
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${stop.lat},${stop.lng}`;
}

/** The stop's page on osm.org, for the "larger map" escape hatch. */
export function mapViewUrl(stop: Stop): string {
  return `https://www.openstreetmap.org/?mlat=${stop.lat}&mlon=${stop.lng}#map=16/${stop.lat}/${stop.lng}`;
}

/**
 * Google Maps turn-by-turn. Omitting `origin` makes Maps route from the device's
 * own location, so this works with or without the in-page geolocation grant.
 */
export function directionsUrl(stop: Stop, origin?: Coords | null): string {
  const params = new URLSearchParams({
    api: "1",
    destination: `${stop.lat},${stop.lng}`,
  });
  if (origin) params.set("origin", `${origin.lat},${origin.lng}`);
  return `https://www.google.com/maps/dir/?${params.toString()}`;
}

/** One footer row: the days that share a schedule, and that schedule. */
export interface HoursRow {
  days: string;
  hours: string;
}

const DASH = "—";

/** "7:00 AM" → "7am"; "7:30 AM" → "7:30am". Unparseable input passes through. */
function compactTime(time: string): string {
  const match = /^(\d{1,2})(?::(\d{2}))?\s*([ap])\.?m\.?$/i.exec(time.trim());
  if (!match) return time.trim();
  const [, hour, minutes, meridiem] = match;
  const suffix = `${meridiem.toLowerCase()}m`;
  return minutes && minutes !== "00" ? `${hour}:${minutes}${suffix}` : `${hour}${suffix}`;
}

/** "7:00 AM — 3:00 PM" → "7am — 3pm", the footer's tighter register. */
export function compactHours(hours: string): string {
  const parts = hours.split(DASH).map((part) => part.trim());
  if (parts.length !== 2) return hours.trim();
  return `${compactTime(parts[0])} ${DASH} ${compactTime(parts[1])}`;
}

/**
 * Days that share hours, written the way a sign would write them: a single day
 * in full, a run of three or more collapsed to "Mon — Fri", anything else
 * listed. `indices` are positions in the week, so runs are found by adjacency.
 */
function formatDays(stops: Stop[], indices: number[]): string {
  if (indices.length === 1) return stops[indices[0]].day;

  const abbrev = (i: number) => stops[i].day.slice(0, 3);
  const segments: string[] = [];
  let run = [indices[0]];

  const flush = () => {
    if (run.length >= 3) {
      segments.push(`${abbrev(run[0])} ${DASH} ${abbrev(run[run.length - 1])}`);
    } else {
      segments.push(...run.map(abbrev));
    }
  };

  for (const i of indices.slice(1)) {
    if (i === run[run.length - 1] + 1) run.push(i);
    else {
      flush();
      run = [i];
    }
  }
  flush();

  return segments.join(", ");
}

/**
 * The week's hours grouped by identical schedules, in day order. The footer
 * renders this rather than restating the hours, so the two cannot drift.
 */
export function weeklyHours(stops: Stop[] = LOCATIONS): HoursRow[] {
  const groups = new Map<string, number[]>();
  stops.forEach((stop, i) => {
    const existing = groups.get(stop.hours);
    if (existing) existing.push(i);
    else groups.set(stop.hours, [i]);
  });

  return Array.from(groups, ([hours, indices]) => ({
    days: formatDays(stops, indices),
    hours: compactHours(hours),
  }));
}
