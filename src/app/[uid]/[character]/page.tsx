import { loadCharacters, loadRules } from '@/server/DataLoader';
import RootComponent from '../../components/RootComponent';
import { ICharacterRule } from '@/app/interfaces/ICharacterRule';

export default async function Page({ params }: { params: { character: string, uid: string } }) {

    const characterName = params.character.replaceAll("%20", " ")
    const uid = params.uid
    const characters = await loadCharacters(uid)
    const rules = await loadRules(uid)
    if (characters == undefined || rules == undefined) {
        return (
            <div className="bg-blue-500 w-full">
                Fetching data, please wait...
            </div>
        )
    }

    return (
            <RootComponent data={characters} currentCharacterName={characterName} rules={rules} uid={uid}/>
    )
}
