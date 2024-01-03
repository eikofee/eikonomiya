import { createContext } from "react";
import { ColorDirector } from "../classes/ColorDirector";
import { EElement } from "@/server/gamedata/enums/EElement";

export const ThemeContext = createContext({colorDirector : new ColorDirector(EElement.NONE)})