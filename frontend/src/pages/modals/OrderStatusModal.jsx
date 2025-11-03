import React, { useMemo } from 'react';
import { Modal } from '../../components/common/Modal.jsx';

// Order status modal showing a progress bar for the order lifecycle
// States (in Spanish UI order):
// 0: Pago, 1: En espera, 2: En cola, 3: En preparación, 4: En camino, 5: Entregado, (Cancelado = special)
// Backend enum examples (OrderState): UNPAID, ON_HOLD, IN_QUEUE, MAKING, DELIVERING, DELIVERED, CANCELLED

export const OrderStatusModal = ({
  isOpen,
  onClose,
  order,
  title = 'Estado del pedido'
}) => {
  // Labels for UI
  const LABELS = ['Pago', 'En espera', 'En cola', 'En preparación', 'En camino', 'Entregado'];

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
    if (!order) return -1;
    const val = stateToIndex(order?.state);
    if (val === 'CANCELLED') return 'CANCELLED';
    // If it's any state other than UNPAID, we assume payment done at least
    if (val >= 0) return val; // already mapped including paid progression
    return -1;
  }, [order]);

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
        <div>
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
                      className="absolute -translate-x-1/2 text-xs text-gray-700 whitespace-nowrap"
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
      <div className="mt-8 flex justify-end">
        <button
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
        >
          Cerrar
        </button>
      </div>
    </Modal>
  );
};

export default OrderStatusModal;
