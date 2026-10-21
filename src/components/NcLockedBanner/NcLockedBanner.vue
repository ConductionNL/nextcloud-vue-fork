<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<docs>
### General description

This component renders a banner that says an item is locked and by whom, for example at the top of the page of the item. It looks like an `NcNoteCard`.

A lock held by someone else is shown as an error, because the item cannot be edited until the lock is released. A lock the current user holds is shown as a neutral note with an **Unlock** button, so they can release a lock they may have forgotten about. The button emits `unlock`; release the lock in the app and set `unlocking` while that is in progress.

With `expires-at` the banner also says when the lock expires, as a relative time that updates by itself. Render the banner only for a locked item, for example with `v-if`.

### Usage

```vue
<template>
	<div>
		<NcLockedBanner
			locked-by="Jane Doe"
			:expires-at="inTwentyMinutes" />
		<NcLockedBanner
			v-if="locked"
			locked-by-me
			:unlocking="unlocking"
			@unlock="unlock" />
		<p v-else>
			Unlocked.
		</p>
	</div>
</template>

<script>
export default {
	data() {
		return {
			inTwentyMinutes: Date.now() + 20 * 60 * 1000,
			locked: true,
			unlocking: false,
		}
	},

	methods: {
		unlock() {
			this.unlocking = true
			setTimeout(() => {
				this.unlocking = false
				this.locked = false
			}, 1000)
		},
	},
}
</script>
```

### Exposed CSS Variables

| Variable | Description |
|---|---|
| `--locked-banner-other-background-color` | Background of the banner for a lock someone else holds. Defaults to `--color-error`, mixed with the background before Nextcloud 32. |
| `--locked-banner-other-border-color` | Color of the line at the start of that banner. Defaults to `--color-error-text`. |
| `--locked-banner-other-color` | Text color of that banner. Defaults to `--color-main-text`. |
| `--locked-banner-other-icon-color` | Color of the padlock on that banner. Defaults to `--locked-banner-other-border-color`. |
| `--locked-banner-own-background-color` | Background of the banner for a lock the current user holds. Defaults to `--color-background-hover`. |
| `--locked-banner-own-border-color` | Color of the line at the start of that banner. Defaults to `--color-border-maxcontrast`. |
| `--locked-banner-own-color` | Text color of that banner. Defaults to `--color-main-text`. |
| `--locked-banner-own-icon-color` | Color of the padlock on that banner. Defaults to `--locked-banner-own-border-color`. |
| `--locked-banner-padding` | Space inside the banner. Defaults to two grid baselines. |
| `--locked-banner-gap` | Space between the padlock, the text and the button. Defaults to two grid baselines. |
| `--locked-banner-border-width` | Width of the line at the start of the banner. Defaults to one grid baseline. |
| `--locked-banner-border-radius` | Corner radius of the banner. Defaults to `--border-radius-small`. |
| `--locked-banner-font-family` | Font of the banner. Inherited by default. |
| `--locked-banner-message-font-weight` | Font weight of the message. Defaults to bold. |
| `--locked-banner-expiry-color` | Color of the line about when the lock expires. Defaults to `--color-text-maxcontrast`. |

They can be set on the banner or on any of its parents, for example `body` to restyle every locked banner at once. The names follow the alert tokens of the NL Design System.
</docs>

<script setup lang="ts">
import { mdiLockAlertOutline, mdiLockOpenVariantOutline, mdiLockOutline } from '@mdi/js'
import { computed } from 'vue'
import { useFormatRelativeTime } from '../../composables/useFormatDateTime/index.ts'
import { t } from '../../l10n.ts'
import { isLegacy } from '../../utils/legacy.ts'
import NcButton from '../NcButton/index.ts'
import NcIconSvgWrapper from '../NcIconSvgWrapper/index.ts'
import NcLoadingIcon from '../NcLoadingIcon/index.ts'

const props = withDefaults(defineProps<{
	/**
	 * The name of the user who holds the lock.
	 * Left empty, the lock is attributed to another user.
	 */
	lockedBy?: string

	/**
	 * Whether the current user holds the lock.
	 * Only then the banner offers to unlock.
	 */
	lockedByMe?: boolean

	/**
	 * When the lock expires, as a date or a timestamp in milliseconds.
	 */
	expiresAt?: Date | number

	/**
	 * Whether the lock is being released. Disables the unlock button and shows a loading icon on it.
	 */
	unlocking?: boolean

	/**
	 * Hide the unlock button on a lock the current user holds, for example where nothing can be edited anyway.
	 */
	hideUnlock?: boolean
}>(), {
	lockedBy: '',
	expiresAt: undefined,
})

const emit = defineEmits<{
	/**
	 * The current user asked to release their lock.
	 */
	unlock: []
}>()

