export interface IServiceRequestOptions {
    path: string;
    payload?: string;
}

export interface IServiceListResult<T> {
    current: number;
    totalRecords: number;
    records: Array<T>;
    next?: number;
    previous?: number;
}

export interface IService<T> {
    name: string;
    getAll(options?: IServiceRequestOptions): Promise<IServiceListResult<T>>
}

export const getAdapter = (adapter: string) => {
    if (adapter == null) throw new ReferenceError('Adapter not found!');

    if (adapter == 'mock') {
        const mockData = [
            { id: 1, name: 'Teste', situacao: 'Novo' },
            { id: 2, name: 'Teste 2', situacao: 'Finalizado' },
        ];

        const getAll = (resource: string, options?: IServiceRequestOptions) => {
            return Promise.resolve({
                current: 0,
                totalRecords: 1,
                records: mockData
            });
        };

        const getOne = (resource: string, key: string, options?: IServiceRequestOptions) => {
            return Promise.resolve(
                mockData.find(rec => new String(rec.id) === key)
            );
        }

        return { getAll, getOne };
    }
}

export abstract class BaseService<T> {
    private resource: string;
    private adapter: any;

    constructor(adapter: string, resource: string) {
        this.resource = resource;
        this.adapter = getAdapter('mock');
    }

    async getAll(options?: IServiceRequestOptions) {
        return await this.adapter.getAll(this.resource, options);
    }

    async getOne(key: string) {
        return await this.adapter.getOne(this.resource, key);
    }
}

