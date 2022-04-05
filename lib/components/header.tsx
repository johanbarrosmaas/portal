import React, { Component } from 'react';
import { Divider } from 'primereact/divider';

export class Header extends Component<any> {
  

  render() {
    if (this.props.session?.user?.email) {
      console.log(this.props.session?.stsTokenManager?.token);  
      return(
        <>
          <div className="flex header sticky">
            <div style={{width: '100%', display: 'flex', flexDirection: 'row'}}>
              <div style={{width: '20%' }}></div>
              <div className='flex header'>
                <a style={{'display': 'flex', 'flexDirection': 'column', 'color': '#000', 'justifyItems':'center', "textDecoration": "none" }} href="/">
                  <i className="pi pi-home" style={{'fontSize': '2em', 'alignSelf': 'center'}}></i>
                  <span>Início</span>
                </a>
                <Divider layout="vertical" />
                <a style={{'display': 'flex', 'flexDirection': 'column', 'color': '#000', 'justifyItems':'center', "textDecoration": "none" }} href="/protocolos">
                  <i className="pi pi-calendar" style={{'fontSize': '2em', 'alignSelf': 'center'}}></i>
                  <span>Protocolos</span>
                </a>
                {
                  false && 
                  <>
                    <Divider layout="vertical" />
                    <div style={{'display': 'flex', 'flexDirection': 'column', 'color': '#000', 'justifyItems':'center' }}>
                      <i className="pi pi-question" style={{'fontSize': '2em', 'alignSelf': 'center'}}></i>
                      <span>Pendentes</span>
                    </div>
                    <Divider layout="vertical" />
                    <div style={{'display': 'flex', 'flexDirection': 'column', 'color': '#000', 'justifyItems':'center' }}>
                      <i className="pi pi-check" style={{'fontSize': '2em', 'alignSelf': 'center'}}></i>
                      <span>Finalizadas</span>
                    </div> 
                  </>
                }
                {
                  this.props?.session?.user.isRoot &&
                  <>
                    <Divider layout="vertical" />
                    <a style={{'display': 'flex', 'flexDirection': 'column', 'color': '#000', 'justifyItems':'center', "textDecoration": "none"  }} href="/pilares/empresas">
                      <i className="pi pi-building" style={{'fontSize': '2em', 'alignSelf': 'center'}} ></i>
                      <span>Empresas</span>
                    </a>
                    <Divider layout="vertical" />
                    <a style={{'display': 'flex', 'flexDirection': 'column', 'color': '#000', 'justifyItems':'center', "textDecoration": "none"  }} href="/pilares/departamentos">
                      <i className="pi pi-briefcase" style={{'fontSize': '2em', 'alignSelf': 'center'}}></i>
                      <span>Setores</span>
                    </a>
                  </>
                }
              </div>  
              <div className="flex header" style={{ color: '#000', height: '22px', margin: 'auto', width: '20%'}}>
                <div>
                  <span>Usuário: </span>
                  <span>{ this.props?.session?.user?.email }</span>
                  <div style={{color: 'blue', justifySelf: 'end' }} onClick={this.props?.session?.logout}>Sair</div>
                </div>
              </div>  
            </div>
          </div>
          
        </>)
    } else {
      return(
        <>
          <div className="flex header">
            <div style={{width: '100%', display: 'flex', flexDirection: 'row'}}>
              <h3  style={{width: '80%', paddingLeft: '2%'}}>App central de lançamentos</h3>
              <div style={{fontStyle: 'bold', textAlign: 'center', margin: 'auto', width: '15%' }} onClick={this.props?.session?.login}>Entrar</div>  
            </div>
          </div>
        </>)
      
    }
    
  }

}