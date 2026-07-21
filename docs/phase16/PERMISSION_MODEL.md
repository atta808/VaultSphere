# Permission Model

## Roles
- **Owner**: Full access, deletion, and permission management.
- **Administrator**: Broad capabilities minus workspace deletion.
- **Editor**: Can alter resources but not manage access.
- **Commenter**: Can view and add annotations/comments.
- **Viewer**: Read-only.

## Permission Overrides
By default, roles apply at the Workspace level. Specific overrides are supported via the `permissions` table, allowing specific resources to have isolated rules (e.g., temporary view-only links overriding a general workspace editor role).

## Validation
Every service operation modifying collaboration data must run through `PermissionService.checkPermission` before execution.
