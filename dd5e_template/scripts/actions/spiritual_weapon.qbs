/*
### Spiritual Weapon

_2nd-level evocation_

**Casting Time**: 1 bonus action

**Range**: 60 feet

**Components**: V, S

**Duration**: 1 minute

You create a floating, spectral weapon within range that lasts for the duration or until you cast this spell again. When you cast the spell, you can make a melee spell attack against a creature within 5 feet of the weapon. On a hit, the target takes force damage equal to 1d8 + your spellcasting ability modifier. As a bonus action on your turn, you can move the weapon up to 20 feet and repeat the attack against a creature within 5 feet of it. The weapon can take whatever form you choose. Clerics of deities who are associated with a particular weapon (as St. Cuthbert is known for his mace and Thor for his hammer) make this spell’s effect resemble that weapon. 

At Higher Levels. When you cast this spell using a spell slot of 3rd level or higher, the damage increases by 1d8 for every two slot levels above 2nd.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 2, 'Spiritual Weapon')
    if slot_level == -1:
        return
    bonus_dice = 1 + floor((slot_level - 2) / 2)
    spell_mod = Owner.Attribute('Spell Casting Modifier').value
    if !Scene:
        resolve_spell_attack_manually(Owner, '{{bonus_dice}}d8')
        return

    results = spell_attack(Owner, false)
    hits = results[0]
    for targ in hits:
        damage = roll_damage(Owner, '{{bonus_dice}}d8', targ, 'Force') + spell_mod
        name = targ.name
        log('Spiritual Weapon hits {{name}} for {{damage}} force damage')
        apply_damage(targ, damage)

    
