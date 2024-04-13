import { useContext } from "react";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { ConfigContext } from "./ConfigContext";
import { EElement } from "@/server/gamedata/enums/EElement";

export default function MarkdownDescription({html} : {html: string}) {

    const {colorDirector} = useContext(ConfigContext)

    let t = html.replace("<i>", "*").replace("</i>", "*")
    t = t.replace("<strong>", "**").replace("</strong>", "**")
    t = t.replace("<anemo>", '<span class="'.concat(colorDirector.textAccent(6, EElement.ANEMO), ' font-bold">')).replace("</anemo>", "</span>")
    t = t.replace("<geo>", '<span class="'.concat(colorDirector.textAccent(6, EElement.GEO), ' font-bold">')).replace("</geo>", "</span>")
    t = t.replace("<electro>", '<span class="'.concat(colorDirector.textAccent(6, EElement.ELECTRO), ' font-bold">')).replace("</electro>", "</span>")
    t = t.replace("<dendro>", '<span class="'.concat(colorDirector.textAccent(6, EElement.DENDRO), ' font-bold">')).replace("</dendro>", "</span>")
    t = t.replace("<hydro>", '<span class="'.concat(colorDirector.textAccent(6, EElement.HYDRO), ' font-bold">')).replace("</hydro>", "</span>")
    t = t.replace("<pyro>", '<span class="'.concat(colorDirector.textAccent(6, EElement.PYRO), ' font-bold">')).replace("</pyro>", "</span>")
    t = t.replace("<crto>", '<span class="'.concat(colorDirector.textAccent(6, EElement.CRYO), ' font-bold">')).replace("</cryo>", "</span>")
    return <Markdown rehypePlugins={[rehypeRaw]}>{t}</Markdown>
}