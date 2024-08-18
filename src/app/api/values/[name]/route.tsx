import { apiLogicLoadTalentsValues } from "@/server/api/ApiLogicLoadTalentsValues"
import { apiResponse, EStatusCode } from "@/server/api/ApiResponseGenerator"

export async function GET(request: Request, {params}: {params: {name: string}}) {
    const name = params.name
    if (name == undefined) {
        return apiResponse(EStatusCode.BAD_REQUEST)
    }

    try {
        const valuesItem = await apiLogicLoadTalentsValues(name)
        return apiResponse(EStatusCode.SUCCESS, valuesItem.content!)
    } catch (e) {
        if (e instanceof Error && e.message.includes(" does not exist")) {
            return apiResponse(EStatusCode.NOT_FOUND, undefined, `Value entry of name '${name}' does not exist.`)
        } else {
            return apiResponse(EStatusCode.INTERNAL_ERROR, undefined, e as string)
        }
    }
}