/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Locator } from '@playwright/test'

import { expect, test } from '@playwright/experimental-ct-vue'
import NcQuickFilterBar from '../../../src/components/NcQuickFilterBar/NcQuickFilterBar.vue'

const filters = [
	{ id: 'open', name: 'Open' },
	{ id: 'mine', name: 'Mine' },
]

/**
 * The background and text color of an element.
 *
 * @param locator - The element
 */
async function colors(locator: Locator) {
	return locator.evaluate((element) => {
		const style = getComputedStyle(element)
		return { background: style.backgroundColor, color: style.color, border: style.borderTopColor }
	})
}

test('keeps the colors of a selected filter while it has keyboard focus or is hovered', async ({ mount, page }) => {
	await mount(NcQuickFilterBar, { props: { filters, modelValue: 'open' } })
	const open = page.getByRole('button', { name: 'Open' })
	const selected = await colors(open)

	await page.keyboard.press('Tab')
	await expect(open).toBeFocused()
	expect(await colors(open)).toEqual(selected)

	await open.hover()
	expect((await colors(open)).border).toBe(selected.border)
})

test('marks the selected filter in forced colors', async ({ mount, page }) => {
	await page.emulateMedia({ forcedColors: 'active' })
	await mount(NcQuickFilterBar, { props: { filters, modelValue: 'open' } })
	const selected = await colors(page.getByRole('button', { name: 'Open' }))
	const unselected = await colors(page.getByRole('button', { name: 'Mine' }))
	expect(selected.background).not.toBe(unselected.background)
	expect(selected.color).not.toBe(unselected.color)
})
