/*
### Prismatic Spray

_7th-level evocation_

**Casting Time**: 1 action

**Range**: Self (60-foot cone)

**Components**: V, S

**Duration**: Instantaneous

Eight multicolored rays of light flash from your hand. Each ray is a different color and has a different power and purpose. Each creature in a 60-foot cone must make a Dexterity saving throw. For each target, roll a d8 to determine which color ray affects it. 1. Red. The target takes 10d6 fire damage on a failed save, or half as much damage on a successful one. 2. Orange. The target takes 10d6 acid damage on a failed save, or half as much damage on a successful one. 3. Yellow. The target takes 10d6 lightning damage on a failed save, or half as much damage on a successful one. 4. Green. The target takes 10d6 poison damage on a failed save, or half as much damage on a successful one. 5. Blue. The target takes 10d6 cold damage on a failed save, or half as much damage on a successful one. 6. Indigo. On a failed save, the target is restrained. It must then make a Constitution saving throw at the end of each of its turns. If it successfully saves three times, the spell ends. If it fails its save three times, it permanently turns to stone and is subjected to the petrified condition. The successes and failures don’t need to be consecutive; keep track of both until the target collects three of a kind. 170 7. Violet. On a failed save, the target is blinded. It must then make a Wisdom saving throw at the start of your next turn. A successful save ends the blindness. If it fails that save, the creature is transported to another plane of existence of the GM’s choosing and is no longer blinded. (Typically, a creature that is on a plane that isn’t its home plane is banished home, while other creatures are usually cast into the Astral or Ethereal planes.) 8. Special. The target is struck by two rays. Roll twice more, rerolling any 8.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 7, 'Prismatic Spray')
    if slot_level == -1:
        return
    if !Scene:
        failed = resolve_spell_save_manually(Owner, 'Dexterity')
        if !failed:
            log('Target fails Prismatic Spray Dexterity save')
        else:
            log('Target succeeds Prismatic Spray Dexterity save')
        return

    targets = selectCharacters()
    results = saving_throw(Owner, targets, 'Dexterity')
    successes = results[0]
    failures = results[1]
    for targ in successes:
        name = targ.name
        log('{{name}} dodged Prismatic Spray')
    for targ in failures:
        ray = roll_damage(Owner, '1d8')
        name = targ.name
        if ray == 1:
            damage = roll_damage(Owner, '10d6', targ, 'Acid')
            log('{{name}} struck by Red ray: {{damage}} fire damage')
            apply_damage(targ, damage)
        else if ray == 2:
            damage = roll_damage(Owner, '10d6', targ, 'Fire')
            log('{{name}} struck by Orange ray: {{damage}} acid damage')
            apply_damage(targ, damage)
        else if ray == 3:
            damage = roll_damage(Owner, '10d6', targ, 'Lightning')
            log('{{name}} struck by Yellow ray: {{damage}} lightning damage')
            apply_damage(targ, damage)
        else if ray == 4:
            damage = roll_damage(Owner, '10d6', targ, 'Poison')
            log('{{name}} struck by Green ray: {{damage}} poison damage')
            apply_damage(targ, damage)
        else if ray == 5:
            damage = roll_damage(Owner, '10d6', targ, 'Cold')
            log('{{name}} struck by Blue ray: {{damage}} cold damage')
            apply_damage(targ, damage)
        else if ray == 6:
            set_condition(targ, 'Restrained', true)
            log('{{name}} struck by Indigo ray: Restrained (Constitution save each turn to end)')
        else if ray == 7:
            set_condition(targ, 'Blinded', true)
            log('{{name}} struck by Violet ray: Blinded (Wisdom save at start of next turn or teleported to another plane)')
        else:
            log('{{name}} struck by two rays; roll twice more for combined effect')

    
