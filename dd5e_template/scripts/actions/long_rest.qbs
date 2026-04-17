on_activate():
    max_hp = Owner.Attribute('Hit Point Maximum').value
    Owner.Attribute('Hit Points').set(max_hp)
    Owner.Attribute('Short Rest Charges').setToMax()
    name = Owner.name

    for i in 9:
        level = i + 1
        Owner.Attribute('Level {{level}} Spell Slots').setToMax()
    log('{{name}} completes a long rest and restores all hit points and spell slots.')
