import { promises as fsPromises } from 'fs';
import * as yaml from 'yaml';
import path from 'path'
import { hostUrl } from '@/app/host';




// const loadEquipStats = (data: Record<string, any>) => {
//     const parseEntry = (e: Record<string, any>) => {

//         const k: string[] = Object.keys(e)
//         let res: any = {}
//         if (k.includes("reliquary")) {
//             const nbSubstats = e["flat"]["reliquarySubstats"].length
//             let subStatNames = []
//             let subStatValues = []
//             for (let i = 0; i < nbSubstats; ++i) {
//                 const itemName = translateArtefactStatName(e["flat"]["reliquarySubstats"][i]["appendPropId"])
//                 const itemValue = transformArtefactStatValue(e["flat"]["reliquarySubstats"][i]["appendPropId"], e["flat"]["reliquarySubstats"][i]["statValue"])
//                 subStatNames.push(itemName)
//                 subStatValues.push(itemValue)
//             }

//             res = {
//                 "type": "artefact",
//                 "icon": e["flat"]["icon"],
//                 "set": translate(e["flat"]["setNameTextMapHash"]),
//                 "subtype": translateEquipType(e["flat"]["equipType"]),
//                 "mainStatName": translateArtefactStatName(e["flat"]["reliquaryMainstat"]["mainPropId"]),
//                 "mainStatValue": transformArtefactStatValue(e["flat"]["reliquaryMainstat"]["mainPropId"], e["flat"]["reliquaryMainstat"]["statValue"]),
//                 "subStatNames": subStatNames,
//                 "subStatValues": subStatValues
//             }
//         } else {
//             res = {
//                 "type": "weapon",
//                 "name": translate(e["flat"]["nameTextMapHash"]),
//                 "icon": e["flat"]["icon"],
//                 "level": e["weapon"]["level"],

//                 "mainStatName": translateArtefactStatName(e["flat"]["weaponStats"][0]["appendPropId"]),
//                 "mainStatValue": e["flat"]["weaponStats"][0]["statValue"],
//             }

//             if (e["weapon"]["affixMap"] != undefined) {
//                 res["refinement"] = e["weapon"]["affixMap"][Object.keys(e["weapon"]["affixMap"])[0]] + 1
//                 res["subStatName"] = translateArtefactStatName(e["flat"]["weaponStats"][1]["appendPropId"])
//                 res["subStatValue"] = transformArtefactStatValue(e["flat"]["weaponStats"][1]["appendPropId"], e["flat"]["weaponStats"][1]["statValue"])
//             }
//         }
//         return res
//     }

//     let xs = []
//     for (let i = 0; i < data.length; ++i) {
//         let x = parseEntry(data[i])
//         xs.push(x)
//     }

//     let weap = undefined
//     let artsDict: any = {}
//     for (let i = 0; i < xs.length; ++i) {
//         if (xs[i]["type"] == "artefact") {
//             artsDict[xs[i]["subtype"]] = xs[i]
//         } else {
//             weap = xs[i]
//         }
//     }

//     return {
//         "artefacts": artsDict,
//         "weapon": weap
//     }
// }

// const loadCharacterStats = async (data: Record<string, any>) => {
//     let res = []
//     for (let i = 0; i < data["avatarInfoList"].length; ++i) {
//         const avatar = data["avatarInfoList"][i]
//         const skillLevelMapKeys = Object.keys(avatar["skillLevelMap"])

//         const charData = await getCharacterData(avatar["avatarId"], skillLevelMapKeys, parseInt(avatar["propMap"]["1002"]["val"]))
//         const fpmData = avatar["fightPropMap"]
//         const elmData = avatar["equipList"]
//         const fpm = (id: number) => {
//             if (fpmData[id] == undefined) {
//                 return 0
//             }

//             return parseFloat(fpmData[id])
//         }
//         const elm = loadEquipStats(elmData)

//         let char : Record<string, any> = {
//             "name": charData["name"],
//             "element": translateElement(charData["element"]),
//             "level": parseFloat(avatar["propMap"]["4001"]["val"]),
//             "friendshipLevel": parseFloat(avatar["fetterInfo"]["expLevel"]),
//             "skills": {

//                 "levelAA": parseFloat(avatar["skillLevelMap"][charData["skillIdAA"]]),
//                 "leveSkill": parseFloat(avatar["skillLevelMap"][charData["skillIdSkill"]]),
//                 "levelUlt": parseFloat(avatar["skillLevelMap"][charData["skillIdUlt"]])
//             },

