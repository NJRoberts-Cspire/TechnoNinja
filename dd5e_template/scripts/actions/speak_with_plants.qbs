/*
### Speak with Plants

_3rd-level transmutation_

**Casting Time**: 1 action

**Range**: Self (30-foot radius)

**Components**: V, S

**Duration**: 10 minutes

You imbue plants within 30 feet of you with limited sentience and animation, giving them the ability to communicate with you and follow your simple commands. You can question plants about events in the spell’s area within the past day, gaining information about creatures that have passed, weather, and other circumstances. You can also turn difficult terrain caused by plant growth (such as thickets and undergrowth) into ordinary terrain that lasts for the duration. Or you can turn ordinary terrain where plants are present into difficult terrain that lasts for the duration, causing vines and branches to hinder pursuers, for example. Plants might be able to perform other tasks on your behalf, at the GM’s discretion. The spell doesn’t enable plants to uproot themselves and move about, but they can freely move branches, tendrils, and stalks. If a plant creature is in the area, you can communicate with it as if you shared a common language, but you gain no magical ability to influence it. This spell can cause the plants created by the entangle spell to release a restrained creature. 2nd-level transmutation Casting Time: 1 action Range: Touch Components: V, S, M (a drop of bitumen and a spider) Duration: Concentration, up to 1 hour Until the spell ends, one willing creature you touch gains the ability to move up, down, and across vertical surfaces and upside down along ceilings, while leaving its hands free. The target also gains a climbing speed equal to its walking speed.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 3, 'Speak with Plants')
    if slot_level == -1:
        return
    name = Owner.name
    log('{{name}} can communicate with plants within 30 feet for 10 minutes; plants can share information about recent events and follow simple commands')

    
