export function toApiName(s: string) {
    return s.toLowerCase().replaceAll(" ", "").replaceAll("'", "").replace("-","")
}