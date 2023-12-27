import { ICharacterData } from "@/server/gamedata/ICharacterData";
import { Card } from "./Card";
import Icon from "./Icon";
import { eStatToReadable } from "@/server/gamedata/enums/EStat";

export default function AscensionCard({char} : {char: ICharacterData}) {
    let statLine = (statName : string, statValue : number) =>{
        return <li className="flex justify-between place-items-center">
            <div className="w-full flex flex-row items-center">
                            <div className="text-left max-h-4">
                                <Icon n={statName}/>
                            </div>
                            <div className="text-right grow">
                                {(statName.includes("%") ? (statValue * 100).toFixed(1): statValue.toFixed(0)).concat(statName.includes("%") ? "%" : "")}
                            </div>
                        </div>
        </li>
    }
    let content = <div className="flex flex-col">
    <div className="aspect-square grad-5star basis-1/5 flex items-center justify-center h-full rounded-t-md">
        <img src={char.commonData.assets.characterPortrait} className="max-w-full max-h-full"/>
    </div>
    <div className="basis-3/5 px-1 py-2">
        <ul>
            <li><div className="w-full flex flex-row items-baseline font-semibold">
                            <div className="text-left max-h-4">
                                Level
                            </div>
                            <div className="text-right grow">
                                {char.level}
                            </div>
            </div></li>
            {statLine("HP", char.commonData.baseStats.hp)}
            {statLine("ATK", char.commonData.baseStats.atk_nw!)}
            {statLine("DEF", char.commonData.baseStats.def)}
            {statLine(eStatToReadable(char.ascensionStatName), char.ascensionStatValue)}
        </ul>
    </div>
</div>

return (
    <Card c={content}/>
)
}