# Programming Humour

Full-stack React app for sharing programmer-humor jokes: browse, vote, post when signed in, and delete only your own jokes. Built with **TanStack Start**, **better-auth**, **PostgreSQL**, and **Drizzle ORM**.

**Repository:** [github.com/mauricetsai/programming-humour](https://github.com/mauricetsai/programming-humour)

## Features

- Landing page with welcome copy and joke list (Top 3 by score, then “More Jokes”)
- Empty state: **No jokes found.**
- **Sign in** via email/password (modal in the header)
- **Add Joke** (setup + punchline) — gated when logged out; direct URL shows an access message
- **Voting** (`++` / `--`): one vote per user per joke; toggle to remove vote
- **Delete** only on jokes you created (enforced on the server)
- Optional **left / right** placement for vote controls (saved in `localStorage`)
- Light / dark theme toggle
- Author name and relative time on each card

## Prerequisites

- Node.js 20+ (recommended)
- A **PostgreSQL** database (e.g. [Neon](https://neon.tech))

## Environment variables

Create `.env.local` in the project root (never commit this file):

| Variable | Description |
| -------- | ----------- |
| `DATABASE_URL` | PostgreSQL connection string |
| `BETTER_AUTH_SECRET` | Long random secret for session crypto (`openssl rand -hex 32` or similar) |
| `BETTER_AUTH_URL` | Origin users open in the browser—e.g. `http://localhost:3000` in dev, or your deployed URL (must match the site origin or auth callbacks can fail) |

## Setup

```bash
git clone https://github.com/mauricetsai/programming-humour.git
cd programming-humour
npm install
```

Apply database schema (use one approach):

```bash
# Migrations (from repo SQL under drizzle/)
npm run db:migrate
```

Or for quick local iteration:

```bash
npm run db:push
```

Generate a secret if needed and add it to `.env.local` as `BETTER_AUTH_SECRET`.

## Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (port is set in `package.json`).

## Scripts

| Command | Purpose |
| ------- | ------- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run db:generate` | Generate Drizzle migrations from schema |
| `npm run db:migrate` | Run migrations |
| `npm run db:push` | Push schema without migration files |
| `npm run db:studio` | Drizzle Studio |

## Tech stack

- **Framework:** TanStack Start / React 19 / Vite  
- **Styling:** Tailwind CSS v4  
- **Auth:** better-auth (Drizzle adapter)  
- **Database:** PostgreSQL, Drizzle ORM  