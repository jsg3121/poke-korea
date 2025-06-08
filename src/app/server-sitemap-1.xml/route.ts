import { NextRequest, NextResponse } from 'next/server'
import { getServerSideSitemapLegacy } from 'next-sitemap'
import { GetPokemonListDocument } from '~/graphql/gqlGenerated'
import { PokemonList } from '~/graphql/typeGenerated'
import { initializeApollo } from '~/module/apolloClient'

export async function GET(request: NextRequest) {
  const apolloClient = initializeApollo()

  const { data } = await apolloClient.query({
    query: GetPokemonListDocument,
    variables: {
      filter: {},
    },
  })

  const dynamicSiteMapIds = data.getPokemonList.map((pokemon: PokemonList) => {
    return {
      loc: `https://poke-korea.com/detail/${pokemon.number}`,
      lastmod: new Date().toISOString(),
      changefreq: 'daily',
      priority: 0.7,
    }
  })

  // Create sitemap XML manually since getServerSideSitemapLegacy is for Pages Router
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${dynamicSiteMapIds
  .map(
    (item) => `
  <url>
    <loc>${item.loc}</loc>
    <lastmod>${item.lastmod}</lastmod>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
  </url>`
  )
  .join('')}
</urlset>`

  return new NextResponse(sitemap, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400', // 24 hours
    },
  })
}