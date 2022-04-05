import { Empresa, Departamento, Filial } from './pilares';
import { Usuario } from './usuario';
import { Arquivo } from './arquivo';

export const tipos_processo = {
    nf_servico: 'NF Serviço',
    nf_produto: 'NF produto',
    fatura: 'Fatura/Boleto',
    taxas: 'Taxas',
    contrato: 'Contrato',
    laudo: 'Laudo'
};

export interface Protocolo {
    controle: string;
    situacao: string;
    owner?: string;
    dt_registro: Date;
    dt_utlima_ocorrencia: Date;
    empresa: Empresa;
    unidade: Filial;
    departamento: Departamento;
    interessados: Usuario[];
    origem: '';
    arquivos: Arquivo[];
    fornecedor: any;
    compra_ordem?: number;
    documento_valor?: string;
    documento_vcto?: Date;
    observacoes?: string;
    processo?: string;
}

export const protocoloExample = {
    controle: '',
    situacao: 'rascunho',
    owner: undefined,
    dt_registro: new Date(),
    dt_utlima_ocorrencia: new Date(),
    empresa: {} as Empresa,
    unidade: {} as Filial,
    departamento: {} as Departamento,
    interessados: new Array<Usuario>(),
    origem: '',
    processo: undefined,
    arquivos: new Array<Arquivo>(),
    compra_ordem: undefined,
    documento_valor: undefined,
    documento_vcto: undefined,
    observacoes: ''
} as Protocolo;
