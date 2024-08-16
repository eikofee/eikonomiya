export enum ENumericFieldAttribute {
    ATK,
    DEF,
    HP,
    EM,
    TIME,
    NONE
}

export function stringToENumericFieldAttribute(s: string) {
    switch (s) {
        case "atk":
            return ENumericFieldAttribute.ATK;
        case "def":
            return ENumericFieldAttribute.DEF;
        case "hp":
            return ENumericFieldAttribute.HP;
        case "em":
            return ENumericFieldAttribute.EM;
        case "time":
            return ENumericFieldAttribute.TIME;
        default:
            return ENumericFieldAttribute.NONE
    }
}

export function ENumericFieldAttributeToUnit(e: ENumericFieldAttribute) {
    switch (e) {
        case ENumericFieldAttribute.ATK:return " ATK"
        case ENumericFieldAttribute.DEF:return " DEF"
        case ENumericFieldAttribute.HP:return " Max HP"
        case ENumericFieldAttribute.EM:return " EM"
        case ENumericFieldAttribute.TIME:return "s"
        case ENumericFieldAttribute.NONE:return ""
    }
}