//             "baseHP": fpm(1),
//             "baseATK": fpm(4),
//             "baseDEF": fpm(7),

//             "weapon": elm["weapon"],
//             "artefacts": elm["artefacts"],
//             "equipStats": {

//                 "HP": fpm(2),
//                 "HP%": fpm(3),
//                 "ATK": fpm(5),
//                 "ATK%": fpm(6),
//                 "DEF": fpm(8),
//                 "DEF%": fpm(9),
//                 "Crit Rate%": fpm(20),
//                 "Crit DMG%": fpm(22),
//                 "ER%": fpm(23),
//                 "Heal%": fpm(26),
//                 "EM": fpm(28),
//                 "Phys%": fpm(30),
//                 "Pyro%": fpm(40),
//                 "Electro%": fpm(41),
//                 "Hydro%": fpm(42),
//                 "Dendro%": fpm(43),
//                 "Anemo%": fpm(44),
//                 "Geo%": fpm(45),
//                 "Cryo%": fpm(46),
//             },
//             "ascension" : {
//                 "statName": charData["ascensionStatName"],
//                 "statValue":charData["ascensionStatValue"]
//             },
//             "lastUpdated": Date.now()
//         }
        
//         res.push(char)
//     }

//     return res
// }

// const computeArtefactsPotential = (artefacts: Record<string, any>) => {
//     const ks = ["fleur", "plume", "sablier", "coupe", "couronne"]
//     for (let j = 0; j < ks.length; ++j) {
//         const k = ks[j]
//         if (artefacts[k] != undefined) {

//             const names: string[] = artefacts[k]["subStatNames"]
//             const values: number[] = artefacts[k]["subStatValues"]
//             let rolls = []
//             for (let i = 0; i < names.length; ++i) {

//                 let factor = 0
//                 switch (names[i]) {
//                     case "HP": factor = 298.75; break;
//                     case "HP%": factor = 0.058; break;
//                     case "ATK": factor = 19.45; break;
//                     case "ATK%": factor = 0.058; break;
//                     case "DEF": factor = 23.15; break;
//                     case "DEF%": factor = 0.073; break;
//                     case "Crit Rate%": factor = 0.039; break;
//                     case "Crit DMG%": factor = 0.078; break;
//                     case "ER%": factor = 0.0648; break;
//                     case "EM": factor = 23.31; break;
//                 }

//                 rolls.push(values[i] / factor)
//             }

//             artefacts[k]["rolls"] = rolls
//         }
//     }

//     return artefacts
// }

// const mergeEquipData = (characterData: Record<string, any>) => {
//     let sumStats: any = {
//         "HP": 0.0,
//         "HP%": 0.0,
//         "ATK": 0.0,
//         "ATK%": 0.0,
//         "DEF": 0.0,
//         "DEF%": 0.0,
//         "Crit Rate%": 0.0,
//         "Crit DMG%": 0.0,
//         "ER%": 0.0,
//         "Heal%": 0.0,
//         "EM": 0.0,
//         "Phys%": 0.0,
//         "Anemo%": 0.0,
//         "Geo%": 0.0,
//         "Electro%": 0.0,
//         "Dendro%": 0.0,
//         "Hydro%": 0.0,
//         "Pyro%": 0.0,
//         "Cryo%": 0.0,
//     }

//     let w = characterData["weapon"]
//     sumStats[w["mainStatName"]] += w["mainStatValue"]
//     if (w["subStatName"] != undefined) {
//         sumStats[w["subStatName"]] += w["subStatValue"]
//     }

//     const ks = ["fleur", "plume", "sablier", "coupe", "couronne"]
//     for (let j = 0; j < ks.length; ++j) {
//         if (characterData["artefacts"][ks[j]] != undefined) {
//             let a = characterData["artefacts"][ks[j]]
//             sumStats[a["mainStatName"]] += a["mainStatValue"]
//             for (let index = 0; index < a["subStatNames"].length; ++index) {
//                 sumStats[a["subStatNames"][index]] += a["subStatValues"][index]
//             }
//         }
//     }

//     sumStats["Crit Rate%"] += 0.05
//     sumStats["Crit DMG%"] += 0.5
//     sumStats["ER%"] += 1.0

//     return sumStats
// }

// const getAnormalStats = async (data: Record<string, any>) => {

