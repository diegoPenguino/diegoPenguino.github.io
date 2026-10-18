# Landing page redesign options

Static mockups of the home page, built to choose a direction before touching the Jekyll
layouts. Not part of the site build (`design-options/` is in `exclude:` in `_config.yml`).

## How to view

Serve the repo root (the mockups load images from `../assets/img/`):

```bash
python3 -m http.server 4100
```

Then open `http://localhost:4100/design-options/a-sobrio.html` (or `b-editorial.html`,
`c-enunciado.html`). Screenshots at 1440px and 375px are in `screenshots/`;
`current-desktop.png` is the live home for comparison.

## What changes against the current home

The current home reads as AI-made mostly because of these defaults from the first handoff:

- Open Sans ExtraBold headings on a navy and saturated blue palette.
- One word of the headline in the accent colour ("Internet.").
- Circular sticker badges over an arch-cropped portrait.
- Monospace micro-labels: "FACT #1", "EN/ES" tags, "← swipe →".
- Floating pill navigation with a dark active pill.
- Hairline rules under every section title, bordered rounded cards, a dark rounded CTA box.

All three options keep the same content and order (intro, facts, latest posts, featured
projects, contact) and drop those devices.

| Option | Type | Palette | Idea |
|---|---|---|---|
| A, sober | Schibsted Grotesk, one family | Stone ground, near-black ink, Bolivian-flag green | The name as the headline; the IOI team photo as a full-width break; the footer is a green field with "Write to me." |
| B, editorial | Newsreader (light display, text) | Off-white, black, oxblood | Keeps "My little portion of Internet." with the rotating word; posts in two columns; a then/now photo pair (medals, IOI 2025 team) |
| C, problem statement | STIX Two Text | White paper, black, judge blue, Accepted green | The page is an olympiad statement: Legend, Input, Output (the posts), Examples (the facts, with a "Run the next test" button that answers "Accepted on test N"), Clarifications (contact) |

## Chosen direction: D (`d-olimpiada.html`)

Diego preferred a mix of B and C (A was rejected). D keeps C's olympiad-statement structure,
B's Newsreader type, oxblood accent and then/now photo pair, and fills the page with real
content from the CV and About page:

- Dark header field: "Problem D. Diego", time/memory/language limits, rotating word, portrait.
- Legend: short bio with Figure 1 (medals, then) and Figure 2 (IOI 2025 team, now).
- Constraints: real milestones written as inequalities (IOI 2015 and 2017, team leader since
  2023, problemsetter since 2019, two Iberoamerican bronzes, OBI gold 2016, AI olympiad 2025).
- Input: the six places a visitor can go (About, CV, CP resources, problem list, thesis, stories).
- Output: latest posts in two columns.
- Examples: the facts as sample tests, with "Run the next test" and an Accepted verdict.
- Subtasks: projects worth 100 points (40/25/20 and 15 for the other five).
- Clarifications: oxblood footer with the email large.

Feedback so far: B and C liked, A disliked, C alone felt too empty and plain.

## Next steps

1. Pick one direction (or mix: for example A's type with C's examples block).
2. Iterate on the mockup HTML until it is right.
3. Port it to the site: tokens in `assets/css/site.css`, markup in `_layouts/home.html`,
   `_includes/site-header.html` and `_includes/site-footer.html`, then carry the type and
   palette to the other layouts.

The project descriptions in the mockups are shortened drafts; check them before porting.
Design skills for this work live in `.claude/skills/` (`design-taste-frontend`,
`redesign-existing-projects`, `stop-slop`, `humanizer`) with reference `DESIGN.md` files in
`.claude/references/awesome-design-md/`.
