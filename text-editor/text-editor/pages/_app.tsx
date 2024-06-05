"use client";
import '@/styles/globals.css'
import 'react-toastify/dist/ReactToastify.css';
import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import { createContext, useEffect, useState } from 'react'
export const userContext = createContext()
export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      require('bootstrap/dist/js/bootstrap.min.js')
    }
  }, [])

  const [userData,setUserdata]=useState()
  return (
    <userContext.Provider value={{ userData, setUserdata }}>
      <SessionProvider session={pageProps.session}>

        <Component {...pageProps} />
      </SessionProvider>
    </userContext.Provider>
  )
}
