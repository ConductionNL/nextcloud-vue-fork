<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<docs>
### General description

This component renders the pagination of a paged list or table. It shows the current position, buttons to move to the first, previous, next or last page or to a numbered page, and a selector for the number of items per page. When all items fit on one page, only the position and the page size selector are shown.

The component does not load or slice any data itself. Pass the number of items in `total-items`, bind the current page with `v-model:page` and the page size with `v-model:page-size`, and load or slice the items accordingly.

Long page ranges are shortened with ellipses, so at most seven page buttons are shown at a time. The pagination is a `nav` landmark, labeled "Pagination" unless `aria-label` is set.

When the page size is changed with the selector, the pagination goes back to the first page. When the current page does not exist, because the number of items shrank or a page that does not exist was passed, it moves to the last page there is. While `total-items` is `0`, for example while the items are still loading, the current page is left as it is.

When a page or first, previous, next or last button that has keyboard focus disappears or becomes disabled, the focus moves to the current page, or in the compact layout to the other button.

### Usage

```vue
<template>
	<div>
		<ul class="items">
			<li v-for="item in visibleItems" :key="item">
				Item {{ item }}
			</li>
		</ul>
		<NcPagination
			v-model:page="page"
			v-model:page-size="pageSize"
			:total-items="items.length" />
	</div>
</template>

<script>
export default {
	data() {
		return {
			items: Array.from({ length: 237 }, (_, index) => index + 1),
			page: 1,
			pageSize: 10,
		}
	},

	computed: {
		visibleItems() {
			const start = (this.page - 1) * this.pageSize
			return this.items.slice(start, start + this.pageSize)
		},
	},
}
</script>

<style scoped>
.items {
	margin: 0;
	padding: 0;
	list-style: none;
	border-top: 1px solid var(--color-border);
}

.items li {
	padding: calc(3 * var(--default-grid-baseline)) calc(4 * var(--default-grid-baseline));
	border-bottom: 1px solid var(--color-border);
}
</style>
```

### Compact

The compact layout only shows the visible item range and the previous and next buttons. Use it where space is limited, for example in a dashboard widget or a sidebar.

```vue
<template>
	<NcPagination
		v-model:page="page"
		compact
		:page-size="5"
		:total-items="42" />
</template>

<script>
export default {
	data() {
		return {
			page: 1,
		}
	},
}
</script>
```

### Without page size selector

Pass an empty `page-size-options` array to hide the page size selector, for example when the page size is fixed by the server.

```vue
<template>
	<NcPagination
		v-model:page="page"
		:page-size="25"
		:page-size-options="[]"
		:total-items="1000" />
</template>

<script>
export default {
	data() {
		return {
			page: 20,
		}
	},
}
</script>
```

### Pages as links

When the page is kept in the URL, pass `page-href` or, with Vue Router, `page-to`: a function that returns the link of a page. The pages and the first, previous, next and last buttons are then links that can be opened in a new tab or copied, and a disabled button is rendered without a link. A link does not change the page itself: pass the page from the URL as `page`. Only a changed page size, or a page that no longer exists, emits `update:page`, so replace the URL then.

```html static
<template>
	<NcPagination
		:page="Number($route.query.page ?? 1)"
		:page-to="(page) => ({ query: { ...$route.query, page } })"
		:total-items="totalItems"
		@update:page="(page) => $router.replace({ query: { ...$route.query, page } })" />
</template>
```

### Exposed CSS Variables

The pagination can be restyled with the CSS variables below, set on the pagination or on any of its parents, for example `body` to restyle every pagination at once. None of them is set by default, so until one is, the pagination looks like the other Nextcloud buttons. The names follow the pagination tokens of the NL Design System: *page links* are the numbered pages, *relative links* the first, previous, next and last buttons.

