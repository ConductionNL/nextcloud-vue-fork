/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { NcQuickFilterBarFilter } from '../../../../src/components/NcQuickFilterBar/NcQuickFilterBar.vue'

import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import NcQuickFilterBar from '../../../../src/components/NcQuickFilterBar/NcQuickFilterBar.vue'

const filters: NcQuickFilterBarFilter[] = [
	{ id: 'mine', name: 'Mine', count: 4 },
	{ id: 'open', name: 'Open', count: 12 },
	{ id: 'closed', name: 'Closed', iconPath: 'M0 0h24v24H0z' },
]

/**
 * Mount the filters with a working v-model.
 *
 * @param props - The other props
 */
function mountFilters(props: Record<string, unknown> = {}) {
	const wrapper = mount(NcQuickFilterBar, {
		props: {
			filters,
			modelValue: null,
			...props,
			'onUpdate:modelValue': (value: unknown) => wrapper.setProps({ modelValue: value as string | string[] | null }),
		},
	})
	return wrapper
}

/**
 * The names of the pressed filters.
 *
 * @param wrapper - The mounted filters
 */
function pressed(wrapper: ReturnType<typeof mountFilters>) {
	return wrapper.findAll('button[aria-pressed="true"]').map((button) => button.text().replace(/\d+/g, '').trim())
}

describe('NcQuickFilterBar', () => {
	it('renders a labeled group with a toggle button per filter', () => {
		const wrapper = mountFilters()
		expect(wrapper.attributes('role')).toBe('group')
		expect(wrapper.attributes('aria-label')).toBe('Quick filters')
		const buttons = wrapper.findAll('button')
		expect(buttons).toHaveLength(3)
		expect(buttons.every((button) => button.attributes('aria-pressed') === 'false')).toBe(true)
	})

	it('uses the given accessible name', () => {
		const wrapper = mountFilters({ ariaLabel: 'Case filters' })
		expect(wrapper.attributes('aria-label')).toBe('Case filters')
	})

	it('shows the count in a counter bubble', () => {
		const wrapper = mountFilters()
		const buttons = wrapper.findAll('button')
		expect(buttons[1].find('.counter-bubble__counter').text()).toBe('12')
		expect(buttons[2].find('.counter-bubble__counter').exists()).toBe(false)
	})

	it('shows the icon of a filter', () => {
		const wrapper = mountFilters()
		expect(wrapper.findAll('button')[2].find('svg path').attributes('d')).toBe('M0 0h24v24H0z')
	})

	it('selects one filter and clears it on a second click', async () => {
		const wrapper = mountFilters({ modelValue: 'mine' })
		expect(pressed(wrapper)).toEqual(['Mine'])

		await wrapper.findAll('button')[1].trigger('click')
		expect(wrapper.emitted('update:modelValue')).toEqual([['open']])
		expect(pressed(wrapper)).toEqual(['Open'])

		await wrapper.findAll('button')[1].trigger('click')
		expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([null])
		expect(pressed(wrapper)).toEqual([])
	})

	it('selects several filters with multiple', async () => {
		const wrapper = mountFilters({ multiple: true, modelValue: ['mine'] })

		await wrapper.findAll('button')[2].trigger('click')
		expect(wrapper.emitted('update:modelValue')).toEqual([[['mine', 'closed']]])
		expect(pressed(wrapper)).toEqual(['Mine', 'Closed'])

		await wrapper.findAll('button')[0].trigger('click')
		expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([['closed']])
		expect(pressed(wrapper)).toEqual(['Closed'])
	})
})
