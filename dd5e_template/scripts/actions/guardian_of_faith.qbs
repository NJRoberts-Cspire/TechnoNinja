/*
### Guardian of Faith

_4th-level conjuration_

**Casting Time**: 1 action

**Range**: 30 feet

**Components**: V 150

**Duration**: 8 hours

A Large spectral guardian appears and hovers for the duration in an unoccupied space of your choice that you can see within range. The guardian occupies that space and is indistinct except for a gleaming sword and shield emblazoned with the symbol of your deity. Any creature hostile to you that moves to a space within 10 feet of the guardian for the first time on a turn must succeed on a Dexterity saving throw. The creature takes 20 radiant damage on a failed save, or half as much damage on a successful one. The guardian vanishes when it has dealt a total of 60 damage.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 4, 'Guardian of Faith')
    if slot_level == -1:
        return
    name = Owner.name
    log('{{name}} summons a spectral guardian that occupies a 10-foot space; hostile creatures entering within 10 feet take 20 radiant damage on a failed Dexterity save (10 on success); the guardian vanishes after dealing 60 total damage')