| Variable | Description |
|---|---|
| `--pagination-gap` | Space between the buttons. Defaults to `calc(2 * var(--default-grid-baseline))`. |
| `--pagination-ellipses-color` | Color of the `…` that stands for skipped pages. Defaults to `--color-text-maxcontrast`. |
| `--pagination-page-link-color` | Text color of a page link. Defaults to `--color-main-text`. |
| `--pagination-page-link-background-color` | Background of a page link. Defaults to `transparent`. |
| `--pagination-page-link-border-color` | Border color of a page link. Defaults to `transparent`. |
| `--pagination-page-link-border-radius` | Corner radius of a page link. Defaults to `--border-radius-element`. |
| `--pagination-page-link-min-block-size` | Minimum height of a page link. Defaults to `--default-clickable-area`. |
| `--pagination-page-link-min-inline-size` | Minimum width of a page link. Defaults to `--default-clickable-area`. |
| `--pagination-page-link-padding-block-start` | Padding above the number. Defaults to `1px`. |
| `--pagination-page-link-padding-block-end` | Padding below the number. Defaults to `0`. |
| `--pagination-page-link-padding-inline-start` | Padding before the number. Defaults to the button padding. |
| `--pagination-page-link-padding-inline-end` | Padding after the number. Defaults to the button padding. |
| `--pagination-page-link-font-family` | Font of a page link. Inherited by default. |
| `--pagination-page-link-font-size` | Font size of a page link. Defaults to `--default-font-size`. |
| `--pagination-page-link-font-weight` | Font weight of a page link. Defaults to `--font-weight-element`. |
| `--pagination-page-link-hover-color` | Text color of a hovered page link. Defaults to `--pagination-page-link-color`. |
| `--pagination-page-link-hover-background-color` | Background of a hovered page link. Defaults to the hover background of a tertiary button. |
| `--pagination-page-link-hover-border-color` | Border color of a hovered page link. Defaults to `--pagination-page-link-border-color`. |
| `--pagination-page-link-current-color` | Text color of the current page. Defaults to `--color-primary-element-text`. |
| `--pagination-page-link-current-background-color` | Background of the current page. Defaults to `--color-primary-element`. |
| `--pagination-page-link-current-border-color` | Border color of the current page. Defaults to `--color-primary-element-hover`. |
| `--pagination-page-link-current-font-weight` | Font weight of the current page. Defaults to `--pagination-page-link-font-weight`. |
| `--pagination-relative-link-color` | Icon color of a relative link. Defaults to `--color-main-text`. |
| `--pagination-relative-link-background-color` | Background of a relative link. Defaults to `transparent`. |
| `--pagination-relative-link-border-color` | Border color of a relative link. Defaults to `transparent`. |
| `--pagination-relative-link-border-radius` | Corner radius of a relative link. Defaults to `--border-radius-element`. |
| `--pagination-relative-link-min-block-size` | Height of a relative link, and its width, as the button is square. Defaults to `--default-clickable-area`. |
| `--pagination-relative-link-min-inline-size` | Minimum width of a relative link. Defaults to `--pagination-relative-link-min-block-size`. |
| `--pagination-relative-link-padding-block-start` | Padding above the icon. Defaults to `1px`. |
| `--pagination-relative-link-padding-block-end` | Padding below the icon. Defaults to `0`. |
| `--pagination-relative-link-padding-inline-start` | Padding before the icon. Defaults to the button padding. |
| `--pagination-relative-link-padding-inline-end` | Padding after the icon. Defaults to the button padding. |
| `--pagination-relative-link-hover-color` | Icon color of a hovered relative link. Defaults to `--pagination-relative-link-color`. |
| `--pagination-relative-link-hover-background-color` | Background of a hovered relative link. Defaults to the hover background of a tertiary button. |
| `--pagination-relative-link-hover-border-color` | Border color of a hovered relative link. Defaults to `--pagination-relative-link-border-color`. |
| `--pagination-relative-link-disabled-color` | Icon color of a disabled relative link. Defaults to `--pagination-relative-link-color`. |
| `--pagination-relative-link-disabled-background-color` | Background of a disabled relative link. Defaults to `--pagination-relative-link-background-color`. |
| `--pagination-relative-link-disabled-opacity` | Opacity of a disabled relative link. Defaults to `0.5`, like a disabled button. |
| `--pagination-relative-link-disabled-filter` | Filter on a disabled relative link. Defaults to `saturate(0.7)`, like a disabled button. |
| `--pagination-font-family` | Font of the pagination. Inherited by default. |
| `--pagination-font-size` | Font size of the pagination. Inherited by default. |
| `--pagination-line-height` | Line height of the pagination. Inherited by default. |
| `--pagination-page-link-border-width` | Border width of a page link. Defaults to `1px 1px 2px`, like a button. |
| `--pagination-page-link-text-decoration` | Text decoration of a page link, for example `underline`. Defaults to `none`. |
| `--pagination-page-link-current-text-decoration` | Text decoration of the current page. Defaults to `--pagination-page-link-text-decoration`. |
| `--pagination-relative-link-border-width` | Border width of a relative link. Defaults to `1px 1px 2px`, like a button. |
| `--pagination-relative-link-text-decoration` | Text decoration of a relative link. Defaults to `none`. |
| `--pagination-relative-link-disabled-text-decoration` | Text decoration of a disabled relative link. Defaults to `--pagination-relative-link-text-decoration`. |
| `--pagination-relative-link-focus-color` | Icon color of a focused relative link. Defaults to `--pagination-relative-link-color`. |
| `--pagination-relative-link-focus-background-color` | Background of a focused relative link. Defaults to `--pagination-relative-link-background-color`. |
| `--pagination-relative-link-focus-visible-color` | Icon color of a relative link focused with the keyboard. Defaults to `--pagination-relative-link-focus-color`. |
| `--pagination-relative-link-focus-visible-background-color` | Background of a relative link focused with the keyboard. Defaults to `--pagination-relative-link-focus-background-color`. |

