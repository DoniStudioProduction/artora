# ARTORA — Production Backend (v0.6.0)

Welcome to **Artora**, a premium global marketplace and creative guild that connects discerning collectors directly with independent artisans. This release transforms the client-only prototype into a full-stack production-ready application powered by Node.js, Express, Vite, and Prisma ORM.

---

## 📂 Project Structure

```text
├── prisma/
│   └── schema.prisma        # Complete production relational Prisma schemas
├── src/
│   ├── components/          # Premium high-end React components
│   ├── server/
│   │   ├── db.ts            # Fall-through DB wrapper (PostgreSQL Prisma <-> Local JSON fallback)
│   │   ├── auth.ts          # Session security, JWT generators, and Route guards
│   │   ├── email.ts         # Gold & Ivory themed responsive HTML email templates & dispatcher
│   │   └── routes.ts        # Modular Express REST API for all 12 modules
│   ├── App.tsx              # Main UI flow controller
│   ├── data.ts              # Seeding profiles & initial catalog dataset
│   └── types.ts             # Global TypeScript interface declarations
├── .env.example             # Complete environment configuration schema
├── package.json             # Build commands, scripts, and runtime packages
├── server.ts                # Full-Stack single-port Express + Vite entrypoint
└── README.md                # This comprehensive implementation guide
```

---

## 🛠️ Environment Configuration (`.env`)

To activate the real PostgreSQL database and SMTP mailers, create a `.env` file at the root:

```env
# Production PostgreSQL Connection URI
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/artoradb?schema=public"

# Authentication Secrets
JWT_SECRET="your-jwt-signing-secret"
JWT_REFRESH_SECRET="your-jwt-refresh-secret"

# SMTP Mail Dispatcher (official Artora sender)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="joinartora@gmail.com"
SMTP_PASS="your-gmail-app-password"

# Cloud Image & Video Storage
CLOUDINARY_CLOUD_NAME="artora-cloud"
CLOUDINARY_API_KEY="api-key"
CLOUDINARY_API_SECRET="api-secret"
```

---

## 🗄️ Database Setup Guide (Prisma ORM)

Artora is configured with a **dual-mode database manager**. 

* If no `DATABASE_URL` is set, the application operates in **Sandbox Mode**, reading and writing from a local, persistent JSON store (`artora_local_db.json`) initialized automatically with the official collections. **This prevents any startup crashes in sandboxed developer previews.**
* If `DATABASE_URL` is set, it connects natively to your production PostgreSQL cluster.

### 1. Initialize Prisma and Generate Client
```bash
npx prisma generate
```

### 2. Run Database Migrations
```bash
npx prisma migrate dev --name init_artora_schema
```

### 3. Seed Database
Seed scripts read the static data and commit standard profiles directly into the SQL database tables.

---

## 🔐 Session & Security Architectures

1. **JWT Authentication**: High-security stateless access tokens (1h lifespan) and long-lived secure refresh tokens (7d lifespan).
2. **Password Hashing**: Secure credentials storage using salt-rounds cryptography (`bcryptjs`).
3. **Role-Based Routing**: Guild verification and clearance guards (e.g., only certified `CREATOR` users can submit product logs or update studio journals; only `ADMIN` roles can approve featured creator ratings or suspend members).
4. **Secure Custom Headers**: Auto-configured CSP headers, `X-Frame-Options`, and `Referrer-Policy` settings.
5. **Rate-Limiting**: IP-based flood protection on direct studio messages and authentication endpoints.

---

## ✉️ Premium Branded Mail Systems

Official transmissions are dispatched from **`joinartora@gmail.com`** formatted in the signature **Ivory, Black, and Gold** responsive layout.

* **Welcome Transmission**: Welcomes members to the Artora physical crafts community.
* **Verify Account Link**: 24h duration token validation link with signature page.
* **Credential Reset**: Encoded authorization reset token dispatch.
* **Order Statuses**: Multi-stage triggers (Confirmed ➔ Secured in Crate ➔ Carrier Shipped ➔ Delivered & Unboxed).
* **Direct Messenger Alerts**: Informs creators/collectors of direct incoming messages.

---

## 🔌 API Route Documentation

The REST API is exposed under `/api/*` endpoints.

### 1. Authentication (`/api/auth/*`)
* `POST /api/auth/signup`: Create account (hashes passwords, dispatches custom HTML Welcome & Verification emails).
* `POST /api/auth/login`: Validate credentials, sign access & refresh tokens.
* `POST /api/auth/refresh`: Issues a clean access token with validation.
* `GET /api/auth/verify?token=...`: Verifies account, locks verified role on chain.
* `POST /api/auth/forgot-password`: Generates reset token and dispatches mail.
* `POST /api/auth/reset-password`: Commits new password key.

### 2. Products (`/api/products/*`)
* `GET /api/products`: Advanced multi-parameter search (filters by `category`, `creator`, `country`, `material`, `minPrice`, `maxPrice`, and `sortBy: newest|popular|price-asc|price-desc`).
* `POST /api/products` (Requires `CREATOR` role): Publish a new physical slow-craft piece.
* `DELETE /api/products/:id` (Requires `CREATOR` or `ADMIN` role): Burn catalog item.

### 3. Orders & Payments (`/api/orders/*`)
* `GET /api/orders`: Retrieve collectors' active orders (or all orders for `ADMIN`).
* `POST /api/orders`: Places an order, locks transaction payment, schedules delivery, and dispatches confirmation mail.
* `PATCH /api/orders/:id/status` (Requires `ADMIN` / Courier clearance): Modifies shipping state (Dispatches "Shipped" and "Delivered" branded emails).

### 4. Reviews (`/api/reviews/*`)
* `GET /api/reviews?productId=...`: Retrieve buyer feedback.
* `POST /api/reviews`: Submits a comment + rating (recalculates product and creator overall ratings).
* `POST /api/reviews/:id/reply` (Requires `CREATOR` role): Append creator response text.

### 5. Messenger & Direct Threads (`/api/messages/*`)
* `GET /api/messages/threads`: Read secure conversations.
* `POST /api/messages`: Transmit text, image URLs, or product references (Dispatches message email alerts to recipient).

### 6. Notifications & Followers (`/api/*`)
* `GET /api/notifications`: Retrieve custom notifications.
* `POST /api/notifications/read-all`: Mark all alerts read.
* `POST /api/followers/toggle`: Follow/unfollow an artisan (Triggers follow notification and email alerts).
* `POST /api/wishlist/toggle`: Add or remove pieces from collector wishlist.
* `GET /api/collections`: Retrieve curated series (e.g. Summer Collection, African Heritage).
