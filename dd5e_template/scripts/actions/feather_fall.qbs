/*
### Feather Fall

_1st-level transmutation_

**Casting Time**: 1 reaction, which you take when you or a creature within 60 feet of you falls

**Range**: 60 feet

**Components**: V, M (a small feather or piece of down)

**Duration**: 1 minute

Choose up to five falling creatures within range. A falling creature’s rate of descent slows to 60 feet per round until the spell ends. If the creature lands before the spell ends, it takes no falling damage and can land on its feet, and the spell ends for that creature.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 1, 'Feather Fall')
    if slot_level == -1:
        return
    if !Scene:
        prompt('Feather Fall: select targets in an active scene to resolve this spell.', ['Ok'])
        return

    targets = selectCharacters()
    for targ in targets:
        name = targ.name
        log('{{name}} slows their descent and will take no fall damage')

