/*
You have a limited well of physical and mental stamina that you can draw on. As a Bonus Action, you can use it to regain Hit Points equal to 1d10 plus your Fighter level.

You can use this feature twice. You regain one expended use when you finish a Short Rest, and you regain all expended uses when you finish a Long Rest.
*/

on_activate():
    level = get_level(Owner)
    healing = roll_damage(Owner, '1d10') + level
    heal_hp(Owner, healing)
    name = Owner.name
    log('{{name}} uses Second Wind and regains {{healing}} hit points.')

