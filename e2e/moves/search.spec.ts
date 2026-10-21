import { expect, test } from '@playwright/test'

import { getSearchParam } from '../utils/url'

test.describe('기술 목록 검색', () => {
  test('입력하면 URL에 반영된다', async ({ page }) => {
    await page.goto('/moves')
    const input = page.getByRole('searchbox', { name: '기술 이름으로 검색' })

    await input.fill('몸통박치기')

    await expect.poll(() => getSearchParam(page, 'search')).toBe('몸통박치기')
    await expect(input).toHaveValue('몸통박치기')
  })

  test('결과가 없을 때 검색·필터 초기화를 누르면 입력창도 비워진다', async ({
    page,
  }) => {
    await page.goto('/moves?search=존재하지않는기술이름')
    const input = page.getByRole('searchbox', { name: '기술 이름으로 검색' })
    await expect(input).toHaveValue('존재하지않는기술이름')

    await page.getByRole('button', { name: '검색·필터 초기화' }).click()

    await expect.poll(() => getSearchParam(page, 'search')).toBeNull()
    await expect(input).toHaveValue('')
  })
})
