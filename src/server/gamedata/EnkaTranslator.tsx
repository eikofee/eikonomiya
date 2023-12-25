import { EArtefact } from "./enums/EArtefact"
import { EElement } from "./enums/EElement"
import { EStat } from "./enums/EStat"

export async function buildEnkaTranslator() {
    let localizationTable = await (await fetch("https://raw.githubusercontent.com/EnkaNetwork/API-docs/master/store/loc.json")).json()
    localizationTable = localizationTable["en"]
    localizationTable["1533656818"] = "Aether"
    localizationTable["3816664530"] = "Lumine"
    return new EnkaTranslator(localizationTable)
}

export class EnkaTranslator {

    localizationTable: Record<string, string> = {}

    constructor(loc: Record<string, string>) {
        this.localizationTable = loc
    }

    public translate(id: string) {
        if (this.localizationTable[id] == undefined) {
            return id
        }

        return this.localizationTable[id]
    }

    public translateElement (elem: string) : EElement {
        switch (elem) {
            case "Fire": return EElement.PYRO;
            case "Electric": return EElement.ELECTRO;
            case "Water": return EElement.HYDRO;
            case "Grass": return EElement.DENDRO;
            case "Rock": return EElement.GEO;
            case "Wind": return EElement.ANEMO;
            case "Ice": return EElement.CRYO;
            default: return EElement.UNKNOWN
        }
    }
    
    public translateEquipType (id: string) : EArtefact {
        switch (id) {
            case "EQUIP_BRACER": return EArtefact.FLEUR;
            case "EQUIP_NECKLACE": return EArtefact.PLUME;
            case "EQUIP_SHOES": return EArtefact.SABLIER;
            case "EQUIP_RING": return EArtefact.COUPE;
            case "EQUIP_DRESS": return EArtefact.COURONNE;
            default: return EArtefact.UNKNOWN
        }
    }
    
    public translateArtefactStatName (id: string) : EStat{
        switch (id) {
            case "FIGHT_PROP_HP": return EStat.HP;
            case "FIGHT_PROP_ATTACK": return EStat.ATK;
            case "FIGHT_PROP_DEFENSE": return EStat.DEF;
            case "FIGHT_PROP_HP_PERCENT": return EStat.HP_P;
            case "FIGHT_PROP_ATTACK_PERCENT": return EStat.ATK_P;
            case "FIGHT_PROP_DEFENSE_PERCENT": return EStat.DEF_P;
            case "FIGHT_PROP_CRITICAL": return EStat.CR_P;
            case "FIGHT_PROP_CRITICAL_HURT": return EStat.CDMG_P;
            case "FIGHT_PROP_CHARGE_EFFICIENCY": return EStat.ER_P;
            case "FIGHT_PROP_HEAL_ADD": return EStat.HEAL_OUT_P;
            case "FIGHT_PROP_ELEMENT_MASTERY": return EStat.EM;
            case "FIGHT_PROP_PHYSICAL_ADD_HURT": return EStat.PHYS_DMG_P;
            case "FIGHT_PROP_FIRE_ADD_HURT": return EStat.PYRO_DMG_P;
            case "FIGHT_PROP_ELEC_ADD_HURT": return EStat.ELECTRO_DMG_P;
            case "FIGHT_PROP_WATER_ADD_HURT": return EStat.HYDRO_DMG_P;
            case "FIGHT_PROP_WIND_ADD_HURT": return EStat.ANEMO_DMG_P;
            case "FIGHT_PROP_ICE_ADD_HURT": return EStat.CRYO_DMG_P;
            case "FIGHT_PROP_ROCK_ADD_HURT": return EStat.GEO_DMG_P;
            case "FIGHT_PROP_GRASS_ADD_HURT": return EStat.DENDRO_DMG_P;
            case "FIGHT_PROP_BASE_ATTACK": return EStat.ATK;
            default: return EStat.UNKNOWN
        }
    }
}