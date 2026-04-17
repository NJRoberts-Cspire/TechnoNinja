/*
### Zone of Truth

_2nd-level enchantment_

**Casting Time**: 1 action

**Range**: 60 feet

**Components**: V, S

**Duration**: 10 minutes

You create a magical zone that guards against deception in a 15-foot-radius sphere centered on a point of your choice within range. Until the spell ends, a creature that enters the spell’s area for the first time on a turn or starts its turn there must make a Charisma saving throw. On a failed save, a creature can’t speak a deliberate lie while in the radius. You know whether each creature succeeds or fails on its saving throw. An affected creature is aware of the spell and can thus avoid answering questions to which it would normally respond with a lie. Such a creature can be evasive in its answers as long as it remains within the boundaries of the truth. Traps can be found almost anywhere. One wrong step in an ancient tomb might trigger a series of scything blades, which cleave through armor and bone. The seemingly innocuous vines that hang over a cave entrance might grasp and choke anyone who pushes through them. A net hidden among the trees might drop on travelers who pass underneath. In a fantasy game, unwary adventurers can fall to their deaths, be burned alive, or fall under a fusillade of poisoned darts. A trap can be either mechanical or magical in nature. Mechanical traps include pits, arrow traps, falling blocks, water-filled rooms, whirling blades, and anything else that depends on a mechanism to operate. Magic traps are either magical device traps or spell traps. Magical device traps initiate spell effects when activated. Spell traps are spells such as glyph of warding and symbol that function as traps. When adventurers come across a trap, you need to know how the trap is triggered and what it does, as well as the possibility for the characters to detect the trap and to disable or avoid it.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 2, 'Zone of Truth')
    if slot_level == -1:
        return
    if !Scene:
        failed = resolve_spell_save_manually(Owner, 'Charisma')
        if !failed:
            log('Target fails Zone of Truth Charisma save')
        else:
            log('Target succeeds Zone of Truth Charisma save')
        return

    targets = selectCharacters()
    results = saving_throw(Owner, targets, 'Charisma')
    failures = results[1]
    for targ in failures:
        name = targ.name
        log('{{name}} cannot speak deliberate lies while in the Zone of Truth')

