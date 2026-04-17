/*
### Faerie Fire

_1st-level evocation_

**Casting Time**: 1 action

**Range**: 60 feet

**Components**: V

**Duration**: Concentration, up to 1 minute

Each object in a 20-foot cube within range is outlined in blue, green, or violet light (your choice). Any creature in the area when the spell is cast is also outlined in light if it fails a Dexterity saving throw. For the duration, objects and affected creatures shed dim light in a 10-foot radius. Any attack roll against an affected creature or object has advantage if the attacker can see it, and the affected creature or object can’t benefit from being invisible. 4th-level conjuration Casting Time: 1 action Range: 30 feet Components: V, S, M (a tiny silver whistle, a piece of bone, and a thread) Duration: 8 hours You conjure a phantom watchdog in an unoccupied space that you can see within range, where it remains for the duration, until you dismiss it as an action, or until you move more than 100 feet away from it. The hound is invisible to all creatures except you and can’t be harmed. When a Small or larger creature comes within 30 feet of it without first speaking the password that you specify when you cast this spell, the hound starts barking loudly. The hound sees invisible creatures and can see into the Ethereal Plane. It ignores illusions. At the start of each of your turns, the hound attempts to bite one creature within 5 feet of it that is hostile to you. The hound’s attack bonus is equal to your spellcasting ability modifier + your proficiency bonus. On a hit, it deals 4d8 piercing damage.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 1, 'Faerie Fire')
    if slot_level == -1:
        return
    set_concentration(Owner, 'Faerie Fire')
    if !Scene:
        failed = resolve_spell_save_manually(Owner, 'Dexterity')
        if !failed:
            log('Target fails Faerie Fire Dexterity save')
        else:
            log('Target succeeds Faerie Fire Dexterity save')
        return

    targets = selectCharacters()
    results = saving_throw(Owner, targets, 'Dexterity')
    successes = results[0]
    failures = results[1]
    for targ in failures:
        name = targ.name
        log('{{name}} is outlined in faerie fire: attacks against them have advantage')
    for targ in successes:
        name = targ.name
        log('{{name}} resisted Faerie Fire')

