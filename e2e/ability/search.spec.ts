import { expect, test } from '@playwright/test'

import { getSearchParam } from '../utils/url'

test.describe('특성 목록 검색', () => {
  test('입력하면 URL에 반영되고, 다 지우면 빠진다', async ({ page }) => {
    await page.goto('/ability')
    const input = page.getByRole('searchbox', { name: '특성 이름으로 검색' })

    await input.fill('정전기')
    await expect.poll(() => getSearchParam(page, 'search')).toBe('정전기')

    await input.fill('')
    await expect.poll(() => getSearchParam(page, 'search')).toBeNull()
  })
})
