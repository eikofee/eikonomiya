import { EStat } from "./enums/EStat"

export interface IScaledNumber {
    prefix?: string
    suffix?: string
    value: number
    scaling?: EStat
}