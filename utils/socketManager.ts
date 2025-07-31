import { useTradingStore } from '~/stores/trading';

const BASE_URL = 'wss://stream.binance.com:9443/stream';
let socket: WebSocket | null = null;
let subscribedSymbols: Set<string> = new Set();
let pendingSubscriptions: string[] = [];

let messageHandler: ((msg: any) => void) | null = null;

export function connect(onMessage: (msg: any) => void) {
  if (socket) return;

  socket = new WebSocket(BASE_URL);

  socket.onopen = () => {
    // console.log('[WS] Connected');
    pendingSubscriptions.forEach(subscribeSymbol);
    pendingSubscriptions = [];
  };

  socket.onmessage = (event: any) => {
    const msg = JSON.parse(event.data);
    const store = useTradingStore();

    if (msg.stream && msg.data) {
      const symbol = msg.data.s;
      const price = parseFloat(msg.data.c);
      const priceChangePercent = parseFloat(msg.data.P);
      store.updateTicker(symbol, { price, priceChangePercent });
    }

    messageHandler?.(msg);
    onMessage?.(msg);
  };

  socket.onclose = () => {
    // console.log('[WS] Disconnected');
    socket = null;
    subscribedSymbols.clear();
  };

  messageHandler = onMessage;
}

function subscribeSymbol(symbol: string) {
  const stream = `${symbol.toLowerCase()}@ticker`;
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    pendingSubscriptions.push(symbol);
    return;
  }

  if (subscribedSymbols.has(symbol)) return;

  socket.send(JSON.stringify({
    method: 'SUBSCRIBE',
    params: [stream],
    id: Date.now()
  }));

  subscribedSymbols.add(symbol);
  // console.log('[WS] Subscribed to', symbol);
}

export function subscribe(symbol: string) {
  subscribeSymbol(symbol);
}

export function unsubscribe(symbol: string) {
  if (!socket || socket.readyState !== WebSocket.OPEN || !subscribedSymbols.has(symbol)) return;

  const stream = `${symbol.toLowerCase()}@ticker`;
  socket.send(JSON.stringify({
    method: 'UNSUBSCRIBE',
    params: [stream],
    id: Date.now()
  }));

  subscribedSymbols.delete(symbol);
  // console.log('[WS] Unsubscribed from', symbol);
}

export function disconnect() {
  if (socket) {
    socket.close();
    socket = null;
    subscribedSymbols.clear();
  }
}
