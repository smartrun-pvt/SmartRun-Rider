# CLOUD_RUN_DEPLOY.md — Google Cloud Run Deployment & Infra Guide
*Production Containerization & Deployment Checklist*

---

## 1. Cloud Run Specifications
- **Target Runtime:** Google Cloud Run (Fully Managed Serverless Containers)
- **Container Port:** Default `8080` (dynamically set via `$PORT` environment variable)
- **Host Binding:** `0.0.0.0`
- **Concurrency:** `80` requests per container instance
- **CPU / Memory:** `1 vCPU`, `512MiB` (optimized for fast cold starts)
- **Health Check Path:** `/health` (initial delay: 0s, timeout: 3s, period: 10s)

---

## 2. Multi-Stage Production Dockerfile

```dockerfile
# Stage 1: Build Frontend Assets
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production Container
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080

COPY package*.json ./
RUN npm ci --omit=dev

# Copy built frontend dist and server script
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.ts ./server.ts
COPY --from=builder /app/tsconfig.json ./tsconfig.json

# Expose Cloud Run default port
EXPOSE 8080

# Execute server via tsx
CMD ["npx", "tsx", "server.ts"]
```

---

## 3. Environment Variables (.env.example)
```ini
# Server runtime configuration
PORT=8080
NODE_ENV=production
HOST=0.0.0.0

# Security secrets (Provided via Google Secret Manager)
SESSION_SECRET=change-me-in-production
API_SECRET_KEY=change-me-in-production
```

---

## 4. Google Cloud Run CLI Deployment Command
```bash
gcloud run deploy smartrun-partner \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8080 \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10
```
