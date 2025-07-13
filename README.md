# 🐝 PulseHive

> A cloud-native, microservices-based **observability and alerting system** designed to monitor, trace, and triage logs in real time. Built with a modular architecture using **Node.js + TypeScript**, **React**, and deployed on **Render.com**'s free tier.

---

## 🚀 Tech Stack

### 📦 Backend (Node.js + TypeScript)
- **Framework**: Express
- **Authentication**: JWT + bcrypt
- **Logging**: `winston` (or `pino`) with pretty-print and structured JSON
- **Metrics**: `prom-client` + `/metrics` endpoint (Prometheus compatible)
- **Health Checks**: Custom `/health` and `/readiness` endpoints
- **Background Jobs / Queues**: `BullMQ` with Redis
- **Caching**: Redis
- **Circuit Breakers**: `opossum`
- **Observability**: OpenTelemetry SDK (traces, spans, logs)

### 🎨 Frontend (React + Vite)
- **UI Library**: shadcn/ui (Tailwind-based component system)
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Charts**: Recharts or Chart.js (for metrics visualization)
- **State Management**: useContext or Zustand (lightweight)

### ☁️ Cloud Deployment
- **Platform**: [Render.com](https://render.com)
- **Deployment Type**: Monorepo with separate service deployments
- **Free Tier Friendly**: Fully deployable within Render's free limits

---

## 🧱 Folder Structure

```
PulseHive/
├── auth-api/           # Auth service (JWT login/register)
├── ingestor-api/       # Log ingestion service
├── alert-engine/       # Alerting & rule engine
├── dashboard-ui/       # React-based frontend UI
├── log-agent/          # Dummy log generator for testing
├── docs/               # Design docs, diagrams, OpenAPI specs
├── .github/            # CI/CD configs or GitHub Project board
└── README.md           # You're here!
```

---

## 🌐 Deployment Strategy (Render.com)

Each microservice is deployed as a **separate web service** on Render:

- Point each service to the root repo
- Set the root directory in Render's settings (e.g., `auth-api/`)
- Use standard build/start commands:
  ```bash
  # Example for auth-api
  Build Command: cd auth-api && npm install
  Start Command: cd auth-api && npm start
  Root Directory: auth-api/
  ```

Redis and background queues can be hosted on:
- Render Redis (if available)
- External free Redis providers like [Upstash](https://upstash.com)

---

## 🛠 Current Services

| Service | Description |
|--------|-------------|
| `auth-api` | Handles user registration, login, and JWT generation |
| `ingestor-api` | Accepts logs/metrics from external services |
| `alert-engine` | Watches logs/metrics and triggers rule-based alerts |
| `dashboard-ui` | Frontend React app for viewing logs, charts, and alerts |
| `log-agent` | CLI tool or microservice that generates dummy logs for testing |

---

## 🔍 Features Planned
- [x] Modular microservices
- [x] Real-time log ingestion
- [x] Auth with JWT
- [ ] Alert rules configuration UI
- [ ] GPT-based log triage assistant (Phase 2)
- [ ] WebSocket/live updates on dashboard

---

## 👨‍💻 Developer Setup

```bash
# Install global tools
npm install -g typescript ts-node nodemon

# Start backend services (from root)
cd auth-api && npm install && npm run dev

# Start frontend
cd dashboard-ui && npm install && npm run dev
```

Optional: Docker Compose or PM2-based multi-service launcher to come in `/scripts`.

---

## 📄 License

MIT — feel free to fork, modify, and use for your own observability projects!

---