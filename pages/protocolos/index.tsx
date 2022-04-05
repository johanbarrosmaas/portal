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
import { InputNumber } from 'primereact/inputnumber';

import { Protocolo, protocoloExample } from '../../client/models/protocolo';
import { Departamento, Empresa, Filial } from '../../client/models/pilares';
import { getParsedDate } from '../../lib/helpers/date.util';
import { Header } from '../../lib/components/header';
import { useAuth, getToken } from '../../lib/context/auth';

function Protocolos(props: any) {
    const session = useAuth();


    const emptyProtocolo = {
        ...protocoloExample,
        owner: session.user?.email
    } as Protocolo;

    let filesToUpload = new Array();


    const situacoesBase = [
        { label: "Rascunho", value: "rascunho", publico: true },
        { label: "Status de aprovação", value: "status-de-aprovacao", publico: true },
        { label: "Informações Pendentes", value: "informacoes-pendentes", publico: false },
        { label: "Pendência Interna", value: "pendencia-interna", publico: false },
        { label: "Aprovado", value: "aprovado", publico: false },
    ]

    const departamentosExample = [
        { label: "01 - Logistica", value: "1" },
        { label: "02 - Frota", value: "2" },
        { label: "03 - Regulatório", value: "3" },
        { label: "04 - Financeiro", value: "4" },
        { label: "05 - Adm de Vendas", value: "5" },
        { label: "06 - RH", value: "6" },
        { label: "07 - Compras", value: "7" },
        { label: "08 - P&D", value: "8" },
        { label: "09 - Juridico", value: "9" },
        { label: "10 - Marketing", value: "10" },
        { label: "11 - Filiais", value: "11" },
        { label: "12 - TI", value: "12" },
        { label: "13 - Aeronaves", value: "13" },
    ]

    const processos = [
        { label: "NF Serviço", value: "nf_servico" },
        { label: "NF Produto", value: "nf_produto" },
        { label: "Fatura/Boleto", value: "fatura" },
        { label: "Taxas", value: "taxas" },
        { label: "Contrato", value: "contrato" },
        { label: "Laudo", value: "laudo" }
    ]

    const [token, setToken] = useState('');
    const [protocolos, setProtocolos] = useState(new Array());
    const [empresas, setEmpresas] = useState(new Array());
    const [departamentos, setDepartamentos] = useState(new Array());
    const [protocolo, setProtocolo] = useState(emptyProtocolo);
    const [protocoloDialog, setProtocoloDialog] = useState(false);
    const [status, setStatus] = useState('rascunho');
    const [statusDialog, setStatusDialog] = useState(false);
    
    const [deleteProtocoloDialog, setDeleteProtocoloDialog] = useState(false);
    const [deleteProtocolosDialog, setDeleteProtocolosDialog] = useState(false);
    
    const [selectedProtocolos, setSelectedProtocolos] = useState(new Array());
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef({} as DataTable);

    useEffect(() => {
        const token = getToken();
        if (token) {
            fetch('/api/protocolos', {
                headers: {
                    authorization: `Bearer ${token}`
                }
            }).then(res => {
                res.json().then(data => {
                    if (data instanceof Array) {
                        setProtocolos(data);
                    }
                })
            });
    
            fetch('/api/pilares/empresas', {
                headers: {
                    authorization: `Bearer ${token}`
                }
            }).then(res => {
                res.json().then((data: Array<Empresa>) => {
                    if (data instanceof Array) {
                        setEmpresas(data.map((record) => {
                            return { label: record.razao, value: record.apelido, filiais: record.filiais };
                        }));
                    }
                })
            });
    
            fetch('/api/pilares/departamentos', {
                headers: {
                    authorization: `Bearer ${token}`
                }
            }).then(res => {
                res.json().then((data: Array<Departamento>) => {
                    if (data instanceof Array) {
                        setDepartamentos(data.map((record) => {
                            return { label: record.nome, value: record.id };
                        }));
                    }
                })
            });
        }
    }, []);

    if (!session) return (<></>);

    const situacoesUsuario = situacoesBase.filter(situacao => situacao.publico);

    const openNew = () => {
        setProtocolo(emptyProtocolo);
        setSubmitted(false);
        setProtocoloDialog(true);
    }

    const hideDialog = () => {
        setSubmitted(false);
        setProtocoloDialog(false);
    }

    const hideStatusDialog = () => {
        setSubmitted(false);
        setStatusDialog(false);
    }

    const hideDeleteProtocoloDialog = () => {
        setDeleteProtocoloDialog(false);
    }

    const hideDeleteProtocolosDialog = () => {
        setDeleteProtocolosDialog(false);
    }

    const saveStatus = () => {
        if (!(status == null)) protocolo.situacao = status;
        setProtocolo(protocolo);
        saveProtocolo();
        setStatus('rascunho');
        setStatusDialog(false);
    }

    const saveProtocolo = () => {
        setSubmitted(true);
        let protSave = {...protocolo};
        

        if (protSave.owner == null) {
            if (!(session.user?.email == null)) protSave['owner'] = session.user?.email;
        }

        const body = JSON.stringify(protocolo);
        fetch('/api/protocolos', {
            method: 'POST',
            headers: {
                authorization: `Bearer ${getToken()}`
            }, 
            body
        }).then(res => {
            if (res.ok) {
                res.json().then(data => {
                    protSave = data;
                    
                    let _protocolos = [...protocolos];
                    let _protocolo = { ...protSave };
        
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
                }).catch(reason => {
                    console.error('JsonFetch', [reason]);
                });
            }
        }).catch(reason => {
            console.error('CatchFetch', [reason]);
        });
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

    const findIndexById = (id: string) => {
        
        let index = -1;
        
        for (let i = 0; i < protocolos.length; i++) {
            if (protocolos[i].id === id) {
                index = i;
                break;
            }
        }

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

    const onStatusDialogChange = (e: any) => {
        setStatus(e)
    }

    const onStatusChange = (protocolo: Protocolo, destino?: string) => {
        if (destino == 'next') {
            if (protocolo.situacao == 'rascunho') {
                setStatus('status-de-aprovacao');
                setProtocolo(protocolo);
                setStatusDialog(true);
            } else {
                setStatus(protocolo.situacao);
                setProtocolo(protocolo);
                setStatusDialog(true);    
            }
        }
        
        if (destino == null) {
            setStatus(protocolo.situacao);
            setProtocolo(protocolo);
            setStatusDialog(true);
        }
    }

    const onEmpresaChange = (e: any) => {
        let _protocolo = { ...protocolo };
        _protocolo['empresa'] = e as Empresa;
        setProtocolo(_protocolo);
    };

    const onUnidadeChange = (e: any) => {
        let _protocolo = { ...protocolo };
        console.log(e);
        _protocolo['unidade'] = e as Filial;
        setProtocolo(_protocolo);
    };

    const onDepartamentoChange = (e: any) => {
        let _protocolo = { ...protocolo };
        _protocolo['departamento'] = e;
        setProtocolo(_protocolo);
    }

    const onTipoProcessoChange = (e: any) => {
        console.log('tipo-processo');
        let _protocolo = { ...protocolo };
        _protocolo['processo'] = e.value;
        setProtocolo(_protocolo);
    }

    const onInputChange = (e: any, name: keyof Protocolo) => {
        const val = (e.target && e.target?.value) || '';

        let _protocolo = { ...protocolo } as any;
        _protocolo[`${name}`] = val;

        setProtocolo(_protocolo);
    }

    const onDocumentoChange = (e: any, name: keyof Protocolo) => {
        const val = (e.target && e.target?.value) || '';
        let _protocolo = { ...protocolo } as any;
        if (+val.length >= 14) {
            fetch(`https://publica.cnpj.ws/cnpj/${val.replace(/\D/g, '')}`).then(res => {
                if (res.ok) {
                    res.json().then(data => {
                        console.log(data);
                        const { razao_social, estabelecimento: { cnpj } } = data;
                        _protocolo.fornecedor = {
                            razao_social,
                            cnpj
                        };
                    });
                }
            }).catch(reason => {
                console.log(reason);    
            });
        }

        _protocolo[`${name}`] = val;
        console.log(_protocolo);
        setProtocolo(_protocolo);
    }

    const onSelectProtocolo = (e: Protocolo[]) => {
        setSelectedProtocolos(e);
    }

    const onHandleUpload = (e: any) => {
        console.log(e);
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
                <div>{ rowData.fornecedor?.razao_social }</div>
                <div>{ rowData.origem }</div>
            </>
        );
    }

    const empresaBodyTemplate = (rowData: Protocolo) => {
        const depto = departamentos.find(dep => dep.value == rowData.departamento);
        
        return (
            <>
                <div style={{'display': 'flex', 'flexDirection': 'column'}}>
                    <b style={{'textTransform': 'capitalize', fontSize: '1.2em'}}>{rowData.empresa}</b>
                    <div>
                        <span><b>Unidade:</b></span> {rowData.unidade.razao}
                    </div>
                    <div>
                        <span><b>Setor:</b></span> {depto?.label}
                    </div>
                </div>
            </>
        );
    }

    const processoBodyTemplate = (rowData: Protocolo) => {
        if (rowData.processo == null) return <></>;
        return (
            <>
                <span className="p-column-title">Processo</span>
            </>
        )
    }

    const unidadeBodyTemplate = (rowData: Protocolo) => {
        return (
            <>
                <span className="p-column-title">Unidade</span>
                {rowData.unidade ? 'Tem Unidade' : 'Não tem unidade'}
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

    const ordemCompraBodyTemplate = (rowData: Protocolo) => {
        return (
            <>
                <span className="p-column-title">OC</span>
                {rowData.compra_ordem}
            </>
        );
    }

    
    const valorDocumentoBodyTemplate = (rowData: Protocolo) => {
        return (
            <>
                <span className="p-column-title">Valor</span>
                {rowData.documento_valor}
            </>
        );
    }

    
    const vctoDocumentoBodyTemplate = (rowData: Protocolo) => {
        return (
            <>
                <span className="p-column-title">Vencimento</span>
                { rowData.documento_vcto && getParsedDate(rowData.documento_vcto)}
            </>
        );
    }

    const dtRegistroBodyTemplate = (rowData: Protocolo) => {
        return (
            <>
                <span className="p-column-title">Registro</span>
                { getParsedDate(rowData.dt_registro) }
            </>
        );
    }

    const situacaoBodyTemplace = (rowData: Protocolo) => {
        return (
            <>            
                <div className="p-inputgroup">
                    <Button className="p-button-outlined p-button-success" 
                        style={{textTransform: 'capitalize', marginRight: '0.2em'}} 
                        label={rowData.situacao}
                        onClick={(e) => onStatusChange(rowData)}
                    />
                    <Button icon="pi pi-chevron-right" className="p-button-success" onClick={(e) => onStatusChange(rowData, 'next')}/>
                </div>
            </>
        )
    }

    const filesTemplate = (file: File, props: any) => {
        console.log(file, props);
        filesToUpload.push(file);
        return (
            <>
                {file.name}
            </>
        )
    }

    const selectProtocolo = (rowData: Protocolo) => {
        console.log('selprot')
        console.log(rowData);
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
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e: any) => setGlobalFilter(e.currentTarget.value)} placeholder="Pesquisa..." />
            </span>
        </div>
    );

    const protocoloDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Salvar" icon="pi pi-check" className="p-button-text" onClick={saveProtocolo} />
        </>
    );
    const statusDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideStatusDialog} />
            <Button label="Salvar" icon="pi pi-check" className="p-button-text" onClick={saveStatus} />
        </>
    );
    const deleteProtocoloDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProtocoloDialog} />
            <Button label="Sim" icon="pi pi-check" className="p-button-text" onClick={deleteProtocolo} />
        </>
    );
    const deleteProductsDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProtocolosDialog} />
            <Button label="Sim" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedProtocolos} />
        </>
    );

    if (!!session && !!session?.user) {
        return (
            <>
                <Header session={session}></Header>
                <main>
                    <div className="p-grid grid-demo content">
                        <div className="p-col-12">
                            <div className="card">
                                <Toast ref={toast} />
                                <Toolbar className="p-mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
            
                                <DataTable ref={dt} value={protocolos} selection={selectedProtocolos} onSelectionChange={(e) => onSelectProtocolo(e.value)}
                                    dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive"
                                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                    currentPageReportTemplate="Mostrando {first} até {last} de {totalRecords} protocolos"
                                    globalFilter={globalFilter} emptyMessage="Nenhum protocolo encontrado." header={header}
                                    style={{minHeigth: '90vh'}}
                                >
                                    <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                                    <Column field="situacao" header="Status" sortable body={situacaoBodyTemplace}></Column>
                                    <Column field="controle" header="Protocolo" sortable body={controleBodyTemplate}></Column>
                                    <Column field="dt_registro" header="Registro" sortable body={dtRegistroBodyTemplate}></Column>
                                    <Column field="origem" header="Fornecedor" sortable body={origemBodyTemplate}></Column>
                                    <Column field="empresa" header="Empresa" sortable body={empresaBodyTemplate}></Column>
                                    <Column field="processo" header="Processo" sortable body={processoBodyTemplate}></Column>
                                    <Column field="compra_ordem" header="OC" sortable body={ordemCompraBodyTemplate}></Column>
                                    <Column field="documento_valor" header="Valor" sortable body={valorDocumentoBodyTemplate}></Column>
                                    <Column field="documento_vcto" header="Vencimento" sortable body={vctoDocumentoBodyTemplate}></Column>
                                    <Column body={actionBodyTemplate}></Column>
                                </DataTable>
                            </div>
                        </div>
                    </div>
                </main>

                
                
                <Dialog 
                    className="p-fluid" 
                    position="bottom" 
                    visible={statusDialog} 
                    style={{ width: '80vw' }} 
                    header="Mudar status" 
                    modal 
                    footer={statusDialogFooter} 
                    onHide={hideStatusDialog}
                >
                    <div className='p-grid'>
                        <div className="p-row">
                            <div className="p-col-2">
                                <label className="p-mb-3">Status</label>
                                <Dropdown value={status} options={situacoesUsuario} onChange={(e: DropdownChangeParams) => onStatusDialogChange(e.value)} 
                                    placeholder="Selecione um status"
                                />
                            </div>
                            <div className="p-col-2">
                                <label className="p-mb-3">Comentario</label>
                                <InputText></InputText>
                            </div>
                        </div>
                    </div>
                </Dialog>

                <Dialog 
                    className="p-fluid" 
                    position="bottom" 
                    visible={protocoloDialog} 
                    style={{ width: '80vw' }} 
                    header="Criar/editar" 
                    modal 
                    footer={protocoloDialogFooter} 
                    onHide={hideDialog}
                >
                    <div className="p-grid">
                        <div className="p-row">
                            <div className="p-field">
                                <label htmlFor="origem">Fornecedor (CNPJ/CPJ)</label>
                                <div><b> { protocolo?.fornecedor?.razao_social } </b></div>
                                <InputText id="origem" value={protocolo.origem} onChange={(e) => onDocumentoChange(e, 'origem')} required autoFocus className={classNames({ 'p-invalid': submitted && !protocolo.origem })} />
                                {submitted && !protocolo.origem && <small className="p-invalid">Origem é obrigatório.</small>}
                            </div>
                            <div className="col-2">
                                <label className="p-mb-3">Empresa</label>
                                <Dropdown value={protocolo.empresa} options={empresas} onChange={(e: DropdownChangeParams) => onEmpresaChange(e.value)} placeholder="Selecione a empresa"/>
                            </div>
                            <div className="col-2">
                                <label className="p-mb-3">Unidade</label>
                                <Dropdown value={protocolo.unidade} options={protocolo.empresa?.filiais?.map(filial => { return {value: filial.cnpj, label: filial.razao }})} onChange={(e) => onUnidadeChange(e.value)} placeholder="Selecione a unidade"/>
                            </div>
                            <div className="p-field p-col-6">
                                <label className="p-mb-3">Setores</label>
                                <Dropdown value={protocolo.departamento} options={departamentos} onChange={(e: DropdownChangeParams) => onDepartamentoChange(e.value)} placeholder="Selecione o departamento"/>
                            </div>
                            <div className="p-field p-col-6">
                                <label className="p-mb-3">Tipo Processo</label>
                                <Dropdown value={protocolo.processo} options={processos} onChange={(e: DropdownChangeParams) => onTipoProcessoChange(e)} placeholder="Selecione o tipo de processo"/>
                            </div>
                            <div className="p-field">
                                <label htmlFor="origem">Ordem Compra (OC)</label>
                                <InputNumber value={protocolo.compra_ordem} onValueChange={(e) => onInputChange(e, 'compra_ordem')}  mode="decimal" autoFocus/>
                            </div>
                            <div className="p-field">
                                <label htmlFor="origem">Valor</label>
                                <InputText id="origem" value={protocolo.documento_valor} onChange={(e) => onInputChange(e, 'documento_valor')} autoFocus />
                            </div>
                            <div className="p-field">
                                <label htmlFor="origem">Vencimento</label>
                                <Calendar id="origem" value={protocolo.documento_vcto} onChange={(e) => onInputChange(e, 'documento_vcto')} />
                            </div>
                            <div className="p-field">
                                <label htmlFor="origem">Arquivos</label>
                                <FileUpload 
                                    maxFileSize={1000000} 
                                    url='./api/storage/protocolos'
                                    name="filesToUpload"
                                    itemTemplate={filesTemplate}
                                    chooseLabel="Arquivos" 
                                    className="p-mr-2 p-d-inline-block" 
                                    multiple 
                                    accept="application/pdf"
                                    uploadHandler={(e: any) => {onHandleUpload(e)}}
                                />
                            </div>
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
            </>
        );
    } else {
        return (
            <>
                <Header session={session}></Header>
            </>
        );
    }
}

export default Protocolos