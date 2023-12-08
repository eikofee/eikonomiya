import RootComponent from '../../components/RootComponent';
import { hostUrl } from '../../host';




// async function getCharacterData(name: string) {
//     const data = await fetch(hostUrl("/api/characters?uid=".concat(uid, "name=", name)));
//     return data.json()
// }

// async function getRules(name: string) {
//     const data = await fetch(hostUrl("/api/rules?name=".concat(name)));
//     return data.json()
// }

async function fetchDataToApi(endpoint: string, uid: string, name: string) {
    const path = "/api/".concat(endpoint, "?uid=", uid, "&name=", name)
    const data = await fetch(hostUrl(path));
    return data.json()
}

export default async function Page({ params }: { params: { character: string, uid: string } }) {

    const characterName = params.character
    const uid = params.uid
    let data: Record<string, any> = await fetchDataToApi("characters", uid, characterName);
    let rules: Record<string, any> = await fetchDataToApi("rules", uid, characterName);
    
    if (data == undefined || rules == undefined) {
        return (
            <div className="bg-blue-500 w-full h-full">
                Fetching data, please wait...
            </div>
        )
    }

    return (
        <main>
            <RootComponent data={data} defaultRule={rules} />
        </main>
    )
}
