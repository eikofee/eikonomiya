import { ICharacterData } from "@/server/gamedata/ICharacterData";
import { useContext, useState } from "react";
import { EAccentType } from "../classes/ColorDirector";
import { ConfigContext } from "./ConfigContext";
import { ImgApi } from "./ImgApi";
import MarkdownDescription from "./MarkdownDescription";
import Card from "./Card";

export default function TalentCard({character, fieldName}: {character: ICharacterData, fieldName: string}) {
    const [expandDescription, setExpandDescription] = useState(false)

    const toggleExpand = () => {
        setExpandDescription(!expandDescription)
    }

    const {colorDirector} = useContext(ConfigContext)
    let skillName = ""
    let skillDescription = [""]
    switch (fieldName) {
        case "aa":
            skillName = character.talents.aa.name
            skillDescription = character.talents.aa.description
            break;
        case "skill":
            skillName = character.talents.aa.name
            skillDescription = character.talents.aa.description
            break;
        case "burst":
            skillName = character.talents.aa.name
            skillDescription = character.talents.aa.description
            break;
    }

    const content = 
    <div key="effect-child" className={"w-full rounded-t-md"}>
        <div className={"flex flex-row justify-between ".concat(colorDirector.bgAccent(7))}> 
            <div className="flex flex-row">
                <div className="aspect-square w-8 place-self-start">
                    <ImgApi key={"talent-".concat(fieldName)} src={"characters_".concat(character.name, "_", fieldName)} />
                </div>
                <div className="pl-2 text-sm font-semibold place-self-center grow">{skillName}</div>
            </div>
            <button onClick={toggleExpand} className={"pr-2 text-sm text-right cursor-pointer ".concat(colorDirector.textAccent(3))}>{expandDescription ? "Collapse" : "Expand"}</button>
        </div>
        {/* {effect.tag != "" ? <div className={"text-right place-self-end self-center h-1/2 rounded-md text-xs mr-2 p-1 text-white ".concat(colorDirector.bgAccent(EAccentType.STRONG))}>{effect.tag}</div> : ""} */}
        {expandDescription ? <div> {skillDescription.map(x => <MarkdownDescription html={x} />)}</div>
             : ""}
    </div>

    return <Card content={content} />
}