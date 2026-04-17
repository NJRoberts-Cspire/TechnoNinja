/*
### Bane

_1st-level enchantment_

**Casting Time**: 1 action

**Range**: 30 feet

**Components**: V, S, M (a drop of blood)

**Duration**: Concentration, up to 1 minute

Up to three creatures of your choice that you can see within range must make Charisma saving throws. Whenever a target that fails this saving throw makes an attack roll or a saving throw before the spell ends, the target must roll a d4 and subtract the number rolled from the attack roll or saving throw. 

At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, you can target one additional creature for each slot level above 1st.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 1, 'Bane')
    if slot_level == -1:
        return
    max_targets = 3 + (slot_level - 1)

    if !Scene:
        options = []
        for i in max_targets:
            opt = i + 1
            options.push('{{opt}}')
        ans = number(prompt('How many targets?', options))
        for i in ans:
            pos = i + 1
            succeeds = resolve_spell_save_manually(Owner, 'Charisma')
            if succeeds:
                log('Target {{pos}} fails Charisma save and is Baned')
            else:
                log('Target {{pos}} succeeds Charisma save and resists Bane')
        return
    
    announce('Bane: select up to {{max_targets}} targets')
    targets = selectCharacters()
    results = saving_throw(Owner, targets, 'Charisma')
    failures = results[1]
    for targ in results[0]:
        name = targ.name
        log('{{name}} succeeds saving throw against Bane')
    for targ in failures:
        name = targ.name
        targ.Attribute('Baned').set(true)
        log('{{name}} suffers -1d4 to attack rolls and saving throws from Bane')
    set_concentration(Owner, 'Bane')

