/*
### Command

_1st-level enchantment_

**Casting Time**: 1 action

**Range**: 60 feet

**Components**: V

**Duration**: 1 round

You speak a one-word command to a creature you can see within range. The target must succeed on a Wisdom saving throw or follow the command on its next turn. The spell has no effect if the target is undead, if it doesn’t understand your language, or if your command is directly harmful to it. Some typical commands and their effects follow. You might issue a command other than one described here. If you do so, the GM determines how 125 the target behaves. If the target can’t follow your command, the spell ends. Approach. The target moves toward you by the shortest and most direct route, ending its turn if it moves within 5 feet of you. Drop. The target drops whatever it is holding and then ends its turn. Flee. The target spends its turn moving away from you by the fastest available means. Grovel. The target falls prone and then ends its turn. Halt. The target doesn’t move and takes no actions. A flying creature stays aloft, provided that it is able to do so. If it must move to stay aloft, it flies the minimum distance needed to remain in the air. 

At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, you can affect one additional creature for each slot level above 1st. The creatures must be within 30 feet of each other when you target them.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 1, 'Command')
    if slot_level == -1:
        return
    max_targets = slot_level

    if !Scene:
        failed = resolve_spell_save_manually(Owner, 'Wisdom')
        if !failed:
            log('Target resists Command.')
            return
        command_word = prompt('Choose a command word', ['Approach', 'Drop', 'Flee', 'Grovel', 'Halt'])
        log('Target follows the command: {{command_word}}')
        return
    
    announce('Command: select up to {{max_targets}} targets')
    targets = selectCharacters()
    results = saving_throw(Owner, targets, 'Wisdom')
    failures = results[1]
    for targ in failures:
        command_word = prompt('Choose a command word', ['Approach', 'Drop', 'Flee', 'Grovel', 'Halt'])
        name = targ.name
        log('{{name}} follows the command: {{command_word}}')

