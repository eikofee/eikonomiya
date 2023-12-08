import { useContext } from "react";
import { ICharacter } from "../interfaces/ICharacter";
import { ThemeContext } from "./ThemeContext";

export default function CharacterCard({char} : {char: ICharacter}) {
    const {colorDirector} = useContext(ThemeContext)
    let bgClass = "w-full h-full flex flex-col ".concat(colorDirector.bg(1))
    // let bgClass = "flex flex-col bg-blue-100"
    return (
        <div className={bgClass}>
            <div>
                <img src={"/characterCards/".concat(char.name.toLocaleLowerCase(), ".jpeg")} />
            </div>
            <div className="grid grid-cols-3">
                <div>Skill 1</div>
                <div>Skill 2</div>
                <div>Skill 3</div>
            </div>
            <div className="grid grid-cols-3">
                <div>Const 1</div>
                <div>Const 2</div>
                <div>Const 3</div>
                <div>Const 4</div>
                <div>Const 5</div>
                <div>Const 6</div>
            </div>

        </div>
    )
}