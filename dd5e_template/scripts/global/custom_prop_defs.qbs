// Advantage
PROPERTY_ADVANTAGES = 'advantage'
/*
[
  {
    source: 'Inspired',
    applies_to: '', // name of specific character or attribute name against which advantage applies
    uses: 1,
  }
]
*/

// Disadvantage
PROPERTY_DISADVANTAGES = 'disadvantage'
/*
[
  {
    source: 'Inspired',
    applies_to: '',
    uses: 1,
  }
]
*/

// Extra Attack Dice
PROPERTY_EXTRA_ATTACK_DICE = 'attack_extra_dice'
/* 
Added by conditions like Blessed
[
  {
    dice: '1d4',
    source: 'Blessed',
    uses: -1, // indicated continuous uses
    applies_to: '',
  }
]
*/

// Extra Ability Dice
PROPERTY_EXTRA_ABILITY_DICE = 'ability_extra_dice'
/* 
Added by conditions like Guidance
[
  {
    dice: '1d4',
    source: 'Guidance',
    uses: -1, // indicated continuous uses
    applies_to: '',
  }
]
*/

// Extra Damage Dice
PROPERTY_EXTRA_DAMAGE_DICE = 'damage_extra_dice'
/* 
Added by conditions like Guidance
[
  {
    dice: '1d4',
    source: 'Haste',
    uses: 1,
    applies_to: '',
  }
]
*/