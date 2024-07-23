import Card from "./Card";
import { ETabMode } from "./enums/ETabMode";
import Icon from "./Icon";

export default function TopTabSwitcher({currentMode, currentModeCallback} : {currentMode: ETabMode, currentModeCallback: (e: ETabMode) => void}) {
    const content = <div className="px-2 font-semibold h-full">
    <div className={"flex flex-row items-center h-full rounded-md gap-3 p-2"}>
        <div className="cursor-pointer w-8 h-8" onClick={() => currentModeCallback(ETabMode.ARTIFACTS)}>
            <Icon n="fleur" useTooltip={false} customStyle={currentMode == ETabMode.ARTIFACTS ? "fill-black" : "fill-black/30"}/>
        </div>
        <div className="cursor-pointer w-8 h-8" onClick={() => currentModeCallback(ETabMode.TALENT_VALUES)}>
            <Icon n="atk" useTooltip={false} customStyle={currentMode == ETabMode.TALENT_VALUES ? "fill-black" : "fill-black/30"}/>
        </div>
    </div>
</div>
    return <Card content={content} />
}