---
layout: project
title: OBIA-ChatBot - Domain-Specific Conversational Assistant
date: 2026-05-17
description: OBIA-ChatBot is a contest-focused chatbot for AI competitions, with organizer-defined limits and admin controls for managing users, tokens, and activity.
thumbnail-img: /assets/img/projects/obia-chat.png
repo-url: https://github.com/diegoPenguino/OBIA-ChatBot
---

OBIA-ChatBot is a chatbot built for contestants in AI competitions, where the organizers define the model, the limits, and the way it can be used. The idea is to give participants a tool they can consult when they need help, but with enough guardrails that they do not rely too heavily on the AI during the competition.

<p align="center">
  <img src="/assets/img/projects/obia-chat.png" alt="OBIA ChatBot interface preview" />
</p>

That balance was the interesting part for me. The bot is useful because it is constrained: the competition can allow guidance, but still avoid turning the system into a shortcut that replaces the contestant's own work. In practice, that makes the chatbot feel much more like a controlled competition service than a generic assistant.

The repository also includes admin functionality for managing the platform. From the admin side, it is possible to inspect the inputs being sent, disable user accounts, add tokens to specific accounts, and create new users. That makes the project more complete, because it does not stop at the contestant experience; it also gives the organizers the tools they need to supervise and adjust the system during the competition.

So even though the interface is intentionally simple, the project solves a very specific real-world workflow: controlled AI access for contestants, with the admin tools needed to keep everything fair, traceable, and under control.