const relativeExpiry = useFormatRelativeTime(() => props.expiresAt ?? Date.now())

const message = computed(() => {
	if (props.lockedByMe) {
		return t('You are editing this. Others cannot change it until you unlock it.')
	}
	if (props.lockedBy) {
		return t('Locked by {user}. You cannot edit this until the lock is released.', { user: props.lockedBy })
	}
	return t('Locked by another user. You cannot edit this until the lock is released.')
})

const expiry = computed(() => {
	if (props.expiresAt === undefined) {
		return ''
	}
	// The relative time updates by itself, so reading it makes this check again as time passes
	const time = relativeExpiry.value
	if (new Date(props.expiresAt).getTime() <= Date.now()) {
		return t('The lock has expired')
	}
	return t('The lock expires {time}', { time })
})
</script>

<template>
	<div
		:class="[$style.ncLockedBanner, lockedByMe ? $style.ncLockedBanner_mine : $style.ncLockedBanner_other, { [$style.ncLockedBanner_legacy]: isLegacy }]"
		:role="lockedByMe ? 'status' : 'alert'">
		<NcIconSvgWrapper
			:class="$style.ncLockedBanner__icon"
			:path="lockedByMe ? mdiLockOutline : mdiLockAlertOutline"
			:size="20" />
		<div :class="$style.ncLockedBanner__text">
			<p :class="$style.ncLockedBanner__message">
				{{ message }}
			</p>
			<p v-if="expiry" :class="$style.ncLockedBanner__expiry">
				{{ expiry }}
			</p>
		</div>
		<NcButton
			v-if="lockedByMe && !hideUnlock"
			:class="$style.ncLockedBanner__action"
			:disabled="unlocking"
			@click="emit('unlock')">
			<template #icon>
				<NcLoadingIcon v-if="unlocking" :size="20" />
				<NcIconSvgWrapper v-else :path="mdiLockOpenVariantOutline" :size="20" />
			</template>
			{{ t('Unlock') }}
		</NcButton>
	</div>
</template>

<style lang="scss" module>
.ncLockedBanner {
	display: flex;
	flex-wrap: wrap;
	align-items: flex-start;
	gap: var(--locked-banner-gap, calc(2 * var(--default-grid-baseline)));
	margin-block: 1rem;
	padding: var(--locked-banner-padding, calc(2 * var(--default-grid-baseline)));
	border-inline-start: var(--locked-banner-border-width, var(--default-grid-baseline)) solid var(--locked-banner-tone-accent);
	border-radius: var(--locked-banner-border-radius, var(--border-radius-small));
	color: var(--locked-banner-tone-color);
	background-color: var(--locked-banner-tone-background);
	font-family: var(--locked-banner-font-family, inherit);
}

// Someone else's lock is an error, like an error NcNoteCard
.ncLockedBanner_other {
	--locked-banner-tone-accent: var(--locked-banner-other-border-color, var(--color-error-text));
	--locked-banner-tone-background: var(--locked-banner-other-background-color, var(--color-error));
	--locked-banner-tone-color: var(--locked-banner-other-color, var(--color-main-text));
	--locked-banner-tone-icon: var(--locked-banner-other-icon-color, var(--locked-banner-tone-accent));
}

// Before Nextcloud 32 the error color is strong, so it is mixed into the background like NcNoteCard does
.ncLockedBanner_other.ncLockedBanner_legacy {
	--locked-banner-tone-background: var(--locked-banner-other-background-color, color-mix(in srgb, var(--color-error), var(--color-main-background) 80%));
}

// The current user's own lock is nothing wrong, so it is a neutral note
.ncLockedBanner_mine {
	--locked-banner-tone-accent: var(--locked-banner-own-border-color, var(--color-border-maxcontrast));
	--locked-banner-tone-background: var(--locked-banner-own-background-color, var(--color-background-hover));
	--locked-banner-tone-color: var(--locked-banner-own-color, var(--color-main-text));
	--locked-banner-tone-icon: var(--locked-banner-own-icon-color, var(--locked-banner-tone-accent));
}

.ncLockedBanner__icon {
	flex-shrink: 0;
	color: var(--locked-banner-tone-icon);
}

.ncLockedBanner__text {
	flex: 1 1 200px;
	min-width: 0;
}

.ncLockedBanner__message {
	margin: 0;
	font-weight: var(--locked-banner-message-font-weight, bold);
}

.ncLockedBanner__expiry {
	margin: var(--default-grid-baseline) 0 0;
	color: var(--locked-banner-expiry-color, var(--color-text-maxcontrast));
}

.ncLockedBanner__action {
	flex-shrink: 0;
	align-self: center;
}
</style>
