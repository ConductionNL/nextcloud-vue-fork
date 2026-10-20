<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<docs>
### General description

This component renders a single statistic, such as a number of items on a dashboard: an optional icon in a tinted circle, the name of the statistic, its value in large type and an optional label next to the value.

A number is formatted for the user's locale, so `1234` reads as `1,234` or `1.234`. Pass a string instead, for example `'€1,234'` or `'98%'`, to show a value that is already formatted. Extra content, such as a short breakdown, can be put in the default slot below the value.

The `variant` colors the icon and the value. With `href` or `to` the whole statistic becomes a link, for example to the list the number counts. While `loading` is set, a loading icon is shown instead of the value.

The statistic draws no box of its own, so it fits into a card, a dashboard widget or a grid. Put several next to each other with a CSS grid or flexbox.

### Usage

```vue
<template>
	<div class="stats">
		<NcStatsBlock name="Open cases" :value="42" />
		<NcStatsBlock name="Documents" :value="12873" label="this year" :icon-path="mdiFileDocumentOutline" />
		<NcStatsBlock name="Budget used" value="78%" variant="warning" :icon-path="mdiCashMultiple" />
	</div>
</template>

<script>
import { mdiCashMultiple, mdiFileDocumentOutline } from '@mdi/js'

export default {
	setup() {
		return {
			mdiCashMultiple,
			mdiFileDocumentOutline,
		}
	},
}
</script>

<style scoped>
.stats {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
	gap: 16px;
}
</style>
```

### Variants

```vue
<template>
	<div class="stats">
		<NcStatsBlock name="Primary" :value="12" :icon-path="mdiChartBar" />
		<NcStatsBlock name="Info" :value="3" variant="info" :icon-path="mdiInformationOutline" />
		<NcStatsBlock name="Success" :value="98" variant="success" :icon-path="mdiCheckCircleOutline" />
		<NcStatsBlock name="Warning" :value="7" variant="warning" :icon-path="mdiAlertOutline" />
		<NcStatsBlock name="Error" :value="1" variant="error" :icon-path="mdiAlertCircleOutline" />
	</div>
</template>

<script>
import { mdiAlertCircleOutline, mdiAlertOutline, mdiChartBar, mdiCheckCircleOutline, mdiInformationOutline } from '@mdi/js'

export default {
	setup() {
		return {
			mdiAlertCircleOutline,
			mdiAlertOutline,
			mdiChartBar,
			mdiCheckCircleOutline,
			mdiInformationOutline,
		}
	},
}
</script>

<style scoped>
.stats {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
	gap: 16px;
}
</style>
```

### Link, loading and extra content

```vue
<template>
	<div class="stats">
		<NcStatsBlock
			name="Unread messages"
			:value="5"
			href="#"
			:icon-path="mdiEmailOutline" />
		<NcStatsBlock
			name="Storage"
			:value="0"
			loading
			:icon-path="mdiHarddisk" />
		<NcStatsBlock
			name="Tasks"
			:value="24"
			label="in total"
			:icon-path="mdiCheckboxMarkedOutline">
			<p class="breakdown">
				18 done, 6 open
			</p>
		</NcStatsBlock>
	</div>
</template>

<script>
import { mdiCheckboxMarkedOutline, mdiEmailOutline, mdiHarddisk } from '@mdi/js'

export default {
	setup() {
		return {
			mdiCheckboxMarkedOutline,
			mdiEmailOutline,
			mdiHarddisk,
		}
	},
}
</script>

<style scoped>
.stats {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
	gap: 16px;
}

.breakdown {
	margin: 0;
	color: var(--color-text-maxcontrast);
}
</style>
```
### Exposed CSS Variables

