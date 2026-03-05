---
layout: project
title: Editorial Generator
date: 2026-03-05
description: An intelligent LangGraph-based multi-agent system that generates polished competitive programming editorials from a problem statement and accepted solution.
thumbnail-img: /assets/img/post-contest-edit.png
repo-url: https://github.com/diegoPenguino/Post-Contest-Editorial-Generator
---

Editorial Generator is an intelligent multi-agent system that automatically writes comprehensive editorials for competitive programming problems. Given a problem statement and an accepted solution, it orchestrates analysis, explanation, and composition steps to produce a clean Markdown editorial suitable for learning and post-contest review.

The project is built around a LangGraph workflow with specialized agents that each handle a focused task. It first extracts key details from the statement, classifies the algorithm family (greedy, dynamic programming, graph, or other), and then routes execution to the corresponding explainer branch. After that, dedicated stages evaluate complexity, discuss common wrong approaches, and compose a final polished writeup.

Its architecture is modular and easy to extend: `main.py` initializes the state, `agents/` contains task-specific logic, and `graphs/editorial_graph.py` wires everything with conditional transitions. The generated result is written to `output/editorial.md`, while prompts and utilities are organized in separate folders to keep responsibilities clear and maintainable.

The repository targets Python 3.13 and uses dependencies from `requirements.txt`, with runtime settings configurable through `.env` (model, temperature, API key, and logging). Running `python main.py` executes the full pipeline end-to-end, making it a practical foundation for automating high-quality editorial generation and improving competitive programming study workflows.
