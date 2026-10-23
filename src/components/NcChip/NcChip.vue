<!--
 - SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 - SPDX-License-Identifier: AGPL-3.0-or-later
-->
<docs>
### Basic usage

```vue
<template>
	<div style="display: flex; gap: 8px; flex-wrap: wrap;">
		<NcChip text="Notes.txt" />
		<NcChip text="Files" :icon-path="mdiFileOutline" />
		<NcChip text="Color" :icon-path="mdiPaletteOutline" variant="tertiary" />
		<NcChip text="Current time" :icon-path="mdiClock" no-close variant="primary" />
		<NcChip text="Canceled" :icon-path="mdiCancel" variant="error" no-close />
		<NcChip text="Open" :icon-path="mdiCircleOutline" variant="success" no-close />
		<NcChip text="Due tomorrow" :icon-path="mdiAlertCircleOutline" variant="warning" no-close />
	</div>
</template>
<script>
import { mdiClock, mdiFileOutline, mdiPaletteOutline, mdiCancel, mdiCircleOutline, mdiAlertCircleOutline } from '@mdi/js'

export default {
	setup() {
		return {
			mdiAlertCircleOutline,
			mdiCancel,
			mdiCircleOutline,
			mdiClock,
			mdiFileOutline,
			mdiPaletteOutline,
		}
	}
}
</script>
```

### Status

Use `error`, `warning`, `success` and `info` for a status. With `light` the chip gets a light background and its icon the status color, which reads better when many chips are shown together, for example one per row of a table. Use `size="small"` to fit a chip into a line of text or a table cell. The close button of a small chip keeps a clickable area of `24px`, so it reaches a little beyond the chip.

```vue
<template>
	<div style="display: grid; gap: 12px;">
		<div style="display: flex; gap: 8px; flex-wrap: wrap;">
			<NcChip text="Overdue" variant="error" no-close />
			<NcChip text="Waiting" variant="warning" no-close />
			<NcChip text="Done" variant="success" no-close />
			<NcChip text="New" variant="info" no-close />
		</div>
		<div style="display: flex; gap: 8px; flex-wrap: wrap;">
			<NcChip text="Overdue" variant="error" light no-close />
			<NcChip text="Waiting" variant="warning" light no-close />
			<NcChip text="Done" variant="success" light no-close />
			<NcChip text="New" variant="info" light no-close />
		</div>
		<div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
			<NcChip text="Overdue" variant="error" light size="small" no-close />
			<NcChip text="Done" :icon-path="mdiCheck" variant="success" light size="small" no-close />
			<NcChip text="Small" size="small" />
		</div>
	</div>
</template>
<script>
import { mdiCheck } from '@mdi/js'

export default {
	setup() {
		return {
			mdiCheck,
		}
	},
}
</script>
```

### Advanced usage

It is also possible to use custom components for the icon by using the `icon` slot.
In this example we are using the `NcAvatar` component to render the users avatar as the icon.

*Hint: If you use round icons like avatars you should set their size to `24px` (or use CSS variable `--chip-size`) to make them fully fill and align with the the chip*

Also it is possible to pass custom actions.

```vue
<template>
	<NcChip>
		<!-- The icon slot allow to use custom components as the chip icon -->
		<template #icon>
			<NcAvatar :size="24" user="jdoe" display-name="J. Doe" />
		</template>
		<!-- The actions slot allows to add custom actions -->
		<template #actions>
			<NcActionButton>
				<template #icon>
					<ContactsIcon :size="20" />
				</template>
				Add to contacts
			</NcActionButton>
		</template>
		<!-- The default slot can be used for add content, just like the `text` prop -->
		J. Doe
	</NcChip>
</template>
<script>
import ContactsIcon from 'vue-material-design-icons/Contacts.vue'
export default {
	components: {
		ContactsIcon,
	},
}
</script>
```
### Exposed CSS Variables

