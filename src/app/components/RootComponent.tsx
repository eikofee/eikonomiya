"use client";
import { useState } from "react";
import CharacterCard from "./CharacterCard";
import RuleCard from "./RuleCard";
import { ColorDirector } from "../classes/ColorDirector";
import { ConfigContext } from "./ConfigContext";
import StatCard from "./StatCard";
import { FullEquipCard } from "./FullEquipCard";
import BackgroundComponent from "./BackgroundComponent";
import NavigationComponent from "./NavigationComponent";
import { ICharacterData, copyCharacterData } from "@/server/gamedata/ICharacterData";
import { ICharacterRule } from "../interfaces/ICharacterRule";
import { EElement } from "@/server/gamedata/enums/EElement";
import { EWeaponType } from "@/server/gamedata/enums/EWeaponType";
import { ERarity } from "@/server/gamedata/enums/ERarity";
import { EStat, eStatToReadable, stringToEStat } from "@/server/gamedata/enums/EStat";
import { ERegion } from "@/server/gamedata/enums/ERegion";
import Icon from "./Icon";
import { Card } from "./Card";
import { ETarget } from "@/server/gamedata/enums/EEffectTarget";
import EffectCard from "./EffectCard";
import { IEffect } from "@/server/gamedata/IEffect";
import { EEffectType } from "@/server/gamedata/enums/EEffectType";
import EffectCardBasic from "./effectCards/EffectCardBasic";
import EffectCardBoolean from "./effectCards/EffectCardBoolean";
import EffectCardStack from "./effectCards/EffectCardStack";
import { computeStats } from "@/server/gamedata/StatComputations";
import { StatBag } from "@/server/gamedata/StatBag";
import { ConfigDirector, IConfigDirector } from "../classes/ConfigDirector";
import { IStatBag } from "@/server/gamedata/IStatBag";
import EffectList, { EEffectListType } from "./EffectList";
import EffectCardSmall from "./EffectCardSmall";
import EffectCardExplorer from "./EffectCardExplorer";


