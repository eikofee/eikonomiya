"use server";
import { loadAllEffects, loadCharacters, loadConfigFile, loadRules } from '@/server/DataLoader';
import RootComponent from '../../../components/RootComponent';
import { Updater } from '@/server/gamedata/Updater';


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
    const configDirector = await loadConfigFile(true)
    if (characters == undefined || rules == undefined || currentChar == undefined) {
        return (
            <div className="bg-blue-500 w-full">
                Fetching data, please wait...
            </div>
        )
    }
    const u = new Updater(uid)
    await u.initialize()

    
    const allEffectList = await loadAllEffects()
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
