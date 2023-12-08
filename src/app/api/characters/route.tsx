import {promises as fsPromises} from 'fs';
import path from 'path'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const uid = searchParams.get("uid")!
    const p = path.join(process.cwd(), "/data/", uid, "/characters")
    const fileList = await fsPromises.readdir(p)
    let content : any = {}
    if (searchParams.has("name")) {
        let characterName = searchParams.get("name")!
        if (fileList.includes(characterName)) {
            content = JSON.parse((await fsPromises.readFile(p.concat("/", characterName))).toString())
        }
    } else {
        for (let i = 0; i < fileList.length; ++i) {
            let f = fileList[i]
            content[f] = JSON.parse((await fsPromises.readFile(p.concat("/", f))).toString())

        }
    }

    return Response.json(content)
  }
