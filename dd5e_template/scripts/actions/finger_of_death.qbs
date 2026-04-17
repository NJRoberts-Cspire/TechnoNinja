/*
### Finger of Death

_7th-level necromancy_

**Casting Time**: 1 action

**Range**: 60 feet

**Components**: V, S

**Duration**: Instantaneous

You send negative energy coursing through a creature that you can see within range, causing it searing pain. The target must make a Constitution saving throw. It takes 7d8 + 30 necrotic damage on a failed save, or half as much damage on a successful one. A humanoid killed by this spell rises at the start of your next turn as a zombie that is permanently under your command, following your verbal orders to the best of its ability.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 7, 'Finger of Death')
    if slot_level == -1:
        return
    if !Scene:
        failed = resolve_spell_save_manually(Owner, 'Constitution')
        if !failed:
            log('Target fails Finger of Death Constitution save')
        else:
            log('Target succeeds Finger of Death Constitution save')
        return

    targ = selectCharacter()
    targets = [targ]
    results = saving_throw(Owner, targets, 'Constitution')
    successes = results[0]
    failures = results[1]
    for targ in failures:
        damage = roll_damage(Owner, '7d8', targ, 'Necrotic') + 30
        name = targ.name
        log('Finger of Death hits {{name}} for {{damage}} necrotic damage (humanoids killed rise as zombies under your command)')
        apply_damage(targ, damage)
    for targ in successes:
        damage = roll_damage(Owner, '7d8', targ, 'Necrotic') + 30
        half_damage = floor(damage / 2)
        name = targ.name
        log('Finger of Death grazes {{name}} for {{half_damage}} necrotic damage')
        apply_damage(targ, half_damage)
