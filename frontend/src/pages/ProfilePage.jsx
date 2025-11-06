import React, {useState} from 'react';
import {ChevronLeft, KeyRound} from 'lucide-react';
import {EditPasswordModal} from "./modals/EditPasswordModal.jsx";
import {AddressComponent} from "../components/AddressComponent.jsx";
import {CardComponent} from "../components/CardComponent.jsx";
import {UserInfoComponent} from "../components/UserInfoComponent.jsx";

export const ProfilePage = ({
                                user = {},
                                onBack,
                                onNavigate
                            }) => {
    // Modals
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    const handleChangePassword = () => {
        setShowPasswordModal(true);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Barra superior */}
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={onBack}
                        className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-white/50 rounded-xl transition-all"
                    >
                        <ChevronLeft size={20} />
                        <span className="font-medium">Volver</span>
                    </button>
                    <button
                        onClick={handleChangePassword}
                        className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-white/50 rounded-xl transition-all"
                        title="Editar contraseña"
                    >
                        <KeyRound size={18} />
                        <span className="font-medium">Editar contraseña</span>
                    </button>
                </div>

                {/* Sección de perfil */}
                <section className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-5 flex items-center gap-3">
                        <div className="w-1 h-7 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full" />
                        Información de usuario
                    </h2>
                    <UserInfoComponent user={user}/>
                </section>


                {/* Direcciones */}
                <section className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-5 flex items-center gap-3">
                        <div className="w-1 h-7 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full" />
                        Direcciones
                    </h2>
                    <AddressComponent user={user} />
                </section>

                {/* Métodos de pago */}
                <section className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-5 flex items-center gap-3">
                        <div className="w-1 h-7 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full" />
                        Métodos de Pago
                    </h2>
                    <CardComponent user={user} />
                </section>

                {/* Modal */}
                <EditPasswordModal
                    isOpen={showPasswordModal}
                    onClose={() => setShowPasswordModal(false)}
                    onSave={() => setShowPasswordModal(false)}
                />
            </div>
        </div>
    );
};

export default ProfilePage;