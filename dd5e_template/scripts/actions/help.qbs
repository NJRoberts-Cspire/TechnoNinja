/*
Help another creature's ability check or attack roll, or administer first aid.
*/

on_activate():
    name = Owner.name
    log('{{name}} uses Help. An ally gains advantage on their next ability check or attack roll.')
