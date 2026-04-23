/**
 * Tesshari NPC Sheet
 * ------------------
 * Minimal ActorSheetV2 for the `npc` actor type. Non-combatants — no stats,
 * no cards. Just identity, faction, biography, notes.
 */

const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ActorSheetV2 } = foundry.applications.sheets;

export class TesshariNpcSheet extends HandlebarsApplicationMixin(ActorSheetV2) {

  static DEFAULT_OPTIONS = {
    classes: ["tesshari", "sheet", "actor", "npc"],
    position: { width: 640, height: 620 },
    window: { resizable: true, contentClasses: ["standard-form"] },
    form: {
      submitOnChange: true,
      closeOnSubmit: false,
      handler: TesshariNpcSheet.#onSubmit,
    },
  };

  static PARTS = {
    form: { template: "systems/tesshari/templates/actor/npc-sheet.hbs" },
  };

  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    context.actor = this.actor;
    context.system = this.actor.system ?? {};
    return context;
  }

  static async #onSubmit(event, form, formData) {
    const submit = foundry.utils.expandObject(formData.object ?? formData);
    await this.document.update(submit);
  }
}
