/*
### Nondetection

_3rd-level abjuration_

**Casting Time**: 1 action

**Range**: Touch

**Components**: V, S, M (a pinch of diamond dust worth 25 gp sprinkled over the target, which the spell consumes)

**Duration**: 8 hours

For the duration, you hide a target that you touch from divination magic. The target can be a willing creature or a place or an object no larger than 10 feet in any dimension. The target can’t be targeted by any divination magic or perceived through magical scrying sensors.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 3, 'Nondetection')
    if slot_level == -1:
        return
    name = Owner.name
    log('{{name}} hides a target from divination magic; the target cannot be targeted by any divination magic or perceived through magical scrying sensors for 8 hours')

