export interface IUpgradeResult {
    content: any,
    edited: boolean
}

export function upgradePlayerFile(data: any) : IUpgradeResult {
    const currentVersion = data["version"] == undefined ? "0.3.8" : data["version"]
    const res : IUpgradeResult = {
        content: data,
        edited: false
    }
    if (currentVersion == process.env.BUILD_VERSION!) {
        return res
    }
    switch (currentVersion) {
        default:
            data["version"] = process.env.BUILD_VERSION!
            break;
    }
    res.content = data
    res.edited = true
    return res
}

export function upgradeCharacterDataFile(data: any) : IUpgradeResult {
    const currentVersion = data["version"] == undefined ? "0.3.7" : data["version"]
    const res : IUpgradeResult = {
        content: data,
        edited: false
    }
    if (currentVersion == process.env.BUILD_VERSION!) {
        return res
    }
    switch (currentVersion) {
        case "0.3.7":
        case "0.3.8":
            data["talents"]["auto"] = data["talents"]["aa"]
        case "0.3.9":
            data["talents"]["auto"]["bonusLevel"] = 0
            data["talents"]["skill"]["bonusLevel"] = 0
            data["talents"]["burst"]["bonusLevel"] = 0
        default:
            data["version"] = process.env.BUILD_VERSION!
            break;
    }

    res.content = data
    res.edited = true
    return res
}

export function upgradeRuleDataFile(data: any) : IUpgradeResult {
    const currentVersion = data["version"] == undefined ? "0.3.8" : data["version"]
    const res : IUpgradeResult = {
        content: data,
        edited: false
    }

    if (currentVersion == process.env.BUILD_VERSION!) {
        return res
    }

    switch (currentVersion) {
        case "0.3.8":
            data["currentRating"] = [0,0,0,0,0]
        case "0.4":
            data["currentRated"] = [false, false, false, false, false]
        default:
            data["version"] = process.env.BUILD_VERSION!
            break;
    }

    res.content = data
    res.edited = true
    return res
}

export function upgradeConfigFile(data: any) : IUpgradeResult {
    const currentVersion = data["version"] == undefined ? "0.3.8" : data["version"]
    const res : IUpgradeResult = {
        content: data,
        edited: false
    }

    if (currentVersion == process.env.BUILD_VERSION!) {
        return res
    }

    switch (currentVersion) {
        case "0.3.8":
            data["artifactRating"] = {"low":0.25, "med":0.5}
        default:
            data["version"] = process.env.BUILD_VERSION!
            break;
    }

    res.content = data
    res.edited = true
    return res
}