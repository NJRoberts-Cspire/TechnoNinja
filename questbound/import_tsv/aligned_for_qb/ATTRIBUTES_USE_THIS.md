Use this file for Attributes import:

- attributes_with_options.tsv

Reason:
- Includes explicit `options` array column required by QB for `list` type attributes.
- Uses QB-valid attribute types (`string`, `number`, `boolean`, `list`).

If import still fails:
1. Confirm you are importing `attributes_with_options.tsv` (not `attributes.tsv` or `attributes_qb_strict.tsv`).
2. Re-open Attributes import dialog and retry.
3. Share the new first 3 error lines exactly.
