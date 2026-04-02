# Quest Bound Import Pack — Tesshari: Seventh Convergence

## Complete Ruleset (All 8 Races, All 25 Classes, Full Item Catalog)

Your current QB UI supports import buttons on three entities:

- Attributes
- Actions
- Items

Use these three files in this order:

1. `attributes_READY.tsv` — Import in **Attributes**
2. `actions_READY.tsv` — Import in **Actions**
3. `items_READY.tsv` — Import in **Items**

---

## What's In Each File

### attributes_READY.tsv (~250 rows)

- Combat core tracking (AP, turn state, card log)
- All 8 races: stat bonuses, passives, lore trackers, appearance flags
- All 25 classes: hand size, HP modifier, resource pools, subclass path lists, toggle states
- Monster AI attributes (role, tier, threat state, target lock)
- Status effect derived trackers (Guard value, Expose value, Stagger, Overheat, etc.)

### actions_READY.tsv (~280 rows)

- Core combat actions (basic attack, end turn)
- All Forged race creation actions + card abilities
- All Ironclad Samurai class abilities + 4 subclass paths
- All 7 remaining races: 2 signature cards each
- All 24 remaining classes: basic attack + core abilities + signature + capstone card for each
- Generic monster cards (minion through boss)
- Status effect utility cards

### items_READY.tsv (~115 rows)

- Forged augmentation modules (all 7)
- Ironclad starter gear (weapons, armor, oath marks, currency)
- Prior Ascended artifacts (6 unique items)
- Claimant relics (Korrath, Vaen, Hollow Author)
- Cybernetic enhancements (13 named augmentations)
- Wire Market technology (tools, devices, documents)
- Ashlands and corrupted items (9 items)
- Full weapon catalog (20+ weapons)
- Full armor catalog (10+ armors, shields)
- Consumables (8 items)
- Tools and equipment
- Resonant items (4 types)
- Currency denominations

---

## Additional Files (Add Manually or Import If QB Supports)

- `documents_import_safe.tsv` — 100+ document entries covering all source files
  - All 8 races × 3-4 docs each
  - All 25 classes × 2 docs each
  - World/history/lore (7 docs)
  - Campaign (act structure, GM secrets, random tables)
  - All NPCs (16 entries)
  - All locations (6 entries)
  - Claimant secrets (3 GM docs)
  - System reference docs (6 entries)

- `charts.tsv` — 35+ chart entries
  - System schema and reference charts (existing)
  - All 5 Reach encounter tables
  - Faction and NPC quick reference
  - Monster catalog
  - Status/keyword glossary
  - Campaign clocks

- `scripts.tsv` — QBScript automation (reference only; enter manually in Script Editor)

---

## Import Notes

- QB imports are additive. Existing entities with matching IDs are updated; new IDs are added.
- `list` type attributes require the `options` array to be present — `attributes_READY.tsv` includes these.
- If an import fails, check the first error line for the column name; compare against your QB export's exact header names.
- Scripts must be entered manually in the QB Script Editor; use `../scripts.tsv` as your reference.

---

## If Any Import Fails

Export a fresh blank ruleset from QB, unzip it, and run `validate_and_align_to_qb_schema.ps1` to align these files to your exact QB version headers. Share the first 3 error lines with the file name if you need help debugging.
