import StatCard, { ILine } from './components/StatCard';
import { IEquipCardInfo } from './interfaces/IEquipCardInfo';
import { Stat } from './classes/Stat';
import EquipmentCard from './components/EquipmentCard';
import { ICharacter } from './interfaces/ICharacter';
import CharacterCard from './components/CharacterCard';
import Icon from './components/Icon';
import AscensionCard from './components/AscensionCard';
import { hostUrl } from './host';
import { ICharacterRule } from './interfaces/ICharacterRule';
import { useState } from 'react';
import RuleCard from './components/RuleCard';

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

async function getCharacterData(name: string) {
    const data = await fetch(hostUrl().concat("char?name=", name));
    return data.json()
}

async function getRules() {
    const data = await fetch(hostUrl().concat("rules"));
    return data.json()
}

async function loadCharacterRules(name: string) {
    let rules: Record<string, any> = await getRules();
    return rules[name]["rule"]
}

export default async function Home() {

    let characterName = "Furina"
    let data: Record<string, any> = await getCharacterData(characterName);
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

    let rules: Record<string, any> = await loadCharacterRules("Yelan")
    let defaultRuleFactor: ICharacterRule = {
        ruleName: "defaultRuleName",
        character: characterName,
        minimalValues: [],
        values: [
            {name: "HP", value: rules["HP"]},
            {name: "ATK", value: rules["ATK"]},
            {name: "DEF", value: rules["DEF"]},
            {name: "HP%", value: rules["HP%"]},
            {name: "ATK%", value: rules["ATK%"]},
            {name: "DEF%", value: rules["DEF%"]},
            {name: "EM", value: rules["EM"]},
            {name: "ER%", value: rules["ER%"]},
            {name: "Crit Rate%", value: rules["Crit Rate%"]},
            {name: "Crit DMG%", value: rules["Crit DMG%"]}]
        }
    // let [ruleFactors, setRuleFactor] = useState(defaultRuleFactor)


    return (
        <main>
            <div className="flex h-full flex-row bg-slate-100">
                <div className="basis-1/4 m-1 p-1 bg-slate-200">
                    <CharacterCard char={char} />
                </div>
                <div className="flex flex-col m-1 p-1 bg-slate-200">
                    <div className="basis-1/4 grid lg:grid-cols-6 sm:grid-cols-3 gap-2 p-1 m-1 bg-slate-300">
                        <div className="flex flex-col">
                            <AscensionCard char={char} />
                            <EquipmentCard equip={weapon} rule={defaultRuleFactor}/>
                        </div>
                        <EquipmentCard equip={fleur} rule={defaultRuleFactor}/>
                        <EquipmentCard equip={plume} rule={defaultRuleFactor}/>
                        <EquipmentCard equip={sablier} rule={defaultRuleFactor}/>
                        <EquipmentCard equip={coupe} rule={defaultRuleFactor}/>
                        <EquipmentCard equip={couronne} rule={defaultRuleFactor}/>
                    </div>
                    <div className="basis-3/4 h-full grid grid-cols-3 m-1 p-1 bg-slate-300">
                        <div className="flex flex-col gap-4 m-1">
                            <StatCard name={"Basic Stats"} lines={basicStatsLines} />
                            <RuleCard rule={defaultRuleFactor}/>
                        </div>
                        <div className="flex flex-col gap-4 m-1">
                            
                        </div>
                        <div className="flex flex-col gap-4 m-1">
                        </div>
                    </div>
                </div>

            </div>

        </main>
    )
}
