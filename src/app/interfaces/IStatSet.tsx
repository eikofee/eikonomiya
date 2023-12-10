
export interface IStatSet {
    "HP": number,
    "HP%": number;
    "ATK": number;
    "ATK%": number;
    "DEF": number;
    "DEF%": number;
    "Crit Rate%": number;
    "Crit DMG%": number;
    "ER%": number;
    "Heal%": number;
    "EM": number;
    "Phys%": number;
    "Anemo%": number;
    "Geo%": number;
    "Electro%": number;
    "Dendro%": number;
    "Hydro%": number;
    "Pyro%": number;
    "Cryo%": number;
}

export const listStatSetLabels = [
    "HP",
    "HP%",
    "ATK",
    "ATK%",
    "DEF",
    "DEF%",
    "Crit Rate%",
    "Crit DMG%",
    "ER%",
    "Heal%",
    "EM",
    "Phys%",
]

export const listStatSetValues = (set: IStatSet) => {
    return [
        set["HP"],
        set["HP%"],
        set["ATK"],
        set["ATK%"],
        set["DEF"],
        set["DEF%"],
        set["Crit Rate%"],
        set["Crit DMG%"],
        set["ER%"],
        set["Heal%"],
        set["EM"],
        set["Phys%"],
    ]
}