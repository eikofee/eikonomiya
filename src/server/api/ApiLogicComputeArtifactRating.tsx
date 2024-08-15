import { ICharacterRule } from "@/app/interfaces/ICharacterRule";
import { ICharacterData } from "../gamedata/ICharacterData";
import { EArtifact } from "../gamedata/enums/EArtifact";
import { EStat, statIsPercentage } from "../gamedata/enums/EStat";
import { IArtifact } from "../gamedata/IArtifact";
import { IStatTuple } from "../gamedata/IStatTuple";
import { IApiResult } from "@/app/interfaces/IApiResult";

export interface IArtifactRating {
        individualRolls: number[],          // roll sum for each substat
        totalRolls: number,                 // total number of rolls (70%-100%) on the artifact
        potentialAll: number,               // rolls (70-100) scaled to 100% with 100% = 100% roll * 9
        potentialValuable: number,          // same but excluding flat, non-EM stats
        usefulness: number,                 // same but only including rule stats
        ratingScore: number,                 // scaled down to max rule stat available (same as usefulness if rule stats count >= 4)
        artifactMaxScore: number,           // maximum score obtainable on that artifact considering the rules
        accounted: boolean                  // true if there is at least one available substat from the rules in the artifact
}

export async function apiLogicComputeArtifactRating(character: ICharacterData, rule: ICharacterRule) : Promise<IApiResult<IArtifactRating[]>> {
    
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
        let accounted = true
        let wishStatCount = mvs.filter(x => x.value > 0).length
        if (mvs.filter(x => x.name == a.mainStat.name).length > 0 && mvs.filter(x => x.name == a.mainStat.name)[0].value == 1) {
            wishStatCount -= 1
        }

        if (wishStatCount <= 0) {
            accounted = false
        }

        let artifactMaxScore = 0
        if (wishStatCount > 0) {
            artifactMaxScore = 6 + Math.min(3, wishStatCount - 1)
        }

        const rolls = []
        for (let i = 0; i < a.subStats.length; ++i) {
            rolls.push(a.subStats[i].rollValue)
            score += a.subStats[i].rollValue * getRuleValue(a.subStats[i].name)
            totalRolls += a.subStats[i].rollValue
            if (statIsPercentage(a.subStats[i].name) || a.subStats[i].name == EStat.EM) {
                potentialValuable += a.subStats[i].rollValue
            }
        }
        const res: IArtifactRating = {
            individualRolls: rolls,
            totalRolls: totalRolls,
            potentialAll: totalRolls / 9,
            potentialValuable: potentialValuable / 9,
            usefulness: score / 9,
            artifactMaxScore: artifactMaxScore,
            ratingScore: score / artifactMaxScore,
            accounted: accounted
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

    const res : IApiResult<IArtifactRating[]> = {
        success: true,
        content: arteScores
    }
    
    return res
}