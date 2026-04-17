/*
### Resilient Sphere

_4th-level evocation_

**Casting Time**: 1 action

**Range**: 30 feet

**Components**: V, S, M (a hemispherical piece of clear crystal and a matching hemispherical piece of gum arabic)

**Duration**: Concentration, up to 1 minute

A sphere of shimmering force encloses a creature or object of Large size or smaller within range. An unwilling creature must make a Dexterity saving throw. On a failed save, the creature is enclosed for the duration. Nothing—not physical objects, energy, or other spell effects—can pass through the barrier, in or out, though a creature in the sphere can breathe there. The sphere is immune to all damage, and a creature or object inside can’t be damaged by attacks or effects originating from outside, nor can a creature inside the sphere damage anything outside it. The sphere is weightless and just large enough to contain the creature or object inside. An enclosed creature can use its action to push against the sphere’s walls and thus roll the sphere at up to half the creature’s speed. Similarly, the globe can be picked up and moved by other creatures. A disintegrate spell targeting the globe destroys it without harming anything inside it.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 4, 'Resilient Sphere')
    if slot_level == -1:
        return
    set_concentration(Owner, 'Resilient Sphere')
    if !Scene:
        failed = resolve_spell_save_manually(Owner, 'Dexterity')
        if !failed:
            log('Target fails Resilient Sphere Dexterity save')
        else:
            log('Target succeeds Resilient Sphere Dexterity save')
        return

    targ = selectCharacter()
    targets = [targ]
    results = saving_throw(Owner, targets, 'Dexterity')
    successes = results[0]
    failures = results[1]
    for targ in failures:
        name = targ.name
        log('{{name}} is enclosed in a Resilient Sphere; nothing can pass through, and the target is immune to all damage')
    for targ in successes:
        name = targ.name
        log('{{name}} avoided the Resilient Sphere')

    
