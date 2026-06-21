# Trevor's Site — Content Guide for Claude

## Site structure

```
my-site-template/
  index.html              ← home page
  styles.css
  script.js
  articles/
    infinite-series.html  ← Calculus project, page 1
    polynomial-roots.html ← Exploring Math with Computers project, page 1
    teloslatin.html       ← Latin redirect (no sub-pages)
    contact.html
    photography.html      ← placeholder, not active yet
    article-template.html ← copy this when adding a new page
```

## Projects and their sub-pages

| Project | Folder prefix | Current pages |
|---|---|---|
| Calculus | `articles/calculus-*.html` | `infinite-series.html`, `calculus-limits.html` |
| Exploring Math with Computers | `articles/math-*.html` | `polynomial-roots.html` |
| Latin | external link only | — |
| Photography | `articles/photo-*.html` | none yet |

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
