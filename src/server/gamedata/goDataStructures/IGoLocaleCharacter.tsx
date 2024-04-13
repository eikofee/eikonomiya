export interface IGoDescription {
    name: string,
    description: string[]
}

export interface IGoLocaleCharacter {
    name: string,
    title: string,
    description: string,
    constellationName: string,
    auto: {
        name: string,
        fields: {
            normal: string[],
            charged: string[],
            plunging: string[]
        }
    
        skillParams: string[]
    },

    skill: {
        name: string,
        description: string[],
        skillParams: string[],
    },

    burst: {
        name: string,
        description: string[],
        skillParams: string[]
    }

    sprint? : IGoDescription

    passives : IGoDescription[]

    constellations : IGoDescription[]
}

function convertToArray(data: any) {
    let keys = Object.keys(data)
    let res = []
    console.log(data)
    for (let ki = 0; ki < keys.length; ++ki) {
        const k = keys[ki]
        if (data[k].length > 0 && data[k][0].length > 1) {
            for (let j = 0; j < data[k].length; ++j) {
                res.push(data[k][j])
            }
        } else {
            res.push(data[k])
        }
    }

    return res
}

export function jsonToIGoLocaleCharacter(data: any) : IGoLocaleCharacter {

    const passiveKeys = Object.keys(data).filter(f => f.includes("passive"))
    console.log(passiveKeys)
    const constellationKeys = Object.keys(data).filter(f => f.includes("constellation") && f != "constellationName")
    console.log(constellationKeys)
    const passives = []
    const constellations = []
    for (let pki = 0; pki < passiveKeys.length; ++pki) {
        const pk = passiveKeys[pki]
        const d = data[pk]
        passives.push({
            name: d["name"],
            description: convertToArray(d["description"])
        })
    }

    for (let cki = 0; cki < constellationKeys.length; ++cki) {
        const ck = constellationKeys[cki]
        const d = data[ck]
        console.log(d)
        constellations.push({
            name: d["name"],
            description: convertToArray(d["description"])
        })
    }
    
    const res : IGoLocaleCharacter = {
        name: data["name"],
        title: data["title"],
        description: data["description"],
        constellationName: data["constellationName"],
        auto: {
            name: data["auto"]["name"],
            fields: {
                normal: convertToArray(data["auto"]["fields"]["normal"]),
                charged: convertToArray(data["auto"]["fields"]["charged"]),
                plunging: convertToArray(data["auto"]["fields"]["plunging"])
            },
            skillParams: convertToArray(data["auto"]["skillParams"])
        },
        skill: {
            name: data["skill"]["name"],
            description: convertToArray(data["skill"]["description"]),
            skillParams: convertToArray(data["skill"]["skillParams"])
        },
        burst: {
            name: data["burst"]["name"],
            description: convertToArray(data["burst"]["description"]),
            skillParams: convertToArray(data["burst"]["skillParams"])
        },
        passives: passives,
        constellations: constellations
    }

    return res
}