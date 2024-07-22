import { IPlayerInfo, IPlayerInfoWithoutCharacters } from "@/server/gamedata/IPlayerInfo"
import { ImgApi } from "../ImgApi"
import SmallField from "./SmallField"
import { toApiName } from "@/app/utils"

export default function PlayerInfoCardSmall({info} : {info: IPlayerInfo | IPlayerInfoWithoutCharacters}) {
    let content = <div className="items-center h-full w-full flex flex-row cursor-pointer relative">
                        <div className="absolute inset-y-0 -left-2 overflow-hidden">
                            <ImgApi className="h-full" src={toApiName(info.profilePictureCharacterName)} alt={""} />
                        </div>
                        <div className={"text-center absolute top-2 left-[75px] -right-2 text-ellipsis bg-slate-100/70 rounded-md font-bold text-l"}>
                            {info.name}
                        </div>
                        <div className="flex flex-row absolute gap-x-2 left-[75px] -right-2 bottom-2 h-1/3 items-stretch">
                            <SmallField key="field-count" content={[<ImgApi key="i1" className="h-full" src={"generic_achievementsL"} alt={""} />, <div key="i2">{info.achievementCount}</div>]} />
                            <SmallField key="field-abysses" content={[<ImgApi key="i1" className="h-full" src={"generic_abyssesL"} alt={""} />, <div key="i2">{info.abysses.floor}-{info.abysses.chamber}</div>]} />
                            <SmallField key="field-theater" content={[<ImgApi key="i1" className="h-full" src={"generic_abyssesL"} alt={""} />, <div key="i2">???</div>]} />
                        </div>
                    </div>
    return <div className="w-1/4 min-h-[75px] min-w-[300px] transition ease-in-out group rounded-md border bg-white/25 px-3 cursor-pointer z-10 mb-2 hover:shadow-lg" style={{
        backgroundImage : "url(https://enka.network/ui/".concat(info.namecardName, ".png)"),
        backgroundSize : "cover"
    }} ><a href={"/uid/".concat(info.uid)}>{content}</a></div>
}