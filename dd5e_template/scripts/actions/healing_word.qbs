/*
### Healing Word

_1st-level evocation_

**Casting Time**: 1 bonus action

**Range**: 60 feet

**Components**: V

**Duration**: Instantaneous

A creature of your choice that you can see within range regains hit points equal to 1d4 + your spellcasting ability modifier. This spell has no effect on undead or constructs. 

At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, the healing increases by 1d4 for each slot level above 1st.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 1, 'Healing Word')
    if slot_level == -1:
        return
    heal_dice = slot_level
    spell_mod = Owner.Attribute('Spell Casting Modifier').value
    if !Scene:
        prompt('Healing Word: select targets in an active scene to resolve this spell.', ['Ok'])
        return

    targ = selectCharacter()
    amount = roll_damage(Owner, '{{heal_dice}}d4') + spell_mod
    name = targ.name
    log('Healing Word heals {{name}} for {{amount}} hit points')
    heal_hp(targ, amount)

