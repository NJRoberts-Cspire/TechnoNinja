/*
### Plant Growth

_3rd-level transmutation_

**Casting Time**: 1 action or 8 hours

**Range**: 150 feet

**Components**: V, S

**Duration**: Instantaneous

This spell channels vitality into plants within a specific area. There are two possible uses for the spell, granting either immediate or long-term benefits. If you cast this spell using 1 action, choose a point within range. All normal plants in a 100-foot radius centered on that point become thick and overgrown. A creature moving through the area must spend 4 feet of movement for every 1 foot it moves. You can exclude one or more areas of any size within the spell’s area from being affected. If you cast this spell over 8 hours, you enrich the land. All plants in a half-mile radius centered on a point within range become enriched for 1 year. The plants yield twice the normal amount of food when harvested.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 3, 'Plant Growth')
    if slot_level == -1:
        return
    name = Owner.name
    log('{{name}} causes plants to grow; as an action, overgrows a 100-foot radius making it difficult terrain, or as an 8-hour ritual, enriches the land for a year')

    
