/**
 * Tesshari Character Sheet
 * ------------------------
 * ActorSheetV2 for the `character` actor type. First-pass layout:
 *
 *   Header  — portrait, name, species/class line, HP/AP/Hand resources
 *   Left    — six stats grid, core fields (level/class/subclass), status tray
 *   Right   — Hand (cards as clickable tiles), Inventory
 *   Bottom  — Background, Biography/Notes (collapsed by default)
 *
 * Clicking a card tile → CardEngine.play via actor.playCard.
 * Drag an Item from the sidebar onto the sheet → embedded copy.
 */

const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ActorSheetV2 } = foundry.applications.sheets;

/** Non-card, non-marker items that show in the inventory panel. */
const INVENTORY_TYPES = new Set(["weapon", "armor", "cybernetic", "consumable"]);

/** Identity items replace the actor's species/class/subclass. */
const IDENTITY_TYPES = new Set(["race", "class", "subclass"]);

/** HP base values by class HP tier. Matches system/00_core_rules.md. */
const HP_TIER_BASE = {
  heavy: 20, martial: 14, balanced: 10, technical: 6, social: 6, unique: 0,
};

export class TesshariCharacterSheet extends HandlebarsApplicationMixin(ActorSheetV2) {

  static DEFAULT_OPTIONS = {
    classes: ["tesshari", "sheet", "actor", "character"],
    position: { width: 820, height: 780 },
    window: { resizable: true, contentClasses: ["standard-form"] },
    form: {
      submitOnChange: true,
      closeOnSubmit: false,
      handler: TesshariCharacterSheet.#onSubmit,
    },
    dragDrop: [{ dragSelector: "[data-drag]", dropSelector: null }],
    actions: {
      playCard:      TesshariCharacterSheet.#onPlayCard,
      basicAttack:   TesshariCharacterSheet.#onBasicAttack,
      endTurn:       TesshariCharacterSheet.#onEndTurn,
      editItem:      TesshariCharacterSheet.#onEditItem,
      deleteItem:    TesshariCharacterSheet.#onDeleteItem,
      resetAP:       TesshariCharacterSheet.#onResetAP,
      removeEffect:  TesshariCharacterSheet.#onRemoveEffect,
      clearIdentity: TesshariCharacterSheet.#onClearIdentity,
      openItem:      TesshariCharacterSheet.#onOpenItem,
      pickIdentity:  TesshariCharacterSheet.#onPickIdentity,
    },
  };

  static PARTS = {
    form: { template: "systems/tesshari/templates/actor/character-sheet.hbs" },
  };

