import { ReactNode, useContext } from "react";
import { Card } from "./Card";
import Icon from "./Icon";
import { ThemeContext } from "./ThemeContext";
import Tooltip from "./Tooltip";
import { ICharacterData } from "@/server/gamedata/ICharacterData";
import { EStat } from "@/server/gamedata/enums/EStat";

export interface ILine {
    name: ReactNode
    value: ReactNode
    info?: ReactNode
}

export default function StatCard({character} : {character: ICharacterData}) {

    let ls = []
    const getStat = (name: EStat) => {
        for (let i = 0; i < character.totalStats.names.length; ++i) {
            if (character.totalStats.names[i] == name) {
                return character.totalStats.values[i]
            }
        }

        return 0
    }
    const {colorDirector} = useContext(ThemeContext)
    const finalHP = character.commonData.baseStats.hp * (1+getStat(EStat.HP_P)) + getStat(EStat.HP)
    const finalATK = (character.commonData.baseStats.atk_nw! + character.weapon.mainStat.value) * (1+getStat(EStat.ATK_P)) + getStat(EStat.ATK)
    const finalDEF = character.commonData.baseStats.def * (1+getStat(EStat.DEF_P)) + getStat(EStat.DEF)
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
                info = <p>{character.commonData.baseStats.hp.toFixed(0)} * (100% + {(getStat(EStat.HP_P) * 100).toFixed(1)}%) + {getStat(EStat.HP).toFixed(0)}</p>
                break;
            case "ATK":
                info = <p>({character.commonData.baseStats.atk.toFixed(0)} + {character.weapon.mainStat.value.toFixed(0)}) * (100% + {(getStat(EStat.ATK_P) * 100).toFixed(1)}%) + {getStat(EStat.ATK).toFixed(0)}</p>
                break;
            case "DEF":
                info = <p>{character.commonData.baseStats.def.toFixed(0)} * (100% + {(getStat(EStat.DEF_P) * 100).toFixed(1)}%) + {getStat(EStat.DEF).toFixed(0)}</p>
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
    let statValues = [getStat(EStat.EM), getStat(EStat.ER_P), getStat(EStat.CR_P), getStat(EStat.CDMG_P)]
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

    statNames = ["Phys%", "Anemo%", "Geo%", "Electro%", "Dendro%", "Hydro%", "Pyro%", "Cryo%", "Heal%"]
    statValues = [getStat(EStat.PHYS_DMG_P), getStat(EStat.ANEMO_DMG_P), getStat(EStat.GEO_DMG_P), getStat(EStat.ELECTRO_DMG_P), getStat(EStat.DENDRO_DMG_P), getStat(EStat.HYDRO_DMG_P), getStat(EStat.PYRO_DMG_P), getStat(EStat.CRYO_DMG_P), getStat(EStat.HEAL_OUT_P)]
    for (let i = 0; i < statNames.length; ++i) {
        let s = statNames[i]
        if (statValues[i] > 0) {

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