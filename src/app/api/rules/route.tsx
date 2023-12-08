import {promises as fsPromises} from 'fs';
import path from 'path'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const uid = searchParams.get("uid")!
    const p = path.join(process.cwd(), "/data/", uid, "/rules")
    const fileList = await fsPromises.readdir(p)
    let content : any = {}
    if (searchParams.has("name")) {
        let characterName = searchParams.get("name")!
        if (fileList.includes(characterName)) {
            content = JSON.parse((await fsPromises.readFile(p.concat("/", characterName))).toString())
            if (searchParams.has("mode") && searchParams.get("mode") == "edit") {
                const labels = ["HP", "ATK", "DEF", "HP%", "ATK%", "DEF%", "EM", "ER%", "Crit Rate%", "Crit DMG%"]
                for (let i = 0; i < labels.length; ++i) {
                    const label = labels[i]
                    if (searchParams.has(label)) {
                        content["rule"][label] = parseFloat(searchParams.get(label)!)
                    }
                }
                content["lastUpdated"] = Date.now()
                const newRule = content
                await fsPromises.writeFile(p.concat("/", characterName), JSON.stringify(newRule))
                content = {message: "Rule updated.", newRule: newRule}
            }
        }
    } else {
        for (let i = 0; i < fileList.length; ++i) {
            let f = fileList[i]
            content[f] = JSON.parse((await fsPromises.readFile(p.concat("/", f))).toString())

        }
    }

    return Response.json(content)
  }