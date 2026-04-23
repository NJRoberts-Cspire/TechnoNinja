# Foundry V12 API — Followup Research

Answers to the open questions from [00_kb_master_notes.md](00_kb_master_notes.md §21).
Sources: https://foundryvtt.com/api/v12/ and https://github.com/foundryvtt/foundryvtt-cli (fetched 2026-04-23).

---

## 1. Combat turn/round hooks

### Hook events (fire on all clients, after DB update)

| Hook | Signature | Notes |
|---|---|---|
| `combatStart` | `(combat, { round, turn })` | Encounter begins |
| `combatTurn` | `(combat, update, options)` | Turn progression (called during round, not on round boundary) |
| `combatRound` | `(combat, update, options)` | Round increment |
| `combatTurnChange` | `(combat, prior, current)` | Fires on turn order change; `prior` and `current` are `CombatHistoryData` |
| `updateCombat` | `(combat, changed, options, userId)` | Generic document-update hook; inspect `changed` keys (`.turn`, `.round`, `.active`) |

`combatTurnChange` is the cleanest entry point for "someone's turn just started/ended." `prior.tokenId` vs `current.tokenId` tells you who changed.

### Combat class hooks (override by extending)

The Combat document exposes protected methods that **only run for one designated GM** — perfect for state mutations that should happen exactly once:

- `_onStartTurn(combatant)` — fires when a turn begins
- `_onEndTurn(combatant)` — fires when a turn concludes
- `_onStartRound()` — fires at round start
- `_onEndRound()` — fires at round end

Override by subclassing and registering in `CONFIG.Combat.documentClass`:

```javascript
// module/documents.mjs
export class TesshariCombat extends Combat {
  async _onStartTurn(combatant) {
    await super._onStartTurn(combatant);
    const actor = combatant.actor;
    if (!actor) return;
    // AP reset with Overheat penalty
    const overheat = actor.system.statuses?.overheat ?? 0;
    const penalty = overheat >= 6 ? 2 : overheat >= 3 ? 1 : 0;
    const newAP = Math.max(0, actor.system.ap.max - penalty);
    await actor.update({
      "system.ap.value": newAP,
      "system.turn.basicAttackUsed": false,
      "system.turn.cardsPlayedThisTurn": []
    });
    // Regen tick
    await TesshariStatus.applyRegen(actor);
  }

  async _onEndTurn(combatant) {
    await super._onEndTurn(combatant);
    const actor = combatant.actor;
    if (!actor) return;
    // Bleed first, then Burn (rules order), then decrement durations
    await TesshariStatus.tickBleed(actor);
    await TesshariStatus.tickBurn(actor);
    await TesshariStatus.tickDurations(actor);
  }

  async _onEndRound() {
    await super._onEndRound();
    // Reset reactions for every combatant
    for (const c of this.combatants) {
      if (c.actor) await c.actor.update({ "system.turn.reactionUsed": false });
    }
  }
}
```

```javascript
// tesshari.mjs
Hooks.once("init", () => {
  CONFIG.Combat.documentClass = TesshariCombat;
});
```

### Initiative formula

Default formula string set via:

```javascript
CONFIG.Combat.initiative = {
  formula: "@system.stats.edge + (@system.stats.iron / 100)",
  decimals: 2
};
```

The `/100` term makes IRON a visible-but-never-consequential tiebreak — equivalent to "EDGE desc, IRON tiebreak" without needing custom sort code. Players can still call `rollInitiative()` — it evaluates the formula and sets the initiative number; no d20 unless you add one.

---

## 2. ApplicationV2 + HandlebarsApplicationMixin

### Class hierarchy

```
ApplicationV2
  └ DocumentSheetV2
      ├ ActorSheetV2
      └ ItemSheetV2
```

All three are in the `foundry.applications.*` namespace and use the newer declarative action-handler / PARTS pattern.

### Minimal character sheet

