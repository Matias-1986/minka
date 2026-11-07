# MINKA Admin API v1

Base URL: `http://localhost:4000/api/v1/admin`

Autenticación: `Authorization: Bearer <JWT>` (obtenido en login).

## Roles y permisos

| Rol | Descripción |
|-----|-------------|
| `admin` | Lectura y escritura en backoffice |
| `viewer` | Solo lectura |

| Permiso | admin | viewer |
|---------|-------|--------|
| dashboard:read | ✓ | ✓ |
| opportunities:read | ✓ | ✓ |
| opportunities:write | ✓ | |
| users:read | ✓ | ✓ |
| users:write | ✓ | |
| investments:read | ✓ | ✓ |
| investors:read | ✓ | ✓ |
| investors:write | ✓ | |

## Auth

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/auth/login` | `{ email, password }` → `{ token, user }` |
| GET | `/auth/me` | Usuario actual |

## Dashboard

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/dashboard/stats` | Métricas generales |

## Oportunidades

| Método | Ruta | Permiso | Descripción |
|--------|------|---------|-------------|
| GET | `/opportunities` | read | Listado (filtros: publicationStatus, listingStatus, category) |
| GET | `/opportunities/:id` | read | Detalle |
| POST | `/opportunities` | write | Crear borrador |
| PATCH | `/opportunities/:id` | write | Actualizar |
| POST | `/opportunities/:id/publish` | write | Publicar |
| DELETE | `/opportunities/:id` | write | Archivar |

## Inversores

| Método | Ruta | Permiso | Descripción |
|--------|------|---------|-------------|
| GET | `/investors` | read | Listado con métricas (`?q=`, `?kycStatus=`) |
| GET | `/investors/:id` | read | Detalle + inversiones + métodos de pago |
| POST | `/investors` | write | Alta de inversor |
| PATCH | `/investors/:id` | write | KYC, datos, activar/desactivar |

## Equipo backoffice (`/users`)

| Método | Ruta | Permiso | Descripción |
|--------|------|---------|-------------|
| GET | `/users` | read | Listado (`?q=`, `?role=`, `?scope=backoffice`) |
| GET | `/users/:id` | read | Detalle |
| POST | `/users` | write | Crear usuario backoffice |
| PATCH | `/users/:id` | write | Actualizar roles, estado, etc. |

## Inversiones

| Método | Ruta | Permiso |
|--------|------|---------|
| GET | `/investments` | read |

## Uploads

| Método | Ruta | Permiso | Descripción |
|--------|------|---------|-------------|
| POST | `/uploads/opportunity-image` | write | `multipart/form-data` campo `image` → `{ url }` |

Las imágenes se sirven en `http://localhost:4000/uploads/opportunities/...`

## Gestores

| Método | Ruta | Permiso | Descripción |
|--------|------|---------|-------------|
| GET | `/managers` | read | Lista gestores (`?q=`, `?active=true`) |
| GET | `/managers/:id` | read | Detalle |
| POST | `/managers` | write | Crear gestor |
| PATCH | `/managers/:id` | write | Actualizar |
| DELETE | `/managers/:id` | write | Eliminar (soft delete si aplica) |

## Tablas maestras

Tipos: `category`, `risk`, `listing_status`, `publication_status`.

| Método | Ruta | Permiso | Descripción |
|--------|------|---------|-------------|
| GET | `/masters` | read | Lista (`?type=category`, `?active=true`) |
| GET | `/masters/:id` | read | Detalle |
| POST | `/masters` | write | Crear (`type`, `code`, `label`, `description`, `sortOrder`) |
| PATCH | `/masters/:id` | write | Actualizar |
| DELETE | `/masters/:id` | write | Eliminar |

Los valores de riesgo usan `label` (`Bajo`, `Medio`, `Alto`) para coincidir con el enum de oportunidades.

## Usuarios demo (seed)

- **Admin:** admin@minca.com / admin123
- **Viewer:** viewer@minca.com / viewer123
