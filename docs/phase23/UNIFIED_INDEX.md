# Unified Index

## Role
Maintains a local metadata index for rapid, offline-capable search filtering.

## Constraints
- **Metadata Only:** The index stores basic identifiers, titles, and permission hashes.
- **Preview Limitation:** External document text caching is strictly limited to small snippets (<= 200 chars). Full content indexing remains local-only.
- Never becomes the source of truth for external vendor content.
