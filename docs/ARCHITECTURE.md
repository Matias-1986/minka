# Arquitectura MINKA

## Propósito

MINKA permite a inversores explorar oportunidades, completar un flujo de inversión y consultar cartera/notificaciones. Operadores gestionan catálogo, gestores, inversores e inversiones desde un backoffice.

## Componentes

### 1. Frontend inversor (`src/`)

- **Bootstrap:** `App.jsx` elige layout móvil (`MobileApp`) o desktop (`DesktopApp`) según `useIsMobile`.
- **Auth:** `AuthContext` guarda JWT en `localStorage`, expone login/logout y puede permitir navegar sin cuenta.
- **Datos:** `AppDataContext` + hooks (`useOpportunities`, `usePortfolio`, …) llaman a `src/api/` contra `VITE_API_URL`.
- **Flujos principales:** listado/detalle de oportunidades → `InvestmentFlow` → portfolio / notificaciones / cuenta.

### 2. Backoffice (`src/backoffice/`)

- Entrada independiente (`backoffice.html`) para no mezclar rutas con la app pública.
- Auth JWT con roles (`admin`, `viewer`, …) y permisos en `permissions.js` (cliente) alineados a `server/src/permissions.js`.
- Páginas: dashboard, oportunidades, managers, inversores, inversiones, masters, usuarios.

### 3. API (`server/src/`)

```
index.js
  ├── /api/health
  ├── /api/v1/*          ← app inversor (auth JWT; en no-producción también X-User-Id)
  │     auth, opportunities, portfolio, investments,
  │     notifications, users, payment-methods, favorites
  └── /api/v1/admin/*    ← backoffice (JWT + permisos)
        auth, dashboard, opportunities, users, investors,
        investments, managers, masters, uploads
```

- **Modelos:** User, Opportunity, Investment, Manager, Notification, Payment, PaymentMethod, Favorite, Master, OpportunityReport.
- **Serializers:** adaptan documentos Mongo al shape esperado por la UI (incl. ids legacy cuando aplica).
- **Uploads:** imágenes de oportunidades vía Multer (MIME allowlist, máx. 5 MB), servidas en `/uploads`.

### 4. Base de datos

MongoDB. Esquema e índices: [server/docs/DATABASE.md](../server/docs/DATABASE.md). Seed reproducible: `server/src/scripts/seed.js`.

## Flujo de una inversión (resumen)

1. El usuario autenticado elige una oportunidad abierta.
2. `InvestmentFlow` guía monto, método de pago y confirmaciones en UI.
3. El frontend crea/actualiza recursos vía `POST/PATCH` en `/api/v1/investments` (y relacionados).
4. Portfolio y notificaciones se leen de endpoints dedicados.

## Seguridad (diseño actual)

| Control | Implementación |
|---------|----------------|
| Contraseñas | scrypt con salt por usuario (`server/src/utils/password.js`); compatibilidad temporal con hashes SHA-256 legacy del seed anterior |
| Sesión API | JWT firmado (`JWT_SECRET`); backoffice exige roles de operador |
| Autorización | `requireAuth` / `requireAdminAuth` + `requirePermission` |
| CORS | Orígenes explícitos en `CORS_ORIGIN` (lista separada por comas) |
| Uploads | Solo imágenes permitidas; nombre de archivo aleatorio |
| Secretos | `.env` fuera de git (ver `.gitignore`) |

**Importante para producción:** definir `NODE_ENV=production`, un `JWT_SECRET` fuerte y **no** confiar en `X-User-Id` / `DEMO_USER_ID` (deshabilitados cuando `NODE_ENV=production`).

## Decisiones de diseño

- **Dos HTML entrypoints:** permite desplegar app y backoffice desde el mismo build Vite sin router compartido.
- **Responsive dual:** experiencias móvil y desktop separadas en lugar de un único layout adaptativo complejo.
- **API versionada (`/api/v1`):** deja margen para evolucionar contratos sin romper clientes.
