# Stare Bene

Milestone 1 + storage locale con IndexedDB (nessun Prisma/PostgreSQL) per utilizzo personale.

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

## Rotte principali

- `/` landing
- `/login` login con password
- `/app` dashboard protetta
- `/app/check-in`
- `/app/plan`
- `/app/today`
- `/app/settings`

## Storage locale (IndexedDB)

In `/app/settings` trovi il pannello backup:

- **Esporta backup**: scarica un file JSON con i dati locali
- **Importa backup**: ricarica un file JSON in IndexedDB

Questo approccio è pensato per uso personale, senza DB esterno.