| Variable | Description |
|---|---|
| `--chip-size` | Height of the chip, and the size of the box around its icon. The icon itself stays `18px`, or `16px` when small. Set it on the chip itself with an inline `style`, as the chip's own value wins over a class. Defaults to `24px`, or `20px` when small. |
| `--chip-border-radius` | Corner radius of the chip. Defaults to half of `--chip-size`, a pill. |
| `--chip-font-family` | Font of the text. Inherited by default. |
| `--chip-font-size` | Font size of the text. Inherited by default. |
| `--chip-small-font-size` | Font size of the text of a small chip. Defaults to `--font-size-small`. |
| `--chip-font-weight` | Font weight of the text. Inherited by default. |
| `--chip-font-style` | Font style of the text. Inherited by default. |
| `--chip-line-height` | Line height of the text. Inherited by default. |
| `--chip-letter-spacing` | Letter spacing of the text. Inherited by default. |
| `--chip-text-transform` | Text transform of the text, for example `uppercase`. Inherited by default. |
| `--chip-padding-inline` | Space between the text and the edge of the chip, on the sides without an icon or actions. Defaults to two grid baselines. |
| `--chip-primary-background-color` | Background of a `primary` chip. Defaults to `--color-primary-element`. |
| `--chip-primary-color` | Text color of a `primary` chip. Defaults to `--color-primary-element-text`. |
| `--chip-secondary-background-color` | Background of a `secondary` chip. Defaults to `--color-primary-element-light`. |
| `--chip-secondary-color` | Text color of a `secondary` chip. Defaults to `--color-primary-element-light-text`. |
| `--chip-tertiary-background-color` | Background of a `tertiary` chip. Defaults to `--color-background-hover`. |
| `--chip-tertiary-color` | Text color of a `tertiary` chip. Inherited by default. |
| `--chip-error-background-color` | Background of an `error` chip. Defaults to `--color-error`. |
| `--chip-error-color` | Text color of an `error` chip. Defaults to `--color-error-text`. |
| `--chip-warning-background-color` | Background of a `warning` chip. Defaults to `--color-warning`. |
| `--chip-warning-color` | Text color of a `warning` chip. Defaults to `--color-warning-text`. |
| `--chip-success-background-color` | Background of a `success` chip. Defaults to `--color-success`. |
| `--chip-success-color` | Text color of a `success` chip. Defaults to `--color-success-text`. |
| `--chip-info-background-color` | Background of an `info` chip. Defaults to `--color-info`. |
| `--chip-info-color` | Text color of an `info` chip. Defaults to `--color-info-text`. |
| `--chip-light-color` | Text color of a light `error`, `warning`, `success` or `info` chip. Defaults to `--color-main-text`. |
| `--chip-light-error-background-color` | Background of a light `error` chip. Defaults to the error color mixed with the background. |
| `--chip-light-warning-background-color` | Background of a light `warning` chip. Defaults to the warning color mixed with the background. |
| `--chip-light-success-background-color` | Background of a light `success` chip. Defaults to the success color mixed with the background. |
| `--chip-light-info-background-color` | Background of a light `info` chip. Defaults to the info color mixed with the background. |

Except `--chip-size`, they can be set on the chip or on any of its parents, for example `body` to restyle every chip at once. The names follow the badge and status badge tokens of the NL Design System.
</docs>

<template>
	<div
		class="nc-chip"
		:class="{
			[`nc-chip--${variant}`]: true,
			'nc-chip--small': size === 'small',
			'nc-chip--light': light,
			'nc-chip--no-actions': noClose && !hasActions(),
			'nc-chip--no-icon': !hasIcon(),
		}">
		<span v-if="hasIcon()" class="nc-chip__icon">
			<slot name="icon">
				<!-- The default icon wrapper uses a size of 18px to ensure the icon is not clipped by the round chip style -->
				<NcIconSvgWrapper
					v-if="iconPath || iconSvg"
					inline
					:path="iconPath"
					:svg="iconPath ? undefined : iconSvg"
					:size="size === 'small' ? 16 : 18" />
			</slot>
		</span>
		<span class="nc-chip__text">
			<slot>{{ text }}</slot>
		</span>
		<NcActions
			v-if="canClose || hasActions()"
			class="nc-chip__actions"
			:container="actionsContainer"
			:forceMenu="!canClose"
			variant="tertiary-no-background">
			<NcActionButton
				v-if="canClose"
				closeAfterClick
				@click="emit('close')">
				<template #icon>
					<NcIconSvgWrapper :path="mdiClose" :size="20" />
				</template>
				{{ ariaLabelClose }}
			</NcActionButton>
			<slot name="actions" />
		</NcActions>
	</div>
