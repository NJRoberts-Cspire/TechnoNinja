/**
 * Tesshari Card Preview (tactics-mode hover tooltip)
 * --------------------------------------------------
 * Pure rendering — takes the structured preview from CardEngine.preview()
 * and the source card item, returns an HTML string for the floating tooltip.
 *
 * Lives separate from the character sheet so the markup is easy to iterate
 * on without scrolling past sheet plumbing.
 */

const ESC_DIV = document.createElement("div");
function escapeHtml(s) {
  ESC_DIV.textContent = String(s ?? "");
  return ESC_DIV.innerHTML;
}

/** Status keyword → CSS modifier class. Drives keyword color-coding. */
const KEYWORD_TYPE = {
  guard: "buff", shield: "buff", fortify: "buff", regen: "buff", veil: "buff",
  bleed: "debuff", burn: "debuff", expose: "debuff", vulnerable: "debuff",
  overheat: "debuff", stagger: "debuff", root: "debuff", silence: "debuff",
  taunt: "debuff", mark: "debuff",
  pierce: "modifier", echo: "modifier", overclock: "modifier",
  cleanse: "action", dispel: "action",
};

function kwClass(name) {
  const t = KEYWORD_TYPE[String(name).toLowerCase()] ?? "modifier";
  return `tp-kw tp-kw-${t} tp-kw-${name.toLowerCase()}`;
}

function riderChip({ id, value }) {
  const v = value > 1 ? ` ${value}` : "";
  return `<span class="${kwClass(id)}">${escapeHtml(id)}${v}</span>`;
}

function rawKeywordChip(raw) {
  const m = String(raw).trim().match(/^([A-Za-z]+)/);
  const name = m ? m[1] : raw;
  return `<span class="${kwClass(name)}">${escapeHtml(raw)}</span>`;
}

/**
 * @param {object} preview   from CardEngine.preview(actor, card, opts)
 * @param {Item}   card      the source card item (for description, name, img)
 * @param {object} [opts]
 * @param {boolean} [opts.overclockHint]  show the "hold Shift" hint if not already overclocked
 * @returns {string} HTML
 */
export function renderPreviewTooltip(preview, card, { overclockHint = true } = {}) {
  const sys = card.system ?? {};
  const name = escapeHtml(card.name ?? "(card)");
  const tier = Number(sys.tier ?? 0);
  const apCost = preview.apCost ?? 0;
  const cat = escapeHtml(sys.category ?? "");
  const stat = escapeHtml(sys.primaryStat ?? "");
  const desc = sys.description ?? "";
  const overclocked = !!preview.overclocked;

  // ─── header ──────────────────────────────────────────────────────────
  const tierBadge = `<span class="tp-tier tp-tier-${tier}">T${tier}</span>`;
  const apBadge = `<span class="tp-ap">${apCost} AP</span>`;
  const overclockBadge = overclocked
    ? `<span class="tp-kw tp-kw-modifier tp-kw-overclock">⚡ OVERCLOCKED</span>` : "";

  const header = `
    <header class="tp-header">
      <div class="tp-title">
        ${tierBadge}${apBadge}
        <span class="tp-name">${name}</span>
        ${overclockBadge}
      </div>
      <div class="tp-sub">
        ${cat ? `<span class="tp-cat">${cat}</span>` : ""}
        ${stat ? `<span class="tp-stat">${stat.toUpperCase()}</span>` : ""}
        ${sys.isReaction ? `<span class="tp-react">⚡ reaction</span>` : ""}
        ${sys.usesPerCombat ? `<span class="tp-uses">×${sys.usesPerCombat}/combat</span>` : ""}
      </div>
    </header>`;

  // ─── gate / cost row ─────────────────────────────────────────────────
  let costRow;
  if (!preview.canPlay?.ok) {
    costRow = `
      <div class="tp-row tp-gate-fail">
        <span class="tp-icon">✕</span>
        <span>Cannot play: ${escapeHtml(preview.canPlay?.reason ?? "blocked")}</span>
      </div>`;
  } else {
    costRow = `
      <div class="tp-row tp-cost">
        <span>AP: <strong>${apCost}</strong> → ${preview.apAfter} remain</span>
        ${preview.statValue
          ? `<span class="tp-sep">·</span><span>+${preview.statValue} from ${stat.toUpperCase()}</span>`
          : ""}
      </div>`;
  }

  // ─── targets ─────────────────────────────────────────────────────────
  let targetsBlock;
  if (preview.targets.length === 0) {
    targetsBlock = preview.hasDamage || preview.keywords.riders.length
      ? `<div class="tp-row tp-no-target">Pick a target (hover token, press T) to see outcome.</div>`
      : `<div class="tp-row tp-no-target">Self / no-target effect.</div>`;
  } else {
    targetsBlock = preview.targets.map(t => renderTarget(t)).join("");
  }

  // ─── self riders ─────────────────────────────────────────────────────
  let selfBlock = "";
  if (preview.selfRiders.length) {
    selfBlock = `
      <div class="tp-row tp-self">
        <span class="tp-row-label">Self:</span>
        ${preview.selfRiders.map(riderChip).join("")}
      </div>`;
  }

  // ─── description ─────────────────────────────────────────────────────
  const descBlock = desc
    ? `<div class="tp-desc">${desc}</div>`
    : "";

  // ─── footer hint ─────────────────────────────────────────────────────
  const hint = overclockHint && !overclocked
    ? `<div class="tp-hint">Hold <kbd>Shift</kbd> to preview Overclocked (2× base, +Overheat 2 to self).</div>`
    : "";

  return `
    <div class="tesshari-card-preview tier-${tier}">
      ${header}
      ${costRow}
      ${targetsBlock}
      ${selfBlock}
      ${descBlock}
      ${hint}
    </div>`;
}

