import { useContext } from "react";
import { ThemeContext } from "./ThemeContext";
import { Card } from "./Card";
import { ICharacterData } from "@/server/gamedata/ICharacterData";

export default function CharacterCard({char} : {char: ICharacterData}) {
    const {colorDirector} = useContext(ThemeContext)
    let bgClass = "max-w-md flex flex-col"
    let fname = char.assets!.characterCard
    let content = <div className={bgClass}>
    <div>
        <img className="rounded-t-md" src={fname} />
    </div>
    <div className="grid grid-cols-3 items-center">
        <p>Skill 1</p>
        <p>Skill 2</p>
        <p>Skill 3</p>
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
    return (
        <Card c={content} />
    )
}