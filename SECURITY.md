# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x     | ✅ Yes             |
| < 1.0   | ❌ No              |

## Reporting a Vulnerability

**Please do NOT report security vulnerabilities through public GitHub Issues.**

If you discover a security vulnerability in HashPilot, please report it responsibly by:

1. **Opening a private security advisory** on GitHub:
   [https://github.com/RaghavendraPedada-1765/HashPilot/security/advisories/new](https://github.com/RaghavendraPedada-1765/HashPilot/security/advisories/new)

2. **Or emailing directly** at the address listed on the [GitHub profile](https://github.com/RaghavendraPedada-1765).

### What to Include

Please include as much of the following information as possible to help us understand and resolve the issue quickly:

- Type of vulnerability (e.g., injection, path traversal, denial of service)
- Full path of source file(s) related to the vulnerability
- Location of the affected code (tag/branch/commit or direct URL)
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit it

### Response Timeline

- **Acknowledgement**: Within 48 hours of your report
- **Initial assessment**: Within 7 days
- **Fix & disclosure**: Coordinated with you, typically within 30–90 days depending on severity

We deeply appreciate responsible disclosure and will credit you in the release notes unless you prefer to remain anonymous.

## Scope

HashPilot is a **local desktop application**. The attack surface is limited to:

- The embedded FastAPI backend server (runs on `localhost:8000` only)
- The SQLite database stored in `%APPDATA%\HashPilot\`
- The Electron wrapper and its IPC bridge

The application does **not** transmit data externally and has no cloud backend by default.

## Out of Scope

- Vulnerabilities in third-party dependencies (report those to the respective upstream project)
- Issues that require physical access to the user's machine
- Social engineering attacks
