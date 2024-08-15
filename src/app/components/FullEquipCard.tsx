import AscensionCard from "./AscensionCard";
import { ICharacterRule } from "../interfaces/ICharacterRule";
import WeaponCard from "./WeaponCard";
import { ICharacterData } from "@/server/gamedata/ICharacterData";
import { EArtifact } from "@/server/gamedata/enums/EArtifact";
import { IArtifact } from "@/server/gamedata/IArtifact";
import Card, { ECardSize } from "./Card";
import { IStatTuple } from "@/server/gamedata/IStatTuple";
import { EStat, statIsPercentage } from "@/server/gamedata/enums/EStat";
import { apiLogicComputeArtifactRating, IArtifactRating } from "@/server/api/ApiLogicComputeArtifactRating";
import ArtifactCard from "./ArtifactCard";

export function FullEquipCard({character, artifactRatings}:{character : ICharacterData, artifactRatings : IArtifactRating[]}) {

    const arteTypes = [EArtifact.FLEUR, EArtifact.PLUME, EArtifact.SABLIER, EArtifact.COUPE, EArtifact.COURONNE]
    let artes : IArtifact[] = []
    for (let i = 0; i < arteTypes.length; ++i) {
        for (let j = 0; j < character.artifacts.length; ++j) {
            if (character.artifacts[j].type == arteTypes[i]) {
                artes.push(character.artifacts[j])
            }
        }
    }

    let totalScore = 0
    let eligible = 0
    for (let i = 0; i < artifactRatings.length; ++i) {
        if (artifactRatings[i].accounted) {
            totalScore += artifactRatings[i].ratingScore * 100
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
        arteCards.push(<ArtifactCard key={"artifact-".concat(i.toString())} equip={artes[i]} rating={artifactRatings[i]} />)
    }

    return (
        <div className="grid grow grid-cols-auto-fit-small gap-1">
                        <div className="flex flex-col gap-1">
                            <AscensionCard char={character} />
                            <Card content={totalScoreContent} grow={true} maxw={ECardSize.SEMI}/>
                        </div>
                        <WeaponCard equip={character.weapon} />
                        {arteCards}
        </div>
    )
}