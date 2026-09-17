# Brew & Go — UI Improvement Plan

Derived from a full review of `src/app/*` and `src/components/*` on 2026-09-16 against the commit
now known as `01e066b` (it was `e9e9e1e` before the 2026-09-17 history rewrite — see *Git state*).

Phases are ordered by impact. Phases 1–3 change how the site actually feels to use; 4–6 are
correctness and refinement. Each phase is independently shippable — nothing later depends on
anything earlier except where noted.

**Legend:** `P0` ship first · `P1` ship soon · `P2` refinement

---

## START HERE — session handoff

**Last updated:** 2026-09-17, end of session 6.

### Where things stand

**Done and measured:**

| Item | Outcome |
|---|---|
| 1.1 / 1.3 | Hero assets 23.8 MB → 2.3 MB (−90%); progressive reveal |
| 1.2b | Portrait crop set for phones: 2.3 MB → 1.7 MB, pixel-identical render |
| 2.4 | CLS **1.000 → 0.002**, perf score **61 → 99**, LCP **4.27s → 1.45s** |
| 2.2 | Frozen tail after the last frame **3.58 → 0.78 screens**, pacing untouched |
| 3.1 | Hero text legibility; worst line 1.64:1 → readable, frames left undarkened |
| 5.1 / 5.2 | Dates derived from the current week; clock read client-side only, SSR now clock-free |
| Signature Serves (s5) | Hover/tap expansion with per-drink build diagrams; **closes 6.5 and 6.7** |
| Find Us Today (s5) | Real Turlock-area coordinates, keyless OSM map, opt-in geolocation + distance |
| Mobile (s5) | Tap-to-close bug fixed, map scroll-trap shielded, own tap targets ≥ 44 px |
| 5.4 (s6) | Footer hours derived from `LOCATIONS` — the contradiction cannot come back |
| 7.1 (s6) | Map degrades to a styled link card without WebGL; measured both ways |
| 7.2 (s6) | `npm test` — 14 `node --test` checks over the pour sums, coordinates and helpers |
| 6.1 (s6) | Marquee seam gone: **0 px** error at 390, 1440 and 2560 |
| 5.7 (s6) | Favicon, apple icon and a 1200×630 link card, generated from `tools/brand/` |

**Closed by human decision — do not reopen without new information:**

