# Minimal Math Site for GitHub Pages

A zero-build, static personal mathematics website inspired by the structure and restrained typography of the reference site. It uses ordinary HTML/CSS/JavaScript and MathJax for LaTeX-style mathematics.

## File map

- `index.html` — landing page with your name, photograph, and project cards
- `articles/article-template.html` — duplicate this for each new essay or lesson
- `articles/infinite-series.html` — example article
- `articles/polynomial-roots.html` — example proof article
- `styles.css` — all typography, layout, cards, and responsive styling
- `script.js` — header hides while scrolling down and reappears as soon as you scroll up
- `assets/portrait-placeholder.svg` — replace with your own photograph
- `assets/monogram.svg` — replace or edit the home-page mark
- `.nojekyll` — tells GitHub Pages to serve files directly

## Customize it

1. Open `index.html` and replace:
   - `Your Name`
   - the one-line biography
   - the email address
   - the project names and links
2. Put your photograph in `assets/`, then update the `src` and `alt` attributes of `.hero-image`.
3. Search all files for `your mathematical project` and replace it with the site title you want in the header.
4. Change `--accent` near the top of `styles.css` to alter the link color.
5. Replace `assets/monogram.svg` with your own logo, or leave the simple geometric mark.

## Write mathematics

MathJax is loaded on each article page.

Inline mathematics:

    \(f(x)=x^2+1\)

Displayed mathematics:

    \[
      \sum_{n=1}^{\infty}\frac{1}{n^2}=\frac{\pi^2}{6}
    \]

These are LaTeX-style math commands embedded directly in HTML. The surrounding document remains HTML rather than Markdown.

## Add a page

1. Copy `articles/article-template.html`.
2. Rename the copy, for example `articles/eulers-identity.html`.
3. Change the `<title>`, heading, description, and body.
4. Add a project card in `index.html` linking to the new relative path.

## Preview locally

From inside this folder, run:

    python3 -m http.server 8000

Then open `http://localhost:8000` in your browser.

## Publish with GitHub Pages

1. Create a new GitHub repository.
2. Upload everything inside this folder to the repository root.
3. Commit and push.
4. In the repository, open **Settings → Pages**.
5. Under **Build and deployment**, choose **Deploy from a branch**.
6. Choose your main branch and the `/ (root)` folder, then save.

The relative links used here work both at `username.github.io` and at project URLs such as `username.github.io/repository-name/`.

## Optional custom domain

Add the domain in **Settings → Pages → Custom domain**. GitHub may create a `CNAME` file automatically. Keep that file in the repository.
