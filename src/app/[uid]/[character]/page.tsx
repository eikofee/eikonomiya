"use server";
import {promises as fsPromises} from 'fs';
import { loadCharacters, loadRules, parseEffect } from '@/server/DataLoader';
import RootComponent from '../../components/RootComponent';
import { Updater } from '@/server/gamedata/Updater';
import { ConfigDirector, ETheme, IConfigDirector } from '@/app/classes/ConfigDirector';
import path from 'path';
import * as yaml from 'yaml';


export default async function Page({ params }: { params: { character: string, uid: string } }) {


    const characterName = params.character.replaceAll("%20", " ")
    const uid = params.uid
    let currentChar = undefined
    const characters = await loadCharacters(uid)
    for (let i = 0; i < characters.length; ++i) {
        if (characters[i].name == characterName) {
            currentChar = characters[i]
        }
    }

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

    const effectsRaw = await (await fetch("https://raw.githubusercontent.com/eikofee/eikonomiya-data/master/effects.yml")).text()
    const effects = yaml.parse(effectsRaw)
    const allEffectList = parseEffect(effects, "defaultName", "")
    let effectList = []
    let currentEffectsNames = []
    for (let i = 0; i < currentChar!.staticEffects.length; ++i) {
        currentEffectsNames.push(currentChar!.staticEffects[i].name)
    }

    for (let i = 0; i < currentChar!.dynamicEffects.length; ++i) {
        currentEffectsNames.push(currentChar!.dynamicEffects[i].name)
    }

    for (let i = 0; i < allEffectList.length; ++i) {
        if (!currentEffectsNames.includes(allEffectList[i].name)) {
            effectList.push(allEffectList[i])
        }
    }

    return (
            <RootComponent data={characters} currentCharacterName={characterName} rules={rules} uid={uid} iconfig={configDirector} defaultEffectCards={effectList}/>
    )
}