function renderTarget(t) {
  const name = escapeHtml(t.name);
  const dropped = t.hpBefore - t.hpAfter;
  const hpBar = renderHpBar(t.hpBefore, t.hpAfter);

  // Damage line
  let dmgLine = "";
  if (t.totalDamage > 0) {
    const echoNote = t.echoDamage > 0
      ? ` <span class="tp-echo">(+${t.echoDamage} echo)</span>` : "";
    dmgLine = `
      <span class="tp-dmg">−${t.totalDamage}${echoNote}</span>
      <span class="tp-hp-delta">${t.hpBefore} → <strong>${t.hpAfter}</strong> HP</span>`;
  } else if (t.veilWouldConsume) {
    dmgLine = `<span class="tp-veil-msg">Veil consumed — riders blocked.</span>`;
  } else {
    dmgLine = `<span class="tp-no-dmg">No damage.</span>`;
  }

  // Mitigation breakdown
  const mitChips = [];
  if (t.guardConsumed)  mitChips.push(`<span class="tp-mit-guard">Guard −${t.guardConsumed}</span>`);
  if (t.shieldConsumed) mitChips.push(`<span class="tp-mit-shield">Shield −${t.shieldConsumed}</span>`);
  if (t.vulnerableStacks) mitChips.push(`<span class="tp-mit-vuln">Vulnerable ×${t.vulnerableStacks}</span>`);
  if (t.exposeAdded)      mitChips.push(`<span class="tp-mit-expose">+${t.exposeAdded} Expose</span>`);
  const mitLine = mitChips.length
    ? `<div class="tp-row tp-mit">${mitChips.join("")}</div>` : "";

  // Riders (skipped when Veil consumes them)
  const riderChips = t.riders.map(riderChip);
  if (t.cleansed)  riderChips.push(`<span class="tp-kw tp-kw-action">cleanse 1</span>`);
  if (t.dispelled) riderChips.push(`<span class="tp-kw tp-kw-action">dispel 1</span>`);
  const riderLine = riderChips.length
    ? `<div class="tp-row tp-riders"><span class="tp-row-label">Then:</span>${riderChips.join("")}</div>`
    : "";

  // Veil note (when riders are blocked but damage still goes through)
  const veilNote = (t.veilWouldConsume && (t.riders.length || t.cleansed || t.dispelled))
    ? `<div class="tp-row tp-veil-note">Veil on target — riders will not apply (Veil consumed).</div>`
    : "";

  return `
    <div class="tp-target ${dropped > 0 ? "is-hit" : ""} ${t.hpAfter === 0 ? "is-killed" : ""}">
      <div class="tp-target-head">
        <span class="tp-target-name">${name}</span>
        ${dmgLine}
      </div>
      ${hpBar}
      ${mitLine}
      ${veilNote}
      ${riderLine}
    </div>`;
}

function renderHpBar(before, after) {
  if (before <= 0) return "";
  const beforePct = 100;  // before is the baseline
  const afterPct  = Math.max(0, Math.min(100, Math.round((after / before) * 100)));
  return `
    <div class="tp-hp-bar" title="${after} / ${before} HP">
      <div class="tp-hp-after" style="width: ${afterPct}%"></div>
      <div class="tp-hp-loss" style="left: ${afterPct}%; right: 0;"></div>
    </div>`;
}
