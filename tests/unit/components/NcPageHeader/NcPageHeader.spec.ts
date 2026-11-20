/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import NcPageHeader from '../../../../src/components/NcPageHeader/NcPageHeader.vue'

describe('NcPageHeader', () => {
	it('renders the name as a level 2 heading by default', () => {
		const wrapper = mount(NcPageHeader, { props: { name: 'Documents' } })
		expect(wrapper.element.tagName).toBe('HEADER')
		expect(wrapper.get('h2').text()).toBe('Documents')
	})

	it('renders the heading at the given level', () => {
		const wrapper = mount(NcPageHeader, { props: { name: 'Documents', headingLevel: 4 } })
		expect(wrapper.find('h2').exists()).toBe(false)
		expect(wrapper.get('h4').text()).toBe('Documents')
	})

	it('does not render a level 1 heading', () => {
		// @ts-expect-error -- level 1 is not part of the type, but can still be passed at runtime
		const wrapper = mount(NcPageHeader, { props: { name: 'Documents', headingLevel: 1 } })
		expect(wrapper.find('h1').exists()).toBe(false)
		expect(wrapper.get('h2').text()).toBe('Documents')
	})

	it('renders the description only when it is set', () => {
		const without = mount(NcPageHeader, { props: { name: 'Documents' } })
		expect(without.find('p').exists()).toBe(false)

		const withDescription = mount(NcPageHeader, { props: { name: 'Documents', description: 'All documents' } })
		expect(withDescription.get('p').text()).toBe('All documents')
	})

	it('renders the icon only when an icon path or icon slot is given', () => {
		const without = mount(NcPageHeader, { props: { name: 'Documents' } })
		expect(without.find('svg').exists()).toBe(false)

		const withPath = mount(NcPageHeader, { props: { name: 'Documents', iconPath: 'M0 0h24v24H0z' } })
		expect(withPath.find('svg path').attributes('d')).toBe('M0 0h24v24H0z')

		const withSlot = mount(NcPageHeader, {
			props: { name: 'Documents', iconPath: 'M0 0h24v24H0z' },
			slots: { icon: '<span class="custom-icon" />' },
		})
		expect(withSlot.find('.custom-icon').exists()).toBe(true)
		expect(withSlot.find('svg').exists()).toBe(false)
	})

	it('renders the actions slot', () => {
		const wrapper = mount(NcPageHeader, {
			props: { name: 'Documents' },
			slots: { actions: '<button type="button">New document</button>' },
		})
		expect(wrapper.get('button').text()).toBe('New document')
	})
})
