/*
### Sending

_3rd-level evocation_

**Casting Time**: 1 action

**Range**: Unlimited

**Components**: V, S, M (a short piece of fine copper wire)

**Duration**: 1 round

You send a short message of twenty-five words or less to a creature with which you are familiar. The creature hears the message in its mind, recognizes you as the sender if it knows you, and can answer in a like manner immediately. The spell enables 177 creatures with Intelligence scores of at least 1 to understand the meaning of your message. You can send the message across any distance and even to other planes of existence, but if the target is on a different plane than you, there is a 5 percent chance that the message doesn’t arrive.
*/

on_activate():
    slot_level = use_spell_slot(Owner, 3, 'Sending')
    if slot_level == -1:
        return
    name = Owner.name
    log('{{name}} casts Sending, delivering a message of up to 25 words to a creature familiar to them regardless of distance')

