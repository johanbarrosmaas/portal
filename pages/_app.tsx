import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Header } from '../lib/components/header';
import { Footer } from '../lib/components/footer';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <link rel="shortcut icon" href="favicon.png" type="image/x-icon" />
      <Header></Header>
        <Component {...pageProps} />
      <Footer></Footer>
    </>
    
  )
}

export default MyApp
