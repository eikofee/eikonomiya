import { ICharacter } from "../interfaces/ICharacter";

export default function CharacterCard({char} : {char: ICharacter}) {
    return (
        <div className="flex flex-col">
            <div>
                <img src={"/characterCards/".concat(char.iconName, ".jpeg")} />
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