<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<docs>
### General description

This component renders a table of rows and columns, with sortable column headers, selectable rows, and loading and empty states. Use it for lists of records where people compare values across rows; for a simple list of items, use `NcListItem` instead.

Pass the columns as `columns` and the data as `rows`. Each row needs a unique value under `row-key`, `id` by default. A column `key` may be a dotted path such as `owner.name`.

The component does not load, sort or filter any data itself. Bind the sorting with `v-model:sort`: a click on a sortable header cycles it through ascending, descending and unsorted, and the table emits the new sorting. Sort or load the rows accordingly.

With `selectable`, every row gets a checkbox and the header a checkbox for all rows. Bind the keys of the selected rows with `v-model:selected`. Each checkbox is labeled with the name of its row, the value of the first column unless `row-label` returns another one. The selection outlives `rows`: keys of rows that are filtered out or on another page stay selected, also when all rows are selected or deselected, and the checkbox for all rows only looks at the rows that are shown. Remove those keys from `selected` when the selection should only hold rows that are shown.

Give every table a `caption`. It names the table for assistive technology and is not shown. When the table is wider than its container, it scrolls sideways and can be reached with the keyboard to do so.

### Usage

```vue
<template>
	<NcTable
		v-model:sort="sort"
		caption="Team members"
		:columns="columns"
		:rows="sortedRows" />
</template>

<script>
export default {
	data() {
		return {
			sort: { key: 'name', order: 'asc' },
			columns: [
				{ key: 'name', label: 'Name', sortable: true },
				{ key: 'role', label: 'Role', sortable: true },
				{ key: 'team.name', label: 'Team' },
				{ key: 'tickets', label: 'Open tickets', sortable: true, align: 'end' },
			],
			rows: [
				{ id: 1, name: 'Alice Peters', role: 'Developer', team: { name: 'Files' }, tickets: 4 },
				{ id: 2, name: 'Bram de Vries', role: 'Designer', team: { name: 'Talk' }, tickets: 12 },
				{ id: 3, name: 'Chen Li', role: 'Developer', team: { name: 'Files' }, tickets: 0 },
				{ id: 4, name: 'Dana Kowalski', role: 'Support', team: { name: 'Calendar' }, tickets: 7 },
			],
		}
	},

	computed: {
		sortedRows() {
			if (!this.sort) {
				return this.rows
			}
			const { key, order } = this.sort
			const direction = order === 'asc' ? 1 : -1
			return [...this.rows].sort((a, b) => (a[key] > b[key] ? 1 : a[key] < b[key] ? -1 : 0) * direction)
		},
	},
}
</script>
```

### Selection, custom cells and row actions

Override a cell with the `#cell-<key>` slot, which receives the row and its value. The `#rowActions` slot adds a trailing column, for example for an `NcActions` menu per row.

A click on a row, outside the controls in it, emits `rowClick`. It is a shortcut for mouse users only: a row cannot be focused, so keyboard and screen reader users cannot click it. Always give a row a real link or button for its main action as well, for example in the name cell, and use a link when the action navigates, so it can be opened in a new tab. A click that ends a text selection does not emit `rowClick`.

```vue
<template>
	<div>
		<p>Selected: {{ selected.join(', ') || 'none' }}</p>
		<NcTable
			v-model:selected="selected"
			caption="Documents"
			selectable
			:columns="columns"
			:rows="rows"
			@row-click="(row) => opened = row.name">
			<template #cell-name="{ row, value }">
				<NcButton variant="tertiary" @click="opened = row.name">
					{{ value }}
				</NcButton>
			</template>
			<template #cell-status="{ value }">
				<NcChip :text="value" :variant="value === 'Published' ? 'success' : 'secondary'" no-close />
			</template>
			<template #rowActions="{ row }">
				<NcActions>
					<NcActionButton close-after-click @click="opened = row.name">
						Open
					</NcActionButton>
				</NcActions>
			</template>
		</NcTable>
		<p v-if="opened">Opened: {{ opened }}</p>
	</div>
</template>

<script>
export default {
	data() {
		return {
			selected: [],
			opened: '',
			columns: [
				{ key: 'name', label: 'Name' },
				{ key: 'status', label: 'Status' },
				{ key: 'modified', label: 'Modified', description: 'The last time the document was saved' },
			],
			rows: [
				{ id: 'a', name: 'Annual report.md', status: 'Published', modified: '12 Oct 2026' },
				{ id: 'b', name: 'Budget 2027.ods', status: 'Draft', modified: '14 Oct 2026' },
				{ id: 'c', name: 'Roadmap.md', status: 'Draft', modified: '16 Oct 2026' },
			],
		}
	},
}
</script>
```

