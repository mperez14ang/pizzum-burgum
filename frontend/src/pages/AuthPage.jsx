import {useState} from "react";
import {ChevronLeft} from 'lucide-react';
import {useAuth} from "../contexts/AuthContext.jsx";

export const AuthPage = ({type, onBack, onNavigate}) => {
    const { login, register } = useAuth();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        birthDate: '',
        dni: ''
    });
    const [errors, setErrors] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        birthDate: '',
        dni: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    const isRegister = type === 'register';

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setErrors(prev => ({ ...prev, [field]: '' }));
    };

    const timeout = (ms) =>
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error("timeout")), ms)
        );

    const validateForm = () => {
        const newErrors = {};

        // Validarciones de login y register
        if (!formData.email.trim()) {
            newErrors.email = 'El correo electrónico es requerido';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Correo electrónico inválido';
        }

        if (!formData.password) {
            newErrors.password = 'La contraseña es requerida';
        } else if (formData.password.length < 8) {
            newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
        }

        // Validaciones solo de register
        if (isRegister) {
            if (!formData.firstName.trim()) {
                newErrors.firstName = 'El nombre es requerido';
            }

            if (!formData.lastName.trim()) {
                newErrors.lastName = 'El apellido es requerido';
            }

            if (!formData.dni.trim()) {
                newErrors.dni = 'La cédula es requerida';
            } else if (!/^\d+$/.test(formData.dni)) {
                newErrors.dni = 'La cédula debe contener solo números';
            }

            if (!formData.birthDate.trim()) {
                newErrors.birthDate = 'La fecha de nacimiento es requerida';
            } else {
                const birth = new Date(formData.birthDate);
                const today = new Date();
                if (isNaN(birth.getTime()) || birth > today) {
                    newErrors.birthDate = 'Fecha de nacimiento inválida';
                }
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setIsLoading(true);
        console.log("hola")
        try{
            let response = null
            if (isRegister){
                response = await Promise.race([
                    // email, password, firstName, lastName, birthDate, dni
                    register(formData.email, formData.password, formData.firstName, formData.lastName, formData.birthDate, formData.dni),
                    timeout(5000), // 5 segundos
                ]);
            }
            else {
                response = await Promise.race([
                    login(formData.email, formData.password),
                    timeout(5000), // 5 segundos
                ]);
            }

            console.log(response)

            if (!response.success) {
                let errorLog = response.error;
                if (errorLog == null) errorLog = "Error desconocido"

                setErrors(prev => ({ ...prev, email: errorLog }));
                setIsLoading(false);
                return;
            }

            if (response && response.token) {
                setIsLoading(false);
                onNavigate(onBack);
            }
        } catch (err) {
            if (err.message === "timeout") {
                setErrors(prev => ({ ...prev, email: "El servidor tardó demasiado en responder (timeout)" }));
            }
            setIsLoading(false);

        }
        // Cambiar la pagina a lo que estaba haciendo antes
        onNavigate(onBack);
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 px-4">
            <div className="bg-white shadow-2xl rounded-3xl w-full max-w-md p-10 sm:p-12">
                <div className="flex flex-col items-center mb-10">
                    <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-2">
                        {isRegister ? "Registro" : "Login"}
                    </h2>
                    <p className="text-gray-500 text-sm sm:text-base">
                        {isRegister
                            ? "Crea tu cuenta para continuar"
                            : "Inicia sesión para acceder"}
                    </p>
                </div>

                <button
                    onClick={onBack}
                    className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors duration-200"
                    disabled={isLoading}
                >
                    <ChevronLeft size={20} />
                    <span className="ml-1">Volver</span>
                </button>

                <form onNavigate={onNavigate} className="flex flex-col gap-6">
                    {isRegister && (
                        <>
                            <InputField
                                label="Nombre"
                                id="firstName"
                                value={formData.firstName}
                                onChange={(e) => handleInputChange("firstName", e.target.value)}
                                error={errors.firstName}
                                isLoading={isLoading}
                            />
                            <InputField
                                label="Apellido"
                                id="lastName"
                                value={formData.lastName}
                                onChange={(e) => handleInputChange("lastName", e.target.value)}
                                error={errors.lastName}
                                isLoading={isLoading}
                            />
                        </>
                    )}

                    <InputField
                        label="Correo electrónico"
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        error={errors.email}
                        isLoading={isLoading}
                    />

                    <InputField
                        label="Contraseña"
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        error={errors.password}
                        isLoading={isLoading}
                    />

                    {isRegister && (
                        <>
                            <InputField
                                label="Cédula"
                                id="dni"
                                value={formData.dni}
                                onChange={(e) => handleInputChange("dni", e.target.value)}
                                error={errors.dni}
                                isLoading={isLoading}
                            />

                            <InputField
                                label="Fecha de nacimiento"
                                id="birthDate"
                                type="date"
                                value={formData.birthDate}
                                onChange={(e) => handleInputChange("birthDate", e.target.value)}
                                error={errors.birthDate}
                                isLoading={isLoading}
                            />
                        </>
                    )}

                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className={`w-full px-8 py-3 text-base rounded-lg transition-colors flex items-center justify-center ${
                            isLoading
                                ? 'bg-orange-400 cursor-not-allowed'
                                : 'bg-orange-500 hover:bg-orange-600'
                        } text-white`}
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                        fill="none"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    />
                                </svg>
                                {isRegister ? 'Registrando...' : 'Iniciando sesión...'}
                            </>
                        ) : (
                            isRegister ? 'Registrar' : 'Iniciar sesión'
                        )}
                    </button>
                </form>
            </div>

        </div>
    );
};

function InputField({ label, id, type = "text", value, onChange, error, isLoading }) {
    return (
        <div className="text-left">
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>
            <input
                type={type}
                id={id}
                name={id}
                value={value}
                onChange={onChange}
                disabled={isLoading}
                className={`w-full border rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 
          ${
                    error
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500"
                } ${isLoading ? "bg-gray-100 cursor-not-allowed" : ""}`}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
}