export class Stat {
    name: string;
    value: number;
    type: string;// "main" or "sub"
    potential: number;
    isPercentage: boolean;

    public constructor(name: string, value: number, type: string = "main", potential: number = 1) {
        this.name = name;
        this.value = value;
        this.type = type;
        this.potential = potential;
        this.isPercentage = false;
    }
}