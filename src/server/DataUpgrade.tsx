export interface IUpgradeResult {
    content: any,
    edidted: boolean
}

export function upgradePlayerFile(data: any) : IUpgradeResult {
    const currentVersion = data["version"] == undefined ? "0.3.7" : data["version"]
    const res : IUpgradeResult = {
        content: data,
        edidted: false
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
    res.edidted = true
    return res
}

export function upgradeCharacterDataFile(data: any) : IUpgradeResult {
    const currentVersion = data["version"] == undefined ? "0.3.7" : data["version"]
    const res : IUpgradeResult = {
        content: data,
        edidted: false
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
    res.edidted = true
    return res
}

export function upgradeRuleDataFile(data: any) : IUpgradeResult {
    const currentVersion = data["version"] == undefined ? "0.3.7" : data["version"]
    const res : IUpgradeResult = {
        content: data,
        edidted: false
    }

    if (currentVersion == process.env.BUILD_VERSION!) {
        return res
    }

    switch (currentVersion) {
        case "0.3.7":
            data["currentRating"] = [0,0,0,0,0]
        default:
            data["version"] = process.env.BUILD_VERSION!
            break;
    }

    res.content = data
    res.edidted = true
    return res
}