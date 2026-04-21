// Tesshari character loader — runs on character load / sheet-open.
// Follows the 5e pattern: no per-class init, no level-gating.
// Players manage class features (attributes) themselves.

init_monster(character):
    variant = character.variant
    if !variant:
        return
    announce('Monster variant: ' + variant)

if Owner.hasArchetype('Monster'):
    init_monster(Owner)
