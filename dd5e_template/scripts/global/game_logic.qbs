/*
    Roll a d20 and add your associated ability modifier
    If you're proficient in this skill, add your proficiency bonus
*/
roll_skill_check(skill):
    ability = Ruleset.Chart('Skills to Abilities').rowWhere('Skill', skill).valueInColumn('Ability')
    mod = getAttr('{{ability}} Modifier')
    is_prof = getAttr('{{skill}} Proficiency')
    prof_bonus = getAttr('Proficiency Bonus')

    roll_text = '1d20 + {{mod}}'
    
    if is_prof:
        roll_text = roll_text + ' + {{prof_bonus}}'
    
    result = roll(roll_text)
        
    log('{{skill}} Check: {{result}}')

// Proficiency Bonus by Class & Level
get_prof_bonus_by_class_level(class, level):
    return Ruleset.Chart(class).rowWhere('Level', level).valueInColumn('Proficiency Bonus')