import { IApiResult } from "@/app/interfaces/IApiResult";
import { IPlayerInfoWithoutCharacters } from "../gamedata/IPlayerInfo";
import { getPlayerInfoList } from "../DataLoader";

export async function apiLogicGetPlayers() {
    const res : IApiResult<IPlayerInfoWithoutCharacters[]> = {success: false}
    const data = await getPlayerInfoList()
    res.content = data
    res.success = true
    return res
}