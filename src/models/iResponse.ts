import {iSellingStats} from "./iSellingStats";

export interface iResponse {
    status: string
    result: [iSellingStats]
    all_count : number
}