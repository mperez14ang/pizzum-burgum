import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Loading } from "./Loading.jsx";

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
    const [showContent, setShowContent] = useState(false);

    // Mostrar contenido solo cuando el modal está abierto
    useEffect(() => {
        if (isOpen) {
            setShowContent(true);
        } else {
            // Limpiar contenido al cerrar
            setShowContent(false);
        }
    }, [isOpen]);

    // Cerrar con tecla ESC
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) onClose();
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
        <div className="flex-1 overflow-y-auto px-6 py-6">
            {loading ? (
                <Loading size="lg" text={loadingText} />
            ) : (
                showContent && children
            )}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            <div className={`relative w-full ${sizes[size]} bg-white rounded-2xl shadow-2xl max-h-[90vh] flex flex-col`}>
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
