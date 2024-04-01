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

  // const LDSchema = {
  //   '@context': 'https://schema.org',
  //   '@type': 'BlogPosting',
  //   headline: pageProps.title,
  //   image: [
  //     'https://example.com/photos/1x1/photo.jpg',
  //     'https://example.com/photos/4x3/photo.jpg',
  //     'https://example.com/photos/16x9/photo.jpg',
  //   ],
  //   datePublished: '20-02-05T08:00:00+08:00',
  //   dateModified: '2015-02-05T09:20:00+08:00',
  //   author: [
  //     {
  //       '@type': 'Person',
  //       name: 'Jane Doe',
  //       url: 'https://example.com/profile/janedoe123',
  //     },
  //     {
  //       '@type': 'Person',
  //       name: 'John Doe',
  //       url: 'https://example.com/profile/johndoe123',
  //     },
  //   ],
  // }

  return (
    <>
      <Head>
        {router.pathname === '/' ? (
          <title>{`CleverlyDone Tech Blog`}</title>
        ) : (
          <title>{`${pageProps.title} - CleverlyDone Tech Blog`}</title>
        )}
        <meta name="description" content={pageProps.description} />
        {/* {LDSchema ?? (
          <script type="application/ld+json">{JSON.stringify(LDSchema)}</script>
        )} */}
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
