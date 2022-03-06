import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Header } from '../lib/components/header';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Header></Header>
        <Component {...pageProps} />
    </>
    
  )
}

export default MyApp
