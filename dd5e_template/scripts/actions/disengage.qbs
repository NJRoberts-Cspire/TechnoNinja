/*
Your movement doesn't provoke attacks of opportunity for the rest of this turn.
*/

on_activate():
    name = Owner.name
    log('{{name}} uses Disengage. Their movement does not provoke opportunity attacks this turn.')

