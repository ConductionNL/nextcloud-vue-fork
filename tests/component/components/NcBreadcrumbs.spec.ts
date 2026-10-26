/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { expect, test } from '@playwright/experimental-ct-vue'
import NcBreadcrumbs from '../../../src/components/NcBreadcrumbs/NcBreadcrumbs.vue'

const crumbs = [
	{ name: 'Home', href: '#home' },
	{ name: 'Documents', href: '#documents' },
	{ name: 'Reports', href: '#reports' },
]

for (const name of ['Documents', 'Reports']) {
	test(`lights up the ${name} crumb while something is dragged over it`, async ({ mount, page }) => {
		await mount(NcBreadcrumbs, { props: { crumbs } })
		const link = page.getByRole('link', { name })
		const idle = await link.evaluate((element) => getComputedStyle(element).backgroundColor)

		await link.evaluate((element) => element.closest('li')!.dispatchEvent(new DragEvent('dragenter', { bubbles: true, dataTransfer: new DataTransfer() })))
		await expect(link).not.toHaveCSS('background-color', idle)
		await expect(link).not.toHaveCSS('background-color', 'rgba(0, 0, 0, 0)')
	})
}
