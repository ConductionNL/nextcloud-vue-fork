<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<docs>
### General description

This component renders a row of tabs and the panel of the selected tab, for switching between views of the same content in the app content, such as the details, the history and the comments of an item. For the tabs of the sidebar, use `NcAppSidebarTab` instead.

Pass the tabs in `tabs` and bind the selected tab's `id` with `v-model`. The content of a tab goes in the slot `panel-<id>`, for example `#panel-details`. Only the panel of the selected tab is rendered, so a panel starts afresh each time its tab is selected: keep state that must survive switching tabs, such as an unsaved form, outside the panel.

A tab can have an icon, a count shown in a counter bubble, and can be disabled. The tabs follow the [ARIA tabs pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/): the arrow keys move between the tabs and select them, `Home` and `End` go to the first and last tab, and `Tab` moves on into the panel.

The tabs look like the tabs of the sidebar: the icon above the name, and the tabs share the width of the row. When the tabs do not fit, the row scrolls horizontally.

### Usage

```vue
<template>
	<div>
		<NcTabs v-model="active" :tabs="tabs" aria-label="Document">
			<template #panel-details>
				<p>The details of the document.</p>
			</template>
			<template #panel-history>
				<p>Who changed the document and when.</p>
			</template>
			<template #panel-comments>
				<p>What others said about the document.</p>
			</template>
		</NcTabs>
		<p>Selected tab: {{ active }}</p>
	</div>
</template>

<script>
export default {
	data() {
		return {
			active: 'details',
			tabs: [
				{ id: 'details', name: 'Details' },
				{ id: 'history', name: 'History' },
				{ id: 'comments', name: 'Comments', count: 3 },
			],
		}
	},
}
</script>
```

### With icons and a disabled tab

```vue
<template>
	<NcTabs v-model="active" :tabs="tabs" aria-label="Settings">
		<template #panel-general>
			<p>General settings.</p>
		</template>
		<template #panel-sharing>
			<p>Sharing settings.</p>
		</template>
		<template #panel-security>
			<p>Security settings.</p>
		</template>
	</NcTabs>
</template>

<script>
import { mdiCogOutline, mdiShareVariantOutline, mdiShieldLockOutline } from '@mdi/js'

export default {
	data() {
		return {
			active: 'general',
			tabs: [
				{ id: 'general', name: 'General', iconPath: mdiCogOutline },
				{ id: 'sharing', name: 'Sharing', iconPath: mdiShareVariantOutline, count: 12 },
				{ id: 'security', name: 'Security', iconPath: mdiShieldLockOutline, disabled: true },
			],
		}
	},
}
</script>
```

### Exposed CSS Variables

| Variable | Description |
|---|---|
| `--tabs-gap` | Space between the tabs. Defaults to one grid baseline. |
| `--tabs-border-block-end-color` | Color of the line below the tabs. Defaults to `--color-border`. |
| `--tabs-border-block-end-width` | Width of the line below the tabs. Defaults to `1px`. |
| `--tabs-tab-flex` | How a tab shares the width of the row. Defaults to `1 1 1px`, equal shares; set `0 0 auto` to make each tab as wide as its content. |
| `--tabs-tab-direction` | Whether the icon is above the name (`column`, the default) or before it (`row`). |
| `--tabs-tab-padding` | Space around the content of a tab. Defaults to one grid baseline. |
| `--tabs-tab-padding-block-end` | Space below the content of a tab, above the selection bar. Defaults to two grid baselines. |
| `--tabs-tab-border-radius` | Corner radius of a tab. Defaults to `--border-radius-element`. |
| `--tabs-tab-color` | Text color of a tab. Defaults to `--color-main-text`. |
| `--tabs-tab-background-color` | Background of a tab. Defaults to `--color-main-background`. |
| `--tabs-tab-font-family` | Font of a tab. Inherited by default. |
| `--tabs-tab-font-size` | Font size of a tab. Defaults to `--default-font-size`. |
| `--tabs-tab-font-weight` | Font weight of a tab. Defaults to `--font-weight-element`. |
| `--tabs-tab-hover-background-color` | Background of a tab on hover. Defaults to `--color-background-hover`. |
| `--tabs-tab-selected-color` | Text color of the selected tab. Defaults to `--tabs-tab-color`. |
| `--tabs-tab-selected-background-color` | Background of the selected tab. Defaults to a light tint of `--color-primary-element`. |
| `--tabs-tab-selected-font-weight` | Font weight of the selected tab. Defaults to `--tabs-tab-font-weight`. |
| `--tabs-indicator-color` | Color of the bar below the selected tab. Defaults to `--color-primary-element`. |
| `--tabs-indicator-height` | Height of the bar below the selected tab. Defaults to `4px`. |
| `--tabs-indicator-border-radius` | Corner radius of the bar below the selected tab. Defaults to a pill. |
| `--tabs-focus-outline-color` | Color of the focus outline of a tab and the panel. Defaults to `--color-main-text`. |
| `--tabs-panel-padding-block` | Space above and below the panel. Defaults to three grid baselines. |
| `--tabs-tab-border-width` | Width of the border around a tab. Defaults to `0`, no border. |
| `--tabs-tab-border-style` | Style of the border around a tab. Defaults to `solid`. |
| `--tabs-tab-border-color` | Color of the border around a tab. Defaults to `transparent`. |
| `--tabs-panel-padding-inline` | Space before and after the content of the panel. Defaults to `0`. |
| `--tabs-panel-border-width` | Width of the border around the panel. Defaults to `0`, no border. |
| `--tabs-panel-border-style` | Style of the border around the panel. Defaults to `solid`. |
| `--tabs-panel-border-color` | Color of the border around the panel. Defaults to `transparent`. |
| `--tabs-focus-outline-width` | Width of the focus outline of a tab and the panel. Defaults to `2px`. |
| `--tabs-focus-outline-offset` | Distance between the focus outline and a tab or the panel. Defaults to `2px`. |

