
export interface Pessoa {
    razao: string;
    cnpj: string;
}
export interface Empresa extends Pessoa {
    id?: string;
    apelido: string;
    filiais: Array<Filial>;
    users: Array<string>;
}

export interface Filial extends Pessoa {
    id?: string;
}

export interface Departamento {
    id?: string;
    nome: string;
    users: Array<string>;
}

export const departamentoExample = {
    nome: ''   
} as Departamento;

export const empresaExample = {
    apelido: '',
    razao: '',
    cnpj: '',
    filiais: new Array<Filial>()   
} as Empresa;
