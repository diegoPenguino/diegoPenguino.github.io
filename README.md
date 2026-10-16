# Diego Angulo's Place

Source of [penguino.space](https://penguino.space), the personal site and blog of
Diego Alejandro Angulo Ramírez: AI engineer, problemsetter for the Bolivian Olympiad
in Informatics and IOI Team Leader for Bolivia.

- **Blog:** experiences, thoughts and ideas, in English and Spanish.
- **Projects:** AI agents, RAG systems, automation and competitive programming tools.
- **Resources:** a guide to competitive programming for Bolivian students, and the
  problems I have written for the OBI.

## Stack

A Jekyll site built and served by GitHub Pages, with custom layouts, one stylesheet and a
little vanilla JavaScript. Blog comments use Firebase (Google sign-in + Firestore).

## Run it locally

```bash
brew install ruby@3.3
export PATH="/opt/homebrew/opt/ruby@3.3/bin:$PATH" LANG=en_US.UTF-8 LC_ALL=en_US.UTF-8
bundle config set --local path vendor/bundle
bundle install
bundle exec jekyll serve --future --livereload   # http://localhost:4000
```

More details for contributors and coding agents are in [AGENTS.md](AGENTS.md).

## History

This repository started in 2022 as a fork of
[daattali/beautiful-jekyll](https://github.com/daattali/beautiful-jekyll) by Dean Attali.
In October 2026 the site was redesigned from scratch with its own layouts and styles, and the
repository was detached from the fork network. Thanks to Dean for the theme that got this blog
started.

## License

Content is © Diego Alejandro Angulo Ramírez; the code is MIT. See [LICENSE](LICENSE).
