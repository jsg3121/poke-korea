/**
 * Chip 색 종류. 데미지 유형(물리/특수/변화)에 대응한다.
 *
 * @remarks
 * - `utils`·`containers` 등 여러 계층이 이 타입을 공유하므로 컴포넌트와 분리해
 *   둔다 — 컴포넌트 안에 두면 유틸이 컴포넌트를 참조하게 된다.
 */
export type ChipColor = 'physical' | 'special' | 'status'
