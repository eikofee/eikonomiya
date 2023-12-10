import {promises as fsPromises} from 'fs';
import path from 'path'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const name = searchParams.get("name")!.replaceAll("%20", " ")
    const p = path.join(process.cwd(), "/public/characterPortraits")
    const fileList = await fsPromises.readdir(p)
    let content : any = {fname: ""}
    const extensions = [".jpg", ".jpeg", ".png"]
    for (let i = 0; i < extensions.length; ++i) {
        const fname = name.concat(extensions[i])
        if (fileList.includes(fname)) {
            content = {fname: "/characterPortraits/".concat(fname)}
        }
    }

    return Response.json(content)
  }
