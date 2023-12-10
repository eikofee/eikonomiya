import {promises as fsPromises} from 'fs';
import * as yaml from 'yaml';
import path from 'path'



export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const uid = searchParams.get("uid")!
    const p = path.join(process.cwd(), "/data/", uid, "/characters")
    const loadLocalizationTable = async () => {
        let localizationTable = await (await fetch("https://raw.githubusercontent.com/EnkaNetwork/API-docs/master/store/loc.json")).json()
        localizationTable = localizationTable["en"]
        localizationTable["1533656818"] = "Aether"
        localizationTable["3816664530"] = "Lumine"
        return localizationTable
    }

    const loadPlayerData = async () => {
        const res = await (await fetch("https://enka.network/api/uid/".concat(uid))).json()
        return res
    }

    const changeIdIfTraveler = (charId: string, skills: string[], j: Record<string, any>) => {
        let res = charId
        if (skills.length > 0 && (charId == "10000007" || charId == "10000005")) {
            let subCharId = 500
            if (charId == "10000007") {
                subCharId = 700
            }
            
            for (let x = 1; x < 9; ++x) {
                let cid = charId.concat("-", (subCharId + x).toString())
                if (j[cid].length > 0) {
                    let ss = (j[cid]["SkillOrder"]).toString()
                    if (ss.includes(skills[0])) {
                        res = cid
                    }
                }
            }
        }

        return res
    }

    const translate = (id:string) => {
        if (localizationTable[id] == undefined) {
            return id
        }

        return localizationTable[id]
    }

    const translateElement = (elem:string) => {
            switch(elem) {
                case "Fire": return "Pyro";
                case "Electric": return "Electro";
                case "Water": return "Hydro";
                case "Grass": return "Dendro";
                case "Rock": return "Geo";
                case "Wind": return "Anemo";
                case "Ice": return "Cryo";
                default: return "Unknown Element"
            }
        }

    const translateEquipType = (id:string) => {
        switch (id) {
            case "EQUIP_BRACER" : return "fleur";
            case "EQUIP_NECKLACE" : return "plume";
            case "EQUIP_SHOES" : return "sablier";
            case "EQUIP_RING" : return "coupe";
            case "EQUIP_DRESS" : return "couronne";
            default: return "Unknown EquipType"
        }
    }

    const translateArtefactStatName = (id:string) => {
            switch(id) {
            case "FIGHT_PROP_HP": return "HP";
            case "FIGHT_PROP_ATTACK": return "ATK";
            case "FIGHT_PROP_DEFENSE": return "DEF";
            case "FIGHT_PROP_HP_PERCENT": return "HP%";
            case "FIGHT_PROP_ATTACK_PERCENT": return "ATK%";
            case "FIGHT_PROP_DEFENSE_PERCENT": return "DEF%";
            case "FIGHT_PROP_CRITICAL": return "Crit Rate%";
            case "FIGHT_PROP_CRITICAL_HURT": return "Crit DMG%";
            case "FIGHT_PROP_CHARGE_EFFICIENCY": return "ER%";
            case "FIGHT_PROP_HEAL_ADD": return "Heal%";
            case "FIGHT_PROP_ELEMENT_MASTERY": return "EM";
            case "FIGHT_PROP_PHYSICAL_ADD_HURT": return "Phys%";
            case "FIGHT_PROP_FIRE_ADD_HURT": return "Elem%";
            case "FIGHT_PROP_ELEC_ADD_HURT": return "Elem%";
            case "FIGHT_PROP_WATER_ADD_HURT": return "Elem%";
            case "FIGHT_PROP_WIND_ADD_HURT": return "Elem%";
            case "FIGHT_PROP_ICE_ADD_HURT": return "Elem%";
            case "FIGHT_PROP_ROCK_ADD_HURT": return "Elem%";
            case "FIGHT_PROP_GRASS_ADD_HURT": return "Elem%";
            case "FIGHT_PROP_BASE_ATTACK": return "ATK";
            default: return "Unknown StatName"
        }
    }

    const transformArtefactStatValue = (name:string, value:number) => {
        let statMultiplier = 1
        switch (name) {
            case "FIGHT_PROP_HP" : statMultiplier = 1; break;
            case "FIGHT_PROP_ATTACK" : statMultiplier = 1; break;
            case "FIGHT_PROP_DEFENSE" : statMultiplier = 1; break;
            case "FIGHT_PROP_HP_PERCENT" : statMultiplier = 0.01; break;
            case "FIGHT_PROP_ATTACK_PERCENT" : statMultiplier = 0.01; break;
            case "FIGHT_PROP_DEFENSE_PERCENT" : statMultiplier = 0.01; break;
            case "FIGHT_PROP_CRITICAL" : statMultiplier = 0.01; break;
            case "FIGHT_PROP_CRITICAL_HURT" : statMultiplier = 0.01; break;
            case "FIGHT_PROP_CHARGE_EFFICIENCY" : statMultiplier = 0.01; break;
            case "FIGHT_PROP_HEAL_ADD" : statMultiplier = 0.01; break;
            case "FIGHT_PROP_ELEMENT_MASTERY" : statMultiplier = 1; break;
            case "FIGHT_PROP_PHYSICAL_ADD_HURT" : statMultiplier = 0.01; break;
            case "FIGHT_PROP_FIRE_ADD_HURT" : statMultiplier = 0.01; break;
            case "FIGHT_PROP_ELEC_ADD_HURT" : statMultiplier = 0.01; break;
            case "FIGHT_PROP_WATER_ADD_HURT" : statMultiplier = 0.01; break;
            case "FIGHT_PROP_WIND_ADD_HURT" : statMultiplier = 0.01; break;
            case "FIGHT_PROP_ICE_ADD_HURT" : statMultiplier = 0.01; break;
            case "FIGHT_PROP_ROCK_ADD_HURT" : statMultiplier = 0.01; break;
            case "FIGHT_PROP_GRASS_ADD_HURT" : statMultiplier = 0.01; break;
            case "FIGHT_PROP_BASE_ATTACK" : statMultiplier = 1; break;
        }

        return value * statMultiplier
    }
            
    const getCharacterData = async(charId: number, skillLevelMap: string[]) => {
        const c = await (await fetch("https://raw.githubusercontent.com/EnkaNetwork/API-docs/master/store/characters.json")).json()
        const id = changeIdIfTraveler(charId.toString(), skillLevelMap, c)
        return {
            "id": id,
            "name" : translate(c[id]["NameTextMapHash"]),
            "element" : c[id]["Element"],
            "skillIdAA" : c[id]["SkillOrder"][0],
            "skillIdSkill" : c[id]["SkillOrder"][1],
            "skillIdUlt" : c[id]["SkillOrder"][2]
        }
    }
    
    const loadEquipStats = (data: Record<string, any>) => {
        const parseEntry = (e: Record<string, any>) => {

            const k : string[] = Object.keys(e)
            let res: any = {}
            if (k.includes("reliquary")) {
                const nbSubstats = e["flat"]["reliquarySubstats"].length
                let subStatNames = []
                let subStatValues = []
                for (let i = 0; i < nbSubstats; ++i) {
                    const itemName = translateArtefactStatName(e["flat"]["reliquarySubstats"][i]["appendPropId"])
                    const itemValue = transformArtefactStatValue(e["flat"]["reliquarySubstats"][i]["appendPropId"], e["flat"]["reliquarySubstats"][i]["statValue"])
                    subStatNames.push(itemName)
                    subStatValues.push(itemValue)
                }

                res = {
                    "type" : "artefact",
                    "icon" : e["flat"]["icon"],
                    "set" : translate(e["flat"]["setNameTextMapHash"]),
                    "subtype" : translateEquipType(e["flat"]["equipType"]),
                    "mainStatName" : translateArtefactStatName(e["flat"]["reliquaryMainstat"]["mainPropId"]),
                    "mainStatValue" : transformArtefactStatValue(e["flat"]["reliquaryMainstat"]["mainPropId"], e["flat"]["reliquaryMainstat"]["statValue"]),
                    "subStatNames" : subStatNames,
                    "subStatValues" : subStatValues
                }
            } else {
                res = {
                        "type" : "weapon",
                        "name" : translate(e["flat"]["nameTextMapHash"]),
                        "icon" : e["flat"]["icon"],
                        "level" : e["weapon"]["level"],

                        "mainStatName" : translateArtefactStatName(e["flat"]["weaponStats"][0]["appendPropId"]),
                        "mainStatValue" : e["flat"]["weaponStats"][0]["statValue"],
                    }

                    if (e["weapon"]["affixMap"] != undefined) {
                        res["refinement"] = e["weapon"]["affixMap"][Object.keys(e["weapon"]["affixMap"])[0]] + 1
                        res["subStatName"] = translateArtefactStatName(e["flat"]["weaponStats"][1]["appendPropId"])
                        res["subStatValue"] = transformArtefactStatValue(e["flat"]["weaponStats"][1]["appendPropId"], e["flat"]["weaponStats"][1]["statValue"])
                    }
            }
            return res
        }

        let xs = []
        for (let i = 0; i < data.length; ++i) {
            let x = parseEntry(data[i])
            xs.push(x)
        }

        let weap = undefined
        let artsDict : any = {}
        for (let i = 0; i < xs.length; ++i) {
            if (xs[i]["type"] == "artefact") {
                artsDict[xs[i]["subtype"]] = xs[i]
            } else {
                weap = xs[i]
            }
        }

        return {
            "artefacts" : artsDict,
            "weapon" : weap
        }
    }

    const loadCharacterStats = async (data: Record<string, any>) => {
        let res = []
        for (let i = 0; i < data["avatarInfoList"].length; ++i) {
            const avatar = data["avatarInfoList"][i]
            const skillLevelMapKeys = Object.keys(avatar["skillLevelMap"])

            const charData = await getCharacterData(avatar["avatarId"], skillLevelMapKeys)
            const fpmData = avatar["fightPropMap"]
            const elmData = avatar["equipList"]
            const fpm = (id: number) => {
                if (fpmData[id] == undefined) {
                    return 0
                }

                return parseFloat(fpmData[id])
            }
            const elm = loadEquipStats(elmData)

            const char = {
                "name" : charData["name"],
                "element" : translateElement(charData["element"]),
                "level" : parseFloat(avatar["propMap"]["4001"]["val"]),
                "friendshipLevel" : parseFloat(avatar["fetterInfo"]["expLevel"]),
                "skills" : {

                    "levelAA" : parseFloat(avatar["skillLevelMap"][charData["skillIdAA"]]),
                    "leveSkill" : parseFloat(avatar["skillLevelMap"][charData["skillIdSkill"]]),
                    "levelUlt" : parseFloat(avatar["skillLevelMap"][charData["skillIdUlt"]])
                },

                "baseHP" : fpm(1),
                "baseATK" : fpm(4),
                "baseDEF" : fpm(7),

                "weapon" : elm["weapon"],
                "artefacts" : elm["artefacts"],
                "equipStats" : {

                    "HP" : fpm(2),
                    "HP%" : fpm(3),
                    "ATK" : fpm(5),
                    "ATK%" : fpm(6),
                    "DEF" : fpm(8),
                    "DEF%" : fpm(9),
                    "Crit Rate%" : fpm(20),
                    "Crit DMG%" : fpm(22),
                    "ER%" : fpm(23),
                    "Heal%" : fpm(26),
                    "EM" : fpm(28),
                    "Phys%" : fpm(30),
                    "Elem%" : fpm(40)+fpm(41)+fpm(42)+fpm(43)+fpm(44)+fpm(45)+fpm(46),
                },
                "lastUpdated" : Date.now()
            }

            res.push(char)
        }

        return res
    }

    const computeArtefactsPotential = (artefacts: Record<string, any>) => {
        const ks = ["fleur", "plume", "sablier", "coupe", "couronne"]
        for (let j = 0; j < ks.length; ++j) {
            const k = ks[j]
            if (artefacts[k] != undefined) {

                const names : string[] = artefacts[k]["subStatNames"]
                const values : number[] = artefacts[k]["subStatValues"]
                let rolls = []
                for (let i = 0; i < names.length; ++i) {
                    
                    let factor = 0
                    switch (names[i]) {
                        case "HP" : factor = 298.75;break;
                        case "HP%" : factor = 0.058;break;
                        case "ATK" : factor = 19.45;break;
                        case "ATK%" : factor = 0.058;break;
                        case "DEF" : factor = 23.15;break;
                        case "DEF%" : factor = 0.073;break;
                        case "Crit Rate%" : factor = 0.039;break;
                        case "Crit DMG%" : factor = 0.078;break;
                        case "ER%" : factor = 0.0648;break;
                        case "EM" : factor = 23.31;break;
                    }

                    rolls.push(values[i] / factor)
                }

            artefacts[k]["rolls"] = rolls
            }
        }

        return artefacts
    }
    
    const mergeEquipData = (characterData: Record<string, any>) => {
        let sumStats : any = {
            "HP" : 0.0,
            "HP%" : 0.0,
            "ATK" : 0.0,
            "ATK%" : 0.0,
            "DEF" : 0.0,
            "DEF%" : 0.0,
            "Crit Rate%" : 0.0,
            "Crit DMG%" : 0.0,
            "ER%" : 0.0,
            "Heal%" : 0.0,
            "EM" : 0.0,
            "Phys%" : 0.0,
            "Elem%" : 0.0
        }

        let w = characterData["weapon"]
        sumStats[w["mainStatName"]] += w["mainStatValue"]
        if (w["subStatName"] != undefined) {
            sumStats[w["subStatName"]] += w["subStatValue"]
        }

        const ks = ["fleur", "plume", "sablier", "coupe", "couronne"]
        for (let j = 0; j < ks.length; ++j) {
            if (characterData["artefacts"][ks[j]] != undefined) {
                let a = characterData["artefacts"][ks[j]]
                sumStats[a["mainStatName"]] += a["mainStatValue"]
                for (let index = 0; index < a["subStatNames"].length; ++index) {
                    sumStats[a["subStatNames"][index]] += a["subStatValues"][index]
                }
            }
        }
        
        sumStats["Crit Rate%"] += 0.05
        sumStats["Crit DMG%"] += 0.5
        sumStats["ER%"] += 1.0
        
        return sumStats
    }

    const getAnormalStats = (data: Record<string, any>) => {

        let sumStats = mergeEquipData(data)
        const keys = ["HP%","ATK%","DEF%","Crit Rate%","Crit DMG%","ER%","Heal%","EM","Phys%","Elem%"]
        for (let i = 0; i < keys.length; ++i) {
            const k = keys[i]
            sumStats[k] -= data["equipStats"][k]
        }

        let res = []
        for (let i = 0; i < keys.length; ++i) {
            const k = keys[i]
            let tr = 2
            if (k.includes("%")) {
                tr = 0.002
            }
            if (Math.abs(sumStats[k]) > tr) {
                res.push({name: k, value : -1 * sumStats[k]})

            }
        }

        return res
    }
    
        const processCharacters = (characterStats: Record<string, any>) => {
            for (let i = 0; i < characterStats.length; ++i) {
                let char = characterStats[i]
                let anormalStats = getAnormalStats(char)
                let asn = "None"
                let asv = 0
                let xsn = []
                let xsv = []
                if (anormalStats.length == 1) {
                    asn = anormalStats[0].name
                    asv = anormalStats[0].value
                } else {
                    for (let j = 0; j < anormalStats.length; ++j) {
                        xsn.push(anormalStats[j].name)
                        xsv.push(anormalStats[j].value)
                    }
                }

                char["ascension"] = {
                    "statNames" : asn,
                    "statValues": asv
                }

                char["anormalStats"] = {

                    "statNames" : xsn,
                    "statValues" : xsv
                }

                characterStats[i]["artefacts"] = computeArtefactsPotential(characterStats[i]["artefacts"])
            }

            return characterStats
        }

    const localizationTable : Record<string, string> = await loadLocalizationTable()
    let data : Record<string, any> = await loadPlayerData()
    let characterStats : Record<string, any> = await loadCharacterStats(data)
    characterStats = processCharacters(characterStats)
    const regionRawData = await (await fetch("https://raw.githubusercontent.com/eikofee/eikonomiya-data/master/regions.yml")).text()
    const reg = yaml.parse(regionRawData)
    for (let i = 0; i < characterStats.length; ++i) {
        const characterName = characterStats[i]["name"]
        characterStats[i]["region"] = reg[characterName]
        await fsPromises.writeFile(p.concat("/", characterName), JSON.stringify(characterStats[i]))
    }

    let content = { message: "Character data updated."}
    return Response.json(content)
  }
