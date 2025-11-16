import {Modal} from "../../components/common/Modal.jsx";

export const ConfirmationModal = ({
                                      isOpen,
                                      onClose,
                                      onAccept,
                                      title,
                                      message,
                                      acceptTxt = 'Aceptar',
                                      acceptType = 'normal', // 'normal', 'danger'
                                      cancelText = 'Cancelar'
                                  }) => {
    const handleAccept = () => {
        onAccept();
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            size="sm"
        >
            <div className="space-y-6">
                <p className="text-gray-700 text-base leading-relaxed">
                    {message}
                </p>

                <div className="flex gap-3 justify-end pt-4">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={handleAccept}
                        className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${
                            acceptType === 'danger'
                                ? 'bg-red-600 text-white hover:bg-red-700'
                                : 'bg-orange-500 text-white hover:bg-orange-700'
                        }`}
                    >
                        {acceptTxt}
                    </button>
                </div>
            </div>
        </Modal>
    );
};