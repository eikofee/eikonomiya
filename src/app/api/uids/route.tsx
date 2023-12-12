import {promises as fsPromises} from 'fs';
import path from 'path'

export async function GET(request: Request) {
    console.log("GET")
    const p = path.join(process.cwd(), "/data")
    const fileList = await fsPromises.readdir(p)
    const content = {
        "uids":fileList
    }

    return Response.json(content)
  }
