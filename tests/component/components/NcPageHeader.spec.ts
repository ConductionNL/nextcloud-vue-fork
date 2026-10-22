/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { mdiFileDocumentOutline } from '@mdi/js'
import { expect, test } from '@playwright/experimental-ct-vue'
import NcPageHeader from '../../../src/components/NcPageHeader/NcPageHeader.vue'

for (const width of [360, 600, 1200]) {
	test(`keeps the heading next to the icon at ${width}px`, async ({ mount, page }) => {
		await page.setViewportSize({ width, height: 800 })
		await mount(NcPageHeader, {
			props: {
				name: 'Documents',
				description: 'All documents shared with your team, sorted by the date they were last changed. Pin a document to keep it at the top of this list.',
				iconPath: mdiFileDocumentOutline,
			},
			slots: { actions: '<button type="button">New document</button>' },
		})
		const icon = (await page.locator('header svg').boundingBox())!
		const heading = (await page.getByRole('heading', { name: 'Documents' }).boundingBox())!
		expect(heading.x).toBeGreaterThan(icon.x + icon.width)

		// The icon is centered on the heading's first line, which is 45px high by default
		const headingLineCenter = heading.y + 45 / 2
		expect(Math.abs(icon.y + icon.height / 2 - headingLineCenter)).toBeLessThan(1)
	})
}
