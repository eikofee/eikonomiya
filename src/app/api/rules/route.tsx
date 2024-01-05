import { ICharacterRule } from '@/app/interfaces/ICharacterRule';
import { EStat } from '@/server/gamedata/enums/EStat';
import {promises as fsPromises} from 'fs';
import path from 'path'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const uid = searchParams.get("uid")!
    const p = path.join(process.cwd(), "/", process.env.DATA_PATH!, "/", uid, "/rules")
    const fileList = await fsPromises.readdir(p)
    let content : any = {}
    if (searchParams.has("characterName")) {
        let characterName = searchParams.get("characterName")!
        if (fileList.includes(characterName)) {
            // content = JSON.parse((await fsPromises.readFile(p.concat("/", characterName))).toString())
            let rule: ICharacterRule = {
                ruleName: "defaultRuleName",
                character: characterName,
                stats: []
            }

            if (searchParams.has("mode") && searchParams.get("mode") == "edit") {
                const labels = [EStat.HP, EStat.ATK, EStat.DEF, EStat.HP_P, EStat.ATK_P, EStat.DEF_P, EStat.EM, EStat.ER_P, EStat.CR_P, EStat.CDMG_P]
                for (let i = 0; i < labels.length; ++i) {
                    const label = labels[i]
                    if (searchParams.has(label)) {
                        rule.stats.push({
                            name: label,
                            value: parseFloat(searchParams.get(label)!)
                        })
                    }
                    // content.lastUpdated = Date.now()
                    const newRule = rule
                    await fsPromises.writeFile(p.concat("/", characterName), JSON.stringify(newRule))
                    content = {message: "Rule updated.", newRule: newRule}
                }
            }
        }
    } else {
        for (let i = 0; i < fileList.length; ++i) {
            let f = fileList[i]
            content[f] = JSON.parse((await fsPromises.readFile(p.concat("/", f))).toString())
        }
    }
    return Response.json(content, {headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
  })
}