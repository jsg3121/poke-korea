import LinkButtonComponent from '~/components/button/LinkButton.component'
import { pokemonNumberFormat } from '~/module/pokemonCard.module'

/**
 * 이전/다음 포켓몬 내비 (종 단위, UX-005 M2 신설).
 *
 * - 전국도감번호 ±1의 **기본 폼 상세**로만 이동한다. 폼(메가/리전/노말폼 인덱스)은
 *   승계하지 않는다 — 인접 종에 같은 폼이 있다는 보장이 없고, 폼이 내비를 오염하는
 *   반면교사(RES-003, 포켓몬코리아)를 피한다. 폼 전환은 DetailFormRow 책임.
 * - `<a href>`(LinkButton=Link)라 도감 전체를 잇는 크롤 경로가 된다(Google
 *   pagination 가이드 — rel=prev/next 미사용, 본문 링크 권장).
 * - 경계(1번·도감 마지막)는 해당 방향 데이터가 null → 자리만 유지해 반대쪽 정렬 보존.
 */

export interface AdjacentPokemon {
  number: number
  name: string
}

interface DetailSpeciesNavProps {
  prev: AdjacentPokemon | null
  next: AdjacentPokemon | null
}

const DetailSpeciesNavContainer = ({ prev, next }: DetailSpeciesNavProps) => {
  if (!prev && !next) return null

  return (
    <nav
      aria-label="도감 순서 이동"
      className="flex w-full items-center justify-between gap-2 px-4 py-3 desktop:mx-auto desktop:max-w-5xl"
    >
      {prev ? (
        <LinkButtonComponent
          href={`/detail/${prev.number}`}
          variant="secondary"
          size="sm"
          aria-label={`이전 포켓몬: No.${pokemonNumberFormat(prev.number)} ${prev.name}`}
        >
          ← No.{pokemonNumberFormat(prev.number)} {prev.name}
        </LinkButtonComponent>
      ) : (
        <span aria-hidden="true" />
      )}
      {next ? (
        <LinkButtonComponent
          href={`/detail/${next.number}`}
          variant="secondary"
          size="sm"
          aria-label={`다음 포켓몬: No.${pokemonNumberFormat(next.number)} ${next.name}`}
        >
          No.{pokemonNumberFormat(next.number)} {next.name} →
        </LinkButtonComponent>
      ) : (
        <span aria-hidden="true" />
      )}
    </nav>
  )
}

export default DetailSpeciesNavContainer
