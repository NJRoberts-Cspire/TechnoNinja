/*
### Dominate Monster

_8th-level enchantment_

**Casting Time**: 1 action

**Range**: 60 feet

**Components**: V, S

**Duration**: Concentration, up to 1 hour

You attempt to beguile a creature that you can see within range. It must succeed on a Wisdom saving throw or be charmed by you for the duration. If you or creatures that are friendly to you are fighting it, it has advantage on the saving throw. While the creature is charmed, you have a telepathic link with it as long as the two of you are on the same plane of existence. You can use this telepathic link to issue commands to the creature while you are conscious (no action required), which it does its best to obey. You can specify a simple and general course of action, such as “Attack that creature,” “Run over there,” or “Fetch that object.” If the creature completes the order and doesn’t receive further direction from you, it defends and preserves itself to the best of its ability. You can use your action to take total and precise control of the target. Until the end of your next turn, the creature takes only the actions you choose, and doesn’t do anything that you don’t allow it to do. During this time, you can also cause the creature to use a reaction, but this requires you to use your own reaction as well. Each time the target takes damage, it makes a new Wisdom saving throw against the spell. If the saving throw succeeds, the spell ends. 137 

At Higher Levels. When you cast this spell with a 9th-level spell slot, the duration is concentration, up to 8 hours.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 8, 'Dominate Monster')
    if slot_level == -1:
        return
    set_concentration(Owner, 'Dominate Monster')
    if !Scene:
        failed = resolve_spell_save_manually(Owner, 'Wisdom')
        if !failed:
            log('Target fails Dominate Monster Wisdom save')
        else:
            log('Target succeeds Dominate Monster Wisdom save')
        return

    targ = selectCharacter()
    targets = [targ]
    results = saving_throw(Owner, targets, 'Wisdom')
    successes = results[0]
    failures = results[1]
    for targ in failures:
        set_condition(targ, 'Charmed', true)
        name = targ.name
        log('{{name}} is dominated')
    for targ in successes:
        name = targ.name
        log('{{name}} resisted Dominate Monster')

