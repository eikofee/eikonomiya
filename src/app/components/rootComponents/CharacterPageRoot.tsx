"use client";
import { useEffect, useState } from "react";
import CharacterCard from "../CharacterCard";
import RuleCard from "../RuleCard";
import { ColorDirector } from "../../classes/ColorDirector";
import { ConfigContext } from "../ConfigContext";
import StatCard from "../StatCard";
import { FullEquipCard } from "../FullEquipCard";
import BackgroundComponent from "../BackgroundComponent";
import NavigationComponent from "../NavigationComponent";
import { ICharacterData, buildDefaultICharacterData, copyCharacterData } from "@/server/gamedata/ICharacterData";
import { ICharacterRule, buildDefaultICharacterRule } from "../../interfaces/ICharacterRule";
import { stringToEStat } from "@/server/gamedata/enums/EStat";
import { IEffect } from "@/server/gamedata/IEffect";
import { computeStats } from "@/server/gamedata/StatComputations";
import { ConfigDirector, IConfigDirector } from "../../classes/ConfigDirector";
import { IStatBag } from "@/server/gamedata/IStatBag";
import EffectList, { EEffectListType } from "../EffectList";
import EffectCardExplorer from "../EffectCardExplorer";
import StatLineDraw from "../StatLineDrawer";
import Card from "../Card";
import { ETabMode } from "../enums/ETabMode";
import TopTabSwitcher from "../TopTabSwitcher";
import { FullTalentCard } from "../FullTalentCard";
import PlayerInfoCardSmall from "../playerInfoCards/PlayerInfoCardSmall";
import { IPlayerInfoWithoutCharacters } from "@/server/gamedata/IPlayerInfo";
import { apiLogicComputeArtifactRating, IArtifactRating } from "@/server/api/ApiLogicComputeArtifactRating";
import LogButton from "../LogButton";

export default function CharacterPageRoot({
        characters,
        currentCharacterName,
        uid,
        iconfig,
        defaultEffectCards,
        playerInfo
    } : ({
        characters: ICharacterData[],
        currentCharacterName: string,
        uid: string,
        iconfig: IConfigDirector,
        defaultEffectCards: IEffect[],
        playerInfo: IPlayerInfoWithoutCharacters
    })) {
    
    let char = buildDefaultICharacterData()
    let defaultRule = buildDefaultICharacterRule()

    for (let i = 0; i < characters.length; ++i) {
        if (characters[i].name == currentCharacterName) {
            char = characters[i]
        }
    }

    const emptyRatings : IArtifactRating[] = []
    const [ratingLoaded, setRatingLoaded] = useState(false)
    const [artifactRatings, setArtifactRatings] = useState(emptyRatings)
    const [rule, setRule] = useState(defaultRule)
    const cbSetRule = (r: ICharacterRule) => {
        setRule(r)
    }
    useEffect(() => {
        const f = async () => {
            try {
                let url = "/api/rules"
                const form = {
                    uid: uid,
                    rule: rule
                }

                await fetch(url, {method: "POST", body: JSON.stringify(form)})
                const ratings = await apiLogicComputeArtifactRating(char, rule)
                
                setArtifactRatings(ratings.content!)
                setRatingLoaded(true)
            } catch (e) {

            }
        }

        f()
    }, [rule])

    useEffect(() => {
        const f = async () => {
            try {
                const r = await fetch("/api/rules?character=".concat(char.name,"&uid=", uid))
                const ans = await r.json()
                setRule(ans)
            } catch (e) {

            }
        }
        f()
    }, [])

    let colorDirector = new ColorDirector(char.element)
    let config = new ConfigDirector(iconfig)

    const [tabMode, setTabMode] = useState(ETabMode.ARTIFACTS)

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


    const [popupId, setPopupId] = useState(0)

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
        let content = <div>
            <div className="pl-2 font-semibold bg-red-400 rounded-t-md">Missing values after stats processing</div>
                <ul>
                    {anomalyStats}
                </ul>
            </div>;
        anomalyCards.push(<Card content={content}/>)
    }

    let topTabContent = <div></div>
    switch (tabMode) {
        case ETabMode.ARTIFACTS:
        default:
            if (ratingLoaded) {
                topTabContent = <FullEquipCard character={characterData} artifactRatings={artifactRatings}/>
            }
            break;
        
        case ETabMode.TALENT_VALUES:
            topTabContent = <FullTalentCard character={characterData} />
            break;
    }
    return <ConfigContext.Provider value={{colorDirector: colorDirector, config: config}}>
        <BackgroundComponent character={characterData}/>
        <div className="flex flex-col p-1 gap-1 h-screen w-full">
            <div className="flex flex-col relative h-15">
                <div className={"flex flex-row gap-1 h-full"}>
                    <div className="flex flex-row gap-1 h-full w-full">
                        <NavigationComponent currentCharacter={characterData} characterList={characters} uid={uid} popupId={popupId} setPopupId={setPopupId}/>
                        <RuleCard rule={rule} characterData={characterData} setRuleCallback={cbSetRule} popupId={popupId} setPopupId={setPopupId}/>
                        <TopTabSwitcher currentMode={tabMode} currentModeCallback={setTabMode} />
                    </div>
                    <div className="flex flex-row gap-1 h-full w-full place-content-end">
                        <PlayerInfoCardSmall info={playerInfo} />
                        <LogButton popupId={popupId} setPopupId={setPopupId}/>
                    </div>
                </div>
                <div>
                </div>
                {/* <TopOverSpace content={hiddableContent} /> */}
            </div>
            <div className={"flex flex-row gap-1 h-full w-full"}>
                <div className={"flex flex-col h-full gap-1"}>
                    <CharacterCard char={characterData} />
                </div>
                <div className={"flex flex-col h-full w-full gap-1"}>
                    {topTabContent}
                    <div className="flex flex-row flex-wrap h-full w-full gap-1">
                        <div className="flex flex-col gap-1 max-h-full max-w-large grow">
                            <StatCard character={characterData} statbag={statBag}/>
                            {anomalyCards}
                        </div>
                        <div className="flex flex-col gap-1 max-h-full max-w-large grow">
                            <EffectList char={characterData} effects={characterData.staticEffects} type={EEffectListType.STATIC} cb={effectCb}/>
                        </div>
                        <div className="flex flex-col gap-1 max-w-large max-h-full grow">
                            {/* <TalentCard character={characterData} fieldName="skill" /> */}
                            <EffectList char={characterData} effects={characterData.dynamicEffects} type={EEffectListType.DYNAMIC} cb={effectCb}/>
                            <EffectCardExplorer allCards={effectCards} addToCharacterCb={addToCharacterCb} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </ConfigContext.Provider>
}