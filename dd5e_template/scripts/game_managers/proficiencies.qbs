subscribe('Class')

class = getAttr('Class')
chart = getChart('Class by Ability Proficiency')

abilities = chart.columnWhere('Proficiency')

for ability in abilities:
    prof_attr = Owner.Attribute('{{ability}} Save Proficiency')
    row_data = chart.rowWhere('Proficiency', ability)
    is_prof = false
    for value in row_data:
        if class == value:
            is_prof = true
    prof_attr.set(is_prof)
    