</template>

<script setup lang="ts">
import type { Slot } from 'vue'

import { mdiClose } from '@mdi/js'
import { computed } from 'vue'
import NcActionButton from '../NcActionButton/NcActionButton.vue'
import NcActions from '../NcActions/NcActions.vue'
import NcIconSvgWrapper from '../NcIconSvgWrapper/NcIconSvgWrapper.vue'
import { t } from '../../l10n.ts'

const props = withDefaults(defineProps<{
	/**
	 * aria label to set on the close button
	 *
	 * @default 'Close'
	 */
	ariaLabelClose?: string

	/**
	 * Container for the actions
	 */
	actionsContainer?: string

	/**
	 * Main text of the chip.
	 */
	text?: string

	/**
	 * SVG path of the icon to use, this takes precedence over `iconSVG`.
	 * For example icon paths from `@mdi/js` can be used.
	 */
	iconPath?: string

	/**
	 * Inline SVG to use as the icon
	 */
	iconSvg?: string

	/**
	 * Set to true to prevent the close button to be shown
	 */
	noClose?: boolean

	/**
	 * Set the chips design variant-
	 *
	 * This sets the background style of the chip, similar to NcButton's `variant`.
	 * The `info` variant is available since 9.15.0.
	 *
	 * @default 'secondary'
	 * @since 8.23.0
	 */
	variant?: 'primary' | 'secondary' | 'tertiary' | 'error' | 'warning' | 'success' | 'info'

	/**
	 * The size of the chip. A small chip fits inline in a line of text or a table cell.
	 *
	 * @default 'normal'
	 * @since 9.15.0
	 */
	size?: 'small' | 'normal'

	/**
	 * Use a light background for the `error`, `warning`, `success` and `info` variants,
	 * for example to show the status of many items without every chip drawing the eye.
	 * Other variants are not affected.
	 *
	 * @since 9.15.0
	 */
	light?: boolean
}>(), {
	ariaLabelClose: t('Close'),
	actionsContainer: 'body',
	iconPath: undefined,
	iconSvg: undefined,
	text: '',
	variant: 'secondary',
	size: 'normal',
})

const emit = defineEmits<{
	/**
	 * Emitted when the close button is clicked
	 */
	close: []
}>()

const slots = defineSlots<{
	/**
	 * The actions slot can be used to add custom actions (`NcAction*`) to the chips actions.
	 */
	actions?: Slot

	/**
	 * The default slot can be used to set the text that is shown.
	 */
	default?: Slot

	/**
	 * The icon slot can be used to set the chip icon.
	 * Make sure that the icon is not exceeding a height of `--chip-size`.
	 * For round icons a exact size of `var(--chip-size)` is recommended.
	 */
	icon?: Slot
}>()

const canClose = computed(() => !props.noClose)
const hasActions = () => !!slots.actions
const hasIcon = () => Boolean(props.iconPath || props.iconSvg || !!slots.icon)
</script>

