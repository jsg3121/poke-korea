import { Metadata } from 'next'
import { parseFormatSlug } from '~/utils/championsFormat.util'
import { generateChampionsDetailMetadata } from '../../../_metadata/generateChampionsDetailMetadata'
import { renderChampionsDetail } from '../../../_fetch/renderChampionsDetail'

export const revalidate = 86400

interface PageProps {
  params: Promise<{ format: string; pokemonId: string; formCode: string }>
}

export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
  const { format, pokemonId, formCode } = await params
  const formatSlug = parseFormatSlug(format)

  if (!formatSlug) {
    return {
      title: '포켓몬을 찾을 수 없습니다 | 포케코리아',
      robots: { index: false, follow: false },
    }
  }

  return generateChampionsDetailMetadata({
    pokemonId: parseInt(pokemonId, 10),
    formatSlug,
    formCode,
  })
}

const ChampionsDetailRegionFormPage = async ({ params }: PageProps) => {
  const { format, pokemonId, formCode } = await params
  return renderChampionsDetail({ format, pokemonId, formCode })
}

export default ChampionsDetailRegionFormPage
