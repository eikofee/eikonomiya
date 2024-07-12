import { createContext } from "react";
import { ColorDirector } from "../classes/ColorDirector";
import { EElement } from "@/server/gamedata/enums/EElement";
import { ConfigDirector, ETheme } from "../classes/ConfigDirector";

export const ConfigContext = createContext({
    colorDirector : new ColorDirector(EElement.NONE),
    config : new ConfigDirector({theme: ETheme.LIGHT, artifactRating: {low: 0.25, med: 0.5}}),
})