### Loading and empty

```vue
<template>
	<div style="display: grid; gap: 16px">
		<NcTable caption="Loading" loading :columns="columns" :rows="[]" />
		<NcTable caption="Empty" :columns="columns" :rows="[]">
			<template #empty>
				No documents yet. Upload one to see it here.
			</template>
		</NcTable>
	</div>
</template>

<script>
export default {
	data() {
		return {
			columns: [
				{ key: 'name', label: 'Name' },
				{ key: 'modified', label: 'Modified' },
			],
		}
	},
}
</script>
```

### Exposed CSS Variables

The table can be restyled with the CSS variables below, set on the table or on any of its parents, for example `body` to restyle every table at once. None of them is set by default, so until one is, the table looks as it does above. The names follow the table tokens of the NL Design System.

| Variable | Description |
|---|---|
| `--table-background-color` | Background of the table. Defaults to `transparent`. |
| `--table-header-background-color` | Background of the header row. Defaults to `transparent`. |
| `--table-header-color` | Text color of the header cells. Defaults to `--color-text-maxcontrast`. |
| `--table-header-border-block-end-color` | Color of the line under the header row. Defaults to `--color-border`. |
| `--table-data-cell-color` | Text color of the cells. Defaults to `--color-main-text`. |
| `--table-row-background-color` | Background of a row. Defaults to `transparent`. |
| `--table-row-alternate-odd-background-color` | Background of the first, third and every other odd row, for striped rows. Defaults to `--table-row-background-color`. |
| `--table-row-alternate-even-background-color` | Background of the even rows. Defaults to `--table-row-background-color`. |
| `--table-row-border-block-end-color` | Color of the line under a row. Defaults to `--color-border`. |
| `--table-row-hover-background-color` | Background of a hovered row. Defaults to `--color-background-hover`. |
| `--table-row-hover-color` | Text color of a hovered row. Defaults to `--table-data-cell-color`. |
| `--table-row-selected-background-color` | Background of a selected row. Defaults to `--color-primary-element-light`. |
| `--table-row-selected-hover-background-color` | Background of a hovered selected row. Defaults to `--color-primary-element-light-hover`. |
| `--table-header-border-block-end-width` | Thickness of the line under the header row. Defaults to `1px`. |
| `--table-row-border-block-end-width` | Thickness of the line under a row. Defaults to `1px`. |
| `--table-cell-padding-block-start` | Padding above the content of a cell. Defaults to `--default-grid-baseline`. |
| `--table-cell-padding-block-end` | Padding below the content of a cell. Defaults to `--default-grid-baseline`. |
| `--table-cell-padding-inline-start` | Padding before the content of a cell. Defaults to two grid baselines. |
| `--table-cell-padding-inline-end` | Padding after the content of a cell. Defaults to two grid baselines. |
| `--table-font-family` | Font of the table. Inherited by default. |
| `--table-font-size` | Font size of the table. Inherited by default. |
| `--table-header-font-size` | Font size of the header cells. Defaults to `--table-font-size`. |
| `--table-header-font-weight` | Font weight of the header cells. Defaults to `normal`. |
| `--table-header-text-transform` | Text transform of the header cells, for example `uppercase`. Defaults to `none`. |
| `--table-data-cell-font-size` | Font size of the cells. Defaults to `--table-font-size`. |
| `--table-data-cell-font-weight` | Font weight of the cells. Inherited by default. |
| `--table-border-color` | Color of the border around the table. Defaults to `transparent`. |
| `--table-border-width` | Width of the border around the table. Defaults to `0`, no border. |
| `--table-line-height` | Line height of the table. Inherited by default. |
| `--table-cell-line-height` | Line height of a cell. Defaults to `--table-line-height`. |
| `--table-header-cell-color` | Text color of the header cells; takes precedence over `--table-header-color`. |
| `--table-header-cell-font-size` | Font size of the header cells; takes precedence over `--table-header-font-size`. |
| `--table-header-cell-font-weight` | Font weight of the header cells; takes precedence over `--table-header-font-weight`. |
| `--table-header-cell-text-transform` | Text transform of the header cells; takes precedence over `--table-header-text-transform`. |
| `--table-header-border-block-start-color` | Color of the line above the header row. Defaults to `transparent`. |
| `--table-header-border-block-start-width` | Width of the line above the header row. Defaults to `0`, no line. |
| `--table-row-alternate-odd-color` | Text color of the odd rows, for striped rows. Defaults to `--table-data-cell-color`. |
| `--table-row-alternate-even-color` | Text color of the even rows. Defaults to `--table-data-cell-color`. |
| `--table-row-padding-inline-start` | Padding before the first cell of a row. Defaults to `--table-cell-padding-inline-start`. |
| `--table-row-padding-inline-end` | Padding after the last cell of a row. Defaults to `--table-cell-padding-inline-end`. |