//     let sumStats = mergeEquipData(data)
//     const keys = ["HP%", "ATK%", "DEF%", "Crit Rate%", "Crit DMG%", "ER%", "Heal%", "EM", "Phys%", "Anemo%", "Geo%", "Electro%", "Dendro%", "Hydro%", "Pyro%", "Cryo%"]
//     for (let i = 0; i < keys.length; ++i) {
//         const k = keys[i]
//         sumStats[k] -= data["equipStats"][k]
//     }

//     const setBonus = await getArtefactSetBonus(data)
//     const bonusKeys = Object.keys(setBonus)
//     for (let i = 0; i < bonusKeys.length; ++i) {
//         sumStats[bonusKeys[i]] += setBonus[bonusKeys[i]]
//     }

//     let res = []
//     for (let i = 0; i < keys.length; ++i) {
//         const k = keys[i]
//         let tr = 2
//         if (k.includes("%")) {
//             tr = 0.002
//         }
//         if (Math.abs(sumStats[k]) > tr) {
//             res.push({ name: k, value: -1 * sumStats[k] })

//         }
//     }

//     return res
// }



// const processCharacters = async (characterStats: Record<string, any>) => {
//     for (let i = 0; i < characterStats.length; ++i) {
//         let char = characterStats[i]
//         let anormalStats = await getAnormalStats(char)
//         let xsn = []
//         let xsv = []
//         for (let j = 0; j < anormalStats.length; ++j) {
//             xsn.push(anormalStats[j].name)
//             xsv.push(anormalStats[j].value)
//         }

//         char["anormalStats"] = {

//             "statNames": xsn,
//             "statValues": xsv
//         }

//         characterStats[i]["artefacts"] = computeArtefactsPotential(characterStats[i]["artefacts"])
//     }

//     return characterStats
// }


export async function GET(request: Request) {
    // const { searchParams } = new URL(request.url)
    // const uid = searchParams.get("uid")!
    // const uidList = await fsPromises.readdir(path.join(process.cwd(), "/data/"))
    // if (!uidList.includes(uid)) {
    //     fsPromises.mkdir(path.join(process.cwd(), "/data/", uid))
    //     fsPromises.mkdir(path.join(process.cwd(), "/data/", uid, "/characters"))
    //     fsPromises.mkdir(path.join(process.cwd(), "/data/", uid, "/rules"))
    // }

    // let p = path.join(process.cwd(), "/data/", uid, "/characters")

    // let data: Record<string, any> = await loadPlayerData(uid)
    // let characterStats: Record<string, any> = await loadCharacterStats(data)
    // characterStats = await processCharacters(characterStats)
    // const regionRawData = await (await fetch("https://raw.githubusercontent.com/eikofee/eikonomiya-data/master/regions.yml")).text()
    // const reg = yaml.parse(regionRawData)
    // for (let i = 0; i < characterStats.length; ++i) {
    //     const characterName = characterStats[i]["name"]
    //     characterStats[i]["region"] = reg[characterName]
    //     const characterCardQuery = await fetch(hostUrl("/api/assets/characterCards?name=".concat(characterName.toLowerCase())))
    //     const characterCardPath = (await characterCardQuery.json())["fname"]
    //     const characterPortraitQuery = await fetch(hostUrl("/api/assets/characterPortraits?name=".concat(characterName.toLowerCase())))
    //     const characterPortraitPath = (await characterPortraitQuery.json())["fname"]
    //     characterStats[i]["assets"] = {
    //         "characterCard": characterCardPath,
    //         "characterPortrait": characterPortraitPath
    //     }

    //     await fsPromises.writeFile(p.concat("/", characterName), JSON.stringify(characterStats[i]))
        
    //     const pr = path.join(process.cwd(), "/data/", uid, "/rules")
    //     const fileList = await fsPromises.readdir(pr)
    //     if (!fileList.includes(characterName)) {
    //             let content = {
    //                 "name":characterName,
    //                 "rule": {
    //                     "DEF%": 3,
    //                     "Crit DMG%": 3,
    //                     "ATK%": 3,
    //                     "ER%": 3,
    //                     "Crit Rate%": 3,
    //                     "EM": 3,
    //                     "HP": 0,
    //                     "ATK": 0,
    //                     "HP%": 3,
    //                     "DEF": 0
    //                 },
    //                 "lastUpdated": Date.now()
    //             }

    //             await fsPromises.writeFile(pr.concat("/", characterName), JSON.stringify(content))
    //     }
    // }

    let content = { message: "Desactivated route." }
    return Response.json(content)
}
