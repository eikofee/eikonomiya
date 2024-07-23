import Image from "next/image";

export function ImgApi({src, className = "", alt = "", w=undefined, h=undefined, s=undefined}:{src : string, className? : string , alt? : string, w? : number, h? : number, s? : number}) {

    if (s == undefined && (w == undefined || h == undefined)) {
        return <img src={"/api/assets/".concat(src)} className={className} alt={alt} />
    } else {
        if (s != undefined) {
            w = s
            h = s
        }
        
        return <Image src={"/api/assets/".concat(src)} width={w} height={h} className={className} alt={alt} />
    }
}