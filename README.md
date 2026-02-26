# Stare Bene

Milestone 1-4 con storage locale IndexedDB (nessun Prisma/PostgreSQL) per utilizzo personale.

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


## Milestone 4 (piano dieta settimanale locale)

In `/app/plan` trovi:

- **Genera settimana**: crea piano completo 7 giorni (colazione/pranzo/cena + 2 spuntini)
- **Sostituisci pasto**: rigenera solo il singolo pasto
- **Lista spesa automatica**: aggregata per reparto

I piani vengono salvati in IndexedDB e inclusi nel backup JSON.
