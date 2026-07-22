# HashPilot Roadmap

This document outlines the planned development direction for HashPilot. It is a living document — priorities may shift based on community feedback and contributions.

Want to influence the roadmap? [Open a Feature Request](https://github.com/RaghavendraPedada-1765/HashPilot/issues/new?template=feature_request.md) or join the [Discussions](https://github.com/RaghavendraPedada-1765/HashPilot/discussions).

---

## ✅ v1.0.0 — Shipped

- [x] Four benchmark strategies: Sequential, Random, MultiThread, MultiProcess
- [x] Random Forest ML strategy predictor with confidence scores
- [x] Live WebSocket telemetry (Grafana-style monitor)
- [x] Prediction vs Actual comparison
- [x] One-click model retraining
- [x] PDF executive benchmark reports
- [x] Searchable history + CSV export
- [x] Dark/Light theme with system awareness
- [x] `Ctrl+K` Command Palette
- [x] Mobile-responsive UI
- [x] Docker + docker-compose support
- [x] Windows desktop app (Electron + PyInstaller, NSIS installer)
- [x] GitHub Actions CI + automated release pipeline

---

## 🔄 v1.1.0 — Near Term

> Target: Q3 2026

- [ ] **macOS desktop build** — `.dmg` installer for Apple Silicon + Intel
- [ ] **Linux desktop build** — `.AppImage` and `.deb` packages
- [ ] **Auto-updater** — Electron's built-in update mechanism via GitHub Releases
- [ ] **Benchmark scheduling** — cron-based recurring benchmarks
- [ ] **Improved PDF reports** — charts embedded in the PDF

---

## 🔮 v1.2.0 — Medium Term

> Target: Q4 2026

- [ ] **JWT authentication + user sessions** — secure multi-user support
- [ ] **PostgreSQL support** — drop-in replacement for SQLite for horizontal scaling
- [ ] **Advanced ML models** — XGBoost and lightweight Neural Network predictors
- [ ] **Hardware profile comparison** — compare results across different machines
- [ ] **Benchmark presets** — save and reuse difficulty/thread configurations

---

## 🌐 v2.0.0 — Long Term

> Target: 2027

- [ ] **Real-time collaborative benchmarking** — multiple users, shared leaderboard
- [ ] **Slack / email notifications** — alerts on benchmark completion or anomalies
- [ ] **Plugin system** — custom benchmark strategy plugins
- [ ] **Cloud sync** — optional encrypted sync of benchmark history
- [ ] **REST API SDK** — Python and JavaScript client libraries

---

## 💡 Community Ideas

These are ideas from the community that are under consideration but not yet scheduled:

- GPU benchmarking support
- Browser-based WASM strategy
- Integration with CI pipelines (benchmark regression detection)
- Prometheus metrics export

---

## How to Contribute

See [CONTRIBUTING.md](CONTRIBUTING.md) to get started. All contributions — features, bug fixes, documentation, and ideas — are welcome!
