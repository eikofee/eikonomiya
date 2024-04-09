import { EnkaTranslator } from "./EnkaTranslator";
import { ISubStat } from "./ISubStat";
import { StatBag } from "./StatBag";
import { IEnkaArtifact } from "./enkaDataStructures/IEnkaArtifact";
import { IEnkaCharacterCommonData } from "./enkaDataStructures/IEnkaCharacterCommonData";
import { IEnkaCharacterData } from "./enkaDataStructures/IEnkaCharacterData";
import { IEnkaCharacterShowcaseEntry, IEnkaPlayerInfo } from "./enkaDataStructures/IEnkaPlayerInfo";
import { IEnkaSkill } from "./enkaDataStructures/IEnkaSkill";
import { IEnkaSkillEntry } from "./enkaDataStructures/IEnkaSkillEntry";
import { IEnkaWeapon } from "./enkaDataStructures/IEnkaWeapon";
import { ETarget } from "./enums/ETarget";
import { ERarity } from "./enums/ERarity";
import { EStat } from "./enums/EStat";
import { EWeaponType } from "./enums/EWeaponType";

export class EnkaBridge {

    uid: string;
    translator: EnkaTranslator;
    headers: Headers;

    constructor(uid: string, translator: EnkaTranslator) {
        this.uid = uid
        this.translator = translator
        this.headers = new Headers({"User-Agent":"eikonomiya-docker/".concat(process.env.EIKONOMIYA_VERSION!)})
    }

    private transformArtifactStatValue(name: string, value: number) {
        let statMultiplier = 1
        switch (name) {
            case "FIGHT_PROP_HP": statMultiplier = 1; break;
            case "FIGHT_PROP_ATTACK": statMultiplier = 1; break;
            case "FIGHT_PROP_DEFENSE": statMultiplier = 1; break;
            case "FIGHT_PROP_HP_PERCENT": statMultiplier = 0.01; break;
            case "FIGHT_PROP_ATTACK_PERCENT": statMultiplier = 0.01; break;
            case "FIGHT_PROP_DEFENSE_PERCENT": statMultiplier = 0.01; break;
            case "FIGHT_PROP_CRITICAL": statMultiplier = 0.01; break;
            case "FIGHT_PROP_CRITICAL_HURT": statMultiplier = 0.01; break;
            case "FIGHT_PROP_CHARGE_EFFICIENCY": statMultiplier = 0.01; break;
            case "FIGHT_PROP_HEAL_ADD": statMultiplier = 0.01; break;
            case "FIGHT_PROP_ELEMENT_MASTERY": statMultiplier = 1; break;
            case "FIGHT_PROP_PHYSICAL_ADD_HURT": statMultiplier = 0.01; break;
            case "FIGHT_PROP_FIRE_ADD_HURT": statMultiplier = 0.01; break;
            case "FIGHT_PROP_ELEC_ADD_HURT": statMultiplier = 0.01; break;
            case "FIGHT_PROP_WATER_ADD_HURT": statMultiplier = 0.01; break;
            case "FIGHT_PROP_WIND_ADD_HURT": statMultiplier = 0.01; break;
            case "FIGHT_PROP_ICE_ADD_HURT": statMultiplier = 0.01; break;
            case "FIGHT_PROP_ROCK_ADD_HURT": statMultiplier = 0.01; break;
            case "FIGHT_PROP_GRASS_ADD_HURT": statMultiplier = 0.01; break;
            case "FIGHT_PROP_BASE_ATTACK": statMultiplier = 1; break;
        }

        return value * statMultiplier
    }