The two variables for selected rows have no counterpart in the NL Design System, which has no selectable rows.
</docs>

<template>
	<div :class="$style.ncTable">
		<div
			ref="scrollElement"
			:class="$style.ncTable__scroll"
			:tabindex="overflowing ? 0 : undefined"
			:role="overflowing ? 'group' : undefined"
			:aria-label="overflowing ? caption : undefined">
			<table :class="$style.ncTable__table" :aria-busy="loading ? 'true' : undefined">
				<caption class="hidden-visually">
					{{ caption }}
				</caption>
				<thead>
					<tr>
						<th v-if="selectable" scope="col" :class="$style.ncTable__check">
							<NcCheckboxRadioSwitch
								:modelValue="allSelected"
								:indeterminate="someSelected"
								:disabled="loading || rows.length === 0"
								:aria-label="t('Select all rows')"
								@update:modelValue="toggleAll" />
						</th>
						<th
							v-for="column in columns"
							:key="column.key"
							scope="col"
							:class="[$style.ncTable__header, { [$style.ncTable__header_sortable]: column.sortable }, alignClass(column)]"
							:style="column.width ? { width: column.width } : undefined"
							:aria-sort="ariaSort(column)"
							:title="column.description || undefined">
							<!-- @slot `header-<key>`: the header of column `<key>`, replacing its sort button. Receives the `column`. -->
							<slot :name="'header-' + column.key" :column="column">
								<NcButton
									v-if="column.sortable"
									:class="$style.ncTable__sort"
									:alignment="sortAlignment(column)"
									variant="tertiary"
									@click="toggleSort(column)">
									<template #icon>
										<NcIconSvgWrapper
											:class="{ [$style.ncTable__sortIcon_idle]: !isSorted(column) }"
											:path="sortIcon(column)"
											:size="20" />
									</template>
									{{ column.label }}
								</NcButton>
								<span v-else>{{ column.label }}</span>
							</slot>
						</th>
						<th v-if="slots.rowActions" scope="col" :class="$style.ncTable__actions">
							<span class="hidden-visually">{{ t('Actions') }}</span>
						</th>
					</tr>
				</thead>
				<tbody>
					<tr v-if="loading">
						<td :colspan="columnCount" :class="$style.ncTable__state">
							<slot name="loading">
								<NcLoadingIcon :size="32" :name="t('Loading …')" />
							</slot>
						</td>
					</tr>
					<tr v-else-if="rows.length === 0">
						<td :colspan="columnCount" :class="$style.ncTable__state">
							<slot name="empty">
								{{ t('No results') }}
							</slot>
						</td>
					</tr>
					<template v-else>
						<tr
							v-for="row in rows"
							:key="keyOf(row)"
							:class="[$style.ncTable__row, { [$style.ncTable__row_selected]: isSelected(row), [$style.ncTable__row_clickable]: hasRowClickListener() }]"
							@click="onRowClick(row, $event)">
							<!-- A click on the checkbox lands on its visual box, not on the input, so it is stopped here -->
							<td v-if="selectable" :class="$style.ncTable__check" @click.stop>
								<NcCheckboxRadioSwitch
									:modelValue="isSelected(row)"
									:aria-label="checkboxLabel(row)"
									@update:modelValue="toggleRow(row, $event)" />
							</td>
							<td
								v-for="column in columns"
								:key="column.key"
								:class="[$style.ncTable__cell, alignClass(column)]">
								<!-- @slot `cell-<key>`: the cell of column `<key>`. Receives the `row` and its `value`. -->
								<slot :name="'cell-' + column.key" :row="row" :value="valueOf(row, column)">
									{{ displayValue(valueOf(row, column)) }}
								</slot>
							</td>
							<td v-if="slots.rowActions" :class="$style.ncTable__actions">
								<slot name="rowActions" :row="row" />
							</td>
						</tr>
					</template>
				</tbody>
			</table>
		</div>
	</div>
