import { useState, useEffect, useCallback, useRef } from 'react';
import { SkinListing, ServerStatus, WebSocketMessage } from '../utils/types';
import { toast } from '@/components/ui/use-toast';

interface UseWebSocketProps {
  url?: string;
  autoConnect?: boolean;
}

interface UseWebSocketReturn {
  connect: (url: string) => void;
  disconnect: () => void;
  isConnected: boolean;
  serverStatus: ServerStatus;
  listings: SkinListing[];
  lastMessage: WebSocketMessage | null;
}

export function useWebSocket({ 
  url: initialUrl,
  autoConnect = false
}: UseWebSocketProps = {}): UseWebSocketReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [listings, setListings] = useState<SkinListing[]>([]);
  const [serverStatus, setServerStatus] = useState<ServerStatus>({
    online: false,
    lastUpdated: Date.now()
  });
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  
  const socketRef = useRef<WebSocket | null>(null);
  const urlRef = useRef<string | undefined>(initialUrl);

  const connect = useCallback((url: string) => {
    // Close existing connection if any
    if (socketRef.current) {
      socketRef.current.close();
    }

    try {
      const socket = new WebSocket(url);
      socketRef.current = socket;
      urlRef.current = url;

      socket.onopen = () => {
        setIsConnected(true);
        setServerStatus({
          online: true,
          lastUpdated: Date.now()
        });
        toast({
          title: "Connected",
          description: "WebSocket connection established",
        });
      };

      socket.onclose = () => {
        setIsConnected(false);
        setServerStatus({
          online: false,
          lastUpdated: Date.now()
        });
        toast({
          title: "Disconnected",
          description: "WebSocket connection closed",
          variant: "destructive"
        });
      };

      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        toast({
          title: "Connection Error",
          description: "Failed to establish WebSocket connection",
          variant: "destructive"
        });
      };

      socket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data) as WebSocketMessage;
          setLastMessage(message);

          switch (message.type) {
            case 'update': {
              const skinData = message.data as SkinListing;
              // Update existing listing or add new one
              setListings(prevListings => {
                const existingIndex = prevListings.findIndex(item => item.name === skinData.name);
                
                if (existingIndex >= 0) {
                  // Update existing listing
                  const updatedListings = [...prevListings];
                  updatedListings[existingIndex] = {
                    ...skinData,
                    timestamp: Date.now()
                  };
                  return updatedListings;
                } else {
                  // Add new listing
                  return [
                    ...prevListings,
                    {
                      ...skinData,
                      timestamp: Date.now()
                    }
                  ];
                }
              });
              break;
            }
              
            case 'status': {
              const status = message.data as ServerStatus;
              setServerStatus({
                ...status,
                lastUpdated: Date.now()
              });
              break;
            }
              
            case 'error': {
              const errorMessage = message.data as string;
              toast({
                title: "Server Error",
                description: errorMessage,
                variant: "destructive"
              });
              break;
            }
            
            default:
              console.warn('Unknown message type:', message);
          }
        } catch (error) {
          console.error('Error processing message:', error);
        }
      };
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      toast({
        title: "Connection Error",
        description: "Failed to create WebSocket connection",
        variant: "destructive"
      });
    }
  }, []);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }
  }, []);

  // Automatically connect if URL is provided and autoConnect is true
  useEffect(() => {
    if (autoConnect && initialUrl) {
      connect(initialUrl);
    }

    // Clean up on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [autoConnect, initialUrl, connect]);

  // Set server status as offline if no message received in 30 seconds
  useEffect(() => {
    const checkInterval = setInterval(() => {
      if (isConnected && Date.now() - serverStatus.lastUpdated > 30000) {
        setServerStatus({
          online: false,
          lastUpdated: serverStatus.lastUpdated
        });
      }
    }, 5000);

    return () => clearInterval(checkInterval);
  }, [isConnected, serverStatus]);

  // Add sample data
  useEffect(() => {
    if (!listings.length) {
      const sampleListing: SkinListing = {
        id: "sample-1",
        name: "PP-Bizon | Water Sigil (Factory New)",
        sticker: "compLexity Gaming | Katowice 2014",
        price: 207.20,
        marketLink: "https://steamcommunity.com/market/listings/730/PP-Bizon%20%7C%20Water%20Sigil%20%28Factory%20New%29?filter=%22compLexity%20Gaming%20Katowice%202014%22",
        timestamp: Date.now(),
        lastUpdated: Date.now()
      };
      setListings([sampleListing]);
    }
  }, [listings.length]);

  return {
    connect,
    disconnect,
    isConnected,
    serverStatus,
    listings,
    lastMessage
  };
}
