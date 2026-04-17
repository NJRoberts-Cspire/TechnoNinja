/*
### Resurrection

_7th-level necromancy_

**Casting Time**: 1 hour

**Range**: Touch

**Components**: V, S, M (a diamond worth at least 1,000 gp, which the spell consumes)

**Duration**: Instantaneous

You touch a dead creature that has been dead for no more than a century, that didn’t die of old age, and that isn’t undead. If its soul is free and willing, the target returns to life with all its hit points. This spell neutralizes any poisons and cures normal diseases afflicting the creature when it died. It doesn’t, however, remove magical diseases, curses, and the like; if such effects aren’t removed prior to casting the spell, they afflict the target on its return to life. This spell closes all mortal wounds and restores any missing body parts. Coming back from the dead is an ordeal. The target takes a −4 penalty to all attack rolls, saving throws, and ability checks. Every time the target finishes a long rest, the penalty is reduced by 1 until it disappears. Casting this spell to restore life to a creature that has been dead for one year or longer taxes you greatly. Until you finish a long rest, you can’t cast spells again, and you have disadvantage on all attack rolls, ability checks, and saving throws.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 7, 'Resurrection')
    if slot_level == -1:
        return
    if !Scene:
        prompt('Resurrection: select targets in an active scene to resolve this spell.', ['Ok'])
        return

    targ = selectCharacter()
    max_hp = targ.Attribute('Hit Point Maximum').value
    heal_hp(targ, max_hp)
    name = targ.name
    log('{{name}} is resurrected at full HP')

