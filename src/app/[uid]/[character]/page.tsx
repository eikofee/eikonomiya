import RootComponent from '../../components/RootComponent';
import { hostUrl } from '../../host';




async function getCharacterData(name: string) {
    const data = await fetch(hostUrl("/api/characters?name=".concat(name)));
    return data.json()
}

async function getRules(name: string) {
    const data = await fetch(hostUrl("/api/rules?name=".concat(name)));
    return data.json()
}

export default async function Page({ params }: { params: { character: string, uid: string } }) {

    let characterName = params.character
    console.log(params.uid)
    let data: Record<string, any> = await getCharacterData(characterName);
    let rules: Record<string, any> = await getRules(characterName)
    


    return (
        <main>
            <RootComponent data={data} defaultRule={rules} />
        </main>
    )
}
