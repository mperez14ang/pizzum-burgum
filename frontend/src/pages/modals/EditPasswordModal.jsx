import React, {useState} from 'react';
import {Modal} from "../../components/common/Modal.jsx";

export const EditPasswordModal = ({ isOpen, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        password: '',
        repeatPassword: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Cambiar Contraseña"
            size="md"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="label" className="block text-sm font-medium text-gray-700 mb-1">
                        Nueva Contraseña *
                    </label>
                    <input
                        type="text"
                        id="label"
                        name="label"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="label" className="block text-sm font-medium text-gray-700 mb-1">
                        Repetir Contraseña *
                    </label>
                    <input
                        type="text"
                        id="label"
                        name="label"
                        value={formData.repeatPassword}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors flex items-center justify-center"
                >
                    Cambiar Contraseña
                </button>

            </form>
        </Modal>
    );
};