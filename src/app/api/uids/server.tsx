import path from "path";
import {promises as fsPromises} from 'fs';

export async function getUIDFolderList() {
    const p = path.join(process.cwd(), "/data")
    const fileList = await fsPromises.readdir(p)
    const content = {
        "uids":fileList
    }

    return content;
}