    private async buildEnkaCharacterData(data: any): Promise<IEnkaCharacterData> {
        const characterId = data["avatarId"]
        const skillRefId = Object.keys(data["skillLevelMap"])[0]
        const characterCommonData = await this.getCharacterCommonData(characterId, skillRefId)
        const sb = new StatBag()
        const fpm = (id: number) => {
            if (data["fightPropMap"][id] == undefined) {
                return 0
            }

            return parseFloat(data["fightPropMap"][id])
        }

        sb.addStat({ name: EStat.HP, value: fpm(2)})
        sb.addStat({ name: EStat.HP_P, value: fpm(3)})
        sb.addStat({ name: EStat.ATK, value: fpm(5)})
        sb.addStat({ name: EStat.ATK_P, value: fpm(6)})
        sb.addStat({ name: EStat.DEF, value: fpm(8)})
        sb.addStat({ name: EStat.DEF_P, value: fpm(9)})
        sb.addStat({ name: EStat.CR_P, value: fpm(20)})
        sb.addStat({ name: EStat.CDMG_P, value: fpm(22)})
        sb.addStat({ name: EStat.ER_P, value: fpm(23)})
        sb.addStat({ name: EStat.HEAL_OUT_P, value: fpm(26)})
        sb.addStat({ name: EStat.EM, value: fpm(28)})
        sb.addStat({ name: EStat.PHYS_DMG_P, value: fpm(30)})
        sb.addStat({ name: EStat.PYRO_DMG_P, value: fpm(40)})
        sb.addStat({ name: EStat.ELECTRO_DMG_P, value: fpm(41)})
        sb.addStat({ name: EStat.HYDRO_DMG_P, value: fpm(42)})
        sb.addStat({ name: EStat.DENDRO_DMG_P, value: fpm(43)})
        sb.addStat({ name: EStat.ANEMO_DMG_P, value: fpm(44)})
        sb.addStat({ name: EStat.GEO_DMG_P, value: fpm(45)})
        sb.addStat({ name: EStat.CRYO_DMG_P, value: fpm(46)})

        let skills = []
        for (let i = 0; i < characterCommonData.skills.length; ++i) {
            const s: IEnkaSkill = {
                id: characterCommonData.skills[i].id,
                level: data["skillLevelMap"][characterCommonData.skills[i].id]
            }

            skills.push(s)
        }

        let artifacts: IEnkaArtifact[] = []
        let weapon = {}
        for (let i = 0; i < data["equipList"].length; ++i) {
            const e = data["equipList"][i]
            const k: string[] = Object.keys(e)
            let subStats: ISubStat[] = []
            if (k.includes("reliquary")) {
                if (e["flat"]["reliquarySubstats"] != undefined) {

                    const nbSubstats = e["flat"]["reliquarySubstats"].length
                    for (let i = 0; i < nbSubstats; ++i) {
                            const itemName = this.translator.translateArtifactStatName(e["flat"]["reliquarySubstats"][i]["appendPropId"])
                            const itemValue = this.transformArtifactStatValue(e["flat"]["reliquarySubstats"][i]["appendPropId"], e["flat"]["reliquarySubstats"][i]["statValue"])
                        let factor = 0
                        switch (itemName) {
                            case EStat.HP: factor = 298.75; break;
                            case EStat.HP_P: factor = 0.058; break;
                            case EStat.ATK: factor = 19.45; break;
                            case EStat.ATK_P: factor = 0.058; break;
                            case EStat.DEF: factor = 23.15; break;
                            case EStat.DEF_P: factor = 0.073; break;
                            case EStat.CR_P: factor = 0.039; break;
                            case EStat.CDMG_P: factor = 0.078; break;
                            case EStat.ER_P: factor = 0.0648; break;
                            case EStat.EM: factor = 23.31; break;
                        }
                        
                        const rollValue = itemValue / factor
                        subStats.push({ name: itemName, value: itemValue, rollValue: rollValue })
                    }
                }

                let res: IEnkaArtifact = {
                    id: e["flat"]["icon"],
                    set: this.translator.translate(e["flat"]["setNameTextMapHash"]),
                    type: this.translator.translateEquipType(e["flat"]["equipType"]),
                    mainStat: {
                        name: this.translator.translateArtifactStatName(e["flat"]["reliquaryMainstat"]["mainPropId"]),
                        value: this.transformArtifactStatValue(e["flat"]["reliquaryMainstat"]["mainPropId"], e["flat"]["reliquaryMainstat"]["statValue"])
                    },
                    subStats: subStats,
                    name: this.translator.translate(e["flat"]["nameTextMapHash"]),
                    level: e["level"],
                    rarity: ERarity.V //TODO
                }

                artifacts.push(res)
            } else {
                let res: IEnkaWeapon = {
                    name: this.translator.translate(e["flat"]["nameTextMapHash"]),
                    id: e["flat"]["icon"],
                    level: e["weapon"]["level"],

                    type: characterCommonData.weapon, //TODO
                    mainStat: {
                        name: this.translator.translateArtifactStatName(e["flat"]["weaponStats"][0]["appendPropId"]),
                        value: e["flat"]["weaponStats"][0]["statValue"]
                    },
                    subStat: undefined,
                    rarity: ERarity.I, //TODO
                    ascensionLevel: e["weapon"]["promoteLevel"]
                }

                if (e["weapon"]["affixMap"] != undefined) {
                    res.refinement = e["weapon"]["affixMap"][Object.keys(e["weapon"]["affixMap"])[0]] + 1
                    res.subStat = {
                        name: this.translator.translateArtifactStatName(e["flat"]["weaponStats"][1]["appendPropId"]),
                        value: this.transformArtifactStatValue(e["flat"]["weaponStats"][1]["appendPropId"], e["flat"]["weaponStats"][1]["statValue"])
                    }
                }

                weapon = res
            }
        }

        const baseSb = new StatBag()
        baseSb.addStat({name: EStat.HP, value: fpm(1)})
        baseSb.addStat({name: EStat.ATK, value: fpm(4)}) // includes weapon
        baseSb.addStat({name: EStat.DEF, value: fpm(7)})
        const res: IEnkaCharacterData = {
            id: data["avatarId"],
            commonData: characterCommonData,
            ascensionLevel: parseInt(data["propMap"]["1002"]["ival"]),
            level: parseInt(data["propMap"]["4001"]["ival"]),
            finalStats: sb,

            skills: skills,
            artifacts: artifacts,
            weapon: weapon as IEnkaWeapon,

            friendship: data["fetterInfo"]["expLevel"],
            baseStats: baseSb,
            constellation: data["talentIdList"] == undefined ? 0 : data["talentIdList"].length
        }

        return res

    }

