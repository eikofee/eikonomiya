import { ICharacter } from "../interfaces/ICharacter";

export default function BackgroundComponent({character} : {character: ICharacter}) {
    let bg = "bg-fontaine"
    switch (character.region) {
        case "mondstadt":
            bg = "bg-mondstadt"
            break;
        case "liyue":
            bg = "bg-liyue"
            break;
        case "inazuma":
            bg = "bg-inazuma"
            break;
        case "sumeru":
            bg = "bg-sumeru"
            break;
        case "fontaine":
            bg = "bg-fontaine"
            break;
            
    }
    return <div className={"-z-10 fixed w-screen h-screen top-0 left-0 bg-cover blur-md ".concat(bg)} ></div>
}