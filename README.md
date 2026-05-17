# LensCraft — Premium Photography Platform

Single-site deployment for one photographer per install. Deploy a separate instance for each client with their own database, domain, and branding.

## Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16 (App Router), TypeScript, Tailwind CSS, Framer Motion, Lenis, Swiper |
| Backend | Laravel 12, Sanctum, MySQL, Redis, Cloudflare R2 |
| Deploy | Docker, Nginx |

## URLs (per deployment)

| Path | Purpose |
|------|---------|
| `/` | Homepage |
| `/portfolio` | Portfolio grid |
| `/albums/{slug}` | Album gallery |
| `/contact` | Inquiry form |
| `/admin` | Dashboard |

## Project Structure

```
photographer/
├── frontend/          # Next.js site + admin
├── backend/           # Laravel API (single photographer)
├── docker/
└── docker-compose.yml
```

## Quick Start

### Backend

```bash
cd backend
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

Optional: pin the site to one photographer record:

```
PHOTOGRAPHER_ID=1
```

If unset, the first active photographer in the database is used.

Demo login: `demo@lenscraft.in` / `password123`

### Frontend

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

### Docker

```bash
cp .env.example .env
docker compose up -d
```

## API (single site)

Base URL: `/api/v1`

| Endpoint | Description |
|----------|-------------|
| `GET /public` | Site data |
| `GET /public/portfolio` | Albums |
| `GET /public/albums/{albumSlug}` | Album detail |
| `POST /public/inquiries` | Contact form |
| `GET /admin/dashboard` | Analytics (auth) |
| `apiResource /admin/albums` | Album CRUD (auth) |

## Per-photographer deployment

1. Clone this repo for each client
2. Run migrations + seed (or import their data)
3. Set `PHOTOGRAPHER_ID` if multiple rows exist during migration
4. Configure R2 bucket and `NEXT_PUBLIC_SITE_URL`
5. Point domain to Nginx

## Cloudflare R2

```
FILESYSTEM_DISK=r2
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET=
R2_ENDPOINT=
R2_PUBLIC_URL=
```

## Architecture

```
Controller → Service → Repository → Model
```

Public routes resolve the photographer via `PhotographerRepository::current()` (env `PHOTOGRAPHER_ID` or first active record).
# photograph