    public async loadPlayerData(): Promise<IEnkaPlayerInfo> {
        // const requestTest = await fetch('http://httpbin.org/headers', {cache: "no-cache", headers: this.headers})
        const fullDataRequest = await fetch("https://enka.network/api/uid/".concat(this.uid), {cache: "no-cache", headers: this.headers})
        if (fullDataRequest.status != 200) {
            switch(fullDataRequest.status) {
                case 400:
                    return Promise.reject("[Enka Error] : Wrong UID format.")
                case 404:
                    return Promise.reject("[Enka Error] : UID does not exist (hoyo server).")
                case 403:
                    return Promise.reject("[Enka Error/Cloudflare] : Forbidden.")
                case 424:
                    return Promise.reject("[Enka Error] : Enka is down (maintenance/game update).")
                case 429:
                    return Promise.reject("[Enka Error] : Too many requests (Enka or hoyo).")
                case 500:
                    return Promise.reject("[Enka Error] : General server error.")
                case 529:
                    return Promise.reject("[Enka Error] : Server error (quote: 'I screwed up massively').")
            }
        }

        const fullData = await fullDataRequest.json()
        const playerInfo = fullData["playerInfo"]
        const data = fullData
        let charShowcase = []
        for (let i = 0; i < data["avatarInfoList"].length; ++i) {
            const currentChar = data["avatarInfoList"][i]
            const char: IEnkaCharacterData = await this.buildEnkaCharacterData(currentChar)
            const entry: IEnkaCharacterShowcaseEntry = {
                avatarId: char.id,
                level: char.level,
                info: char
            }

            charShowcase.push(entry)
        }

        let profilePictureCharacterName = "Lumine"
        if (playerInfo["profilePicture"]["avatarId"] != undefined) {
            profilePictureCharacterName = this.translator.translate((await this.getCharacterCommonData(playerInfo["profilePicture"]["avatarId"])).nameId)
        } else if (playerInfo["profilePicture"]["id"] != undefined) {
            const id = parseInt(playerInfo["profilePicture"]["id"])
            const avatarDatabase = await(await fetch("https://gitlab.com/Dimbreath/AnimeGameData/-/raw/main/ExcelBinOutput/ProfilePictureExcelConfigData.json?ref_type=heads", {headers: this.headers})).json()
            let i = 0;
            const firstItem = avatarDatabase[0]
            const keys = Object.keys(firstItem)
            const constantKey = keys[keys.length - 1]
            while (i < avatarDatabase.length && avatarDatabase[i]["id"] != id) {
                ++i;
            }

            if (i < avatarDatabase.length) {
                const avatarId = avatarDatabase[i][constantKey].toString()
                profilePictureCharacterName = this.translator.translate((await this.getCharacterCommonData(avatarId)).nameId)
            }
        }
        
        const res: IEnkaPlayerInfo = {
            name: playerInfo["nickname"],
            arLevel: playerInfo["level"],
            description: playerInfo["signature"],
            worldLevel: playerInfo["worldLevel"],
            namecardId: playerInfo["nameCardId"],
            achievementCount: playerInfo["finishAchievementNum"],
            abysses: {
                floor: playerInfo["towerFloorIndex"],
                chamber: playerInfo["towerLevelIndex"]
            },
            charShowcase: charShowcase,
            cardShowcase: playerInfo["showNameCardIdList"],
            profilePicture: profilePictureCharacterName
        }

        return res
    }

