/*
Double your current movement speed.
*/

on_activate():
    name = Owner.name
    log('{{name}} uses Dash, doubling their movement speed this turn.')
    speed = getAttr('Speed')
    Owner.Attribute('Speed').set(speed * 2)
    Owner.atEndOfNextTurn():
        speed = getAttr('Speed')
        Owner.Attribute('Speed').set(speed / 2)

