<template>
	<div v-if="tradingStore.selectedTradings.length" class="relative overflow-x-auto shadow-md sm:rounded-lg mt-6">
		<table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
			<thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
			<tr>
				<th class="px-6 py-3">
					<span class="sr-only">Icon</span>
				</th>
				<th class="px-6 py-3">Name</th>
				<th class="px-6 py-3">Price</th>
				<th class="px-6 py-3">24h Change</th>
			</tr>
			</thead>
			<tbody>
			<tr
				v-for="pair in tradingStore.selectedTradings"
				:key="pair.symbol"
				class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
			>
				<td class="px-6 py-4">
					<coin-icon />
				</td>
				<td class="px-6 py-4 font-medium text-gray-900 dark:text-white">
					{{ pair.name }}
				</td>
				<td class="px-6 py-4">
					{{ tradingStore.liveTicker[pair.symbol]?.price?.toFixed(4) || '—' }}
				</td>
				<td class="px-6 py-4"
					:class="{
            'text-green-500': tradingStore.liveTicker[pair.symbol]?.priceChangePercent > 0,
            'text-red-500': tradingStore.liveTicker[pair.symbol]?.priceChangePercent < 0
          }"
				>
					{{ tradingStore.liveTicker[pair.symbol]?.priceChangePercent?.toFixed(2) || '—' }}%
				</td>
			</tr>
			</tbody>
		</table>
	</div>
</template>

<script setup lang="ts">
import { useTradingStore } from '~/stores/trading';
import { connect, subscribe, unsubscribe, disconnect } from '~/utils/socketManager';

const tradingStore = useTradingStore();

watch(
	() => tradingStore.selectedTradings,
	(newVal, oldVal) => {
		const newSymbols = newVal.map(t => t.symbol);
		const oldSymbols = oldVal?.map(t => t.symbol) || [];

		const addedList = newSymbols.filter(s => !oldSymbols.includes(s));
		const removedList = oldSymbols.filter(s => !newSymbols.includes(s));

		if (newSymbols.length && !oldSymbols.length) {
			connect(() => {
			});
		}

		if (!newSymbols.length && oldSymbols.length) {
			disconnect();
		}

		for (const item of addedList) subscribe(item);
		for (const item of removedList) unsubscribe(item);
	},
	{ immediate: true, deep: true }
);

onUnmounted(() => {
	disconnect();
})
</script>

<style scoped>

</style>
