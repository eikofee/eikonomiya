export enum EArtifact {
    FLEUR = "fleur",
    PLUME = "plume",
    SABLIER = "sablier",
    COUPE = "coupe",
    COURONNE = "couronne",
    UNKNOWN = "unknown"
}

export function stringToEArtifact(s: string): EArtifact {
    switch (s) {
        case "fleur": return EArtifact.FLEUR;
        case "plume": return EArtifact.PLUME;
        case "sablier": return EArtifact.SABLIER;
        case "coupe": return EArtifact.COUPE;
        case "couronne": return EArtifact.COURONNE;
        default: return EArtifact.UNKNOWN;
    }
}