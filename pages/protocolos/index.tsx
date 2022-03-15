import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { FileUpload } from 'primereact/fileupload';
import { Toolbar } from 'primereact/toolbar';
import { Dropdown, DropdownChangeParams } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';

import { Protocolo } from '../../client/models/protocolo';
import { Usuario } from '../../client/models/usuario';
import { Departamento, Empresa } from '../../client/models/pilares';
import { Arquivo } from '../../client/models/arquivo';


function Protocolos(props: any) {

    let emptyProtocolo = {
        controle: '',
        dt_registro: new Date(),
        dt_utlima_ocorrencia: new Date(),
        empresa: {} as Empresa,
        departamento: {} as Departamento,
        interessados: new Array<Usuario>(),
        origem: '',
        processo: undefined,
        arquivos: new Array<Arquivo>()
    } as Protocolo;

    let protocolosBase = [
        { controle: '20211210', dt_registro: new Date('2021-12-10'), origem: '00.000.000/0001-00', empresa: 'bioma', departamento: 'Compras' },
        { controle: '20220205', dt_registro: new Date('2022-02-05'), origem: '00.000.000/0005-00', empresa: 'simbiose', departamento: 'Compras' },
        { controle: '20220222', dt_registro: new Date('2022-02-22'), origem: '00.000.000/0003-00', empresa: 'biagro', departamento: 'Vendas' },
        { controle: '20220307', dt_registro: new Date('2022-03-07'), origem: '00.000.000/0010-00', empresa: 'biagro', departamento: 'Compras' },
    ]

    let filesToUpload = new Array();

    const empresas = [
      { label: "Alado", value: "alado" },
      { label: "Biagro", value: "biagro" },
      { label: "Bioma", value: "bioma" },
      { label: "Biograss", value: "biograss" },
      { label: "Simbiose", value: "simbiose" },
      { label: "Simbiose Jet", value: "simbiose-jet" },
    ];

    const departamentos = [
        { label: "Compras", value: "compras" },
        { label: "Vendas", value: "vendas" },
        { label: "Financeiro", value: "financeiro" },
    ]

    const [protocolos, setProtocolos] = useState(new Array());
    const [protocolo, setProtocolo] = useState(emptyProtocolo);
    const [protocoloDialog, setProtocoloDialog] = useState(false);
    
    const [deleteProtocoloDialog, setDeleteProtocoloDialog] = useState(false);
    const [deleteProtocolosDialog, setDeleteProtocolosDialog] = useState(false);
    
    const [selectedProtocolos, setSelectedProtocolos] = useState(new Array());
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef({} as DataTable);

    useEffect(() => {
        //const productService = new ProductService();
        //productService.getProducts().then(data => setProducts(data));

        setProtocolos(protocolosBase)
    }, []);

    const openNew = () => {
        setProtocolo(emptyProtocolo);
        setSubmitted(false);
        setProtocoloDialog(true);
    }

    const hideDialog = () => {
        setSubmitted(false);
        setProtocoloDialog(false);
    }

    const hideDeleteProtocoloDialog = () => {
        setDeleteProtocoloDialog(false);
    }

    const hideDeleteProtocolosDialog = () => {
        setDeleteProtocolosDialog(false);
    }

    const saveProtocolo = () => {
        setSubmitted(true);

        if (protocolo.arquivos instanceof Array && protocolo.arquivos.length > 0) {
            let _protocolos = [...protocolos];
            let _protocolo = { ...protocolo };
            if (protocolo.controle) {
                const index = findIndexById(protocolo.controle);

                _protocolos[index] = _protocolo;
                //toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
            }
            else {
                _protocolo.controle = createId();
                _protocolos.push(_protocolo);
                //toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
            }

            setProtocolos(_protocolos);
            setProtocoloDialog(false);
            setProtocolo(emptyProtocolo);
        }
    }

    const editProtocolo = (protocolo: Protocolo) => {
        setProtocolo({ ...protocolo });
        setProtocoloDialog(true);
    }

    const confirmDeleteProtocolo = (protocolo: Protocolo) => {
        setProtocolo(protocolo);
        setDeleteProtocoloDialog(true);
    }

    const deleteProtocolo = () => {
        //toast.current.show({ severity: 'success', summary: 'Não autorizado', detail: 'Não é possível excluir protocolo com arquivo carregado! Necessário registrar cancelamento ou rejeição!', life: 3000 });
    }

    const findIndexById = (controle: string) => {
        
        let index = -1;
        /*
        for (let i = 0; i < products.length; i++) {
            if (products[i].id === id) {
                index = i;
                break;
            }
        }
        */
        return index;
    }

    const createId = () => {
        let id = '';
        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }

    const exportCSV = () => {
        if (dt == null) return;
        if (dt.current == null) return;
        if (typeof dt.current.exportCSV == 'function' ) {
            dt.current.exportCSV();
        }
    }

    const confirmDeleteSelected = () => {
        setDeleteProtocoloDialog(true);
    }

    const deleteSelectedProtocolos = () => {
        let _protocolos = protocolos.filter(val => selectedProtocolos == null ? false : !selectedProtocolos.includes(val));
        setProtocolos(_protocolos);
        setDeleteProtocolosDialog(false);
        setSelectedProtocolos(new Array());
        //toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
    }

    const onEmpresaChange = (e: DropdownChangeParams) => {
        console.log(e);
        let _protocolo = { ...protocolo };
        _protocolo['empresa'] = e;
        setProtocolo(_protocolo);
    }

    const onDepartamentoChange = (e: DropdownChangeParams) => {
        let _protocolo = { ...protocolo };
        _protocolo['departamento'] = e;
        setProtocolo(_protocolo);
    }

    const onInputChange = (e: any, name: keyof Protocolo) => {
        const val = (e.target && e.target?.value) || '';
        let _protocolo = { ...protocolo } as any;
        _protocolo[`${name}`] = val;

        setProtocolo(_protocolo);
    }

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="Novo" icon="pi pi-plus" className="p-button-success p-mr-2" onClick={openNew} />
                <Button label="Excluir" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedProtocolos || !selectedProtocolos.length} />
            </React.Fragment>
        )
    }

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="Exportar" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />
            </React.Fragment>
        )
    }

    const controleBodyTemplate = (rowData: Protocolo) => {
        return (
            <>
                <span className="p-column-title">Protocolo</span>
                {rowData.controle}
            </>
        );
    }

    const origemBodyTemplate = (rowData: Protocolo) => {
        return (
            <>
                <span className="p-column-title">Documento</span>
                {rowData.origem}
            </>
        );
    }

    const empresaBodyTemplate = (rowData: Protocolo) => {
        return (
            <>
                <span className="p-column-title">Empresa</span>
                {rowData.empresa}
            </>
        );
    }

    const departamentoBodyTemplate = (rowData: Protocolo) => {
        return (
            <>
                <span className="p-column-title">Departamento</span>
                {rowData.departamento}
            </>
        );
    }

    const dtRegistroBodyTemplate = (rowData: Protocolo) => {
        console.log(rowData.dt_registro);

        return (
            <>
                <span className="p-column-title">Registro</span>
                <Calendar dateFormat="dd/mm/yy" value={rowData.dt_registro} ></Calendar>
            </>
        );
    }

    const actionBodyTemplate = (rowData: Protocolo) => {
        const controle = rowData.controle;
        return (
            <div className="actions">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" onClick={() => editProtocolo(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteProtocolo(rowData)} />
            </div>
        );
    }

    const header = (
        <div className="table-header">
            <h5 className="p-m-0">Protocolos</h5>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e: any) => setGlobalFilter(e.currentTarget.value)} placeholder="Pesquisa..." />
            </span>
        </div>
    );

    const protocoloDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveProtocolo} />
        </>
    );
    const deleteProtocoloDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProtocoloDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteProtocolo} />
        </>
    );
    const deleteProductsDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProtocolosDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedProtocolos} />
        </>
    );

    return (
        <div className="p-grid crud-demo">
            <div className="p-col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="p-mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable ref={dt} value={protocolos} selection={selectedProtocolos} onSelectionChange={(e) => setSelectedProtocolos(e.value)}
                        dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} até {last} de {totalRecords} protocolos"
                        globalFilter={globalFilter} emptyMessage="Nenhum protocolo encontrado." header={header}
                        style={{'min-width': '90vh'}}
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                        <Column field="controle" header="Protocolo" sortable body={controleBodyTemplate}></Column>
                        <Column field="dt_registro" header="Registro" sortable body={dtRegistroBodyTemplate}></Column>
                        <Column field="origem" header="Documento" sortable body={origemBodyTemplate}></Column>
                        <Column field="empresa" header="Empresa" sortable body={empresaBodyTemplate}></Column>
                        <Column field="departamento" header="Departamento" sortable body={departamentoBodyTemplate}></Column>
                        <Column body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog position="top" visible={protocoloDialog} style={{ width: '80vw' }} header="Criar/editar" modal className="p-fluid" footer={protocoloDialogFooter} onHide={hideDialog}>
                        <div className="p-field">
                            <label htmlFor="origem">Origem</label>
                            <InputText id="origem" value={protocolo.origem} onChange={(e) => onInputChange(e, 'origem')} required autoFocus className={classNames({ 'p-invalid': submitted && !protocolo.origem })} />
                            {submitted && !protocolo.origem && <small className="p-invalid">Origem é obrigatório.</small>}
                        </div>
                        <div className="p-field p-col-6">
                            <label className="p-mb-3">Empresa</label>
                            <Dropdown value={protocolo.empresa} options={empresas} onChange={(e: DropdownChangeParams) => onEmpresaChange(e.value)} placeholder="Selecione a empresa"/>
                        </div>
                        <div className="p-field p-col-6">
                            <label className="p-mb-3">Departamento</label>
                            <Dropdown value={protocolo.departamento} options={departamentos} onChange={(e: DropdownChangeParams) => onDepartamentoChange(e.value)} placeholder="Selecione o departamento"/>
                        </div>
                        <div className="p-field">
                            <label htmlFor="origem">Arquivos</label>
                            <FileUpload mode="basic" maxFileSize={1000000} name="filesToUpload" chooseLabel="Arquivos" className="p-mr-2 p-d-inline-block" multiple accept="application/pdf" />
                            <div>
                                { 
                                    filesToUpload.map((fl) => {
                                        return <div>{fl}</div>;
                                    })
                                }
                            </div>
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProtocoloDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProtocoloDialogFooter} onHide={hideDeleteProtocoloDialog}>
                        <div className="confirmation-content">
                            <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
                            {protocolo && <span>Tem certeza que deseja excluir o protocolo <b>{protocolo.controle}</b>?</span>}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProtocolosDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProtocoloDialogFooter} onHide={hideDeleteProtocolosDialog}>
                        <div className="confirmation-content">
                            <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
                            {protocolo && <span>Tem certeza que deseja excluir os protocolos selecionados?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
}

export default Protocolos