# Scheduler Service

Manages background and periodic execution tasks.

## Mechanism
A hybrid approach utilizing an in-app timer (`setInterval` based) and queued processing (`JobQueueService`), designed to integrate with Expo TaskManager for true background execution where supported.

Supports `ONCE`, `DAILY`, and `HOURLY` job types.
