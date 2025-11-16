import { createContext, useContext, useState, useCallback } from "react";
import { ConfirmationModal } from "../pages/modals/ConfirmationModal.jsx";

const ConfirmContext = createContext();

export function ConfirmProvider({ children }) {
    const [options, setOptions] = useState(null);

    const confirm = useCallback((input) => {
        return new Promise(resolve => {

            // Si te pasan un string → convertirlo a opciones estándar
            let opts = {};

            if (typeof input === "string") {
                opts = {
                    title: "Confirmación",
                    message: input,
                    acceptText: "Aceptar",
                    cancelText: "Cancelar",
                    type: "default"
                };
            } else {
                // Es un objeto → usarlo tal cual
                opts = {
                    title: input.title || "Confirmación",
                    message: input.message || "",
                    acceptText: input.acceptText || "Aceptar",
                    cancelText: input.cancelText || "Cancelar",
                    type: input.type || "default"
                };
            }

            setOptions({
                ...opts,
                onAccept: () => {
                    resolve(true);
                    setOptions(null);
                },
                onCancel: () => {
                    resolve(false);
                    setOptions(null);
                }
            });
        });
    }, []);

    return (
        <ConfirmContext.Provider value={confirm}>
            {children}

            {options && (
                <ConfirmationModal
                    isOpen={true}
                    title={options.title}
                    message={options.message}
                    acceptTxt={options.acceptText}
                    cancelText={options.cancelText}
                    acceptType={options.type}
                    onAccept={options.onAccept}
                    onClose={options.onCancel}
                />
            )}
        </ConfirmContext.Provider>
    );
}

export function useConfirm() {
    return useContext(ConfirmContext);
}
