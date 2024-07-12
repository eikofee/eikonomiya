import { ICharacterRule } from "@/app/interfaces/ICharacterRule";
import { ICharacterData } from "../gamedata/ICharacterData";
import { IArtifactCardInfo } from "@/app/components/ArtifactCard";
import { EArtifact } from "../gamedata/enums/EArtifact";
import { EStat, statIsPercentage } from "../gamedata/enums/EStat";
import { IArtifact } from "../gamedata/IArtifact";
import { IStatTuple } from "../gamedata/IStatTuple";
import { IApiResult } from "@/app/interfaces/IApiResult";

export async function apiLogicComputeArtifactRating(character: ICharacterData, rule: ICharacterRule) : Promise<IApiResult<ICharacterRule>> {
    
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
        let score = 0
        let totalRolls = 0
        let potentialValuable = 0

        let wishStatCount = mvs.filter(x => x.value > 0).length
        if (mvs.filter(x => x.name == a.mainStat.name).length > 0 && mvs.filter(x => x.name == a.mainStat.name)[0].value == 1) {
            wishStatCount -= 1
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
    rule.currentRating = arteScores.map(x => x.totalScorePercent/100)

    const res : IApiResult<ICharacterRule> = {
        success: true,
        content: rule
    }
    
    return res
}