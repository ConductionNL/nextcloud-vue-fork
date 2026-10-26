<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<docs>
### General description

This component renders the header at the top of a page in the app content: a heading with an optional icon in front of it, an optional description below it and optional actions at the end of the row.

The heading is an `h2` by default, because the Nextcloud page layout already has the `h1`. To set the text of that `h1`, use the `page-heading` prop of `NcAppContent`. If the page header is nested deeper, set `heading-level` to the level that fits. The level only changes the element, not the look: the heading always has the size of a Nextcloud app's `h2`.

The actions wrap below the heading when there is not enough room next to it.

### Usage

```vue
<template>
	<NcPageHeader
		name="Documents"
		description="All documents shared with your team." />
</template>
```

### With an icon and actions

```vue
<template>
	<NcPageHeader
		name="Documents"
		description="All documents shared with your team."
		:icon-path="mdiFileDocumentOutline">
		<template #actions>
			<NcButton variant="primary">
				<template #icon>
					<NcIconSvgWrapper :path="mdiPlus" />
				</template>
				New document
			</NcButton>
		</template>
	</NcPageHeader>
</template>

<script>
import { mdiFileDocumentOutline, mdiPlus } from '@mdi/js'

export default {
	setup() {
		return {
			mdiFileDocumentOutline,
			mdiPlus,
		}
	},
}
</script>
```

### With a custom icon

```vue
<template>
	<NcPageHeader name="Jane Doe" description="Last seen today">
		<template #icon>
			<NcAvatar user="jdoe" display-name="Jane Doe" :size="44" />
		</template>
	</NcPageHeader>
</template>
```

### Exposed CSS Variables

| Variable | Description |
|---|---|
| `--page-header-gap` | Space between the icon, the text and the actions. Defaults to three grid baselines. |
| `--page-header-margin-block-end` | Space below the header. Defaults to four grid baselines. |
| `--page-header-icon-color` | Color of the icon. Defaults to `--color-primary-element`. |
| `--page-header-heading-color` | Color of the heading. Defaults to `--color-main-text`. |
| `--page-header-heading-font-family` | Font of the heading. Inherited by default. |
| `--page-header-heading-font-size` | Font size of the heading. Defaults to `30px`. |
| `--page-header-heading-font-weight` | Font weight of the heading. Defaults to `600`. |
| `--page-header-heading-line-height` | Line height of the heading, as a number without a unit, so the icon and the actions can be centered on the heading's first line. Defaults to `1.5`. |
| `--page-header-description-color` | Color of the description. Defaults to `--color-text-maxcontrast`. |
| `--page-header-description-font-size` | Font size of the description. Inherited by default. |
| `--page-header-heading-margin-block-start` | Space above the heading. Defaults to `0`. |
| `--page-header-heading-margin-block-end` | Space below the heading. Defaults to `0`. |
| `--page-header-description-font-family` | Font of the description. Inherited by default. |
| `--page-header-description-font-weight` | Font weight of the description. Inherited by default. |
| `--page-header-description-line-height` | Line height of the description. Inherited by default. |

They can be set on the header or on any of its parents, for example `body` to restyle every page header at once. The names follow the heading and lead paragraph tokens of the NL Design System.
</docs>

<script setup lang="ts">
import type { Slot } from 'vue'

import { computed } from 'vue'
import NcIconSvgWrapper from '../NcIconSvgWrapper/index.ts'

const props = withDefaults(defineProps<{
	/**
	 * The heading of the page.
	 */
	name: string

	/**
	 * A short description shown below the heading.
	 */
	description?: string

	/**
	 * The SVG path of an icon shown in front of the heading, for example one from `@mdi/js`.
	 * The `icon` slot takes precedence.
	 */
	iconPath?: string

	/**
	 * The level of the heading, from 2 to 6.
	 * Level 1 is not allowed, because the Nextcloud page layout already has the `h1`.
	 */
	headingLevel?: 2 | 3 | 4 | 5 | 6
}>(), {
	description: undefined,
	iconPath: undefined,
	headingLevel: 2,
})

const slots = defineSlots<{
	/**
	 * A custom icon shown in front of the heading. It replaces the `icon-path` icon.
	 */
	icon?: Slot

	/**
	 * Actions shown at the end of the header, for example buttons.
	 */
	actions?: Slot
}>()

const headingTag = computed(() => `h${Math.min(6, Math.max(2, props.headingLevel))}`)
</script>

<template>
	<header :class="$style.ncPageHeader">
		<!-- The icon and the text never wrap apart; only the actions move to a row of their own -->
		<div :class="$style.ncPageHeader__main">
			<div v-if="slots.icon || iconPath" :class="$style.ncPageHeader__icon">
				<slot name="icon">
					<NcIconSvgWrapper :path="iconPath" :size="32" />
				</slot>
			</div>
			<div :class="$style.ncPageHeader__text">
				<component :is="headingTag" :class="$style.ncPageHeader__heading">
					{{ name }}
				</component>
				<p v-if="description" :class="$style.ncPageHeader__description">
					{{ description }}
				</p>
			</div>
		</div>
		<div v-if="slots.actions" :class="$style.ncPageHeader__actions">
			<slot name="actions" />
		</div>
	</header>
</template>

<style lang="scss" module>
.ncPageHeader {
	display: flex;
	flex-wrap: wrap;
	align-items: flex-start;
	gap: var(--page-header-gap, calc(3 * var(--default-grid-baseline)));
	margin-block-end: var(--page-header-margin-block-end, calc(4 * var(--default-grid-baseline)));
}

.ncPageHeader__main {
	display: flex;
	flex: 1 1 16rem;
	align-items: flex-start;
	gap: var(--page-header-gap, calc(3 * var(--default-grid-baseline)));
	min-width: 0;
}

.ncPageHeader__icon {
	display: flex;
	flex-shrink: 0;
	align-items: center;
	justify-content: center;
	// As tall as the heading's first line, so the icon is centered on it
	min-height: calc(var(--page-header-heading-font-size, 30px) * var(--page-header-heading-line-height, 1.5));
	color: var(--page-header-icon-color, var(--color-primary-element));
}

.ncPageHeader__text {
	flex: 1 1 0;
	min-width: 0;
}

// The defaults are those of an h2 in the server's core/css/apps.scss, which has no variables for them
.ncPageHeader__heading {
	margin-block: var(--page-header-heading-margin-block-start, 0) var(--page-header-heading-margin-block-end, 0);
	margin-inline: 0;
	color: var(--page-header-heading-color, var(--color-main-text));
	font-family: var(--page-header-heading-font-family, inherit);
	font-size: var(--page-header-heading-font-size, 30px);
	font-weight: var(--page-header-heading-font-weight, 600);
	line-height: var(--page-header-heading-line-height, 1.5);
	overflow-wrap: anywhere;
}

.ncPageHeader__description {
	margin: var(--default-grid-baseline) 0 0;
	color: var(--page-header-description-color, var(--color-text-maxcontrast));
	font-family: var(--page-header-description-font-family, inherit);
	font-size: var(--page-header-description-font-size, inherit);
	font-weight: var(--page-header-description-font-weight, inherit);
	line-height: var(--page-header-description-line-height, inherit);
}

.ncPageHeader__actions {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: var(--default-grid-baseline);
	// As tall as the heading's first line, so the actions are centered on it
	min-height: calc(var(--page-header-heading-font-size, 30px) * var(--page-header-heading-line-height, 1.5));
}
</style>
