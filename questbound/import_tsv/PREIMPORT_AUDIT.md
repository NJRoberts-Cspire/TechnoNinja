# Pre-Import Audit Report

Date: 2026-03-31
Scope: `questbound/import_tsv/*.tsv`

## Passed Checks

- TSV structure check: all rows match header column counts.
- Logical check: no duplicate IDs detected in ID-bearing files.
- Script reference check: all `on_action_resolve:<action_id>` references in `scripts.tsv` point to existing action IDs.
- Rule check: all basic-attack cards are configured as `ap_cost=0` and `play_limit_per_turn=1`.
- Rule check: card rows exist and are properly flagged with `is_card=true`.

## Remaining Compatibility Risk

Quest Bound import headers can differ by export version. This pack is mechanically coherent, but final import compatibility still depends on matching exact header names from your local QB export.

## Mitigation Included

Use `validate_and_align_to_qb_schema.ps1` in this folder to compare these TSV files against a real QB export and output a schema-aligned pack.

## Recommended Next Step

1. Export a blank or test ruleset from Quest Bound.
2. Unzip the export to a folder.
3. Run the script to create aligned files before import.