  /** @override */
  async _prepareContext(options) {
    try {
      const context = await super._prepareContext(options);
      const a = this.actor;
      const s = a?.system ?? {};

      context.actor = a;
      context.system = s;

      // Six stats — order matches rules presentation
      const stats = s.stats ?? {};
      context.stats = [
        { key: "iron",      label: "IRON",      path: "system.stats.iron",      value: stats.iron      ?? 1 },
        { key: "edge",      label: "EDGE",      path: "system.stats.edge",      value: stats.edge      ?? 1 },
        { key: "frame",     label: "FRAME",     path: "system.stats.frame",     value: stats.frame     ?? 1 },
        { key: "signal",    label: "SIGNAL",    path: "system.stats.signal",    value: stats.signal    ?? 1 },
        { key: "resonance", label: "RESONANCE", path: "system.stats.resonance", value: stats.resonance ?? 1 },
        { key: "veil",      label: "VEIL",      path: "system.stats.veil",      value: stats.veil      ?? 1 },
      ];

      // Hand — cards owned by this actor, with per-card play state.
      // Defensive: some old / partially-initialized cards may have missing fields.
      const playedThisTurn = new Set(s.turn?.cardsPlayedThisTurn ?? []);
      const usedThisCombat = s.turn?.usedThisCombat ?? [];
      context.cards = (a?.items?.contents ?? [])
        .filter(i => i.type === "card")
        .map(c => ({
          id:   c.id,
          name: c.name ?? "(card)",
          img:  c.img,
          system: {
            tier:        c.system?.tier        ?? 0,
            apCost:      c.system?.apCost      ?? 0,
            baseDamage:  c.system?.baseDamage  ?? 0,
            primaryStat: c.system?.primaryStat ?? "",
            pierce:      c.system?.pierce      ?? 0,
            category:    c.system?.category    ?? "",
            keywords:    Array.isArray(c.system?.keywords) ? c.system.keywords : [],
          },
          playedThisTurn: playedThisTurn.has(c.id),
          usedCount: usedThisCombat.filter(id => id === c.id).length,
        }))
        .sort((x, y) => (x.system.tier - y.system.tier) || x.name.localeCompare(y.name));

      // Inventory — weapons, armor, cybernetics, consumables
      context.inventory = (a?.items?.contents ?? [])
        .filter(i => INVENTORY_TYPES.has(i.type))
        .map(i => ({ id: i.id, name: i.name ?? "(item)", img: i.img, type: i.type, system: i.system ?? {} }))
        .sort((x, y) => x.type.localeCompare(y.type) || x.name.localeCompare(y.name));

      // Active effects → status chips
      context.statusEffects = (a?.effects?.contents ?? []).map(fx => ({
        id: fx.id,
        name: fx.name,
        img: fx.img,
        stacks: fx.flags?.tesshari?.stacks ?? null,
        type: fx.flags?.tesshari?.type ?? "state",
        summary: fx.flags?.tesshari?.summary ?? "",
      }));

      // Identity items (singular each) — for the identity panels
      const itemList = a?.items?.contents ?? [];
      context.raceItem     = itemList.find(i => i.type === "race")     ?? null;
      context.classItem    = itemList.find(i => i.type === "class")    ?? null;
      context.subclassItem = itemList.find(i => i.type === "subclass") ?? null;

      // Subclass features as [{level, name, html}, ...] sorted by level
      context.subclassFeatures = context.subclassItem
        ? Object.entries(context.subclassItem.system?.features ?? {})
            .map(([level, feat]) => ({ level: Number(level), name: feat?.name ?? "", html: feat?.html ?? "" }))
            .sort((a, b) => a.level - b.level)
        : [];

      // Compendium-backed pickers for empty identity slots
      context.availableRaces      = !context.raceItem     ? await this.#loadPickerOptions("tesshari.races") : [];
      context.availableClasses    = !context.classItem    ? await this.#loadPickerOptions("tesshari.classes") : [];
      context.availableSubclasses = [];
      if (!context.subclassItem) {
        const currentClassName = context.classItem?.name ?? s.className ?? "";
        if (currentClassName) {
          const all = await this.#loadPickerOptions("tesshari.subclasses", ["system.className"]);
          context.availableSubclasses = all
            .filter(opt => opt.system?.className === currentClassName)
            .map(opt => ({ uuid: opt.uuid, id: opt.id, name: opt.name }))
            .sort((a, b) => a.name.localeCompare(b.name));
        }
      }
      context.currentClassName = context.classItem?.name ?? s.className ?? "";

      // Derived UI bits
      context.handCount = context.cards.length;
      context.handOver  = context.cards.length > (s.handSize ?? 0);

      return context;
    } catch (err) {
      console.error("tesshari | character sheet _prepareContext failed:", err);
      ui.notifications?.error(`Character sheet render error: ${err.message}. See F12 console.`);
      throw err;
    }
  }

