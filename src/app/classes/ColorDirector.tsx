const bgHydro = [
    "bg-blue-50",
    "bg-blue-100",
    "bg-blue-200",
    "bg-blue-300",
    "bg-blue-400",
    "bg-blue-500",
    "bg-blue-600",
    "bg-blue-700",
    "bg-blue-800",
    "bg-blue-950",
]

const textHydro = [
    "text-blue-50",
    "text-blue-100",
    "text-blue-200",
    "text-blue-300",
    "text-blue-400",
    "text-blue-500",
    "text-blue-600",
    "text-blue-700",
    "text-blue-800",
    "text-blue-950",
]

const borderHydro = [
    "border-blue-50",
    "border-blue-100",
    "border-blue-200",
    "border-blue-300",
    "border-blue-400",
    "border-blue-500",
    "border-blue-600",
    "border-blue-700",
    "border-blue-800",
    "border-blue-950",
]

const bgElectro = [
    "bg-violet-50",
    "bg-violet-100",
    "bg-violet-200",
    "bg-violet-300",
    "bg-violet-400",
    "bg-violet-500",
    "bg-violet-600",
    "bg-violet-700",
    "bg-violet-800",
    "bg-violet-950",
]

const textElectro = [
    "text-violet-50",
    "text-violet-100",
    "text-violet-200",
    "text-violet-300",
    "text-violet-400",
    "text-violet-500",
    "text-violet-600",
    "text-violet-700",
    "text-violet-800",
    "text-violet-950",
]

const borderElectro = [
    "border-violet-50",
    "border-violet-100",
    "border-violet-200",
    "border-violet-300",
    "border-violet-400",
    "border-violet-500",
    "border-violet-600",
    "border-violet-700",
    "border-violet-800",
    "border-violet-950",
]

export class ColorDirector {
    elementalColorPicker(element: string) {
        switch(element) {
            case "Anemo":
                return "teal";
            case "Geo":
                return "yellow";
            case "Electro":
                return "violet";
            case "Dendro":
                return "lime";
            case "Hydro":
                return "blue";
            case "Pyro":
                return "red";
            case "Cryo":
                return "cyan";
            default:
                return "neutral";
        }
    }

    element = "neutral";

    constructor(element: string) {
        this.element = element
    }

    public bg(level: number) : string {
        switch (this.element) {
            case "Anemo":
                return "teal";
            case "Geo":
                return "yellow";
            case "Electro":
                return bgElectro[level];
            case "Dendro":
                return "lime";
            case "Hydro":
                return bgHydro[level]
            case "Pyro":
                return "red";
            case "Cryo":
                return "cyan";
            default:
                return "neutral";
        }
    }

    public bgAccent(light: number) : string {
        switch (this.element) {
            case "Anemo":
                return "teal";
            case "Geo":
                return "yellow";
            case "Electro":
                return bgElectro[9 - light];
            case "Dendro":
                return "lime";
            case "Hydro":
                return bgHydro[9 - light]
            case "Pyro":
                return "red";
            case "Cryo":
                return "cyan";
            default:
                return "neutral";
        }
    }

    public textAccent(light: number) : string {
        switch (this.element) {
            case "Anemo":
                return "teal";
            case "Geo":
                return "yellow";
            case "Electro":
                return textElectro[9 - light];
            case "Dendro":
                return "lime";
            case "Hydro":
                return textHydro[9 - light]
            case "Pyro":
                return "red";
            case "Cryo":
                return "cyan";
            default:
                return "neutral";
        }
    }

    public borderAccent(light: number) : string {
        switch (this.element) {
            case "Anemo":
                return "teal";
            case "Geo":
                return "yellow";
            case "Electro":
                return borderElectro[9 - light];
            case "Dendro":
                return "lime";
            case "Hydro":
                return borderHydro[9 - light]
            case "Pyro":
                return "red";
            case "Cryo":
                return "cyan";
            default:
                return "neutral";
        }
    }

}