A disabled relative link is washed out like a disabled button. When the disabled colors already show that it is disabled, set `--pagination-relative-link-disabled-opacity` to `1` and `--pagination-relative-link-disabled-filter` to `none`.
</docs>

<template>
	<nav
		ref="nav"
		:class="[$style.ncPagination, { [$style.ncPagination_compact]: compact }]"
		:aria-label="ariaLabel">
		<span :class="$style.ncPagination__info">
			{{ infoText }}
		</span>

		<div v-if="totalPages > 1" :class="$style.ncPagination__nav">
			<NcButton
				v-if="!compact"
				v-bind="linkProps(1, isFirstPage)"
				:aria-label="t('First page')"
				:title="t('First page')"
				:class="$style.ncPagination__relativeLink"
				:disabled="isFirstPage"
				variant="tertiary"
				@click="goToPage(1)">
				<template #icon>
					<NcIconSvgWrapper directional :path="mdiPageFirst" />
				</template>
			</NcButton>
			<NcButton
				v-bind="linkProps(page - 1, isFirstPage)"
				:aria-label="t('Previous page')"
				:title="t('Previous page')"
				:class="$style.ncPagination__relativeLink"
				:disabled="isFirstPage"
				variant="tertiary"
				@click="goToPage(page - 1)">
				<template #icon>
					<NcIconSvgWrapper directional :path="mdiChevronLeft" />
				</template>
			</NcButton>

			<ul v-if="!compact" :class="$style.ncPagination__pages">
				<li
					v-for="item in visiblePages"
					:key="item"
					:aria-hidden="typeof item === 'string' ? 'true' : undefined">
					<span
						v-if="typeof item === 'string'"
						:class="$style.ncPagination__ellipsis">
						…
					</span>
					<NcButton
						v-else
						v-bind="linkProps(item)"
						:class="$style.ncPagination__pageLink"
						:aria-current="item === page ? 'page' : undefined"
						:aria-label="t('Page {page}', { page: item })"
						variant="tertiary"
						@click="goToPage(item)">
						{{ item }}
					</NcButton>
				</li>
			</ul>

			<NcButton
				v-bind="linkProps(page + 1, isLastPage)"
				:aria-label="t('Next page')"
				:title="t('Next page')"
				:class="$style.ncPagination__relativeLink"
				:disabled="isLastPage"
				variant="tertiary"
				@click="goToPage(page + 1)">
				<template #icon>
					<NcIconSvgWrapper directional :path="mdiChevronRight" />
				</template>
			</NcButton>
			<NcButton
				v-if="!compact"
				v-bind="linkProps(totalPages, isLastPage)"
				:aria-label="t('Last page')"
				:title="t('Last page')"
				:class="$style.ncPagination__relativeLink"
				:disabled="isLastPage"
				variant="tertiary"
				@click="goToPage(totalPages)">
				<template #icon>
					<NcIconSvgWrapper directional :path="mdiPageLast" />
				</template>
			</NcButton>
		</div>

		<div v-if="!compact" :class="$style.ncPagination__end">
			<NcSelect
				v-if="pageSizeOptions.length > 0"
				:class="$style.ncPagination__pageSize"
				:clearable="false"
				:inputLabel="t('Items per page')"
				:modelValue="pageSize"
				:options="pageSizeOptions"
				@update:modelValue="setPageSize" />
		</div>
	</nav>
