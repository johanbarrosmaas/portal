import type { NextPage } from 'next';
import React, { useEffect, useState } from 'react';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { DataTableService } from '../../client/services/data-table.service';

const Lista: NextPage = () => {
    const [ dts, useDataTable ] = useState([]);

    useEffect(() => {
        const dtSrv = new DataTableService();
        dtSrv.getAll().then(resp => {
            console.log(resp);
            useDataTable(resp.records);
        });
    }, [])

    const goNewItem = () => {

    }

    const leftToolbarTemplate = (
        <React.Fragment>
            <Button label="Novo" className="p-button-success" onClick={(e) => { window.open('/lista/registro/new?token=kt5rWstx', "_blank") }} ></Button>
        </React.Fragment>
    )

    return (
        <>
            <div className="card">
                <Toolbar className="mb-4" left={leftToolbarTemplate} ></Toolbar>
                <DataTable  value={dts}>
                    <Column field="situacao" header="Situação" colSpan={1}></Column>
                    <Column field="id" header="Id" colSpan={1}></Column>
                    <Column field="name" header="Nome" colSpan={1}></Column>
                    <Column field="" header="Departamento" colSpan={1}></Column>
                    <Column field="" header="Empresa" colSpan={1}></Column>
                    <Column field="" header="Tipo" colSpan={1}></Column>
                </DataTable>
            </div>
        </>
    )
}

export default Lista
