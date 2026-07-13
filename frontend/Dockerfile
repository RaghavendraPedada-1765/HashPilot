# ── Stage 1: Build ────────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

# Inject the API URL at build time (set via Docker --build-arg or env in compose)
ARG VITE_API_BASE_URL
ARG VITE_BENCHMARK_WS_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_BENCHMARK_WS_URL=$VITE_BENCHMARK_WS_URL

RUN npm run build


# ── Stage 2: Serve with nginx ─────────────────────────────────────────────────
FROM nginx:alpine AS runtime

# Remove default nginx page
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Ensure client-side routing works (React Router)
RUN printf 'server {\n  listen 80;\n  root /usr/share/nginx/html;\n  index index.html;\n  location / {\n    try_files $uri $uri/ /index.html;\n  }\n}\n' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]