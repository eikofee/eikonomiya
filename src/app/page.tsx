import { getPlayerInfoList, loadConfigFile } from "@/server/DataLoader"
import HomePageRoot from "./components/rootComponents/HomePageRoot"

export default async function Page() {

    const iconfig = await loadConfigFile(true)
    
    return <HomePageRoot config={iconfig}/>}