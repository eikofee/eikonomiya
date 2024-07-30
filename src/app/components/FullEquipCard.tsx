import AscensionCard from "./AscensionCard";
import { ICharacterRule } from "../interfaces/ICharacterRule";
import ArtifactCard, { IArtifactCardInfo } from "./ArtifactCard";
import WeaponCard from "./WeaponCard";
import { ICharacterData } from "@/server/gamedata/ICharacterData";
import { EArtifact } from "@/server/gamedata/enums/EArtifact";
import { IArtifact } from "@/server/gamedata/IArtifact";
import Card, { ECardSize } from "./Card";
import { IStatTuple } from "@/server/gamedata/IStatTuple";
import { EStat, statIsPercentage } from "@/server/gamedata/enums/EStat";

export function FullEquipCard({character, rule}:{character : ICharacterData, rule: ICharacterRule}) {

    let mvs: IStatTuple[] = []
    for (let i = 0; i < rule.stats.length; ++i) {
        mvs.push(rule.stats[i])
    }

    const getRuleValue = (e: EStat) => {
        for (let i = 0; i < rule.stats.length; ++i) {
            if (rule.stats[i].name == e) {
                return rule.stats[i].value
            }
        }

        return 0;
    }

    function computeArtifactScoreInfo(a: IArtifact) {
        let accounted = true
        let score = 0
        let totalRolls = 0
        let potentialValuable = 0

        let wishStatCount = mvs.filter(x => x.value > 0).length
        if (mvs.filter(x => x.name == a.mainStat.name).length > 0 && mvs.filter(x => x.name == a.mainStat.name)[0].value == 1) {
            wishStatCount -= 1
        }

        if (wishStatCount <= 0) {
            accounted = false
        }

        let artefactMaxScore = 0
        if (wishStatCount > 0) {
            artefactMaxScore = 6 + Math.min(3, wishStatCount - 1)
        }

        for (let i = 0; i < a.subStats.length; ++i) {
            score += a.subStats[i].rollValue * getRuleValue(a.subStats[i].name)
            totalRolls += a.subStats[i].rollValue
            if (statIsPercentage(a.subStats[i].name) || a.subStats[i].name == EStat.EM) {
                potentialValuable += a.subStats[i].rollValue
            }
        }
        const res: IArtifactCardInfo = {
            accounted: accounted,
            rule: rule,
            totalRolls: totalRolls,
            potentialAll: totalRolls/9,
            potentialAllPercent : totalRolls/9 * 100,
            potentialValuable: potentialValuable/9,
            potentialValuablePercent : potentialValuable/9 * 100,
            usefulness: score/9,
            usefulnessPercent: score/9 * 100,
            totalScore: score/artefactMaxScore,
            totalScorePercent: score/artefactMaxScore * 100,
            artefactMaxScore: artefactMaxScore
        }

        return res

    }

    const arteTypes = [EArtifact.FLEUR, EArtifact.PLUME, EArtifact.SABLIER, EArtifact.COUPE, EArtifact.COURONNE]
    let artes : IArtifact[] = []
    for (let i = 0; i < arteTypes.length; ++i) {
        for (let j = 0; j < character.artifacts.length; ++j) {
            if (character.artifacts[j].type == arteTypes[i]) {
                artes.push(character.artifacts[j])
            }
        }
    }

    const arteScores = artes.map(x => computeArtifactScoreInfo(x))

    let totalScore = 0
    let eligible = 0
    for (let i = 0; i < arteScores.length; ++i) {
        if (arteScores[i].accounted) {
            totalScore += arteScores[i].totalScorePercent
            eligible += 1
        }
    }
    if (eligible > 0) {
        totalScore = totalScore/eligible
    }
    
    const totalScoreContent = <div className="h-full flex flex-col w-full justify-center items-center font-semibold">
        <div>Score :</div>
        <div>{totalScore.toFixed(0).concat("%")}</div>
    </div>

    let arteCards = []
    for (let i = 0; i < artes.length; ++i) {
        arteCards.push(<ArtifactCard key={"artifact-".concat(i.toString())} equip={artes[i]} score={arteScores[i]} />)
    }

    return (
        <div className="grid grow grid-cols-auto-fit-small gap-1 bg-inherit">
                        <div className="flex flex-col gap-1">
                            <AscensionCard char={character} />
                            <Card content={totalScoreContent} grow={true} maxw={ECardSize.SEMI}/>
                        </div>
                        <WeaponCard equip={character.weapon} rule={rule}/>
                        {arteCards}
        </div>
    )
}