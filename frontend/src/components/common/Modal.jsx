import { useEffect } from 'react';

export const Modal = ({
                          isOpen,
                          onClose,
                          title,
                          children,
                          size = 'md',
                          pages = []
                      }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const sizes = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl'
    };

    const modalBody = (page) => (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex-none bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                    X
                </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-8 space-y-4">
                {page.content}
            </div>
        </div>
    );


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Fondo transparente con leve blur */}
            <div
                className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            {/* Contenedor de modales */}
            <div className="relative flex flex-row justify-center items-start gap-6 max-w-4xl">
                {pages.map((page) => (
                    <div
                        key={page.type}
                        className="flex-none relative rounded-2xl shadow-2xl border border-gray-100 bg-gradient-to-br from-gray-100 via-white to-gray-200"
                        style={{ width: '400px', height: 'fit-content', maxHeight: '90vh' }}
                    >
                        {modalBody(page)}
                    </div>
                ))}
            </div>
        </div>
    );
    }
