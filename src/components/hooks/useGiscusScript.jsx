import { useEffect } from 'react'
import { useRouter } from 'next/router'

export function useGiscusScript() {
  const router = useRouter()
  useEffect(() => {
    const src = 'https://giscus.app/client.js'

    const container = document.getElementById('giscusContainer')

    const isDark = document.documentElement.classList.contains('dark')

    // Check if the script is already in the document
    const scriptAlreadyLoaded = document.querySelector(`script[src="${src}"]`)
    if (scriptAlreadyLoaded) {
      return
    }

    // Create script element, set its source, and other attributes
    const script = document.createElement('script')
    script.src = src
    script.async = true
    script.setAttribute('crossorigin', 'anonymous')
    script.setAttribute('data-category-id', 'DIC_kwDOLm1k8s4CeTzV')
    script.setAttribute('data-category', 'General')
    script.setAttribute('data-emit-metadata', '1')
    script.setAttribute('data-input-position', 'top')
    script.setAttribute('data-lang', 'en')
    script.setAttribute('data-mapping', 'specific')
    script.setAttribute('data-reactions-enabled', '1')
    script.setAttribute('data-repo-id', 'R_kgDOLm1k8g')
    script.setAttribute('data-repo', 'pierregober/portfolio-work')
    script.setAttribute('data-strict', '0')
    script.setAttribute(
      'data-term',
      router.pathname === '/' ? 'home' : router.pathname
    )
    script.setAttribute('data-theme', 'preferred_color_scheme')

    // Append the script to the document body
    container.appendChild(script)

    // Clean up: Remove the script from the document when the component unmounts
    return () => {
      container.removeChild(script)
    }
  }, [router.pathname]) // Empty dependency array means this effect runs once on mount
}
