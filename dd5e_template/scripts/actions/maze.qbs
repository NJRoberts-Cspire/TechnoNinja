/*
### Maze

_8th-level conjuration_

**Casting Time**: 1 action

**Range**: 60 feet

**Components**: V, S

**Duration**: Concentration, up to 10 minutes

You banish a creature that you can see within range into a labyrinthine demiplane. The target remains there for the duration or until it escapes the maze. The target can use its action to attempt to escape. When it does so, it makes a DC 20 Intelligence check. If it succeeds, it escapes, and the spell ends (a minotaur or goristro demon automatically succeeds). When the spell ends, the target reappears in the space it left or, if that space is occupied, in the nearest unoccupied space.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 8, 'Maze')
    if slot_level == -1:
        return
    set_concentration(Owner, 'Maze')
    if !Scene:
        prompt('Maze: select targets in an active scene to resolve this spell.', ['Ok'])
        return

    targ = selectCharacter()
    name = targ.name
    log('{{name}} is banished to a labyrinthine demiplane; escapes with a DC 20 Intelligence check')

