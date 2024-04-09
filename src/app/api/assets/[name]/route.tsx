import { buildPathToDataFolder } from '@/server/DataLoader';
import fs from 'fs';
import { NextResponse } from 'next/server';

export async function GET(request: Request, {params}: {params: {name: string}}) {
    const assetName = params.name
    let content : any = {message: "Data folder not found."}
    if (assetName != undefined) {
        let subPath = assetName.replaceAll("_", "/")
        const extensions = [".png", ".jpg", ".jpeg"]
        for (let i = 0; i < extensions.length; ++i) {
            const p = await buildPathToDataFolder("gamedata", "assets", subPath, extensions[i])
            if (p.status) {
                const asset = fs.readFileSync(p.path)
                const res = new NextResponse(asset)
                res.headers.set("Content-Type", "image/png")
                return res
            }
        }

    }
    return Response.json(content, {headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
    })
}