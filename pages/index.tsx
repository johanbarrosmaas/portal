import type { NextPage } from 'next';
import React from 'react';
import { useAuth } from '../lib/context/auth';
import { Header } from '../lib/components/header';

const Home: NextPage = () => {
  const session = useAuth();
  return (
    <>
      <Header session={session}></Header>
      <main>
        <div className="p-grid crud-demo">
          <div className="p-col-12">
          </div>
        </div>          
      </main>
    </>
  )
}

export default Home
