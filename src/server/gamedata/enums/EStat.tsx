export enum EStat {
    HP = "hp",
    ATK = "atk",
    DEF = "def",

    HP_P = "hp%",
    ATK_P = "atk%",
    DEF_P = "def%",
    EM = "em",
    ER_P = "er%",
    CR_P = "cr%",
    CDMG_P = "cdmg%",

    PHYS_DMG_P = "phys dmg%",
    ANEMO_DMG_P = "anemo dmg%",
    GEO_DMG_P = "geo dmg%",
    ELECTRO_DMG_P = "electro dmg%",
    DENDRO_DMG_P = "dendro dmg%",
    HYDRO_DMG_P = "hydro dmg%",
    PYRO_DMG_P = "pyro dmg%",
    CRYO_DMG_P = "cryo dmg%",
    HEAL_OUT_P = "heal out%",
    HEAL_IN_P = "heal in%",

    NA_DMG_P = "na dmg%",
    CA_DMG_P = "ca dmg%",
    PA_DMG_P = "pa dmg%",
    NA_DMG = "na dmg",
    CA_DMG = "ca dmg",
    PA_DMG = "pa dmg",
    NA_SPD_P = "na spd%",
    CA_SPD_P = "ca spd%",
    PA_SPD_P = "pa spd%",

    SKILL_DMG_P = "skill dmg%",
    BURST_DMG_P = "burst dmg%",
    SKILL_CR_P = "skill cr%",
    BURST_CR_P = "burst cr%",

    OVERLOAD_DMG_P = "overloaded dmg%",
    BURNING_DMG_P = "burning dmg%",
    VAPORIZE_DMG_P = "vaporize dmg%",
    MELT_DMG_P = "melt dmg%",
    
    MOVE_SPD_P = "mov spd%",
    UNKNOWN = "unknown"

}

export function eStatToReadable (s: EStat) : string {
    switch (s) {
        case EStat.HP: return "HP";
        case EStat.ATK: return "ATK";
        case EStat.DEF: return "DEF";
        case EStat.HP_P: return "HP%";
        case EStat.ATK_P: return "ATK%";
        case EStat.DEF_P: return "DEF%";
        case EStat.EM: return "EM";
        case EStat.ER_P: return "ER%";
        case EStat.CR_P: return "Crit Rate%";
        case EStat.CDMG_P: return "Crit DMG%";
        case EStat.PHYS_DMG_P: return "Phys DMG%";
        case EStat.ANEMO_DMG_P: return "Anemo DMG%";
        case EStat.GEO_DMG_P: return "Geo DMG%";
        case EStat.ELECTRO_DMG_P: return "Electro DMG%";
        case EStat.DENDRO_DMG_P: return "Dendro DMG%";
        case EStat.HYDRO_DMG_P: return "Hydro DMG%";
        case EStat.PYRO_DMG_P: return "Pyro DMG%";
        case EStat.CRYO_DMG_P: return "Cryo DMG%";
        case EStat.HEAL_OUT_P: return "Heal out%";
        case EStat.HEAL_IN_P: return "Heal in%";
        case EStat.NA_DMG_P: return "NA DMG%";
        case EStat.CA_DMG_P: return "CA DMG%";
        case EStat.PA_DMG_P: return "PA DMG%";
        case EStat.NA_DMG: return "NA DMG";
        case EStat.CA_DMG: return "CA DMG";
        case EStat.PA_DMG: return "PA DMG";
        case EStat.NA_SPD_P: return "NA SPD%";
        case EStat.CA_SPD_P: return "CA SPD%";
        case EStat.PA_SPD_P: return "PA SPD%";
        case EStat.SKILL_DMG_P: return "Skill DMG%";
        case EStat.BURST_DMG_P: return "Burst DMG%";
        case EStat.MOVE_SPD_P: return "Move SPD%";
        case EStat.SKILL_CR_P: return "Skill Crit Rate%";
        case EStat.BURST_CR_P: return "Burst Crit Rate%";
        case EStat.OVERLOAD_DMG_P: return "Overload DMG%";
        case EStat.BURNING_DMG_P: return "Burning DMG%";
        case EStat.VAPORIZE_DMG_P: return "Vaporize DMG%";
        case EStat.MELT_DMG_P: return "Melt DMG%";

        case EStat.UNKNOWN: return "Unknown";
    }
}

export function stringToEStat (s: string): EStat {
    switch(s) {
        case "hp": return EStat.HP;
        case "atk": return EStat.ATK;
        case "def": return EStat.DEF;
    
        case "hp%": return EStat.HP_P;
        case "atk%": return EStat.ATK_P;
        case "def%": return EStat.DEF_P;
        case "em": return EStat.EM;
        case "er%": return EStat.ER_P;
        case "cr%": return EStat.CR_P;
        case "cdmg%": return EStat.CDMG_P;
    
        case "phys dmg%": return EStat.PHYS_DMG_P;
        case "anemo dmg%": return EStat.ANEMO_DMG_P;
        case "geo dmg%": return EStat.GEO_DMG_P;
        case "electro dmg%": return EStat.ELECTRO_DMG_P;
        case "dendro dmg%": return EStat.DENDRO_DMG_P;
        case "hydro dmg%": return EStat.HYDRO_DMG_P;
        case "pyro dmg%": return EStat.PYRO_DMG_P;
        case "cryo dmg%": return EStat.CRYO_DMG_P;
        case "heal out%": return EStat.HEAL_OUT_P;
        case "heal in%": return EStat.HEAL_IN_P;
    
        case "na dmg%": return EStat.NA_DMG_P;
        case "ca dmg%": return EStat.CA_DMG_P;
        case "pa dmg%": return EStat.PA_DMG_P;
        case "na dmg": return EStat.NA_DMG;
        case "ca dmg": return EStat.CA_DMG;
        case "pa dmg": return EStat.PA_DMG;
        case "na spd%": return EStat.NA_SPD_P;
        case "ca spd%": return EStat.CA_SPD_P;
        case "pa spd%": return EStat.PA_SPD_P;
        case "skill dmg%": return EStat.SKILL_DMG_P;
        case "burst dmg%": return EStat.BURST_DMG_P;
        case "skill cr%": return EStat.SKILL_CR_P;
        case "burst cr%": return EStat.BURST_CR_P;

        case "overload dmg%": return EStat.OVERLOAD_DMG_P;
        case "burning dmg%": return EStat.BURNING_DMG_P;
        case "vaporize dmg%": return EStat.VAPORIZE_DMG_P;
        case "melt dmg%": return EStat.MELT_DMG_P;


        case "mov spd%": return EStat.MOVE_SPD_P;
        default: return EStat.UNKNOWN
    }
}