</template>

<script setup lang="ts" generic="Row extends Record<string, any>">
import type { Slot } from 'vue'

import { mdiMenuDown, mdiMenuSwap, mdiMenuUp } from '@mdi/js'
import { computed, getCurrentInstance, onBeforeUnmount, onMounted, ref, useCssModule, warn } from 'vue'
import NcButton from '../NcButton/NcButton.vue'
import NcCheckboxRadioSwitch from '../NcCheckboxRadioSwitch/NcCheckboxRadioSwitch.vue'
import NcIconSvgWrapper from '../NcIconSvgWrapper/NcIconSvgWrapper.vue'
import NcLoadingIcon from '../NcLoadingIcon/NcLoadingIcon.vue'
import { t } from '../../l10n.ts'

export type NcTableRowKey = string | number

export interface NcTableColumn {
	/** The key of the value in a row, or a dotted path such as `owner.name` */
	key: string
	/** The header text */
	label: string
	/** Whether a click on the header sorts by this column */
	sortable?: boolean
	/** A CSS width for the column, for example `12em` */
	width?: string
	/** How the column's content is aligned */
	align?: 'start' | 'center' | 'end'
	/** A longer explanation, shown as the header's tooltip */
	description?: string
}

export interface NcTableSort {
	key: string
	order: 'asc' | 'desc'
}

/**
 * The current sorting, or `null` when the rows are not sorted.
 */
const sort = defineModel<NcTableSort | null>('sort', { default: null })

/**
 * The keys of the selected rows.
 */
const selected = defineModel<NcTableRowKey[]>('selected', { default: () => [] })

const props = withDefaults(defineProps<{
	/**
	 * The columns of the table, in order.
	 */
	columns: NcTableColumn[]

	/**
	 * The rows of the table. Every row needs a unique value under `rowKey`.
	 */
	rows: Row[]

	/**
	 * The name of the property that identifies a row.
	 *
	 * @default 'id'
	 */
	rowKey?: string

	/**
	 * The name of the table for assistive technology. It is not shown.
	 */
	caption: string

	/**
	 * Whether the rows are loading. Shows a loading state instead of the rows.
	 */
	loading?: boolean

	/**
	 * Whether rows can be selected with a checkbox.
	 */
	selectable?: boolean

	/**
	 * Returns the name of a row, used in the label of its checkbox, such as "Select Annual report.md".
	 * Defaults to the value of the first column.
	 */
	rowLabel?: (row: Row) => string
}>(), {
	rowKey: 'id',
	rowLabel: undefined,
})

const emit = defineEmits<{
	/**
	 * The sorting changed.
	 *
	 * @param sort - The new sorting, or `null`
	 */
	'update:sort': [sort: NcTableSort | null]

	/**
	 * The selection changed.
	 *
	 * @param selected - The selected row keys
	 */
	'update:selected': [selected: NcTableRowKey[]]

	/**
	 * A row was clicked, outside the controls in it. Only mouse users can do this,
	 * so it must not be the only way to reach a row's action.
	 *
	 * @param row - The clicked row
	 * @param event - The click event
	 */
	rowClick: [row: Row, event: MouseEvent]
}>()

const slots = defineSlots<{
	/**
	 * The content of the cell of column `<key>`, for example `#cell-status`.
	 */
	[key: `cell-${string}`]: Slot<{ row: Row, value: unknown }>

	/**
	 * The content of the header of column `<key>`, for example `#header-status`.
	 * It replaces the sort button of a sortable column.
	 */
	[key: `header-${string}`]: Slot<{ column: NcTableColumn }>

	/**
	 * Actions for a row, for example an `NcActions` menu. Adds a trailing column.
	 */
	rowActions?: Slot<{ row: Row }>

	/**
	 * What is shown while `loading` is set.
	 */
	loading?: Slot

	/**
	 * What is shown when there are no rows.
	 */
	empty?: Slot
}>()

const style = useCssModule()

