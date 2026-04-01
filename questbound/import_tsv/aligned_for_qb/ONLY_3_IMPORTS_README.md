# Quest Bound (Your UI): Only 3 Import Buttons

Your current UI supports import on:

- Attributes
- Actions
- Items

Use only these files:

- `attributes_READY.tsv`
- `actions_READY.tsv`
- `items_READY.tsv`

## Exact Import Order

1. Import `attributes_READY.tsv` in Attributes.
2. Import `actions_READY.tsv` in Actions.
3. Import `items_READY.tsv` in Items.

## Why this works

- `attributes_READY.tsv` includes `options` arrays required for list-type attributes.
- `actions_READY.tsv` has safe defaults for nullable card economy fields.
- `items_READY.tsv` is normalized for clean TSV parsing.

## About the other entities

If your UI does not provide import for Charts/Documents/Archetypes/Statuses/Keywords, do not try importing them right now.
Use them as reference and add manually later if needed.

## If any import still fails

Send the first 3 error lines and the file name you imported. The fix can be applied directly to that file.
