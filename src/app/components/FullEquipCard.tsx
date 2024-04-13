import AscensionCard from "./AscensionCard";
import { ICharacterRule } from "../interfaces/ICharacterRule";
import ArtifactCard, { IArtifactCardInfo } from "./ArtifactCard";
import WeaponCard from "./WeaponCard";
import { ICharacterData } from "@/server/gamedata/ICharacterData";
import { EArtifact } from "@/server/gamedata/enums/EArtifact";
import { IArtifact } from "@/server/gamedata/IArtifact";
import Card, { ECardSize } from "./Card";
import { IStatTuple } from "@/server/gamedata/IStatTuple";
import { EStat } from "@/server/gamedata/enums/EStat";

export function FullEquipCard({character, rule}:{character : ICharacterData, rule: ICharacterRule}) {

    let mvs: IStatTuple[] = []
    for (let i = 0; i < rule.stats.length; ++i) {
        mvs.push(rule.stats[i])
    }

    mvs.sort((a, b) => b.value - a.value)

    const getRuleValue = (e: EStat) => {
        for (let i = 0; i < rule.stats.length; ++i) {
            if (rule.stats[i].name == e) {
                return rule.stats[i].value
            }
        }

        return 0;
    }

    function computeArtifactScoreInfo(a: IArtifact) {
        let score = 0
        let totalRolls = 0
        let totalRollsOnlyPercent = 0

        let mainIndex = 0
        let div = 1;
        if (mvs[mainIndex].name == a.mainStat.name) {
            mainIndex += 1
        }

        div = 6 * mvs[mainIndex].value
        for (let i = mainIndex + 1; i < mainIndex + 4; ++i) {
            if (mvs[i].name != a.mainStat.name) {
                div += mvs[i].value
            } else {
                mainIndex += 1
            }
        }

        div = Math.max(1, div)

        for (let i = 0; i < a.subStats.length; ++i) {
            score += a.subStats[i].rollValue * getRuleValue(a.subStats[i].name)
            totalRolls += a.subStats[i].rollValue
            if (a.subStats[i].name == EStat.EM || a.subStats[i].name.toString().includes("%")) {
                totalRollsOnlyPercent += a.subStats[i].rollValue
            }
        }

        let scaledScoreValue = score / (totalRolls/9*div)

        const res: IArtifactCardInfo = {
            rule: rule,
            totalRolls: totalRolls,
            potentialAll: totalRolls/9,
            potentialAllPercent : totalRolls/9 * 100,
            potentialP: totalRollsOnlyPercent/9,
            potentialPPercent : totalRollsOnlyPercent/9 * 100,
            scaledScore: scaledScoreValue,
            scaledScorePercent: scaledScoreValue * 100,
            totalScore: score/div,
            totalScorePercent: score/div * 100,
            div: div
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
    for (let i = 0; i < arteScores.length; ++i) {
        totalScore += arteScores[i].totalScorePercent
    }
    totalScore = totalScore/5
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