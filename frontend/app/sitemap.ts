import type { MetadataRoute } from 'next'


const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

const sitemap = (): MetadataRoute.Sitemap => [
  {
    url: baseUrl,
    changeFrequency: 'monthly',
    priority: 1,
  },
  {
    url: `${baseUrl}/login`,
    changeFrequency: 'yearly',
    priority: 0.2,
  },
]

export default sitemap
