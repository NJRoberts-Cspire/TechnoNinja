monitor_turn_cycles():
    Scene.onTurnAdvance():
        apply_turn_damage(char):
            damage = char.getProperty('turn_cycle_damage')
            damage_source = char.getProperty('turn_cycle_damage_source')
            name = char.name
            if damage:
                log('{{name}} takes {{damage}} damage from {{damage_source}}')
                take_damage(char, damage)
                char.setProperty('turn_cycle_damage', 0)
                char.setProperty('turn_cycle_damage_source', '')

        characters = Scene.characters()

        for char in characters:
            turn_cycle_started = char.getProperty('turn_cycle_started')

            // End of character's turn
            if turn_cycle_started && !char.isActiveTurn:
                apply_turn_damage(char)
                char.setProperty('turn_cycle_started', false)

            // Start of character's turn
            else if !turn_cycle_started && char.isActiveTurn:
                char.setProperty('turn_cycle_started', true)