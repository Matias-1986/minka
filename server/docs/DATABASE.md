# Base de datos MINKA (MongoDB)

Base de datos: **`minka`**  
URI por defecto: `mongodb://localhost:27017/minka`

## Colecciones

| Colección | Modelo | Descripción |
|-----------|--------|-------------|
| `users` | User | Inversores y futuros usuarios backoffice (`roles`) |
| `managers` | Manager | Gestores / desarrolladores de proyectos |
| `opportunities` | Opportunity | Oportunidades de inversión |
| `opportunityreports` | OpportunityReport | Informes periódicos por proyecto |
| `investments` | Investment | Posiciones en cartera del inversor |
| `payments` | Payment | Intentos y confirmaciones de pago |
| `paymentmethods` | PaymentMethod | Tarjetas / wallets guardadas |
| `notifications` | Notification | Notificaciones in-app |
| `favorites` | Favorite | Oportunidades favoritas por usuario |

## Campos clave para backoffice (futuro)

### `users.roles`
- `investor` — app actual
- `admin` — gestión total backoffice
- `operator` — soporte / operaciones

### `opportunities.publicationStatus`
- `draft` → `published` → `archived`

### `opportunities.listingStatus`
- `open` — visible en tab Abiertas
- `upcoming` — tab Próximas
- `closed` — fondeo cerrado

### `investments.status`
- `pending_payment` → `active` → `completed` | `cancelled` | `failed`

### `payments.status`
- `pending` → `processing` → `completed` | `failed` | `expired`

## Índices principales

- `users`: `email` (unique), `roles`
- `opportunities`: `category + listingStatus + publicationStatus`, `legacyId`, `slug`
- `investments`: `userId + status`, `operationRef` (unique)
- `notifications`: `userId + read + createdAt`
- `favorites`: `userId + opportunityId` (unique)

## Diagrama de relaciones

```
Manager 1───* Opportunity
User 1───* Investment *───1 Opportunity
User 1───* Payment *───1 Investment
User 1───* Notification
User 1───* PaymentMethod
User 1───* Favorite *───1 Opportunity
Opportunity 1───* OpportunityReport (`badgeNew` → API `isNew`)
```

## Seed

```bash
cd server
npm install
cp .env.example .env
npm run seed
```

Copiar `DEMO_USER_ID` al `.env` para autenticación en desarrollo.
