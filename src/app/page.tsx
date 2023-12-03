import { hostUrl } from './host';
import RootComponent from './components/RootComponent';




async function getCharacterData(name: string) {
    const data = await fetch(hostUrl().concat("char?name=", name));
    return data.json()
}

async function getRules() {
    const data = await fetch(hostUrl().concat("rules"));
    return data.json()
}

async function loadCharacterRules(name: string) {
    let rules: Record<string, any> = await getRules();
    return rules[name]["rule"]
}

export default async function Home() {

    let characterName = "Furina"
    let data: Record<string, any> = await getCharacterData(characterName);
    let rules: Record<string, any> = await loadCharacterRules("Yelan")
    


    return (
        <main>
            <RootComponent data={data} rule={rules} />
        </main>
    )
}