| Variable | Description |
|---|---|
| `--stats-block-gap` | Space between the icon and the text. Defaults to four grid baselines. |
| `--stats-block-padding` | Space around the statistic. Defaults to two grid baselines. |
| `--stats-block-border-radius` | Corner radius of the hover background of a link. Defaults to `--border-radius-large`. |
| `--stats-block-font-family` | Font of the statistic. Inherited by default. |
| `--stats-block-hover-background-color` | Background of a link on hover. Defaults to `--color-background-hover`. |
| `--stats-block-icon-size` | Size of the icon circle. Defaults to `44px`. |
| `--stats-block-icon-border-radius` | Corner radius of the icon circle. Defaults to `50%`, a circle. |
| `--stats-block-name-color` | Color of the name. Defaults to `--color-main-text`. |
| `--stats-block-name-font-size` | Font size of the name. Inherited by default. |
| `--stats-block-name-font-weight` | Font weight of the name. Defaults to bold. |
| `--stats-block-value-font-family` | Font of the value. Inherited by default. |
| `--stats-block-value-font-size` | Font size of the value. Defaults to `28px`. |
| `--stats-block-value-font-weight` | Font weight of the value. Defaults to bold. |
| `--stats-block-value-line-height` | Line height of the value. Defaults to `1.1`. |
| `--stats-block-label-color` | Color of the label. Defaults to `--color-text-maxcontrast`. |
| `--stats-block-label-font-size` | Font size of the label. Inherited by default. |
| `--stats-block-primary-color` | Color of the icon and the value of the `primary` variant. Defaults to `--color-primary-element`. |
| `--stats-block-info-color` | The same for the `info` variant. Defaults to the info text color. |
| `--stats-block-success-color` | The same for the `success` variant. Defaults to the success text color. |
| `--stats-block-warning-color` | The same for the `warning` variant. Defaults to the warning text color. |
| `--stats-block-error-color` | The same for the `error` variant. Defaults to the error text color. |

They can be set on the statistic or on any of its parents, for example `body` to restyle every statistic at once.
</docs>

<script setup lang="ts">
import type { Slot } from 'vue'
import type { RouteLocationRaw } from 'vue-router'

import { getCanonicalLocale } from '@nextcloud/l10n'
import { computed, inject } from 'vue'
import { routerKey } from 'vue-router'
import { t } from '../../l10n.ts'
import NcIconSvgWrapper from '../NcIconSvgWrapper/index.ts'
import NcLoadingIcon from '../NcLoadingIcon/index.ts'

const props = withDefaults(defineProps<{
	/**
	 * The name of the statistic, shown above the value.
	 */
	name: string

	/**
	 * The value of the statistic.
	 * A number is formatted for the user's locale, a string is shown as it is.
	 */
	value: number | string

	/**
	 * A short label shown next to the value, for example a unit or "this week".
	 */
	label?: string

	/**
	 * The SVG path of an icon, for example one from `@mdi/js`.
	 * The `icon` slot takes precedence.
	 */
	iconPath?: string

	/**
	 * The color of the icon and the value.
	 */
	variant?: 'primary' | 'info' | 'success' | 'warning' | 'error'

	/**
	 * Show a loading icon instead of the value.
	 */
	loading?: boolean

	/**
	 * Turns the statistic into a link to this address.
	 */
	href?: string

	/**
	 * Turns the statistic into a `router-link` to this route.
	 * Takes precedence over `href`.
	 */
	to?: RouteLocationRaw
}>(), {
	label: undefined,
	iconPath: undefined,
	variant: 'primary',
	href: undefined,
	to: undefined,
})

const slots = defineSlots<{
	/**
	 * Extra content shown below the value, for example a short breakdown.
	 */
	default?: Slot

	/**
	 * A custom icon. It replaces the `icon-path` icon.
	 */
	icon?: Slot
}>()

const hasVueRouterContext = inject(routerKey, null) !== null

const tag = computed(() => {
	if (hasVueRouterContext && props.to) {
		// RouterLink is used by name, so the app's own router is used and not bundled here
		return 'RouterLink'
	}
	return props.href ? 'a' : 'div'
})

const linkAttrs = computed(() => {
	if (tag.value === 'RouterLink') {
		return { to: props.to }
	}
	if (tag.value === 'a') {
		return { href: props.href }
	}
	return {}
})

const formattedValue = computed(() => {
	if (typeof props.value === 'number') {
		return new Intl.NumberFormat(getCanonicalLocale()).format(props.value)
	}
	return props.value
})
</script>

