/*
### Bestow Curse

_3rd-level necromancy_

**Casting Time**: 1 action

**Range**: Touch

**Components**: V, S

**Duration**: Concentration, up to 1 minute

You touch a creature, and that creature must succeed on a Wisdom saving throw or become cursed for the duration of the spell. When you cast this spell, choose the nature of the curse from the following options: • Choose one ability score. While cursed, the target has disadvantage on ability checks and saving throws made with that ability score. • While cursed, the target has disadvantage on attack rolls against you. • While cursed, the target must make a Wisdom saving throw at the start of each of its turns. If it fails, it wastes its action that turn doing nothing. • While the target is cursed, your attacks and spells deal an extra 1d8 necrotic damage to the target. A remove curse spell ends this effect. At the GM’s option, you may choose an alternative curse effect, but it should be no more powerful than those described above. The GM has final say on such a curse’s effect. 

At Higher Levels. If you cast this spell using a spell slot of 4th level or higher, the duration is concentration, up to 10 minutes. If you use a spell slot of 5th level or higher, the duration is 8 hours. If you use a spell slot of 7th level or higher, the duration is 24 hours. If you use a 9th level spell slot, the spell lasts until it is dispelled. Using a spell slot of 5th level or higher grants a duration that doesn’t require concentration.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 3, 'Bestow Curse')
    if slot_level == -1:
        return

    if slot_level < 5:
        set_concentration(Owner, 'Bestow Curse')

    if !Scene:
        fails = resolve_spell_save_manually(Owner, 'Wisdom')
        if !fails:
            log('Target resisted Bestow Curse')
            return
        choose_curse = prompt('Choose curse:', ['Disadvantage on ability checks/saves', 'Disadvantage on attack rolls against you', 'Wasted action on Wisdom save failure', '+1d8 necrotic per attack'])
        prompt('Your targets have been cursed with {{choose_curse}}.', ['Ok'])
        return
    
    targ = selectCharacter()
    targets = [targ]
    results = saving_throw(Owner, targets, 'Wisdom')
    successes = results[0]
    failures = results[1]
    for targ in failures:
        choose_curse = prompt(Owner, 'Choose curse:', ['Disadvantage on ability checks/saves', 'Disadvantage on attack rolls against you', 'Wasted action on Wisdom save failure', '+1d8 necrotic per attack'])
        name = targ.name
        log('{{name}} is cursed: {{choose_curse}}')
    for targ in successes:
        name = targ.name
        log('{{name}} resisted Bestow Curse')