They can be set on the tabs or on any of its parents, for example `body` to restyle all tabs at once. On Nextcloud before 34 the tabs take the older look of the sidebar tabs there, a line below the selected tab. The variables apply there too, with the values of that look as their defaults: no space between the tabs, a padding and corner radius of `--border-radius-small`, the main background for the selected tab, and on hover of the selected tab the light primary colors. `--tabs-indicator-color` and `--tabs-indicator-height` set the line.
</docs>

<script setup lang="ts">
import type { Slot } from 'vue'

import { computed, nextTick, ref, useCssModule, watch } from 'vue'
import { createElementId } from '../../utils/createElementId.ts'
import { isLegacy34 } from '../../utils/legacy.ts'
import { isRtl } from '../../utils/rtl.ts'
import NcCounterBubble from '../NcCounterBubble/index.ts'
import NcIconSvgWrapper from '../NcIconSvgWrapper/index.ts'

export interface NcTabsTab {
	/** The unique id of the tab, also the name of its panel slot `panel-<id>` */
	id: string
	/** The name shown on the tab */
	name: string
	/** The SVG path of an icon shown before the name, for example one from `@mdi/js` */
	iconPath?: string
	/** A number shown in a counter bubble after the name */
	count?: number
	/** Whether the tab cannot be selected */
	disabled?: boolean
}

/**
 * The `id` of the selected tab.
 * When it does not match an enabled tab, the first enabled tab is shown and becomes the model.
 */
const modelValue = defineModel<string>()

const props = withDefaults(defineProps<{
	/**
	 * The tabs, in order.
	 */
	tabs: NcTabsTab[]

	/**
	 * The name of the tabs for assistive technology, for example the name of the item they belong to.
	 */
	ariaLabel?: string

	/**
	 * The id of an element that names the tabs, for example a visible heading.
	 * Takes precedence over `ariaLabel`.
	 */
	ariaLabelledby?: string
}>(), {
	ariaLabel: undefined,
	ariaLabelledby: undefined,
})

defineEmits<{
	/**
	 * Another tab was selected.
	 *
	 * @param id - The `id` of the selected tab
	 */
	'update:modelValue': [id: string]
}>()

defineSlots<{
	/**
	 * The panel of the tab with id `<id>`, for example `#panel-details`.
	 */
	[key: `panel-${string}`]: Slot
}>()

const style = useCssModule()
const idPrefix = createElementId()
const tabElements = ref<HTMLButtonElement[]>([])

const enabledTabs = computed(() => props.tabs.filter((tab) => !tab.disabled))

const activeTab = computed(() => enabledTabs.value.find((tab) => tab.id === modelValue.value) ?? enabledTabs.value[0])

// When the model is a disabled, unknown or removed tab, another tab is shown: make that
// the model, so the parent, and for example the URL, hold the tab that is shown
watch(activeTab, (tab) => {
	if (tab && tab.id !== modelValue.value) {
		modelValue.value = tab.id
	}
}, { immediate: true })

/**
 * The id of the tab element of a tab.
 *
 * @param tab - The tab
 */
function tabElementId(tab: NcTabsTab): string {
	// By position, as an id with whitespace would break aria-controls and aria-labelledby
	return `${idPrefix}-tab-${props.tabs.indexOf(tab)}`
}

/**
 * The id of the panel element of a tab.
 *
 * @param tab - The tab
 */
function panelElementId(tab: NcTabsTab): string {
	return `${idPrefix}-panel-${props.tabs.indexOf(tab)}`
}

