<template>
	<div>
		<vue-select
			class="trading-pair-select"
			v-model="selected"
			:options="options"
			:loading="loading"
			label="name"
			multiple
			:placeholder="selected.length ? '' : 'Select trading pairs'"
		>
			<template #header>
				<div class="block text-sm font-medium mb-1 text-gray-900 dark:text-white">Select trading pairs:</div>
			</template>
			<template #option="option">
				<div class="flex items-center gap-2">
					<coin-icon />
					<span class="font-medium text-gray-900 dark:text-white">{{ option.name }}</span>
				</div>
			</template>

			<template #selected-option="option">
				<div class="flex items-center gap-2">
					<coin-icon />
					<span class="pr-1">{{ option.name }}</span>
				</div>
			</template>
		</vue-select>
	</div>
</template>

<script setup lang="ts">
import VueSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';
import { useTradingStore } from '~/stores/trading';
import CoinIcon from '~/components/CoinIcon.vue';

defineProps({
	options: { type: Array, default: () => [] },
});

const tradingStore = useTradingStore();

const selected = computed({
	get: () => tradingStore.selectedTradings,
	set: (val) =>tradingStore.selectedTradings = val,
});

const loading = computed(() => {
	return tradingStore.isLoading;
});
</script>

<style lang="scss">
.trading-pair-select {
	.vs__search::placeholder,
	.vs__dropdown-toggle,
	.vs__dropdown-menu,
	.vs__selected {
		@apply text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400;
	}

	.vs__dropdown-toggle {
		@apply h-12 sm:rounded-lg;
	}

	.vs__selected {
		@apply border-white px-2;
	}

	.vs__deselect svg,
	.vs__actions svg {
		@apply fill-gray-800 dark:fill-white;
	}
}
</style>
