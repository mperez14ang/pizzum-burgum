import {Button} from "../../components/common/Button.jsx";
import { Input } from '../../components/common/Input';
import {Modal} from "../../components/common/Modal.jsx";

export const CreateAdminModal = ({isOpen, onSubmit, submitting, onClose, formData, setFormData, formErrors} ) => {
    return <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Crear Administrador"
        size="lg"
    >
        <form onSubmit={onSubmit} className="space-y-4">
            <Input
                label="Email *"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                error={formErrors.email}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    label="Nombre *"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    error={formErrors.firstName}
                />

                <Input
                    label="Apellido *"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    error={formErrors.lastName}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    label="DNI *"
                    value={formData.dni}
                    onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
                    error={formErrors.dni}
                    placeholder="7 u 8 dígitos"
                />

                <Input
                    label="Fecha de Nacimiento *"
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                    error={formErrors.birthDate}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    label="Contraseña *"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    error={formErrors.password}
                    placeholder="Mínimo 8 caracteres"
                />

                <Input
                    label="Confirmar Contraseña *"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    error={formErrors.confirmPassword}
                />
            </div>

            <div className="flex gap-3 justify-end pt-4">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={onClose}
                    disabled={submitting}
                >
                    Cancelar
                </Button>
                <Button
                    type="submit"
                    disabled={submitting}
                >
                    {submitting ? 'Creando...' : 'Crear Administrador'}
                </Button>
            </div>
        </form>
    </Modal>
}