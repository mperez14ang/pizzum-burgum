import { useState, useEffect } from 'react';
import { adminService } from '../../services/api';
import { Card, CardBody } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Loading } from '../../components/common/Loading';
import { Plus, User, Users, Shield } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { CreateAdminModal } from "../modals/CreateAdminModal.jsx";
import {AuthPage} from "../AuthPage.jsx";
import {Modal} from "../../components/common/Modal.jsx";

export const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('both'); // 'admins', 'clients', 'both'
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        dni: '',
        birthDate: '',
        password: '',
        confirmPassword: ''
    });
    const [formErrors, setFormErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [isRegisterModelOpen, setIsRegisterModelOpen] = useState(false);

    useEffect(() => {
        loadUsers();
    }, [viewMode]);

    const loadUsers = async () => {
        try {
            setLoading(true);
            let data = [];

            if (viewMode === 'admins') {
                data = await adminService.getAllAdmins();
                data = data.map(user => ({ ...user, type: 'admin' }));
            } else if (viewMode === 'clients') {
                data = await adminService.getAllClients();
                data = data.map(user => ({ ...user, type: 'client' }));
            } else {
                // Load both
                const [admins, clients] = await Promise.all([
                    adminService.getAllAdmins(),
                    adminService.getAllClients()
                ]);
                data = [
                    ...admins.map(user => ({ ...user, type: 'admin' })),
                    ...clients.map(user => ({ ...user, type: 'client' }))
                ];
            }

            setUsers(data);
        } catch (error) {
            toast.error('Error al cargar usuarios', { duration: 2000 });
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleAdminCreate = () => {
        setFormData({
            email: '',
            firstName: '',
            lastName: '',
            dni: '',
            birthDate: '',
            password: '',
            confirmPassword: ''
        });
        setFormErrors({});
        setIsFormModalOpen(true);
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.email = 'Email inválido';
        }

        if (!formData.firstName.trim() || formData.firstName.length < 2) {
            errors.firstName = 'El nombre debe tener al menos 2 caracteres';
        }

        if (!formData.lastName.trim() || formData.lastName.length < 2) {
            errors.lastName = 'El apellido debe tener al menos 2 caracteres';
        }

        if (!formData.dni.trim() || !/^\d{7,8}$/.test(formData.dni)) {
            errors.dni = 'La cédula debe tener 7 u 8 dígitos';
        }

        if (!formData.birthDate) {
            errors.birthDate = 'La fecha de nacimiento es obligatoria';
        } else {
            const birthDate = new Date(formData.birthDate);
            if (birthDate >= new Date()) {
                errors.birthDate = 'La fecha debe ser en el pasado';
            }
        }

        if (!formData.password || formData.password.length < 8) {
            errors.password = 'La contraseña debe tener al menos 8 caracteres';
        }

        if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = 'Las contraseñas no coinciden';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setSubmitting(true);
            const payload = {
                email: formData.email,
                firstName: formData.firstName,
                lastName: formData.lastName,
                dni: formData.dni,
                birthDate: formData.birthDate,
                password: formData.password
            };

            await adminService.createAdmin(payload);
            toast.success('Administrador creado correctamente', { duration: 2000 });
            setIsFormModalOpen(false);
            loadUsers();
        } catch (error) {
            toast.error('Error al crear administrador. El email o DNI ya podrían estar registrados.', { duration: 2000 });
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    };

    const getUserTypeLabel = () => {
        const adminCount = users.filter(u => u.type === 'admin').length;
        const clientCount = users.filter(u => u.type === 'client').length;

        if (viewMode === 'admins') return `${adminCount} administradores`;
        if (viewMode === 'clients') return `${clientCount} clientes`;
        return `${adminCount} administradores, ${clientCount} clientes`;
    };

    const handleRegister = () => {
        setIsRegisterModelOpen(false)
        loadUsers();
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loading size="lg" text="Cargando usuarios..." />
            </div>
        );
    }

    return (
        <div>
            <Toaster position="top-right" />

            <div className="mb-6">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h2>
                    {viewMode === 'admins' ? (
                        <Button
                            onClick={handleAdminCreate}
                            className="flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Nuevo Administrador</span>
                        </Button>
                    ) : viewMode === 'clients' ? (
                        <Button
                            onClick={() => setIsRegisterModelOpen(true)}
                            className="flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Nuevo Cliente</span>
                        </Button>
                    ) : null}
                </div>

                {/* Filter Buttons */}
                <div className="flex flex-wrap gap-2 mt-4">
                    <Button
                        onClick={() => setViewMode('both')}
                        variant={viewMode === 'both' ? 'primary' : 'secondary'}
                        className="flex items-center gap-2"
                    >
                        <Users className="w-4 h-4" />
                        <span>Todos</span>
                    </Button>
                    <Button
                        onClick={() => setViewMode('admins')}
                        variant={viewMode === 'admins' ? 'primary' : 'secondary'}
                        className="flex items-center gap-2"
                    >
                        <Shield className="w-4 h-4" />
                        <span>Administradores</span>
                    </Button>
                    <Button
                        onClick={() => setViewMode('clients')}
                        variant={viewMode === 'clients' ? 'primary' : 'secondary'}
                        className="flex items-center gap-2"
                    >
                        <User className="w-4 h-4" />
                        <span>Clientes</span>
                    </Button>
                </div>

                <p className="text-sm text-gray-600 mt-3">
                    Total: {getUserTypeLabel()}
                </p>
            </div>

            {users.length === 0 ? (
                <Card>
                    <CardBody>
                        <p className="text-center text-gray-500 py-8">
                            No hay {viewMode === 'admins' ? 'administradores' : viewMode === 'clients' ? 'clientes' : 'usuarios'} para mostrar
                        </p>
                    </CardBody>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {users.map((user) => (
                        <Card key={user.email}>
                            <CardBody>
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                        user.type === 'admin' ? 'bg-purple-100' : 'bg-blue-100'
                                    }`}>
                                        {user.type === 'admin' ? (
                                            <Shield className="w-6 h-6 text-purple-600" />
                                        ) : (
                                            <User className="w-6 h-6 text-blue-600" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-semibold text-gray-900">
                                                {user.firstName} {user.lastName}
                                            </h3>
                                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                                                user.type === 'admin'
                                                    ? 'bg-purple-100 text-purple-700'
                                                    : 'bg-blue-100 text-blue-700'
                                            }`}>
                                                {user.type === 'admin' ? 'Admin' : 'Cliente'}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600">{user.email}</p>
                                    </div>
                                    {user.createdByEmail && (
                                        <div className="text-right text-sm text-gray-500">
                                            <p className="text-xs">Creado por: {user.createdByEmail}</p>
                                        </div>
                                    )}
                                </div>
                            </CardBody>
                        </Card>
                    ))}
                </div>
            )}

            <div>
                {viewMode === 'admins' ? (
                    <CreateAdminModal
                        isOpen={isFormModalOpen}
                        onSubmit={handleSubmit}
                        submitting={submitting}
                        onClose={() => setIsFormModalOpen(false)}
                        formData={formData}
                        setFormData={setFormData}
                        formErrors={formErrors}
                    />
                ) : viewMode === 'clients' ? (
                    <div>
                        <Modal
                            isOpen={isRegisterModelOpen}
                            onClose={() => setIsRegisterModelOpen(false)}
                            title='Crear nuevo cliente'
                            size="md"
                        >
                            <AuthPage type={'register'} canSwitch={false} logInAfter={false} onRegisterSuccess={handleRegister} />
                        </Modal>

                    </div>
                ) : null}

            </div>
        </div>
    );
};