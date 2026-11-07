# MINKA API (backend)

API REST + MongoDB para la plataforma de inversión MINKA (app inversor y backoffice).

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
# Definí un JWT_SECRET propio antes de cualquier entorno compartido
npm run seed
npm run dev     # http://localhost:4000
```

Tras el seed, si desarrollás sin JWT en cada request, podés copiar `DEMO_USER_ID` a `.env`. Ese atajo **no aplica** con `NODE_ENV=production`.

## Probar la API

```bash
curl http://localhost:4000/api/health

# Preferido: login y Bearer token
curl -X POST http://localhost:4000/api/v1/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"juan.martin@gmail.com","password":"password123"}'
```

## Documentación

- [API.md](./docs/API.md) — endpoints v1 (app)
- [ADMIN_API.md](./docs/ADMIN_API.md) — backoffice
- [DATABASE.md](./docs/DATABASE.md) — colecciones e índices
- [ARCHITECTURE.md](../docs/ARCHITECTURE.md) — arquitectura del sistema

## Credenciales de seed (solo desarrollo / demos)

Tras `npm run seed`:

| Rol | Email | Contraseña |
|-----|-------|------------|
| Inversor demo | `juan.martin@gmail.com` | `password123` |
| Admin backoffice | `admin@minca.com` | `admin123` |
| Viewer backoffice | `viewer@minca.com` | `viewer123` |

No usar estas credenciales en producción. Cambiar `JWT_SECRET` y recrear usuarios reales antes de un entorno expuesto.

UI backoffice local: `http://localhost:5173/backoffice.html`
