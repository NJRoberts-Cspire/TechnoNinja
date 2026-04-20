// Tesshari global helpers — minimal set required by the character loader.

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
