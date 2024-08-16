import { ICharacterRule } from '@/app/interfaces/ICharacterRule';
import { apiLogicEditRule, apiLogicGetRule, apiLogicGetRules } from '@/server/api/ApiLogicRuleInteraction';
import { apiResponse, EStatusCode } from '@/server/api/ApiResponseGenerator';


export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const uid = searchParams.get("uid")!
    const character = searchParams.get("character")
    if (uid == null) {
        return apiResponse(EStatusCode.BAD_REQUEST)
    }

    if (character == null) {
        try {
            const rules = await apiLogicGetRules(uid)
            if (rules.success) {
                return apiResponse(EStatusCode.SUCCESS, JSON.stringify(rules.content!))
            }
        } catch (e) {
            if (e instanceof Error && e.message.includes(" does not exist")) {
                return apiResponse(EStatusCode.NOT_FOUND, "UID '".concat(uid, "' is not found"))
            } else {
                return apiResponse(EStatusCode.INTERNAL_ERROR, undefined, e as string)
            }
        }
    } else {
        try {
            const rule = await apiLogicGetRule(uid, character)
            if (rule.success) {
                return apiResponse(EStatusCode.SUCCESS, JSON.stringify(rule.content!))
            }
        } catch (e) {
            if (e instanceof Error && e.message.includes(" does not exist")) {
                try {
                    const rules = await apiLogicGetRules(uid)
                    if (rules.success) {
                        return apiResponse(EStatusCode.NOT_FOUND, undefined, "Character '".concat(character, "' is not found for UID '", uid, "'"))
                    } else {
                        return apiResponse(EStatusCode.NOT_FOUND, "UID '".concat(uid, "' is not found"))
                    }
                } catch (e) {
                    return apiResponse(EStatusCode.INTERNAL_ERROR, undefined, e as string)
                }
            }
        }
    }
}

export async function POST(request: Request) {
    const data = await request.json()
    const uid = data["uid"]
    const rule : ICharacterRule = data["rule"]
    if (uid == undefined || rule == undefined) {
        return apiResponse(EStatusCode.BAD_REQUEST)
    }
    try {
        const p = await apiLogicEditRule(uid, rule)
        return apiResponse(EStatusCode.SUCCESS, p.content!)
    } catch (e) {
        return apiResponse(EStatusCode.INTERNAL_ERROR, e as string)
    }
}