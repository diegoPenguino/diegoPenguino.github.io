---
layout: project
title: LinkedBot - GitHub Activity to LinkedIn Automation
date: 2026-05-02
description: LinkedBot automates the workflow of turning ideas into LinkedIn updates.
thumbnail-img: /assets/img/projects/linkedBot.jpg
repo-url: https://github.com/diegoPenguino/LinkedBot
---

LinkedBot is an AI-powered Telegram bot that helps me capture professional activity in the moment and later turn it into LinkedIn posts. I built it because I kept running into the same problem: I would spend the day teaching, organizing olympiads, attending AI events, building side projects, and working on backend ideas, but by the time I had a free moment, I would either forget to post or no longer have the energy to write something properly.

<p align="center">
  <img src="/assets/img/projects/linkedBot.jpg" alt="LinkedBot Telegram conversation preview" />
</p>

The bot gives me a simple place to save ideas, events, classes, and project updates as they happen. From there, it can extract a title and summary automatically, generate LinkedIn drafts in my style, suggest useful media for each post, and keep track of pending entries until I mark them as completed. That makes the whole process feel much lighter than trying to start from scratch every time I want to share something.

What I like most about LinkedBot is that it is not just a chatbot for the sake of it. It is AI wrapped around a real personal workflow, which makes the result much more practical. The stack behind it is FastAPI, aiogram, SQLAlchemy, and OpenAI, and I deployed it on my personal home server so it can live close to the rest of my everyday tooling.

You can think of it as a small automation layer for remembering my life in public. Instead of turning posting into another exhausting task, LinkedBot helps me document more of what I am already doing, while keeping the actual writing and organization much easier to manage.