const columnCount = computed(() => props.columns.length + (props.selectable ? 1 : 0) + (slots.rowActions ? 1 : 0))

let warnedMissingKey = false

/**
 * The key of a row. Warns once when a row has none, as every row then counts as selected
 * as soon as one is.
 *
 * @param row - The row
 */
function keyOf(row: Row): NcTableRowKey {
	const key = row[props.rowKey] as NcTableRowKey | undefined
	if (key === undefined && !warnedMissingKey) {
		warnedMissingKey = true
		warn(`[NcTable] A row has no "${props.rowKey}". Give every row a unique key, or set \`row-key\` to the property that identifies a row.`)
	}
	return key as NcTableRowKey
}

/**
 * The value of a column in a row, following a dotted path.
 *
 * @param row - The row
 * @param column - The column
 */
function valueOf(row: Row, column: NcTableColumn): unknown {
	return column.key.split('.').reduce<unknown>((value, part) => (value === null || value === undefined ? undefined : (value as Record<string, unknown>)[part]), row)
}

/**
 * The text shown for a value without a cell slot.
 *
 * @param value - The value
 */
function displayValue(value: unknown): string {
	if (value === null || value === undefined) {
		return ''
	}
	if (Array.isArray(value)) {
		return value.map(displayValue).join(', ')
	}
	return String(value)
}

/**
 * The class that aligns a column.
 *
 * @param column - The column
 */
function alignClass(column: NcTableColumn): string | undefined {
	if (column.align === 'center') {
		return style.ncTable_alignCenter
	}
	if (column.align === 'end') {
		return style.ncTable_alignEnd
	}
	return undefined
}

/**
 * Whether the rows are sorted by a column.
 *
 * @param column - The column
 */
function isSorted(column: NcTableColumn): boolean {
	return sort.value?.key === column.key
}

/**
 * The value of `aria-sort` for a column.
 *
 * @param column - The column
 */
function ariaSort(column: NcTableColumn): 'ascending' | 'descending' | 'none' | undefined {
	if (!column.sortable) {
		return undefined
	}
	if (!isSorted(column)) {
		return 'none'
	}
	return sort.value!.order === 'asc' ? 'ascending' : 'descending'
}

/**
 * The icon of a sortable header: both directions when not sorted by it.
 *
 * @param column - The column
 */
function sortIcon(column: NcTableColumn): string {
	if (!isSorted(column)) {
		return mdiMenuSwap
	}
	return sort.value!.order === 'asc' ? mdiMenuUp : mdiMenuDown
}

/**
 * Where a sort button puts its text, with the sort icon after it.
 *
 * @param column - The column
 */
function sortAlignment(column: NcTableColumn): 'start-reverse' | 'center-reverse' | 'end-reverse' {
	if (column.align === 'center') {
		return 'center-reverse'
	}
	return column.align === 'end' ? 'end-reverse' : 'start-reverse'
}

/**
 * Move a column's sorting on: ascending, descending, then not sorted.
 *
 * @param column - The column
 */
function toggleSort(column: NcTableColumn) {
	if (!isSorted(column)) {
		sort.value = { key: column.key, order: 'asc' }
	} else if (sort.value!.order === 'asc') {
		sort.value = { key: column.key, order: 'desc' }
	} else {
		sort.value = null
	}
}

const selectedSet = computed(() => new Set(selected.value))
const selectedCount = computed(() => props.rows.filter((row) => selectedSet.value.has(keyOf(row))).length)
const allSelected = computed(() => props.rows.length > 0 && selectedCount.value === props.rows.length)
const someSelected = computed(() => selectedCount.value > 0 && !allSelected.value)

/**
 * Whether a row is selected.
 *
 * @param row - The row
 */
function isSelected(row: Row): boolean {
	return selectedSet.value.has(keyOf(row))
}

/**
 * The label of a row's checkbox, naming the row so the checkboxes can be told apart.
 *
 * @param row - The row
 */
function checkboxLabel(row: Row): string {
	const firstColumn = props.columns[0]
	const name = props.rowLabel
		? props.rowLabel(row)
		: (firstColumn ? displayValue(valueOf(row, firstColumn)) : '')
	return name ? t('Select {row}', { row: name }) : t('Select row')
}

/**
 * Select or deselect one row.
 *
 * @param row - The row
 * @param value - Whether it is selected now
 */
