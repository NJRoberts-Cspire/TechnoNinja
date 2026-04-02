// Global script: tesshari_card_core
// Mark this script as Global in Quest Bound.

attr(name):
    return Owner.Attribute(name)

getAttrText(name, fallback):
    a = Owner.Attribute(name)
    if !a:
        return fallback
    v = a.value
    if v == null:
        return fallback
    return text(v)

getAttrNumber(name, fallback):
    a = Owner.Attribute(name)
    if !a:
        return fallback
    v = a.value
    if v == null:
        return fallback
    return number(v)

setAttr(name, value):
    a = Owner.Attribute(name)
    if a:
        a.set(value)

splitPipe(value):
    s = text(value)
    if s == '':
        return []
    return s.split('|')

joinPipe(list):
    if list.count() == 0:
        return ''
    out = ''
    first = true
    for item in list:
        if first:
            out = text(item)
            first = false
        else:
            out = '{{out}}|{{item}}'
    return out

containsValue(list, value):
    for item in list:
        if text(item) == text(value):
            return true
    return false

addUnique(list, value):
    if !containsValue(list, value):
        list.push(value)
    return list

removeValue(list, value):
    out = []
    for item in list:
        if text(item) != text(value):
            out.push(item)
    return out

beginTurn():
    apMax = getAttrNumber('AP Max', 0)
    setAttr('AP Current', apMax)
    setAttr('Basic Attack Used This Turn', false)
    setAttr('Cards Played This Turn', '')
    setAttr('Card Play Locked', false)

endTurnLock():
    setAttr('Card Play Locked', true)

getPlayedCards():
    raw = getAttrText('Cards Played This Turn', '')
    return splitPipe(raw)

savePlayedCards(cards):
    setAttr('Cards Played This Turn', joinPipe(cards))

markCardPlayed(actionKey, isBasicAttack):
    cards = getPlayedCards()
    cards = addUnique(cards, actionKey)
    savePlayedCards(cards)
    if isBasicAttack:
        setAttr('Basic Attack Used This Turn', true)

hasCardPlayed(actionKey):
    cards = getPlayedCards()
    return containsValue(cards, actionKey)

validateCardPlay(actionKey, apCost, isBasicAttack):
    locked = getAttrText('Card Play Locked', 'false')
    if text(locked) == 'true':
        return 'Card play is locked outside active turn.'

    if hasCardPlayed(actionKey):
        return 'Card already played this turn: {{actionKey}}'

    if isBasicAttack:
        used = getAttrText('Basic Attack Used This Turn', 'false')
        if text(used) == 'true':
            return 'Basic attack can only be used once per turn.'
    else:
        apCurrent = getAttrNumber('AP Current', 0)
        if apCurrent < apCost:
            return 'Not enough AP. Need {{apCost}}, have {{apCurrent}}.'

    return ''

applyCardCost(apCost, isBasicAttack):
    if isBasicAttack:
        return
    apCurrent = getAttrNumber('AP Current', 0)
    newAp = apCurrent - apCost
    if newAp < 0:
        newAp = 0
    setAttr('AP Current', newAp)

runCard(actionKey, apCost, isBasicAttack):
    err = validateCardPlay(actionKey, apCost, isBasicAttack)
    if err != '':
        announce(err)
        return false

    applyCardCost(apCost, isBasicAttack)
    markCardPlayed(actionKey, isBasicAttack)
    return true

// Status helpers
statusList():
    return splitPipe(getAttrText('Active Status List', ''))

setStatusList(list):
    setAttr('Active Status List', joinPipe(list))

getMapValue(raw, key, fallback):
    pairs = splitPipe(raw)
    for p in pairs:
        kv = text(p).split(':')
        if kv.count() >= 2:
            if text(kv[0]) == text(key):
                return number(kv[1])
    return fallback

setMapValue(raw, key, value):
    pairs = splitPipe(raw)
    out = []
    found = false
    for p in pairs:
        kv = text(p).split(':')
        if kv.count() >= 2 && text(kv[0]) == text(key):
            found = true
            if number(value) > 0:
                out.push('{{key}}:{{value}}')
        else:
            out.push(p)

    if !found && number(value) > 0:
        out.push('{{key}}:{{value}}')

    return joinPipe(out)

getStatusStacks(statusId):
    raw = getAttrText('Status Stacks Map', '')
    return getMapValue(raw, statusId, 0)

setStatusStacks(statusId, value):
    raw = getAttrText('Status Stacks Map', '')
    updated = setMapValue(raw, statusId, value)
    setAttr('Status Stacks Map', updated)

getStatusDuration(statusId):
    raw = getAttrText('Status Duration Map', '')
    return getMapValue(raw, statusId, 0)

setStatusDuration(statusId, value):
    raw = getAttrText('Status Duration Map', '')
    updated = setMapValue(raw, statusId, value)
    setAttr('Status Duration Map', updated)

addStatus(statusId, stacksToAdd, duration):
    curStacks = getStatusStacks(statusId)
    newStacks = curStacks + stacksToAdd
    if newStacks < 0:
        newStacks = 0

    curDur = getStatusDuration(statusId)
    if duration > curDur:
        setStatusDuration(statusId, duration)

    list = statusList()
    if newStacks > 0:
        list = addUnique(list, statusId)
    else:
        list = removeValue(list, statusId)

    setStatusStacks(statusId, newStacks)
    setStatusList(list)

removeStatus(statusId):
    setStatusStacks(statusId, 0)
    setStatusDuration(statusId, 0)
    list = removeValue(statusList(), statusId)
    setStatusList(list)
