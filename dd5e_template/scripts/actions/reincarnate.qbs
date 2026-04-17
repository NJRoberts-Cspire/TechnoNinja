/*
### Reincarnate

_5th-level transmutation_

**Casting Time**: 1 hour

**Range**: Touch

**Components**: V, S, M (rare oils and unguents worth at least 1,000 gp, which the spell consumes)

**Duration**: Instantaneous

You touch a dead humanoid or a piece of a dead humanoid. Provided that the creature has been dead no longer than 10 days, the spell forms a new adult body for it and then calls the soul to enter that body. If the target’s soul isn’t free or willing to do so, the spell fails. The magic fashions a new body for the creature to inhabit, which likely causes the creature’s race to change. The GM rolls a d100 and consults the following table to determine what form the creature takes when restored to life, or the GM chooses a form. The reincarnated creature recalls its former life and experiences. It retains the capabilities it had in its original form, except it exchanges its original race for the new one and changes its racial traits accordingly.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 5, 'Reincarnate')
    if slot_level == -1:
        return
    name = Owner.name
    log('{{name}} casts Reincarnate')

    