</template>

<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

import { mdiChevronLeft, mdiChevronRight, mdiPageFirst, mdiPageLast } from '@mdi/js'
import { computed, inject, nextTick, useTemplateRef, watch, watchPostEffect } from 'vue'
import { routerKey } from 'vue-router'
import NcButton from '../NcButton/NcButton.vue'
import NcIconSvgWrapper from '../NcIconSvgWrapper/NcIconSvgWrapper.vue'
import NcSelect from '../NcSelect/NcSelect.vue'
import { t } from '../../l10n.ts'

/**
 * The current page, starting at 1.
 */
const page = defineModel<number>('page', {
	default: 1,
	validator: (value: number) => Number.isInteger(value) && value >= 1,
})

/**
 * The number of items shown per page.
 */
const pageSize = defineModel<number>('pageSize', {
	default: 20,
	validator: (value: number) => Number.isInteger(value) && value >= 1,
})

const props = withDefaults(defineProps<{
	/**
	 * The total number of items over all pages.
	 */
	totalItems: number

	/**
	 * The page sizes offered in the page size selector.
	 * Pass an empty array to hide the selector.
	 *
	 * @default [10, 20, 50, 100]
	 */
	pageSizeOptions?: number[]

	/**
	 * Only show the visible item range and the previous and next buttons,
	 * for places with limited space such as dashboard widgets.
	 */
	compact?: boolean

	/**
	 * Accessible label of the pagination landmark.
	 *
	 * @default 'Pagination'
	 */
	ariaLabel?: string

	/**
	 * Returns the URL of a page, to render the pages as links.
	 * A link does not change the page itself: pass the page from the URL as `page`.
	 */
	pageHref?: (page: number) => string

	/**
	 * Returns the Vue Router route of a page, to render the pages as router links.
	 * A link does not change the page itself: pass the page from the route as `page`.
	 * Takes precedence over `pageHref`. Without a router it is ignored.
	 */
	pageTo?: (page: number) => RouteLocationRaw
}>(), {
	pageSizeOptions: () => [10, 20, 50, 100],
	ariaLabel: t('Pagination'),
	pageHref: undefined,
	pageTo: undefined,
})

defineEmits<{
	/**
	 * The current page changed.
	 *
	 * @param page - The new page, starting at 1
	 */
	'update:page': [page: number]

	/**
	 * The number of items per page changed.
	 *
	 * @param pageSize - The new page size
	 */
	'update:pageSize': [pageSize: number]
}>()

const navElement = useTemplateRef<HTMLElement>('nav')