function toggleRow(row: Row, value: unknown) {
	const key = keyOf(row)
	const others = selected.value.filter((selectedKey) => selectedKey !== key)
	selected.value = value ? [...others, key] : others
}

/**
 * Select or deselect all rows. Keys of rows that are not shown stay selected.
 *
 * @param value - Whether all rows are selected now
 */
function toggleAll(value: unknown) {
	const shown = new Set(props.rows.map(keyOf))
	const hidden = selected.value.filter((key) => !shown.has(key))
	selected.value = value ? [...hidden, ...shown] : hidden
}

const instance = getCurrentInstance()

/**
 * Whether the parent listens to `rowClick`, so the rows show they can be clicked.
 * Read during the render, so it follows the parent's current listeners.
 */
function hasRowClickListener(): boolean {
	return Boolean(instance?.vnode.props?.onRowClick)
}

/**
 * Report a click on a row, unless it was on a control inside it or ended a text selection.
 *
 * @param row - The row
 * @param event - The click event
 */
function onRowClick(row: Row, event: MouseEvent) {
	const target = event.target as Element | null
	if (target?.closest('a, button, input, select, textarea, label, [role="button"], [role="checkbox"]')) {
		return
	}
	if (window.getSelection()?.toString()) {
		return
	}
	emit('rowClick', row, event)
}

// The scroll area is only a keyboard stop when it actually scrolls
const scrollElement = ref<HTMLElement>()
const overflowing = ref(false)
let resizeObserver: ResizeObserver | undefined

/**
 * Check whether the table is wider than its container.
 */
function measure() {
	const element = scrollElement.value
	overflowing.value = !!element && element.scrollWidth > element.clientWidth
}

onMounted(() => {
	measure()
	if (typeof ResizeObserver !== 'undefined' && scrollElement.value) {
		resizeObserver = new ResizeObserver(measure)
		resizeObserver.observe(scrollElement.value)
		const table = scrollElement.value.firstElementChild
		if (table) {
			resizeObserver.observe(table)
		}
	}
})

onBeforeUnmount(() => resizeObserver?.disconnect())
</script>

<style lang="scss" module>
.ncTable {
	min-width: 0;
}

.ncTable__scroll {
	overflow-x: auto;
	border-radius: var(--border-radius-element);

	&:focus-visible {
		outline: 2px solid var(--color-main-text);
		outline-offset: 2px;
	}
}

.ncTable__table {
	width: 100%;
	border-collapse: collapse;
	border: var(--table-border-width, 0) solid var(--table-border-color, transparent);
	background-color: var(--table-background-color, transparent);
	font-family: var(--table-font-family, inherit);
	font-size: var(--table-font-size, inherit);
	line-height: var(--table-line-height, inherit);
}

.ncTable__header,
.ncTable__cell,
.ncTable__check,
.ncTable__actions {
	padding-block: var(--table-cell-padding-block-start, var(--default-grid-baseline)) var(--table-cell-padding-block-end, var(--default-grid-baseline));
	padding-inline: var(--table-cell-padding-inline-start, calc(2 * var(--default-grid-baseline))) var(--table-cell-padding-inline-end, calc(2 * var(--default-grid-baseline)));
	border-bottom: 1px solid var(--color-border);
	line-height: var(--table-cell-line-height, inherit);
	text-align: start;
	vertical-align: middle;
}

.ncTable__header {
	height: var(--default-clickable-area);
	color: var(--table-header-cell-color, var(--table-header-color, var(--color-text-maxcontrast)));
	font-size: var(--table-header-cell-font-size, var(--table-header-font-size, inherit));
	font-weight: var(--table-header-cell-font-weight, var(--table-header-font-weight, normal));
	text-transform: var(--table-header-cell-text-transform, var(--table-header-text-transform, none));
	white-space: nowrap;
}

.ncTable__cell {
	height: var(--default-clickable-area);
	color: var(--table-data-cell-color, var(--color-main-text));
	font-size: var(--table-data-cell-font-size, inherit);
	font-weight: var(--table-data-cell-font-weight, inherit);
}

// Theming: the header row and the body rows each read their own variables, and
// every fallback is the value the table has without them
.ncTable__table > thead > tr > th {
	border-bottom-color: var(--table-header-border-block-end-color, var(--color-border));
	border-bottom-width: var(--table-header-border-block-end-width, 1px);
	border-top: var(--table-header-border-block-start-width, 0) solid var(--table-header-border-block-start-color, transparent);
	background-color: var(--table-header-background-color, transparent);
}

