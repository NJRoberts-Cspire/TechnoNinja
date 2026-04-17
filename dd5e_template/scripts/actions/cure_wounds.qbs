/*
### Cure Wounds

_1st-level evocation_

**Casting Time**: 1 action

**Range**: Touch

**Components**: V, S

**Duration**: Instantaneous

A creature you touch regains a number of hit points equal to 1d8 + your spellcasting ability modifier. This spell has no effect on undead or constructs. 

At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, the healing increases by 1d8 for each slot level above 1st.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 1, 'Cure Wounds')
    if slot_level == -1:
        return

    heal_dice = slot_level
    spell_mod = Owner.Attribute('Spell Casting Modifier').value
    amount = Owner.roll('{{heal_dice}}d8') + spell_mod

    if !Scene:
        prompt('Heal a creature you can touch {{amount}} Hit Points.')
        return
        
    targ = selectCharacter()
    name = targ.name
    log('Cure Wounds heals {{name}} for {{amount}} hit points')
    heal_hp(targ, amount)
