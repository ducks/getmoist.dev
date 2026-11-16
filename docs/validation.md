# Local validation — 2026-11-16

Validated production output on a loopback HTTP server, not a public deployment.

- HTML validation and Prettier formatting pass.
- Three Node tests cover repeatable builds, local references, navigation,
  project links and omitted research routes, unique page metadata and sitemap coverage.
- Twenty-one Chromium browser tests pass: all three pages at 320, 390, 768 and
  1440px, plus a no-JavaScript navigation/reload/back/404 test, six dark-theme
  page/viewport tests, keyboard preference persistence, and blocked-storage fallback.
- Axe WCAG A/AA checks report zero violations at each tested page/width.
- Screenshots in ignored `artifacts/` cover every page at every tested width.
  Desktop and mobile screenshots were visually reviewed for typography, spacing,
  hierarchy and overflow. Decorative hero artwork was removed after review;
  the final hero is typography-led. Reduced motion disables smooth scrolling.
- Local mobile Lighthouse navigation audit on the light homepage before the theme
  toggle was added: accessibility 100,
  best practices 100, SEO 100. The available browser audit excludes performance;
  no Lighthouse performance score is claimed. Rerun all categories against the
  deployed HTTPS site before announcing production scores.
- Nix flake build/check passes on x86_64-linux. Other declared systems have not
  been built here.

## Reproduce

Run `make release-prep`; browser screenshots are regenerated locally. Run
`nix flake check` for the offline Nix build. Use Chrome DevTools Lighthouse on
`make preview` to repeat the local audit. Test the final public HTTPS URL too:
local scores cannot validate DNS, certificate issuance, GitHub Pages cache
behavior, real network latency, or external service uptime.

Sources and external destinations were checked during implementation (see
[sources.md](sources.md)). External availability is deliberately not a CI network
dependency. Publishing uses the manual Pages workflow in `ducks/getmoist.dev`; deployment
status is recorded in GitHub Actions. No Caddy configuration is installed. Manual screen-reader testing and Safari/
Firefox visual reviews remain release checks; automated axe tests do not cover
all accessibility needs.
