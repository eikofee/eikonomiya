"use client";
import { useState } from "react";
import { ICharacter, buildCharacter } from "../interfaces/ICharacter";
import { ICharacterRule } from "../interfaces/ICharacterRule";
import CharacterCard from "./CharacterCard";
import RuleCard from "./RuleCard";
import { KVStats } from "../classes/KVStats";
import { ColorDirector } from "../classes/ColorDirector";
import { ThemeContext } from "./ThemeContext";
import StatCard from "./StatCard";
import { FullEquipCard } from "./FullEquipCard";
import BackgroundComponent from "./BackgroundComponent";
import NavigationComponent from "./NavigationComponent";


export default function RootComponent({data, currentCharacter, defaultRule, uid} : ({data: Record<string, any>, currentCharacter: string, defaultRule: Record<string, any>, uid: string})) {
    const charKeys = Object.keys(data)
    let characters :ICharacter[] = []
    let indexes: Record<string, number> = {}
    for (let i = 0; i < charKeys.length; ++i) {
        let c = data[charKeys[i]]
        characters.push(buildCharacter(c))
        indexes[charKeys[i]] = i
    }

    let char = characters[indexes[currentCharacter]]
    let element = char["element"]
    let colorDirector = new ColorDirector(element)
    char.level = char["level"]

    const labels = ["HP", "ATK", "DEF", "HP%", "ATK%", "DEF%", "ER%", "EM", "Crit Rate%", "Crit DMG%"]
    let kv = new KVStats()
    for (let i = 0; i < labels.length; ++i){
        kv.set(labels[i], defaultRule["rule"][labels[i]])
    }
    if (defaultRule["ruleName"] == null) {
        defaultRule["ruleName"] = "defaultRuleName"
    }
    let defaultRuleObject : ICharacterRule = {
        character: defaultRule["characterName"] as string,
        ruleName: defaultRule["ruleName"] as string,
        stats: kv
    }
    const [rule, setRule] = useState(defaultRuleObject as ICharacterRule)

    function setRuleCallback(x: ICharacterRule) {
        setRule(x)
    }

    return <ThemeContext.Provider value={{colorDirector}}>
        <BackgroundComponent character={char}/>
        <div className="flex flex-col">
            <NavigationComponent currentCharacter={char} characterList={characters} uid={uid} />
            <div className={"flex flex-row"}>
                    <div className={"basis-1/5 p-1 grow"}>
                        <CharacterCard char={char} />
                    </div>

                    <div className={"basis-3/5 flex flex-col p-1"}>
                        <FullEquipCard character={char} rule={rule}/>
                        <div className="grid grid-cols-3 p-1">
                            <div className="flex flex-col gap-4">
                                <StatCard character={char} />
                            </div>
                            <div className="flex flex-col gap-4">
                            </div>
                            <div className="flex flex-col gap-4">
                            </div>
                        </div>
                    </div>
                    <div className="basis-1/5 flex flex-col p-1">
                        <RuleCard rule={rule} ruleSetterCallback={setRuleCallback}/>
                    </div>

            </div>
        </div>
    </ThemeContext.Provider>
}