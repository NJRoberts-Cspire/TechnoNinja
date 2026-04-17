/*
### Stone Shape

_4th-level transmutation_

**Casting Time**: 1 action

**Range**: Touch

**Components**: V, S, M (soft clay, which must be worked into roughly the desired shape of the stone object)

**Duration**: Instantaneous

You touch a stone object of Medium size or smaller or a section of stone no more than 5 feet in any dimension and form it into any shape that suits your purpose. So, for example, you could shape a large rock into a weapon, idol, or coffer, or make a small passage through a wall, as long as the wall is less than 5 feet thick. You could also shape a stone door or its frame to seal the door shut. The object you create can have up to two hinges and a latch, but finer mechanical detail isn’t possible.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 4, 'Stone Shape')
    if slot_level == -1:
        return
    name = Owner.name
    log('{{name}} reshapes a Medium or smaller piece of stone into any form; can create crude functional objects or passage through walls')

    
