import RootComponent from '../../components/RootComponent';
import { hostUrl } from '../../host';

async function fetchDataToApi(endpoint: string, uid: string, name: string) {
    const path = "/api/".concat(endpoint, "?uid=", uid, "&characterName=", name)
    const data = await fetch(hostUrl(path), { cache: 'no-store'});
    return data.json()
}

async function fetchAllData(endpoint: string, uid: string) {
    const path = "/api/".concat(endpoint, "?uid=", uid)
    const data = await fetch(hostUrl(path));
    return data.json()
}

export default async function Page({ params }: { params: { character: string, uid: string } }) {

    const characterName = params.character.replaceAll("%20", " ")
    const uid = params.uid
    let data: Record<string, any> = await fetchAllData("characters", uid);
    let rules: Record<string, any> = await fetchDataToApi("rules", uid, characterName);
    if (data == undefined || rules == undefined) {
        return (
            <div className="bg-blue-500 w-full">
                Fetching data, please wait...
            </div>
        )
    }

    return (
            <RootComponent data={data} currentCharacter={characterName} defaultRule={rules} uid={uid}/>
    )
}
