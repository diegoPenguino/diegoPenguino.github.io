---
layout: project
title: AlgoCritic - Multi-Agent Code Review System
date: 2026-03-04
description: AlgoCritic is a multi-agent code review system built for competitive programming solutions.
thumbnail-img: /assets/img/AlgoCritic.png
repo-url: https://github.com/diegoPenguino/AlgoCritic
---

AlgoCritic is a multi-agent code review system built for competitive programming solutions. It uses a Good Cop / Bad Cop / Judge architecture to generate balanced feedback: one agent highlights strengths, another challenges correctness and efficiency, and a final judge synthesizes both perspectives into a clear verdict.

The core idea is to move beyond single-response review by introducing structured debate between specialized agents. Good Cop focuses on valid logic, clean implementation choices, readability, and smart handling of edge cases, while Bad Cop searches for bugs, missing cases, complexity pitfalls, and fragile patterns that could fail under pressure.

After both analyses are produced, the Judge agent consolidates them into a practical final report with correctness assessment, time/space complexity analysis, code quality notes, key strengths, key weaknesses, and actionable recommendations. The final decision is explicit and easy to interpret: ACCEPTABLE, NEEDS IMPROVEMENT, or INCORRECT.

The project is implemented with LangChain and OpenAI models, includes configurable model selection through `.env`, and can be run directly with `python main.py` to execute a full end-to-end review flow and export results. It is designed as a reusable foundation for automated feedback pipelines in training, contest preparation, and solution auditing.
