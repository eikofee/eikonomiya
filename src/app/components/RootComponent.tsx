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
import { ICharacterData, buildDefaultICharacterData, copyCharacterData } from "@/server/gamedata/ICharacterData";
import { ICharacterRule, buildDefaultICharacterRule } from "../interfaces/ICharacterRule";
import { EElement } from "@/server/gamedata/enums/EElement";
import { EWeaponType } from "@/server/gamedata/enums/EWeaponType";
import { ERarity } from "@/server/gamedata/enums/ERarity";
import { EStat, stringToEStat } from "@/server/gamedata/enums/EStat";
import { ERegion } from "@/server/gamedata/enums/ERegion";
import { Card } from "./Card";
import { IEffect } from "@/server/gamedata/IEffect";
import { computeStats } from "@/server/gamedata/StatComputations";
import { ConfigDirector, IConfigDirector } from "../classes/ConfigDirector";
import { IStatBag } from "@/server/gamedata/IStatBag";
import EffectList, { EEffectListType } from "./EffectList";
import EffectCardExplorer from "./EffectCardExplorer";
import StatLineDraw from "./StatLineDrawer";


export default function RootComponent({data: characters, currentCharacterName: currentCharacterName, rules, uid, iconfig, defaultEffectCards} : ({data: ICharacterData[], currentCharacterName: string, rules: ICharacterRule[], uid: string, iconfig: IConfigDirector, defaultEffectCards: IEffect[]})) {
    
    let char = buildDefaultICharacterData()

    let defaultRule = buildDefaultICharacterRule()

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

    const anomalyStats = []
    const anomalyCards = []
    for (let e = 0; e < characterData.anormalStats.names.length; ++e) {
        const stat = stringToEStat(characterData.anormalStats.names[e])
        let value = characterData.anormalStats.values[e]
        if (value != 0) {
            anomalyStats.push(<StatLineDraw name={stat} value={value} rounded={false}/>)
        }
        
    }

    if (anomalyStats.length > 0) {
        let content = <div className="bg-inherit">
            <div className="pl-2 font-semibold bg-red-400 rounded-t-md">Missing values after stats processing</div>
                <ul>
                    {anomalyStats}
                </ul>
            </div>;
        anomalyCards.push(<Card c={content}/>)
    }

    return <ConfigContext.Provider value={{colorDirector: colorDirector, config: config}}>
        <BackgroundComponent character={characterData}/>
        <div className="flex flex-col p-1 gap-1">
            <NavigationComponent currentCharacter={characterData} characterList={characters} uid={uid} />
            <div className={"flex flex-row gap-1"}>
                    <CharacterCard char={characterData} />
                    <div className={"flex flex-col h-full gap-1"}>
                        <FullEquipCard character={characterData} rule={rule}/>
                        <div className="grid grid-cols-3 h-full gap-1">
                            <div className="flex flex-col gap-1 max-h-full">
                                <StatCard character={characterData} statbag={statBag}/>
                                {anomalyCards}
                            </div>
                            <div className="flex flex-col gap-1">
                                <EffectList char={characterData} effects={characterData.staticEffects} type={EEffectListType.STATIC} cb={effectCb}/>
                            </div>
                            <div className="flex flex-col gap-1">
                                <EffectList char={characterData} effects={characterData.dynamicEffects} type={EEffectListType.DYNAMIC} cb={effectCb}/>
                                <EffectCardExplorer allCards={effectCards} addToCharacterCb={addToCharacterCb} />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        {/* to be changed to a overlapping toolbar soon^tm */}
                        <RuleCard rule={rule} ruleSetterCallback={setRuleCallback} saveRuleCallback={saveRuleCallback}/>
                    </div>

            </div>
        </div>
    </ConfigContext.Provider>
}