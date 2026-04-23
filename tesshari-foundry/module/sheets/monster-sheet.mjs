/**
 * Tesshari Monster Sheet
 * ----------------------
 * ActorSheetV2 for the `monster` actor type. Leaner than the character sheet:
 * no level/class/subclass; includes role, tier, threat state, and AI notes.
 * Monsters use the same card system as PCs — they carry owned card items and
 * play them via CardEngine / Basic Attack.
 */

const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ActorSheetV2 } = foundry.applications.sheets;

const ROLES = ["skirmisher", "brute", "controller", "support", "boss"];
const TIERS = ["minion", "standard", "elite", "boss"];
const THREAT = ["neutral", "pressured", "advantaged", "desperate"];

export class TesshariMonsterSheet extends HandlebarsApplicationMixin(ActorSheetV2) {

  static DEFAULT_OPTIONS = {
    classes: ["tesshari", "sheet", "actor", "monster"],
    position: { width: 780, height: 720 },
    window: { resizable: true, contentClasses: ["standard-form"] },
    form: {
      submitOnChange: true,
      closeOnSubmit: false,
      handler: TesshariMonsterSheet.#onSubmit,
    },
    dragDrop: [{ dragSelector: "[data-drag]", dropSelector: null }],
    actions: {
      playCard:     TesshariMonsterSheet.#onPlayCard,
      basicAttack:  TesshariMonsterSheet.#onBasicAttack,
      endTurn:      TesshariMonsterSheet.#onEndTurn,
      editItem:     TesshariMonsterSheet.#onEditItem,
      deleteItem:   TesshariMonsterSheet.#onDeleteItem,
      resetAP:      TesshariMonsterSheet.#onResetAP,
      removeEffect: TesshariMonsterSheet.#onRemoveEffect,
    },
  };

  static PARTS = {
    form: { template: "systems/tesshari/templates/actor/monster-sheet.hbs" },
  };

  #handleDragOver = (event) => {
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
      console.error("tesshari | monster drop failed:", err);
      ui.notifications?.error(`Drop failed: ${err.message}`);
    }
  };

  _onRender(context, options) {
    super._onRender?.(context, options);
    const root = this.element;
    if (!root) return;
    root.removeEventListener("dragover", this.#handleDragOver);
    root.removeEventListener("drop",     this.#handleDrop);
    root.addEventListener("dragover",    this.#handleDragOver);
    root.addEventListener("drop",        this.#handleDrop);
  }

  async _prepareContext(options) {
    try {
      const context = await super._prepareContext(options);
      const a = this.actor;
      const s = a?.system ?? {};
      context.actor = a;
      context.system = s;

      const stats = s.stats ?? {};
      context.stats = [
        { key: "iron",      label: "IRON",      path: "system.stats.iron",      value: stats.iron      ?? 1 },
        { key: "edge",      label: "EDGE",      path: "system.stats.edge",      value: stats.edge      ?? 1 },
        { key: "frame",     label: "FRAME",     path: "system.stats.frame",     value: stats.frame     ?? 1 },
        { key: "signal",    label: "SIGNAL",    path: "system.stats.signal",    value: stats.signal    ?? 1 },
        { key: "resonance", label: "RESONANCE", path: "system.stats.resonance", value: stats.resonance ?? 1 },
        { key: "veil",      label: "VEIL",      path: "system.stats.veil",      value: stats.veil      ?? 1 },
      ];

      context.roles   = ROLES;
      context.tiers   = TIERS;
      context.threats = THREAT;

      const playedThisTurn = new Set(s.turn?.cardsPlayedThisTurn ?? []);
      context.cards = (a?.items?.contents ?? [])
        .filter(i => i.type === "card")
        .map(c => ({
          id: c.id, name: c.name ?? "(card)", img: c.img,
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
        }))
        .sort((x, y) => (x.system.tier - y.system.tier) || x.name.localeCompare(y.name));

      context.immunitiesJoined  = (s.immunities  ?? []).join(", ");
      context.resistancesJoined = (s.resistances ?? []).join(", ");
      context.sensesJoined      = (s.senses      ?? []).join(", ");

      context.statusEffects = (a?.effects?.contents ?? []).map(fx => ({
        id: fx.id, name: fx.name, img: fx.img,
        stacks: fx.flags?.tesshari?.stacks ?? null,
        type: fx.flags?.tesshari?.type ?? "state",
        summary: fx.flags?.tesshari?.summary ?? "",
      }));

      return context;
    } catch (err) {
      console.error("tesshari | monster sheet _prepareContext failed:", err);
      ui.notifications?.error(`Monster sheet render error: ${err.message}. See F12.`);
      throw err;
    }
  }

  static async #onSubmit(event, form, formData) {
    const submit = foundry.utils.expandObject(formData.object ?? formData);
    // Round-trip comma-separated immunities / resistances / senses
    for (const key of ["immunities", "resistances", "senses"]) {
      const joinedKey = `${key}Joined`;
      if (submit.system?.[joinedKey] !== undefined) {
        const raw = String(submit.system[joinedKey] ?? "");
        submit.system[key] = raw.split(",").map(x => x.trim()).filter(Boolean);
        delete submit.system[joinedKey];
      }
    }
    await this.document.update(submit);
  }

  static async #onPlayCard(event, target) {
    const itemId = target.dataset.itemId;
    if (itemId) await this.actor.playCard(itemId);
  }

  static async #onBasicAttack(event, target) {
    const a = this.actor;
    if (a.system.turn?.basicAttackUsed) {
      return ui.notifications?.warn("Basic Attack already used this turn.");
    }
    const defenders = Array.from(game.user.targets).map(t => t.actor).filter(Boolean);
    if (defenders.length === 0) {
      return ui.notifications?.warn("Basic Attack: target a token first (hover + T).");
    }
    const stat = a.system.stats?.iron ?? 0;
    for (const defender of defenders) {
      await game.tesshari.damage.resolve(defender, {
        baseDamage: 0, statValue: stat, attacker: a, label: `${a.name} — Basic Attack`,
      });
    }
    await a.update({ "system.turn.basicAttackUsed": true });
  }

  static async #onEndTurn(event, target) {
    const combat = game.combat;
    if (!combat) return ui.notifications?.warn("No active combat.");
    const combatant = combat.combatants.find(c => c.actor?.id === this.actor.id);
    if (!combatant) return ui.notifications?.warn("This monster is not in the current combat.");
    if (combat.combatant?.id !== combatant.id) {
      return ui.notifications?.warn("It is not this monster's turn.");
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
    await a.update({ "system.ap.value": a.system.ap?.max ?? 2 });
  }

  static async #onRemoveEffect(event, target) {
    const effectId = target.dataset.effectId;
    const effect = this.actor.effects.get(effectId);
    if (effect) await effect.delete();
  }
}
