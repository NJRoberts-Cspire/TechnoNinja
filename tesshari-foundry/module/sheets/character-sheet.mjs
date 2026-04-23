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
      const copy = item.toObject();
      delete copy._id;
      await this.actor.createEmbeddedDocuments("Item", [copy]);
      ui.notifications?.info(`Added "${item.name}" to ${this.actor.name}.`);
    } catch (err) {
      console.error("tesshari | drop failed:", err);
      ui.notifications?.error(`Drop failed: ${err.message}`);
    }
  };

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
}
