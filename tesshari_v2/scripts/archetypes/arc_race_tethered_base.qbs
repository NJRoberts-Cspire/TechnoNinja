on_add():
  setAttr('Species', 'Tethered')
  setAttr('Augmentation Count', 0)
  setAttr('Echomind Undivided', true)
  setAttr('Biological Acuity', true)
  setAttr('Old Flesh Memory', true)
  setAttr('Unclocked', true)
  Owner.setProperty('race_tag', 'tethered')
  announce('Tethered race initialized. Augmentation slots locked at 0.')
  return
