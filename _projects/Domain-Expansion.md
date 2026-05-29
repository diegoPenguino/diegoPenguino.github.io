---
layout: project
title: Domain Expansion - Territory War Strategy Game
date: 2026-04-15
description: Domain Expansion is a turn-based territory conquest game where four Python bots compete to dominate the board through movement, enclosure, and survival.
thumbnail-img: /assets/img/projects/game_preview.png
repo-url: https://github.com/diegoPenguino/Domain-Expansion
---

Domain Expansion is a turn-based territory war game for four players, where each participant controls a Python bot and competes on a two-dimensional grid to claim as much territory as possible. What starts as a simple movement game quickly becomes a strategy problem about space, timing, and survival.

The rules are intentionally simple to read but much harder to master. Every bot moves exactly one orthogonal step per turn, can only move onto empty cells or its own territory, and is eliminated immediately if it makes an invalid move or collides with another player's area. On top of that, if a player manages to fully enclose an empty region with their territory, the enclosed area is captured automatically. That creates a very fun mix of expansion, defense, and trap-setting.

What makes the project especially interesting is that the real competition comes from the bots, not just the board. Each player implements a `next_step` function in Python, which makes the game a small AI playground where different strategies can be tested against each other. That turns the repository into both a game engine and a framework for experimentation.

The project also includes a graphical simulation built with `pygame`, plus a competition mode that runs multiple board permutations so bots can be evaluated more fairly from different starting positions. That combination of simulation, strategy, and tournament-style evaluation gives the project a nice balance between playability and technical depth.

Image of how the game looks:
![Game Preview](/assets/img/projects/game_preview.png)
