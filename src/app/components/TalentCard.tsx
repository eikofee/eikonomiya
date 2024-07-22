import { ICharacterData } from "@/server/gamedata/ICharacterData";
import { ITalent } from "@/server/gamedata/ITalent";
import Card, { ECardSize } from "./Card";
import { useContext } from "react";
import { EAccentType } from "../classes/ColorDirector";
import { ConfigContext } from "./ConfigContext";
import { ImgApi } from "./ImgApi";
import { ETalentType, eTalentTypeToTag } from "@/server/gamedata/enums/ETalentType";
import { ENumericFieldAttribute, ENumericFieldAttributeToUnit } from "@/server/gamedata/enums/ENumericFieldAttribute";

export default function TalentCard({character, talent} : {character: ICharacterData, talent: ITalent}) {

    const {colorDirector} = useContext(ConfigContext)

    let talentLine = (name : string, value : number, attribute : ENumericFieldAttribute, isPercentage: boolean) =>{
        return <li className="flex justify-between place-items-center">
            <div className="w-full flex flex-row items-center px-1">
                            <div className="text-left text-sm">
                                {name}
                            </div>
                            <div className="text-right grow text-sm">
                                {isPercentage ? (value * 100).toFixed(1): value.toString()}
                                {isPercentage ? "%" : ""}
                                {ENumericFieldAttributeToUnit(attribute)}
                            </div>
                        </div>
        </li>
    }

    let ls = []
    for (let i = 0; i < talent.fields.length; ++i) {
        ls.push(talentLine(talent.fields[i].name, talent.fields[i].values[0].leveledValues[talent.level - 1 + talent.bonusLevel], talent.fields[i].values[0].attribute, !talent.fields[i].values[0].flat))
    }

    let title = <div key="effect-child" className={"flex flex-row flex-grow w-full rounded-t-md ".concat(colorDirector.bgAccent(7))}>
    {/* <img alt="" src={effect.icon} className="aspect-square w-8 place-self-start"/> */}
    <div className="aspect-square w-8 place-self-start">
        <ImgApi key="talent-icon" src={talent.type == ETalentType.NORMAL ? "generic_".concat(character.weaponType.toString().toLowerCase()) : "characters_".concat(character.apiName, "_", talent.type.toString())} />
    </div>
    <div className="pl-2 text-sm font-semibold place-self-center grow">{talent.name}</div>
    <div className="pr-2 text-xs text-right self-center"> Lv. {talent.level + talent.bonusLevel}</div>
    <div className={"text-right place-self-end self-center h-1/2 rounded-md text-xs mr-2 p-1 text-white ".concat(colorDirector.bgAccent(EAccentType.STRONG))}>{eTalentTypeToTag(talent.type)}</div>
</div>

    let content = <div className="bg-inherit">
        {title}
        <ul key="talent-list">
            {ls}
        </ul>
    </div>;

    return <Card content={content} minw={ECardSize.LARGE} />
}