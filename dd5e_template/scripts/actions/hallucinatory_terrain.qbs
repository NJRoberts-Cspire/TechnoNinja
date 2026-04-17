/*
### Hallucinatory Terrain

_4th-level illusion_

**Casting Time**: 10 minutes

**Range**: 300 feet

**Components**: V, S, M (a stone, a twig, and a bit of green plant)

**Duration**: 24 hours

You make natural terrain in a 150-foot cube in range look, sound, and smell like some other sort of natural terrain. Thus, open fields or a road can be made to resemble a swamp, hill, crevasse, or some other 152 difficult or impassable terrain. A pond can be made to seem like a grassy meadow, a precipice like a gentle slope, or a rock-strewn gully like a wide and smooth road. Manufactured structures, equipment, and creatures within the area aren’t changed in appearance. The tactile characteristics of the terrain are unchanged, so creatures entering the area are likely to see through the illusion. If the difference isn’t obvious by touch, a creature carefully examining the illusion can attempt an Intelligence (Investigation) check against your spell save DC to disbelieve it. A creature who discerns the illusion for what it is, sees it as a vague image superimposed on the terrain.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 4, 'Hallucinatory Terrain')
    if slot_level == -1:
        return
    name = Owner.name
    log('{{name}} makes natural terrain in a 150-foot cube look, sound, and smell like a different kind of natural terrain for 24 hours')

    