const totalPages = computed(() => Math.max(1, Math.ceil(props.totalItems / Math.max(1, pageSize.value))))
const isFirstPage = computed(() => page.value <= 1)
const isLastPage = computed(() => page.value >= totalPages.value)
// Like NcButton: `page-to` only makes links with a router, else the pages stay buttons
const hasVueRouterContext = inject(routerKey, null) !== null
const isLink = computed(() => Boolean(props.pageHref || (props.pageTo && hasVueRouterContext)))

// Step back to the last page when the current one does not exist, also when mounted
// with one. While there are no items, for example while they load, a page from the
// URL is left alone. After the render, so a page the parent has just changed is
// already passed down.
watchPostEffect(() => {
	if (props.totalItems > 0 && page.value > totalPages.value) {
		page.value = totalPages.value
	}
})

// A focused button that becomes disabled or disappears with the new page drops the
// focus to the body. Remember it before the render and move the focus to the current
// page after, or in the compact layout to the button that is left.
watch(page, async () => {
	const focused = document.activeElement
	if (!(focused instanceof HTMLElement) || !navElement.value?.contains(focused)) {
		return
	}

	await nextTick()
	if (focused.isConnected && !focused.matches(':disabled')) {
		return
	}
	const target = navElement.value?.querySelector<HTMLElement>('[aria-current="page"]')
		?? navElement.value?.querySelector<HTMLElement>('a[href], button:not(:disabled)')
	target?.focus()
})

const infoText = computed(() => {
	if (!props.compact) {
		// While the items load, a page from the URL can lie beyond the single empty page
		const total = props.totalItems === 0 ? Math.max(page.value, totalPages.value) : totalPages.value
		return t('Page {page} of {totalPages}', { page: page.value, totalPages: total })
	}

	const from = props.totalItems === 0 ? 0 : (page.value - 1) * pageSize.value + 1
	const to = Math.min(page.value * pageSize.value, props.totalItems)
	return t('{from}–{to} of {total}', { from, to, total: props.totalItems })
})

/**
 * The page numbers to show, with ellipsis markers for skipped ranges.
 * At most seven entries are returned.
 */
const visiblePages = computed<(number | string)[]>(() => {
	const current = page.value
	const total = totalPages.value

	if (total <= 7) {
		return Array.from({ length: total }, (_, index) => index + 1)
	}
	if (current <= 4) {
		return [1, 2, 3, 4, 5, 'ellipsis-end', total]
	}
	if (current >= total - 3) {
		return [1, 'ellipsis-start', total - 4, total - 3, total - 2, total - 1, total]
	}
	return [1, 'ellipsis-start', current - 1, current, current + 1, 'ellipsis-end', total]
})

/**
 * The link props of a page button, when the pages are links.
 * A disabled button gets no link, so it stays a disabled button.
 *
 * @param target - The page the button moves to
 * @param disabled - Whether the button is disabled
 */
function linkProps(target: number, disabled = false) {
	if (!isLink.value || disabled) {
		return {}
	}
	return { href: props.pageHref?.(target), to: hasVueRouterContext ? props.pageTo?.(target) : undefined }
}

/**
 * Move to a page, if it exists and is not the current page.
 * Links navigate themselves, so then the page follows the URL instead.
 *
 * @param target - The page to move to
 */
function goToPage(target: number) {
	if (isLink.value) {
		return
	}
	if (target !== page.value && target >= 1 && target <= totalPages.value) {
		page.value = target
	}
}

/**
 * Change the page size, and go back to the first page.
 *
 * @param size - The newly selected page size
 */
function setPageSize(size: number | null) {
	if (typeof size === 'number' && size !== pageSize.value) {
		pageSize.value = size
		page.value = 1
	}
}
</script>

