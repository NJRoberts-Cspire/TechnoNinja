/*
### Water Walk

_3rd-level transmutation (ritual)_

**Casting Time**: 1 action 191

**Range**: 30 feet

**Components**: V, S, M (a piece of cork)

**Duration**: 1 hour

This spell grants the ability to move across any liquid surface—such as water, acid, mud, snow, quicksand, or lava—as if it were harmless solid ground (creatures crossing molten lava can still take damage from the heat). Up to ten willing creatures you can see within range gain this ability for the duration. If you target a creature submerged in a liquid, the spell carries the target to the surface of the liquid at a rate of 60 feet per round.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 3, 'Water Walk')
    if slot_level == -1:
        return
    name = Owner.name
    log('{{name}} grants up to 10 willing creatures the ability to move across liquid surfaces as if they were solid ground for 1 hour')

