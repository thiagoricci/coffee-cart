/**
 * The drink menu itself. Pure data, kept out of the component so the build
 * percentages can be checked by `npm test` — the diagrams divide the vessel by
 * them, so a bad sum draws a subtly wrong picture rather than failing.
 */

export type Category = "Hot" | "Iced" | "Specialty";

export interface Pour {
  label: string;
  percent: number;
  color: string;
}

export interface MenuItem {
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
export const POUR = {
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

export const MENU_ITEMS: MenuItem[] = [
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
