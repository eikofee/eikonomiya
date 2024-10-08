import { ReactNode, useContext, useState } from "react";
import { ConfigContext } from "./ConfigContext";
import { ICharacterData } from "@/server/gamedata/ICharacterData";
import { EStat, eStatToReadable, stringToEStat } from "@/server/gamedata/enums/EStat";
import { IStatBag } from "@/server/gamedata/IStatBag";
import StatLineDraw from "./StatLineDrawer";
import Card, { ECardSize } from "./Card";

export interface ILine {
    name: ReactNode
    value: ReactNode
    info?: ReactNode
}

export default function StatCard({character, statbag} : {character: ICharacterData, statbag: IStatBag}) {

    let ls = []
    const getStat = (name: EStat) => {
        for (let i = 0; i < statbag.names.length; ++i) {
            if (statbag.names[i] == name) {
                return statbag.values[i]
            }
        }

        return 0
    }

    const [expanded, setExpanded] = useState(false)

    const toggleExpand = () => {
        setExpanded(!expanded)
    }

    const {colorDirector} = useContext(ConfigContext)
    const finalHP = character.baseStats.hp * (1+getStat(EStat.HP_P)) + getStat(EStat.HP)
    const finalATK = (character.baseStats.atk_nw! + character.weapon.mainStat.value) * (1+getStat(EStat.ATK_P)) + getStat(EStat.ATK)
    const finalDEF = character.baseStats.def * (1+getStat(EStat.DEF_P)) + getStat(EStat.DEF)
    let baseStat = ["hp", "atk", "def"]
    let baseValues = [finalHP, finalATK, finalDEF]
    let subBase = 0;
    let subBonus = 0;
    let subFlat = 0;
    for (let i = 0; i < baseStat.length; ++i) {

        let info = <p></p>
        switch (baseStat[i]) {
            case "hp":
                // info = <p>{character.commonData.baseStats.hp.toFixed(0)} * (100% + {(getStat(EStat.HP_P) * 100).toFixed(1)}%) + {getStat(EStat.HP).toFixed(0)}</p>
                subBase = character.baseStats.hp
                subBonus = getStat(EStat.HP_P)
                subFlat = getStat(EStat.HP)
                break;
            case "atk":
                // info = <p>({character.baseStats.atk_nw.toFixed(0)} + {character.weapon.mainStat.value.toFixed(0)}) * (100% + {(getStat(EStat.ATK_P) * 100).toFixed(1)}%) + {getStat(EStat.ATK).toFixed(0)}</p>
                subBase = character.baseStats.atk
                subBonus = getStat(EStat.ATK_P)
                subFlat = getStat(EStat.ATK)
                break;
            case "def":
                // info = <p>{character.baseStats.def.toFixed(0)} * (100% + {(getStat(EStat.DEF_P) * 100).toFixed(1)}%) + {getStat(EStat.DEF).toFixed(0)}</p>
                subBase = character.baseStats.def
                subBonus = getStat(EStat.DEF_P)
                subFlat = getStat(EStat.DEF)
                break;
            default:
                break;
        }

        ls.push(<StatLineDraw key={"stat-line-draw-".concat(i.toString())} name={baseStat[i]} value={baseValues[i]} rounded={false} /> )
        if (expanded) {
            ls.push(<StatLineDraw key={"stat-line-draw-".concat(i.toString(), "-expanded-base")} name="Base" value={subBase} rounded={false} sub={true}/>)
            if (subBonus > 0) {
                ls.push(<StatLineDraw key={"stat-line-draw-".concat(i.toString(), "-expanded-stat-p-bonus")} name="Stat% bonus" value={subBonus} secondaryValue={subBonus * subBase} rounded={false} sub={true}/>)
            }
            if (subFlat > 0) {
                ls.push(<StatLineDraw key={"stat-line-draw-".concat(i.toString(), "-expanded-flat")} name="Flat bonus" value={subFlat} prefix="+" rounded={false} sub={true}/>)
            }
        }

    }

    const statNames = Object.values(EStat).filter(x => !["hp", "atk", "def"].includes(x.replace("%", "")))
    const statValues = []
    for (let i = 0; i < statNames.length; ++i) {
        statValues.push(getStat(stringToEStat(statNames[i])))
    }
    for (let i = 0; i < statNames.length; ++i) {
        let s = statNames[i]
        if (statValues[i] > 0) {
            ls.push(<StatLineDraw key={"stat-line-draw-".concat(i.toString())} name={s} value={statValues[i]} rounded={i == statNames.length - 1} />)
        }
    }

    let content = <div>
        <div className="flex flex-row justify-between">
            <div className="pl-2 font-semibold">{"Basic Stats"}</div>
            <button onClick={toggleExpand} className={"pr-2 text-sm text-right cursor-pointer ".concat(colorDirector.textAccent(3))}>{expanded ? "Collapse" : "Expand"}</button>
        </div>
        <ul>
            {ls}
        </ul>
    </div>;

    return(
        <Card content={content} minw={ECardSize.LARGE} maxw={ECardSize.VERY_LARGE}/>
    )
}