- **Brew & Go is a demo site.** Stated 2026-09-17: *"this is a demo website."* That closes every
  accessibility item (Phase 4 entire, plus 3.2's contrast rationale) and every real-business item
  (5.3 clock-accurate "Open Now", 5.5 phone/address/JSON-LD, 4.6 social links). There is no business
  behind the page and no real audience to exclude, so the compliance and correctness arguments that
  justified them do not apply. Do not re-pitch them on accessibility or SEO grounds.

- **2.3 (sticky nav)** — won't-fix. The nav-less scroll is the product.
- **2.1 (halve hero scroll)** — superseded by 2.2. Would nearly halve scroll-per-frame, which the
  human has explicitly approved as-is.
- **3.1's area darkening** — scrims and pools were tried four ways, all measured, all rejected on
  looks. The shipped hero trades AA for imagery deliberately. Read *Final state* under 3.1.

**Everything is committed and pushed** to `origin/main` as of 2026-09-17 (session 4). See
*Git state* below — the repo history was also rewritten to purge the original PNGs.

### Git state — read this before doing anything

⚠️ **`main` is clean but ahead of `origin/main` — session 6 has not been pushed.** Eight commits at
the time of writing: the seven listed below plus the one carrying this update. Check with
`git status -sb`. Push when you are ready (`git push`), or hand the decision to the human; nothing
else is outstanding.

Session 6 (2026-09-17), newest first — the whole of Phase 7, plus session 5's work which arrived
uncommitted and was committed first so the Phase 7 diffs stood on their own:

```
77499b1 feat(meta): add the favicon and a real link preview          5.7
5a9fd45 fix(menu): loop the marquee without a seam                   6.1
facb58a test: cover the pour sums, stop coordinates and hour helpers 7.2
1f40dd5 fix(locations): fall back to a styled card when WebGL is missing  7.1
5da0312 fix(footer): derive this week's hours from LOCATIONS         5.4
3161fc8 docs(plan): record session 5 and open the Phase 7 queue
2f1094f feat(menu,locations): expandable drink builds and a real Find Us Today card
```

Earlier, from session 4 (2026-09-17), already on `origin/main`:

```
8313df3 docs(plan): close Phase 4, 3.2, 5.3 and 5.5 — demo site
0b6bc66 docs(plan): record the commit, push and history purge
a84c000 docs: add the phased UI improvement plan
b3fb21f fix(locations): derive week dates from the clock, read client-side only
d9ca86f perf(hero): serve WebP frame sets, fix CLS, and tighten scroll pacing
```

Old SHA → new, for the references still scattered through this file:
`e9e9e1e`→`01e066b`, `d887736`→`6d63dc9`, `0796d7d`→`d5e08f5`, `8fef015`→`5afaa69`,
`f81fc73`→`bbdc60a`, `d42599e`→`0a0f0f2`.

**History was rewritten.** The 40 original `public/ezgif-frame-*.png` were purged from every commit
with `git filter-branch --index-filter`, and `main` was force-pushed. A fresh clone is now 4.5 MB
(was ~28 MB); `.git` locally is 4.6 MB. A stale Kilo Code worktree at `.kilo/worktrees/swift-lathe`,
pinned to the pre-rewrite `e9e9e1e`, was removed — it was the only thing holding the old objects.

> ⚠️ Consequences, in order of how likely they are to bite:
> 1. **Every commit SHA before 2026-09-17 changed.** `e9e9e1e`, `d42599e` and friends are gone.
>    Anything quoting an old SHA — including earlier sections of this file — is stale.
> 2. **Any clone made before the rewrite has diverged** and must be re-cloned, not pulled.
> 3. **The original PNGs exist in exactly one place**:
>    `/Users/thiagoricci/Downloads/Projects/coffee-cart-pre-purge.bundle` (28 MB, full pre-rewrite
>    history). Restore with `git clone coffee-cart-pre-purge.bundle`. Do not delete it until the
>    PNGs are definitely unwanted — `git checkout <old-sha> -- public/` no longer works.

Note: GitHub may keep the purged objects server-side until its own GC runs. They are unreachable
from any ref and absent from fresh clones, but do not treat the purge as a way of unpublishing
something secret.

### Do this next

**Nothing is queued.** Phase 7 — the five items the human asked for at the end of session 5 — was
implemented in full in session 6, in the agreed order, each with its own commit and its own section
in this file closed with the evidence:

| Item | Commit | Outcome |
|---|---|---|
| 5.4 | `5da0312` | `weeklyHours()` groups the stops; the footer renders it and cannot drift |
| 7.1 | `1f40dd5` | `useHasWebGL()`; no WebGL → a styled link card, directions still reachable |
| 7.2 | `facb58a` | `npm test`, 14 checks; both invariants confirmed to fail loudly |
| 6.1 | `5a9fd45` | Four copies on a `w-max` track at `-50%`; 0 px error at three widths |
| 5.7 | `77499b1` | Metadata + four generated PNGs; sources in `tools/brand/` |

Every Phase 7 acceptance criterion is met — see *Acceptance criteria — Phase 7*.

**Before picking anything up, ask.** What is still open in this file is *not* agreed work:

- **5.6** — no server-rendered `<h1>` (the hero heading only exists after `isLoaded`). Note the
  demo-site decision already closed the SEO argument for it; the honest case now is that the page
  is blank without JS, which is really 6.3.
- **6.2** `<Image fill>` without `sizes` · **6.3** content depends on JS · **6.4** the grain overlay's
  cost · **6.6** four copies of the same section header · **6.8** repo hygiene.

The one loose end from session 6 is that **its commits are not pushed** — see *Git state*.

**Do not re-pitch** the items closed by the demo-site decision above. Phase 7 deliberately contained
nothing from that list: 5.7 was taken on *demo-sharing* grounds (a link that previews blank
undercuts the demo), explicitly **not** on SEO grounds.

**Settled in session 5 — do not reopen:**

- **The map is the keyless OpenStreetMap `<iframe>`, by choice.** Four options were put to the human
  (OSM iframe, Leaflet, Google Maps Embed, static image); they chose the no-key path and accepted
  the generic styling as the cost. Do not propose Google Maps, Mapbox, or anything needing an API
  key. If the map must ever match the palette, Leaflet with a CSS-filtered tile layer is the next
  step that stays keyless.
- **Stops are pinned around Turlock, CA** (plus Modesto, Ceres, Livingston, Hilmar) — the human's own
  choice of locale. Coordinates were resolved against OSM's geocoder, not typed from memory.
- **Two menu cards can be open at once on desktop** (one pinned, one hovered). Judged a feature for
  comparing builds, not a defect.

**Cleared from session 4:** the Find Us Today card *has* now been opened in a browser (sessions 5
and 6) and verified at desktop and 390 px. Note its content changed — expect *Thursday — Sep 17* with
**Downtown Turlock** selected, not "Arts District"; the placeholder stops were replaced with real
Central Valley locations.

**Two environment traps that cost real time in session 3:**

- ⚠️ **`next dev` does not hot-reload `tailwind.config.ts`.** A palette edit appears to do nothing
  until the dev server restarts; it produced two bogus measurement runs before being caught. The tell
  was a byte-identical result across a colour change. `globals.css` *does* hot-reload, so the two
  halves of the duplicated palette can silently disagree.
- ⚠️ **Never run `next build` in the project while `next dev` is running** — it overwrites the dev
  server's `.next` and breaks the user's session mid-flight. Build in a temp copy instead: copy `src`,
  `public` and the configs, symlink `node_modules`, build there.

### Open questions for the human

1. **1.2 is blocked** — there is no source for the hero frames above 1280×720. Either find/re-render
   a hi-res original, or close the item as won't-fix. The retina softness stays until then. A hi-res
   source would also let 3.1's remaining AA failures be fixed at the asset level, by re-grading the
   bright frames (03, 05, 19) darker — the one fix that costs the design nothing.
2. **1.4 is recommended for closure** — the payload argument that justified it died with 1.1, and
   doing it would now *reduce* animation smoothness. Confirm before dropping.
3. ~~**Design decisions in Phases 3 and 5**~~ — moot. 3.2 and 5.5 are both closed by the demo-site
   decision; there is no business whose details could be supplied, and the amber accent stays as
   designed.

### Verify the state you inherited

```sh
npx tsc --noEmit        # expect: clean
npm test                # expect: 14 tests pass (node --test, added 7.2)
npx next build          # expect: success, route / at ~57 kB (was 51.4 kB before session 5)
# ⚠️ If `next dev` is running, `next build` overwrites its .next and breaks the dev server
# mid-session (this happened on 2026-09-16). Build in a copy instead: cp src public + configs to
# a temp dir, symlink node_modules, build there.
ls public/coffee-frames | wc -l            # expect: 40
du -sh public/coffee-frames                # expect: 2.3M
ls public/coffee-frames-portrait | wc -l   # expect: 40
du -sh public/coffee-frames-portrait       # expect: 1.7M

ls src/lib                 # expect: drinks.ts, locations.ts, useCanHover.ts, useHasWebGL.ts
ls src/app/*.png           # expect: apple-icon, icon, opengraph-image, twitter-image (5.7)
ls tests                   # expect: drinks.test.ts, locations.test.ts (session 6)

git status -sb                             # expect: clean (session 5 committed in session 6)
du -sh .git                                # expect: ~4.6M (PNGs purged 2026-09-17)
git rev-list --objects --all | grep -c ezgif   # expect: 0
```

---

## Priority summary

| # | Item | Priority | Effort | Files |
|---|---|---|---|---|
| 1.1 | ~~Convert 40 hero frames to WebP~~ **DONE** | P0 | M | `public/`, `CoffeeScroll.tsx` |
| 1.2 | Serve two frame resolutions — **BLOCKED**, no hi-res source | P0 | S | `CoffeeScroll.tsx` |
| 1.2b | ~~Portrait crop set for mobile~~ **DONE** — 2.3 MB → 1.7 MB, identical render | P1 | M | `public/`, `CoffeeScroll.tsx` |
| 1.3 | ~~Progressive reveal (don't block on all 40)~~ **DONE** | P0 | M | `CoffeeScroll.tsx` |
| 1.4 | Reduce frame count 40 → 24 — **NOT DONE**, see 1.4 | P1 | S | `public/`, `CoffeeScroll.tsx` |
| 2.4 | ~~Fix CLS of 1.000~~ **DONE** — 1.000 → 0.002 | P0 | S | `CoffeeScroll.tsx` |
| 2.1 | Halve hero scroll length — **SUPERSEDED** by 2.2, do not apply | P0 | S | `CoffeeScroll.tsx` |
| 2.2 | ~~Remap frame curve, kill dead scroll~~ **DONE** — tail 3.58 → 0.78 screens | P0 | S | `CoffeeScroll.tsx` |
| 2.3 | ~~Add sticky nav~~ **CLOSED** — won't-fix, nav-less scroll is intentional | — | M | — |
| 3.1 | ~~Scrim behind canvas text~~ **DONE** — glyph shadows; frames undarkened by choice | P0 | S | `CoffeeScroll.tsx` |
| 3.2 | ~~Fix amber accent contrast~~ **CLOSED** — contrast-driven, demo site | — | S | `tailwind.config.ts`, `globals.css`, 4 components |
| 3.3 | Replace opacity-dialled text with muted tokens | P1 | M | `tailwind.config.ts`, all components |
| 4.1 | ~~`prefers-reduced-motion` support~~ **CLOSED** — demo site | — | M | `globals.css`, `CoffeeScroll.tsx`, `CoffeeMenu.tsx` |
| 4.2 | ~~Fix or remove the newsletter form~~ **CLOSED** — demo site | — | S | `page.tsx` |
| 4.3 | ~~Menu hover → CSS `group-hover`/`focus-within`~~ **CLOSED** — demo site | — | S | `CoffeeMenu.tsx` |
| 4.4 | ~~ARIA for tabs, filters, canvas~~ **CLOSED** — demo site | — | S | `WeeklyLocations.tsx`, `CoffeeMenu.tsx`, `CoffeeScroll.tsx` |
| 4.5 | ~~Visible focus indicators~~ **CLOSED** — demo site | — | S | `globals.css`, `page.tsx` |
| 4.6 | ~~Real social links~~ **CLOSED** — demo site, no real accounts | — | XS | `page.tsx` |
| 5.1 | ~~Derive location dates from current week~~ **DONE** | P0 | S | `WeeklyLocations.tsx` |
| 5.2 | ~~Fix SSR/client hydration mismatch on "today"~~ **DONE** | P0 | S | `WeeklyLocations.tsx` |
| 5.3 | ~~"Open Now" must respect hours~~ **CLOSED** — demo site | — | S | `WeeklyLocations.tsx` |
| 5.4 | ~~Derive footer hours from `LOCATIONS`~~ **DONE** 2026-09-17 (session 6) | P1 | S | `page.tsx`, `src/lib/locations.ts` |
| 5.5 | ~~Add real business info + JSON-LD~~ **CLOSED** — demo site, no real business | — | M | `layout.tsx`, `page.tsx` |
| 5.6 | Server-rendered `<h1>` | P1 | S | `CoffeeScroll.tsx` |
| 5.7 | ~~Site metadata (favicon, OG, theme-color)~~ **DONE** 2026-09-17 (session 6) | P2 | S | `layout.tsx`, `src/app/` |
| 6.1 | ~~Seamless marquee loop~~ **DONE** 2026-09-17 (session 6) | P2 | S | `CoffeeMenu.tsx` |
| 6.2 | `sizes` on `<Image fill>` | P2 | XS | `CartShowcase.tsx` |
| 6.3 | JS-independent section reveals | P2 | S | `CartShowcase.tsx`, `WeeklyLocations.tsx` |
| 6.4 | Reconsider the grain overlay | P2 | XS | `globals.css` |
| 6.5 | ~~Menu row type hierarchy~~ **DONE** 2026-09-17 — name now outranks price | P2 | XS | `CoffeeMenu.tsx` |
| 6.6 | Extract `SectionHeading` | P2 | S | new component, 4 call sites |
| 6.7 | ~~Explicit `category` field on menu items~~ **DONE** 2026-09-17 | P2 | XS | `CoffeeMenu.tsx` |
| 6.8 | Repo hygiene | P2 | XS | `.gitignore` |
| 7.1 | ~~Map has no WebGL fallback~~ **DONE** 2026-09-17 (session 6) | P1 | S | `WeeklyLocations.tsx` |
| 7.2 | ~~Session-5 invariants untested, `tests/` empty~~ **DONE** 2026-09-17 (session 6) | P1 | M | `tests/`, `package.json` |

~~**If only three things ship: 1.1, 2.1 + 2.3, and 3.2.**~~ — obsolete. 1.1 shipped, 2.1 was
superseded by 2.2, and 2.3 and 3.2 were both closed by human decision. Nothing is queued; see
*Do this next*.

---

## Phase 0 — Prerequisites — COMPLETE

- [x] Baseline payload recorded: **23.8 MB across 40 PNGs, avg 609 KB, 1280×720**.
- [x] Lighthouse baseline captured — *after the fact*, by reconstructing commit `01e066b` in a git
      worktree and serving a real production build. Method and numbers in *Measurement results*.
- [ ] Branch never created; work is uncommitted on `main`. Do this before continuing:
      `git checkout -b ui/improvements`

> **Lesson worth keeping:** the baseline was very nearly lost. The optimised frames were written and
> the PNGs deleted before any before/after measurement existed. It was only recoverable because the
> PNGs were still in git history. Measure before you delete.

---

## Phase 1 — The hero asset pipeline (P0) — COMPLETE (2026-09-16)

> **Outcome: 23.8 MB → 2.3 MB (−90%).** 1.1 and 1.3 shipped. 1.2 is blocked on a missing
> high-resolution source. 1.4 was deliberately not done — the rationale for it evaporated once
> 1.1 landed; see the note under that item. Build and `tsc --noEmit` both pass.


**Problem.** `public/` holds 40 PNG frames totalling **23.8 MB**, all fetched eagerly in a single
loop (`CoffeeScroll.tsx:335-346`). Nothing else on the page is reachable until frame 1 lands or the
3.5s timeout fires (`CoffeeScroll.tsx:468`).

The frames are simultaneously **too heavy and too low-resolution**: sources are 1280×720, but
`drawFrame` paints at `window.innerWidth × devicePixelRatio`. On a retina laptop a 1280px image is
upscaled to ~2880px — soft, and you paid 609 KB for the softness.

### 1.1 Convert frames to WebP

These are flat-ish frames of a coffee cart; WebP handles them far better than PNG.

```sh
mkdir -p public/coffee-frames
for f in public/ezgif-frame-*.png; do
  cwebp -q 78 "$f" -o "public/coffee-frames/$(basename "${f%.png}").webp"
done
```

- [x] Convert all 40 frames — **shipped at q90, not the planned q78.** Measured PSNR across
      frames 1/20/40: q78 ≈ 40.5 dB, q85 ≈ 42.1 dB, q90 ≈ 43.8 dB. Because the canvas *upscales*
      these frames (see below), compression artifacts get magnified, so the extra headroom is worth
      more than the ~1 MB it costs. q90 still beat the 3 MB target.
- [x] Encoder settings: `cwebp -q 90 -m 6 -sharp_yuv` (max compression effort, better chroma on
      upscale).
- [x] Spot-checked frames 1 / 20 / 40 — no banding in the espresso tones or the steam.
- [x] `getFramePath()` now returns `/coffee-frames/frame-NNN.webp`.
- [x] Verified all 40 serve as `image/webp` over HTTP, then deleted the PNGs from `public/`.

**Result: 23.8 MB → 2.3 MB (−90%), avg 58 KB/frame.** `public/` overall is now 2.8 MB.

### 1.2 Serve two frame resolutions — BLOCKED

**This item cannot be completed as written.** All 40 source frames are uniformly 1280×720, and there
is no higher-resolution original anywhere in the project — no GIF, MP4, MOV, or WebM (the `ezgif-`
filename prefix suggests they were extracted from an already-downscaled GIF).

Upscaling 1280 → 1920 and re-encoding would add bytes while adding zero real detail; the browser's
own canvas upscaling is equivalent. So the softness on retina displays noted in the review **is not
fixed** and cannot be fixed from the assets on hand.

To unblock, one of:
- [ ] Locate the original video/GIF at ≥1920px and re-extract the frame strip, **or**
- [ ] Re-shoot / re-render the cart animation at 1920px or 2560px, **or**
- [ ] Accept 1280×720 and close this item as won't-fix.

Once a hi-res source exists, the original plan applies: export a 1920px set, and pick the set once at
module init from `window.innerWidth * (window.devicePixelRatio || 1) > 1400`. Keep that read inside
`useEffect` so SSR stays safe.

### 1.2b A second frame set *downward* for mobile — investigated 2026-09-16, NOT blocked

The blocker above is only on the *upward* direction. A mobile-specific set is possible today. The
investigation produced a result that inverts the obvious assumption, so the numbers are recorded
here in full.

**Mobile is the most upscaled view on the site, not the least.** `drawFrame` cover-fits a 16:9 frame
to a tall portrait viewport, so the frame is blown up until its *height* covers the screen — which
pushes most of its width off-screen:

| Device | viewport aspect | visible source width | upscale from 1280px |
|---|---|---|---|
| iPhone SE | 0.562 | 32% = 405px | 1.85× |
| iPhone 14 Pro | 0.461 | **26% = 332px** | **3.55×** |
| Pixel 7 | 0.450 | 25% = 324px | 3.34× |
| iPad portrait | 0.695 | 39% = 500px | 3.28× |
| Laptop 1440×900 @2x | 1.600 | 90% = 1152px | 2.50× |
| Desktop 1080p | 1.778 | 100% = 1280px | 1.50× |

So a phone sees a quarter of each frame, magnified 3.5×. **Downscaling for mobile would make the
already-softest view softer.** Measured, by rendering each candidate source through the real
iPhone 14 Pro draw path (cover-fit to 4544×2556, crop the visible 1179×2556) and comparing to the
1280px render:

| Mobile source | Total bytes | PSNR vs current | DSSIM |
|---|---|---|---|
| 1280×720 (current) | 2.3 MB | — | — |
| 960×540 | 1.5 MB | 36.1 / 40.6 / 38.6 dB | 0.015–0.021 |
| 640×360 | 936 KB | **32.0 / 38.4 / 36.2 dB** | 0.021–0.043 |

Phase 1 rejected q78 encoding at **40.5 dB** on the grounds that upscaling magnifies artifacts. A
640px source lands at 32 dB — far below a bar this project has already declined once. At 1:1 it
visibly loses the crema speckle and softens the pour edge.

**Cropping beats scaling, and it is free.** Since a phone only ever sees the centre ~26–32% of the
frame's width, encoding just that slice produces a *pixel-identical* render — the same source pixels
are upscaled by the same factor to the same screen — while dropping bytes:

| Mobile set | Total bytes | Saving | Quality on a portrait phone |
|---|---|---|---|
| 448×720 centre crop | **1.5 MB** | −35% | **identical** (covers aspect ≤ 0.622) |
| 640×720 centre crop | 1.8 MB | −22% | identical (covers aspect ≤ 0.889, incl. iPad) |
| 960×540 downscale | 1.5 MB | −35% | measurably worse |

The 448px crop and the 960px downscale cost the same 1.5 MB; the crop gives it up for nothing.
Note the saving is smaller than the pixel count implies — the centre slice carries the detail while
the discarded edges are bokeh that compressed almost for free.

`drawFrame` needs **no change**: it derives cover-fit from `img.naturalWidth/naturalHeight`, so a
0.622-aspect source covers a 0.461-aspect viewport correctly on its own (verified: visible region
works out to 331 source px, matching the 332px the full frame exposes).

**IMPLEMENTED 2026-09-16.** Shipped at **544×720**, not the 448 the table above favours. 448 covers
viewport aspects up to 0.622, which is fine full-bleed but breaks once the mobile URL bar is showing
and shrinks `innerHeight`: iPhone SE goes 0.562 → **0.678**, a 16:9 Android 0.563 → **0.703**, iPad
0.695 → **0.745**. 544/720 = 0.755 clears all of them, so the set never flips when the toolbar
collapses — only on a real rotation. Cost of the margin: 1.5 MB → 1.7 MB.

**Result: 2.3 MB → 1.7 MB on mobile (−26%), rendering pixel-for-pixel identically.**

- [x] `public/coffee-frames-portrait/` — 40 × 544×720 centre crops, same `-q 90 -m 6 -sharp_yuv`
      encode as the full set.
- [x] `FRAME_SETS` + `pickFrameSet()` in `CoffeeScroll.tsx`; the threshold is derived from the
      crop's own aspect, so the constant and the encode cannot drift apart.
- [x] `drawFrame` untouched — it derives cover-fit from `naturalWidth/naturalHeight`, so a
      0.755-aspect source covers a 0.461-aspect viewport correctly with no special-casing.
- [x] Verified identical: same device, same scroll offset, full set vs crop set →
      **PSNR 46.5 dB, 198 of 3,013,524 pixels differing (0.007%)**. That is *above* the 43.8 dB the
      q90 encode itself scores against the PNG source, so the residual is re-encode block alignment,
      not lost resolution.
- [x] Set selection verified per device — each fetches exactly one set, nothing is fetched twice:

      | Device | portrait set | full set |
      |---|---|---|
      | iPhone 14 Pro portrait | 40 | 0 |
      | iPhone SE portrait | 40 | 0 |
      | iPad portrait | 40 | 0 |
      | iPhone 14 Pro landscape | 0 | 40 |
      | Desktop 1440×900 | 0 | 40 |

- [x] **Rotation handled without blanking the canvas.** The naive version flashes: `resizeCanvas`
      reassigns `canvas.width` on rotate, which clears it, and `drawFrame` bails early when no image
      has loaded. So the loader now *defers adoption* — a set swap loads into a local array and only
      assigns `imagesRef.current` once the new set's priority batch is in, leaving the old frames on
      screen meanwhile. Measured across a portrait→landscape rotate: canvas **0% transparent at
      +60ms, +200ms and +500ms**, and 40 full-set frames fetched.
- [x] `loadedFramesRef` was dead (written, never read) and `settledFramesRef` never escaped the
      loader effect. Both are now effect-local arrays, which is also what lets each set own its
      flags. Two refs removed.

**Known rough edge, not fixed:** on rotate, in-flight requests from the outgoing set are not
aborted, so they briefly compete with the incoming set. Rotation is rare and the outgoing set is
usually complete by then; `img.src = ""` in the effect cleanup would close it if it ever matters.

**Still open:** the frames render identically but are *not sharper* — mobile still upscales 3.55×
from a 1280px original. Only item 1.2 fixes that, and it stays blocked on a hi-res source.

Reproduce with:
```sh
cwebp -crop 416 0 448 720 -q 90 -m 6 -sharp_yuv in.png -o out.webp   # centre 448x720 slice
```

### 1.3 Progressive reveal

`drawFrame` already falls back to the nearest loaded neighbour (`CoffeeScroll.tsx:296-318`), so a
partially-loaded strip degrades gracefully. The current code doesn't exploit that.

- [x] Added `PRIORITY_FRAME_COUNT = 5`. Only frames 0–4 are requested on mount; the remaining 35
      start via `startRemainingFrames()` once the priority batch settles. Previously all 40 fired at
      once and competed for bandwidth, which delayed the very frame the reveal was waiting on.
- [x] Progress bar now measures the priority batch (`loadedCount / PRIORITY_FRAME_COUNT`), which is
      what actually gates the reveal, so it fills honestly instead of crawling toward 40.
- [x] **Fixed the progress bug:** `markFrameSettled` incremented the counter for errored frames too,
      so a completely broken strip still displayed "100%". Only `didLoad === true` counts now;
      settle-tracking stays separate so error frames still unblock the reveal.
- [x] `LOADING_TIMEOUT_MS` 3500 → 2000.
- [x] Verified `drawFrame`'s nearest-loaded-neighbour fallback still covers the window where frames
      5–39 are in flight — unset `Image` objects report `naturalWidth === 0` and are skipped.

### 1.4 Reduce frame count 40 → 24 — NOT DONE, recommend dropping

**The rationale for this item no longer holds, and doing it now would make the hero worse.**

It was justified by payload: 40 × 609 KB was indefensible. After 1.1 the whole strip is 2.3 MB, and
cutting to 24 frames saves roughly 0.9 MB — real, but no longer decisive.

Against that, it now costs smoothness *twice over*. Frame density is frames ÷ scroll length:

| | frames | scroll | hold per frame |
|---|---|---|---|
| Before | 40 | 1100svh | ~0.28 screens |
| After Phase 2 alone | 40 | 500svh | ~0.13 screens |
| After Phase 2 **and** 1.4 | 24 | 500svh | ~0.21 screens |

Phase 2 already halves the scroll, which doubles frame density for free. Applying 1.4 on top pushes
the hold per frame back up and will read as stepping during a fast flick — the compounding effect the
original plan did not account for.

**Recommendation: close as won't-fix.** `FRAME_COUNT` is a single constant
(`CoffeeScroll.tsx:6`) if this needs revisiting after Phase 2 lands and the motion can be judged
directly.

### Acceptance criteria — Phase 1

- [x] Total hero payload under 3 MB — **2.3 MB**.
- [x] Progress percentage never reaches 100% when frames fail to load.
- [x] `npx tsc --noEmit` clean; `next build` succeeds; all 40 frames verified serving as
      `image/webp`.
- [x] Measured. See "Phase 0 / Phase 1 measurement results" below — the payload win is confirmed
      and large, but **the Lighthouse score does not move**, and the reason matters.
- [ ] ~~Hero canvas visibly sharper on retina~~ — **not achievable**, see 1.2. Quality is preserved
      relative to the PNGs but the underlying 1280×720 resolution is unchanged.

---

## Phase 0 / Phase 1 measurement results (2026-09-16)

Lighthouse 13.4.1, mobile preset, simulated throttling, 3 runs each, medians reported.
Baseline was reconstructed in a git worktree at commit `01e066b` (the 40 PNGs, pre-Phase-1 loader)
and served from a real production build, so this is a like-for-like comparison, not an estimate.

| Metric | Before (PNG) | After (WebP) | Delta |
|---|---|---|---|
| Total bytes | 24,647 KiB | **2,579 KiB** | **−89.5%** |
| Performance score | 74 / 73 / 73 | 73 / 72 / 72 | −1 (noise) |
| FCP | 757 ms | 759 ms | +2 ms |
| LCP | 2,483 ms | 2,605 ms | +121 ms (within spread) |
| Speed Index | 982 ms | 1,047 ms | +66 ms |
| CLS | **1.000** | **1.000** | unchanged |

### The score didn't move. Here is why, and why the work still counts.

Lighthouse's paint metrics are decided by the **loading screen**, which is pure DOM and CSS. The
frame strip is fetched by JS *after* first paint and gates no paint metric, so a 22 MB reduction is
invisible to FCP, LCP and Speed Index. The LCP ranges overlap run-to-run (before 2232–2577,
after 2541–2620) — that +121 ms is noise, not a regression.

The benefit is real but lands where the lab score doesn't look — time until the hero is actually
scrubbable without stutter, and data cost:

| Connection | Strip before | Strip after | Saved |
|---|---|---|---|
| Slow 3G (0.4 Mbps) | 481 s | 50 s | 431 s |
| Fast 3G (1.6 Mbps) | 120 s | 13 s | 108 s |
| Regular 4G (9 Mbps) | 21 s | 2.2 s | 19 s |
| Good LTE (25 Mbps) | 7.7 s | 0.8 s | 6.9 s |

Per 1,000 visits: **23.5 GB → 2.5 GB** of bandwidth.

On Fast 3G the old build needed two full minutes to finish the strip; anyone scrolling before then hit
the nearest-neighbour fallback and saw the animation step. That is what got fixed.

**Takeaway for later phases: stop treating the Lighthouse score as the target.** It is dominated by
the loading screen and by CLS. The two things that would actually move it are item 2.4 below and the
Phase 2 scroll work.

---

## Phase 2 — Navigation and scroll length (P0)

**Problem.** `h-[1100svh] md:h-[800vh]` (`CoffeeScroll.tsx:479`) means a mobile visitor scrolls
**eleven viewport heights** before reaching `CartShowcase`. And `frameIndex` maps
`[0, 0.65, 1] → [0, 39, 39]` (`CoffeeScroll.tsx:296`), so the final 35% — roughly **3.8 screens on
mobile** — is a frozen frame. That's dead scroll.

There is also **no navigation anywhere on the site** (confirmed: zero `<nav>` elements in `src/`).
Someone who wants to know where the cart is on Thursday must scroll the entire cinematic to find out.

**Order within this phase: 2.4 → 2.1 → 2.2 → 2.3.** 2.4 and 2.1 both change the hero container's
height, and 2.4 is the one with a measured number attached, so it goes first.

### 2.4 Fix the CLS of 1.000 — DONE (2026-09-16)

> **Outcome: CLS 1.000 → 0.002, performance score 61 → 99, LCP 4.27s → 1.45s.** The three
> scroll-reset workarounds are deleted. Measured before/after on the same machine in the same
> session — see *2.4 measurement results* below.

**This was not in the original plan and is the single worst metric on the page.** A CLS of 1.000 is
catastrophic (Google's "good" threshold is < 0.1). It is pre-existing — identical before and after
Phase 1 — so Phase 1 neither caused nor fixed it.

Lighthouse isolates it to exactly one shift, scoring a full 1.0:

```
layout-shifts: 1 layout shift found, score 1.0000
  node: <section class="relative py-24 md:py-32 bg-espresso overflow-hidden">
```

That is `CartShowcase`. The mechanism:

1. While loading, `CoffeeScroll` returns only `<LoadingScreen>` (`CoffeeScroll.tsx:468`), which is
   `position: fixed` and therefore occupies **zero layout height**.
2. So `CartShowcase`, `WeeklyLocations`, `CoffeeMenu` and the footer all lay out at the top of the
   document.
3. When `isLoaded` flips, the `h-[500svh]` hero container mounts and shoves every one of those
   sections down by several viewport heights in a single frame.

**This is the root cause of the "scroll jumping" that commits `01e066b`, `6d63dc9` and `d5e08f5`
were fighting.** The three scroll-reset effects at `CoffeeScroll.tsx:246-288` — manual
`scrollRestoration`, overflow locking, and a triple-nested `requestAnimationFrame` reset — are all
treating the symptom. The hero occupying zero height during load is the disease.

- [x] The early return is gone. The `h-[1100svh]` container now renders unconditionally, with
      `{!isLoaded && <LoadingScreen />}` as the first child of the sticky viewport-height box.
- [x] `LoadingScreen` changed from `fixed inset-0` to `absolute inset-0`. The sticky parent is a
      positioned element, so it is the containing block; the loader stays pinned over the hero for
      the whole hero range. `absolute` was chosen over `fixed` deliberately — the inner canvas
      wrapper is `overflow-hidden`, and a `fixed` child there is one ancestor `transform` away from
      being clipped.
- [x] **The container now ships in the SSR HTML** (verified: `h-[1100svh] md:h-[800vh]` is present
      in the server response). The document is full height from the very first paint, not just
      after hydration — this is what actually kills the shift.
- [x] Deleted all three scroll-reset effects (the old `CoffeeScroll.tsx:246-288`): manual
      `scrollRestoration`, the `overflow: hidden` body lock, and the triple-nested
      `requestAnimationFrame` reset. 43 lines removed, nothing replaced them.
- [x] Re-measured. CLS **1.000 → 0.0019** (3 runs, identical each time).

**Two side effects worth knowing about:**

1. **Scroll is no longer locked during loading.** Loading lasts ~2s at most (`LOADING_TIMEOUT_MS`),
   and scrolling during it now behaves correctly rather than being blocked — the loader is pinned
   inside the hero, so it stays in view for the whole hero range. A determined flick past 11
   viewport heights during those 2s would reveal the rest of the page mid-load; judged acceptable,
   and cheap to revisit once 2.1 shortens the hero.
2. **Native scroll restoration is back on.** That was the point: `scrollRestoration = 'manual'` was
   only ever needed because the document height changed after hydration. With a stable height, a
   reload now restores the reader's position correctly instead of being yanked to the top.

**Mobile verification (2026-09-16).** Re-checked under Chrome with full mobile device emulation
(touch, mobile UA, correct DPR) on three viewports, sampling `document.scrollHeight` and `scrollY`
on every animation frame across the whole load:

| Device | doc height during load | CLS | scroll drift |
|---|---|---|---|
| iPhone SE (375×667 @2x) | 12513 → 12513 **stable** | 0.0000 | 0px |
| iPhone 14 Pro (393×852 @3x) | 14453 → 14453 **stable** | 0.0000 | 0px |
| Pixel 7 (412×915 @2.625x) | 15074 → 15074 **stable** | 0.0000 | 0px |

The document height never changes at any point during load on any of them, which is the property
the fix was after. Still worth a tap-through on a physical handset before sign-off — emulation does
not reproduce the iOS dynamic toolbar, which is what makes `svh`/`vh` interesting — but the failure
mode this item targeted is gone.

### 2.4 measurement results

Lighthouse 13.4.1, `--preset=perf --form-factor=mobile --screenEmulation.mobile`, production build
served by `next start`, 3 runs each, medians reported. Both sides measured in the same session on
the same machine by toggling only the early return, so these are directly comparable to each other —
but **not** to the Phase 1 table above, which was recorded under different machine conditions.

| Metric | Before | After | Delta |
|---|---|---|---|
| **CLS** | **1.0000** | **0.0019** | **−99.8%** |
| Performance score | 61 | 99 | +38 |
| LCP | 4,273 ms | 1,449 ms | −2,824 ms |
| FCP | 1,476 ms | 1,449 ms | −27 ms |
| Speed Index | 1,590 ms | 1,563 ms | −27 ms |

**LCP is the surprise, and it is the bigger win.** The shift wasn't only a CLS problem: because
every real section laid out at the top of the document and was then thrown several viewport heights
down, the largest contentful paint could not settle until after the reveal. With the layout stable
from first paint, LCP lands at essentially the same moment as FCP.

This also answers the Phase 1 note about the score being dominated by the loading screen. It was —
and this is the item that broke that ceiling: 61 → 99.

**What remains (0.0019 total, both in the hero text overlay):**

| score | node |
|---|---|
| 0.0018 | `<div class="pointer-events-auto">` — webfont swap on the `Brew & Go` h1 |
| 0.0001 | `<span class="font-body text-xs uppercase tracking-[0.3em]">` — "Scroll to explore" |

Both are font-swap reflow, roughly 500× below the 0.1 "good" threshold. Not worth chasing here;
if it is ever worth zero, it belongs with the font loading work, not with this item.

### 2.4 (original writeup, kept for context)

### 2.1 Halve the hero scroll — SUPERSEDED by 2.2, do not apply as written

The length problem this item was aimed at is largely solved: the hero is **11.0 → 8.2 screens** on
mobile and 8.0 → 6.0 on desktop, achieved in 2.2 by deleting the frozen tail instead of compressing
the animation.

**Do not now apply `h-[500svh] md:h-[400vh]`.** With `FRAME_CURVE_END = 0.9` that would leave about
3.6 screens for 40 frames on mobile, nearly halving the scroll-per-frame — and the human has said
explicitly that the pacing up to the last frame is good. Cutting further trades a fixed complaint
for the stepping-during-a-fast-flick problem that 1.4 was closed to avoid.

- [ ] If the hero is still judged too long, the honest lever is **fewer frames, not less scroll per
      frame** — i.e. reopen 1.4 — and that needs a human to look at the motion and say so.
- [x] The five `TEXT_SECTIONS` windows were re-tuned in 2.2, so that half of this item is done.

### 2.2 Remap the frame curve — DONE (2026-09-16)

> **Outcome: the frozen tail drops from 3.58 screens to 0.78 on mobile (−78%), 2.51 → 0.54 on
> desktop — with the scroll-per-frame pacing left exactly as it was.**

Raised by the human from the live site: *"after the last frame is taking too long to scroll down so
it feels like it's frozen on the last frame — the scroll is good all the way to the last frame."*
That second clause is the constraint that shaped the fix.

**Measured before**, by stepping the hero in 120 increments and hashing the canvas to find where it
stops changing (no assumptions about the curve):

| | last frame at | frozen tail |
|---|---|---|
| iPhone 14 Pro | progress 0.642 | **3.58 screens** (3053px) |
| Desktop 1440×900 | progress 0.642 | **2.51 screens** (2257px) |

**Why the plan's original prescription was wrong for this.** Changing only the knee `0.65 → 0.85`
keeps the hero at 1100svh and *stretches* the same 40 frames over more scroll — it fixes the freeze
by making the part the human likes slower. The pacing had to be held fixed, so the tail had to be
cut from the container instead.

Holding animated distance constant while shrinking the tail:

| | hero | animated stretch | frozen tail |
|---|---|---|---|
| mobile before | 1100svh (11.0 screens) | 6.42 screens | 3.58 |
| mobile after | **820svh** (8.2 screens) | **6.42 screens** | **0.78** |
| desktop before | 800vh (8.0 screens) | 4.49 screens | 2.51 |
| desktop after | **600vh** (6.0 screens) | **4.46 screens** | **0.54** |

- [x] `FRAME_CURVE_END = 0.9` replaces the inline `0.65`, named so the text beats have something to
      be stated relative to.
- [x] Hero `h-[1100svh] md:h-[800vh]` → `h-[820svh] md:h-[600vh]`.
- [x] **All five `TEXT_SECTIONS` rescaled by `0.9 / 0.65` = 1.3846.** A beat at progress `p` sits on
      frame `p / FRAME_CURVE_END × 39`, so scaling every breakpoint by the same factor the knee moved
      keeps each beat on the exact frame it was composed against. Verified empirically — beats land
      on frames **0, 10, 17, 25, 32**, identical to before.
- [x] Section 05's `startFadeOut: 0.94` / `endFadeOut: 1.0` deliberately **not** rescaled — they are
      pinned to the end of the hold, so the CTA stays fully opaque right through it.
- [x] Re-checked 2.4 after the height change: doc height still stable through load, CLS 0.0000,
      zero scroll drift on all three mobile viewports.
- [x] Production build verified (built in an isolated copy so as not to disturb a running
      `next dev` — see the note under *Verify the state you inherited*).

**This overtakes 2.1.** The hero is already down from 11.0 to 8.2 screens on mobile, by deleting
dead scroll rather than by compressing the animation. 2.1's prescription — `h-[500svh]`, which would
put the animated stretch at roughly 3.6 screens — now **conflicts with explicit human direction that
the current pacing is good**. See 2.1.

### 2.3 Add a sticky header — CLOSED, won't-fix (human decision, 2026-09-16)

**Declined by the human:** *"the no header navigation is for the purpose of user scrolling down."*
The absence of nav is deliberate — the scroll narrative is the product, and a persistent header
undercuts it. Not a gap to be filled; leave it alone.

Noted for whoever reads this later: what was proposed was a header **hidden during the hero** that
faded in only once `scrollYProgress` passed it, so the cinematic itself was never covered. That
distinction was raised and the item still stands closed. If it is ever reopened, the cost being
accepted is that a visitor wanting Thursday's location scrolls ~8 screens to find it.

The original writeup follows for reference only — **do not implement it.**

- [ ] New `src/components/SiteHeader.tsx`: fixed, `z-30` (above the canvas's `z-20`, below the grain
      overlay). Wordmark left, `Locations` / `Menu` right.
- [ ] Hidden during the hero; fades in once `scrollYProgress` passes the hero, or via an
      `IntersectionObserver` sentinel placed after `CoffeeScroll`.
- [ ] Anchors to `#find-us-today` (exists, `WeeklyLocations.tsx:101`) and a new `#menu` id on
      `CoffeeMenu`'s `<section>`.
- [ ] Must respect the `prefers-reduced-motion` work in 4.1 — no fade, just appear.
- [ ] Mobile: the two links fit inline at 375px; no hamburger needed.

### Acceptance criteria — Phase 2

- [x] **CLS drops from 1.000 to below 0.1** — measured at **0.0019** (3 runs, median). This was the
  one hard number for this phase and it is met.
- [x] The scroll-reset effects at the old `CoffeeScroll.tsx:246-288` are deleted.
- [x] The jump does not return — verified under mobile emulation on three viewports (table in 2.4).
  A physical-handset pass is still worth doing for the iOS dynamic-toolbar case specifically.
- ~~Menu and Locations reachable in one click from any scroll position past the hero~~ — dropped
  with 2.3; the site is intentionally nav-less.
- No stretch of scroll longer than ~1 viewport height shows an unchanging frame.
- Hero still reads as a complete narrative — all five text beats land.
- [x] Performance score re-measured and it rose sharply — **61 → 99** from 2.4 alone. 2.1–2.3 are
  now UX work, not score work; the score headroom is largely spent.

---

## Phase 3 — Contrast and the colour system (P0)

### 3.1 Scrim behind the canvas text — DONE (2026-09-16)

> **Outcome: the hero frames are left completely undarkened, and hero text carries its own glyph
> shadows.** 25 of 48 sampled readings clear WCAG AA (against 9 of 15 before). Full AA was reachable
> and was rejected on looks, three times — the trade and the remaining failures are documented in
> *Final state* below. Read it before changing anything here.

**The plan's prescription did not survive measurement.** It called for
`from-espresso/50 via-transparent to-espresso/40` — a gradient that is *transparent in the middle*,
which is exactly where beats 01 and 05 sit, both `position: "center"`. It would have missed them.

Measured contrast per beat on an iPhone 14 Pro, sampling the real composited pixels (screenshot with
the text layers hidden, then sample under each glyph box) rather than reading the canvas — the canvas
alone omits the scrim, which is a DOM layer above it:

| Beat | Element | Before | After |
|---|---|---|---|
| 01 | "Scroll to explore" | **1.64:1** | **4.89:1** |
| 01 | "Craft in Every Cup" | 2.31:1 | 5.67:1 |
| 01 | "Brew & Go" | 3.33:1 | 5.94:1 |
| 02 | "Sourced from highland…" | 2.52:1 | 6.59:1 |
| 04 | "Every pour is intentional" | 2.66:1 | 6.85:1 |
| 05 | "Taste the Difference" | 7.84:1 | 3.27:1 (still passes, large text) |

Three changes, all needed — the scrim alone is not sufficient:

- [x] **No area darkening at all — the frames are untouched.** Contrast comes from shadowing the
      letterforms: a tight `0 0 3px` pass that haloes small glyphs on all sides, plus a wider
      `0 2px 10px` that lifts them off busy frames.
- [x] **Accent for dark backgrounds** added: `amber-light` `#E6B863` (same hue and saturation as the
      brand amber, lightness raised 44% → 64%). The hero eyebrows use it; `#C4841D` reads as low as
      2.94:1 on a scrimmed frame. Added to `tailwind.config.ts` and `globals.css` together, since the
      two palettes are duplicated and drift silently.
- [x] **Opacity dialling retired in the hero** — `text-cream/90`, `/60` and `/40` all become
      `text-cream`. This was over half the problem: `/40` was subtracting contrast from a backdrop
      that was already uncontrolled. Hierarchy now comes from size and weight. (Part of 3.3, done
      here because the scrim could not reach AA without it.)
- [x] **Section 05's `text-espresso` special case removed**, as the plan wanted — cream is safe on
      every frame now.

**Why a scrim alone could never have worked:** with text promoted to full opacity but the accent
left alone, the worst case only reaches **3.7:1 even at espresso/60**, because amber `#C4841D`
against pure espresso tops out at 5.35:1. The binding constraint is not the backdrop, it is the
accent colour at 12px.

### Final state: frames untouched, 25 of 48 samples clear AA — read this before "fixing" it

**Every area-based approach was tried, measured, and rejected on looks.** Four rounds, in order:

| Approach | Measured | Verdict |
|---|---|---|
| Full-frame scrim `/45` | 48/48 pass | *"the image got too dark, make less faded"* |
| Full-frame scrim `/40 /30 /40` | 44/48 pass | *"the hero section frames are looking too dark"* |
| Radial pool behind each text block | 48/48 pass | *"the initial frame has a brown cloud under the title"* |
| **Glyph shadows only (shipped)** | **25/48 pass** | frames untouched |

So the shipped state is a deliberate, informed trade: **the imagery wins, and hero text does not meet
WCAG AA on the bright frames.** That is a decision, not an oversight. Do not "fix" it by reintroducing
a scrim or a pool — all three were seen and rejected.

**What still fails** (worst reading of each, across 48 samples):

| Ratio | Needs | Element |
|---|---|---|
| 1.78:1 | 3.0 | "Taste the Difference" (36px) |
| 2.05:1 | 3.0 | "Rooted in Tradition" (36px) |
| 2.07:1 | 4.5 | "From soil to sip…" (16px) |
| 2.53:1 | 4.5 | "02 — Grounded" (12px) |
| 2.93:1 | 4.5 | "Scroll to explore" (12px) |
| 3.13–3.85:1 | 4.5 | three more body/eyebrow lines |

The failures cluster on the bright latte frames (beats 03 and 05). Note the two 36px headlines miss
even the relaxed 3:1 large-text bar, so **bumping type size cannot rescue them** — four of the
smaller lines would pass at large-text size, but the headlines would not.

**Glyph shadows buy real legibility but zero measured contrast.** WCAG scores text against its
backdrop and gives no credit for a shadow, so the numbers above understate how this actually reads —
on screen the shipped hero is markedly clearer than the 1.64:1 starting point. The gap between
"reads fine" and "scores badly" is the whole story of this item.

**To reach genuine AA later, something has to give**, and each option is a design concession:
- Re-grade the bright frames (03, 05, 19) darker at source. Fixes the cause, touches no code, and is
  the only option that costs the design nothing at runtime.
- Dark text on the bright beats instead of cream — but that is the per-frame special-casing 3.1
  deleted, and it breaks the moment the strip is re-exported.
- Reinstate area darkening. Rejected three times; do not re-propose without new information.

Checked at 1440×900: no horizontal overflow.

### Still open for 3.2 — the *light*-background half

The hero is done. `text-amber` on light surfaces below the hero is untouched and still fails at
2.78:1 (`CartShowcase.tsx:25`, `WeeklyLocations.tsx:109`, `CoffeeMenu.tsx:123`, `page.tsx:40/56`).
The token split now exists — `amber` for light backgrounds, `amber-light` for dark — so 3.2 is
reduced to picking the darker value (plan proposes ≈`#8A5A0F`) and sweeping those call sites.

### 3.1 (original writeup, kept for context)

Overlays are `text-cream/90` (`CoffeeScroll.tsx:89, 118, 138, 158`) sitting directly on whatever
frame happens to be underneath. Section 05 switches to `text-espresso` (`CoffeeScroll.tsx:178`),
which confirms the later frames are light — so the earlier cream text is riding on luck for the
frames in between, and it breaks the moment the animation is re-exported.

- [ ] Add a scrim layer inside the sticky container at `z-[5]`, above the canvas and below the
      overlays: `bg-gradient-to-b from-espresso/50 via-transparent to-espresso/40`.
- [ ] Remove the `text-espresso` special-case on section 05 — cream becomes safe everywhere.

### 3.2 Fix the amber accent — CLOSED (demo site)

Measured WCAG ratios against the actual tokens:

| Combination | Ratio | Verdict |
|---|---|---|
| `text-amber` on cream / foam | **2.78 / 2.93 : 1** | fails |
| `text-amber` on espresso | 5.35 : 1 | passes |
| `text-walnut/40` on cream | **2.00 : 1** | fails |
| `text-walnut/50` on cream | **2.45 : 1** | fails |
| `text-walnut/60` on foam | 3.11 : 1 | large text only |
| `text-cream/30` on espresso | **2.52 : 1** | fails |
| `text-cream/15` on espresso | **1.53 : 1** | fails |
| `placeholder:text-cream/20` | **1.81 : 1** | fails |
| `text-cream/40` on espresso | 3.46 : 1 | large text only |
| `text-cream/50` on espresso | 4.65 : 1 | passes |
| `text-espresso/80` on cream | 8.23 : 1 | passes |

`#C4841D` is the brand accent and it is used for **every section eyebrow** at `text-xs` on a light
background (`CartShowcase.tsx:25`, `WeeklyLocations.tsx:109`, `CoffeeMenu.tsx:123`,
`CoffeeScroll.tsx:118/138/158`, `page.tsx:40/56`). At 2.78:1 it reads as decoration, not text.

- [ ] Add a darker `amber` for light backgrounds — around `#8A5A0F` clears 4.5:1 and keeps the
      warmth. Verify the exact value with the contrast script before committing.
- [ ] Keep the current `#C4841D` as `amber-light` for use on espresso, where it already passes.
- [ ] Update `tailwind.config.ts` and the `--color-amber` custom property in `globals.css:9`
      together — they are currently duplicated and must not drift.
- [ ] Sweep all `text-amber` call sites and pick the right one per background.

### 3.3 Retire opacity-dialled text

The codebase dials arbitrary opacities (`/15`, `/20`, `/30`, `/40`, `/50`, `/60`, `/70`, `/80`, `/90`)
per element. `text-cream/15` on the copyright line (`page.tsx:96`) is effectively invisible.

- [ ] Define three muted tokens per surface (e.g. `on-dark-strong` / `-muted` / `-faint`, likewise
      for light), all verified ≥ 4.5:1 for body text and ≥ 3:1 for large.
- [ ] Replace every `/NN` text opacity with a token. Background and border opacities can stay.

### Acceptance criteria — Phase 3

- No body-size text below 4.5:1 anywhere on the page.
- No large text below 3:1.
- Canvas overlay text legible on every one of the 24 frames, checked by scrubbing.

---

## Phase 4 — Accessibility — CLOSED IN FULL (demo site)

> Every item below was closed on 2026-09-17: *"this is a demo website."* Kept for the record, not as
> a backlog. Do not re-pitch on accessibility grounds.

A grep for `aria-`, `role=`, `<label`, `<form`, `<nav`, and `prefers-reduced-motion` across `src/`
returns **nothing at all**.

### 4.1 `prefers-reduced-motion` — CLOSED (demo site)

This site is almost entirely motion: a 40s infinite marquee (`CoffeeMenu.tsx:103`), a
scroll-hijacked canvas, a looping arrow (`CoffeeScroll.tsx:99-105`), `animate-steam` and
`animate-spin-slow` (`globals.css:67-96`), and global `scroll-behavior: smooth` (`globals.css:15`).
For a vestibular-sensitive visitor the page is currently unusable.

- [ ] Add to `globals.css`:
  ```css
  @media (prefers-reduced-motion: reduce) {
    html { scroll-behavior: auto; }
    .animate-steam, .animate-spin-slow { animation: none; }
  }
  ```
- [ ] Gate the marquee — render the static list, no `motion.div`.
- [ ] Gate the bouncing scroll arrow.
- [ ] **Hero fallback:** when reduced motion is set, render a single static frame with the five text
      blocks stacked as ordinary sections, and drop the `h-[500svh]` container entirely. Read the
      preference with a `useReducedMotion()` hook from framer-motion (already a dependency).

### 4.2 The newsletter form is decorative — CLOSED (demo site)

`page.tsx:80-90` is a bare `<input>` and `<button>` — no `<form>`, no `<label>`, no `type`, no
handler. A dead signup box costs trust.

- [ ] Either wire it to a real endpoint, or remove it. Do not ship it non-functional.
- [ ] If kept: wrap in `<form>`, add a visually-hidden `<label>`, `type="submit"`, `required`,
      `autoComplete="email"`, and a success/error state.

### 4.3 Menu hover is desktop-only — CLOSED (demo site)

`hoveredItem` is driven purely by `onMouseEnter`/`onMouseLeave` (`CoffeeMenu.tsx:155-156`) on a
`cursor-default` div. Touch and keyboard users never see the state, and every mouse move re-renders
the whole grid.

- [ ] Replace the React state with CSS `group-hover:` and `focus-within:` classes.
- [ ] Make each row focusable if it is meant to be interactive — otherwise drop the affordance and
      keep the card static.

### 4.4 ARIA semantics — CLOSED (demo site)

- [ ] Day selector (`WeeklyLocations.tsx:152`): `role="tablist"` / `role="tab"` / `aria-selected`,
      with the detail panel as `role="tabpanel"`.
- [ ] Category filters (`CoffeeMenu.tsx:138`): `aria-pressed` on each button.
- [ ] `<canvas>` (`CoffeeScroll.tsx:483`): `role="img"` plus a descriptive `aria-label`.
- [ ] Empty-filter state: if a category yields zero items, render a message rather than a blank grid.

### 4.5 Focus indicators — CLOSED (demo site)

- [ ] `focus:outline-none` on the email input (`page.tsx:85`) with only a border-colour change is not
      a sufficient indicator. Add a visible ring.
- [ ] Add a global `:focus-visible` ring token that works on both cream and espresso surfaces.

### 4.6 Placeholder links — CLOSED (demo site)

- [ ] `href="#"` on all three social links (`page.tsx:61, 67, 73`). Point them somewhere real or
      remove them.

### Acceptance criteria — Phase 4

- Full keyboard traversal of the page with a visible focus indicator at every stop.
- With reduced motion enabled, nothing loops and the hero is a static, readable section.
- axe DevTools reports zero violations.

---

## Phase 5 — Content correctness (P0/P1)

### 5.1 Location dates are stale (P0) — DONE

`"Apr 14"` … `"Apr 20"` are hardcoded (`WeeklyLocations.tsx:9-57`) while `getTodayIndex()` reads the
real clock. Today is 2026-09-16, so the card confidently shows "Wednesday — Apr 16" with a pulsing
"Open Now" badge.

- [x] Removed the `date` field from `LOCATIONS`; `getWeekDates(now)` derives Mon–Sun labels from the
      week containing `now`, built with the `Y, M, D` `Date` constructor so DST weeks stay correct.

### 5.2 Hydration mismatch on "today" (P0) — DONE

`getTodayIndex()` (`WeeklyLocations.tsx:65-68`) is called during render in a client component, so SSR
uses the server's timezone and the client re-renders with its own. Across a midnight boundary that is
a React hydration mismatch.

- [x] `todayIndex` and `weekDates` are `null` until a mount `useEffect` reads the clock; `activeDay`
      starts at Monday. First paint is neutral: no date, no "Today" badge, no status pill. Note for
      5.3: it builds on this — the status pill may only be computed client-side.

### 5.3 "Open Now" ignores the clock — CLOSED (demo site)

At 3am on a Wednesday the card still says "Open Now" with a pulsing green dot
(`WeeklyLocations.tsx:70-90`).

- [ ] Parse `current.hours` and compare against the current time. Three states: Open Now, Opens at
      {time}, Closed for today.
- [ ] Rename the past-day label — Monday is not "Closed", it has already happened. "Past" or a
      neutral dot reads better.

### 5.4 Footer hours contradict the locations data (P1) — DONE (2026-09-17)

Footer says Mon–Fri 7am–2pm (`page.tsx:44`), but Wednesday is 7–3 and Thursday is 8–2. Still true as
of 2026-09-17; session 5 changed the stops but kept every day's hours, so the contradiction is
unchanged rather than newly introduced.

- [x] ~~Move `LOCATIONS` into `src/lib/locations.ts` (the directory exists and is empty).~~ **DONE**
      2026-09-17 (session 5) — the file now also holds the `Stop` type and the geo helpers.
- [x] ~~Derive the footer hours from it so the two cannot drift.~~ **DONE** 2026-09-17 (session 6)
      — `weeklyHours()` in `src/lib/locations.ts`, rendered by `page.tsx`. See 7.0 for the outcome.

### 5.5 No real business information — CLOSED (demo site)

No phone number, no actual address, no ordering link anywhere on the site. For a coffee cart this is
probably worth more than another animation.

- [ ] Add phone and a contact route.
- [ ] Add `LocalBusiness` JSON-LD to `layout.tsx`.

### 5.6 No server-rendered `<h1>` (P1)

The `<h1>` lives inside `TEXT_SECTIONS` (`CoffeeScroll.tsx:89-91`), which only renders after
`isLoaded` flips client-side (`CoffeeScroll.tsx:468`). Bad for SEO and for anything reading the page
without running JS.

- [ ] Render the hero heading in the server HTML — visually hidden during loading if necessary, or
      as part of the loading screen itself.

### 5.7 Site metadata (P1) — DONE (2026-09-17)

- [x] ~~Add `metadataBase`, `openGraph` (with an OG image), `twitter`, and `themeColor`.~~
- [x] ~~Add `src/app/icon.png` and `apple-icon.png`.~~

**Done 2026-09-17 (session 6).** `layout.tsx` now carries `metadataBase`, `openGraph`, `twitter`
(`summary_large_image`) and a `viewport` export with `themeColor` — cream for light, espresso for
dark. `themeColor` goes in `viewport`, not `metadata`; Next 14 warns otherwise.

`metadataBase` is `NEXT_PUBLIC_SITE_URL` → `VERCEL_PROJECT_PRODUCTION_URL` → `http://localhost:3000`.
The site has no domain yet, so the fallback is honest rather than a made-up host: set the env var
when it lands somewhere and every absolute URL follows.

Four PNGs under `src/app/`, picked up by filename: `icon.png` (512², 4.7 kB), `apple-icon.png`
(180², 1.5 kB), `opengraph-image.png` and `twitter-image.png` (1200×630, 52 kB each, same bytes).
They are **generated, not drawn** — `tools/brand/` holds the HTML sources and the renderer, and
reuses the site's own materials: the mark is the vessel path from the menu's build diagrams, the
colours are the Tailwind palette, the card is set in Playfair Display and DM Sans. See
`tools/brand/README.md` to regenerate.

Verified against `next dev`: `og:image`, `twitter:image`, both `theme-color` variants and the
`icon` / `apple-touch-icon` links are all in the served HTML, and all four image routes return 200
with `image/png`. A build in a throwaway copy lists them as static routes and leaves `/` at 57.3 kB.

### Acceptance criteria — Phase 5

- Dates and open/closed status are correct at any time of day, in any timezone.
- No hydration warnings in the console.
- Footer hours and location hours agree by construction.
- Link preview renders with an image and a title.

---

## Phase 6 — Polish and refactors (P2)

### 6.1 Marquee won't loop seamlessly — DONE (2026-09-17)

`animate={{ x: [0, -2400] }}` (`CoffeeMenu.tsx:103`) is a hardcoded pixel distance, but the track
width changes between `text-2xl` and `md:text-3xl`. At one of those breakpoints there is a visible
jump every 40s.

- [x] ~~Duplicate the item list and animate to `-50%` instead.~~

**Done 2026-09-17 (session 6).** Four copies of `MARQUEE_ITEMS` on a `w-max` track, animated
`x: ["0%", "-50%"]` over 60s. `w-max` is the load-bearing part: a plain flex child is as wide as its
parent, so `-50%` would have measured the viewport rather than the track.

Two copies would also loop cleanly, but at the end of the run only one copy's width is left to cover
the window — fine at 1440, a gap on a 2560 monitor. Four copies leave two copies' width in hand.

Measured over CDP, comparing the animated distance against the width of the two leading copies:

| Viewport | Half the track | Two copies | Δ | Tail ≥ viewport | Speed |
|---|---|---|---|---|---|
| 390 | 3375.92 px | 3375.92 px | **0** | yes | 56 px/s |
| 1440 | 3979.89 px | 3979.89 px | **0** | yes | 66 px/s |
| 2560 | 3979.89 px | 3979.89 px | **0** | yes | 66 px/s |

The old `-2400` was neither: 60 px/s and a seam at whichever breakpoint it did not match. The three
duplicate copies are `aria-hidden`.

### 6.2 `<Image fill>` without `sizes`

`CartShowcase.tsx:49` — Next serves the largest candidate to every device.

- [ ] Add `sizes="(max-width: 768px) 100vw, 1152px"`.

### 6.3 Content depends on JS

`CartShowcase` and `WeeklyLocations` start at `opacity: 0` and depend on `useInView` to reveal
(`CartShowcase.tsx:20-22`, `WeeklyLocations.tsx:97-99`). If hydration is slow or fails, those
sections stay blank.

- [ ] Switch to `whileInView`, or add a CSS-only fallback so content is visible without JS.

### 6.4 The grain overlay costs more than it gives

`globals.css:52-66` is a `position: fixed`, 200%×200%, `z-9999` layer at 0.03 noise × 0.4 opacity —
barely perceptible, but it forces a full-viewport composited layer on every scroll frame of an
already canvas-heavy page. It also sits above everything, so any future modal or toast renders
underneath it.

- [ ] Either raise the opacity to where it is actually visible, or remove it. Lower the `z-index`
      below any future overlay layer regardless.

### 6.5 Inverted type hierarchy in menu rows — DONE (2026-09-17)

Price was `text-2xl` while the drink name was `text-xl`, so the price won the row.

- [x] ~~Swap the emphasis.~~ **DONE** in session 5's Signature Serves rework: the name is now
      `text-2xl` and the price `text-xl`. Folded in because the rework rewrote those exact lines.

### 6.6 Four copies of the same section header

The eyebrow + `h2` + paragraph pattern is repeated in `CartShowcase.tsx:24-38`,
`WeeklyLocations.tsx:108-120`, `CoffeeMenu.tsx:122-134`, and `page.tsx:19-27`.

- [ ] Extract a `SectionHeading` component. This is also where the amber fix from 3.2 gets applied
      once instead of four times.

### 6.7 Brittle category derivation — DONE (2026-09-17)

`getCategory` string-matched on `"Iced"` / `"Cold Brew"`.

- [x] ~~Put an explicit `category` field on each `MenuItem`.~~ **DONE** in session 5. `getCategory`
      is gone; `MenuItem.category` is a typed `"Hot" | "Iced" | "Specialty"`. Filters verified in a
      browser: Hot 7, Iced 2, Specialty 1, All 10.

### 6.8 Repo hygiene

- [ ] `.DS_Store` and `tsconfig.tsbuildinfo` are in the working tree. Add to `.gitignore` and
      `git rm --cached`.
- [x] ~~`tests/` is empty~~ — populated by 7.2 (session 6). `src/lib/` was populated in session 5.

---

## Phase 7 — implementation queue (opened 2026-09-17, CLOSED 2026-09-17)

Queued at the human's request at the end of session 5, after the Signature Serves rework and the
Find Us Today map landed and were reviewed. Ordered by value-to-effort. Two entries are existing
items promoted into this queue rather than renumbered — follow their own sections for detail.

**All five shipped in session 6.** The table below is the record; each row's own section holds the
measurements.

| Order | Item | Status | Priority | Effort | Files |
|---|---|---|---|---|---|
| 1 | ~~**5.4** Footer hours contradict `LOCATIONS`~~ | **done** 2026-09-17 | P1 | S | `page.tsx`, `src/lib/locations.ts` |
| 2 | ~~**7.1** Map has no WebGL fallback~~ | **done** 2026-09-17 | P1 | S | `WeeklyLocations.tsx` |
| 3 | ~~**7.2** Session-5 invariants are untested~~ | **done** 2026-09-17 | P1 | M | `tests/`, `package.json` |
| 4 | ~~**6.1** Seamless marquee loop~~ | **done** 2026-09-17 | P2 | S | `CoffeeMenu.tsx` |
| 5 | ~~**5.7** Favicon and link metadata~~ | **done** 2026-09-17 | P2 | S | `layout.tsx`, `src/app/` |

### 7.0 5.4 went first — its blocker was already gone

Not a new item; recorded here because the reason it had been parked no longer held. 5.4's row named
"new `src/lib/locations.ts`" as a prerequisite, and **that file now exists** — created in session 5
to hold the stop coordinates and geo helpers. It exports `LOCATIONS` with a typed `hours` field.

The contradiction is live and visible: the footer claims `Mon — Fri 7am — 2pm`, while the data says
Wednesday is `7:00 AM — 3:00 PM` and Thursday is `8:00 AM — 2:00 PM`. Both render on the same page.

- [x] ~~Group `LOCATIONS` by identical `hours` and render the footer from that grouping.~~
- [x] ~~Keep the "Mon — Fri" collapsing, but derive it — do not hardcode the ranges again.~~
- [x] ~~Verify by changing one day's hours and confirming the footer follows.~~

**Done 2026-09-17 (session 6).** `weeklyHours()` in `src/lib/locations.ts` groups the stops by
identical `hours` in day order, names each group the way a sign would (one day in full, a run of
three or more as `Mon — Fri`, anything else listed), and compacts `7:00 AM — 3:00 PM` to `7am — 3pm`
— keeping half-hours (`8:30am`) and passing unparseable strings through untouched. `page.tsx`
renders that list; nothing in the footer restates an hour.

The real data has no weekday run, so the footer now reads five honest rows instead of three wrong
ones:

```
Mon, Fri   7am — 2pm      Wednesday  7am — 3pm      Sunday  8am — 12pm
Tue, Sat   7am — 1pm      Thursday   8am — 2pm
```

Drift test, run against `next dev`: setting Tue/Wed/Thu to `7:00 AM — 2:00 PM` collapsed the footer
to `Mon — Fri 7am — 2pm`, and `8:30 AM` on Sunday rendered as `8:30am — 12pm`. Reverted after.

### 7.1 The map has no WebGL fallback (P1) — DONE (2026-09-17)

`WeeklyLocations.tsx` embeds `openstreetmap.org/export/embed.html`. That embed now **requires
WebGL**: where WebGL is unavailable it renders its own blue panel reading *"your browser does not
support WebGL"* inside the otherwise-styled cream card. Observed directly in session 5 — headless
Chrome with `--disable-gpu` reproduces it exactly, which is also the easiest way to test the fix.

Rare on real devices, but it is a hole in a section that is otherwise defensive (the geolocation
path degrades cleanly on deny, unsupported and timeout; this one does not degrade at all).

- [x] ~~Probe once on mount.~~ `useHasWebGL()` in `src/lib/useHasWebGL.ts`.
- [x] ~~When absent, render a styled placeholder instead of the `<iframe>`.~~
- [x] ~~Test with `--disable-gpu` and with software WebGL.~~

**Done 2026-09-17 (session 6).** `useHasWebGL()` returns `boolean | null`; `null` means "not probed
yet", so the embed stays put on the first paint and the common case never flashes a placeholder.
When the probe comes back false, `WeeklyLocations.tsx` renders the whole map area as one link to
`mapViewUrl()` — pin glyph, the stop's name, and *"This browser can't draw the map — open it on
OpenStreetMap"*. It is a 220/280 px target, so it is also the tap target. The address, hours,
"Open in a larger map" and Get Directions all stay where they were, so nothing is lost with the
embed; the placeholder deliberately does **not** repeat the address that sits directly above it.

Verified over CDP against `next dev` (headless Chrome 131, `~/.cache/puppeteer`):

| Chrome flags | probe | rendered |
|---|---|---|
| `--disable-gpu` | `false` | placeholder, no iframe |
| `--use-angle=swiftshader --enable-unsafe-swiftshader` | `true` | the OSM embed |

> Gotcha: `--dump-dom` is useless for this — it captures before hydration, so the probe still reads
> `null`. Drive the page over the DevTools protocol and evaluate after a few seconds instead.

### 7.2 Session-5 invariants are untested (P1) — DONE (2026-09-17)

`tests/` exists and is **empty**; `package.json` has no test script. Session 5 added data with rules
that break silently rather than loudly:

- every drink's `build[].percent` must sum to **100** (`CoffeeMenu.tsx`) — the drink diagrams divide
  the vessel by these, so a bad sum renders a subtly wrong picture with no error;
- every `Stop` needs coordinates, and they should sit inside a Central Valley bounding box — a typo'd
  sign or digit silently moves the cart to another continent;
- `distanceMiles` / `nearestStopIndex` (`src/lib/locations.ts`) are pure and trivially testable.

The percentage invariant was checked in session 5 with a throwaway script. That check should be
permanent rather than re-derived by hand each session.

- [x] ~~Add a runner.~~ `node --test`, no new dependency — Node 24 strips the types itself.
- [x] ~~Cover pour sums, coordinate bounds, a known distance and `nearestStopIndex`.~~
- [x] ~~Wire `npm test` and note it in *Verify the state you inherited*.~~

**Done 2026-09-17 (session 6).** `npm test` →
`node --test --disable-warning=MODULE_TYPELESS_PACKAGE_JSON "tests/*.test.ts"`, 14 tests, ~0.3 s.

The drink data moved out of the component into **`src/lib/drinks.ts`** (types, `POUR`, `MENU_ITEMS`)
so a test can import it without JSX; `CoffeeMenu.tsx` keeps the vessel geometry and the UI. That is
the only production change 7.2 made.

- `tests/drinks.test.ts` — every drink has a build; pours sum to 100; each pour is a positive whole
  number; colours come from the shared `POUR` palette; strength is 1–5 and prices match `$0.00`.
- `tests/locations.test.ts` — the week is complete and Monday-first; every stop sits in a Central
  Valley box (37.0–38.0 N, 121.5–120.3 W); hours parse; Turlock → Modesto is 12.8 mi and the
  distance is symmetric; `nearestStopIndex` returns Tuesday from Ceres and each stop from its own
  coordinates; `formatMiles`; plus `compactHours` and `weeklyHours` from 5.4, including the
  "Mon — Wed" run collapsing and the non-adjacent "Mon, Wed" case.

Both invariants were confirmed to fail loudly: a pour changed to 16 gives *"Espresso pours sum to
101, not 100"*, a flipped longitude sign gives *"Wednesday (Stanislaus State): longitude 120.85578 is
outside the valley"*. Reverted after.

`tsconfig.json` gained `allowImportingTsExtensions` — Node needs the `.ts` in the import specifier,
and TypeScript rejects it otherwise. Safe here because the project is `noEmit`.

### Acceptance criteria — Phase 7 — ALL MET (2026-09-17, session 6)

- [x] Footer hours and location hours agree by construction; changing one moves the other.
- [x] The Find Us card degrades to a usable placeholder without WebGL, with directions still
      reachable.
- [x] `npm test` runs green (14 tests) and fails loudly if a pour sum or a coordinate is edited
      wrongly — both were broken on purpose to confirm it.
- [x] The marquee loops with no visible seam: 0 px error at 390, 1440 and 2560.
- [x] The site has a favicon and a non-blank link preview.

Commits, in order: `5da0312` (5.4), `1f40dd5` (7.1), `facb58a` (7.2), `5a9fd45` (6.1), and 5.7.

---

## Reproducing the work

### Regenerate the optimised frames

If `public/coffee-frames/` is ever lost, restore the PNGs and re-encode. Requires `cwebp`
(`brew install webp`).

> ⚠️ **`git checkout <sha> -- public/` no longer works.** The 2026-09-17 rewrite purged the PNGs
> from every commit. They exist only in the pre-rewrite bundle:
> `/Users/thiagoricci/Downloads/Projects/coffee-cart-pre-purge.bundle`. Clone it to a temp dir
> (`git clone <bundle> /tmp/png-src`) and copy `public/ezgif-frame-*.png` from its `main`. If that
> bundle is gone, the PNGs are gone.

```sh
cp /tmp/png-src/public/ezgif-frame-*.png public/    # from the bundle clone, not from git
mkdir -p public/coffee-frames
for f in public/ezgif-frame-*.png; do
  b=$(basename "${f%.png}"); n="${b##*-}"
  cwebp -quiet -q 90 -m 6 -sharp_yuv "$f" -o "public/coffee-frames/frame-${n}.webp"
done
rm -f public/ezgif-frame-*.png
```

Expect 40 files, 2.3 MB total. **q90 is deliberate, not a default** — see 1.1 for the PSNR data.

### Re-run the Lighthouse comparison

Requires Chrome. Lighthouse 13.4.1 via `npx lighthouse`.

```sh
# current build
npx next build && npx next start -p 3201 &
# baseline, from a throwaway worktree
git worktree add --detach /tmp/lh-baseline 01e066b   # NOTE: no longer has the PNGs — see below
ln -s "$PWD/node_modules" /tmp/lh-baseline/node_modules
(cd /tmp/lh-baseline && npx next build && npx next start -p 3202 &)

for port in 3201 3202; do
  npx lighthouse http://localhost:$port/ --preset=perf --form-factor=mobile \
    --screenEmulation.mobile --throttling-method=simulate \
    --output=json --output-path=/tmp/lh-$port.json \
    --chrome-flags="--headless=new --no-sandbox --disable-gpu" --quiet
done

git worktree remove --force /tmp/lh-baseline   # clean up when done
```

Run each at least 3 times and take medians — single runs vary by ~350 ms on LCP, which is wider than
most deltas you will be chasing.

### Gotchas hit in session 1 — do not lose time to these again

- **`next start` fails silently if `.next/BUILD_ID` is missing.** An interrupted or partial build
  leaves a `.next/` directory that looks populated but has no `BUILD_ID`, and the server exits with
  "Could not find a production build". Check `cat .next/BUILD_ID` before trusting a server.
- **Write readiness loops that actually assert.** A loop of
  `for i in $(seq 1 40); do curl ... && break; done; echo "server up"` prints "server up"
  unconditionally, even when every request failed. Capture the status code and branch on it, or a
  dead server reads as a healthy one and Lighthouse fails with a confusing
  `CHROME_INTERSTITIAL_ERROR`.
- **The worktree needs `node_modules`.** Symlink the main checkout's rather than reinstalling.
- **Kill the servers and remove the worktree afterwards** — `pkill -f "next start -p 320"` and
  `git worktree remove --force`.

---

## Appendix — measured baseline

**Assets (2026-09-16):**
- 40 × `public/ezgif-frame-*.png` — 23.8 MB total, 609 KB average, 1280×720
- `public/coffee-cart.JPG` — 470 KB, 2048×1152
- No favicon or icon of any kind

**Grep results across `src/`:** zero matches for `aria-`, `role=`, `<label`, `<form`, `onSubmit`,
`<nav`, `prefers-reduced-motion`, `sizes=`. Re-verified at the end of session 1 — still zero; Phase 1
touched none of this.

> **Line references in this document** were re-derived against the working tree at the end of
> session 1 and are accurate as of then. `CoffeeScroll.tsx` shifted by roughly +30 lines during
> Phase 1, so any reference quoted from the original review will be stale. If one does not match,
> grep for the quoted code rather than trusting the number.

**Contrast:** see the table in 3.2. Computed with the WCAG 2.x relative-luminance formula against the
tokens in `tailwind.config.ts`, compositing each `/NN` opacity over its actual background.
