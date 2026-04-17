# D&D 5e System Module Export

This zip file contains a complete export of the "D&D 5e System Module" ruleset from Quest Bound.

## Contents

### TSV Files (Editable)
- `attributes.tsv` - All attributes defined in this ruleset
- `actions.tsv` - All actions defined in this ruleset
- `items.tsv` - All items defined in this ruleset
- `charts/` - Directory containing chart data as TSV files (named as `{title}_{id}.tsv`)

### Script Files (Editable)
- `scripts/` - Directory containing QBScript files organized by entity type
  - `scripts/global/` - Global utility scripts
  - `scripts/attributes/` - Scripts associated with attributes
  - `scripts/actions/` - Scripts associated with actions
  - `scripts/items/` - Scripts associated with items
- Script metadata is stored in `application data/metadata.json` under the `scripts` array
- Scripts can be edited externally and will be re-imported when the ruleset is imported

### Binary Files
- `assets/` - Directory containing all asset files organized by their directory structure
- `fonts/` - Directory containing font files (named as `{label}_{id}.ttf`)
- `documents/` - Directory containing all document PDF files

### Application Data (JSON)
- `application data/metadata.json` - Ruleset metadata, export information, and script metadata
- `application data/charts.json` - Chart metadata (links to TSV files in charts/)
- `application data/windows.json` - All windows defined in this ruleset
- `application data/components.json` - All components defined in this ruleset
- `application data/assets.json` - All assets metadata
- `application data/fonts.json` - All custom fonts
- `application data/documents.json` - All document metadata
- `application data/characters.json` - Test character data
- `application data/characterAttributes.json` - Test character attribute values
- `application data/inventories.json` - Test character inventory associations
- `application data/characterWindows.json` - Test character window positions
- `application data/pages.json` - Ruleset sheet page templates (page definitions with rulesetId)
- `application data/rulesetWindows.json` - Ruleset page window layout (pageId, windowId, position)
- `application data/characterPages.json` - Test character sheet pages (full page content + pageId template ref)
- `application data/inventoryItems.json` - Test character inventory items

## Import Instructions

To import this ruleset back into Quest Bound:

1. Use the Import feature in Quest Bound
2. Select the zip file to import the complete ruleset
3. Follow the import wizard to complete the process

## External Editing

You can edit the following files externally:
- TSV files (attributes, actions, items, charts)
- QBScript files (.qbs files in the scripts/ directory)

When you re-import the ruleset, your changes will be preserved.

## Version Information

- Ruleset Version: 0.1.10
- Exported: 2026-04-17T13:08:41.918Z
- Quest Bound Version: 2.0.0
- Scripts Exported: 373

For more information about Quest Bound, visit the application documentation.
