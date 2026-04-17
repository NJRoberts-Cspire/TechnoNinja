/*
### Moonbeam

_2nd-level evocation_

**Casting Time**: 1 action

**Range**: 120 feet

**Components**: V, S, M (several seeds of any moonseed plant and a piece of opalescent feldspar)

**Duration**: Concentration, up to 1 minute

A silvery beam of pale light shines down in a 5-foot- radius, 40-foot-high cylinder centered on a point within range. Until the spell ends, dim light fills the cylinder. When a creature enters the spell’s area for the first time on a turn or starts its turn there, it is engulfed in ghostly flames that cause searing pain, and it must make a Constitution saving throw. It takes 2d10 radiant damage on a failed save, or half as much damage on a successful one. A shapechanger makes its saving throw with disadvantage. If it fails, it also instantly reverts to its original form and can’t assume a different form until it leaves the spell’s light. On each of your turns after you cast this spell, you can use an action to move the beam 60 feet in any direction. 

At Higher Levels. When you cast this spell using a spell slot of 3rd level or higher, the damage increases by 1d10 for each slot level above 2nd.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 2, 'Moonbeam')
    if slot_level == -1:
        return
    total_dice = 2 + (slot_level - 2)
    set_concentration(Owner, 'Moonbeam')
    if !Scene:
        failed = resolve_spell_save_manually(Owner, 'Constitution')
        if !failed:
            log('Target fails Moonbeam Constitution save')
        else:
            log('Target succeeds Moonbeam Constitution save')
        return

    targets = selectCharacters()
    results = saving_throw(Owner, targets, 'Constitution')
    successes = results[0]
    failures = results[1]
    for targ in failures:
        damage = roll_damage(Owner, '{{total_dice}}d10', targ, 'Radiant')
        name = targ.name
        log('Moonbeam hits {{name}} for {{damage}} radiant damage')
        apply_damage(targ, damage)
    for targ in successes:
        damage = roll_damage(Owner, '{{total_dice}}d10', targ, 'Radiant')
        half_damage = floor(damage / 2)
        name = targ.name
        log('Moonbeam grazes {{name}} for {{half_damage}} radiant damage')
        apply_damage(targ, half_damage)

    
