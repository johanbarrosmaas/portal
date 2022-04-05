import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Departamento } from '../../client/models/pilares';
import { Header } from '../../lib/components/header';
import { getToken, useAuth } from '../../lib/context/auth';
import { Chips } from 'primereact/chips';


function Departamentos(props: any) {

    const session = useAuth();

    let registroVazio = {
        
    } as Departamento;

    const [registros, setRegistros] = useState(new Array());
    const [registro, setRegistro] = useState(registroVazio);
    const [registroDialog, setRegistroDialog] = useState(false);

    
    const [selectedRegistros, setSelectedRegistros] = useState(new Array());
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef({} as Toast);
    const dt = useRef({} as DataTable);

    useEffect(() => {
        fetch('/api/pilares/departamentos', {
            headers: {
                authorization: `Bearer ${getToken()}`
            }
        }).then(res => {
            res.json().then(data => {
                setRegistros(data);
            })
        })
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


    const saveRegistro = () => {
        setSubmitted(true);
        let registroToSave = {...registro};
        
        const body = JSON.stringify(registroToSave);

        fetch('/api/pilares/departamentos', {
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
                            toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Setor cadastrado', life: 3000 });
                        }
                        else {
                            _registros.push(_registro);
                            toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Setor criado', life: 3000 });
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

    const editRegistro = (registro: Departamento) => {
        setRegistro({ ...registro });
        setRegistroDialog(true);
    }

    const findIndexById = (id: string) => {
        
        let index = -1;
        
        for (let i = 0; i < registros.length; i++) {
            if (registros[i]?.id === id) {
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

    const onInputChange = (e: any, name: keyof Departamento) => {
        const val = (e.target && e.target?.value) || '';

        let _registro = { ...registro } as any;
        _registro[`${name}`] = val;

        setRegistro(_registro);
    }

    const onSelectRegistros = (e: Departamento[]) => {
        setSelectedRegistros(e);
    }

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="Novo Setor" icon="pi pi-plus" className="p-button-success p-mr-2" onClick={openNew} />
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

    const idBodyTemplate = (rowData: Departamento) => {
        return (
            <>
                <span className="p-column-title">Id</span>
                {rowData.id}
            </>
        );
    }

    const nomeBodyTemplate = (rowData: Departamento) => {
        return (
            <>
                <span className="p-column-title">Nome</span>
                {rowData.nome}
            </>
        );
    }

    const actionBodyTemplate = (rowData: Departamento) => {
        return (
            <div className="actions">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" onClick={() => editRegistro(rowData)} />
            </div>
        );
    }

    const header = (
        <div className="table-header">
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
                                    <Column field="id" header="Id" sortable body={idBodyTemplate}></Column>
                                    <Column field="nome" header="Nome" sortable body={nomeBodyTemplate}></Column>
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
                                            <div className="p-field">
                                                <label htmlFor="id">Id</label>
                                                <InputText id="id" value={registro.id} onChange={(e) => onInputChange(e, 'id')} required autoFocus className={classNames({ 'p-invalid': submitted && !registro.id })} />
                                                {submitted && !registro.id && <small className="p-invalid">Id é obrigatório.</small>}
                                            </div>
                                            <div className="p-field">
                                                <label htmlFor="origem">Nome</label>
                                                <InputText id="origem" value={registro.nome} onChange={(e) => onInputChange(e, 'nome')} required autoFocus className={classNames({ 'p-invalid': submitted && !registro.nome })} />
                                                {submitted && !registro.nome && <small className="p-invalid">Nome é obrigatório.</small>}
                                            </div>
                                            <div className="p-col-6">
                                                <div className="p-field">
                                                    <label htmlFor="usuariosDepto">Usuarios</label>
                                                    <Chips id="usuariosDepto" value={registro?.users} onAdd={(e) => onAddUser(e)}></Chips>
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

export default Departamentos