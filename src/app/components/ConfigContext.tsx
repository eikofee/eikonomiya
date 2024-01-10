import { createContext } from "react";
import { ColorDirector } from "../classes/ColorDirector";
import { EElement } from "@/server/gamedata/enums/EElement";
import { ConfigDirector, ETheme } from "../classes/ConfigDirector";

export const ConfigContext = createContext({
    colorDirector : new ColorDirector(EElement.NONE),
    config : new ConfigDirector({host: "http://localhost:3000", theme: ETheme.LIGHT}),
})