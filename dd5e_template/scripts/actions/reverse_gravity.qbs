/*
### Reverse Gravity

_7th-level transmutation_

**Casting Time**: 1 action

**Range**: 100 feet

**Components**: V, S, M (a lodestone and iron filings)

**Duration**: Concentration, up to 1 minute

This spell reverses gravity in a 50-foot-radius, 100- foot high cylinder centered on a point within range. All creatures and objects that aren’t somehow anchored to the ground in the area fall upward and reach the top of the area when you cast this spell. A creature can make a Dexterity saving throw to grab onto a fixed object it can reach, thus avoiding the fall. If some solid object (such as a ceiling) is encountered in this fall, falling objects and creatures strike it just as they would during a normal downward fall. If an object or creature reaches the top of the area without striking anything, it remains there, oscillating slightly, for the duration. At the end of the duration, affected objects and creatures fall back down.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 7, 'Reverse Gravity')
    if slot_level == -1:
        return
    set_concentration(Owner, 'Reverse Gravity')
    if !Scene:
        failed = resolve_spell_save_manually(Owner, 'Dexterity')
        if !failed:
            log('Target fails Reverse Gravity Dexterity save')
        else:
            log('Target succeeds Reverse Gravity Dexterity save')
        return

    targets = selectCharacters()
    results = saving_throw(Owner, targets, 'Dexterity')
    successes = results[0]
    failures = results[1]
    for targ in failures:
        damage = roll_damage(Owner, '20d6', targ, 'Bludgeoning')
        name = targ.name
        log('{{name}} falls upward and takes {{damage}} bludgeoning damage upon hitting the ceiling')
        apply_damage(targ, damage)
    for targ in successes:
        name = targ.name
        log('{{name}} grabs onto something and avoids falling upward')