<style scoped lang="scss">
.nc-chip {
	--chip-size: 24px;
	--chip-radius: calc(var(--chip-size) / 2);
	// Setup size of wrapper
	height: var(--chip-size);
	max-width: fit-content;
	display: flex;
	flex-direction: row;
	align-items: center;
	// The variables are read here so they can be set on any parent, for example by a theme
	border-radius: var(--chip-border-radius, var(--chip-radius));
	background-color: var(--chip-tertiary-background-color, var(--color-background-hover));
	color: var(--chip-tertiary-color, inherit);
	font-family: var(--chip-font-family, inherit);
	font-size: var(--chip-font-size, inherit);
	font-style: var(--chip-font-style, inherit);
	font-weight: var(--chip-font-weight, inherit);
	line-height: var(--chip-line-height, inherit);
	letter-spacing: var(--chip-letter-spacing, inherit);
	text-transform: var(--chip-text-transform, inherit);

	&--primary {
		background-color: var(--chip-primary-background-color, var(--color-primary-element));
		color: var(--chip-primary-color, var(--color-primary-element-text));
	}

	&--secondary {
		background-color: var(--chip-secondary-background-color, var(--color-primary-element-light));
		color: var(--chip-secondary-color, var(--color-primary-element-light-text));
	}

	&--error {
		background-color: var(--chip-error-background-color, var(--color-error));
		color: var(--chip-error-color, var(--color-error-text));
	}

	&--warning {
		background-color: var(--chip-warning-background-color, var(--color-warning));
		color: var(--chip-warning-color, var(--color-warning-text));
	}

	&--success {
		background-color: var(--chip-success-background-color, var(--color-success));
		color: var(--chip-success-color, var(--color-success-text));
	}

	&--info {
		background-color: var(--chip-info-background-color, var(--color-info));
		color: var(--chip-info-color, var(--color-info-text));
	}

	&--small {
		--chip-size: 20px;
		font-size: var(--chip-small-font-size, var(--font-size-small));
	}

	// The status color mixed into the background and the icon in the status text color,
	// like NcNoteCard. Only the status variants, the others keep their own colors.
	&--light {
		&.nc-chip--error,
		&.nc-chip--warning,
		&.nc-chip--success,
		&.nc-chip--info {
			color: var(--chip-light-color, var(--color-main-text));
		}

		&.nc-chip--error {
			background-color: var(--chip-light-error-background-color, color-mix(in srgb, var(--color-error), var(--color-main-background) 80%));

			.nc-chip__icon {
				color: var(--color-error-text);
			}
		}

		&.nc-chip--warning {
			background-color: var(--chip-light-warning-background-color, color-mix(in srgb, var(--color-warning), var(--color-main-background) 80%));

			.nc-chip__icon {
				color: var(--color-warning-text);
			}
		}

		&.nc-chip--success {
			background-color: var(--chip-light-success-background-color, color-mix(in srgb, var(--color-success), var(--color-main-background) 80%));

			.nc-chip__icon {
				color: var(--color-success-text);
			}
		}

		&.nc-chip--info {
			background-color: var(--chip-light-info-background-color, color-mix(in srgb, var(--color-info), var(--color-main-background) 80%));

			.nc-chip__icon {
				color: var(--color-info-text);
			}
		}
	}

	&--no-actions &__text {
		// If there are no actions we need to add some padding to ensure the text is not cut-off
		padding-inline-end: var(--chip-padding-inline, calc(2 * var(--default-grid-baseline)));
	}

	&--no-icon &__text {
		// Add some more space to the border
		padding-inline-start: var(--chip-padding-inline, calc(2 * var(--default-grid-baseline)));
	}

	&__text {
		// Allow to grow the text
		// this is only used if an app forces a width of the chip
		flex: 1 auto;

		overflow: hidden;
		text-overflow: ellipsis;
		text-wrap: nowrap;
	}

	&__icon {
		// Do neither grow nor shrink, size is fixed
		flex: 0 0 var(--chip-size);
		margin-inline-end: var(--default-grid-baseline);

		line-height: 1;
		display: flex;
		align-items: center;
		justify-content: center;

		// Force size
		overflow: hidden;
		height: var(--chip-size);
		width: var(--chip-size);
	}

	&__actions {
		// Adjust action size to match chip size, but keep it at least 24px to click or
		// tap; on a smaller chip it overlaps the edges without making the chip taller
		--chip-actions-size: max(24px, var(--chip-size));
		// Do neither grow nor shrink, size is fixed
		flex: 0 0 var(--chip-actions-size);
		margin-block: calc((var(--chip-size) - var(--chip-actions-size)) / 2);
		--default-clickable-area: var(--chip-actions-size);
		// Half of its own size, so it stays round when it is larger than a small chip
		--border-radius-element: var(--chip-border-radius, calc(var(--chip-actions-size) / 2));
	}
}
</style>
