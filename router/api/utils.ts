import { ParsedUrlQuery } from "node:querystring"


export function parseQuery(query: ParsedUrlQuery, key: string): string |undefined{
    const value = query[key]
    if (typeof value !== 'undefined') {
        if (Array.isArray(value)) {
            return value.join(',')
        } else if (value==='') {
            return void 0
        }else{
            return value
        }
    } else {
        return void 0
    }
}
export function str2num(str: string|undefined, defaultValue: any): number
export function str2num(str: string|undefined, defaultValue: any, options?: {
    min?: number,
    max?: number
}): number
export function str2num(str: string|undefined, defaultValue: any, options?: {
    min?: number,
    max?: number
}): number {

    let num = Number.parseInt(str+"")
    if (isNaN(num)) {
        return defaultValue
    }
    if (options) {
        if (options.min && options.max) {
            if (options.max <= options.min) throw "max必须大于min"
            if (num > options.max) {
                num = options.max
            } else if (num < options.min) {
                num = options.min
            }
        } else if (options.max && num > options.max) {
            num = options.max
        } else if (options.min && num < options.min) {
            num = options.min
        }
    }
    return num
}