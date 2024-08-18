import { EDataType, EStatusCode, apiResponse } from '@/server/api/ApiResponseGenerator';
import { buildPathToDataFolder } from '@/server/DataLoader';
import fs from 'fs';

export async function GET(request: Request, {params}: {params: {name: string}}) {
    const assetName = params.name
    if (assetName != undefined) {
        let subPath = assetName.replaceAll("_", "/")
        const extensions = [".png", ".jpg", ".jpeg"]
        for (let i = 0; i < extensions.length; ++i) {
            try {
                const p = await buildPathToDataFolder("gamedata", "assets", subPath, extensions[i])
                const asset = fs.readFileSync(p)
                return apiResponse(EStatusCode.SUCCESS, asset,undefined, EDataType.PNG)
            } catch (e) {
                
            }
        }

        return apiResponse(EStatusCode.NOT_FOUND)
    }

    return apiResponse(EStatusCode.BAD_REQUEST, undefined, "Parameter 'name' is not set.")
}