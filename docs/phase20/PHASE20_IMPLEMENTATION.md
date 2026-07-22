# Phase 20: Enterprise Content Management (ECM), Records Governance & Administration Platform

## Overview
Phase 20 transforms VaultSphere into a complete Enterprise Content Management (ECM) platform. It introduces records management, enterprise governance, retention policies, legal holds, compliance management, organizational administration, and enterprise RBAC—all while preserving the existing offline-first architecture.

## Architecture
- **Offline-First**: All governance policies and structures are synchronized locally using the `GovernanceSyncService`, which builds payloads and enqueues them via `SyncQueueService` for the orchestrating `CloudSyncService`.
- **Database Architecture**: Implements a dedicated set of SQLite tables for enterprise governance without heavily modifying the core `documents` table to maintain backward compatibility.
- **Centralized Engine**: All governance decisions (classifications, retention evaluation, legal hold enforcement, and disposal validation) pass through the `GovernanceEngine`.

## Supported Capabilities (Extensible for SaaS)
- **Multi-Tenant SaaS Deployments** (Supported via `organizations` and mapping tables)
- **Enterprise Policy Engines** (Supported via `governance_rules`)
- **eDiscovery & Automated Records Disposal**
- **Microsoft Purview & 365 Compliance Integration**
- **Cross-Organization Governance**

## Completed Components
- Migrations: `011_phase20_enterprise_governance.js`
- Repositories: Dozens of new repositories extending `BaseRepository` mapping to enterprise tables.
- Services: `GovernanceEngine`, `RecordsManagementService`, `RetentionPolicyService`, `LegalHoldService`, `ClassificationService`, `OrganizationService`, `DepartmentService`, `RoleManagementService`, `ComplianceService`, `ComplianceReportingService`, `EnterpriseAdministrationService`, and `GovernanceSyncService`.
- UI: New enterprise screens grouped in `EnterpriseStack` accessible from Settings, Document Details, and Home Dashboard.
