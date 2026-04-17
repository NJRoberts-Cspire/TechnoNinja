/*
### Animal Friendship

_1st-level enchantment_

**Casting Time**: 1 action

**Range**: 30 feet

**Components**: V, S, M (a morsel of food)

**Duration**: 24 hours

This spell lets you convince a beast that you mean it no harm. Choose a beast that you can see within range. It must see and hear you. If the beast's Intelligence is 4 or higher, the spell fails. Otherwise, the beast must succeed on a Wisdom saving throw or be charmed by you for the spell's duration. If you or one of your companions harms the target, the spells ends. 

At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, you can affect one additional beast per level above 1st.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 1, 'Animal Friendship')
    if slot_level == -1:
        return

    if !Scene:
        ans = promptInput("Enter target's Intelligence score")
        if number(ans) >= 4:
            log('Target is too intelligence to be charmed')
            return
        succeeds = resolve_spell_save_manually(Owner, 'Wisdom')
        if succeeds:
            log('Target has been charmed by Animal Friendship')
        else:
            log('Target resists being charmed by Animal Friendship')
        return
        
    targ = selectCharacter()

    if targ.Attribute('Intelligence').value >= 4:
        name = targ.name
        log("{{name}}'s Intelligence is too high to be charmed")
        return
    
    results = saving_throw(Owner, [targ], 'Wisdom')
    successes = results[0]
    failures = results[1]
    for targ in failures:
        name = targ.name
        set_condition(targ, 'Charmed', true)
        log('{{name}} is charmed by Animal Friendship')
    for targ in successes:
        name = targ.name
        log('{{name}} resisted Animal Friendship')
    
