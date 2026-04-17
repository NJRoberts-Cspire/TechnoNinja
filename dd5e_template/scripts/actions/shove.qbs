/*
Use an attack action to make a special melee attack to shove a creature, either to knock it prone or push it away from you.
*/

on_activate():
    results = attack(Owner, 'Strength', false)
    hits = results[0]
    misses = results[1]
    name = Owner.name

    for targ in hits:
        targ_name = targ.name
        log('{{name}} shoves {{targ_name}} successfully.')

    for targ in misses:
        targ_name = targ.name
        log('{{name}} fails to shove {{targ_name}}.')
