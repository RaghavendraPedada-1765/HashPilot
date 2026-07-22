# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Planned
- PostgreSQL support for horizontal scaling
- JWT authentication + user sessions
- Real-time collaborative benchmarking
- Hardware profile comparison across devices
- Advanced ML: XGBoost / Neural Network predictor
- Slack / email notifications on benchmark completion
- Benchmark scheduling (cron-based)
- macOS and Linux desktop builds

---

## [1.0.0] — 2026-07-22

### 🎉 Initial Release

HashPilot v1.0.0 is the first public release — a fully-featured, AI-powered computational benchmarking platform available as both a web app and a downloadable Windows desktop application.

### Added

#### Benchmarking Engine
- Four hash-solving strategies: **Sequential**, **Random**, **MultiThread**, **MultiProcess**
- Proof-of-Work puzzle engine with configurable difficulty
- Real-time live telemetry over WebSocket (hash rate, nonce, attempts, elapsed time)
- Grafana-style WebSocket monitor in the UI

#### AI / ML Pipeline
- **Random Forest** strategy predictor trained on historical benchmark data
- Confidence score and model accuracy reported on every prediction
- One-click model retraining (`POST /predict/retrain`) from stored benchmark history
- **Prediction vs. Actual** comparison card on the dashboard
- Features used: `cpu_cores`, `logical_threads`, `ram_gb`, `difficulty`, `threads`, `processes`

#### Analytics & Reporting
- Average hashrate charts per strategy (Chart.js)
- Win-rate trends over time
- Downloadable executive-grade PDF reports with AI recommendations
- Searchable, filterable benchmark history with CSV export

#### Frontend (React + Vite)
- Premium dark-mode SaaS UI
- Dark / Light theme toggle (system-aware)
- `Ctrl+K` Command Palette for quick navigation
- Mobile-first responsive layout
- Dashboard, History, Analytics, and 404 pages

#### Backend (FastAPI)
- REST API with full OpenAPI/Swagger docs at `/docs`
- WebSocket endpoint `/ws/benchmark` for live telemetry
- ConnectionManager broadcast engine for multi-client support
- SQLite storage via SQLAlchemy ORM
- PDF report generation with ReportLab
- System hardware profiling endpoint

#### Desktop Application
- Electron wrapper for Windows (x64)
- Embedded PyInstaller-bundled FastAPI backend — no Python install needed
- NSIS installer (`HashPilot-Setup-*.exe`)
- Desktop shortcut + Start Menu integration
- Runs entirely offline — no internet required after install
- Benchmark history stored locally in `%APPDATA%\HashPilot\hashpilot.db`

#### Infrastructure
- Docker + docker-compose multi-stage setup
- GitHub Actions CI pipeline (Python linting, tests, Node.js build)
- GitHub Actions desktop release workflow (auto-builds `.exe` on version tags)
- Render/Railway backend deployment config
- Vercel frontend deployment config

[Unreleased]: https://github.com/RaghavendraPedada-1765/HashPilot/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/RaghavendraPedada-1765/HashPilot/releases/tag/v1.0.0
