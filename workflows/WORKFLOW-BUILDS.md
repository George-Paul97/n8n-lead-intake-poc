# Building the workflows (n8n Lead Intake PoC)

## Workflow 1: Lead Intake
Goal: Webhook → validate/sanitize → Postgres upsert (idempotency) → enrichment → routing → logging.

Suggested nodes:
1) **Webhook** (POST), path: `/lead-intake`
2) **Function** (sanitize + derive `idempotencyKey`)
3) **IF** (validate email)
4) **Postgres** (UPSERT into `leads`)
5) **HTTP Request** → `http://mock-provider:3001/enrich`
6) **Postgres** (update `leads.enriched`, set status)
7) **IF** (segment == `high_value`) → Discord webhook → log event
8) **Webhook Response** (200)

### Upsert SQL example
```sql
INSERT INTO leads (idempotency_key, email, phone, full_name, source, status, updated_at)
VALUES ($1, $2, $3, $4, $5, 'new', NOW())
ON CONFLICT (idempotency_key)
DO UPDATE SET
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  full_name = EXCLUDED.full_name,
  source = EXCLUDED.source,
  updated_at = NOW()
RETURNING *;
