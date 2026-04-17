/*
### Polymorph

_4th-level transmutation_

**Casting Time**: 1 action

**Range**: 60 feet

**Components**: V, S, M (a caterpillar cocoon)

**Duration**: Concentration, up to 1 hour

This spell transforms a creature that you can see within range into a new form. An unwilling creature must make a Wisdom saving throw to avoid the effect. The spell has no effect on a shapechanger or a creature with 0 hit points. The transformation lasts for the duration, or until the target drops to 0 hit points or dies. The new form can be any beast whose challenge rating is equal to or less than the target’s (or the target’s level, if it doesn’t have a challenge rating). The target’s game statistics, including mental ability scores, are replaced by the statistics of the chosen beast. It retains its alignment and personality. The target assumes the hit points of its new form. When it reverts to its normal form, the creature returns to the number of hit points it had before it transformed. If it reverts as a result of dropping to 0 hit points, any excess damage carries over to its normal form. As long as the excess damage doesn’t reduce the creature’s normal form to 0 hit points, it isn’t knocked unconscious. The creature is limited in the actions it can perform by the nature of its new form, and it can’t speak, cast spells, or take any other action that requires hands or speech. The target’s gear melds into the new form. The creature can’t activate, use, wield, or otherwise benefit from any of its equipment. 9th-level enchantment Casting Time: 1 action Range: 60 feet Components: V Duration: Instantaneous You utter a word of power that can compel one creature you can see within range to die instantly. If the creature you choose has 100 hit points or fewer, it dies. Otherwise, the spell has no effect.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 4, 'Polymorph')
    if slot_level == -1:
        return
    set_concentration(Owner, 'Polymorph')
    if !Scene:
        failed = resolve_spell_save_manually(Owner, 'Wisdom')
        if !failed:
            log('Target fails Polymorph Wisdom save')
        else:
            log('Target succeeds Polymorph Wisdom save')
        return

    targ = selectCharacter()
    targets = [targ]
    results = saving_throw(Owner, targets, 'Wisdom')
    successes = results[0]
    failures = results[1]
    for targ in failures:
        name = targ.name
        log('{{name}} is polymorphed into a new beast form chosen by the caster')
    for targ in successes:
        name = targ.name
        log('{{name}} resisted Polymorph')

