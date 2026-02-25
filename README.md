# Stare Bene

Milestone 1 implementato con Next.js App Router + Tailwind + componenti shadcn/ui base, auth con email/password e layout responsive.

## Setup locale

1. Installa dipendenze:
   ```bash
   npm install
   ```
2. Copia env:
   ```bash
   cp .env.example .env
   ```
3. Imposta autenticazione:
   - `NEXTAUTH_SECRET` (stringa casuale)
   - `AUTH_LOGIN_EMAIL`
   - `AUTH_LOGIN_PASSWORD`
4. Avvia app:
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

## Note deploy Vercel

- Impostare tutte le variabili in `.env.example`.
- Auth routes disponibili su `/api/auth/*`.
