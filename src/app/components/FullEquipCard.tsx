import AscensionCard from "./AscensionCard";
import { ICharacterRule } from "../interfaces/ICharacterRule";
import ArtifactCard from "./ArtifactCard";
import WeaponCard from "./WeaponCard";
import { useState } from "react";
import { ICharacterData } from "@/server/gamedata/ICharacterData";
import { EArtifact } from "@/server/gamedata/enums/EArtifact";
import { IArtifact } from "@/server/gamedata/IArtifact";
import Card, { ECardSize } from "./Card";

export function FullEquipCard({character, rule}:{character : ICharacterData, rule: ICharacterRule}) {

    let [scoreFleur, setScoreFleur] = useState(0)
    let [scorePlume, setScorePlume] = useState(0)
    let [scoreSablier, setScoreSablier] = useState(0)
    let [scoreCoupe, setScoreCoupe] = useState(0)
    let [scoreCouronne, setScoreCouronne] = useState(0)

    const totalScore = (scoreFleur + scorePlume + scoreSablier + scoreCoupe + scoreCouronne) / 5
    const totalScoreContent = <div className="h-full flex flex-col w-full justify-center items-center font-semibold">
        <div>Score :</div>
        <div>{totalScore.toFixed(0).concat("%")}</div>
    </div>

    const arteTypes = [EArtifact.FLEUR, EArtifact.PLUME, EArtifact.SABLIER, EArtifact.COUPE, EArtifact.COURONNE]
    let artes : IArtifact[] = []
    for (let i = 0; i < arteTypes.length; ++i) {
        for (let j = 0; j < character.artifacts.length; ++j) {
            if (character.artifacts[j].type == arteTypes[i]) {
                artes.push(character.artifacts[j])
            }
        }
    }
    let mvs = []
    for (let i = 0; i < rule.stats.length; ++i) {
        mvs.push(rule.stats[i])
    }
    mvs.sort((a, b) => b.value - a.value)

    return (
        <div className="grid grow grid-cols-auto-fit-small gap-1 bg-inherit">
                        <div className="flex flex-col gap-1">
                            <AscensionCard char={character} />
                            <Card content={totalScoreContent} grow={true} maxw={ECardSize.SEMI}/>
                        </div>
                        <WeaponCard equip={character.weapon} rule={rule}/>
                        { artes[0] != undefined ? <ArtifactCard equip={artes[0]} rule={rule} scoreState={setScoreFleur} sortedStats={mvs} /> : ""}
                        { artes[1] != undefined ? <ArtifactCard equip={artes[1]} rule={rule} scoreState={setScorePlume} sortedStats={mvs} /> : ""}
                        { artes[2] != undefined ? <ArtifactCard equip={artes[2]} rule={rule} scoreState={setScoreSablier} sortedStats={mvs} /> : ""}
                        { artes[3] != undefined ? <ArtifactCard equip={artes[3]} rule={rule} scoreState={setScoreCoupe} sortedStats={mvs} /> : ""}
                        { artes[4] != undefined ? <ArtifactCard equip={artes[4]} rule={rule} scoreState={setScoreCouronne} sortedStats={mvs} /> : ""}
        </div>
    )
}