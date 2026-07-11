# ── Stage 1: Build / dependency installation ──────────────────────────────────
FROM python:3.13-slim AS builder

WORKDIR /build

# Install build tools for packages that compile C extensions.
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt


# ── Stage 2: Runtime image ────────────────────────────────────────────────────
FROM python:3.13-slim AS runtime

# Create a non-root user for security.
RUN groupadd --gid 1001 hashpilot && \
    useradd  --uid 1001 --gid hashpilot --no-create-home hashpilot

WORKDIR /app

# Copy installed packages from builder stage.
COPY --from=builder /install /usr/local

# Copy application code.
COPY --chown=hashpilot:hashpilot . .

# Expose the default port.
EXPOSE 8000

# Switch to non-root user.
USER hashpilot

# Production command:
#   --workers 1 keeps multiprocessing benchmark workers from competing with
#   uvicorn workers. Increase if you move long-running tasks to a queue.
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "1"]