import { BaseService } from './base.service';


export class DataTableService extends BaseService<any> {
    constructor() {
        super('mock', 'data-table');
    }
}