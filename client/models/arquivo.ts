import { Protocolo } from './protocolo';

export interface Arquivo {
    controle: string;
    dt_inclusao: Date;
    dt_alteracao: Date;
    protocolo: Protocolo;
    tipo: string;
    extensao: string;
    nome_original: string;
    storage: string;
    path: string;
    nome_arquivo: string;
    path_publico: string;
}
