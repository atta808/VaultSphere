# Phase 17 - Workflow Automation, Digital Signatures & Business Process Engine

## Overview
Implemented the business process engine, enabling configurable workflows, sequential/parallel approvals, tasks, background automation rules, and trusted application-level digital signatures with SHA-256 validation.

## Architecture
- Offline-first: Driven entirely through local SQLite.
- Core Services: WorkflowService, WorkflowEngine, ApprovalService, AutomationRuleService, DigitalSignatureService.
- WorkflowSyncService coordinates synchronization payloads through the CloudSyncService (no direct provider interactions).

## Migrations
- `008_phase17_workflow.js`: Introduces tables for `workflows`, `workflow_steps`, `workflow_templates`, `workflow_instances`, `approvals`, `approval_history`, `tasks`, `automation_rules`, `reminders`, `signatures`, `signature_history`, `document_lifecycle`.

## Features
- Workflow template creation and parsing
- Automation Rules based on conditions and actions
- Digital Signatures with document content hashing
- Document lifecycle tracking
- Fully integrated into Navigation (WorkflowStack) accessible via Settings and Document Details contexts
- AI Integration for summarizing workflows and suggesting templates.

## Security
- PermissionService validated on sensitive actions.
- AuditTrailService logging for approvals and signatures.

## Manual Verification Required
- Creating a Workflow Template via UI.
- Initializing a workflow from Document Details.
- Evaluating a parallel approval logic path.
- Applying a Digital Signature.
