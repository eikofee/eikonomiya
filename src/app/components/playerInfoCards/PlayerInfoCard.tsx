import { IPlayerInfo, IPlayerInfoWithoutCharacters } from "@/server/gamedata/IPlayerInfo";
import { ImgApi } from "../ImgApi";
import SmallField from "./SmallField";

export default function PlayerInfoCard({info} : {info: IPlayerInfo | IPlayerInfoWithoutCharacters}) {
    let content = <div className="items-center h-full w-full flex flex-row cursor-pointer relative">
                        <div className="absolute inset-y-0 -left-2 overflow-hidden">
                            <ImgApi className="h-full" src={info.profilePictureCharacterName.toApiName()} alt={""} />
                        </div>
                        <div className={"p-1 text-center absolute top-2 left-[150px] text-ellipsis bg-slate-100/70 rounded-md font-bold text-2xl"}>
                            {info.name}
                        </div>
                        <div className="flex flex-row absolute gap-x-2 left-[150px] -right-2 bottom-2 justify-end items-end">
                            <div className="flex flex-col text-l h-18 w-18 text-ellipsis bg-slate-100/70 rounded-md p-1 justify-center text-center">
                                <ImgApi className="w-12" src={"generic_achievementsL"} alt={""} />
                                <div>{info.achievementCount}</div>
                            </div>
                            <div className="flex flex-col w-18 text-l text-ellipsis bg-slate-100/70 rounded-md p-1 justify-center text-center">
                                <ImgApi className="w-12" src={"generic_abyssesL"} alt={""} />
                                <div>{info.abysses.floor}-{info.abysses.chamber}</div>
                            </div>
                        </div>
                    </div>
    return <div className="w-1/4 min-h-[150px] min-w-[600px] transition ease-in-out group rounded-md border bg-white/25 px-3 cursor-pointer z-10 mb-2 hover:shadow-lg" style={{
        backgroundImage : "url(https://enka.network/ui/".concat(info.namecardName, ".png)"),
        backgroundSize : "cover"
    }} >{content}</div>
}