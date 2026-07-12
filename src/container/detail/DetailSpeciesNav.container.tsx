import Link from 'next/link'
import { pokemonNumberFormat } from '~/module/pokemonCard.module'

/**
 * 이전/다음 포켓몬 내비 (종 단위, UX-005 M2 신설).
 *
 * - 전국도감번호 ±1의 **기본 폼 상세**로만 이동한다. 폼(메가/리전/노말폼 인덱스)은
 *   승계하지 않는다 — 인접 종에 같은 폼이 있다는 보장이 없고, 폼이 내비를 오염하는
 *   반면교사(RES-003, 포켓몬코리아)를 피한다. 폼 전환은 DetailFormRow 책임.
 * - `<a href>`(Link)라 도감 전체를 잇는 크롤 경로가 된다(Google pagination 가이드).
 * - 이름은 모바일에서도 상시 표기(QA 라운드 3 — 번호만으로는 어디로 가는지 모름).
 *   좁은 폭 대응은 숨김이 아니라 **슬림 로컬 버튼**(text-2xs, 줄바꿈 방지)으로 푼다.
 *   이 내비는 상세 1곳 전용이라 DS 승격 없이 로컬 스타일로 관리한다(ADR-0010).
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

// 히어로 밝은 그라데이션 위 — secondary 버튼 문법(bg-primary-3) 차용한 슬림 알약
const navLinkClass =
  'flex min-h-8 items-center whitespace-nowrap rounded-2xl bg-primary-3 px-3 text-2xs font-semibold text-primary-1 transition-colors hover:bg-primary-2 hover:text-primary-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-1 desktop:min-h-touch desktop:px-4 desktop:text-sm'

const DetailSpeciesNavContainer = ({ prev, next }: DetailSpeciesNavProps) => {
  if (!prev && !next) return null

  return (
    <nav
      aria-label="도감 순서 이동"
      className="flex w-full items-center justify-between gap-2 px-4 py-3"
    >
      {prev ? (
        <Link
          href={`/detail/${prev.number}`}
          className={navLinkClass}
          aria-label={`이전 포켓몬: No.${pokemonNumberFormat(prev.number)} ${prev.name}`}
        >
          ← No.{pokemonNumberFormat(prev.number)} {prev.name}
        </Link>
      ) : (
        <span aria-hidden="true" />
      )}
      {next ? (
        <Link
          href={`/detail/${next.number}`}
          className={navLinkClass}
          aria-label={`다음 포켓몬: No.${pokemonNumberFormat(next.number)} ${next.name}`}
        >
          No.{pokemonNumberFormat(next.number)} {next.name} →
        </Link>
      ) : (
        <span aria-hidden="true" />
      )}
    </nav>
  )
}

export default DetailSpeciesNavContainer
