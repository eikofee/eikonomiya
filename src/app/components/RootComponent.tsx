"use client";
import { useState } from "react";
import CharacterCard from "./CharacterCard";
import RuleCard from "./RuleCard";
import { KVStats } from "../classes/KVStats";
import { ColorDirector } from "../classes/ColorDirector";
import { ThemeContext } from "./ThemeContext";
import StatCard from "./StatCard";
import { FullEquipCard } from "./FullEquipCard";
import BackgroundComponent from "./BackgroundComponent";
import NavigationComponent from "./NavigationComponent";
import { ICharacterData } from "@/server/gamedata/ICharacterData";
import { ICharacterRule } from "../interfaces/ICharacterRule";
import { EElement } from "@/server/gamedata/enums/EElement";
import { EWeaponType } from "@/server/gamedata/enums/EWeaponType";
import { ERarity } from "@/server/gamedata/enums/ERarity";
import { EStat } from "@/server/gamedata/enums/EStat";
import { ERegion } from "@/server/gamedata/enums/ERegion";


export default function RootComponent({data: characters, currentCharacterName: currentCharacter, rules, uid} : ({data: ICharacterData[], currentCharacterName: string, rules: ICharacterRule[], uid: string})) {
    
    // let char = characters.find(v => v.name == currentCharacter)!
    let char: ICharacterData = {
        name: "Default Character",
        element: EElement.NONE,
        level: 0,
        ascensionLevel: 0,
        friendshipLevel: 0,
        skills: {
            levelAA: 0,
            levelSkill: 0,
            levelUlt: 0
        },
        commonData: {
            name: "",
            element: EElement.NONE,
            rarity: ERarity.I,
            weaponType: EWeaponType.SWORD,
            ascensionStatName: EStat.UNKNOWN,
            ascensionStatBaseValue: 0,
            baseStats: {
                hp: 0,
                atk: 0,
                def: 0
            },
            region: ERegion.UNKNOWN,
            assets: {
                characterPortrait: "",
                characterCard: ""
            }
        },
        weapon: {
            type: EWeaponType.SWORD,
            name: "Default Weapon Name",
            mainStat: {
                name: EStat.UNKNOWN,
                value: 0
            },
            level: 0,
            rarity: ERarity.I,
            assets: {
                icon: ""
            },
            ascensionLevel: 0
        },
        artefacts: [],
        totalStats: {
            names: [],
            values: []
        },
        lastUpdated: 0,
        anormalStats: {
            names: [],
            values: []
        },
        staticEffects: [],
        dynamicEffects: [],
        ascensionStatName: EStat.UNKNOWN,
        ascensionStatValue: 0
    }

    let defaultRule : ICharacterRule = {
        character: char.name as string,
        ruleName: "defaultRuleName",
        stats: []
    }


    for (let i = 0; i < characters.length; ++i) {
        if (characters[i].name == currentCharacter) {
            char = characters[i]
            defaultRule = rules[i]
        }
    }

    let colorDirector = new ColorDirector(char.element)

    const [rule, setRule] = useState(defaultRule)

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
                        <RuleCard rule={rule} ruleSetterCallback={setRuleCallback} uid={uid}/>
                    </div>

            </div>
        </div>
    </ThemeContext.Provider>
}