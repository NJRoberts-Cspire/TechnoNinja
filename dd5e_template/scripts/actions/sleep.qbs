/*
### Sleep

_1st-level enchantment_

**Casting Time**: 1 action

**Range**: 90 feet

**Components**: V, S, M (a pinch of fine sand, rose petals, or a cricket)

**Duration**: 1 minute

This spell sends creatures into a magical slumber. Roll 5d8; the total is how many hit points of creatures this spell can affect. Creatures within 20 feet of a point you choose within range are affected in ascending order of their current hit points (ignoring unconscious creatures). Starting with the creature that has the lowest current hit points, each creature affected by this spell falls unconscious until the spell ends, the sleeper takes damage, or someone uses an action to shake or slap the sleeper awake. Subtract each creature’s hit points from the total before moving on to the creature with the next lowest hit points. A creature’s hit points must be equal to or less than the remaining total for that creature to be affected. Undead and creatures immune to being charmed aren’t affected by this spell. 

At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, roll an additional 2d8 for each slot level above 1st.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 1, 'Sleep')
    if slot_level == -1:
        return
    num_dice = 5 + 2 * (slot_level - 1)
    hp_pool = roll_damage(Owner, '{{num_dice}}d8')
    caster_name = Owner.name
    announce('Sleep: HP pool is {{hp_pool}}. Select targets to fall unconscious (in ascending HP order, up to {{hp_pool}} combined HP).')
    if !Scene:
        prompt('Sleep: select targets in an active scene to resolve this spell.', ['Ok'])
        return

    targets = selectCharacters()
    for targ in targets:
        name = targ.name
        set_condition(targ, 'Unconscious', true)
        log('{{name}} falls unconscious from Sleep')

