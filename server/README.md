# MINKA API (backend)

API REST + MongoDB para la plataforma de inversión MINKA. Alineada al frontend mock y preparada para backoffice.

## Requisitos

- Node.js 20+
- MongoDB local, Docker o Atlas (base de datos `minka`)

### MongoDB con Docker (recomendado)

```bash
cd server
docker compose up -d
```

## Inicio rápido

```bash
cd server
npm install
cp .env.example .env
npm run seed    # carga datos demo del frontend
npm run dev     # http://localhost:4000
```

Tras el seed, copiá `DEMO_USER_ID` al `.env`.

## Probar la API

```bash
curl http://localhost:4000/api/health

curl -H "X-User-Id: <DEMO_USER_ID>" \
  http://localhost:4000/api/v1/opportunities

curl -H "X-User-Id: <DEMO_USER_ID>" \
  http://localhost:4000/api/v1/portfolio/summary
```

## Documentación

- [API.md](./docs/API.md) — endpoints v1
- [DATABASE.md](./docs/DATABASE.md) — colecciones e índices

## Backoffice API

Ver [ADMIN_API.md](./docs/ADMIN_API.md).

Usuarios tras `npm run seed`:
- `admin@minca.com` / `admin123` (admin)
- `viewer@minca.com` / `viewer123` (solo lectura)

UI: `http://localhost:5173/backoffice.html`
