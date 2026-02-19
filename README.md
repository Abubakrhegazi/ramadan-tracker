# 🌙 Ramadan Competition Tracker

A production-ready, multi-tenant web app for running Ramadan ibadah competitions within groups. Track Taraweeh (تراويح), Tahajjud (تهجد), and Quran reading (قراءة القرآن) with daily leaderboards.

---

## ✨ Features

- **Multi-tenant groups** — fully isolated per group
- **Arabic-first RTL UI** with English support
- **Anti-cheat controls** — time-locked editing, admin overrides, audit logs
- **Leaderboards** — daily, overall with tie-breaking
- **Calendar heatmap** — visual progress grid
- **Mobile-first** — 10-second daily update UX
- **Admin panel** — member management, day locking, settings
- **Full audit trail** — all changes logged

---

## 🚀 Quick Start (Docker)

### Prerequisites
- Docker & Docker Compose
- Git

### 1. Clone and configure

```bash
git clone https://github.com/youruser/ramadan-tracker.git
cd ramadan-tracker
cp .env.example .env
```

Edit `.env` and set a strong `JWT_SECRET` (min 32 chars).

### 2. Start with Docker Compose

```bash
docker compose up -d
```

### 3. Run migrations & seed

```bash
# Wait for containers to be healthy, then:
docker compose exec app npx prisma migrate deploy --schema=./prisma/schema.prisma
docker compose exec app npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed.ts
```

### 4. Open the app

