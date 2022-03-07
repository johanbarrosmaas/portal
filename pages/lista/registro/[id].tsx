import React, { useEffect, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { MultiSelect } from 'primereact/multiselect';
import { SelectButton } from 'primereact/selectbutton';
import { DataTableService } from '../../../client/services/data-table.service';

export const emptyRec = {id: 0, name: '', situacao: { code: 0, tag: 'Nova' }};

const situacoes = [
    { code: 0, tag: 'Nova' },
    { code: 1, tag: 'Recebido' },
    { code: 2, tag: 'Devolvido' },
    { code: 10, tag: 'Finalizado' }
];

const departamentos = [
    { code: 0, tag: 'Central de Informações' },
    { code: 1, tag: 'SI' },
    { code: 2, tag: 'Vendas' },
    { code: 3, tag: 'Compras' }
];


export async function getStaticPaths() {
    return { paths: [], fallback: true }
}

export async function getStaticProps({ params }: any) {
    const { id } = params;
    return { props: { id } }
}

const Record = (...props: any) => {
    const [ rec, useRec ] = useState<{id: number, name: string, situacao: {code: number, tag: string}}>(emptyRec);
    const [ situacaoSelecionada, setSituacao ] = useState();
    const [ departamentosSelecionados, setDepartamentos ] = useState();
    const [ params ] = props;
    const { id } = params;

    useEffect(() => {
        if (id === 'new') return;
        const dtSrv = new DataTableService();
        dtSrv.getOne(id).then(resp => {
            useRec(resp);
        });
    }, [])

    function itemTemplate(option: any) {
        <React.Fragment>
            <span>{option.situacao}</span>
        </React.Fragment>
    }

    return (
        <section>
            <div className="p-fluid safe-margins">
                <div className="p-field">
                    <label htmlFor="id">Somente leitura</label>
                    <InputText id="id" readOnly={true} title="Teste" name="Teste" value={rec?.id}></InputText>
                </div>
                
                <span className="p-float-label">
                    <InputText id="name" value={rec?.name} onChange={(e) => { useRec({...rec, name: e.target.value})}} ></InputText>
                    <label htmlFor="name">Inserir texto com placeholder flutuante</label>
                </span>
                <span className="p-field">                    
                    <label htmlFor="situacao">Situação</label>
                    <SelectButton optionLabel="tag" value={rec?.situacao} options={situacoes} onChange={(e) => { useRec({...rec, situacao: {...e.target.value}})}}></SelectButton>
                </span>
                <span className="p-field">                    
                    <label htmlFor="departamentos">Departamentos</label>
                    <MultiSelect id="departamentos" display="chip" optionLabel="tag" value={departamentosSelecionados} options={departamentos} onChange={(e) => setDepartamentos(e.value)} />
                </span>
            </div>
        </section>
    )
}

export default Record