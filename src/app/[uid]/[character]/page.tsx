"use server";
import {promises as fsPromises} from 'fs';
import { loadCharacters, loadRules } from '@/server/DataLoader';
import RootComponent from '../../components/RootComponent';
import { Updater } from '@/server/gamedata/Updater';
import { ConfigDirector, ETheme, IConfigDirector } from '@/app/classes/ConfigDirector';
import path from 'path';

export default async function Page({ params }: { params: { character: string, uid: string } }) {


    const characterName = params.character.replaceAll("%20", " ")
    const uid = params.uid
    const characters = await loadCharacters(uid)
    const rules = await loadRules(uid)
    const configDirector : IConfigDirector = {
        host: "http://localhost:3000",
        theme: ETheme.LIGHT
    }

    const p = path.resolve(process.cwd(), process.env.DATA_PATH!)
    const fileList = await fsPromises.readdir(p)
    if (!fileList.includes(process.env.CONFIG_FILENAME!)) {
        const p3 = path.join(process.cwd(), process.env.DATA_PATH!, process.env.CONFIG_FILENAME!)
        await fsPromises.writeFile(p3, JSON.stringify({
            "host": configDirector.host,
            "theme": configDirector.theme
        }))
    }

    const p2 = path.resolve(process.cwd(), process.env.DATA_PATH!)
    const jsonData = JSON.parse((await fsPromises.readFile(p2.concat("/", process.env.CONFIG_FILENAME!))).toString())
    configDirector.host = jsonData["host"]
    configDirector.theme = jsonData["theme"]
    if (characters == undefined || rules == undefined) {
        return (
            <div className="bg-blue-500 w-full">
                Fetching data, please wait...
            </div>
        )
    }
    const u = new Updater(uid)
    await u.initialize()

    return (
            <RootComponent data={characters} currentCharacterName={characterName} rules={rules} uid={uid} iconfig={configDirector}/>
    )
}
