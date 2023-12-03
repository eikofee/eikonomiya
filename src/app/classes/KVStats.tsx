export class KVStats {
    hp: number
    atk: number
    def: number
    hpp: number
    atkp: number
    defp: number
    em: number
    erp: number
    crp: number
    cdmgp: number
    labels = ["HP", "ATK", "DEF", "HP%", "ATK%", "DEF%", "EM", "ER%", "Crit Rate%", "Crit DMG%"]

    constructor(){
        this.hp = 0
        this.atk = 0
        this.def = 0
        this.hpp = 0
        this.atkp = 0
        this.defp = 0
        this.em = 0
        this.erp = 0
        this.crp = 0
        this.cdmgp = 0
    }

    public validValues() {
        let res = 0
        for (let x in this.labels) {
            if (this.get(x) > 0)
                res += 1;
        }

        return res
    }

    public maxValues() {
        let values = []
        for (let i = 0; i < this.labels.length; ++i) {
            values.push({v: this.get(this.labels[i]), k: this.labels[i]})
        }
        
        return values.sort((a, b) => b.v - a.v)
    }


    public get(statName: string) : number {
        switch (statName){
            case "HP":
                return this.hp;
            case "ATK":
                return this.atk;
            case "DEF":
                return this.def;
            case "HP%":
                return this.hpp;
            case "ATK%":
                return this.atkp;
            case "DEF%":
                return this.defp;
            case "EM":
                return this.em;
            case "ER%":
                return this.erp;
            case "Crit Rate%":
                return this.crp;
            case "Crit DMG%":
                return this.cdmgp;
            }

            return 0;
    }

    public set(statName: string, statValue: number) {
        switch (statName){
            case "HP":
                this.hp = statValue;
                break;
                case "ATK":
                this.atk = statValue;
                break;
                case "DEF":
                this.def = statValue;
                break;
                case "HP%":
                this.hpp = statValue;
                break;
                case "ATK%":
                this.atkp = statValue;
                break;
                case "DEF%":
                this.defp = statValue;
                break;
                case "EM":
                this.em = statValue;
                break;
                case "ER%":
                this.erp = statValue;
                break;
                case "Crit Rate%":
                this.crp = statValue;
                break;
                case "Crit DMG%":
                this.cdmgp = statValue;
                break;
            }
    }

    public copy() {
        let res = new KVStats()
        for (let i = 0; i < this.labels.length; ++i) {
            res.set(this.labels[i], this.get(this.labels[i]))
        }

        return res
    }
}