/*
### Inflict Wounds

_1st-level necromancy_

**Casting Time**: 1 action

**Range**: Touch

**Components**: V, S

**Duration**: Instantaneous

Make a melee spell attack against a creature you can reach. On a hit, the target takes 3d10 necrotic damage. 

At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, the damage increases by 1d10 for each slot level above 1st.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 1, 'Inflict Wounds')
    if slot_level == -1:
        return
    total_dice = 3 + (slot_level - 1)
    if !Scene:
        resolve_spell_attack_manually(Owner, '{{total_dice}}d10')
        return

    results = spell_attack(Owner, false)
    hits = results[0]
    for targ in hits:
        damage = roll_damage(Owner, '{{total_dice}}d10', targ, 'Necrotic')
        name = targ.name
        log('Inflict Wounds hits {{name}} for {{damage}} necrotic damage')
        apply_damage(targ, damage)