.ncTable__table > tbody > tr > td {
	border-bottom-color: var(--table-row-border-block-end-color, var(--color-border));
	border-bottom-width: var(--table-row-border-block-end-width, 1px);
}

// A sortable header is an NcButton, like the sortable headers of the Files app.
// The cell gives up its own padding to the button, so the label lines up with the
// values below it, and the label keeps the weight and color of a plain header.
.ncTable__header_sortable {
	--font-weight-element: var(--table-header-cell-font-weight, var(--table-header-font-weight, normal));
	padding-inline: 0;
}

.ncTable__header .ncTable__sort:global(.button-vue) {
	--button-padding: var(--table-cell-padding-inline-start, calc(2 * var(--default-grid-baseline))) var(--default-grid-baseline);
	font-size: var(--table-header-cell-font-size, var(--table-header-font-size, var(--table-font-size, var(--default-font-size))));
	color: var(--table-header-cell-color, var(--table-header-color, var(--color-text-maxcontrast)));

	&:hover:not(:disabled) {
		color: var(--color-main-text);
	}
}

.ncTable__sortIcon_idle {
	opacity: 0.5;
}

// The first and last cell of a row take the row padding; a sortable header passes it to its button
.ncTable__table tr > :is(.ncTable__header, .ncTable__cell, .ncTable__check, .ncTable__actions):first-child:not(.ncTable__header_sortable) {
	padding-inline-start: var(--table-row-padding-inline-start, var(--table-cell-padding-inline-start, calc(2 * var(--default-grid-baseline))));
}

.ncTable__table tr > :is(.ncTable__header, .ncTable__cell, .ncTable__check, .ncTable__actions):last-child:not(.ncTable__header_sortable) {
	padding-inline-end: var(--table-row-padding-inline-end, var(--table-cell-padding-inline-end, calc(2 * var(--default-grid-baseline))));
}

.ncTable__table tr > .ncTable__header_sortable:first-child .ncTable__sort:global(.button-vue) {
	--button-padding: var(--table-row-padding-inline-start, var(--table-cell-padding-inline-start, calc(2 * var(--default-grid-baseline)))) var(--default-grid-baseline);
}

.ncTable__check {
	width: var(--default-clickable-area);
}

.ncTable__actions {
	width: var(--default-clickable-area);
	text-align: end;
}

.ncTable__row > td {
	background-color: var(--table-row-background-color, transparent);
}

.ncTable__row:nth-child(odd) > td {
	background-color: var(--table-row-alternate-odd-background-color, var(--table-row-background-color, transparent));
}

.ncTable__row:nth-child(odd) > .ncTable__cell {
	color: var(--table-row-alternate-odd-color, var(--table-data-cell-color, var(--color-main-text)));
}

.ncTable__row:nth-child(even) > td {
	background-color: var(--table-row-alternate-even-background-color, var(--table-row-background-color, transparent));
}

.ncTable__row:nth-child(even) > .ncTable__cell {
	color: var(--table-row-alternate-even-color, var(--table-data-cell-color, var(--color-main-text)));
}

.ncTable__row:hover > td {
	background-color: var(--table-row-hover-background-color, var(--color-background-hover));
	color: var(--table-row-hover-color, var(--table-data-cell-color, var(--color-main-text)));
}

.ncTable__row_clickable {
	cursor: pointer;
}

.ncTable__row.ncTable__row_selected > td {
	background-color: var(--table-row-selected-background-color, var(--color-primary-element-light));
}

.ncTable__row.ncTable__row_selected:hover > td {
	background-color: var(--table-row-selected-hover-background-color, var(--color-primary-element-light-hover));
}

.ncTable__state {
	padding-block: calc(6 * var(--default-grid-baseline));
	color: var(--color-text-maxcontrast);
	text-align: center;
}

.ncTable_alignCenter {
	text-align: center;
}

.ncTable_alignEnd {
	text-align: end;
}

// The sort button is as wide as its content, so it moves to the column's side itself
.ncTable_alignCenter .ncTable__sort:global(.button-vue) {
	margin-inline: auto;
}

.ncTable_alignEnd .ncTable__sort:global(.button-vue) {
	margin-inline-start: auto;
}
</style>
