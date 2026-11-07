# MINKA

Plataforma de inversión en activos del mundo real (RWA): exploración de oportunidades, flujo de inversión, cartera y backoffice de administración.

## Arquitectura

```
┌─────────────────────┐     HTTPS/JSON      ┌──────────────────────┐
│  Frontend (Vite)    │ ◄─────────────────► │  API (Express)       │
│  React 19           │   /api/v1/*         │  JWT + roles         │
│  · App inversor     │                     │  Multer (uploads)    │
│  · Backoffice       │                     └──────────┬───────────┘
└─────────────────────┘                                │
                                                       ▼
                                              ┌────────────────┐
                                              │  MongoDB       │
                                              │  db: minka     │
                                              └────────────────┘
```

| Capa | Tecnología | Entrada |
|------|------------|---------|
| App inversor | React + Tailwind | `index.html` → `src/main.jsx` |
| Backoffice | React + Tailwind | `backoffice.html` → `src/backoffice/main.jsx` |
| API | Express (ESM) | `server/src/index.js` → `/api/v1` y `/api/v1/admin` |
| Persistencia | MongoDB + Mongoose | modelos en `server/src/models/` |

Detalle de módulos, flujos y seguridad: **[docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)**.

Documentación de API: [server/docs/API.md](./server/docs/API.md), [server/docs/ADMIN_API.md](./server/docs/ADMIN_API.md), [server/docs/DATABASE.md](./server/docs/DATABASE.md).

## Requisitos

- Node.js 20+
- MongoDB 7+ (local, Docker o Atlas)

## Puesta en marcha

```bash
# Dependencias
npm install
npm install --prefix server

# Variables de entorno
cp .env.example .env
cp server/.env.example server/.env

# Base de datos (opción Docker)
cd server && docker compose up -d && cd ..

# Datos de demostración
npm run seed

# API + frontend (en dos terminales)
npm run dev:api
npm run dev
```

- App: http://localhost:5173  
- Backoffice: http://localhost:5173/backoffice.html  
- API health: http://localhost:4000/api/health  

Tras el seed, copiá el `DEMO_USER_ID` impreso a `server/.env` (solo desarrollo). Credenciales demo: ver `server/README.md`.

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Frontend Vite |
| `npm run build` | Build de producción (`dist/`) |
| `npm run dev:api` | API con watch |
| `npm run seed` | Carga datos demo |
| `npm run dev:backoffice` | Abre el backoffice |

## Despliegue

El frontend puede publicarse como estático (p. ej. Vercel). La API y MongoDB deben hostearse por separado; configurá `VITE_API_URL` en el build del frontend y `CORS_ORIGIN` / `JWT_SECRET` / `MONGODB_URI` en el servidor.

## Transparencia sobre asistencia de IA

Ver [AI_DISCLOSURE.md](./AI_DISCLOSURE.md).
