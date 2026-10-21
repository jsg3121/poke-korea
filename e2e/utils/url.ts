import { Page } from '@playwright/test'

/**
 * 현재 페이지 URL의 쿼리 파라미터 값을 읽는다.
 * @param page Playwright 페이지
 * @param key 쿼리 키
 * @returns 파라미터 값. 없으면 null
 */
export const getSearchParam = (page: Page, key: string) =>
  new URL(page.url()).searchParams.get(key)

/**
 * 현재 페이지 URL의 쿼리 파라미터 값을 모두 읽는다.
 * @param page Playwright 페이지
 * @param key 쿼리 키
 * @returns 파라미터 값 배열
 */
export const getAllSearchParams = (page: Page, key: string) =>
  new URL(page.url()).searchParams.getAll(key)
