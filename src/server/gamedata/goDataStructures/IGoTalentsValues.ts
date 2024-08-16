export interface IGoTalentsValues {
    auto: number[][]
    skill: number[][]
    burst: number[][]
    passive1: number[][]
    passive2: number[][]
    passive3: number[][]
    constellation1: number[]
    constellation2: number[]
    constellation3: number[]
    constellation4: number[]
    constellation5: number[]
    constellation6: number[]
}

function convertToArray(data: any) {
    let keys = Object.keys(data)
    let res = []
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

export function jsonToIGoTalentsValues(data: any) {
    const res : IGoTalentsValues = {
        auto: data["auto"],
        skill: data["skill"],
        burst: data["burst"],
        passive1: data["passive1"],
        passive2: data["passive2"],
        passive3: data["passive3"],
        constellation1: data["constellation1"],
        constellation2: data["constellation2"],
        constellation3: data["constellation3"],
        constellation4: data["constellation4"],
        constellation5: data["constellation5"],
        constellation6: data["constellation6"]
    }

    return res
}