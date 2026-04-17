/*
### Raise Dead

_5th-level necromancy_

**Casting Time**: 1 hour

**Range**: Touch

**Components**: V, S, M (a diamond worth at least 500 gp, which the spell consumes)

**Duration**: Instantaneous

You return a dead creature you touch to life, provided that it has been dead no longer than 10 days. If the creature’s soul is both willing and at liberty to rejoin the body, the creature returns to life with 1 hit point. This spell also neutralizes any poisons and cures nonmagical diseases that affected the creature at the time it died. This spell doesn’t, however, remove magical diseases, curses, or similar effects; if these aren’t first removed prior to casting the spell, they take effect when the creature returns to life. The spell can’t return an undead creature to life. This spell closes all mortal wounds, but it doesn’t restore missing body parts. If the creature is lacking body parts or organs integral for its survival—its head, for instance—the spell automatically fails. Coming back from the dead is an ordeal. The target takes a −4 penalty to all attack rolls, saving throws, and ability checks. Every time the target finishes a long rest, the penalty is reduced by 1 until it disappears. 2nd-level necromancy Casting Time: 1 action Range: 60 feet Components: V, S Duration: Concentration, up to 1 minute A black beam of enervating energy springs from your finger toward a creature within range. Make a ranged spell attack against the target. On a hit, the target deals only half damage with weapon attacks that use Strength until the spell ends. At the end of each of the target’s turns, it can make a Constitution saving throw against the spell. On a success, the spell ends.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 5, 'Raise Dead')
    if slot_level == -1:
        return
    if !Scene:
        prompt('Raise Dead: select targets in an active scene to resolve this spell.', ['Ok'])
        return

    targ = selectCharacter()
    heal_hp(targ, 1)
    name = targ.name
    log('{{name}} is returned to life with 1 HP')

