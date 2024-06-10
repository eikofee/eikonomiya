import { apiLogicLoadTalentsKeys } from "@/server/api/ApiLogicLoadTalentsKeys"

export async function GET(request: Request, {params}: {params: {name: string}}) {
    const name = params.name
    let content : any = {message: "Data folder not found."}
    if (name != undefined) {
        const valuesItem = await apiLogicLoadTalentsKeys(name)
        content = valuesItem
    }

    return Response.json(content, {headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
    })
}