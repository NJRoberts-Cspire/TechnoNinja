/*
### Continual Flame

_2nd-level evocation_

**Casting Time**: 1 action

**Range**: Touch

**Components**: V, S, M (ruby dust worth 50 gp, which the spell consumes)

**Duration**: Until dispelled

A flame, equivalent in brightness to a torch, springs forth from an object that you touch. The effect looks like a regular flame, but it creates no heat and doesn’t use oxygen. A continual flame can be covered or hidden but not smothered or quenched.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 2, 'Continual Flame')
    if slot_level == -1:
        return
    name = Owner.name
    log('{{name}} casts Continual Flame')

