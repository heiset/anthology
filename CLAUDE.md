# Trevor's Site — Content Guide for Claude

## Site structure

```
my-site-template/
  index.html              ← home page
  styles.css
  script.js
  articles/
    algebra-*.html         ← Algebra project pages
    library.html            ← My Library project
    blog.html
    teloslatin.html         ← Latin redirect (no sub-pages)
    contact.html
    photography.html        ← placeholder, not active yet
    article-template.html   ← copy this when adding a new page
```

## Projects and their sub-pages

| Project | Folder prefix | Current pages |
|---|---|---|
| Algebra | `articles/algebra-*.html` | see nav for full list — **hidden from nav 2026-11-17, see below** |
| Latin | external link only | — |
| My Library | — | `library.html` |
| Blog | — | `blog.html` |
| Photography | `articles/photo-*.html` | none yet |
| Calculus | — | `calculus-warmups.html` (daily warm-ups) — **hidden from nav 2026-11-17, see below** |
| GPS Tracks | — | `gps-tracks.html` |
| Stats | `articles/stats-*.html` | `stats-ch1-flashcards.html` (flashcards, single page, growing section by section — see below; password gate removed 2026-11-01) |

The nav structure actually in use is a left `site-sidebar` with top-level `<a>` links and `sidebar-group`/`sidebar-sub` dropdowns for multi-page projects (Algebra, Calculus) — not the `project-card` layout this doc used to describe. Single-page projects (Library, GPS Tracks, Stats, Contact) are a single top-level `<a>`, no dropdown, no `section-nav` block on the page itself. Body font is Arial (not Times New Roman, despite the note below — verify against `styles.css` `:root`/`body` rules if in doubt, this doc can drift).

**Algebra and Calculus are temporarily hidden (2026-11-17):** their `sidebar-group` blocks are commented out (`<!-- -->`) in the sidebar nav on every single `.html` file at the repo root and in `articles/`, plus their `project-item` cards on `index.html`'s homepage grid — same technique already used for the commented-out Blog nav link. The page files themselves (`algebra-*.html`, `calculus-warmups.html`) are untouched and still live at their URLs, just not linked from anywhere. To restore: uncomment both blocks in all ~20 files (`grep -rl "sidebar-group" --include="*.html" .` finds them) plus the two `project-item` blocks in `index.html`.

## Password-protected pages

`articles/stats-ch1-flashcards.html` no longer has a password gate (removed 2026-11-01 at Trevor's request) — the flashcard app is visible immediately. If a locked page is wanted again in the future, the old pattern was: a `#pwGate` div (visible by default) and a content div with the `hidden` attribute, gated by a small inline script that checks a plaintext password against `localStorage` (key `stats-<name>-unlocked`) and un-hides the content on match — a soft, client-side-only gate (visible in page source), not real security. Shared CSS for the gate and flashcard UI still lives in `styles.css` under `/* Stats Flashcards page */` (the gate rules are just unused now).

Despite its filename, this one page now holds the whole stats deck, through section 2.7 — every card in `CARDS` carries a `section` field, one per book section (`"1.1"`, `"1.2"`, … `"1.7"`, `"2.1"`, … `"2.7"` — never a sub-subsection like `"1.4.2"`, and never tied to a specific class day), and a `#fcSectionFilter` button row (alongside the existing `#fcTypeFilter` term/quick-compute row) filters on it; both filters combine via AND in `applyFilters()`. Both filter rows scroll horizontally (`.fc-filter` in `styles.css`) rather than wrapping, since there are now 14 section buttons plus "All". To add the next section (e.g. 3.1): append `{section:"3.1", type:"term"/"apply", q:..., a:...}` entries to `CARDS` (term cards from that section's bolded textbook vocab, a handful of `apply` quick-compute drills with simple numbers to match), and add one more `<button data-section="3.1">3.1 Review</button>` to `#fcSectionFilter`. No new page, no nav change needed.

### Usage logging

The page logs every visit (session length, which cards were seen, time per
card, whether each was flipped) and sends it via `navigator.sendBeacon` on
`pagehide` to a Google Sheet, since a static GitHub Pages site can't write
to this repo directly from a visitor's browser. The backend (Apps Script
code, a `pull-logs.sh` to download the Sheet into local CSVs, deployment
steps) lives in `flashcard-logging/`. The `LOG_ENDPOINT` constant near the
top of the page's `<script>` block is empty until that backend is deployed
— logging is a silent no-op until then, so this is safe to leave as-is.

## How to add a new sub-page to a project

### Step 1 — Create the page file

Copy `articles/article-template.html` and rename it following the prefix convention above (e.g. `articles/calculus-derivatives.html`).

Paste LaTeX math between `\(` ... `\)` for inline or `\[ ... \]` for display blocks inside a `<div class="math-display">` wrapper.

### Step 2 — Add it to the section nav on EVERY page in that project

Each project page has a `<nav class="section-nav">` block. Add a new `<a>` entry for the new page. Mark the *current* page as `<span class="section-nav-current">` instead of an `<a>`.

Example for Calculus after adding `calculus-derivatives.html`:

```html
<nav class="section-nav" aria-label="Calculus pages">
  <span class="section-nav-label">Calculus</span>
  <a href="infinite-series.html">The Mysteries of the Infinite</a>
  <span class="section-nav-current">Derivatives and Their Meaning</span>
</nav>
```

### Step 3 — Update the home page card

In `index.html`, find the `<a class="project-card">` for the project and update the `<div class="card-desc">` text if needed.

## Adding a LaTeX lesson (paste workflow)

1. Tell Claude which project this belongs to (Calculus, Math with Computers, etc.)
2. Paste the raw LaTeX text
3. Claude will:
   - Create a new `articles/<prefix>-<slug>.html` file
   - Wrap prose in `<p>` tags and math in `\( \)` / `\[ ... \]` blocks
   - Add the page to the section nav on all sibling pages
   - Link it from the home page card description if it changes the summary

## Site nav (top bar, appears on every page)

The top nav lives in each HTML file's `<nav class="site-nav">` block. To add a new **top-level** project:

1. Add an `<a>` entry to the nav in every `.html` file
2. Add a `<a class="project-card">` to `index.html`

Photography is currently shown as `<span class="nav-inactive">Photography</span>` (greyed out). To activate it, change the span to an `<a href="articles/photography.html">Photography</a>` in all nav blocks.

## Typography & style notes

- Font: Times New Roman throughout
- Nav separator color: `#2e7d3e` (green)
- Accent / link color: `#4b2378` (purple)
- Hero image max width: 408 px (40% smaller than original 680 px)
- Section nav (`section-nav`) appears below the article header, above the article body
- Latin has no section nav (it's an external link)
