# AGENTS.md

Personal site of Diego Angulo Ramirez, served at https://penguino.space (see `CNAME`).
It is a Jekyll site based on the [Beautiful Jekyll](https://github.com/daattali/beautiful-jekyll)
theme, with the theme files vendored into this repo (`_layouts/`, `_includes/`, `assets/`).

## How it is deployed

- GitHub Pages builds `master` with its **built-in (legacy) builder**. That builder ignores
  the Gemfile and uses the versions pinned by the `github-pages` gem
  (https://pages.github.com/versions/): Jekyll 3.10, Ruby 3.3, kramdown with GFM.
- The local setup and CI use the same `github-pages` gem, so a passing local build means
  a passing Pages build. Do not upgrade to Jekyll 4 or add plugins outside the
  [Pages allowlist](https://pages.github.com/versions/) unless the deploy is moved to a
  GitHub Actions workflow first.
- Every push to `master` publishes the site. Work on a branch and open a PR.

## Local setup (macOS)

```bash
brew install ruby@3.3
export PATH="/opt/homebrew/opt/ruby@3.3/bin:$PATH" LANG=en_US.UTF-8 LC_ALL=en_US.UTF-8
bundle config set --local path vendor/bundle
bundle install
bundle exec jekyll serve --future --livereload   # http://localhost:4000
```

- A UTF-8 locale is required: without `LANG`/`LC_ALL` the Sass converter fails with
  `Invalid US-ASCII character`.
- The `GitHub Metadata: No GitHub API authentication` warning is harmless locally.
- Gems live in `vendor/bundle` (git-ignored and excluded from the Jekyll build).

## Checks

CI (`.github/workflows/ci.yml`) runs, and you should run before pushing:

```bash
JEKYLL_ENV=production bundle exec jekyll build --future --strict_front_matter
```

The build must finish with no errors. After changing layouts or CSS, open the pages in a
browser at desktop and mobile widths.

## Content map

| What | Where | Notes |
|---|---|---|
| Site settings, navbar, colors, social links | `_config.yml` | Restart `jekyll serve` after editing |
| Home page | `index.html` (`layout: about`) | |
| Blog posts | `_posts/YYYY-MM-DD-slug.md` | URL is `/YYYY/MM/DD/slug.html`; drafts go in `_drafts/` |
| Blog index | `blog/index.html` (`layout: home`) | Paginated (5 per page) |
| Projects | `_projects/*.md` (`layout: project`) | Front matter: `title`, `date`, `description`, `thumbnail-img`, `repo-url`, optional `demo-url` |
| Projects index | `projects.md` (`layout: projects`), styles in `assets/css/projects.css` | |
| Other pages | `aboutme.md`, `cv.md`, `resources_for_cp.md`, `problemlist.md`, `story.md`, `links.md` | |
| Images | `assets/img/` (project thumbnails in `assets/img/projects/`) | |
| Theme layouts and partials | `_layouts/`, `_includes/` | Vendored theme; edit carefully |

Posts and pages mix English and Spanish; keep each piece in the language it was written in.

## Conventions

- Keep the `upstream` remote (daattali/beautiful-jekyll) for reference only; do not merge it
  wholesale, the theme here has local changes.
- Add new top-level files that should not be published to `exclude:` in `_config.yml`.
- Large PDFs at the repo root (`CV.pdf`, etc.) are linked from pages; do not rename them
  without updating the links.
