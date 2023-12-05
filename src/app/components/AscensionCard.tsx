import { ICharacter } from "../interfaces/ICharacter";
import { Card } from "./Card";
import Icon from "./Icon";

export default function AscensionCard({char} : {char: ICharacter}) {
    let statLine = (statName : string, statValue : number) =>
        <li className="flex justify-between place-items-center">
            <div className="w-full flex flex-row items-center">
                            <div className="text-left basis-3/5 max-h-4">
                                <Icon n={statName}/>
                            </div>
                            <div className="text-right basis-2/5">
                                {(statName.includes("%") ? (statValue * 100).toFixed(1): statValue.toFixed(0)).concat(statName.includes("%") ? "%" : "")}
                            </div>
                        </div>
        </li>
    let content = <div className="flex flex-col h-full">
    <div className="aspect-square grad-5star basis-1/5 flex items-center justify-center h-full rounded-t-md">
        <img src={"/characterPortraits/".concat(char.iconName, ".png")} className="max-w-full max-h-full"/>
    </div>
    <div className="basis-3/5 px-1 py-2">
        <ul>
            <li><div className="w-full flex flex-row items-baseline font-semibold">
                            <div className="text-left  basis-3/5 max-h-4">
                                Level
                            </div>
                            <div className="text-right basis-2/5">
                                {char.level}
                            </div>
            </div></li>
            {statLine("HP", char.baseHP!)}
            {statLine("ATK", char.baseATK!)}
            {statLine("DEF", char.baseDEF!)}
            {statLine(char.ascensionStatName!, char.ascensionStatValue!)}
        </ul>
    </div>
</div>

return (
    <Card c={content}/>
)
}