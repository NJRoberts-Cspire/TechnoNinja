/*
### Fire Shield

_4th-level evocation_

**Casting Time**: 1 action

**Range**: Self

**Components**: V, S, M (a bit of phosphorus or a firefly)

**Duration**: 10 minutes

Thin and wispy flames wreathe your body for the duration, shedding bright light in a 10-foot radius and dim light for an additional 10 feet. You can end the spell early by using an action to dismiss it. The flames provide you with a warm shield or a chill shield, as you choose. The warm shield grants you resistance to cold damage, and the chill shield grants you resistance to fire damage. In addition, whenever a creature within 5 feet of you hits you with a melee attack, the shield erupts with flame. The attacker takes 2d8 fire damage from a warm shield, or 2d8 cold damage from a cold shield. 7th-level evocation Casting Time: 1 action Range: 150 feet Components: V, S Duration: Instantaneous A storm made up of sheets of roaring flame appears in a location you choose within range. The area of the storm consists of up to ten 10-foot cubes, which you can arrange as you wish. Each cube must have at least one face adjacent to the face of another cube. Each creature in the area must make a Dexterity saving throw. It takes 7d10 fire damage on a failed save, or half as much damage on a successful one. The fire damages objects in the area and ignites flammable objects that aren’t being worn or carried. If you choose, plant life in the area is unaffected by this spell.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 4, 'Fire Shield')
    if slot_level == -1:
        return
    name = Owner.name
    log('{{name}} is surrounded by a warm or chill shield for 10 minutes; any creature hitting Owner with a melee attack takes 2d8 fire (warm) or cold (chill) damage')