<style lang="scss" module>
.ncPagination {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: space-between;
	gap: calc(2 * var(--default-grid-baseline)) calc(4 * var(--default-grid-baseline));
	padding-block: calc(3 * var(--default-grid-baseline));
	font-family: var(--pagination-font-family, inherit);
	font-size: var(--pagination-font-size, inherit);
	line-height: var(--pagination-line-height, inherit);
}

// The info and the end share the space left of and right of the page buttons
// equally, so the buttons stay centered whatever the two sides hold
.ncPagination__info {
	flex: 1 1 0;
	color: var(--color-text-maxcontrast);
	white-space: nowrap;
}

.ncPagination__nav {
	display: flex;
	flex: 0 1 auto;
	align-items: center;
	justify-content: center;
	gap: var(--pagination-gap, calc(2 * var(--default-grid-baseline)));
}

.ncPagination__pages {
	display: flex;
	align-items: center;
	gap: var(--pagination-gap, calc(2 * var(--default-grid-baseline)));
	margin: 0;
	padding: 0;
	list-style: none;
}

.ncPagination__end {
	display: flex;
	flex: 1 1 0;
	justify-content: flex-end;
}

.ncPagination__ellipsis {
	display: inline-block;
	min-width: var(--default-clickable-area);
	color: var(--pagination-ellipses-color, var(--color-text-maxcontrast));
	text-align: center;
}

