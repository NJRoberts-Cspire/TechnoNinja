on_activate():
    name = Owner.name
    charges = getAttr('Short Rest Charges')
    if charges < 1:
        log('No short rest charges available')
        return
    Owner.Attribute('Short Rest Charges').subtract(1)
    announce('Short Rest taken.')
    log('{{name}} takes a short rest.')
    class = getAttr('Class')
    if class == 'Warlock':
        for i in 9:
            level = i + 1
            Owner.Attribute('Level {{level}} Spell Slots').max()
