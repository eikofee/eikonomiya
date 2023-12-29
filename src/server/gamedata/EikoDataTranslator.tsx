import { ERegion } from "./enums/ERegion";
import { EStat, stringToEStat } from "./enums/EStat";

export class EikoDataTranslator {

    public yamlToRegion(reg: string): ERegion {
        switch(reg) {
            case "mondstadt": return ERegion.MONDSTADT;
            case "liyue": return ERegion.LIYUE;
            case "inazuma": return ERegion.INAZUMA;
            case "sumeru": return ERegion.SUMERU;
            case "fontaine": return ERegion.FONTAINE;
            default: return ERegion.OTHER;
        }
    }

    public regionToYaml(reg: ERegion): string {
        switch(reg) {
            case ERegion.MONDSTADT : return "mondstadt";
            case ERegion.LIYUE : return "liyue";
            case ERegion.INAZUMA : return "inazuma";
            case ERegion.SUMERU : return "sumeru";
            case ERegion.FONTAINE : return "fontaine";
            default: return "other";
        }
    }

    public yamlToStat(stat: string): EStat {
        return stringToEStat(stat);
    }

    public statToYaml(stat: EStat): string {
        return stat.toString()
        // switch (stat) {
        //     case EStat.UNKNOWN: return "";
        //     case EStat.HP: return "hp";
        //     case EStat.HP_P: return "hp%";
        //     case EStat.ATK: return "atk";
        //     case EStat.ATK_P: return "atk%";
        //     case EStat.DEF: return "def";
        //     case EStat.DEF_P: return "def%";
        //     case EStat.EM: return "em";
        //     case EStat.ER_P: return "er%";
        //     case EStat.CR_P: return "cr%";
        //     case EStat.CDMG_P: return "cdmg%";
        //     case EStat.ANEMO_DMG_P: return "anemo dmg%";
        //     case EStat.GEO_DMG_P: return "geo dmg%";
        //     case EStat.ELECTRO_DMG_P: return "electro dmg%";
        //     case EStat.DENDRO_DMG_P: return "dendro dmg%";
        //     case EStat.HYDRO_DMG_P: return "hydro dmg%";
        //     case EStat.PYRO_DMG_P: return "pyro dmg%";
        //     case EStat.CRYO_DMG_P: return "cryo dmg%";
        //     case EStat.PHYS_DMG_P: return "phys dmg%";
        //     case EStat.NA_DMG_P : return "na dmg%";
        //     case EStat.CA_DMG_P : return "ca dmg%";
        //     case EStat.PA_DMG_P : return "pa dmg%";
        //     case EStat.SKILL_DMG_P : return "skill dmg%";
        //     case EStat.BURST_DMG_P : return "burst dmg%";
        //     case EStat.HEAL_OUT_P: return "heal out%";
        // }
    }
}