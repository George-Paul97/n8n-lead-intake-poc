# n8n Lead Intake PoC (Webhook → Postgres Upsert → Enrichment → Routing → Weekly Digest)

A small, demonstrable n8n proof-of-concept focused on **reliable automation patterns**:
- Webhook intake (JSON)
- Validation & sanitization
- **Idempotency** (duplicate prevention) + **Postgres upsert**
- Enrichment via a mock provider API
- Routing (Discord/Slack webhook notification)
- Error logging to Postgres
- Weekly digest via Cron + email (MailHog)

## Repository Structure
- `infra/` – Docker Compose stack + database init scripts
- `mock-provider/` – mock enrichment API (Express)
- `workflows/` – exported n8n workflows (`.json`)
- `sample-payloads/` – sample JSON payloads for webhook testing
- `docs/` – build notes and workflow steps

## Quickstart
1. Copy `.env.example` → `.env` and set values (especially `N8N_ENCRYPTION_KEY`)
2. Start the stack:
```bash
   docker compose -f infra/docker-compose.yml up -d --build
```
3. Open n8n (basic auth from .env):

http://localhost:5678

4. Import workflows from workflows/ (after you export them from the n8n UI)

## Demo (after workflows are imported)

Send the sample payload to the webhook:
```bash
curl -X POST http://localhost:5678/webhook/lead-intake \
  -H "Content-Type: application/json" \
  -d @sample-payloads/lead.json
```

Then verify:
- Postgres tables: leads and lead_events
- Notification for high-value leads (Discord/Slack)
- Weekly digest email in MailHog UI: http://localhost:8025

Reliability Notes:
- Idempotency is enforced via a unique idempotency_key in Postgres.
- Errors are captured through a dedicated error workflow (Error Trigger) and logged to lead_events.