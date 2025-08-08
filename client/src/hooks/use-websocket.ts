import { useState, useEffect, useRef } from 'react';

export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected';

interface WebSocketMessage {
  type: string;
  payload: any;
  userId?: string;
}

export function useWebSocket() {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const ws = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  const connect = () => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      return;
    }

    setConnectionStatus('connecting');
    
    // Use the current domain for WebSocket connection with specific path
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws/api`;
    
    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      setConnectionStatus('connected');
      console.log('WebSocket connected');
      
      // Register user for targeted messages
      if (ws.current) {
        ws.current.send(JSON.stringify({
          type: 'register',
          userId: 'demo-user' // In real app, get from auth context
        }));
      }
    };

    ws.current.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        setLastMessage(message);
        console.log('WebSocket message received:', message);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    ws.current.onclose = () => {
      setConnectionStatus('disconnected');
      console.log('WebSocket disconnected');
      
      // Attempt to reconnect after 3 seconds
      reconnectTimeoutRef.current = setTimeout(() => {
        connect();
      }, 3000);
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      setConnectionStatus('disconnected');
    };
  };

  const disconnect = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    
    if (ws.current) {
      ws.current.close();
      ws.current = null;
    }
    
    setConnectionStatus('disconnected');
  };

  const sendMessage = (message: WebSocketMessage) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket not connected, cannot send message');
    }
  };

  useEffect(() => {
    connect();
    
    return () => {
      disconnect();
    };
  }, []);

  // Keep connection alive with ping/pong
  useEffect(() => {
    if (connectionStatus === 'connected') {
      const pingInterval = setInterval(() => {
        sendMessage({ type: 'ping', payload: {} });
      }, 30000); // Ping every 30 seconds

      return () => clearInterval(pingInterval);
    }
  }, [connectionStatus]);

  return {
    connectionStatus,
    lastMessage,
    sendMessage,
    connect,
    disconnect
  };
}
