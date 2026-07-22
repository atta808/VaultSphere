# Retention Policies

## Polymorphic Assignment
Retention policies can be assigned to multiple entity types: Folders, Workspaces, Document Types, Departments, Categories, etc.

We use a polymorphic table: `retention_policy_assignments`.
- `entityType`
- `entityId`
- `retentionPolicyId`
- `priority`

## Resolution
The `GovernanceEngine` determines the effective policy based on inheritance and priority, minimizing the need for duplicated foreign keys across many tables.
