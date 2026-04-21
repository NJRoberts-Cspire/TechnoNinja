// Tesshari global helpers — minimal set required by the character loader.
// QBScript has no `null` literal; use `!var` truthy checks.

getAttrText(name, fallback):
    a = Owner.Attribute(name)
    if !a:
        return fallback
    v = a.value
    if !v:
        return fallback
    return text(v)

getAttrNumber(name, fallback):
    a = Owner.Attribute(name)
    if !a:
        return fallback
    v = a.value
    if !v:
        return fallback
    return number(v)

setAttr(name, value):
    a = Owner.Attribute(name)
    if a:
        a.set(value)