Visit [http://localhost:3000](http://localhost:3000)

**Demo account:** `ahmed@demo.com` / `password123`  
**Demo group slug:** `demo-family`  
**Demo invite code:** `DEMO2024`

---

## 💻 Local Development (without Docker)

### Prerequisites
- Node.js 20+
- PostgreSQL 16

### Setup

```bash
# Install dependencies
cd apps/web
npm install

# Configure environment
cp ../../.env.example ../../.env
# Edit .env with your local DATABASE_URL

# Generate Prisma client
npx prisma generate --schema=../../prisma/schema.prisma

# Run migrations
npx prisma migrate dev --schema=../../prisma/schema.prisma

# Seed database
npx prisma db seed

# Start development server
npm run dev
```

---

## 🏗️ Repo Structure

```
ramadan-tracker/
├── apps/
│   └── web/                    # Next.js 14 app
│       ├── app/
│       │   ├── api/            # API routes
│       │   │   ├── auth/       # login, signup, logout, me
│       │   │   ├── groups/     # group CRUD + members + logs
│       │   │   └── health/     # health check
│       │   ├── auth/           # login, signup pages
│       │   ├── dashboard/      # user's groups
│       │   ├── groups/         # group pages
│       │   │   ├── create/     # create group
│       │   │   └── [slug]/     # group dashboard + settings
│       │   ├── join/           # join via invite code
│       │   └── layout.tsx      # root layout (RTL, fonts)
│       ├── components/         # shared UI components
│       ├── hooks/              # React hooks
│       ├── lib/                # utilities (auth, prisma, ramadan, etc.)
│       ├── __tests__/          # unit tests
│       └── e2e/                # Playwright E2E tests
├── packages/
│   └── shared/                 # shared types + zod schemas
├── prisma/
│   ├── schema.prisma           # database schema
│   └── seed.ts                 # demo data seeder
├── docker-compose.yml
├── Dockerfile
├── .env.example
└── README.md
```

---

## 🔌 API Reference

### Auth
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/logout` | Logout (clears cookie) |
| GET | `/api/auth/me` | Current user |

### Groups
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/groups` | Create group |
| POST | `/api/groups/join` | Join by invite code |
| GET | `/api/groups/:slug` | Group details |
| PATCH | `/api/groups/:slug` | Update settings (admin) |
| GET | `/api/groups/:slug/invite` | Get invite code |
| POST | `/api/groups/:slug/invite` | Regenerate code (admin) |

### Logs
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/groups/:slug/logs` | All group logs |
| PUT | `/api/groups/:slug/logs` | Upsert today's log |
| POST | `/api/groups/:slug/logs/admin` | Admin override log |

### Leaderboard
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/groups/:slug/leaderboard?type=overall` | Overall leaderboard |
| GET | `/api/groups/:slug/leaderboard?type=daily&day=1` | Daily leaderboard |

### Members
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/groups/:slug/members` | List members |
| DELETE | `/api/groups/:slug/members/:userId` | Kick member (admin) |
| PATCH | `/api/groups/:slug/members/:userId` | Change role (admin) |

### Days
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/groups/:slug/days/:day` | Lock/unlock day (admin) |

### Health
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check + DB status |

---

## 🔒 Security

- **Authentication:** JWT stored in HttpOnly cookies (7 day expiry)
- **Passwords:** bcrypt (12 rounds)
- **Authorization:** All group endpoints verify membership; admin endpoints verify ADMIN role
- **Rate limiting:** Auth endpoints (5 req/15min), log writes (30 req/min), group creation (5/hr)
- **Input validation:** Zod on all API inputs
- **Anti-cheat:**
  - Users can only edit own logs
  - Server-enforced time window (today only, before cutoff hour)
  - Admin overrides create audit logs

---

## 🧪 Testing

```bash
cd apps/web

# Unit tests
npm test

# With coverage
npm test -- --coverage

# E2E tests (requires running app)
npm run test:e2e
```

---

## 📊 Database

### Backup

```bash
# Backup
docker compose exec postgres pg_dump -U ramadan ramadan_tracker > backup.sql

# Restore
docker compose exec -T postgres psql -U ramadan ramadan_tracker < backup.sql
```

### Migrations

```bash
# Create new migration (development)
cd apps/web
npx prisma migrate dev --name your_migration_name --schema=../../prisma/schema.prisma

# Deploy migrations (production)
npx prisma migrate deploy --schema=../../prisma/schema.prisma
```

---

## 🌐 Deployment

### VPS (Self-hosted)

1. Install Docker + Docker Compose on your VPS
2. Clone repo and configure `.env`
3. Set up Nginx as reverse proxy:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

4. Use Certbot for SSL: `certbot --nginx -d your-domain.com`
5. Run: `docker compose up -d`

### Render.com

1. Create a PostgreSQL service on Render
2. Create a Web Service pointing to this repo
3. Set environment variables:
   - `DATABASE_URL`: from Render PostgreSQL
   - `JWT_SECRET`: random 32+ char string
4. Build command: `cd apps/web && npm install && npx prisma generate --schema=../../prisma/schema.prisma && npm run build`
5. Start command: `npx prisma migrate deploy --schema=./prisma/schema.prisma && node apps/web/server.js`

### Fly.io

```bash
fly launch
fly secrets set JWT_SECRET=your-secret
fly postgres attach
fly deploy
```

---

## 🛠️ Admin Tasks

### Create a new admin for a group

```sql
UPDATE "GroupMembership" SET role = 'ADMIN' 
WHERE "userId" = 'user-id' AND "groupId" = 'group-id';
```

### Reset invite code manually

```sql
UPDATE "Group" SET "inviteCode" = 'NEWCODE' WHERE slug = 'group-slug';
```

### View audit logs

```sql
SELECT u.name, a.*, FROM "AuditLog" a 
LEFT JOIN "User" u ON u.id = a."userId"
WHERE a."groupId" = 'group-id'
ORDER BY a.timestamp DESC LIMIT 100;
```

---

## ❗ Troubleshooting

**App can't connect to DB:**
```bash
docker compose logs postgres
docker compose exec postgres pg_isready -U ramadan
```

**Migration fails:**
```bash
docker compose exec app npx prisma migrate status --schema=./prisma/schema.prisma
```

**Reset everything:**
```bash
docker compose down -v
docker compose up -d
```

---

## 📝 License

MIT — built for the Muslim community. May Allah accept it. 🤲
