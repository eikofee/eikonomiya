import { apiLogicLoadLocale } from "@/server/api/ApiLogicLoadLocale"
import { apiResponse, EStatusCode } from "@/server/api/ApiResponseGenerator"

export async function GET(request: Request, {params}: {params: {category: string, name: string}}) {
    const name = params.name
    const category = params.category
    if (name != undefined && category != undefined) {
        try {
            const localeItem = await apiLogicLoadLocale(category, name)
            if (localeItem.success) {
                return apiResponse(EStatusCode.SUCCESS, localeItem.content!)
            } else {
                return apiResponse(EStatusCode.NOT_FOUND, undefined, `Category '${category}' does not exist.`)
            }
        } catch (e) {
            if (e instanceof Error && e.message.includes(" does not exist")) {
                return apiResponse(EStatusCode.NOT_FOUND, undefined, `Locale entry of name '${name}' in category '${category}' does not exist.`)
            } else {
                return apiResponse(EStatusCode.INTERNAL_ERROR, undefined, e as string)
            }
        }
    }

    return apiResponse(EStatusCode.BAD_REQUEST)
}