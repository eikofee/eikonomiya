"use client";
import { useContext, useState } from "react";
import { Stat } from "../classes/Stat";
import { ICharacter } from "../interfaces/ICharacter";
import { ICharacterRule } from "../interfaces/ICharacterRule";
import { IEquipCardInfo } from "../interfaces/IEquipCardInfo";
import AscensionCard from "./AscensionCard";
import CharacterCard from "./CharacterCard";
import EquipmentCard from "./EquipmentCard";
import Icon from "./Icon";
import RuleCard from "./RuleCard";
import StatCard, { ILine } from "./StatCard";
import { RootContext, generateDefaultRule } from "./RootContext";

function parseWeapon(data: any): IEquipCardInfo {
    let weap = data["weapon"]
    let name = weap["name"]
    let stats: Stat[] = []
    stats.push({ name: "ATK", value: weap["mainStatValue"], isPercentage: false, type: "main", potential: 0 })
    let level = weap["level"]
    let image = "https://enka.network/ui/" + weap["icon"] + ".png";
    stats.push({ name: weap["subStatName"], value: weap["subStatValue"], isPercentage: weap["subStatName"].includes("%"), type: "sub", potential: 0 })
    let refinement = weap["refinement"]
    return {
        name: name,
        image: image,
        level: level,
        refinement: refinement,
        stats: stats
    }
}



function parseArtefact(data: any, artefactName: string): IEquipCardInfo {
    let arte = data["artefacts"][artefactName];
    let name = arte["set"]
    let image = "https://enka.network/ui/" + arte["icon"] + ".png";
    let level = 0;
    let refinement = 0;
    let stats: Stat[] = [];
    let n = arte["mainStatName"];
    let v = parseFloat(arte["mainStatValue"]);
    let factor = false;
    if (n.includes("%")) {
        factor = true;
    }
    stats.push({ name: n, value: v, potential: 0, type: "main", isPercentage: factor })
    for (let i = 0; i < arte["subStatValues"].length; ++i) {
        let n = arte["subStatNames"][i];
        let v = parseFloat(arte["subStatValues"][i]);
        let factor = n.includes("%");
        stats.push({ name: n, value: v, type: "sub", potential: parseFloat(arte["rolls"][i]), isPercentage: factor })
    }
    return {
        name: name,
        image: image,
        level: level,
        refinement: refinement,
        stats: stats
    }

}

export default function RootComponent({data, rule} : ({data: any, rule: any})) {

    let characterName = data["name"]
    let fleur = parseArtefact(data, "fleur");
    let plume = parseArtefact(data, "plume");
    let sablier = parseArtefact(data, "sablier");
    let coupe = parseArtefact(data, "coupe");
    let couronne = parseArtefact(data, "couronne");
    let weapon = parseWeapon(data)


    let char: ICharacter = { name: characterName, iconName: characterName.toLocaleLowerCase() }
    char.baseHP = data["baseHP"]
    char.baseATK = data["baseATK"] - weapon.stats[0].value
    char.baseDEF = data["baseDEF"]
    char.ascensionStatName = data["ascension"]["statNames"]
    char.ascensionStatValue = data["ascension"]["statValues"]
    char.level = data["level"]
    let basicStatsLines: ILine[] = []
    let charStats = data["equipStats"]
    let baseStatNames = ["HP", "ATK", "DEF"]
    for (let i = 0; i < baseStatNames.length; ++i) {
        let s = baseStatNames[i]
        let name = <div className="flex flex-row px-1 items-center"><Icon n={s} /> <span className="pl-1">{s}</span></div>
        let value = <div>{(data["base" + s] * (1 + charStats[s + "%"]) + charStats[s]).toFixed(0)}</div>
        basicStatsLines.push({ name: name, value: value })
    }
    baseStatNames = ["ER%", "EM", "Crit Rate%", "Crit DMG%"]
    for (let i = 0; i < baseStatNames.length; ++i) {
        let s = baseStatNames[i]
        let name = <div className="flex flex-row px-1 items-center"><Icon n={s} /> <span className="pl-1">{s}</span></div>
        let v = charStats[s] * (s.includes("%") ? 100 : 1)
        let fv = (s.includes("%") ? 1 : 0)
        let value = <div>{v.toFixed(fv).toString().concat(s.includes("%") ? "%" : "")}</div>
        basicStatsLines.push({ name: name, value: value })
    }

    const [defaultRule, changeDefaultRuleFactor] = useState(generateDefaultRule())

    function ruleCallback(arg0: ICharacterRule) {
        changeDefaultRuleFactor(arg0)
    }

    return <RootContext.Provider value={{defaultRule, ruleCallback}}>

    <div className="flex h-full flex-row bg-slate-100">
            <div className="basis-1/4 m-1 p-1 bg-slate-200">
                <CharacterCard char={char} />
            </div>
            <div className="flex flex-col m-1 p-1 bg-slate-200">
                <div className="basis-1/4 grid lg:grid-cols-6 sm:grid-cols-3 gap-2 p-1 m-1 bg-slate-300">
                    <div className="flex flex-col">
                        <AscensionCard char={char} />
                        <EquipmentCard equip={weapon} />
                    </div>
                    <EquipmentCard equip={fleur} />
                    <EquipmentCard equip={plume} />
                    <EquipmentCard equip={sablier} />
                    <EquipmentCard equip={coupe} />
                    <EquipmentCard equip={couronne} />
                </div>
                <div className="basis-3/4 h-full grid grid-cols-3 m-1 p-1 bg-slate-300">
                    <div className="flex flex-col gap-4 m-1">
                        <StatCard name={"Basic Stats"} lines={basicStatsLines} />
                        <RuleCard />
                    </div>
                    <div className="flex flex-col gap-4 m-1">
                        
                    </div>
                    <div className="flex flex-col gap-4 m-1">
                    </div>
                </div>
            </div>

        </div>
    </RootContext.Provider>
}