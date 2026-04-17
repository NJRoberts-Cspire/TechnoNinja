
init_monster(character):
    variant = character.variant
    chart_data = getChart('Monster Manual').rowWhere('Name', variant)
    if !chart_data:
        return

    lookupAndSet(attr_name):
        data = chart_data.valueInColumn(attr_name)
        attr = character.Attribute(attr_name)
        if !attr || !data:
            return
        attr.set(data)

    lookupAndSet('Strength')
    lookupAndSet('Dexterity')
    lookupAndSet('Constitution')
    lookupAndSet('Wisdom')
    lookupAndSet('Charisma')
    lookupAndSet('Description')
    lookupAndSet('Type')
    
    immunities = chart_data.valueInColumn('Immunities')
    resistances = chart_data.valueInColumn('Resistances')
    hp_dice = chart_data.valueInColumn('Hit Dice')
    image = chart_data.valueInColumn('Image')
    hp = rollQuiet(hp_dice)

    set(attr_name, val):
        attr = character.Attribute(attr_name)
        if !attr:
            return
        attr.set(val)
        
    set('Hit Points', hp)

    for immunity in immunities.split(','):
        set('{{immunity}} Immunity', true)

    for resistance in resistances.split(','):
        set('{{immunity}} Resistance', true)

    if image:
        character.setImage(image)

if Owner.hasArchetype('Monster') && Owner.variant:
    init_monster(Owner)
else if Owner.archetypes[0]:
    Owner.Attribute('Class').set(Owner.archetypes[0])
    
