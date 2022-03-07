import React, { Component } from 'react';
import { Divider } from 'primereact/divider';

export class Footer extends Component {
  render() {
    return(
      <div className="flex footer">
        <div style={{'display': 'flex', 'flexDirection': 'column', 'color': '#fff', 'justifyItems':'center' }}>
          <i className="pi pi-calendar" style={{'fontSize': '2em', 'alignSelf': 'center'}}></i>
          <span>Recentes</span>
        </div>
        <Divider layout="vertical" />
        <div style={{'display': 'flex', 'flexDirection': 'column', 'color': '#fff', 'justifyItems':'center' }}>
          <i className="pi pi-question" style={{'fontSize': '2em', 'alignSelf': 'center'}}></i>
          <span>Pendentes</span>
        </div>
        <Divider layout="vertical" />
        <div style={{'display': 'flex', 'flexDirection': 'column', 'color': '#fff', 'justifyItems':'center' }}>
          <i className="pi pi-check" style={{'fontSize': '2em', 'alignSelf': 'center'}}></i>
          <span>Finalizadas</span>
        </div>
      </div>
    )
  }

}