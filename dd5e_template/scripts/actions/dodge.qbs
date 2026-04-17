/*
Until the start of your next turn, attack rolls against you have Disadvantage, and you make Dexterity saving throws with Advantage. You lose this benefit if you have the Incapacitated condition or if your speed is 0.
*/

on_activate():
    name = Owner.name
    log('{{name}} uses Dodge. Attack rolls against them have disadvantage, and they have advantage on Dexterity saving throws until the start of their next turn.')

