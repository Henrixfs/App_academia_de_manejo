import type { MetadataRoute } from 'next'


const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

const robots = (): MetadataRoute.Robots => ({
  rules: {
    userAgent: '*',
    allow: '/',
    disallow: ['/admin/', '/cuenta/'],
  },
  sitemap: `${baseUrl}/sitemap.xml`,
})

export default robots
