/*
### Branding Smite

_2nd-level evocation_

**Casting Time**: 1 bonus action

**Range**: Self

**Components**: V

**Duration**: Concentration, up to 1 minute

The next time you hit a creature with a weapon attack before this spell ends, the weapon gleams with astral radiance as you strike. The attack deals an extra 2d6 radiant damage to the target, which becomes visible if it's invisible, and the target sheds dim light in a 5-foot radius and can't become invisible until the spell ends. 

At Higher Levels. When you cast this spell using a spell slot of 3rd level or higher, the extra damage increases by 1d6 for each slot level above 2nd.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 2, 'Branding Smite')
    if slot_level == -1:
        return
    total_dice = 2 + (slot_level - 2)
    set_concentration(Owner, 'Branding Smite')
    name = Owner.name
    log('{{name}} casts Branding Smite: next weapon hit deals {{total_dice}}d6 extra radiant damage and the target becomes visible')

