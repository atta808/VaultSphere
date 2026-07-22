# Compliance Architecture

## Structure
The compliance system is designed to be purely metadata-driven.
- Supported tables: `compliance_frameworks` and `compliance_reports`.
- Tracks names, versions, controls, requirements, and reference status.

## Future Extensibility
While we do not implement framework-specific rules (e.g., specific ISO 27001 or GDPR rules) directly, the architecture allows regulatory plugins to attach to the framework metadata.
