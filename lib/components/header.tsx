import React, { Component } from 'react';
import { Image } from 'primereact/image'

export class Header extends Component {

  render() {
    return(
      <nav className='header'>
        <Image src='/logo-bioma.png' className='logo-global'></Image>
      </nav>
    )
  }

}