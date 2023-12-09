import AscensionCard from "./AscensionCard";
import { ICharacterRule } from "../interfaces/ICharacterRule";
import { ICharacter } from "../interfaces/ICharacter";
import ArtefactCard from "./ArtefactCard";
import WeaponCard from "./WeaponCard";

export function FullEquipCard({character, rule}:{character : ICharacter, rule: ICharacterRule}) {
    return (
        <div className="max-w-5xl basis-1/4 grid lg:grid-cols-7 md:grid-cols-3 sm:grid-cols-2 gap-2 p-1 bg-inherit">
                        <AscensionCard char={character} />
                        <WeaponCard equip={character.weapon} rule={rule}/>
                        <ArtefactCard equip={character.artefacts.fleur} rule={rule}/>
                        <ArtefactCard equip={character.artefacts.plume} rule={rule}/>
                        <ArtefactCard equip={character.artefacts.sablier} rule={rule}/>
                        <ArtefactCard equip={character.artefacts.coupe} rule={rule}/>
                        <ArtefactCard equip={character.artefacts.couronne} rule={rule}/>
        </div>
    )
}