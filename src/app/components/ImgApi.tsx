export function ImgApi({src, className = "", alt = ""}:{src : string, className? : string , alt? : string}) {

    return <img src={"/api/assets/".concat(src)} className={className} alt={alt} />
}