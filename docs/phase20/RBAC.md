# Role-Based Access Control (RBAC)

## Entity Relationships
Normalizes member relationships into individual mapping tables instead of relying on arrays/comma-separated strings:
- `organization_members`
- `department_members`
- `team_members`
- `user_roles`

## Roles Table
- `enterprise_roles` manages role descriptions and associated permissions, directly integrated with VaultSphere's core `PermissionService` (future).
