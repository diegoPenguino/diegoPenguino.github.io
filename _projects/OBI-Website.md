---
layout: project
title: OBI - Official Website
date: 2026-05-26
description: The official website for the Bolivian Olympiad in Informatics, built as a static Astro site for Cloudflare Pages.
thumbnail-img: /assets/img/projects/obi-web.png
repo-url: https://obi.org.bo/
---

I created the official website for the Bolivian Olympiad in Informatics, with a static-first approach designed for speed, reliability, and zero server cost. The site was built to serve as the public face of the OBI, while staying lightweight enough to deploy cleanly on Cloudflare Pages.

<p align="center">
  <img src="/assets/img/projects/obi-web.png" alt="OBI official website preview" />
</p>

The project uses Astro with SSR disabled, Tailwind CSS, TypeScript, and Zod-backed content collections. That combination made it possible to keep the codebase modular while still letting the content live in a structured way through Markdown and JSON files for news, resources, calendar entries, editions, and sponsors.

It also supports both light and dark themes, which was important for making the site feel modern and comfortable in different viewing conditions. I wanted the visual system to stay clean and official without sacrificing usability, so the theme handling and styling were built to adapt gracefully instead of feeling bolted on.

What made this project interesting to me was the balance between presentation and maintainability. It needed to look official and polished, but it also had to be easy to update over time by adding new content files instead of touching the whole site. That is why the structure is intentionally static, organized, and content-driven.

On the deployment side, the site is optimized for Cloudflare Pages with a static build output, production headers, redirects, and a custom 404 page. The result is a fast public website that can scale naturally with the organization while staying simple to host and maintain.
