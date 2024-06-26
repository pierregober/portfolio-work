import { Button } from '@/components/Button'
import { Heading } from '@/components/Heading'

const guides = [
  {
    description: 'Learn how to index your highest priority urls first',
    href: '/programmatically-process-urls-for-SEO-inspection-and-indexing',
    name: 'Programmatically Inspect & Index URLs',
  },
  {
    description: 'Learn how to leverage PageSpeed API to gather Web Vitals',
    href: '/programmatically-process-urls-for-SEO-web-vitals',
    name: 'Fetch Web Vital Info',
  },
  {
    description: 'Learn how to make your page load seconds faster!',
    href: '/generate-critical-css-aka-above-the-fold-using-gulp',
    name: 'Generate Critical CSS',
  },
  {
    description: 'Vet Tec Success Story',
    href: '/vet-tec-success-story',
    name: "VA's Pilot Program to Help Veterans Break Into Tech",
  },
]

export function Guides() {
  return (
    <div className="my-16 xl:max-w-none" style={{ maxWidth: 800 }}>
      <Heading level={2} id="guides">
        Latest Articles
      </Heading>
      <div className="not-prose mt-4 grid grid-cols-1 gap-8 border-t border-zinc-900/5 pt-10 dark:border-white/5 sm:grid-cols-2 xl:grid-cols-4">
        {guides.map((guide) => (
          <div key={guide.href}>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
              {guide.name}
            </h3>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              {guide.description}
            </p>
            <p className="mt-4">
              <Button href={guide.href} variant="text" arrow="right">
                Read more
              </Button>
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
