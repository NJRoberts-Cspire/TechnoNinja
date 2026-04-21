# Tesshari Character Builder

A standalone web app for creating and managing characters in Tesshari, a card-based TTRPG. Works in any browser, data saved locally. Reads the canonical TSV data in `../questbound/import_tsv/` and the class markdown docs in `../tesshari_v2/documents/`.

## Dev

```bash
npm install
npm run dev
```

The `dev` and `build` scripts auto-run `npm run data` to regenerate `src/data/generated.ts` from the source TSVs. Whenever you edit the TSVs, the next `npm run dev` picks them up.

## Structure

- `scripts/build-data.mjs` — TSV → TypeScript module generator
- `src/data/generated.ts` — generated; do not edit
- `src/data/types.ts` — `Character` shape, stat definitions
- `src/store/characters.ts` — localStorage-backed character store
- `src/components/` — CharacterList, CreationWizard, CharacterSheet, ClassReference

## Deploy (GitHub Pages)

Push to `main`. The workflow at `.github/workflows/deploy.yml` builds and publishes the `dist/` folder to Pages. Once enabled in repo Settings → Pages (Source: GitHub Actions), the app lives at `https://<user>.github.io/<repo>/tesshari-app/`.

For a custom base path, edit `vite.config.ts` `base`.

## Features (v0.1)

- [x] Character creation wizard (Species → Class → Subclass → Stats → Background → Review)
- [x] Live character sheet with editable stats/HP/AP/guard
- [x] Card roster filtered by Class + Subclass + Level with AP costs
- [x] Class/subclass reference viewer (all 25 class docs + Tesshari overview)
- [x] Long-rest button (HP + AP refresh)
- [x] Notes tab

## Roadmap

- [ ] Inventory tab (items from `items.tsv`)
- [ ] Dice roller with log
- [ ] Export / import character JSON
- [ ] Print-ready character card
- [ ] Supabase sync for multiplayer tables (optional)
