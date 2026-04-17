/*
### Cloudkill

_5th-level conjuration_

**Casting Time**: 1 action

**Range**: 120 feet

**Components**: V, S

**Duration**: Concentration, up to 10 minutes

You create a 20-foot-radius sphere of poisonous, yellow-green fog centered on a point you choose within range. The fog spreads around corners. It lasts for the duration or until strong wind disperses the fog, ending the spell. Its area is heavily obscured. When a creature enters the spell’s area for the first time on a turn or starts its turn there, that creature must make a Constitution saving throw. The creature takes 5d8 poison damage on a failed save, or half as much damage on a successful one. Creatures are affected even if they hold their breath or don’t need to breathe. The fog moves 10 feet away from you at the start of each of your turns, rolling along the surface of the ground. The vapors, being heavier than air, sink to the lowest level of the land, even pouring down openings. 

At Higher Levels. When you cast this spell using a spell slot of 6th level or higher, the damage increases by 1d8 for each slot level above 5th.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 5, 'Cloudkill')
    if slot_level == -1:
        return

    extra_dice = slot_level - 5
    total_dice = 5 + extra_dice

    set_concentration(Owner, 'Cloudkill')

    if !Scene:
        save_fails = resolve_spell_save_manually(Owner, 'Constitution')
        if !save_fails:
            log('Cloudkill misses')
            return
        damage = roll_damage(Owner, '{{total_dice}}d8')
        prompt('Cloudkill hits for {{damage}} poison damage', ['Ok'])
        log('Cloudkill hits for {{damage}} poison damage')
        return

    targets = selectCharacters()
    results = saving_throw(Owner, targets, 'Constitution')
    successes = results[0]
    failures = results[1]

    for targ in failures:
        damage = roll_damage(Owner, '{{total_dice}}d8', targ, 'Poison')
        name = targ.name
        set_condition(targ, 'Poisoned', true)
        log('Cloudkill hits {{name}} for {{damage}} poison damage and Poisons them')
        apply_damage(targ, damage)

    for targ in successes:
        damage = roll_damage(Owner, '{{total_dice}}d8', targ, 'Poison')
        half_damage = floor(damage / 2)
        name = targ.name
        log('Cloudkill grazes {{name}} for {{half_damage}} poison damage')
        apply_damage(targ, half_damage)