/**
 * Select a tab.
 *
 * @param tab - The tab to select
 */
function select(tab: NcTabsTab) {
	if (!tab.disabled) {
		modelValue.value = tab.id
	}
}

/**
 * Select a tab and move the focus to it.
 *
 * @param tab - The tab to select
 */
async function selectAndFocus(tab: NcTabsTab) {
	select(tab)
	await nextTick()
	tabElements.value.find((element) => element.id === tabElementId(tab))?.focus()
}

/**
 * Move between the tabs with the keyboard.
 *
 * @param event - The keydown event
 */
function onKeydown(event: KeyboardEvent) {
	const tabs = enabledTabs.value
	const current = activeTab.value ? tabs.indexOf(activeTab.value) : -1
	if (tabs.length === 0 || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
		return
	}

	const forward = isRtl ? 'ArrowLeft' : 'ArrowRight'
	const backward = isRtl ? 'ArrowRight' : 'ArrowLeft'
	let next: NcTabsTab | undefined
	if (event.key === forward) {
		next = tabs[(current + 1) % tabs.length]
	} else if (event.key === backward) {
		next = tabs[(current - 1 + tabs.length) % tabs.length]
	} else if (event.key === 'Home') {
		next = tabs[0]
	} else if (event.key === 'End') {
		next = tabs[tabs.length - 1]
	}

	if (next) {
		event.preventDefault()
		selectAndFocus(next)
	}
}

/**
 * The classes of a tab element.
 *
 * @param tab - The tab
 */
function tabClass(tab: NcTabsTab) {
	return [style.ncTabs__tab, {
		[style.ncTabs__tab_selected]: tab === activeTab.value,
		[style.ncTabs__tab_legacy]: isLegacy34,
	}]
}
</script>

<template>
	<div :class="$style.ncTabs">
		<div
			role="tablist"
			:aria-label="ariaLabel"
			:aria-labelledby="ariaLabelledby"
			:class="[$style.ncTabs__list, { [$style.ncTabs__list_legacy]: isLegacy34 }]"
			@keydown="onKeydown">
			<button
				v-for="tab in tabs"
				:id="tabElementId(tab)"
				:key="tab.id"
				ref="tabElements"
				class="button-vue"
				:class="tabClass(tab)"
				type="button"
				role="tab"
				:aria-selected="tab === activeTab ? 'true' : 'false'"
				:aria-controls="tab === activeTab ? panelElementId(tab) : undefined"
				:tabindex="tab === activeTab ? 0 : -1"
				:disabled="tab.disabled"
				@click="select(tab)">
				<NcIconSvgWrapper v-if="tab.iconPath" :path="tab.iconPath" :size="20" />
				<span :class="$style.ncTabs__label">
					<span :class="$style.ncTabs__name">{{ tab.name }}</span>
					<NcCounterBubble
						v-if="tab.count !== undefined"
						:count="tab.count" />
				</span>
			</button>
		</div>
		<div
			v-if="activeTab"
			:id="panelElementId(activeTab)"
			:key="activeTab.id"
			role="tabpanel"
			:aria-labelledby="tabElementId(activeTab)"
			tabindex="0"
			:class="$style.ncTabs__panel">
			<slot :name="`panel-${activeTab.id}`" />
		</div>
	</div>
</template>

<style lang="scss" module>
.ncTabs {
	display: flex;
	flex-direction: column;
	min-width: 0;
}

// The same look as the tabs of the sidebar (NcAppSidebarTabsButton)
.ncTabs__list {
	display: flex;
	gap: var(--tabs-gap, var(--default-grid-baseline));
	// The row scrolls, so it clips what is outside it: leave room for the focus outline
	padding-block-start: calc(var(--tabs-focus-outline-width, 2px) + var(--tabs-focus-outline-offset, 2px));
	padding-inline: calc(var(--tabs-focus-outline-width, 2px) + var(--tabs-focus-outline-offset, 2px));
	padding-block-end: var(--default-grid-baseline);
	overflow-x: auto;
	border-block-end: var(--tabs-border-block-end-width, 1px) solid var(--tabs-border-block-end-color, var(--color-border));
	scrollbar-width: thin;
}

.ncTabs__list_legacy {
	gap: var(--tabs-gap, 0);
	padding-block-end: 0;
}

