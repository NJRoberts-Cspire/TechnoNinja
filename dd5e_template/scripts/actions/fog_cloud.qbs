/*
### Fog Cloud

_1st-level conjuration_

**Casting Time**: 1 action

**Range**: 120 feet

**Components**: V, S

**Duration**: Concentration, up to 1 hour

You create a 20-foot-radius sphere of fog centered on a point within range. The sphere spreads around corners, and its area is heavily obscured. It lasts for the duration or until a wind of moderate or greater speed (at least 10 miles per hour) disperses it. 

At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, the radius of the fog increases by 20 feet for each slot level above 1st.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 1, 'Fog Cloud')
    if slot_level == -1:
        return
    set_concentration(Owner, 'Fog Cloud')
    name = Owner.name
    log('{{name}} casts Fog Cloud')
