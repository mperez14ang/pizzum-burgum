import { useEffect, useRef, useState } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useAuth } from './AuthContext.jsx';

export const useOrderWebSocket = (orderId = null, onOrderUpdate, enabled = true) => {
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState(null);
    const clientRef = useRef(null);
    const { user } = useAuth();

    const callbackRef = useRef(onOrderUpdate);
    useEffect(() => {
        callbackRef.current = onOrderUpdate;
    }, [onOrderUpdate]);

    useEffect(() => {
        if (!enabled || !user) return;
        if (clientRef.current) return;

        const client = new Client({
            webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
            connectHeaders: {
                Authorization: `Bearer ${user.token}`,
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,

            onConnect: () => {
                setIsConnected(true);
                setError(null);

                // suscribirse al topic
                const destination = orderId
                    ? `/topic/order/${orderId}`
                    : '/topic/orders';

                client.subscribe(destination, (message) => {
                    const update = JSON.parse(message.body);
                    callbackRef.current?.(update);
                });
            },

            onDisconnect: () => {
                setIsConnected(false);
            },

            onStompError: (frame) => {
                setError(frame.headers?.message || 'Error de conexión');
                setIsConnected(false);
            },
        });

        clientRef.current = client;
        client.activate();

        // cleanup al desmontar
        return () => {
            console.log('Desconectando WebSocket...');
            client.deactivate();
            clientRef.current = null;
        };
    }, [enabled, orderId, user?.token]);

    return { isConnected, error };
};