  // Arrow class fields → lexically bound `this`, no .bind() needed.
  #handleDragOver = (event) => {
    // Only preventDefault for actual drags (has dataTransfer items) to avoid
    // interfering with other pointer-style events Foundry might fire.
    if (event.dataTransfer?.types?.length) event.preventDefault();
  };

  #handleDrop = async (event) => {
    event.preventDefault();
    const dataStr = event.dataTransfer?.getData("text/plain");
    if (!dataStr) return;
    let data;
    try { data = JSON.parse(dataStr); } catch { return; }
    if (data.type !== "Item") return;

    try {
      const item = await Item.implementation.fromDropData(data);
      if (!item) return;
      if (item.parent === this.actor) return;

      // race / class / subclass drops replace any existing one of that type
      // and sync the actor's system fields (species, className, etc.)
      if (IDENTITY_TYPES.has(item.type)) {
        // Subclass drop: warn if the path doesn't belong to the current class
        if (item.type === "subclass") {
          const currentClass = this.actor.items.find(i => i.type === "class")?.name
            ?? this.actor.system?.className;
          if (currentClass && item.system?.className && item.system.className !== currentClass) {
            const ok = await foundry.applications.api.DialogV2.confirm({
              window: { title: "Subclass mismatch" },
              content: `<p><strong>${item.name}</strong> belongs to <em>${item.system.className}</em>, but ${this.actor.name} is <em>${currentClass}</em>. Apply anyway?</p>`,
            });
            if (!ok) return;
          }
        }
        return this.#applyIdentityItem(item);
      }

      // Default: embed a copy as an owned item
      const copy = item.toObject();
      delete copy._id;
      await this.actor.createEmbeddedDocuments("Item", [copy]);
      ui.notifications?.info(`Added "${item.name}" to ${this.actor.name}.`);
    } catch (err) {
      console.error("tesshari | drop failed:", err);
      ui.notifications?.error(`Drop failed: ${err.message}`);
    }
  };

  /**
   * Read lightweight entries from a compendium pack by id (e.g., "tesshari.races").
   * Returns [{uuid, id, name, img, system?}, …] — index-only by default, with
   * any requested fields materialized into the `system` object.
   */
  async #loadPickerOptions(packId, indexFields = []) {
    const pack = game.packs?.get(packId);
    if (!pack) return [];
    const index = await pack.getIndex({ fields: indexFields });
    return index.map(entry => {
      const opt = { uuid: `Compendium.${packId}.Item.${entry._id}`, id: entry._id, name: entry.name, img: entry.img };
      if (indexFields.length) {
        opt.system = {};
        for (const f of indexFields) {
          // `entry` carries the fields at their full path under system; rebuild nested access
          const parts = f.split(".");
          let src = entry;
          for (const p of parts) src = src?.[p];
          let dst = opt;
          for (let i = 0; i < parts.length - 1; i++) {
            dst[parts[i]] = dst[parts[i]] ?? {};
            dst = dst[parts[i]];
          }
          dst[parts[parts.length - 1]] = src;
        }
      }
      return opt;
    });
  }

  async #applyIdentityItem(item) {
    const actor = this.actor;

    // Remove any existing items of the same identity type
    const existing = actor.items.filter(i => i.type === item.type);
    if (existing.length > 0) {
      await actor.deleteEmbeddedDocuments("Item", existing.map(i => i.id));
    }

    // Embed the new identity item (without its world _id)
    const copy = item.toObject();
    delete copy._id;
    await actor.createEmbeddedDocuments("Item", [copy]);

    const updates = {};
    if (item.type === "race") {
      updates["system.species"] = item.name;
      // Recompute hand size: class base + race hand mod
      const classItem = actor.items.find(i => i.type === "class");
      const classBase = classItem?.system?.handBase ?? actor.system?.handSize ?? 6;
      const handMod = item.system?.handMod ?? 0;
      updates["system.handSize"] = Math.min(12, Math.max(1, classBase + handMod));
    } else if (item.type === "class") {
      updates["system.className"] = item.name;
      const handBase = item.system?.handBase ?? 6;
      const raceItem = actor.items.find(i => i.type === "race");
      const handMod = raceItem?.system?.handMod ?? 0;
      updates["system.handSize"] = Math.min(12, Math.max(1, handBase + handMod));

      // Recompute HP max at level 1: (FRAME × 8) + class tier base
      const tier = String(item.system?.hpTier ?? "balanced").toLowerCase();
      const base = HP_TIER_BASE[tier] ?? 10;
      const frame = actor.system?.stats?.frame ?? 1;
      const level = actor.system?.level ?? 1;
      const maxHP = (frame * 8) + base + (frame * (level - 1));  // +FRAME per level after L1
      updates["system.hp.max"] = maxHP;
      updates["system.hp.value"] = maxHP;
    } else if (item.type === "subclass") {
      updates["system.subclass"] = item.name;
    }

    if (Object.keys(updates).length) await actor.update(updates);
    ui.notifications?.info(`${this.actor.name}: ${item.type} set to ${item.name}.`);
  }

  /** @override — wire drag-drop each render; removeEventListener first to avoid stacking. */
  _onRender(context, options) {
    super._onRender?.(context, options);
    const root = this.element;
    if (!root) return;
    root.removeEventListener("dragover", this.#handleDragOver);
    root.removeEventListener("drop",     this.#handleDrop);
    root.addEventListener("dragover",    this.#handleDragOver);
    root.addEventListener("drop",        this.#handleDrop);
  }

  /** Form submit handler (ApplicationV2 form API). */
  static async #onSubmit(event, form, formData) {
    const submit = foundry.utils.expandObject(formData.object ?? formData);
    await this.document.update(submit);
  }

  /* ──────────────────────────────────────────────────────────────────
   * Action handlers — `this` is the Application instance.
   * ────────────────────────────────────────────────────────────────── */

  static async #onPlayCard(event, target) {
    const itemId = target.dataset.itemId;
    if (!itemId) return;
    await this.actor.playCard(itemId);
  }

  static async #onBasicAttack(event, target) {
    const a = this.actor;
    if (a.system.turn?.basicAttackUsed) {
      return ui.notifications?.warn("Basic Attack already used this turn.");
    }
    // Target a defender
    const defenders = Array.from(game.user.targets).map(t => t.actor).filter(Boolean);
    if (defenders.length === 0) {
      return ui.notifications?.warn("Basic Attack: target a token first (hover + T).");
    }
    const stat = a.system.stats?.iron ?? 0;
    for (const defender of defenders) {
      await game.tesshari.damage.resolve(defender, {
        baseDamage: 0,
        statValue: stat,
        attacker: a,
        label: "Basic Attack",
      });
    }
    await a.update({ "system.turn.basicAttackUsed": true });
  }

  static async #onEndTurn(event, target) {
    const combat = game.combat;
    if (!combat) return ui.notifications?.warn("No active combat.");
    const combatant = combat.combatants.find(c => c.actor?.id === this.actor.id);
    if (!combatant) return ui.notifications?.warn("This actor is not in the current combat.");
    if (combat.combatant?.id !== combatant.id) {
      return ui.notifications?.warn("It is not this actor's turn.");
    }
    await combat.nextTurn();
  }

  static async #onEditItem(event, target) {
    const itemId = target.dataset.itemId;
    const item = this.actor.items.get(itemId);
    item?.sheet?.render(true);
  }

  static async #onDeleteItem(event, target) {
    const itemId = target.dataset.itemId;
    const item = this.actor.items.get(itemId);
    if (!item) return;
    const ok = await foundry.applications.api.DialogV2.confirm({
      window: { title: "Remove item" },
      content: `<p>Remove <strong>${item.name}</strong> from ${this.actor.name}?</p>`,
    });
    if (ok) await item.delete();
  }

  static async #onResetAP(event, target) {
    const a = this.actor;
    await a.update({ "system.ap.value": a.system.ap?.max ?? 3 });
  }

  static async #onRemoveEffect(event, target) {
    const effectId = target.dataset.effectId;
    const effect = this.actor.effects.get(effectId);
    if (effect) await effect.delete();
  }

  /** Remove a race/class/subclass item and clear the corresponding actor field. */
  static async #onClearIdentity(event, target) {
    const identityType = target.dataset.identityType;
    if (!IDENTITY_TYPES.has(identityType)) return;
    const actor = this.actor;
    const items = actor.items.filter(i => i.type === identityType);
    if (items.length) {
      await actor.deleteEmbeddedDocuments("Item", items.map(i => i.id));
    }
    const field =
      identityType === "race"     ? "species"   :
      identityType === "class"    ? "className" :
      identityType === "subclass" ? "subclass"  : null;
    if (field) await actor.update({ [`system.${field}`]: "" });
  }

  /** Open the sheet for an owned item (race/class/subclass tile click). */
  static async #onOpenItem(event, target) {
    const itemId = target.dataset.itemId;
    const item = this.actor.items.get(itemId);
    item?.sheet?.render(true);
  }

  /** Click a picker tile → apply that race/class/subclass. */
  static async #onPickIdentity(event, target) {
    const uuid = target.dataset.uuid;
    if (!uuid) return;
    const doc = await fromUuid(uuid);
    if (!doc) return ui.notifications?.error("Item not found in compendium.");
    if (!IDENTITY_TYPES.has(doc.type)) {
      return ui.notifications?.error(`Cannot pick ${doc.type} as an identity.`);
    }
    await this.#applyIdentityItem(doc);
  }
}
