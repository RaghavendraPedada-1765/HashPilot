# Contributing to HashPilot

Thank you for your interest in contributing to HashPilot! 🎉

HashPilot is an open-source, AI-powered computational benchmarking platform. Every contribution — from bug fixes to new features to documentation improvements — is genuinely appreciated.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Branch Naming](#branch-naming)
- [Making Changes](#making-changes)
- [Code Style](#code-style)
- [Running Tests](#running-tests)
- [Submitting a Pull Request](#submitting-a-pull-request)
- [Reporting Bugs](#reporting-bugs)
- [Requesting Features](#requesting-features)

---

## Code of Conduct

Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md). We expect all contributors to uphold these standards to maintain a welcoming community.

---

## Getting Started

1. **Fork** the repository on GitHub.
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/HashPilot.git
   cd HashPilot
   ```
3. **Add the upstream remote:**
   ```bash
   git remote add upstream https://github.com/RaghavendraPedada-1765/HashPilot.git
   ```

---

## Development Setup

### Prerequisites

| Tool | Version |
|------|---------|
| Python | 3.13+ |
| Node.js | 20+ |
| npm | 10+ |

### Backend

```bash
cd backend
python -m venv .venv

# Activate virtual environment
# Windows:
.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate

pip install -r requirements.txt
pip install -r requirements-dev.txt   # linting + testing tools

cp .env.example .env
uvicorn app.main:app --reload
```

API available at: http://localhost:8000  
Interactive docs: http://localhost:8000/docs

### Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

UI available at: http://localhost:5173

### Desktop (Electron)

The desktop app wraps the frontend and bundled backend. For development, run the backend and frontend separately (above), then:

```bash
cd desktop
npm install
npm run dev
```

---

## Project Structure

```
HashPilot/
├── backend/
│   ├── app/
│   │   ├── api/           # FastAPI route handlers
│   │   ├── core/          # Config, logger, WebSocket manager
│   │   ├── engine/        # BenchmarkEngine + Proof-of-Work puzzle
│   │   ├── ml/            # Random Forest predictor + trainer
│   │   ├── models/        # SQLAlchemy ORM models
│   │   ├── repositories/  # Database access layer
│   │   ├── services/      # Business logic
│   │   └── strategies/    # Sequential, Random, MultiThread, MultiProcess
│   └── tests/             # pytest test suite
├── frontend/
│   └── src/
│       ├── api/           # Axios client
│       ├── components/    # Reusable UI components
│       ├── context/       # ThemeContext, BenchmarkSocketContext
│       ├── hooks/         # useBenchmarkSocket
│       ├── pages/         # Dashboard, History, Analytics, NotFound
│       └── config/        # Runtime URL configuration
├── desktop/               # Electron wrapper
├── docker/                # Docker configuration
└── docs/                  # Documentation
```

---

## Branch Naming

Use descriptive branch names with a prefix:

| Prefix | Use for |
|--------|---------|
| `feat/` | New features |
| `fix/` | Bug fixes |
| `docs/` | Documentation only |
| `refactor/` | Code refactoring |
| `test/` | Adding or fixing tests |
| `chore/` | Maintenance tasks |

**Examples:**
```
feat/add-postgresql-support
fix/websocket-reconnect-loop
docs/improve-api-reference
```

---

## Making Changes

1. **Sync with upstream** before starting work:
   ```bash
   git fetch upstream
   git checkout main
   git merge upstream/main
   ```

2. **Create a feature branch:**
   ```bash
   git checkout -b feat/your-feature-name
   ```

3. Make your changes, keeping commits **small and focused**.

4. **Write or update tests** for any changed behavior.

5. Ensure all **linting and tests pass** (see below).

6. **Push** your branch and open a PR.

---

## Code Style

### Python (Backend)

We use the following tools — all are enforced by CI:

| Tool | Purpose |
|------|---------|
| `black` | Code formatting |
| `isort` | Import sorting |
| `flake8` | Linting |

Run all checks locally:

```bash
cd backend
black .
isort .
flake8 .
```

- Max line length: **88** (Black default)
- Docstrings: use Google-style docstrings for public functions
- Type hints: required for all new public functions

### JavaScript / JSX (Frontend)

We use **ESLint** with the project's existing config:

```bash
cd frontend
npm run lint
```

- Use functional components with hooks — no class components
- Prefer named exports
- Keep components focused and single-purpose

---

## Running Tests

### Backend

```bash
cd backend

# Fast unit tests (recommended during development):
pytest tests/ -v -m "not slow"

# All tests including full benchmark execution:
pytest tests/ -v
```

### Frontend

```bash
cd frontend

# Build check (catches TypeScript/JSX errors):
npm run build
```

---

## Submitting a Pull Request

1. Ensure your branch is up to date with `upstream/main`.
2. Open a PR against the `main` branch of `RaghavendraPedada-1765/HashPilot`.
3. Fill out the **PR template** completely.
4. Link any related issues using `Closes #<issue-number>`.
5. Wait for CI checks to pass — PRs with failing CI will not be merged.
6. A maintainer will review your PR, leave feedback, and merge when ready.

### PR Checklist

- [ ] Code follows the project's style guide
- [ ] Self-reviewed the diff
- [ ] Added/updated tests for changed behavior
- [ ] All CI checks pass
- [ ] Updated documentation if needed

---

## Reporting Bugs

Please use the [Bug Report template](https://github.com/RaghavendraPedada-1765/HashPilot/issues/new?template=bug_report.md) and include:

- Steps to reproduce
- Expected vs actual behavior
- OS, Python version, Node.js version
- Logs or screenshots if applicable

---

## Requesting Features

Use the [Feature Request template](https://github.com/RaghavendraPedada-1765/HashPilot/issues/new?template=feature_request.md).  
Check existing issues first to avoid duplicates!

---

## Questions?

Open a [GitHub Discussion](https://github.com/RaghavendraPedada-1765/HashPilot/discussions) — we're happy to help!

---

Thank you for contributing to HashPilot! 💙
