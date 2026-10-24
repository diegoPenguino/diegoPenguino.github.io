---
layout: project
title: Domain Expansion - Territory War Strategy Game
date: 2026-04-15
description: A turn-based territory game where four Python bots fight over a 50 × 50 board. Play it in the browser, read every bot's code, and upload your own.
thumbnail-img: /assets/img/projects/game_preview.png
repo-url: https://github.com/diegoPenguino/Domain-Expansion
live-url: https://penguino.space/Domain-Expansion/
live-label: Play in the browser
role: Design & development
stack: [Python, pygame, Pyodide, Firebase]
hosting: GitHub Pages
name: "Domain Expansion"
tagline: "Territory war strategy game"
---

Domain Expansion is a turn-based territory game for four players. I made it for the contestants of OBI-CAMP 2026, the training camp of the Bolivian Olympiad in Informatics, so they could compete with bots they wrote themselves.

Each player is a Python function, `next_step`, that receives the board and returns its next cell. Every turn each bot moves one step up, down, left or right, and every cell it steps on becomes its territory. Stepping off the board, onto another player's territory, or returning something that is not a valid move eliminates the bot. If a bot closes a loop around empty cells, it takes the whole area. The rules fit in a paragraph, but the campers' bots went very different ways: zigzagging across rows, fencing off a rectangle first, or remembering where the opponents had been.

The repository has the engine, the campers' bots, a `pygame` viewer, and a competition script that plays every arrangement of starting corners so no bot wins because of where it started.

You can also [play it in the browser](https://penguino.space/Domain-Expansion/). The page runs the same Python engine with Pyodide, so you can pick any four bots and watch the match. You can also sign in with Google and upload up to five bots of your own; their code is public, and anyone can put them on the board. Uploaded code runs inside a sandboxed iframe, each bot in its own worker, and a bot that takes more than two seconds on a move is eliminated without stopping the others.
