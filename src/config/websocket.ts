
interface WebSocketConfig {
  useLocalWebSocket: boolean;
  localWebSocketUrl: string;
  productionWebSocketUrl: string;
}

export const websocketConfig: WebSocketConfig = {
  useLocalWebSocket: true, // Set to false for production
  localWebSocketUrl: 'ws://localhost:8080', // Update with your local WebSocket URL
  productionWebSocketUrl: 'wss://your-production-url.com', // Update with your production WebSocket URL
};

export const getWebSocketUrl = () => {
  return websocketConfig.useLocalWebSocket 
    ? websocketConfig.localWebSocketUrl 
    : websocketConfig.productionWebSocketUrl;
};
