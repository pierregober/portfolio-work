import { useState } from 'react'

import Head from 'next/head'
import { Router, useRouter } from 'next/router'
import { MDXProvider } from '@mdx-js/react'

import { Layout } from '@/components/Layout'
import * as mdxComponents from '@/components/mdx'
import { useMobileNavigationStore } from '@/components/MobileNavigation'
import { HeroPattern } from '@/components/HeroPattern'

import '@/styles/tailwind.css'
import 'focus-visible'

function onRouteChange() {
  useMobileNavigationStore.getState().close()
}

Router.events.on('routeChangeStart', onRouteChange)
Router.events.on('hashChangeStart', onRouteChange)

export default function App({ Component, pageProps }) {
  let router = useRouter()

  const [darkMode, setDarkMode] = useState('preferred_color_scheme')

  return (
    <>
      <Head>
        {router.pathname === '/' ? (
          <title>{`CleverlyDone Tech Blog`}</title>
        ) : (
          <title>{`${pageProps.title} - CleverlyDone Tech Blog`}</title>
        )}
        <meta name="description" content={pageProps.description} />
      </Head>
      <MDXProvider components={mdxComponents}>
        <Layout darkMode={darkMode} setDarkMode={setDarkMode} {...pageProps}>
          <HeroPattern />
          <Component {...pageProps} />
        </Layout>
      </MDXProvider>
    </>
  )
}
