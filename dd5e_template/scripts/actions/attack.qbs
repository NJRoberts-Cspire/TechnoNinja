/*
Attack with a weapon or an Unarmed Strike.
*/

on_activate():
    results = attack(Owner, 'Strength', false)
    hits = results[0]
    name = Owner.name

    for targ in hits:
        targ_name = targ.name
        log('{{name}} hits {{targ_name}}')
