import { IStatBag } from "./IStatBag";
import { IStatTuple } from "./IStatTuple";
import { EStat } from "./enums/EStat";

export class StatBag {
    stats : Record<string, IStatTuple> = {};
    ks : EStat[]

    constructor() {
        this.ks = []
    }

    public addStat(t: IStatTuple) {
        if (this.ks.includes(t.name)) {
            this.stats[t.name] = {name: t.name, value: t.value + this.stats[t.name]!.value}
        } else {
            this.stats[t.name] = t
            this.ks.push(t.name)
        }
    }

    public get(s: EStat) {
        return this.stats[s]
    }

    public keys() {
        return this.ks
    }

    public copy(): StatBag {
        const res = new StatBag()
        for (let i = 0; i < this.ks.length; ++i) {
            const s = this.stats[this.ks[i]]
            res.addStat(s)
        }

        return res
    }

    public toIStatBag() {
        let names : string[] = []
        let values : number[] = []
        for (let i = 0; i < this.ks.length; ++i) {
            names.push(this.ks[i])
            values.push(this.stats[this.ks[i]].value)
        }
        const res: IStatBag = {
            names: names,
            values: values
        }

        return res
    }
}