import { expect, Page, test } from '@playwright/test'

import { getAllSearchParams, getSearchParam } from '../utils/url'

const openFilterModal = async (page: Page) => {
  await page
    .getByRole('search', { name: '타입별 포켓몬 필터 검색' })
    .getByRole('button', { name: '필터', exact: true })
    .click()
  const dialog = page.getByRole('dialog', { name: '추가 필터 검색' })
  await expect(dialog).toBeVisible()
  return dialog
}

test.describe('도감 목록 필터 모달', () => {
  test('세대와 포함 조건을 고르고 제출하면 URL에 반영된다', async ({
    page,
  }) => {
    await page.goto('/list')
    const dialog = await openFilterModal(page)

    await dialog.getByText('1세대', { exact: true }).click()
    await dialog.getByText('3세대', { exact: true }).click()
    await dialog
      .getByRole('group', { name: '메가진화 가능 포켓몬 포함' })
      .getByText('존재', { exact: true })
      .click()
    await dialog.getByRole('button', { name: '필터 조건으로 검색하기' }).click()

    await expect
      .poll(() => getAllSearchParams(page, 'generation'))
      .toEqual(['1', '3'])
    expect(getSearchParam(page, 'isMega')).toBe('true')
    await expect(dialog).toBeHidden()
  })

  test('"모두"를 고르면 해당 파라미터가 빠진다', async ({ page }) => {
    await page.goto('/list?isMega=true')
    const dialog = await openFilterModal(page)

    await dialog
      .getByRole('group', { name: '메가진화 가능 포켓몬 포함' })
      .getByText('모두', { exact: true })
      .click()
    await dialog.getByRole('button', { name: '필터 조건으로 검색하기' }).click()

    await expect.poll(() => getSearchParam(page, 'isMega')).toBeNull()
  })

  test('다시 열면 적용된 조건이 선택돼 있다', async ({ page }) => {
    await page.goto('/list?generation=2&isRegion=false')
    const dialog = await openFilterModal(page)

    await expect(dialog.getByRole('checkbox', { name: '2세대' })).toBeChecked()
    await expect(
      dialog.getByRole('checkbox', { name: '1세대' }),
    ).not.toBeChecked()
    await expect(
      dialog
        .getByRole('group', { name: '리전폼 존재 포켓몬 포함' })
        .getByRole('radio', { name: '존재하지 않음' }),
    ).toBeChecked()
  })

  test('제출해도 검색어와 타입 파라미터는 유지된다', async ({ page }) => {
    await page.goto('/list?name=피카&type=electric')
    const dialog = await openFilterModal(page)

    await dialog.getByText('1세대', { exact: true }).click()
    await dialog.getByRole('button', { name: '필터 조건으로 검색하기' }).click()

    await expect
      .poll(() => getAllSearchParams(page, 'generation'))
      .toEqual(['1'])
    expect(getSearchParam(page, 'name')).toBe('피카')
    expect(getSearchParam(page, 'type')).toBe('electric')
  })
})
