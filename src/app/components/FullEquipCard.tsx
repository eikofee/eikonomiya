import AscensionCard from "./AscensionCard";
import { ICharacterRule } from "../interfaces/ICharacterRule";
import { ICharacter } from "../interfaces/ICharacter";
import ArtefactCard from "./ArtefactCard";
import WeaponCard from "./WeaponCard";
import { useState } from "react";
import { Card } from "./Card";

export function FullEquipCard({character, rule}:{character : ICharacter, rule: ICharacterRule}) {

    let [scoreFleur, setScoreFleur] = useState(0)
    let [scorePlume, setScorePlume] = useState(0)
    let [scoreSablier, setScoreSablier] = useState(0)
    let [scoreCoupe, setScoreCoupe] = useState(0)
    let [scoreCouronne, setScoreCouronne] = useState(0)

    const totalScore = (scoreFleur + scorePlume + scoreSablier + scoreCoupe + scoreCouronne) / 5
    const totalScoreContent = <div className="h-full flex flex-row items-center align-baseline font-semibold">
    <p className="text-center w-full ml-2">
        Score : {totalScore.toFixed(0).concat("%")}
    </p>
</div>
    return (
        <div className="max-w-5xl basis-1/4 grid lg:grid-cols-7 md:grid-cols-3 sm:grid-cols-2 gap-2 p-1 bg-inherit h-full">
                        <div className="flex flex-col gap-y-1">
                            <AscensionCard char={character} />
                            <Card c={totalScoreContent} cname={"grow items-center"} />
                        </div>
                        <WeaponCard equip={character.weapon} rule={rule}/>
                        <ArtefactCard equip={character.artefacts.fleur} rule={rule} scoreState={setScoreFleur}/>
                        <ArtefactCard equip={character.artefacts.plume} rule={rule} scoreState={setScorePlume}/>
                        <ArtefactCard equip={character.artefacts.sablier} rule={rule} scoreState={setScoreSablier}/>
                        <ArtefactCard equip={character.artefacts.coupe} rule={rule} scoreState={setScoreCoupe}/>
                        <ArtefactCard equip={character.artefacts.couronne} rule={rule} scoreState={setScoreCouronne}/>
        </div>
    )
}