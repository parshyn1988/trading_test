import { defineStore } from 'pinia';
import type { SymbolInfo, ExchangeInfoResponse } from '~/types/trading';

export const useTradingStore = defineStore('trading', () => {
  const tradings = ref<SymbolInfo[] | undefined>([]);
  const selectedTradings = ref<SymbolInfo[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  let isRestoredFromStorage: boolean = false;

  const fetchTradings = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      const { data } = await useFetch<ExchangeInfoResponse>('https://api.binance.com/api/v3/exchangeInfo');

      tradings.value = data.value?.symbols.map((s: any) => ({
        symbol: s.symbol,
        name:`${s.baseAsset} / ${s.quoteAsset}`,
      }));

      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('selected-trading');

        if (stored) {
          const symbols: string[] = JSON.parse(stored);
          selectedTradings.value = (tradings.value ?? []).filter(t => symbols.includes(t.symbol));
        }
      }

      isRestoredFromStorage = true;

    } catch (error: any) {
      error.value = error.message || 'Something went wrong during fetching data';
    } finally {
      isLoading.value = false;
    }
  }

  if (typeof window !== 'undefined') {
    watch(selectedTradings, (value) => {
      if (!isRestoredFromStorage) return;
        const symbols = value.map((s) => s.symbol);
        localStorage.setItem('selected-trading', JSON.stringify(symbols));
    }, {
      deep: true,
    });
  }

  const liveTicker = ref<Record<string, {
    price: number
    priceChangePercent: number
  }>>({});
  function updateTicker(symbol: string, data: { price: number, priceChangePercent: number }) {
    liveTicker.value[symbol] = data;
  }

  return {
    tradings,
    selectedTradings,
    isLoading,
    fetchTradings,
    liveTicker,
    updateTicker,
  }
});
