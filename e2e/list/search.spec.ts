import { expect, Page, test, TestInfo } from '@playwright/test'

import { getSearchParam } from '../utils/url'

const getSearchInput = (page: Page, testInfo: TestInfo) =>
  testInfo.project.name === 'mobile'
    ? page
        .getByRole('search', { name: '포켓몬 이름으로 목록 검색' })
        .getByRole('textbox')
    : page.getByRole('textbox', { name: '포켓몬 검색' })

test.describe('도감 목록 이름 검색', () => {
  test('검색어가 있는 URL로 진입하면 입력창에 검색어가 보인다', async ({
    page,
  }, testInfo) => {
    await page.goto('/list?name=피카')

    await expect(getSearchInput(page, testInfo)).toHaveValue('피카')
    expect(getSearchParam(page, 'name')).toBe('피카')
  })

  test('파라미터 없이 처음 입력하면 URL에 반영되고 입력창은 유지된다', async ({
    page,
  }, testInfo) => {
    await page.goto('/list')
    const input = getSearchInput(page, testInfo)

    await input.fill('피카')

    await expect.poll(() => getSearchParam(page, 'name')).toBe('피카')
    await expect(input).toHaveValue('피카')
  })

  test('앞뒤 공백은 빼고 URL에 반영한다', async ({ page }, testInfo) => {
    await page.goto('/list')

    await getSearchInput(page, testInfo).fill('  피카  ')

    await expect.poll(() => getSearchParam(page, 'name')).toBe('피카')
  })

  test('입력값을 다 지우면 URL에서 검색어가 빠진다', async ({
    page,
  }, testInfo) => {
    await page.goto('/list?name=피카')
    const input = getSearchInput(page, testInfo)
    await expect(input).toHaveValue('피카')

    await input.fill('')

    await expect.poll(() => getSearchParam(page, 'name')).toBeNull()
  })

  test('필터 초기화를 누르면 입력창도 비워진다', async ({ page }, testInfo) => {
    await page.goto('/list?name=피카')
    const input = getSearchInput(page, testInfo)
    await expect(input).toHaveValue('피카')

    await page
      .getByRole('search', { name: '타입별 포켓몬 필터 검색' })
      .getByRole('button', { name: '초기화' })
      .click()

    await expect.poll(() => getSearchParam(page, 'name')).toBeNull()
    await expect(input).toHaveValue('')
  })
})
