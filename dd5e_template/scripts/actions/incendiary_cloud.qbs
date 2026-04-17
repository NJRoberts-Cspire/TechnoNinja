/*
### Incendiary Cloud

_8th-level conjuration_

**Casting Time**: 1 action

**Range**: 150 feet

**Components**: V, S

**Duration**: Concentration, up to 1 minute

A swirling cloud of smoke shot through with white- hot embers appears in a 20-foot-radius sphere centered on a point within range. The cloud spreads around corners and is heavily obscured. It lasts for the duration or until a wind of moderate or greater speed (at least 10 miles per hour) disperses it. When the cloud appears, each creature in it must make a Dexterity saving throw. A creature takes 10d8 fire damage on a failed save, or half as much damage on a successful one. A creature must also make this saving throw when it enters the spell’s area for the first time on a turn or ends its turn there. The cloud moves 10 feet directly away from you in a direction that you choose at the start of each of your turns.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 8, 'Incendiary Cloud')
    if slot_level == -1:
        return
    set_concentration(Owner, 'Incendiary Cloud')
    if !Scene:
        failed = resolve_spell_save_manually(Owner, 'Dexterity')
        if !failed:
            log('Target fails Incendiary Cloud Dexterity save')
        else:
            log('Target succeeds Incendiary Cloud Dexterity save')
        return

    targets = selectCharacters()
    results = saving_throw(Owner, targets, 'Dexterity')
    successes = results[0]
    failures = results[1]
    for targ in failures:
        damage = roll_damage(Owner, '10d8', targ, 'Fire')
        name = targ.name
        log('Incendiary Cloud hits {{name}} for {{damage}} fire damage')
        apply_damage(targ, damage)
    for targ in successes:
        damage = roll_damage(Owner, '10d8', targ, 'Fire')
        half_damage = floor(damage / 2)
        name = targ.name
        log('Incendiary Cloud grazes {{name}} for {{half_damage}} fire damage')
        apply_damage(targ, half_damage)
    log('The cloud moves 10 ft away from the caster each round')

