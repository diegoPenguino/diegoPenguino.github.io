---
layout: project
title: CoinGecko Price Tracker - Anomaly Detection and RAG Alerts
date: 2026-04-18
description: A technical price tracking system that combines CoinGecko ingestion, anomaly detection, and RAG-powered explanations for market events.
thumbnail-img: /assets/img/projects/coingecko.svg
repo-url: https://github.com/diegoPenguino/CoinGecko-price-tracker
---

CoinGecko Price Tracker is a technical price tracking system that combines CoinGecko ingestion, anomaly detection, and RAG-powered explanations. It was built for a technical challenge and focuses on turning raw market movement into something easier to inspect and understand.

The project pulls price data into Postgres, runs anomaly detection over the history, and can generate alerts with supporting context when something suspicious happens. It also exposes a chat-style API so a user can ask about a coin and get a response grounded in retrieved context rather than a bare numeric answer.

That combination makes the repository feel like more than a price scraper. It is trying to connect data collection, analysis, and explanation into one flow, which is a useful pattern for any system that needs to react to live signals and still remain interpretable.

Under the hood, the system is built around Python tooling, FastAPI, Alembic, Docker, and a small ML/RAG pipeline. That gives it a good mix of practical engineering and applied data work, which makes it a strong portfolio piece for backend and AI-adjacent workflows.
