import { apiResponse, EStatusCode, EDataType } from "@/server/api/ApiResponseGenerator"
import { loadCharacters } from "@/server/DataLoader"

export async function GET(request: Request, {params}: {params: {uid: string}}) {
    const uid = params.uid
    try {
        const p = await loadCharacters(uid)
        return apiResponse(EStatusCode.SUCCESS, JSON.stringify(p), undefined, EDataType.JSON)
    } catch (e) {
        return apiResponse(EStatusCode.INTERNAL_ERROR, e as string)
    }
}