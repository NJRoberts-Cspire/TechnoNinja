/**
 * Tesshari — entry point.
 *
 * Registered in system.json via esmodules. Runs once per Foundry session.
 * The `init` hook must complete synchronously (or all `await`s resolve before
 * next hook); ready-dependent wiring goes in the `ready` hook.
 */

import * as models from "./module/data-models.mjs";
import { TesshariActor, TesshariItem, TesshariCombat } from "./module/documents.mjs";
import { StatusEngine, buildStatusEffectsConfig } from "./module/status-effects.mjs";
import { TesshariDamage } from "./module/damage-pipeline.mjs";
import { CardEngine } from "./module/card-engine.mjs";
import { TesshariCardSheet } from "./module/sheets/card-sheet.mjs";
import { TesshariCharacterSheet } from "./module/sheets/character-sheet.mjs";
import { TesshariMonsterSheet } from "./module/sheets/monster-sheet.mjs";
import { TesshariNpcSheet } from "./module/sheets/npc-sheet.mjs";

const SYSTEM_ID = "tesshari";

Hooks.once("init", () => {
  console.log(`${SYSTEM_ID} | init`);

  // ─── document classes ─────────────────────────────────────────────────
  CONFIG.Actor.documentClass  = TesshariActor;
  CONFIG.Item.documentClass   = TesshariItem;
  CONFIG.Combat.documentClass = TesshariCombat;

  // ─── data models ──────────────────────────────────────────────────────
  CONFIG.Actor.dataModels = {
    character: models.CharacterDataModel,
    monster:   models.MonsterDataModel,
    npc:       models.NpcDataModel,
  };
  CONFIG.Item.dataModels = {
    card:       models.CardDataModel,
    race:       models.RaceDataModel,
    class:      models.ClassDataModel,
    subclass:   models.SubclassDataModel,
    cybernetic: models.CyberneticDataModel,
    weapon:     models.WeaponDataModel,
    armor:      models.ArmorDataModel,
    consumable: models.ConsumableDataModel,
    status:     models.StatusDataModel,
  };

  // ─── token bar defaults ───────────────────────────────────────────────
  CONFIG.Actor.trackableAttributes = {
    character: { bar: ["hp", "ap"], value: ["level", "handSize"] },
    monster:   { bar: ["hp", "ap"], value: [] },
    npc:       { bar: [], value: [] },
  };

  // ─── initiative formula ───────────────────────────────────────────────
  // Deterministic EDGE desc with IRON / 100 tiebreak — no dice shown.
  CONFIG.Combat.initiative = {
    formula: "@stats.edge + (@stats.iron / 100)",
    decimals: 2,
  };

  // ─── status effects ───────────────────────────────────────────────────
  // Replace Foundry's default condition set with the 15 Tesshari keywords
  // plus Down/Dying. Token HUD will surface these icons.
  CONFIG.statusEffects = buildStatusEffectsConfig();
  CONFIG.specialStatusEffects = {
    DEFEATED: "down",
    INVISIBLE: "veil",
    BLIND: CONFIG.specialStatusEffects?.BLIND ?? "blind",
  };

  // ─── sheets ───────────────────────────────────────────────────────────
  // Register Tesshari sheets as defaults for their types. We don't unregister
  // the core sheets — they stay available as user choices for other types.
  foundry.documents.collections.Items.registerSheet("tesshari", TesshariCardSheet, {
    types: ["card"], makeDefault: true, label: "Tesshari Card Sheet",
  });
  foundry.documents.collections.Actors.registerSheet("tesshari", TesshariCharacterSheet, {
    types: ["character"], makeDefault: true, label: "Tesshari Character Sheet",
  });
  foundry.documents.collections.Actors.registerSheet("tesshari", TesshariMonsterSheet, {
    types: ["monster"], makeDefault: true, label: "Tesshari Monster Sheet",
  });
  foundry.documents.collections.Actors.registerSheet("tesshari", TesshariNpcSheet, {
    types: ["npc"], makeDefault: true, label: "Tesshari NPC Sheet",
  });

  // Handlebars helpers used by our templates
  Handlebars.registerHelper("eq",      (a, b) => a === b);
  Handlebars.registerHelper("gte",     (a, b) => Number(a) >= Number(b));
  Handlebars.registerHelper("checked", (v) => v ? "checked" : "");

  // ─── runtime namespace ────────────────────────────────────────────────
  game.tesshari = {
    id: SYSTEM_ID,
    status: StatusEngine,
    damage: TesshariDamage,
    cards: CardEngine,
  };
});

Hooks.once("ready", () => {
  console.log(`${SYSTEM_ID} | ready`);
});