```javascript
// module/sheets/character-sheet.mjs
const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ActorSheetV2 } = foundry.applications.sheets;

export class TesshariCharacterSheet extends HandlebarsApplicationMixin(ActorSheetV2) {

  static DEFAULT_OPTIONS = {
    classes: ["tesshari", "character"],
    position: { width: 720, height: 680 },
    window: { resizable: true, contentClasses: ["standard-form"] },
    form: { submitOnChange: true, closeOnSubmit: false },
    actions: {
      playCard:     TesshariCharacterSheet.#onPlayCard,
      basicAttack:  TesshariCharacterSheet.#onBasicAttack,
      endTurn:      TesshariCharacterSheet.#onEndTurn,
      toggleStatus: TesshariCharacterSheet.#onToggleStatus
    }
  };

  static PARTS = {
    header:    { template: "systems/tesshari/templates/actor/character-header.hbs" },
    stats:     { template: "systems/tesshari/templates/actor/character-stats.hbs" },
    hand:      { template: "systems/tesshari/templates/actor/character-hand.hbs", scrollable: [""] },
    inventory: { template: "systems/tesshari/templates/actor/character-inventory.hbs" },
    biography: { template: "systems/tesshari/templates/actor/character-biography.hbs" }
  };

  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    context.actor = this.actor;
    context.system = this.actor.system;
    context.cards = this.actor.items.filter(i => i.type === "card");
    context.gear  = this.actor.items.filter(i => ["weapon","armor","cybernetic","consumable"].includes(i.type));
    context.statuses = this.actor.effects.contents;
    return context;
  }

  static async #onPlayCard(event, target) {
    const cardId = target.closest("[data-item-id]")?.dataset.itemId;
    const card = this.actor.items.get(cardId);
    if (card) await game.tesshari.cardEngine.play(this.actor, card);
  }

  static async #onBasicAttack(event, target) { /* ... */ }
  static async #onEndTurn(event, target) { /* ... */ }
  static async #onToggleStatus(event, target) { /* ... */ }
}
```

### Template (hand.hbs) — wiring data-action

```handlebars
<section class="tesshari-hand">
  {{#each cards as |card|}}
    <button type="button"
            class="card-tile tier-{{card.system.tier}}"
            data-item-id="{{card.id}}"
            data-action="playCard"
            {{#if (cardDisabled card ../system)}}disabled{{/if}}>
      <div class="card-name">{{card.name}}</div>
      <div class="card-ap">{{card.system.apCost}} AP</div>
      <div class="card-body">{{{card.system.description}}}</div>
    </button>
  {{/each}}
</section>
```

### Registering sheets

```javascript
// tesshari.mjs
Hooks.once("init", () => {
  foundry.documents.collections.Actors.unregisterSheet("core", foundry.appv1.sheets.ActorSheet);
  foundry.documents.collections.Actors.registerSheet("tesshari", TesshariCharacterSheet, {
    types: ["character"], makeDefault: true, label: "Tesshari Character Sheet"
  });
});
```

### Key lifecycle hooks on ApplicationV2

- `_preFirstRender()` / `_onFirstRender()`
- `_preRender()` / `_onRender()` — use `_onRender()` to attach non-action listeners (tooltips, complex UI)
- `_preClose()` / `_onClose()`

### Form submission flow

1. User changes an input → `_onChangeForm(formConfig, event)` fires
2. With `form.submitOnChange: true`, `_onSubmitForm()` fires
3. `_prepareSubmitData(event, form, formData)` extracts + cleans data
4. `_processSubmitData(event, submitData)` writes via `this.document.update()`

Override `_prepareSubmitData` to handle custom transforms (e.g., normalize pipe-delimited fields).

---

## 3. foundryvtt-cli — pack/unpack

### Install

```bash
npm install -g @foundryvtt/foundryvtt-cli
```

### First-time setup

```bash
fvtt configure                      # sets data-path
fvtt package workon tesshari        # sets current package context
fvtt package workon tesshari --type System   # explicit type
```

### Unpack a LevelDB pack → JSON/YAML sources

```bash
fvtt package unpack cards-ironclad-samurai
fvtt package unpack cards-ironclad-samurai --yaml    # YAML preferred (diff-friendly)
fvtt package unpack -n items/tesshari                # nested pack name
```

Defaults:
- Input: `{package}/packs/<name>/` (LevelDB directory)
- Output: `{package}/packs-src/<name>/` (one file per doc)

Override with `--outputDirectory`.

### Pack JSON/YAML sources → LevelDB

```bash
fvtt package pack cards-ironclad-samurai
fvtt package pack cards-ironclad-samurai --yaml
```

Defaults read from the same `packs-src/<name>/` directory and write to `packs/<name>/`.

### Tesshari workflow

1. Keep canonical card/item data as YAML in `tesshari/packs-src/<pack-name>/*.yaml`.
2. Generate these YAML files once from our existing `tesshari-app/src/data/generated.ts` via a Node script.
3. `npm run packs` script runs `fvtt package pack <name> --yaml` for each pack.
4. Ship the compiled `packs/` directory in the distribution zip.
5. When iterating card balance, edit YAML → re-pack → reload world.

---

## 4. ActiveEffect — CUSTOM mode + duration

