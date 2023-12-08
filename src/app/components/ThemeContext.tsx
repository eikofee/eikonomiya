import { createContext } from "react";
import { ColorDirector } from "../classes/ColorDirector";

export const ThemeContext = createContext({colorDirector : new ColorDirector("none")})