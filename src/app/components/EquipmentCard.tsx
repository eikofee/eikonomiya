import { IEquipCardInfo } from "../interfaces/IEquipCardInfo";
import { Card } from "./Card";
import Icon from "./Icon";
import InfoDiv from "./Tooltip";

export default function EquipmentCard({equip} : {equip: IEquipCardInfo}) {

    let statList = []
    for (let i = 0; i < equip.stats.length; ++i) {
        let liClassName = "flex justify-between place-items-center " + (equip.stats[i].type == "main" ? "font-bold" : "")
        let rolls = []
        let bar = 0
        if (equip.stats[i].potential > 0) {
            for (bar = 1; bar < equip.stats[i].potential; ++bar) {
                rolls.push(<div className="h-1 bg-green-600 col-span-1" />)
            }

            let rest = equip.stats[i].potential - bar + 1;
            rolls.push(<div className="h-1 w-full bg-red-300 col-span-1 flex flex-row">
                <div className="h-1 bg-green-600" style={{width: (rest*100).toString().concat("%")}}/>
                </div>)

            for (bar = bar + 1; bar <= 5; ++bar) {
                rolls.push(<div className="h-1 bg-red-300 col-span-1" />)
            }
        }
        let statLine = <div className="w-full flex flex-row items-center">
                            <div className="text-left basis-3/5 max-h-4">
                                <Icon n={equip.stats[i].name}/>
                            </div>
                            <div className="text-right basis-2/5">
                                {equip.stats[i].isPercentage ? (equip.stats[i].value * 100).toFixed(1): equip.stats[i].value}{equip.stats[i].isPercentage ? "%" : ""}
                            </div>
                        </div>
        let infoLine = <p>{equip.stats[i].name}</p>
        statList.push(
        <li className={liClassName}>
            <div className="flex flex-col w-full py-1">
                <InfoDiv child={statLine} info={infoLine} />
                <div className="grid grid-cols-5 gap-x-0.5">
                    {rolls}
                </div>
            </div>
        </li>
        )
    }

    let content = <div className="flex flex-row h-full">
        <div className="grad-5star basis-3/5 flex items-center justify-center h-full rounded-l-md">
            <img src={equip.image} className="max-w-full max-h-full"/>
        </div>
        <div className="basis-2/5 px-1 py-2">
            <ul>
                {statList}
            </ul>
        </div>
    </div>

    return (
        <Card c={content}/>
    )
}