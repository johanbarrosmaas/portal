import { Empresa, Departamento } from './pilares';
import { Usuario } from './usuario';
import { Arquivo } from './arquivo';

export interface Protocolo {
    controle: string;
    dt_registro: Date;
    dt_utlima_ocorrencia: Date;
    empresa: Empresa;
    departamento: Departamento;
    interessados: Usuario[];
    origem: '';
    arquivos: Arquivo[];
    processo?: 'Contrato' | 'Compra' | 'Venda' | 'Laudo';
}
