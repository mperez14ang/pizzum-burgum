import React, { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Modal } from "../../components/common/Modal.jsx";
import { useAuth } from "../../contexts/AuthContext.jsx";
import toast from "react-hot-toast";

export const EditPasswordModal = ({ isOpen, onSave, onClose }) => {
    const { user, changePassword } = useAuth();

    // Utilizamos optional chaining para acceder a user.email de forma segura
    const initialFormData = {
        email: user?.email || '',
        password: '',
        newPassword: '',
        repeatPassword: ''
    };

    const [formData, setFormData] = useState(initialFormData);
    const [isLoading, setIsLoading] = useState(false);

    const [showPassword, setShowPassword] = useState({
        password: false,
        newPassword: false,
        repeatPassword: false
    });

    // Limpiar el formulario cuando se cierra el modal
    useEffect(() => {
        if (!isOpen) {
            // Actualizar initialFormData aquí para reflejar el estado actual del usuario si ha cambiado
            const resetFormData = {
                email: user?.email || '',
                password: '',
                newPassword: '',
                repeatPassword: ''
            };

            setFormData(resetFormData);
            setShowPassword({
                password: false,
                newPassword: false,
                repeatPassword: false
            });
            setIsLoading(false);
        } else {
            // Asegurar que el email se actualice si el modal se abre y el usuario existe
            setFormData(prev => ({
                ...prev,
                email: user?.email || ''
            }));
        }
    }, [isOpen, user?.email]); // Dependencia user?.email para re-establecer el email si cambia

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const toggleShowPassword = (field) => {
        setShowPassword(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await changePassword(
                formData.email,
                formData.password,
                formData.newPassword,
                formData.repeatPassword
            );

            if (response.success) {
                toast.success("Contraseña cambiada");
                onSave();
                onClose();
                return;
            }
            toast.error(response.error);
        } catch (error) {
            toast.error("Error al cambiar la contraseña");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Cambiar Contraseña"
            size="md"
        >
            {/* Guard against null user if the modal is open before user data loads */}
            {!user && isOpen ? (
                <div className="text-center py-4 text-gray-500">Cargando información de usuario...</div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* El campo email solo se muestra si user.email no existe.
                        Si user es null, user.email es undefined, pero !user.email no es suficiente.
                        Necesitamos el check: !user?.email, y el valor del input debe usar formData.email,
                        que ya se inicializa con user?.email.
                    */}
                    {!user?.email && (
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email *
                            </label>
                            <div className="relative">
                                <input
                                    id="email"
                                    name="email"
                                    type="email" // Aseguramos el tipo de campo
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 pr-4" // Removí pr-10 innecesario
                                    required
                                    disabled={isLoading}
                                />
                                {/* El botón de mostrar/ocultar contraseña no tiene sentido en el campo de email */}
                            </div>
                        </div>
                    )}

                    {/* Contraseña antigua */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Contraseña *
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword.password ? "text" : "password"}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 pr-10"
                                required
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                onClick={() => toggleShowPassword("password")}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                disabled={isLoading}
                            >
                                {!showPassword.password ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Nueva contraseña */}
                    <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                            Nueva Contraseña *
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword.newPassword ? "text" : "password"}
                                id="newPassword"
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 pr-10"
                                required
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                onClick={() => toggleShowPassword("newPassword")}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                disabled={isLoading}
                            >
                                {!showPassword.newPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Repetir contraseña */}
                    <div>
                        <label htmlFor="repeatPassword" className="block text-sm font-medium text-gray-700 mb-1">
                            Repetir Contraseña *
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword.repeatPassword ? "text" : "password"}
                                id="repeatPassword"
                                name="repeatPassword"
                                value={formData.repeatPassword}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 pr-10"
                                required
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                onClick={() => toggleShowPassword("repeatPassword")}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                disabled={isLoading}
                            >
                                {!showPassword.repeatPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Botón principal */}
                    <button
                        type="submit"
                        className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Cambiando...' : 'Cambiar Contraseña'}
                    </button>
                </form>
            )}
        </Modal>
    );
};