/*
### Color Spray

_1st-level illusion_

**Casting Time**: 1 action

**Range**: Self (15-foot cone)

**Components**: V, S, M (a pinch of powder or sand that is colored red, yellow, and blue)

**Duration**: 1 round

A dazzling array of flashing, colored light springs from your hand. Roll 6d10; the total is how many hit points of creatures this spell can effect. Creatures in a 15-foot cone originating from you are affected in ascending order of their current hit points (ignoring unconscious creatures and creatures that can’t see). Starting with the creature that has the lowest current hit points, each creature affected by this spell is blinded until the spell ends. Subtract each creature’s hit points from the total before moving on to the creature with the next lowest hit points. A creature’s hit points must be equal to or less than the remaining total for that creature to be affected. 

At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, roll an additional 2d10 for each slot level above 1st.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 1, 'Color Spray')
    if slot_level == -1:
        return
    num_dice = 6 + 2 * (slot_level - 1)
    hp_pool = roll('{{num_dice}}d10')

    if !Scene:
        prompt('Select targets to blind with combined Hit Points up to {{hp_pool}}.', ['Ok'])
        return
    
    announce('Color Spray: HP pool is {{hp_pool}}. Select targets to be blinded (in ascending HP order, up to {{hp_pool}} combined HP).')
    targets = selectCharacters()

    combined_hp = 0
    for targ in targets:
        combined_hp += targ.Attribute('Hit Points').value

    if combined_hp > hp_pool:
        announce('Combined HP of {{combined_hp}} is over the maximum of {{hp_pool}}')
        return
        
    for targ in targets:
        name = targ.name
        set_condition(targ, 'Blinded', true)
        log('{{name}} is blinded by Color Spray')


