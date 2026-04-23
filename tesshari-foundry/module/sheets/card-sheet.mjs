/**
 * Tesshari Card Sheet
 * -------------------
 * Minimal ItemSheetV2 for editing card items. Exposes every system field in
 * one tab. Keywords are edited as a comma-separated string for simplicity and
 * round-tripped to/from the underlying array in _prepareSubmitData.
 */

const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ItemSheetV2 } = foundry.applications.sheets;

const CATEGORIES = [
  "attack", "defense", "control", "power", "reaction",
  "passive", "mobility", "utility", "signature", "boss",
];
const PRIMARY_STATS = ["", "iron", "edge", "frame", "signal", "resonance", "veil", "mixed"];

export class TesshariCardSheet extends HandlebarsApplicationMixin(ItemSheetV2) {

  static DEFAULT_OPTIONS = {
    classes: ["tesshari", "sheet", "item", "card"],
    position: { width: 520, height: 680 },
    window: { resizable: true, contentClasses: ["standard-form"] },
    form: {
      submitOnChange: true,
      closeOnSubmit: false,
      handler: TesshariCardSheet.#onSubmit,
    },
  };

  static PARTS = {
    form: { template: "systems/tesshari/templates/item/card-sheet.hbs" },
  };

  /** @override */
  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    const item = this.document;
    const s = item.system;

    context.item = item;
    context.system = s;

    // Enumerations
    context.tiers        = [0, 1, 2, 3, 4];
    context.categories   = CATEGORIES;
    context.primaryStats = PRIMARY_STATS;

    // Keywords as a comma-separated string for the text input
    context.keywordsJoined = (s.keywords ?? []).join(", ");

    // Description rich-text enrichment (so links/references render)
    context.descriptionHTML = await foundry.applications.ux.TextEditor.implementation.enrichHTML(
      s.description ?? "",
      { relativeTo: item, async: true }
    );

    return context;
  }

  /**
   * Convert the flat submitted form data into an update delta. Splits the
   * comma-separated keywords field back into an array.
   */
  static async #onSubmit(event, form, formData) {
    const submit = foundry.utils.expandObject(formData.object ?? formData);

    // keywordsJoined → system.keywords[]
    if (submit.system?.keywordsJoined !== undefined) {
      const raw = String(submit.system.keywordsJoined ?? "");
      submit.system.keywords = raw
        .split(",")
        .map(k => k.trim())
        .filter(Boolean);
      delete submit.system.keywordsJoined;
    }

    await this.document.update(submit);
  }
}
