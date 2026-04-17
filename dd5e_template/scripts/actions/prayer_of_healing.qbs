/*
### Prayer of Healing

_2nd-level evocation_

**Casting Time**: 10 minutes

**Range**: 30 feet

**Components**: V

**Duration**: Instantaneous

Up to six creatures of your choice that you can see within range each regain hit points equal to 2d8 + your spellcasting ability modifier. This spell has no effect on undead or constructs. 

At Higher Levels. When you cast this spell using a spell slot of 3rd level or higher, the healing increases by 1d8 for each slot level above 2nd.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 2, 'Prayer of Healing')
    if slot_level == -1:
        return
    heal_dice = 2 + (slot_level - 2)
    spell_mod = Owner.Attribute('Spell Casting Modifier').value
    if !Scene:
        prompt('Prayer of Healing: select targets in an active scene to resolve this spell.', ['Ok'])
        return

    targets = selectCharacters()
    for targ in targets:
        amount = roll_damage(Owner, '{{heal_dice}}d8') + spell_mod
        name = targ.name
        log('Prayer of Healing heals {{name}} for {{amount}} hit points')
        heal_hp(targ, amount)

