import { hostUrl } from './host';
import RootComponent from './components/RootComponent';




async function getCharacterData(name: string) {
    const data = await fetch(hostUrl().concat("char?name=", name));
    return data.json()
}

async function getRules(name: string) {
    const data = await fetch(hostUrl().concat("rule?name=", name));
    return data.json()
}

async function loadCharacterRules(name: string) {
    let rules: Record<string, any> = await getRules(name);
    return rules
}

export default async function Home() {

    let characterName = "Furina"
    let data: Record<string, any> = await getCharacterData(characterName);
    let rules: Record<string, any> = await getRules(characterName)
    


    return (
        <main>
            <RootComponent data={data} rule={rules} />
        </main>
    )
}
