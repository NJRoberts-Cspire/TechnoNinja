/*
### Mass Healing Word

_3rd-level evocation_

**Casting Time**: 1 bonus action

**Range**: 60 feet

**Components**: V

**Duration**: Instantaneous

As you call out words of restoration, up to six creatures of your choice that you can see within range regain hit points equal to 1d4 + your spellcasting ability modifier. This spell has no effect on undead or constructs. 

At Higher Levels. When you cast this spell using a spell slot of 4th level or higher, the healing increases by 1d4 for each slot level above 3rd.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 3, 'Mass Healing Word')
    if slot_level == -1:
        return
    heal_dice = 1 + (slot_level - 3)
    spell_mod = number(Owner.Attribute('Spell Casting Modifier').value)
    if !Scene:
        prompt('Mass Healing Word: select targets in an active scene to resolve this spell.', ['Ok'])
        return

    targets = selectCharacters()
    for targ in targets:
        amount = roll_damage(Owner, '{{heal_dice}}d4') + spell_mod
        name = targ.name
        log('Mass Healing Word heals {{name}} for {{amount}} hit points')
        heal_hp(targ, amount)

    
