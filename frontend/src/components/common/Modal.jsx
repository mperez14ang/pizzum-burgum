import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { Loading } from "./Loading.jsx";

let activeModals = 0;
let savedScrollY = 0;
let modalStack = []; // Stack para rastrear el orden de los modales

export const Modal = ({
                          isOpen,
                          onClose,
                          title,
                          children,
                          size = 'md',
                          loading = false,
                          loadingText = "cargando...",
                          drawAsComponent = false
                      }) => {
    const modalId = useRef(Math.random().toString(36)); // ID único para cada modal

    useEffect(() => {
        if (isOpen) {
            activeModals++;
            modalStack.push(modalId.current);

            if (activeModals === 1) {
                savedScrollY = window.scrollY;
                document.body.style.overflow = 'hidden';
                document.body.style.position = 'fixed';
                document.body.style.top = `-${savedScrollY}px`;
                document.body.style.width = '100%';
            }

            return () => {
                activeModals--;
                modalStack = modalStack.filter(id => id !== modalId.current);

                if (activeModals === 0) {
                    document.body.style.overflow = '';
                    document.body.style.position = '';
                    document.body.style.top = '';
                    document.body.style.width = '';
                    window.scrollTo(0, savedScrollY);
                }
            };
        }
    }, [isOpen]);

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                const isTopModal = modalStack[modalStack.length - 1] === modalId.current;
                if (isTopModal) {
                    onClose();
                }
            }
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const sizes = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl'
    };

    const body = () => (
        <div className="flex-1 min-h-0 overflow-auto px-6 py-6">
            {loading
                ? <Loading size="lg" text={loadingText} />
                : children
            }
        </div>
    );

    if (drawAsComponent) return body();

    const closeButton = () => (
        <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded"
        >
            <X className="w-5 h-5" />
        </button>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden">
            <div
                className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            <div className={`relative w-full ${sizes[size]} bg-white rounded-2xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden min-w-[320px]`}>
                {title ? (
                    <div className="flex-none bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                        <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
                        {closeButton()}
                    </div>
                ) : (
                    <div className="flex justify-end p-4">{closeButton()}</div>
                )}

                {body()}
            </div>
        </div>
    );
};