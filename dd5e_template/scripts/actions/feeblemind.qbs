/*
### Feeblemind

_8th-level enchantment_

**Casting Time**: 1 action

**Range**: 150 feet

**Components**: V, S, M (a handful of clay, crystal, glass, or mineral spheres)

**Duration**: Instantaneous

You blast the mind of a creature that you can see within range, attempting to shatter its intellect and personality. The target takes 4d6 psychic damage and must make an Intelligence saving throw. On a failed save, the creature’s Intelligence and Charisma scores become 1. The creature can’t cast spells, activate magic items, understand language, or communicate in any intelligible way. The creature can, however, identify its friends, follow them, and even protect them. At the end of every 30 days, the creature can repeat its saving throw against this spell. If it succeeds on its saving throw, the spell ends. The spell can also be ended by greater restoration, heal, or wish. 1st-level conjuration (ritual) Casting Time: 1 hour Range: 10 feet Components: V, S, M (10 gp worth of charcoal, incense, and herbs that must be consumed by fire in a brass brazier) Duration: Instantaneous You gain the service of a familiar, a spirit that takes an animal form you choose: bat, cat, crab, frog (toad), hawk, lizard, octopus, owl, poisonous snake, fish (quipper), rat, raven, sea horse, spider, or weasel. Appearing in an unoccupied space within range, the familiar has the statistics of the chosen form, though it is a celestial, fey, or fiend (your choice) instead of a beast. Your familiar acts independently of you, but it always obeys your commands. In combat, it rolls its own initiative and acts on its own turn. A familiar can't attack, but it can take other actions as normal. When the familiar drops to 0 hit points, it disappears, leaving behind no physical form. It reappears after you cast this spell again While your familiar is within 100 feet of you, you can communicate with it telepathically. Additionally, as an action, you can see through your familiar's eyes and hear what it hears until the start of your next turn, gaining the benefits of any special senses that the familiar has. During this time, you are deaf and blind with regard to your own senses. As an action, you can temporarily dismiss your familiar. It disappears into a pocket dimension where it awaits your summons. Alternatively, you can dismiss it forever. As an action while it is temporarily dismissed, you can cause it to reappear in any unoccupied space within 30 feet of you. You can't have more than one familiar at a time. If you cast this spell while you already have a familiar, you instead cause it to adopt a new form. Choose one of the forms from the above list. Your familiar transforms into the chosen creature. Finally, when you cast a spell with a range of touch, your familiar can deliver the spell as if it had cast the spell. Your familiar must be within 100 feet of you, and it must use its reaction to deliver the spell when you cast it. If the spell requires an attack roll, you use your attack modifier for the roll.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 8, 'Feeblemind')
    if slot_level == -1:
        return
    if !Scene:
        failed = resolve_spell_save_manually(Owner, 'Intelligence')
        if !failed:
            log('Target fails Feeblemind Intelligence save')
        else:
            log('Target succeeds Feeblemind Intelligence save')
        return

    targ = selectCharacter()
    targets = [targ]
    results = saving_throw(Owner, targets, 'Intelligence')
    successes = results[0]
    failures = results[1]
    for targ in failures:
        damage = roll_damage(Owner, '4d6', targ, 'Psychic')
        set_condition(targ, 'Incapacitated', true)
        name = targ.name
        log('Feeblemind hits {{name}} for {{damage}} psychic damage; Intelligence and Charisma become 1, and target cannot cast spells')
        apply_damage(targ, damage)
    for targ in successes:
        name = targ.name
        log('{{name}} resisted Feeblemind')

    
