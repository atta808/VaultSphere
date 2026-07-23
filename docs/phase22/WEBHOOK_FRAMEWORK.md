# Webhook Framework

## Overview
Webhooks allow VaultSphere to asynchronously notify external systems of data changes or receive automated inputs.

## Features
- **Incoming Webhooks:** Signature validation, payload extraction, and routing to application events.
- **Outgoing Webhooks:** Event subscription, signature generation, delivery queue, and retry mechanisms.

## Retry Queue
Failures in delivery trigger an exponential backoff retry stored in the `webhook_deliveries` SQLite table.

## Signature Validation
All payloads must include an integrity signature verifiable against stored keys.
