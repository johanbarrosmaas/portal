import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Chips } from 'primereact/chips';
import { Empresa, empresaExample, Filial } from '../../client/models/pilares';
import { Header } from '../../lib/components/header';
import { useAuth } from '../../lib/context/auth';
import { getToken } from '../../lib/context/auth';

function Empresas(props: any) {

    const session = useAuth();

    let registroVazio = {
        ...empresaExample
    } as Empresa;

    let filialVazia = {} as Filial;
    
    const [token, setToken] = useState('');
    const [registros, setRegistros] = useState(new Array());
    const [registro, setRegistro] = useState(registroVazio);
    const [filial, setFilial] = useState(filialVazia);
    const [registroDialog, setRegistroDialog] = useState(false);
    const [filialDialog, setFilialDialog] = useState(false);

    
    const [selectedRegistros, setSelectedRegistros] = useState(new Array());
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef({} as Toast);
    const dt = useRef({} as DataTable);

    useEffect(() => {
        if (window?.navigator?.onLine) {
            fetch('/api/pilares/empresas', {
                headers: {
                    authorization: `Bearer ${getToken()}`
                }
            }).then(res => {
                res.json().then(data => {
                    setRegistros(data);
                }).catch(reason => {
                    console.log('Empresas:carregarEmpresas:json', [reason.message]);
                })
            }).catch(reason => {
                console.log('Empresas:carregarEmpresas:fetch', [reason.message]);
            })
        }
    }, []);

    if (!session) return (<></>);

    const openNew = () => {
        setRegistro(registroVazio);
        setSubmitted(false);
        setRegistroDialog(true);
    }

    const hideDialog = () => {
        setSubmitted(false);
        setRegistroDialog(false);
    }

    const openNewFilial = () => {
        setFilial(filialVazia);
        setSubmitted(false);
        setFilialDialog(true);
    }

    const hideFilialDialog = () => {
        setFilialDialog(false);
    }

    const saveRegistro = () => {
        setSubmitted(true);
        let registroToSave = {...registro};
        
        const body = JSON.stringify(registroToSave);

        fetch('/api/pilares/empresas', {
            method: 'POST',
            headers: {
                authorization: `Bearer ${getToken()}`
            },
            body
        }).then(res => {
            if (res.ok) {
                res.json().then(data => {
                    let _registros = [...registros];
                    let _registro = { ...data };
            
                        if (registro.id) {
                            const index = findIndexById(registro.id);
            
                            _registros[index] = _registro;
                            toast?.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Empresa atualizada', life: 3000 });
                        }
                        else {
                            _registros.push(_registro);
                            toast?.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Empresa criada', life: 3000 });
                        }
            
                        setRegistroDialog(false);
                        setRegistro(registroVazio);
                        setRegistros(_registros);
                }).catch(reason => {
                    console.error('JsonFetch', [reason]);
                });
            }
        }).catch(reason => {
            console.error('CatchFetch', [reason]);
        });
    }

    const saveFilial = () => {
        let filialToSave = {...filial};
        registro.filiais.push(filialToSave);
        setRegistro(registro);
        setFilial(filialVazia);
        setFilialDialog(false);
    }

    const editFilial = (filial: Filial) => {
        setFilial({ ...filial });
        setFilialDialog(true);
    }

    const editRegistro = (registro: Empresa) => {
        setRegistro({ ...registro });
        setRegistroDialog(true);
    }

    const findIndexById = (id: string) => {
        
        let index = -1;
        
        for (let i = 0; i < registros.length; i++) {
            if (registros[i].id === id) {
                index = i;
                break;
            }
        }
        return index;
    }

    const exportCSV = () => {
        if (dt == null) return;
        if (dt.current == null) return;
        if (typeof dt.current.exportCSV == 'function' ) {
            dt.current.exportCSV();
        }
    }

    const onInputChange = (e: any, name: keyof Empresa) => {
        const val = (e.target && e.target?.value) || '';

        let _registro = { ...registro } as any;
        _registro[`${name}`] = val;

        setRegistro(_registro);
    }

    const onAddUser = (e: any) => {
        const val = (e.value) || '';
        let _registro = { ...registro } as any;
        if (_registro.users && _registro.users.length) {
            _registro.users.push(val);
        } else {
            _registro.users = new Array(val);
        }
        
        setRegistro(_registro);
    }

    const onFilialInputChange = (e: any, name: keyof Filial) => {
        const val = (e.target && e.target?.value) || '';

        let _filial = { ...filial } as any;
        _filial[`${name}`] = val;

        setFilial(_filial);
    }

    const onSelectRegistros = (e: Empresa[]) => {
        setSelectedRegistros(e);
    }

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="Nova Empresa" icon="pi pi-plus" className="p-button-success p-mr-2" onClick={openNew} />
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

    const razaoBodyTemplate = (rowData: Empresa) => {
        return (
            <>
                <span className="p-column-title">Razão Social</span>
                {rowData.razao}
            </>
        );
    }

    const apelidoBodyTemplate = (rowData: Empresa) => {
        return (
            <>
                <span className="p-column-title">Apelido</span>
                {rowData.apelido}
            </>
        );
    }


    const actionBodyTemplate = (rowData: Empresa) => {
        return (
            <div className="actions">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" onClick={() => editRegistro(rowData)} />
            </div>
        );
    }

    const header = (
        <div className="table-header" style={{display: 'flex', flexDirection: 'row'}}>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e: any) => setGlobalFilter(e.currentTarget.value)} placeholder="Pesquisa..." />
            </span>
        </div>
    );

    const registroDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Salvar" icon="pi pi-check" className="p-button-text" onClick={saveRegistro} />
        </>
    );

    const filialDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideFilialDialog} />
            <Button label="Salvar" icon="pi pi-check" className="p-button-text" onClick={saveFilial} />
        </>
    );

    if (session) {
        return (
            <>
                <Header session={session}></Header>
                <main>
                    <div className="p-grid crud-demo content">
                        <div className="p-col-12">
                            <div className="card">
                                <Toast ref={toast} />
                                <Toolbar className="p-mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
            
                                <DataTable ref={dt} value={registros} selection={selectedRegistros} onSelectionChange={(e) => onSelectRegistros(e.value)}
                                    dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive"
                                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                    currentPageReportTemplate="Mostrando {first} até {last} de {totalRecords} registros"
                                    globalFilter={globalFilter} emptyMessage="Nenhum registro encontrado." header={header}
                                    style={{'minWidth': '90vh'}}
                                >
                                    <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                                    <Column field="apelido" header="Apelido" sortable body={apelidoBodyTemplate}></Column>
                                    <Column field="razao" header="Razão Social" sortable body={razaoBodyTemplate}></Column>
                                    <Column body={actionBodyTemplate}></Column>
                                </DataTable>
            
                                <Dialog 
                                    className="p-fluid" 
                                    position="top" 
                                    visible={registroDialog} 
                                    style={{ width: '80vw' }} 
                                    header="Criar/editar" 
                                    modal 
                                    footer={registroDialogFooter} 
                                    onHide={hideDialog}
                                >
                                    <div className="p-grid">
                                        <div className="p-row">
                                            <div className="p-col">
                                                <div className="p-field">
                                                    <label htmlFor="apelido">Apelido</label>
                                                    <InputText id="apelido" value={registro.apelido} onChange={(e) => onInputChange(e, 'apelido')} required autoFocus className={classNames({ 'p-invalid': submitted && !registro.apelido })} />
                                                    {submitted && !registro.apelido && <small className="p-invalid">Apelido é obrigatório.</small>}
                                                </div>
                                                <div className="p-field">
                                                    <label htmlFor="razao">Razão Social</label>
                                                    <InputText id="razao" value={registro.razao} onChange={(e) => onInputChange(e, 'razao')} required autoFocus className={classNames({ 'p-invalid': submitted && !registro.razao })} />
                                                    {submitted && !registro.razao && <small className="p-invalid">Razão Social é obrigatório.</small>}
                                                </div>
                                            </div>
                                            <div className="p-col-6">
                                                <div className="p-field">
                                                    <label htmlFor="usuariosEmpresa">Usuarios</label>
                                                    <Chips id="usuariosEmpresa" value={registro?.users} onAdd={(e) => onAddUser(e)}></Chips>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-row">
                                            <h4>Filiais</h4>
                                            <Button label="Nova Filial" icon="pi pi-plus" className="p-button-success p-mr-2" onClick={openNewFilial} />
                                        </div>
                                        <div className="p-row">
                                            {
                                                registro?.filiais.map(filial => {
                                                    return (
                                                        <>
                                                            <div className="p-col">
                                                                {filial.razao} - {filial.cnpj}
                                                            </div>
                                                        </>
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>
                                </Dialog>

                                <Dialog 
                                    className="p-fluid" 
                                    position="top" 
                                    visible={filialDialog} 
                                    style={{ width: '80vw' }} 
                                    header="Criar/editar filial" 
                                    modal
                                    footer={filialDialogFooter}
                                    onHide={hideDialog}
                                >
                                    <div className="p-grid">
                                        <div className="p-row">
                                            <div className="p-col-3">
                                                <div className="p-field">
                                                    <label htmlFor="filialRazao">Razão</label>
                                                    <InputText id="filialRazao" value={filial.razao} onChange={(e) => onFilialInputChange(e, 'razao')} required autoFocus className={classNames({ 'p-invalid': submitted && !filial.razao })} />
                                                    {submitted && !filial.razao && <small className="p-invalid">Nome é obrigatório.</small>}
                                                </div>
                                            </div>
                                            <div className="p-col-3">
                                                <div className="p-field">
                                                    <label htmlFor="filialCnpj">Cnpj</label>
                                                    <InputText id="filialCnpj" value={filial.cnpj} onChange={(e) => onFilialInputChange(e, 'cnpj')} required autoFocus className={classNames({ 'p-invalid': submitted && !filial.cnpj })} />
                                                    {submitted && !filial.cnpj && <small className="p-invalid">Cnpj é obrigatório.</small>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Dialog>
                            </div>
                        </div>
                    </div>
                </main>
            </>
        );
    }
}

export default Empresas