import {AxiosResponse} from 'axios';
import {iResponse} from "../models/iResponse";
import $api from "../http";

export default class StatsService {
    static getInvoices(): Promise<AxiosResponse<iResponse>>{
        return $api.get<iResponse>('/admin/invoice-list')
    }

}