/*
### Web

_2nd-level conjuration_

**Casting Time**: 1 action

**Range**: 60 feet

**Components**: V, S, M (a bit of spiderweb)

**Duration**: Concentration, up to 1 hour

You conjure a mass of thick, sticky webbing at a point of your choice within range. The webs fill a 20- foot cube from that point for the duration. The webs are difficult terrain and lightly obscure their area. If the webs aren’t anchored between two solid masses (such as walls or trees) or layered across a floor, wall, or ceiling, the conjured web collapses on itself, and the spell ends at the start of your next turn. Webs layered over a flat surface have a depth of 5 feet. Each creature that starts its turn in the webs or that enters them during its turn must make a Dexterity saving throw. On a failed save, the creature is restrained as long as it remains in the webs or until it breaks free. A creature restrained by the webs can use its action to make a Strength check against your spell save DC. If it succeeds, it is no longer restrained. The webs are flammable. Any 5-foot cube of webs exposed to fire burns away in 1 round, dealing 2d4 fire damage to any creature that starts its turn in the fire.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 2, 'Web')
    if slot_level == -1:
        return
    set_concentration(Owner, 'Web')
    if !Scene:
        failed = resolve_spell_save_manually(Owner, 'Dexterity')
        if !failed:
            log('Target fails Web Dexterity save')
        else:
            log('Target succeeds Web Dexterity save')
        return

    targets = selectCharacters()
    results = saving_throw(Owner, targets, 'Dexterity')
    successes = results[0]
    failures = results[1]
    for targ in failures:
        name = targ.name
        set_condition(targ, 'Restrained', true)
        log('{{name}} is restrained in the web')
    for targ in successes:
        name = targ.name
        log('{{name}} avoided being restrained by the web')

    
