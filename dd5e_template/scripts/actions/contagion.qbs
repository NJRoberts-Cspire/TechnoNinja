/*
### Contagion

_5th-level necromancy_

**Casting Time**: 1 action

**Range**: Touch 

**Component**: V, S 

**Duration**: 7 days 

Your touch inflicts disease. Make a melee spell attack against a creature within your reach. On a hit, you afflict the creature with a disease of your choice from any of the ones described below. At the end of each of the target’s turns, it must make a Constitution saving throw. After failing three of these saving throws, the disease’s effects last for the duration, and the creature stops making these saves. After succeeding on three of these saving throws, the creature recovers from the disease, and the spell ends. Since this spell induces a natural disease in its target, any effect that removes a disease or otherwise ameliorates a disease’s effects apply to it. Blinding Sickness. Pain grips the creature’s mind, and its eyes turn milky white. The creature has disadvantage on Wisdom checks and Wisdom saving throws and is blinded. Filth Fever. A raging fever sweeps through the creature’s body. The creature has disadvantage on Strength checks, Strength saving throws, and attack rolls that use Strength. Flesh Rot. The creature’s flesh decays. The creature has disadvantage on Charisma checks and vulnerability to all damage. Mindfire. The creature’s mind becomes feverish. The creature has disadvantage on Intelligence checks and Intelligence saving throws, and the 129 creature behaves as if under the effects of the confusion spell during combat. Seizure. The creature is overcome with shaking. The creature has disadvantage on Dexterity checks, Dexterity saving throws, and attack rolls that use Dexterity. Slimy Doom. The creature begins to bleed uncontrollably. The creature has disadvantage on Constitution checks and Constitution saving throws. In addition, whenever the creature takes damage, it is stunned until the end of its next turn.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 5, 'Contagion')
    if slot_level == -1:
        return

    if !Scene:
        hit = resolve_spell_attack_manually(Owner)
        if hit:
            log('Contagion hits target, afflicting it with a disease')
        else:
            log('Contagion misses target')
        return

    targets = selectCharacters()

    for targ in targets:
        hit = spell_attack(Owner, target)
        if hit:
            name = targ.name
            log('Contagion hits {{name}}; target is afflicted with a disease')
            disease = prompt('Choose a disease for {{name}}', ['Blinding Sickness', 'Filth Fever', 'Flesh Rot', 'Mindfire', 'Seizure', 'Slimy Doom'])
            log('{{name}} is afflicted with {{disease}} (requires 3 failed Constitution saves to take full effect)')
        else:
            name = targ.name
            log('Contagion misses {{name}}')

