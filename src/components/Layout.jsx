// Vendors
import Link from 'next/link'
import { motion } from 'framer-motion'

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { Navigation } from '@/components/Navigation'
import { Prose } from '@/components/Prose'
import { SectionProvider } from '@/components/SectionProvider'

export function Layout({ children, darkMode, sections = [], setDarkMode }) {
  return (
    <SectionProvider sections={sections}>
      <div className="lg:ml-72 xl:ml-80">
        <motion.header
          layoutScroll
          className="contents lg:pointer-events-none lg:fixed lg:inset-0 lg:z-40 lg:flex"
        >
          <div className="contents lg:pointer-events-auto lg:block lg:w-72 lg:overflow-y-auto lg:border-r lg:border-zinc-900/10 lg:px-6 lg:pt-4 lg:pb-8 lg:dark:border-white/10 xl:w-80">
            <div className="hidden lg:flex">
              <Link
                className="prose dark:prose-invert"
                href="/"
                aria-label="Home"
                style={{
                  display: 'flex',
                }}
              >
                <h1 style={{ fontWeight: 800, margin: 'auto' }}>Cleverly</h1>
                <h1
                  style={{
                    color: '#a78bfa',
                    margin: 'auto',
                    fontWeight: 800,
                  }}
                >
                  Done
                </h1>
              </Link>
            </div>
            <Header setDarkMode={setDarkMode} />
            <Navigation className="hidden lg:mt-10 lg:block" />
          </div>
        </motion.header>
        <div className="relative px-4 pt-14 sm:px-6 lg:px-8">
          <main className="py-16">
            <Prose as="article">{children}</Prose>
          </main>
          <Footer darkMode={darkMode} />
        </div>
      </div>
    </SectionProvider>
  )
}
