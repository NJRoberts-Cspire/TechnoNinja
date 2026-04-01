// Attach this to any card action and customize actionKey/apCost/isBasicAttack.

on_activate(Target):
  ok = runCard('REPLACE_ACTION_KEY', REPLACE_AP_COST, REPLACE_IS_BASIC)
  if !ok:
    return

  // TODO: Card-specific deterministic effect logic here.
  // Example damage application:
  // dmg = 2
  // if Target:
  //   Target.Attribute('Current HP').subtract(dmg)
  //   announce('{{Self.title}} deals {{dmg}} to {{Target.title}}.')

  return
