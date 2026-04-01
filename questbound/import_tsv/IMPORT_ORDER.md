# Quest Bound Import Order

Use this order for the TSV pack in this folder:

1. `attributes.tsv`
2. `charts.tsv`
3. `items.tsv`
4. `actions.tsv`
5. `archetypes.tsv`
6. `documents.tsv`
7. `statuses.tsv` (if your QB environment supports custom status entity imports)
8. `keywords.tsv` (if supported as a standalone entity; otherwise keep as chart or docs)
9. `scripts.tsv` (usually reference-only; in many QB builds scripts are created in script editor)

## Important

- QB column schemas vary by export version.
- If import rejects a file, export a fresh ruleset and align this file's headers to QB's exact header names.
- IDs in this pack are stable and cross-referenced. Keep `id` values unchanged.