export default function RootComponent({data: characters, currentCharacterName: currentCharacterName, rules, uid, iconfig, defaultEffectCards} : ({data: ICharacterData[], currentCharacterName: string, rules: ICharacterRule[], uid: string, iconfig: IConfigDirector, defaultEffectCards: IEffect[]})) {
    
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
                def: 0,
                atk_nw: 0
            },
            region: ERegion.UNKNOWN,
            assets: {
                characterPortrait: "",
                characterCard: "",
                aa: "",
                skill: "",
                burst: "",
                a1: "",
                a4: "",
                c1: "",
                c2: "",
                c3: "",
                c4: "",
                c5: "",
                c6: "",
                characterNameCard: ""
            },
            constNames: {
                c1: "",
                c2: "",
                c3: "",
                c4: "",
                c5: "",
                c6: ""
            },
            constTexts: {
                c1: "",
                c2: "",
                c3: "",
                c4: "",
                c5: "",
                c6: ""
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
            refinement: 0,
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
        ascensionStatValue: 0,
        constellation: 0
    }

    let defaultRule : ICharacterRule = {
        character: char.name as string,
        ruleName: "defaultRuleName",
        stats: []
    }


    for (let i = 0; i < characters.length; ++i) {
        if (characters[i].name == currentCharacterName) {
            char = characters[i]
            defaultRule = rules[i]
        }
    }

    let colorDirector = new ColorDirector(char.element)
    let config = new ConfigDirector(iconfig)

    const [rule, setRule] = useState(defaultRule)

    function setRuleCallback(x: ICharacterRule) {
        setRule(x)
    }

    const effectCb = (a: ICharacterData, b: IStatBag) => {
        let effectList = []
        let currentEffectsNames = []
        for (let i = 0; i < a.staticEffects.length; ++i) {
            currentEffectsNames.push(a.staticEffects[i].name)
        }

        for (let i = 0; i < a.dynamicEffects.length; ++i) {
            currentEffectsNames.push(a.dynamicEffects[i].name)
        }

        for (let i = 0; i < defaultEffectCards.length; ++i) {
            if (!currentEffectsNames.includes(defaultEffectCards[i].name)) {
                effectList.push(defaultEffectCards[i])
            }
        }
        setCharacterData(a)
        setStatBag(b)
        setEffectCards(effectList)
    }

    const firstComputation = computeStats(char)
    const [characterData, setCharacterData] = useState(firstComputation.a)
    const defaultStatBag = firstComputation.b
    const [statBag, setStatBag] = useState(defaultStatBag)
    const [effectCards, setEffectCards] = useState(defaultEffectCards)

    async function saveRuleCallback(x: ICharacterRule) {
        let url = "/api/rules?mode=edit&characterName=".concat(x.character,"&uid=", uid)
        for (let i = 0; i < x.stats.length; ++i) {
            url = url.concat("&", x.stats[i].name, "=", x.stats[i].value.toString())
        }

        await fetch(url)
    }



    let anomalyCards = []
    for (let e = 0; e < characterData.anormalStats.names.length; ++e) {
        const stat = characterData.anormalStats.names[e]
        let value = characterData.anormalStats.values[e]
        if (value != 0) {
            let s = eStatToReadable(stringToEStat(stat))
            let classname = "flex flex-row justify-between items p-1 bg-red-200"
            let n = <div className="flex flex-row items-center"><Icon n={s} /> <span className="pl-1">{s}</span></div>
            value = value * (s.includes("%") ? 100 : 1)
            let fv = (s.includes("%") ? 1 : 0)
            let v = <div>{value.toFixed(fv).toString().concat(s.includes("%") ? "%" : "")}</div>
                let content = <div className="bg-inherit">
            <div className="pl-2 font-semibold bg-red-400 rounded-t-md">Anomalies in stats (collected - processed)</div>
                <ul>
                    <li className={classname}>
                        <div className="text-left basis-3/5 items-center">{n}</div>
                        <div className="text-right basis-2/5 pr-2">{v}</div>
                    </li>
                </ul>
            </div>;

            anomalyCards.push(<Card c={content}/>)
        }
    }

    const addToCharacterCb = (x: IEffect) => {
        let newChar = copyCharacterData(characterData)
        newChar.dynamicEffects.push(x)
        const res = computeStats(newChar)
        let effectList = []
        let currentEffectsNames = []
        for (let i = 0; i < newChar.staticEffects.length; ++i) {
            currentEffectsNames.push(newChar.staticEffects[i].name)
        }

        for (let i = 0; i < newChar.dynamicEffects.length; ++i) {
            currentEffectsNames.push(newChar.dynamicEffects[i].name)
        }

        for (let i = 0; i < defaultEffectCards.length; ++i) {
            if (!currentEffectsNames.includes(defaultEffectCards[i].name)) {
                effectList.push(defaultEffectCards[i])
            }
        }
        setCharacterData(res.a)
        setStatBag(res.b)
        setEffectCards(effectList)
    }


    return <ConfigContext.Provider value={{colorDirector: colorDirector, config: config}}>
        <BackgroundComponent character={characterData}/>
        <div className="flex flex-col">
            <NavigationComponent currentCharacter={characterData} characterList={characters} uid={uid} />
            <div className={"flex flex-row"}>
                    <div className={"basis-1/5 m-1 grow"}>
                        <CharacterCard char={characterData} />
                    </div>

                    <div className={"basis-3/5 flex flex-col h-full"}>
                        <FullEquipCard character={characterData} rule={rule}/>
                        <div className="grid grid-cols-3 h-full">
                            <div className="flex flex-col gap-2 m-1 max-h-full">
                                <StatCard character={characterData} statbag={statBag}/>
                                {anomalyCards}
                            </div>
                            <div className="flex flex-col gap-2 m-1">
                                {/* {staticEffectCards} */}
                                <EffectList char={characterData} effects={characterData.staticEffects} type={EEffectListType.STATIC} cb={effectCb}/>
                            </div>
                            <div className="flex flex-col gap-2 m-1">
                                <EffectList char={characterData} effects={characterData.dynamicEffects} type={EEffectListType.DYNAMIC} cb={effectCb}/>
                                <EffectCardExplorer allCards={effectCards} addToCharacterCb={addToCharacterCb} />
                            </div>
                        </div>
                    </div>
                    <div className="basis-1/5 flex flex-col p-1">
                        <RuleCard rule={rule} ruleSetterCallback={setRuleCallback} saveRuleCallback={saveRuleCallback}/>
                    </div>

            </div>
        </div>
    </ConfigContext.Provider>
}