import RootComponent from '../../components/RootComponent';
import { hostUrl } from '../../host';

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
            <div className="bg-blue-500 w-full">
                Fetching data, please wait...
            </div>
        )
    }

    return (
            <RootComponent data={data} defaultRule={rules} />
    )
}