import './globals.css'
import Navigation from './components/Navigation'
import { useRouter } from 'next/router'

function MyApp({ Component, pageProps }) {
  const router = useRouter()
  const showNavigation = router.pathname.startsWith('/dashboard')
  return (
    <>
      {showNavigation && <Navigation />}
      <Component {...pageProps} />
    </>
  )
}

export default MyApp;
