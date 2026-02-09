import { createMetadata } from '~/constants/seoMetaData'

/** 퀴즈 메인 페이지 메타데이터 */
export const QUIZ_MAIN_META = createMetadata(
  '포켓몬 퀴즈 모음 (실루엣·특성·타입·상성) | 포케 코리아',
  '실루엣, 특성, 타입, 타입 상성까지 4종류의 포켓몬 퀴즈를 20문제 4지선다로 풀어보세요. 완료 후 결과를 바로 확인할 수 있습니다.',
  '/quiz',
  '포켓몬 퀴즈 모음 | 포케 코리아',
)

/** 실루엣 퀴즈 페이지 메타데이터 */
export const QUIZ_SILHOUETTE_META = createMetadata(
  '포켓몬 실루엣 퀴즈 | 포케 코리아',
  '검은 실루엣만 보고 포켓몬 이름을 맞춰보세요! 4지선다 20문제, 완료 후 정답과 결과를 바로 확인할 수 있습니다.',
  '/quiz/silhouette',
  '포켓몬 실루엣 퀴즈 | 포케 코리아',
)

/** 특성 퀴즈 페이지 메타데이터 */
export const QUIZ_ABILITY_META = createMetadata(
  '포켓몬 특성 퀴즈 | 포케 코리아',
  '포켓몬 특성 설명을 보고 정답 특성을 골라보세요! 4지선다 20문제, 완료 후 정답과 결과를 바로 확인할 수 있습니다.',
  '/quiz/ability',
  '포켓몬 특성 퀴즈 | 포케 코리아',
)

/** 타입 퀴즈 페이지 메타데이터 */
export const QUIZ_POKEMON_TYPE_META = createMetadata(
  '포켓몬 타입 퀴즈 | 포케 코리아',
  '불꽃, 물, 풀 등 특정 타입을 가진 포켓몬을 골라보세요! 4지선다 20문제, 완료 후 정답과 결과를 바로 확인할 수 있습니다.',
  '/quiz/pokemon-type',
  '포켓몬 타입 퀴즈 | 포케 코리아',
)

/** 타입 상성 퀴즈 페이지 메타데이터 */
export const QUIZ_TYPE_EFFECTIVENESS_META = createMetadata(
  '포켓몬 타입 상성 퀴즈 | 포케 코리아',
  '공격·방어 타입 조합의 데미지 배수를 맞춰보세요! 2배·0.5배·0배 등 4지선다 20문제, 완료 후 정답과 결과를 바로 확인할 수 있습니다.',
  '/quiz/type-effectiveness',
  '포켓몬 타입 상성 퀴즈 | 포케 코리아',
)