    public async getCharacterCommonData(id: string, refSkillId?: string): Promise<IEnkaCharacterCommonData> {
        const c = await (await fetch("https://raw.githubusercontent.com/EnkaNetwork/API-docs/master/store/characters.json")).json()
        if (refSkillId != undefined && (id == "10000007" || id == "10000005")) {
            let subCharId = 500
            if (id == "10000007") {
                subCharId = 700
            }

            for (let x = 1; x < 9; ++x) {
                let cid = id.toString().concat("-", (subCharId + x).toString())
                if (c[cid]["SkillOrder"] != undefined) {
                    let ss = (c[cid]["SkillOrder"]).toString()
                    if (ss.includes(refSkillId)) {
                        id = cid
                        x = 90
                    }
                }
            }
        }

        const commonData = c[id]
        const element = this.translator.translateElement(commonData["Element"])
        let skills = []
        for (let i = 0; i < commonData["SkillOrder"].length ; ++i) {
            let skillKey = commonData["SkillOrder"][i].toString()
            let skillId = commonData["Skills"][skillKey]
            let skillObject: IEnkaSkillEntry = {
                id: skillKey,
                iconId: skillId
            }

            skills.push(skillObject)
        }
        const rarityLabel = commonData["QualityType"]
        let rarity = ERarity.I
        switch (rarityLabel) {
            case "QUALITY_PURPLE":
                rarity = ERarity.IV;
                break;
            case "QUALITY_ORANGE":
                rarity = ERarity.V
                break;
            case "QUALITY_ORANGE_SP":
                rarity = ERarity.V_RED
                break;
        }

        const weaponLabel = commonData["WeaponType"]
        let weapon = EWeaponType.SWORD
        switch (weaponLabel) {
            case "WEAPON_SWORD_ONE_HAND":
                weapon = EWeaponType.SWORD
                break;
            case "WEAPON_CATALYST":
                weapon = EWeaponType.CATALYST
                break;
            case "WEAPON_BOW":
                weapon = EWeaponType.BOW
                break;
            case "WEAPON_CLAYMORE":
                weapon = EWeaponType.CLAYMORE
                break;
            case "WEAPON_POLE":
                weapon = EWeaponType.POLEARM
                break;
        }

        const res: IEnkaCharacterCommonData = {
            id: id,
            element: element,
            constellationIds: commonData["Consts"],
            skills: skills,
            nameId: commonData["NameTextMapHash"],
            sideIconId: commonData["SideIconName"],
            rarity: rarity,
            weapon: weapon,
            costumes: [] //TODO
        }

        return res
    }
}