import CoffeeScroll from "@/components/CoffeeScroll";
import CartShowcase from "@/components/CartShowcase";
import WeeklyLocations from "@/components/WeeklyLocations";
import CoffeeMenu from "@/components/CoffeeMenu";

export default function Home() {
  return (
    <main className="bg-cream min-h-screen w-full">
      <CoffeeScroll />
      <CartShowcase />
      <WeeklyLocations />
      <CoffeeMenu />

      <footer className="bg-espresso relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-amber rounded-full blur-[120px]" />
        </div>
        <div className="relative max-w-6xl mx-auto px-8 py-20 md:py-28">
          <div className="mb-16">
            <h2 className="font-display text-5xl md:text-7xl text-cream/90 tracking-tight leading-none">
              Your Perfect<br />Cup Awaits
            </h2>
            <p className="font-body text-base text-cream/40 mt-6 max-w-md leading-relaxed">
              From the first sip to the last drop, every cup is a moment worth savoring.
              Find us on the street nearest you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            <div>
              <h3 className="font-display text-2xl text-cream/90 tracking-tight">
                Brew & Go
              </h3>
              <p className="font-body text-sm text-cream/30 mt-3 leading-relaxed">
                Artisan coffee, handcrafted daily.<br />
                From our cart to your cup.
              </p>
            </div>
            <div>
              <h4 className="font-body text-xs uppercase tracking-[0.25em] text-amber mb-4">
                This Week&apos;s Hours
              </h4>
              <div className="space-y-2">
                <p className="font-body text-sm text-cream/40">
                  Mon — Fri <span className="text-cream/60">7am — 2pm</span>
                </p>
                <p className="font-body text-sm text-cream/40">
                  Saturday <span className="text-cream/60">7am — 1pm</span>
                </p>
                <p className="font-body text-sm text-cream/40">
                  Sunday <span className="text-cream/60">8am — 12pm</span>
                </p>
              </div>
            </div>
            <div>
              <h4 className="font-body text-xs uppercase tracking-[0.25em] text-amber mb-4">
                Connect
              </h4>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="font-body text-sm text-cream/40 hover:text-cream transition-colors duration-300"
                >
                  Instagram
                </a>
                <a
                  href="#"
                  className="font-body text-sm text-cream/40 hover:text-cream transition-colors duration-300"
                >
                  Twitter
                </a>
                <a
                  href="#"
                  className="font-body text-sm text-cream/40 hover:text-cream transition-colors duration-300"
                >
                  Email
                </a>
              </div>
              <div className="mt-6">
                <div className="flex items-center gap-3 max-w-xs">
                  <input
                    type="email"
                    placeholder="Your email"
                    className="flex-1 bg-cream/5 border border-cream/10 rounded-full px-4 py-2.5 font-body text-sm text-cream placeholder:text-cream/20 focus:outline-none focus:border-amber/40 transition-colors"
                  />
                  <button className="px-5 py-2.5 bg-amber text-espresso font-body text-xs uppercase tracking-[0.15em] rounded-full hover:bg-amber/90 transition-colors">
                    Join
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-cream/5 text-center">
            <p className="font-body text-xs text-cream/15 tracking-wide">
              &copy; {new Date().getFullYear()} Brew & Go. Crafted with care.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
