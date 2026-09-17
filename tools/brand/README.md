# Brand sources

The favicon and the link-preview card are static PNGs under `src/app/`, rendered
from the two HTML files here so they can be regenerated rather than redrawn.
Both reuse the site's own materials: the cup is the vessel path the menu's build
diagrams are drawn in, the colours are the Tailwind palette, and the type is the
same Playfair Display / DM Sans pair `layout.tsx` loads.

| Source | Output | Size |
|---|---|---|
| `icon.html` | `src/app/icon.png` | 512 × 512 |
| `icon.html` | `src/app/apple-icon.png` | 180 × 180 |
| `opengraph-image.html` | `src/app/opengraph-image.png` | 1200 × 630 |
| `opengraph-image.html` | `src/app/twitter-image.png` | 1200 × 630 (same bytes) |

`render.mjs` drives headless Chrome over the DevTools protocol — there is no
puppeteer in this project, and `--screenshot` cannot wait for webfonts.

```sh
CHROME="$HOME/.cache/puppeteer/chrome/mac_arm-131.0.6778.204/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing"
"$CHROME" --headless=new --no-sandbox --remote-debugging-port=9336 \
  --user-data-dir="$(mktemp -d)" about:blank &

node tools/brand/render.mjs 9336 "file://$PWD/tools/brand/icon.html"             512  512 src/app/icon.png
node tools/brand/render.mjs 9336 "file://$PWD/tools/brand/icon.html"             180  180 src/app/apple-icon.png
node tools/brand/render.mjs 9336 "file://$PWD/tools/brand/opengraph-image.html" 1200  630 src/app/opengraph-image.png
cp src/app/opengraph-image.png src/app/twitter-image.png
```

The OG card pulls its webfonts from Google, so rendering it needs the network.
