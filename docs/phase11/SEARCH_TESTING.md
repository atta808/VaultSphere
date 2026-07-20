# Search Verification & Testing

Since this module operates heavily on background processes and SQLite features, manual and structural testing criteria should be verified.

### Verification Scenarios
- **Scenario A (Exact Filename Match)**: Creating a file named `Employee_Contract_2023.pdf` should instantly populate in search when `Contract` is typed.
- **Scenario B (Text Matching from OCR)**: Searching `Apple` on a document titled `Image1.png` but containing the word `Apple` via its synced OCR index should return `Image1.png`.
- **Scenario C (History Sync)**: Clicking a history chip should automatically execute a search. Closing and re-opening the app should persist history up to the hardcoded limit.
- **Scenario D (Smart Collections Integrity)**: Favoriting an item via the `DocumentDetailsScreen` should immediately populate the item in the "Favorites" section under Smart Collections.
- **Scenario E (Tag Association)**: Adding the tag `Urgent` to a document, then searching `Urgent`, should retrieve it. Removing the tag and searching again should result in zero findings.

### Regression Checks
- Validate `documents` deletions cascades appropriately to `search_index_fts`.
- Validate migration 3 `003_search_history_schema.js` properly mounts on fresh database loads without failure.
