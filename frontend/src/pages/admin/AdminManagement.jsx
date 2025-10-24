import { useState, useEffect } from 'react';
import { adminService } from '../../services/api';
import { Card, CardBody } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Loading } from '../../components/common/Loading';
import { Plus, User } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import {CreateAdminModal} from "../modals/CreateAdminModal.jsx";

export const AdminManagement = () => {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
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

    useEffect(() => {
        loadAdmins();
    }, []);

    const loadAdmins = async () => {
        try {
            setLoading(true);
            const data = await adminService.getAllAdmins();
            setAdmins(data);
        } catch (error) {
            toast.error('Error al cargar administradores', { duration: 2000 });
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
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
            loadAdmins();
        } catch (error) {
            toast.error('Error al crear administrador. El email o DNI ya podrían estar registrados.', { duration: 2000 });
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loading size="lg" text="Cargando administradores..." />
            </div>
        );
    }

    return (
        <div>
            <Toaster position="top-right" />

            <div className="mb-6">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">Gestión de Administradores</h2>
                    <Button onClick={handleCreate}>
                        <Plus className="w-4 h-4 mr-2" />
                        Nuevo Administrador
                    </Button>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                    Total: {admins.length} administradores
                </p>
            </div>

            {admins.length === 0 ? (
                <Card>
                    <CardBody>
                        <p className="text-center text-gray-500 py-8">No hay administradores para mostrar</p>
                    </CardBody>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {admins.map((admin) => (
                        <Card key={admin.email}>
                            <CardBody>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                                        <User className="w-6 h-6 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900">
                                            {admin.firstName} {admin.lastName}
                                        </h3>
                                        <p className="text-sm text-gray-600">{admin.email}</p>
                                    </div>
                                    {admin.createdByEmail && (
                                        <div className="text-right text-sm text-gray-500">
                                            <p className="text-xs">Creado por: {admin.createdByEmail}</p>
                                        </div>
                                    )}
                                </div>
                            </CardBody>
                        </Card>
                    ))}
                </div>
            )}

            {/* Form Modal */}
            <CreateAdminModal
                isOpen={isFormModalOpen}
                onSubmit={handleSubmit}
                submitting={submitting}
                onClose={() => setIsFormModalOpen(false)}
                formData={formData}
                setFormData={setFormData}
                formErrors={formErrors}>
            </CreateAdminModal>
        </div>
    );
};
