    import { ReactNode, useContext } from "react";
import { Card } from "./Card";
import { ICharacter } from "../interfaces/ICharacter";
import { listStatSetLabels } from "../interfaces/IStatSet";
import Icon from "./Icon";
import { ThemeContext } from "./ThemeContext";
import Tooltip from "./Tooltip";

export interface ILine {
    name: ReactNode
    value: ReactNode
    info?: ReactNode
}

export default function StatCard({character} : {character: ICharacter}) {

    let ls = []
    const {colorDirector} = useContext(ThemeContext)
    const finalHP = character.character.baseHP * (1+character.totalStats["HP%"]) + character.totalStats["HP"]
    const finalATK = (character.character.baseATK + character.weapon.mainStatValue) * (1+character.totalStats["ATK%"]) + character.totalStats["ATK"]
    const finalDEF = character.character.baseDEF * (1+character.totalStats["DEF%"]) + character.totalStats["DEF"]
    let baseStat = ["HP", "ATK", "DEF"]
    let baseValues = [finalHP, finalATK, finalDEF]
    for (let i = 0; i < baseStat.length; ++i) {
        // let classname = "flex flex-row justify-between items ".concat(i%2 == 0 ? colorDirector.bg(0) : colorDirector.bg(1))
        let classname = "flex flex-row justify-between items p-1"
        let n = <div className="flex flex-row items-center"><Icon n={baseStat[i]} /> <span className="pl-1">{baseStat[i]}</span></div>
        let v = <div>{baseValues[i].toFixed(0).toString()}</div>
        let info = <p></p>
        switch (baseStat[i]) {
            case "HP":
                info = <p>{character.character.baseHP.toFixed(0)} * (100% + {(character.totalStats["HP%"] * 100).toFixed(1)}%) + {character.totalStats["HP"].toFixed(0)}</p>
                break;
            case "ATK":
                info = <p>({character.character.baseATK.toFixed(0)} + {character.weapon.mainStatValue.toFixed(0)}) * (100% + {(character.totalStats["ATK%"] * 100).toFixed(1)}%) + {character.totalStats["ATK"].toFixed(0)}</p>
                break;
            case "DEF":
                info = <p>{character.character.baseDEF.toFixed(0)} * (100% + {(character.totalStats["DEF%"] * 100).toFixed(1)}%) + {character.totalStats["DEF"].toFixed(0)}</p>
                break;
            default:
                break;
        }
        ls.push(
        <li className={classname}>
            <div className="text-left basis-3/5 items-center">{n}</div>
            <Tooltip child={
                <div className="text-right basis-2/5 pr-2">{v}</div>
            } info={info} />
        </li>)
    }

    let statNames = ["EM", "ER%", "Crit Rate%", "Crit DMG%"]
    let statValues = [character.totalStats.EM, character.totalStats["ER%"], character.totalStats["Crit Rate%"], character.totalStats["Crit DMG%"], character.totalStats["Elem%"]]
    for (let i = 0; i < statNames.length; ++i) {
        let s = statNames[i]
        // let classname = "flex flex-row justify-between items ".concat(i%2 == 1 ? colorDirector.bg(0) : colorDirector.bg(1))
        let classname = "flex flex-row justify-between items p-1"
        if (i == statNames.length - 1) {
            classname += " rounded-b-md"
        }
        let n = <div className="flex flex-row items-center"><Icon n={s} /> <span className="pl-1">{s}</span></div>
        let value = statValues[i] * (s.includes("%") ? 100 : 1)
        let fv = (s.includes("%") ? 1 : 0)
        let v = <div>{value.toFixed(fv).toString().concat(s.includes("%") ? "%" : "")}</div>
        ls.push(
        <li className={classname}>
            <div className="text-left basis-3/5 items-center">{n}</div>
            <div className="text-right basis-2/5 pr-2">{v}</div>
        </li>)
    }
    
    let content = <div className="bg-inherit">
        <div className="pl-2 font-semibold">{"Basic Stats"}</div>
        <ul>
            {ls}
        </ul>
    </div>;

    return(
        <Card c={content}/>
    )
}