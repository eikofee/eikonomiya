import { ICharacterData } from "@/server/gamedata/ICharacterData";
import TalentCard from "./TalentCard";

export function FullTalentCard({character} : {character: ICharacterData}) {
    return (
        <div className="grid grow grid-cols-auto-fit-small gap-1 bg-inherit">
                        <TalentCard character={character} talent={character.talents.auto} />
                        <TalentCard character={character} talent={character.talents.skill} />
                        <TalentCard character={character} talent={character.talents.burst} />
        </div>
    )
}