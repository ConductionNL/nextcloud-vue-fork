<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<docs>
### General description

This component renders a row of quick filters above a list or a table, such as "Mine", "Open" and "Overdue". Each filter is a toggle button drawn as a pill, and the selected one is filled with the primary color. A filter can have an icon and a count, for example the number of items it matches.

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

### Exposed CSS Variables

| Variable | Description |
|---|---|
| `--quick-filter-bar-gap` | Space between the filters. Defaults to two grid baselines. |
| `--quick-filter-bar-filter-color` | Text color of a filter. Defaults to `--color-main-text`. |
| `--quick-filter-bar-filter-background-color` | Background of a filter. Defaults to `--color-background-hover`. |
| `--quick-filter-bar-filter-border-color` | Border color of a filter. Defaults to `--color-border`. |
| `--quick-filter-bar-filter-border-width` | Border width of a filter. Defaults to `1px 1px 2px`, like a button. |
| `--quick-filter-bar-filter-border-radius` | Corner radius of a filter. Defaults to `--border-radius-pill`. |
| `--quick-filter-bar-filter-min-block-size` | Minimum height of a filter. Defaults to the height of a small button. |
| `--quick-filter-bar-filter-padding-block` | Space above and below the content of a filter, as one or two values. Defaults to `1px 0`. |
| `--quick-filter-bar-filter-padding-inline` | Space before and after the content of a filter, as one or two values. Defaults to the button padding. |
| `--quick-filter-bar-filter-font-family` | Font of a filter. Inherited by default. |
| `--quick-filter-bar-filter-font-size` | Font size of a filter. Defaults to `--default-font-size`. |
| `--quick-filter-bar-filter-font-weight` | Font weight of a filter. Defaults to `--font-weight-element`. |
| `--quick-filter-bar-filter-text-transform` | Text transform of a filter, for example `uppercase`. Defaults to `none`. |
| `--quick-filter-bar-filter-hover-color` | Text color of a hovered filter. Defaults to `--quick-filter-bar-filter-color`. |
| `--quick-filter-bar-filter-hover-background-color` | Background of a hovered filter. Defaults to `--color-background-dark`. |
| `--quick-filter-bar-filter-hover-border-color` | Border color of a hovered filter. Defaults to `--quick-filter-bar-filter-border-color`. |
| `--quick-filter-bar-filter-focus-color` | Text color of a filter focused with the keyboard. Defaults to `--quick-filter-bar-filter-color`. |
| `--quick-filter-bar-filter-focus-background-color` | Background of a filter focused with the keyboard. Defaults to `--quick-filter-bar-filter-background-color`. |
| `--quick-filter-bar-filter-focus-border-color` | Border color of a filter focused with the keyboard. Defaults to `--quick-filter-bar-filter-border-color`. |
| `--quick-filter-bar-filter-pressed-color` | Text color of a selected filter. Defaults to `--color-primary-element-text`, like a primary button. |
| `--quick-filter-bar-filter-pressed-background-color` | Background of a selected filter. Defaults to `--color-primary-element`. |
| `--quick-filter-bar-filter-pressed-border-color` | Border color of a selected filter. Defaults to `--color-primary-element`. |
| `--quick-filter-bar-filter-pressed-hover-background-color` | Background of a hovered selected filter. Defaults to `--color-primary-element-hover`. |
| `--quick-filter-bar-filter-pressed-font-weight` | Font weight of a selected filter. Defaults to `--quick-filter-bar-filter-font-weight`. |

They can be set on the filters or on any of its parents, for example `body` to restyle every quick filter bar at once. The names follow the pressed button tokens of the NL Design System.
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
			:class="$style.ncQuickFilterBar__filter"
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
					type="outlined"
					:active="isSelected(filter)" />
			</span>
		</NcButton>
	</div>
</template>

<style lang="scss" module>
.ncQuickFilterBar {
	// NcButton's label reads --font-weight-element; capture it here, as redeclaring
	// it on the button with itself as the fallback would be a cycle
	--quick-filter-bar-default-font-weight: var(--font-weight-element, bold);
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: var(--quick-filter-bar-gap, calc(2 * var(--default-grid-baseline)));
}

// The filters are pills: light grey while not selected and filled with the primary
// color when selected, like a primary button. The two classes outrank NcButton's own
// scoped rules without `!important`.
.ncQuickFilterBar .ncQuickFilterBar__filter:global(.button-vue) {
	--font-weight-element: var(--quick-filter-bar-filter-font-weight, var(--quick-filter-bar-default-font-weight));
	color: var(--quick-filter-bar-filter-color, var(--color-main-text));
	background-color: var(--quick-filter-bar-filter-background-color, var(--color-background-hover));
	border-color: var(--quick-filter-bar-filter-border-color, var(--color-border));
	// Corners only: NcButton derives its padding from --button-radius, so this must not set that
	border-radius: var(--quick-filter-bar-filter-border-radius, var(--border-radius-pill));
	border-width: var(--quick-filter-bar-filter-border-width, 1px 1px 2px);
	min-height: var(--quick-filter-bar-filter-min-block-size, var(--button-size));
	// One variable per axis: NcButton's own padding can be one or two values, which cannot be split per side
	padding-block: var(--quick-filter-bar-filter-padding-block, 1px 0);
	padding-inline: var(--quick-filter-bar-filter-padding-inline, var(--button-padding));
	font-family: var(--quick-filter-bar-filter-font-family, inherit);
	font-size: var(--quick-filter-bar-filter-font-size, var(--default-font-size));
	text-transform: var(--quick-filter-bar-filter-text-transform, none);

	// Focus before hover, and as specific, so a hovered filter keeps its hover colors
	&:focus-visible:not(:disabled) {
		color: var(--quick-filter-bar-filter-focus-color, var(--quick-filter-bar-filter-color, var(--color-main-text)));
		background-color: var(--quick-filter-bar-filter-focus-background-color, var(--quick-filter-bar-filter-background-color, var(--color-background-hover)));
		border-color: var(--quick-filter-bar-filter-focus-border-color, var(--quick-filter-bar-filter-border-color, var(--color-border)));
	}

	&:hover:not(:disabled) {
		color: var(--quick-filter-bar-filter-hover-color, var(--quick-filter-bar-filter-color, var(--color-main-text)));
		background-color: var(--quick-filter-bar-filter-hover-background-color, var(--color-background-dark));
		border-color: var(--quick-filter-bar-filter-hover-border-color, var(--quick-filter-bar-filter-border-color, var(--color-border)));
	}

	&[aria-pressed='true'] {
		--font-weight-element: var(--quick-filter-bar-filter-pressed-font-weight, var(--quick-filter-bar-filter-font-weight, var(--quick-filter-bar-default-font-weight)));
		color: var(--quick-filter-bar-filter-pressed-color, var(--color-primary-element-text));
		background-color: var(--quick-filter-bar-filter-pressed-background-color, var(--color-primary-element));
		border-color: var(--quick-filter-bar-filter-pressed-border-color, var(--color-primary-element));

		&:hover:not(:disabled) {
			color: var(--quick-filter-bar-filter-pressed-color, var(--color-primary-element-text));
			background-color: var(--quick-filter-bar-filter-pressed-hover-background-color, var(--color-primary-element-hover));
		}
	}
}

.ncQuickFilterBar__label {
	display: inline-flex;
	align-items: center;
	gap: var(--default-grid-baseline);
}

// The count takes the text color of its filter, dark on a filter and light on the selected one
.ncQuickFilterBar .ncQuickFilterBar__filter :global(.counter-bubble__counter--outlined) {
	color: inherit;
}
</style>
