# MINKA API v1

Base URL: `http://localhost:4000/api/v1`

## Autenticación

### App inversores

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/auth/login` | `{ email, password }` → `{ token, user }` (rol `investor`) |
| GET | `/auth/me` | Usuario actual (`Authorization: Bearer <token>`) |

Rutas protegidas aceptan `Authorization: Bearer <JWT>`.

En desarrollo también se acepta header `X-User-Id` o `DEMO_USER_ID` en el servidor.

---

## Health

| Método | Ruta | Auth |
|--------|------|------|
| GET | `/api/health` | No |

---

## Oportunidades

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/opportunities` | No* | Listado. Query: `tab=open\|upcoming\|favorites`, `category` |
| GET | `/opportunities/:id` | No* | Detalle (id numérico legacy o ObjectId) |
| GET | `/opportunities/:id/reports` | Sí | Informes del proyecto |

\* Sin login devuelve oportunidades publicadas. Con `X-User-Id` incluye estado de favoritos. `tab=favorites` sin auth devuelve lista vacía.

---

## Cartera

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/portfolio/summary` | Resumen cartera total |
| GET | `/portfolio/holdings` | Mis inversiones |
| GET | `/portfolio/holdings/:id` | Detalle de una inversión |

---

## Flujo de inversión

| Método | Ruta | Body | Descripción |
|--------|------|------|-------------|
| POST | `/investments` | `{ opportunityId, amountUsd }` | Crear inversión pendiente de pago |
| POST | `/investments/:id/payments` | `{ method, subMethod, ... }` | Iniciar pago |
| POST | `/investments/:id/payments/:paymentId/confirm` | `{ simulateFailure?, failureVariant? }` | Confirmar / simular error |
| GET | `/investments/:id` | | Estado inversión + pagos |

**method:** `ars` | `usd` | `crypto`  
**subMethod:** `wallet` | `transfer` | `card`

---

## Notificaciones

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/notifications` | Listado (`?unread=true`) |
| GET | `/notifications/:id` | Detalle |
| PATCH | `/notifications/:id/read` | Marcar leída |
| POST | `/notifications/read-all` | Marcar todas leídas |

---

## Usuario

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/users/me` | Perfil actual |
| PATCH | `/users/me` | Actualizar datos personales |

---

## Métodos de pago

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/payment-methods` | Listar |
| POST | `/payment-methods` | Vincular tarjeta/crypto |
| DELETE | `/payment-methods/:id` | Eliminar (soft) |

---

## Favoritos

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/favorites` | Listar favoritos |
| PUT | `/favorites/:opportunityId` | Agregar |
| DELETE | `/favorites/:opportunityId` | Quitar |

---

## Respuestas

Formato estándar:

```json
{ "data": { ... }, "meta": { ... } }
```

Errores:

```json
{ "error": "Mensaje descriptivo" }
```

Los serializers devuelven shapes compatibles con el frontend mock (`id` numérico legacy cuando existe `legacyId`).
