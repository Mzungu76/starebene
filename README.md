# Stare Bene

Milestone 1 + Milestone 2 implementate con Next.js App Router, Tailwind, auth credentials, layout responsive e schema dati core su Prisma/PostgreSQL.

## Setup locale

1. Installa dipendenze:
   ```bash
   npm install
   ```
2. Copia env:
   ```bash
   cp .env.example .env
   ```
3. Imposta variabili minime:
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET`
   - `AUTH_LOGIN_EMAIL`
   - `AUTH_LOGIN_PASSWORD`
4. Genera client Prisma:
   ```bash
   npm run prisma:generate
   ```
5. Applica migrazioni:
   ```bash
   npm run prisma:migrate
   ```
6. (Facoltativo) Seed demo:
   ```bash
   npm run db:seed
   ```
7. Avvia app:
   ```bash
   npm run dev
   ```

## Rotte milestone 1

- `/` landing
- `/login` login con password
- `/app` dashboard protetta
- `/app/check-in`
- `/app/plan`
- `/app/today`
- `/app/settings`

## API milestone 2 (CRUD base)

- `GET/POST /api/profile`
- `GET/POST /api/check-in`

## Prisma scripts

- `npm run prisma:generate`
- `npm run prisma:migrate`
- `npm run prisma:studio`
- `npm run db:seed`

## Note deploy Vercel

- Impostare tutte le variabili in `.env.example`.
- Auth routes disponibili su `/api/auth/*`.
