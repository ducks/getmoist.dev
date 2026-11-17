# Wave art direction

The supplied mockup guides the composition, navy/ivory/electric-blue palette,
bold headings, monospaced body text, text-only project cards. The footer uses a solid navy surface.
It is not embedded as a screenshot. Text, navigation, links and cards are HTML.
The established project catalog remains the source of truth; no Research model
section or LittleRack entry was restored.

## Independent artwork

Generated with the built-in image generation tool, then converted with ImageMagick
to WebP. Original generated files remain outside the repository. The committed
optimized assets are sufficient to build offline.

- `static/assets/surf-hero.webp`: 1600 px wide, quality 82, about 264 KiB.
- `static/assets/surf-hero-small.webp`: 800 px wide, quality 80, about 81 KiB.
- `static/assets/surf-moon.webp`: independent 360 px square illustration, about 42 KiB.

The hero uses responsive sources and high fetch priority. Other illustrations
load lazily, have explicit dimensions, and use empty alternative text because
they decorate text that already identifies the projects. No words are baked
into these images. The artwork is static; no animation library is required.

### Hero prompt

Create a standalone website artwork asset, not a website or screenshot. Wide
landscape 3:2 composition. A magnificent detailed dark navy and ocean-blue breaking
ocean wave, curling high on RIGHT side with finely stippled white spray, flowing
down to lower left edge. LEFT upper half must remain empty solid near-white
#f8f6f2 for live HTML text overlay. Vintage Japanese woodblock influence combined
with detailed photographic surf, sophisticated limited navy cyan ivory palette,
subtle engraved grain inside wave only. No lettering, no text, no UI, no logos,
no border, no sun, no land. Wave fills bottom half and right two thirds, crest
reaches upper right. Background seamlessly flat #f8f6f2. This is a full bleed hero
illustration for Moist software company. Strong dramatic dark blue water and
intricate white foam, not abstract blobs.

### Moon prompt

Standalone square editorial illustration for a software project card. Japanese
woodblock-inspired ocean waves with fine engraved cream foam in foreground, an
ivory full moon low over the horizon, deep midnight navy sky and ocean-blue water.
Limited palette #062b43 #075b7c #f8f6f2. Beautiful intricate hand-cut linework,
light stippled ink texture, strong graphic silhouette. Full bleed square artwork.
No text, no letters, no logo, no interface, no border. Match sophisticated navy
and ivory surf art direction.

## Font

Noto Sans Black 2.015 from the local system font collection, converted to WOFF2
using `woff2_compress` (about 220 KiB). Font display uses swap, with a system
sans-serif fallback. The source font identifies Copyright 2022 The Noto Project
Authors and the SIL Open Font License 1.1. The official license is bundled at
`static/assets/fonts/OFL.txt`; upstream:
https://github.com/notofonts/latin-greek-cyrillic/blob/main/OFL.txt

No font CDN or other third-party requests are used.
