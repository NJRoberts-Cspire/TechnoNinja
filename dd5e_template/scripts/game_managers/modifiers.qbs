subscribe('Strength', 'Dexterity', 'Constitution', 'Intelligence', 'Wisdom', 'Charisma')

str = getAttr('Strength')
dex = getAttr('Dexterity')
con = getAttr('Constitution')
int = getAttr('Intelligence')
wis = getAttr('Wisdom')
cha = getAttr('Charisma')

calculate_ability_score_modifier(score):
    return floor((score - 10) / 2)

Owner.Attribute('Strength Modifier').set(calculate_ability_score_modifier(str))
Owner.Attribute('Dexterity Modifier').set(calculate_ability_score_modifier(dex))
Owner.Attribute('Constitution Modifier').set(calculate_ability_score_modifier(con))
Owner.Attribute('Intelligence Modifier').set(calculate_ability_score_modifier(int))
Owner.Attribute('Wisdom Modifier').set(calculate_ability_score_modifier(wis))
Owner.Attribute('Charisma Modifier').set(calculate_ability_score_modifier(cha))



