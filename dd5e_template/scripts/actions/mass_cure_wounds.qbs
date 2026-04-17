/*
### Mass Cure Wounds

_5th-level evocation_

**Casting Time**: 1 action

**Range**: 60 feet

**Components**: V, S

**Duration**: Instantaneous

A wave of healing energy washes out from a point of your choice within range. Choose up to six creatures in a 30-foot-radius sphere centered on that point. Each target regains hit points equal to 3d8 + your spellcasting ability modifier. This spell has no effect on undead or constructs. 

At Higher Levels. When you cast this spell using a spell slot of 6th level or higher, the healing increases by 1d8 for each slot level above 5th. 9th-level evocation Casting Time: 1 action Range: 60 feet Components: V, S Duration: Instantaneous A flood of healing energy flows from you into injured creatures around you. You restore up to 700 hit points, divided as you choose among any number of creatures that you can see within range. Creatures healed by this spell are also cured of all diseases and any effect making them blinded or deafened. This spell has no effect on undead or constructs.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 5, 'Mass Cure Wounds')
    if slot_level == -1:
        return
    heal_dice = 3 + (slot_level - 5)
    spell_mod = Owner.Attribute('Spell Casting Modifier').value
    if !Scene:
        prompt('Mass Cure Wounds: select targets in an active scene to resolve this spell.', ['Ok'])
        return

    targets = selectCharacters()
    for targ in targets:
        amount = roll_damage(Owner, '{{heal_dice}}d8') + spell_mod
        name = targ.name
        log('Mass Cure Wounds heals {{name}} for {{amount}} HP')
        heal_hp(targ, amount)