.ncTabs__tab {
	position: relative;
	display: flex;
	flex: var(--tabs-tab-flex, 1 1 1px);
	flex-direction: var(--tabs-tab-direction, column);
	align-items: center;
	justify-content: center;
	gap: var(--default-grid-baseline);
	min-width: max-content;
	min-height: var(--default-clickable-area);
	margin: 0;
	padding: var(--tabs-tab-padding, var(--default-grid-baseline));
	padding-block-end: var(--tabs-tab-padding-block-end, calc(2 * var(--default-grid-baseline)));
	border: var(--tabs-tab-border-width, 0) var(--tabs-tab-border-style, solid) var(--tabs-tab-border-color, transparent);
	border-radius: var(--tabs-tab-border-radius, var(--border-radius-element));
	color: var(--tabs-tab-color, var(--color-main-text));
	background-color: var(--tabs-tab-background-color, var(--color-main-background));
	font-family: var(--tabs-tab-font-family, inherit);
	font-size: var(--tabs-tab-font-size, var(--default-font-size));
	cursor: pointer;
	transition: background-color var(--animation-quick);

	&::after {
		content: '';
		position: absolute;
		inset-block-end: 0;
		inset-inline: 50%;
		height: var(--tabs-indicator-height, 4px);
		border-radius: var(--tabs-indicator-border-radius, 999px);
		background-color: var(--tabs-indicator-color, var(--color-primary-element));
		opacity: 0;
		transition: inset-inline var(--animation-quick), opacity var(--animation-quick);
	}

	&:hover:not(:disabled) {
		background-color: var(--tabs-tab-hover-background-color, var(--color-background-hover));
	}

	&:focus-visible {
		outline: var(--tabs-focus-outline-width, 2px) solid var(--tabs-focus-outline-color, var(--color-main-text));
		outline-offset: var(--tabs-focus-outline-offset, 2px);
	}

	&:disabled {
		cursor: default;
		opacity: .5;
	}
}

.ncTabs__tab_selected {
	color: var(--tabs-tab-selected-color, var(--tabs-tab-color, var(--color-main-text)));
	cursor: default;

	&,
	&:hover:not(:disabled) {
		background-color: var(--tabs-tab-selected-background-color, color-mix(in srgb, var(--color-primary-element) 8%, transparent));
	}

	&::after {
		inset-inline: 10%;
		opacity: 1;
	}
}

// Forced colors replace the backgrounds that mark the selected tab, so draw its bar in the
// system highlight color
@media (forced-colors: active) {
	.ncTabs__tab_selected::after {
		background-color: Highlight;
		forced-color-adjust: none;
	}
}

// Nextcloud before 34: a line below the selected tab, as the sidebar tabs there. The
// variables still apply, with the values of that look as their defaults.
.ncTabs__tab_legacy {
	padding: var(--tabs-tab-padding, var(--border-radius-small));
	padding-block-end: var(--tabs-tab-padding-block-end, var(--border-radius-small));
	border-block-end: var(--tabs-indicator-height, var(--default-grid-baseline)) solid transparent;
	border-radius: var(--tabs-tab-border-radius, var(--border-radius-small));
	transition: background-color var(--animation-quick), border-block-end-color var(--animation-quick);

	&::after {
		display: none;
	}

	&.ncTabs__tab_selected {
		border-block-end-color: var(--tabs-indicator-color, var(--color-primary-element));
		border-end-start-radius: 0;
		border-end-end-radius: 0;

		&,
		&:hover:not(:disabled) {
			background-color: var(--tabs-tab-selected-background-color, var(--color-main-background));
		}

		&:hover:not(:disabled) {
			color: var(--tabs-tab-selected-color, var(--color-primary-element-light-text));
			background-color: var(--tabs-tab-hover-background-color, var(--color-primary-element-light-hover));
		}
	}
}

.ncTabs__label {
	display: flex;
	align-items: center;
	gap: var(--default-grid-baseline);
}

.ncTabs__tab_selected .ncTabs__name {
	font-weight: var(--tabs-tab-selected-font-weight, var(--tabs-tab-font-weight, var(--font-weight-element, normal)));
}

// A tab is never narrower than its name, the row scrolls instead
.ncTabs__name {
	font-weight: var(--tabs-tab-font-weight, var(--font-weight-element, normal));
}

.ncTabs__tab_legacy.ncTabs__tab_selected .ncTabs__name {
	font-weight: var(--tabs-tab-selected-font-weight, var(--font-weight-element, bold));
}

.ncTabs__panel {
	padding-block: var(--tabs-panel-padding-block, calc(3 * var(--default-grid-baseline)));
	padding-inline: var(--tabs-panel-padding-inline, 0);
	border: var(--tabs-panel-border-width, 0) var(--tabs-panel-border-style, solid) var(--tabs-panel-border-color, transparent);

	&:focus-visible {
		outline: var(--tabs-focus-outline-width, 2px) solid var(--tabs-focus-outline-color, var(--color-main-text));
		outline-offset: var(--tabs-focus-outline-offset, 2px);
	}
}
</style>