<template>
	<component
		:is="tag"
		:class="[$style.ncStatsBlock, $style[`ncStatsBlock_${variant}`], { [$style.ncStatsBlock_link]: tag !== 'div' }]"
		:aria-busy="loading ? 'true' : undefined"
		v-bind="linkAttrs">
		<div v-if="slots.icon || iconPath" :class="$style.ncStatsBlock__icon">
			<slot name="icon">
				<NcIconSvgWrapper :path="iconPath" />
			</slot>
		</div>
		<div :class="$style.ncStatsBlock__body">
			<p :class="$style.ncStatsBlock__name">
				{{ name }}
			</p>
			<p v-if="loading" :class="$style.ncStatsBlock__value">
				<NcLoadingIcon :name="t('Loading …')" />
			</p>
			<p v-else :class="$style.ncStatsBlock__value">
				<span :class="$style.ncStatsBlock__number">{{ formattedValue }}</span>
				<span v-if="label" :class="$style.ncStatsBlock__label">{{ label }}</span>
			</p>
			<slot />
		</div>
	</component>
</template>

<style lang="scss" module>
.ncStatsBlock {
	--stats-block-accent: var(--stats-block-primary-color, var(--color-primary-element));
	display: flex;
	align-items: center;
	gap: var(--stats-block-gap, calc(4 * var(--default-grid-baseline)));
	min-width: 0;
	padding: var(--stats-block-padding, calc(2 * var(--default-grid-baseline)));
	border-radius: var(--stats-block-border-radius, var(--border-radius-large));
	color: var(--color-main-text);
	font-family: var(--stats-block-font-family, inherit);
	text-decoration: none;
}

.ncStatsBlock_info {
	--stats-block-accent: var(--stats-block-info-color, var(--color-text-info, var(--color-info-text)));
}

.ncStatsBlock_success {
	--stats-block-accent: var(--stats-block-success-color, var(--color-text-success, var(--color-success-text)));
}

.ncStatsBlock_warning {
	--stats-block-accent: var(--stats-block-warning-color, var(--color-text-warning, var(--color-warning-text)));
}

.ncStatsBlock_error {
	--stats-block-accent: var(--stats-block-error-color, var(--color-text-error, var(--color-error-text)));
}

.ncStatsBlock_link {
	cursor: pointer;

	&:hover {
		background-color: var(--stats-block-hover-background-color, var(--color-background-hover));
	}

	&:focus-visible {
		outline: 2px solid var(--color-main-text);
		outline-offset: 2px;
	}
}

.ncStatsBlock__icon {
	display: flex;
	flex-shrink: 0;
	align-items: center;
	justify-content: center;
	width: var(--stats-block-icon-size, 44px);
	height: var(--stats-block-icon-size, 44px);
	border-radius: var(--stats-block-icon-border-radius, 50%);
	color: var(--stats-block-accent);
	background-color: color-mix(in srgb, var(--stats-block-accent) 12%, transparent);
}

.ncStatsBlock__body {
	display: flex;
	flex: 1 1 auto;
	flex-direction: column;
	gap: 2px;
	min-width: 0;
}

.ncStatsBlock__name {
	margin: 0;
	overflow: hidden;
	color: var(--stats-block-name-color, inherit);
	font-size: var(--stats-block-name-font-size, inherit);
	font-weight: var(--stats-block-name-font-weight, bold);
	white-space: nowrap;
	text-overflow: ellipsis;
}

.ncStatsBlock__value {
	display: flex;
	align-items: baseline;
	gap: calc(1.5 * var(--default-grid-baseline));
	min-width: 0;
	min-height: 31px;
	margin: 0;
}

.ncStatsBlock__number {
	flex: 0 0 auto;
	color: var(--stats-block-accent);
	font-family: var(--stats-block-value-font-family, inherit);
	font-size: var(--stats-block-value-font-size, 28px);
	font-weight: var(--stats-block-value-font-weight, bold);
	line-height: var(--stats-block-value-line-height, 1.1);
	white-space: nowrap;
}

.ncStatsBlock__label {
	min-width: 0;
	overflow: hidden;
	color: var(--stats-block-label-color, var(--color-text-maxcontrast));
	font-size: var(--stats-block-label-font-size, inherit);
	white-space: nowrap;
	text-overflow: ellipsis;
}
</style>
