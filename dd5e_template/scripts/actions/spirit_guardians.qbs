/*
### Spirit Guardians

_3rd-level conjuration_

**Casting Time**: 1 action

**Range**: Self (15-foot radius)

**Components**: V, S, M (a holy symbol)

**Duration**: Concentration, up to 10 minutes

You call forth spirits to protect you. They flit around you to a distance of 15 feet for the duration. If you are good or neutral, their spectral form appears angelic or fey (your choice). If you are evil, they appear fiendish. When you cast this spell, you can designate any number of creatures you can see to be unaffected by it. An affected creature’s speed is halved in the area, and when the creature enters the area for the first time on a turn or starts its turn there, it must make a Wisdom saving throw. On a failed save, the creature takes 3d8 radiant damage (if you are good or neutral) or 3d8 necrotic damage (if you are evil). On a successful save, the creature takes half as much damage. 

At Higher Levels. When you cast this spell using a spell slot of 4th level or higher, the damage increases by 1d8 for each slot level above 3rd.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 3, 'Spirit Guardians')
    if slot_level == -1:
        return
    extra_dice = slot_level - 3
    total_dice = 3 + extra_dice
    set_concentration(Owner, 'Spirit Guardians')
    if !Scene:
        failed = resolve_spell_save_manually(Owner, 'Wisdom')
        if !failed:
            log('Target fails Spirit Guardians Wisdom save')
        else:
            log('Target succeeds Spirit Guardians Wisdom save')
        return

    targets = selectCharacters()
    results = saving_throw(Owner, targets, 'Wisdom')
    successes = results[0]
    failures = results[1]
    for targ in failures:
        damage = roll_damage(Owner, '{{total_dice}}d8', targ, 'Radiant')
        name = targ.name
        log('Spirit Guardians strikes {{name}} for {{damage}} radiant damage')
        apply_damage(targ, damage)
    for targ in successes:
        damage = roll_damage(Owner, '{{total_dice}}d8', targ, 'Radiant')
        half_damage = floor(damage / 2)
        name = targ.name
        log('Spirit Guardians grazes {{name}} for {{half_damage}} radiant damage')
        apply_damage(targ, half_damage)

