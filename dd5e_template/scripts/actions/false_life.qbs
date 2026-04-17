/*
### False Life

_1st-level necromancy_

**Casting Time**: 1 action

**Range**: Self

**Components**: V, S, M (a small amount of alcohol or distilled spirits)

**Duration**: 1 hour

Bolstering yourself with a necromantic facsimile of life, you gain 1d4 + 4 temporary hit points for the duration. 

At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, you gain 5 additional temporary hit points for each slot level above 1st.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 1, 'False Life')
    if slot_level == -1:
        return
    base_roll = roll_damage(Owner, '1d4')
    temp_hp = base_roll + 4 + (slot_level - 1) * 5
    Owner.Attribute('Temporary Hit Points').set(temp_hp)
    name = Owner.name
    log('{{name}} gains {{temp_hp}} temporary hit points from False Life')

