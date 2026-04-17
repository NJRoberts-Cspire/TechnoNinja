/*
### Create Food and Water

_3rd-level conjuration_

**Casting Time**: 1 action

**Range**: 30 feet

**Components**: V, S

**Duration**: Instantaneous

You create 45 pounds of food and 30 gallons of water on the ground or in containers within range, enough to sustain up to fifteen humanoids or five steeds for 24 hours. The food is bland but nourishing, and spoils if uneaten after 24 hours. The water is clean and doesn’t go bad. 1st-level transmutation Casting Time: 1 action Range: 30 feet Components: V, S, M (a drop of water if creating water or a few grains of sand if destroying it) Duration: Instantaneous You either create or destroy water. Create Water. You create up to 10 gallons of clean water within range in an open container. Alternatively, the water falls as rain in a 30-foot cube within range, extinguishing exposed flames in the area. Destroy Water. You destroy up to 10 gallons of water in an open container within range. Alternatively, you destroy fog in a 30-foot cube within range. 

At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, you create or destroy 10 additional gallons of water, or the size of the cube increases by 5 feet, for each slot level above 1st.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 3, 'Create Food and Water')
    if slot_level == -1:
        return
    name = Owner.name
    log('{{name}} creates 45 pounds of food and 30 gallons of water, enough to sustain up to 15 humanoids and 5 steeds for 24 hours')

