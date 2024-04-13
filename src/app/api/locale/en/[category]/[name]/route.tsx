import { apiLogicLoadLocale } from "@/server/api/ApiLogicLoadLocale"

export async function GET(request: Request, {params}: {params: {category: string, name: string}}) {
    const name = params.name
    const category = params.category
    let content : any = {message: "Data folder not found."}
    if (name != undefined && category != undefined) {
        const localeItem = await apiLogicLoadLocale(category, name)
        content = localeItem
    }

    return Response.json(content, {headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
    })
}