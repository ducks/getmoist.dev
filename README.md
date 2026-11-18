# Moist - getmoist.dev

A Zola-generated static website for independent software and experimental AI.
Home, Work, and About are real HTML documents with normal navigation. Plain semantic
HTML, responsive CSS and a custom typographic identity. A small progressive-enhancement script manages the theme toggle; no tracking,
remote fonts, framework, backend or production dependency installation.

The design is led by oversized typography, a blue-forward light/dark palette,
detailed wave illustrations and compact text-only project cards. A locally hosted Noto Sans Black
WOFF2 font supplies the headings; body text uses the system monospace stack.
Artwork provenance, prompts, asset sizes and licensing are in [docs/artwork.md](docs/artwork.md). Project claims and sources are recorded in
[docs/sources.md](docs/sources.md).

## Development

Zola 0.23, Node 24 and Make, or `nix develop` using the committed flake lock:

```sh
make setup
make dev
```

Open http://localhost:5190. Zola rebuilds and reloads after edits.
Use `zola serve --port 5200` for a different port. The server binds loopback only.
`package-lock.json` pins development dependencies; use `npm ci`, not ad-hoc updates.
On a fresh Linux machine, Playwright may need its OS libraries installed with
`npx playwright install --with-deps chromium` (CI does this). On NixOS, use a
compatible Chromium/Playwright environment; the flake's offline build requires no
browser or npm packages.

| Target              | Purpose                                                               |
| ------------------- | --------------------------------------------------------------------- |
| `make setup`        | Install locked tooling and Chromium                                   |
| `make dev`          | Serve source locally                                                  |
| `make build`        | Build static `dist/` with content-hashed CSS and theme script         |
| `make preview`      | Build and serve production output                                     |
| `make test`         | Deterministic content/build tests                                     |
| `make test-browser` | Responsive, keyboard, no-JS and axe accessibility checks; screenshots |
| `make lint`         | HTML validation and formatting checks                                 |
| `make format`       | Apply formatting                                                      |
| `make check`        | Lint, tests and production build                                      |
| `make release-prep` | All checks including browsers; no publication                         |

`nix flake check` builds the static site and runs offline Node tests. `nix build`
produces static output in `result/`. These checks complement, rather than replace,
the npm HTML/accessibility/browser checks. Nixpkgs is pinned in `flake.lock`.

Markdown entries live in `content/`, shared HTML in `templates/`, and assets in `static/`.
Zola generates project detail pages, tag indexes and the sitemap into `dist/`. Browser screenshots are
written to ignored `artifacts/`, never shipped. Regenerate the committed 1200×630 social preview with
`node scripts/social.mjs` after installing Chromium. The latter is build-time
only. Keep `static/assets/social.png` in Git so normal builds need no browser.

## GitHub Pages release

1. Push reviewed commits to [ducks/getmoist.dev](https://github.com/ducks/getmoist.dev).
2. Under Settings → Pages, choose **GitHub Actions** as the build source.
3. Configure and verify the custom domain `getmoist.dev` in GitHub Pages; configure
   DNS for the chosen account following [GitHub’s custom-domain instructions](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site). The included
   `CNAME` records the intended hostname but is ignored by the Actions publishing
   flow; the repository Pages setting controls the domain.
4. Enable HTTPS once the certificate is available.
5. Run `make release-prep`, merge the reviewed feature branch to `main`, and push
   `main`. **Publish GitHub Pages** runs automatically after each push.

The publication workflow is limited to `main` and runs the full release checks
before deploying. Pull requests run checks without publishing. A manual Actions
trigger remains available for retries. To roll back, revert the relevant source change on a feature branch,
review/merge, then push `main` to publish the revert. No secrets are required for static content.
Assets use root-relative paths for this custom-domain site; a `/repository/`
project URL is not a supported production base. `404.html`, `robots.txt`, sitemap,
favicon, canonical and social metadata are included.

## Other static hosts

Copy `dist/` to the host's document root. Example Caddy configuration:

```caddyfile
getmoist.dev {
    root * /srv/getmoist.dev
    encode zstd gzip
    @versioned path_regexp versioned ^/(styles|theme)\.[a-f0-9]+\.(css|js)$
    header @versioned Cache-Control "public, max-age=31536000, immutable"
    file_server
    handle_errors {
        rewrite * /404.html
        file_server
    }
}
```

Only fingerprinted CSS and JavaScript are safe for immutable caching. Keep HTML and fixed-name
artwork revalidatable. GitHub Pages controls its own cache/compression headers;
this repository does not pretend to override them via an unsupported headers file.
The layout uses system fonts, the favicon is vector-native, and there are no
third-party page requests. No service worker. Local storage holds only the explicit light/dark display preference.
Without JavaScript, all content and navigation work in the default light theme.

## Validation and release limits

Browser tests cover 320/390/768/1440px widths, horizontal overflow, skip-link
keyboard behavior, page navigation, reduced motion, automated WCAG AA checks,
404 handling, no-JavaScript use and first-party-only requests. See
[docs/validation.md](docs/validation.md) for measured local results and limits.
Automated accessibility tests do not replace human assistive-technology testing.
Lighthouse 95+ scores are targets; only measured results should be reported.

## Project catalog

Add a Markdown file under `content/work/`, following an existing entry.
Use title, description and weight for the listing; lower weights appear first.
The `taxonomies.tags` array generates subject pages automatically. Set
`extra.featured` to include a project on the homepage. The Work page displays
all projects using the same card layout.
Keep `extra.kind`, `extra.status`, `extra.repository` and `extra.website`
explicit (use an empty website string where unavailable). Markdown body text
appears on the project's own page. Mark unfinished entries `draft = true`
in the top-level frontmatter; production builds exclude them and their tags.

Do not imply experimental software is commercially available. Record sources in
`docs/sources.md`. Research models remain unpublished. No RSS feed is generated
for this catalog. Deployment uses GitHub Actions and GitHub Pages, not Woodpecker.

The homepage uses “Stay Hydrated.” as its fixed headline, including without
JavaScript. Page metadata and the social preview use the same tagline.
