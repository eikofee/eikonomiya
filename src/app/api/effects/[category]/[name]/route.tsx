import { apiLogicLoadEffectData } from "@/server/api/ApiLogicLoadEffectData"
import { apiResponse, EStatusCode } from "@/server/api/ApiResponseGenerator"

export async function GET(request: Request, {params}: {params: {category: string, name: string}}) {
    const name = params.name
    const category = params.category
    let content : any = {message: "Data folder not found."}
    if (name != undefined && category != undefined) {
        try {
            const effect = await apiLogicLoadEffectData(category, name)
            return apiResponse(EStatusCode.SUCCESS, effect.content!)
        } catch(e) {
            if (e instanceof Error && e.message.includes(" does not exist")) {
                return apiResponse(EStatusCode.NOT_FOUND, undefined, "Effect '".concat(name, "' in category '", category, "' does not exist."))
            } else {
                return apiResponse(EStatusCode.INTERNAL_ERROR, undefined, e as string)
            }
        }
    }

    return apiResponse(EStatusCode.BAD_REQUEST)
}