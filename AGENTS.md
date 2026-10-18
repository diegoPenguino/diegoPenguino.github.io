# AGENTS.md

Personal site of Diego Angulo Ramirez, served at https://penguino.space (see `CNAME`).
It is a plain Jekyll site with its own layouts (no theme gem, no CSS framework). It started
from Beautiful Jekyll and was redesigned from a Claude Design handoff in October 2026.

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
- `url` and `baseurl` are pinned in `_config.yml`. Without them, a build with no GitHub token
  prefixes every link with `/pages/diegoPenguino`.
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
| Site settings, social links | `_config.yml` | Restart `jekyll serve` after editing |
| Navigation menu | `_data/nav.yml` | Items with `children` become dropdowns |
| Design tokens and all styles | `assets/css/site.css` | One stylesheet; colors and fonts are CSS variables in `:root` |
| Interactions | `assets/js/site.js` | Menu, dropdowns, rotating word, facts, filters, tabs, copy link. Pages work without it |
| Home | `index.html` (`layout: home`) | Bio, rotating words, facts and featured projects are front matter |
| About | `aboutme.md` (`layout: about`) | All content is front matter |
| Blog posts | `_posts/YYYY-MM-DD-slug.md` | Front matter needs `lang: EN` or `lang: ES` (blog filter) and a unique `slug` (lowercase, dashes). URL is `/blog/<slug>/`; never change a published slug without adding the old URL to `redirect_from`. Drafts go in `_drafts/` |
| Blog index | `blog/index.html` (`layout: blog`) | Newest post is featured; its image is `thumbnail-img` or the first image in the post |
| Projects | `_projects/*.md` (`layout: project`) | Front matter: `title`, `name`, `tagline`, `date`, `description`, `thumbnail-img`, `repo-url`, optional `live-url` / `demo-url`, and `role`, `stack`, `hosting` for the "At a glance" card |
| Projects index | `projects.md` (`layout: projects`) | Sorted by `date`, newest first |
| CV | `cv.md` (`layout: cv`) | All content is front matter |
| CP resources | `resources_for_cp.md` (`layout: cp-resources`) | Content in `_data/cp_resources.yml` |
| Problem list | `problemlist.md` (`layout: problemlist`) | Intros in front matter, problems in `_data/problems.yml` |
| Blog comments | `_includes/comments.html`, `assets/js/comments.js`, `firebase/firestore.rules` | See "Comments" below |
| Story | `story.md` (`layout: story`) | `---` in the text renders as the three-dot section break |
| Other pages | `links.md`, `something.md`, `404.html` | Generic `page` layout |
| Standalone pages | `full_rank.html`, `ranking1.html` | Own HTML and styles; not part of the design |
| Images | `assets/img/` (project thumbnails in `assets/img/projects/`) | Content images get `loading="lazy"` automatically. Prefer WebP over GIF |
| SEO | `_includes/head.html`, `_includes/structured-data.html` | Share image = `share-img`, project thumbnail, or a post's first image; JSON-LD BlogPosting/Person |

Posts and pages mix English and Spanish; keep each piece in the language it was written in.

## Comments

Posts have comments through Firebase on the free Spark plan: Google sign-in (Authentication) and
Cloud Firestore, called straight from the browser (no server). The SDK loads only when the reader nears the comment section. Nothing renders until
`firebase.projectId` is set in `_config.yml`; a post can opt out with `comments: false`.

- Data: `posts/{postId}/comments/{id}` with `{uid, name, photo, text, parent, createdAt}`, where
  `postId` is the post file name without `.md`. `users/{uid}.lastCommentAt` backs the rate limit.
- `firebase/firestore.rules` is the only protection (the config in `_config.yml` is public by
  design). Anyone reads; signed-in users create their own comment (max 2000 chars, one reply level,
  one comment per 30 s); author or `admin-email` deletes; nobody edits.
- Test rule changes against the emulators before publishing them:
  `cd firebase && npx -y firebase-tools@15.32.1 emulators:start --only auth,firestore --project demo-penguino`
  (needs Java: `brew install openjdk@21`). A `demo-` project id in a config overlay makes the site
  talk to the emulators.
- Rules must be published by hand in the Firebase console (Firestore > Rules) or with
  `firebase deploy --only firestore:rules`; changing the file in the repo alone does nothing.

## Conventions

- Reuse the CSS variables and existing components (`.field`, `.band`, `.btn`, `.filter`,
  `.limits`, `.h1`, `h2.sec`) before adding new styles. Keep touch targets at least 44px.
- House style (see `design-options/README.md`): Newsreader only, square corners, no shadows on
  things at rest, no monospace outside real code, no index numbers or small labels above titles.
- Add new top-level files that should not be published to `exclude:` in `_config.yml`.
- Large PDFs at the repo root are linked from pages; do not rename them
  without updating the links.
