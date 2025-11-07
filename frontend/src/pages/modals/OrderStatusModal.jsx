import React, { useEffect, useMemo, useState } from 'react';
import { Modal } from '../../components/common/Modal.jsx';
import { adminService } from '../../services/api.js';

// Order status modal showing a progress bar for the order lifecycle
// States (in Spanish UI order):
// 0: Pago, 1: En espera, 2: En cola, 3: En preparación, 4: En camino, 5: Entregado, (Cancelado = special)
// Backend enum examples (OrderState): UNPAID, ON_HOLD, IN_QUEUE, MAKING, DELIVERING, DELIVERED, CANCELLED

export const OrderStatusModal = ({
  isOpen,
  onClose,
  order,
  title = 'Estado del pedido',
  onOrderUpdated
}) => {
  // Labels for UI
  const LABELS = ['Pago', 'En espera', 'En cola', 'En preparación', 'En camino', 'Entregado'];

  const [localOrder, setLocalOrder] = useState(order);

  // Polling each 5 seconds while open to refresh order state
  useEffect(() => {
    let intervalId;
    let cancelled = false;

    const fetchLatest = async () => {
      try {
        if (!order?.id) return;
        const latest = await adminService.getOrder(order.id);
        if (cancelled) return;
        if (latest && latest.state && latest.state !== (localOrder?.state || order?.state)) {
          setLocalOrder(latest);
          if (typeof onOrderUpdated === 'function') {
            onOrderUpdated(latest);
          }
        }
      } catch (e) {
        // Silent fail; modal is read-only
        // console.error(e);
      }
    };

    if (isOpen && order?.id) {
      setLocalOrder(order);
      // initial fetch to avoid waiting 5s
      fetchLatest();
      intervalId = setInterval(fetchLatest, 5000);
    }

    return () => {
      cancelled = true;
      if (intervalId) clearInterval(intervalId);
    };
  }, [isOpen, order?.id, localOrder?.state]);

  // Map backend state to progress index (k)
  // -1 means nothing filled (UNPAID)
  // 0..5 are the corresponding indices above
  const stateToIndex = (state) => {
    if (!state) return -1;
    const s = String(state).toUpperCase();
    if (s === 'CANCELLED') return 'CANCELLED';
    if (s === 'UNPAID') return -1;
    if (s === 'ON_HOLD') return 1;
    if (s === 'IN_QUEUE') return 2;
    if (s === 'MAKING') return 3;
    if (s === 'DELIVERING') return 4;
    if (s === 'DELIVERED') return 5;
    // If an unknown paid state arrives, assume at least paid
    return 0;
  };

  // Decide current index from order
  const currentIndex = useMemo(() => {
    const src = localOrder || order;
    if (!src) return -1;
    const val = stateToIndex(src?.state);
    if (val === 'CANCELLED') return 'CANCELLED';
    // If it's any state other than UNPAID, we assume payment done at least
    if (val >= 0) return val; // already mapped including paid progression
    return -1;
  }, [localOrder, order]);

  // Special spacing rule: distance between Pago (0) and En espera (1) is HALF the rest
  // Compute tick positions in % along the bar length
  const tickPositions = useMemo(() => {
    const d = 100 / 4.5; // normal gap size
    return [0, d / 2, d / 2 + d, d / 2 + 2 * d, d / 2 + 3 * d, 100];
  }, []);

  // Compute fill percentage
  const fillPercent = useMemo(() => {
    if (currentIndex === 'CANCELLED') return 100;
    if (currentIndex == null || currentIndex < 0) return 0; // UNPAID
    return tickPositions[Math.min(currentIndex, tickPositions.length - 1)];
  }, [currentIndex, tickPositions]);

  const cancelled = currentIndex === 'CANCELLED';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="lg">
      {!order ? (
        <div className="text-gray-600">No se encontró información del pedido.</div>
      ) : (
        <div className="px-2 sm:px-4">{/* extra horizontal padding */}
          {/* Header with order basic info if available */}
          {(order?.id || order?.code) && (
            <div className="mb-4 text-sm text-gray-600">Pedido #{order?.code ?? order?.id}</div>
          )}

          {/* Progress bar area */}
          <div className="w-full">
            {/* Cancelled state: full red bar and message */}
            {cancelled ? (
              <div className="text-center">
                <div className="relative h-3 w-full bg-red-500 rounded-full" />
                <div className="mt-3 text-red-600 font-semibold">Cancelado! :(</div>
              </div>
            ) : (
              <div>
                <div className="relative h-3 w-full bg-gray-200 rounded-full overflow-visible">
                  {/* Filled part */}
                  <div
                    className="h-3 bg-green-500 rounded-full transition-all duration-500"
                    style={{ width: `${fillPercent}%` }}
                  />

                  {/* Tick marks */}
                  {tickPositions.map((pos, idx) => (
                    <div
                      key={idx}
                      className="absolute top-1/2 -translate-y-1/2"
                      style={{ left: `calc(${pos}% - 1px)` }}
                    >
                      <div className="w-0.5 h-5 bg-gray-400 translate-y-[-6px]" />
                    </div>
                  ))}
                </div>

                {/* Labels */}
                <div className="relative mt-4">
                  {LABELS.map((label, idx) => (
                    <div
                      key={label}
                      className="absolute -translate-x-1/2 text-xs text-gray-700 whitespace-nowrap px-1 text-center"
                      style={{ left: `${tickPositions[idx]}%` }}
                    >
                      {label}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-8 flex justify-end px-2 sm:px-4">{/* match extra padding */}
        <button
          onClick={() => {
            if (typeof onOrderUpdated === 'function' && (localOrder || order)) {
              onOrderUpdated(localOrder || order);
            }
            onClose();
          }}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
        >
          Cerrar
        </button>
      </div>
    </Modal>
  );
};

export default OrderStatusModal;