### `applyActiveEffect` hook signature

```javascript
Hooks.on("applyActiveEffect", (actor, change, current, delta, changes) => {
  // actor: the Actor receiving the effect
  // change: EffectChangeData { key, mode, value, priority }
  // current: the current value of actor.system.<key> before this change
  // delta: the parsed change.value (string, number, or JSON-parsed object)
  // changes: the accumulating changes object — MUTATE THIS

  // Runs ONLY when change.mode === CONST.ACTIVE_EFFECT_MODES.CUSTOM (0)
  // Handler signature returns void

  if (change.key === "system.damageMods.pierce") {
    changes[change.key] = (current ?? 0) + delta;
  }
});
```

This is the extensibility point for Pierce / Echo / Overclock as custom change modes.

### Change mode constants

```javascript
CONST.ACTIVE_EFFECT_MODES = {
  CUSTOM:    0,
  MULTIPLY:  1,
  ADD:       2,
  DOWNGRADE: 3,
  UPGRADE:   4,
  OVERRIDE:  5
};
```

### Duration fields

An effect's `duration` object carries:

```typescript
{
  startTime: number | null,   // world time in seconds
  rounds:    number | null,   // remaining combat rounds
  turns:     number | null,   // remaining combat turns
  startRound: number | null,  // combat round when applied
  startTurn:  number | null   // combat turn when applied
}
```

Foundry automatically ticks `rounds`/`turns` through the Combat tracker. When duration reaches 0 the effect does NOT auto-delete — systems handle expiry. **Tesshari** should delete expired effects in `TesshariCombat._onEndTurn()` / `_onEndRound()`.

### Tesshari status mappings

| Tesshari rule | Duration shape |
|---|---|
| "1 round" (Fortify, Stagger, Root, Silence, Taunt) | `{ rounds: 1 }` |
| "until consumed" (Guard, Veil) | `{}` — no duration, we delete when consumed |
| "until depleted" (Shield) | `{}` — delete when stack count → 0 |
| "persists" (Bleed, Burn, Expose, Vulnerable, Overheat, Mark) | `{}` — delete on Cleanse/Dispel |
| "N turns" (Regen) | `{ turns: N }` |

### Stacking

Tesshari statuses like Guard 5 + Guard 8 = Guard 13 combine. Store stacks in `effect.flags.tesshari.stacks`. On applying another Guard, find the existing effect and update its flag rather than creating a second effect.

### `fromStatusEffect()`

To programmatically apply a registered status:

```javascript
const effectData = await ActiveEffect.fromStatusEffect("guard");
await actor.createEmbeddedDocuments("ActiveEffect", [effectData]);
```

`"guard"` is the `id` from `CONFIG.statusEffects`.

---

## 5. Reference systems (V12-verified)

| System | Repo | Why reference |
|---|---|---|
| **D&D 5e** (official) | https://github.com/foundryvtt/dnd5e | Gold-standard DataModel + ApplicationV2 patterns; huge but well-organized |
| **Simple Worldbuilding** (official) | https://github.com/foundryvtt/worldbuilding | Minimal, easy to read end-to-end; but latest release is V11-era, check main branch |
| **Boilerplate** (asacolips) | https://github.com/asacolips-projects/boilerplate | Starter template; supports both template.json and DataModel via CLI generator |
| **Shadowdark RPG** | search GitHub | Small, modern system; good V12 reference |
| **PF2e** | https://github.com/foundryvtt/pf2e | Very complex but actively maintained; good for ActiveEffect patterns |

**Pick:** Clone **D&D 5e** and **Simple Worldbuilding** locally for code search when we hit a design problem. D&D 5e at `release-5.3.2` (2026-04-22) is the most recent reference anchor.

---

## Remaining uncertainties

1. **Namespace drift in V12**: some classes moved from `client.*` to `foundry.*` sub-namespaces. The KB index still shows `client.Actor`, but in practice V12 exposes `foundry.documents.Actor` as well. Accept both during `init` hook: `CONFIG.Actor.documentClass` is the canonical registration point regardless of where the class lives.
2. **ActorSheet vs ActorSheetV2 registration**: The API shows `foundry.documents.collections.Actors.registerSheet()` as the V12 way. V11-style `Actors.registerSheet("core", sheet, ...)` still works but is being deprecated.
3. **Game-state globals**: I'll stash Tesshari runtime helpers on `game.tesshari.*` during the `ready` hook (standard pattern) so macros and other modules can reach our damage engine, card engine, etc.

All resolved enough to start scaffolding the system.
