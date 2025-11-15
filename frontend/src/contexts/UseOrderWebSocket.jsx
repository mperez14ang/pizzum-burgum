import { useEffect, useRef, useState } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useAuth } from './AuthContext.jsx';
import { API_URL } from "../utils/StringUtils.jsx";

export const UseOrderWebSocket = (orderId = null, onOrderUpdate, enabled = true) => {
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState(null);
    const clientRef = useRef(null);
    const subscriptionRef = useRef(null);
    const orderIdRef = useRef(orderId);
    const { user } = useAuth();

    const callbackRef = useRef(onOrderUpdate);
    useEffect(() => {
        callbackRef.current = onOrderUpdate;
    }, [onOrderUpdate]);

    // Keep orderIdRef in sync
    useEffect(() => {
        orderIdRef.current = orderId;
    }, [orderId]);

    // Handle subscription changes when orderId changes
    useEffect(() => {
        const client = clientRef.current;
        if (!client || !isConnected || !enabled) return;

        // Desuscribir del socket
        if (subscriptionRef.current) {
            subscriptionRef.current.unsubscribe();
            subscriptionRef.current = null;
        }

        // Subscribe to new topic
        const destination = orderId
            ? `/topic/order/${orderId}`
            : '/topic/orders';

        try {
            subscriptionRef.current = client.subscribe(destination, (message) => {
                try {
                    const update = JSON.parse(message.body);
                    callbackRef.current?.(update);
                } catch (err) {
                    console.error('(UseOrderWebSocket) Error parseando mensaje:', err);
                }
            });
        } catch (err) {
            console.error('(UseOrderWebSocket) Error suscribiendo:', err);
            setError('Error al suscribirse');
        }

        return () => {
            if (subscriptionRef.current) {
                subscriptionRef.current.unsubscribe();
                subscriptionRef.current = null;
            }
        };
    }, [orderId, isConnected, enabled]);

    // Manage WebSocket client lifecycle
    useEffect(() => {
        if (!enabled || !user?.token) {
            if (clientRef.current) {
                if (subscriptionRef.current) {
                    subscriptionRef.current.unsubscribe();
                    subscriptionRef.current = null;
                }
                clientRef.current.deactivate();
                clientRef.current = null;
                setIsConnected(false);
            }
            return;
        }

        // Crear cliente una sola vez
        if (!clientRef.current) {

            const client = new Client({
                webSocketFactory: () => new SockJS(`${API_URL}/ws`),
                connectHeaders: {
                    Authorization: `Bearer ${user.token}`,
                },
                reconnectDelay: 5000,
                heartbeatIncoming: 4000,
                heartbeatOutgoing: 4000,

                onConnect: () => {
                    setIsConnected(true);
                    setError(null);

                    // Subscribe immediately on connect
                    const destination = orderIdRef.current
                        ? `/topic/order/${orderIdRef.current}`
                        : '/topic/orders';

                    try {
                        subscriptionRef.current = client.subscribe(destination, (message) => {
                            try {
                                const update = JSON.parse(message.body);
                                callbackRef.current?.(update);
                            } catch (err) {
                                console.error('(UseOrderWebSocket) Error parseando mensaje:', err);
                            }
                        });
                    } catch (err) {
                        console.error('(UseOrderWebSocket) Error en suscripción inicial:', err);
                        setError('Error al suscribirse');
                    }
                },

                onDisconnect: () => {
                    setIsConnected(false);
                    subscriptionRef.current = null;
                },

                onStompError: (frame) => {
                    console.error('(UseOrderWebSocket) Error STOMP:', frame);
                    setError(frame.headers?.message || 'Error de conexión');
                    setIsConnected(false);
                },
            });

            clientRef.current = client;
            client.activate();
        }

        return () => {
            if (subscriptionRef.current) {
                subscriptionRef.current.unsubscribe();
                subscriptionRef.current = null;
            }
            if (clientRef.current) {
                clientRef.current.deactivate();
                clientRef.current = null;
            }
        };
    }, [enabled, user?.token]);

    return { isConnected, error };
};