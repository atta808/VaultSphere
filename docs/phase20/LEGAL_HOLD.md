# Legal Holds

## Philosophy
Legal Holds enforce preservation of documents to prevent unauthorized disposal or deletion.

## Enforcement
- Handled through `LegalHoldService` and the centralized `GovernanceEngine`.
- Documents under an active legal hold return `false` from `governanceEngine.canDispose(documentId)`.
- Implemented using the `legal_holds` and `legal_hold_documents` tables.
