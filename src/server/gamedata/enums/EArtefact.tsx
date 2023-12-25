export enum EArtefact {
    FLEUR = "fleur",
    PLUME = "plume",
    SABLIER = "sablier",
    COUPE = "coupe",
    COURONNE = "couronne",
    UNKNOWN = "unknown"
}

export function stringToEArtefact(s: string): EArtefact {
    switch (s) {
        case "fleur": return EArtefact.FLEUR;
        case "plume": return EArtefact.PLUME;
        case "sablier": return EArtefact.SABLIER;
        case "coupe": return EArtefact.COUPE;
        case "couronne": return EArtefact.COURONNE;
        default: return EArtefact.UNKNOWN;
    }
}