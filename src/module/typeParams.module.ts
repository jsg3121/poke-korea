import { PokemonType } from '~/graphql/typeGenerated'
import { PokemonTypes } from '~/types/pokemonTypes.types'

/**
 * 타입 상세 페이지(`/type-effectiveness/[type]`) URL 슬러그 ↔ `PokemonType` 매핑.
 *
 * 슬러그는 **영문 소문자**를 쓴다(`/type-effectiveness/water`). 기존 `/list?type=`은
 * 쿼리 파라미터라 enum 문자열(`WATER`)을 그대로 넘기지만, 경로 세그먼트는 색인
 * 대상이라 관례대로 소문자를 쓴다(spec §15의 URL 예시와 일치).
 *
 * `movesParams.module.ts`와 같은 역할이되, 그쪽은 노출 대상이 일부(9종 중 4종)인
 * 반면 여기는 **18종 전부가 노출 대상**이라 별도 노출 목록이 없다.
 */

/** 슬러그 → PokemonType. enum 값이 곧 대문자 슬러그라 역변환으로 만든다. */
const SLUG_TO_TYPE: Record<string, PokemonType> = Object.fromEntries(
  Object.values(PokemonType).map((type) => [type.toLowerCase(), type]),
)

/** 18개 타입 슬러그 — 사이트맵·내부 링크 그리드가 이 순서를 쓴다. */
export const TYPE_SLUGS: ReadonlyArray<string> = Object.values(PokemonType).map(
  (type) => type.toLowerCase(),
)

/**
 * 슬러그를 타입으로 해석. 정의되지 않은 슬러그면 undefined.
 *
 * 호출부는 이 값이 undefined일 때 `notFound()`(페이지) 또는 오류 메타
 * (generateMetadata)로 분기한다 — 두 함수는 독립 실행되므로 양쪽 모두 가드가 필요하다.
 *
 * **대소문자를 구분한다.** `toLowerCase()`로 관대하게 받으면 `/water`와 `/WATER`가
 * 같은 내용을 다른 URL로 서빙해 중복 URL이 된다(§22). canonical이 정규 URL을
 * 가리키므로 색인은 통합되지만, 크롤 예산이 낭비되고 잘못된 링크가 방치된다.
 * 소문자 슬러그 하나만 유효한 경로로 둔다.
 */
export const parseTypeSlug = (slug: string): PokemonType | undefined =>
  SLUG_TO_TYPE[slug]

/** 타입 → 슬러그. 내부 링크를 만들 때 쓴다. */
export const buildTypeSlug = (type: PokemonType): string => type.toLowerCase()

/** 타입 상세 페이지 경로. */
export const buildTypeDetailPath = (type: PokemonType): string =>
  `/type-effectiveness/${buildTypeSlug(type)}`

/** 타입의 한국어 표기(`불꽃`, `페어리` …). 제목·본문 조립에 쓴다. */
export const getTypeLabel = (type: PokemonType): string => PokemonTypes[type]