// Theming tokens on the NcButtons. Every fallback is the value NcButton itself uses,
// so an unset token renders exactly as a plain NcButton. The two ancestor classes
// outrank NcButton's own scoped rules without `!important`.
.ncPagination .ncPagination__nav {
	// NcButton's label reads --font-weight-element; capture it here, as redeclaring
	// it on the button with itself as the fallback would be a cycle
	--pagination-default-font-weight: var(--font-weight-element, bold);

	.ncPagination__relativeLink:global(.button-vue) {
		// An icon-only NcButton is exactly --button-size wide, so the block size sets both
		--button-size: var(--pagination-relative-link-min-block-size, var(--default-clickable-area));
		min-width: var(--pagination-relative-link-min-inline-size, var(--button-size));
		padding-block: var(--pagination-relative-link-padding-block-start, 1px) var(--pagination-relative-link-padding-block-end, 0);
		padding-inline: var(--pagination-relative-link-padding-inline-start, var(--button-padding)) var(--pagination-relative-link-padding-inline-end, var(--button-padding));
		color: var(--pagination-relative-link-color, var(--color-main-text));
		background-color: var(--pagination-relative-link-background-color, transparent);
		border-color: var(--pagination-relative-link-border-color, transparent);
		// Corners only: NcButton derives its padding from --button-radius, so the token must not set that
		border-radius: var(--pagination-relative-link-border-radius, var(--button-radius));
		border-width: var(--pagination-relative-link-border-width, 1px 1px 2px);
		text-decoration: var(--pagination-relative-link-text-decoration, none);

		&:focus:not(:disabled) {
			color: var(--pagination-relative-link-focus-color, var(--pagination-relative-link-color, var(--color-main-text)));
			background-color: var(--pagination-relative-link-focus-background-color, var(--pagination-relative-link-background-color, transparent));
		}

		&:focus-visible:not(:disabled) {
			color: var(--pagination-relative-link-focus-visible-color, var(--pagination-relative-link-focus-color, var(--pagination-relative-link-color, var(--color-main-text))));
			background-color: var(--pagination-relative-link-focus-visible-background-color, var(--pagination-relative-link-focus-background-color, var(--pagination-relative-link-background-color, transparent)));
		}

		&:hover:not(:disabled) {
			color: var(--pagination-relative-link-hover-color, var(--pagination-relative-link-color, var(--color-main-text)));
			background-color: var(--pagination-relative-link-hover-background-color, color-mix(in srgb, var(--color-primary-element) 8%, transparent));
			border-color: var(--pagination-relative-link-hover-border-color, var(--pagination-relative-link-border-color, transparent));
		}

		&:global(.button-vue--legacy34):hover:not(:disabled) {
			background-color: var(--pagination-relative-link-hover-background-color, var(--color-background-hover));
		}

		&:disabled {
			color: var(--pagination-relative-link-disabled-color, var(--pagination-relative-link-color, var(--color-main-text)));
			background-color: var(--pagination-relative-link-disabled-background-color, var(--pagination-relative-link-background-color, transparent));
			text-decoration: var(--pagination-relative-link-disabled-text-decoration, var(--pagination-relative-link-text-decoration, none));
			opacity: var(--pagination-relative-link-disabled-opacity, 0.5);
			filter: var(--pagination-relative-link-disabled-filter, saturate(0.7));
		}
	}

	.ncPagination__pageLink:global(.button-vue) {
		--font-weight-element: var(--pagination-page-link-font-weight, var(--pagination-default-font-weight));
		min-width: var(--pagination-page-link-min-inline-size, var(--button-size));
		min-height: var(--pagination-page-link-min-block-size, var(--button-size));
		padding-block: var(--pagination-page-link-padding-block-start, 1px) var(--pagination-page-link-padding-block-end, 0);
		padding-inline: var(--pagination-page-link-padding-inline-start, var(--button-padding)) var(--pagination-page-link-padding-inline-end, var(--button-padding));
		font-family: var(--pagination-page-link-font-family, inherit);
		font-size: var(--pagination-page-link-font-size, var(--default-font-size));
		color: var(--pagination-page-link-color, var(--color-main-text));
		background-color: var(--pagination-page-link-background-color, transparent);
		border-color: var(--pagination-page-link-border-color, transparent);
		// Corners only: NcButton derives its padding from --button-radius, so the token must not set that
		border-radius: var(--pagination-page-link-border-radius, var(--button-radius));
		border-width: var(--pagination-page-link-border-width, 1px 1px 2px);
		text-decoration: var(--pagination-page-link-text-decoration, none);

		&:hover:not(:disabled) {
			color: var(--pagination-page-link-hover-color, var(--pagination-page-link-color, var(--color-main-text)));
			background-color: var(--pagination-page-link-hover-background-color, color-mix(in srgb, var(--color-primary-element) 8%, transparent));
			border-color: var(--pagination-page-link-hover-border-color, var(--pagination-page-link-border-color, transparent));
		}

		&:global(.button-vue--legacy34):hover:not(:disabled) {
			background-color: var(--pagination-page-link-hover-background-color, var(--color-background-hover));
		}

		// The current page is a tertiary NcButton painted here, not a primary one, so
		// a theme that restyles every primary button cannot override these tokens
		&[aria-current='page'] {
			--font-weight-element: var(--pagination-page-link-current-font-weight, var(--pagination-page-link-font-weight, var(--pagination-default-font-weight)));
			color: var(--pagination-page-link-current-color, var(--color-primary-element-text));
			background-color: var(--pagination-page-link-current-background-color, var(--color-primary-element));
			border-color: var(--pagination-page-link-current-border-color, var(--color-primary-element-hover));
			text-decoration: var(--pagination-page-link-current-text-decoration, var(--pagination-page-link-text-decoration, none));

			&:hover:not(:disabled) {
				color: var(--pagination-page-link-current-color, var(--color-primary-element-text));
				background-color: var(--pagination-page-link-current-background-color, var(--color-primary-element-hover));
				border-color: var(--pagination-page-link-current-border-color, var(--color-primary-element-hover));
			}
		}
	}
}

// NcSelect sets a 260px min-width on `.nc-select.v-select.select`, too wide for a page size
.ncPagination__pageSize:global(.nc-select.v-select.select) {
	min-width: calc(5 * var(--default-clickable-area));
	margin: 0;
}

.ncPagination_compact {
	flex-wrap: nowrap;

	.ncPagination__info {
		font-size: var(--font-size-small);
	}

	.ncPagination__nav {
		flex-grow: 0;
	}
}
</style>
