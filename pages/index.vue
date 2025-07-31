<template>
	<div class="p-4 min-h-screen bg-gray-50 dark:bg-gray-500">
		<trading-pair-select :options="tradings"></trading-pair-select>
		<trading-pair-table></trading-pair-table>
		<theme-switcher />
	</div>
</template>

<script setup lang="ts">
import { useTradingStore } from '~/stores/trading';
const { tradings, fetchTradings } = useTradingStore();

await fetchTradings();
</script>

<style scoped>

</style>
