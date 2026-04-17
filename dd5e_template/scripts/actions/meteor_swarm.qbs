/*
### Meteor Swarm

_9th-level evocation_

**Casting Time**: 1 action

**Range**: 1 mile

**Components**: V, S

**Duration**: Instantaneous

Blazing orbs of fire plummet to the ground at four different points you can see within range. Each creature in a 40-foot-radius sphere centered on each point you choose must make a Dexterity saving throw. The sphere spreads around corners. A creature takes 20d6 fire damage and 20d6 bludgeoning damage on a failed save, or half as much damage on a successful one. A creature in the area of more than one fiery burst is affected only once. The spell damages objects in the area and ignites flammable objects that aren’t being worn or carried.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 9, 'Meteor Swarm')
    if slot_level == -1:
        return
    if !Scene:
        failed = resolve_spell_save_manually(Owner, 'Dexterity')
        if !failed:
            log('Target fails Meteor Swarm Dexterity save')
        else:
            log('Target succeeds Meteor Swarm Dexterity save')
        return

    targets = selectCharacters()
    results = saving_throw(Owner, targets, 'Dexterity')
    successes = results[0]
    failures = results[1]
    for targ in failures:
        fire_damage = roll_damage(Owner, '20d6', targ, 'Fire')
        bludgeoning_damage = roll_damage(Owner, '20d6', targ, 'Fire')
        total_damage = fire_damage + bludgeoning_damage
        name = targ.name
        log('Meteor Swarm hits {{name}} for {{fire_damage}} fire + {{bludgeoning_damage}} bludgeoning ({{total_damage}} total) damage')
        apply_damage(targ, total_damage)
    for targ in successes:
        fire_damage = roll_damage(Owner, '20d6', targ, 'Fire')
        bludgeoning_damage = roll_damage(Owner, '20d6', targ, 'Fire')
        total_damage = fire_damage + bludgeoning_damage
        half_damage = floor(total_damage / 2)
        name = targ.name
        log('Meteor Swarm grazes {{name}} for {{half_damage}} damage')
        apply_damage(targ, half_damage)

