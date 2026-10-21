<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<docs>
### General description

This component renders a row of quick filters above a list or a table, such as "Mine", "Open" and "Overdue". Each filter is a toggle button; the selected one is shown as a primary button. A filter can have an icon and a count, for example the number of items it matches.

Pass the filters in `filters` and bind the `id` of the selected filter with `v-model`. A click on the selected filter clears the selection again. With `multiple`, several filters can be selected at once and `v-model` holds an array of ids.

The component does not filter anything itself: filter the items by the selected ids. The filters are a group of toggle buttons with an accessible name, "Quick filters" unless `aria-label` is set. When the filters do not fit on one line, they wrap.

### Usage

```vue
<template>
	<div>
		<NcQuickFilterBar v-model="filter" :filters="filters" />
		<p>Selected filter: {{ filter || 'none' }}</p>
	</div>
</template>

<script>
export default {
	data() {
		return {
			filter: 'open',
			filters: [
				{ id: 'mine', name: 'Mine', count: 4 },
				{ id: 'open', name: 'Open', count: 12 },
				{ id: 'overdue', name: 'Overdue', count: 2 },
				{ id: 'closed', name: 'Closed' },
			],
		}
	},
}
</script>
```

### Multiple filters with icons

```vue
<template>
	<div>
		<NcQuickFilterBar
			v-model="selected"
			:filters="filters"
			multiple
			aria-label="Document types" />
		<p>Selected filters: {{ selected.join(', ') || 'none' }}</p>
	</div>
</template>

<script>
import { mdiFileDocumentOutline, mdiFileImageOutline, mdiFileTableOutline } from '@mdi/js'

export default {
	data() {
		return {
			selected: ['documents', 'images'],
			filters: [
				{ id: 'documents', name: 'Documents', iconPath: mdiFileDocumentOutline },
				{ id: 'spreadsheets', name: 'Spreadsheets', iconPath: mdiFileTableOutline },
				{ id: 'images', name: 'Images', iconPath: mdiFileImageOutline },
			],
		}
	},
}
</script>
```
</docs>

<script setup lang="ts">
import { t } from '../../l10n.ts'
import NcButton from '../NcButton/index.ts'
import NcCounterBubble from '../NcCounterBubble/index.ts'
import NcIconSvgWrapper from '../NcIconSvgWrapper/index.ts'

export interface NcQuickFilterBarFilter {
	/** The unique id of the filter, the value `v-model` holds when it is selected */
	id: string
	/** The name shown on the filter */
	name: string
	/** A number shown in a counter bubble after the name, for example how many items the filter matches */
	count?: number
	/** The SVG path of an icon shown before the name, for example one from `@mdi/js` */
	iconPath?: string
}

/**
 * The `id` of the selected filter, or `null` when none is selected.
 * With `multiple`, an array of the ids of the selected filters.
 */
const modelValue = defineModel<string | string[] | null>({ default: null })

const props = withDefaults(defineProps<{
	/**
	 * The filters, in order.
	 */
	filters: NcQuickFilterBarFilter[]

	/**
	 * Allow several filters to be selected at once. `v-model` then holds an array of ids.
	 */
	multiple?: boolean

	/**
	 * The name of the filters for assistive technology.
	 */
	ariaLabel?: string
}>(), {
	ariaLabel: () => t('Quick filters'),
})

defineEmits<{
	/**
	 * The selection changed.
	 *
	 * @param value - The id of the selected filter or `null`; with `multiple` an array of ids
	 */
	'update:modelValue': [value: string | string[] | null]
}>()

/**
 * The ids of the selected filters, whatever the model holds.
 */
function selectedIds(): string[] {
	const value = modelValue.value
	if (Array.isArray(value)) {
		return value
	}
	return value === null || value === undefined ? [] : [value]
}

/**
 * Whether a filter is selected.
 *
 * @param filter - The filter
 */
function isSelected(filter: NcQuickFilterBarFilter): boolean {
	return selectedIds().includes(filter.id)
}

/**
 * Select or deselect a filter.
 *
 * @param filter - The clicked filter
 */
function toggle(filter: NcQuickFilterBarFilter) {
	const selected = isSelected(filter)
	if (props.multiple) {
		modelValue.value = selected
			? selectedIds().filter((id) => id !== filter.id)
			: [...selectedIds(), filter.id]
	} else {
		modelValue.value = selected ? null : filter.id
	}
}
</script>

<template>
	<div
		:class="$style.ncQuickFilterBar"
		role="group"
		:aria-label="ariaLabel">
		<NcButton
			v-for="filter in filters"
			:key="filter.id"
			:pressed="isSelected(filter)"
			size="small"
			@click="toggle(filter)">
			<template v-if="filter.iconPath" #icon>
				<NcIconSvgWrapper :path="filter.iconPath" :size="16" />
			</template>
			<span :class="$style.ncQuickFilterBar__label">
				{{ filter.name }}
				<NcCounterBubble
					v-if="filter.count !== undefined"
					:count="filter.count"
					:active="isSelected(filter)" />
			</span>
		</NcButton>
	</div>
</template>

<style lang="scss" module>
.ncQuickFilterBar {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: var(--default-grid-baseline);
}

.ncQuickFilterBar__label {
	display: inline-flex;
	align-items: center;
	gap: var(--default-grid-baseline);
}
</style>
