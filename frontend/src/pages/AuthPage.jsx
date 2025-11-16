import {useState} from "react";
import {useAuth} from "../contexts/AuthContext.jsx";
import toast from "react-hot-toast";

export const AuthPage = ({type, onToggleAuthType, canSwitch}) => {
    const {login, register} = useAuth();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        email_register: '',
        password_register: '',
        birthDate: '',
        dni: '',
        street: '',
        door: '',
        city: '',
        postalCode: ''
    });
    const [errors, setErrors] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        email_register: '',
        password_register: '',
        birthDate: '',
        dni: '',
        street: '',
        door: '',
        city: '',
        postalCode: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    const isRegister = type === 'register';

    const handleInputChange = (field, value) => {
        setFormData(prev => ({...prev, [field]: value}));
        setErrors(prev => ({...prev, [field]: ''}));
    };

    const timeout = (ms) =>
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error("timeout")), ms)
        );

    const validatePassword = (password) => {
        if (!password) {
            return 'La contraseña es requerida';
        } else if (password.length < 8) {
            return 'La contraseña debe tener al menos 8 caracteres';
        }
        return ''
    }

    const validateEmail = (email) => {
        if (!email.trim()) {
            return 'El correo electrónico es requerido';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            return 'Correo electrónico inválido';
        }
        return ''
    }

    const validateForm = () => {
        const newErrors = {};

        if (!isRegister) {
            const emailError = validateEmail(formData.email);
            if (emailError) newErrors.email = emailError;

            const passwordError = validatePassword(formData.password);
            if (passwordError) newErrors.password = passwordError;
        }

        if (isRegister) {
            const emailError = validateEmail(formData.email_register);
            if (emailError) newErrors.email_register = emailError;

            const passwordError = validatePassword(formData.password_register);
            if (passwordError) newErrors.password_register = passwordError;

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

            if (!formData.street.trim()) {
                newErrors.street = 'La calle es requerida';
            }

            if (!formData.city.trim()) {
                newErrors.city = 'La ciudad es requerida';
            }

            if (!formData.door.trim()) {
                newErrors.door = 'El numero de puerta es necesario';
            }

            if (!formData.postalCode.trim()) {
                newErrors.postalCode = 'El codigo postal es requerido';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            let response = null
            if (isRegister) {
                response = await Promise.race([
                    register(
                        formData.email_register,
                        formData.password_register,
                        formData.firstName,
                        formData.lastName,
                        formData.birthDate,
                        formData.dni,
                        `${formData.street.trim()} ${formData.door}`.trim(), // Numero de puerta
                        formData.city,
                        formData.postalCode
                    ),
                    timeout(5000),
                ]);
            } else {
                response = await Promise.race([
                    login(formData.email, formData.password),
                    timeout(5000),
                ]);
            }

            if (!response) {
                setIsLoading(false);
                return;
            }

            if (response && response.token && isRegister) {
                toast.success('Registro de usuario exitoso');
            }
            setIsLoading(false);
        } catch (err) {
            if (err.message === "timeout") {
                toast.error("El servidor tardó demasiado en responder (timeout)");
            }
            setIsLoading(false);
        }
    }

    return (
        <div>
            <div className="flex flex-col gap-4 sm:gap-6">
                {!isRegister && (
                    <>
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
                    </>
                )}

                {isRegister && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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

                        <InputField
                            label="Correo electrónico"
                            id="email_register"
                            type="email"
                            value={formData.email_register}
                            onChange={(e) => handleInputChange("email_register", e.target.value)}
                            error={errors.email_register}
                            isLoading={isLoading}
                            autoComplete={'current-email'}
                        />

                        <InputField
                            label="Contraseña"
                            id="password_register"
                            type="password"
                            value={formData.password_register}
                            onChange={(e) => handleInputChange("password_register", e.target.value)}
                            error={errors.password_register}
                            isLoading={isLoading}
                            autoComplete={'current-password'}
                        />

                        <InputField
                            label="Cédula"
                            id="dni"
                            value={formData.dni}
                            onChange={(e) => handleInputChange("dni", e.target.value)}
                            error={errors.dni}
                            isLoading={isLoading}
                            maxLength={8}
                            onlyNumbers={true}
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

                        <div className="col-span-1 sm:col-span-2 mt-2 sm:mt-4 mb-1 sm:mb-2">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 border-b pb-1">
                                Dirección
                            </h3>
                        </div>


                        <InputField
                            label="Calle"
                            id="street"
                            value={formData.street}
                            onChange={(e) => handleInputChange("street", e.target.value)}
                            error={errors.street}
                            isLoading={isLoading}
                        />

                        <InputField
                            label="Numero de puerta"
                            id="door"
                            value={formData.door}
                            onChange={(e) => handleInputChange("door", e.target.value)}
                            error={errors.door}
                            isLoading={isLoading}
                            maxLength={4}
                            onlyNumbers={true}
                        />

                        <InputField
                            label="Ciudad"
                            id="city"
                            value={formData.city}
                            onChange={(e) => handleInputChange("city", e.target.value)}
                            error={errors.city}
                            isLoading={isLoading}
                        />

                        <InputField
                            label="Codigo Postal"
                            id="postal_code"
                            value={formData.postalCode}
                            onChange={(e) => handleInputChange("postalCode", e.target.value)}
                            error={errors.postalCode}
                            isLoading={isLoading}
                            maxLength={10}
                            onlyNumbers={true}
                        />
                    </div>
                )}

                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className={`w-full px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg transition-colors flex items-center justify-center ${
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

                {canSwitch && (
                    <div className="text-center pt-4 border-t border-gray-200">
                        <p className="text-sm text-gray-600">
                            {isRegister ? (
                                <>
                                    ¿Ya tienes cuenta?{' '}
                                    <button
                                        type="button"
                                        onClick={onToggleAuthType}
                                        disabled={isLoading}
                                        className="text-orange-600 hover:text-orange-700 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Inicia sesión
                                    </button>
                                </>
                            ) : (
                                <>
                                    ¿No tienes cuenta?{' '}
                                    <button
                                        type="button"
                                        onClick={onToggleAuthType}
                                        disabled={isLoading}
                                        className="text-orange-600 hover:text-orange-700 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Regístrate aquí
                                    </button>
                                </>
                            )}
                        </p>
                    </div>
                )}

            </div>
        </div>
    );
}

function InputField({
                        label,
                        id,
                        type = "text",
                        value,
                        onChange,
                        error,
                        isLoading,
                        maxLength,
                        autoComplete = "off",
                        onlyNumbers = false,
                    }) {
    return (
        <div className="text-left">
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>
            <input
                type={onlyNumbers ? "tel" : type}
                id={id}
                name={id}
                value={value}
                onChange={(e) => {
                    if (onlyNumbers) {
                        const cleaned = e.target.value.replace(/\D+/g, "");
                        onChange({ target: { value: cleaned } });
                    } else {
                        onChange(e);
                    }
                }}
                disabled={isLoading}
                autoComplete={autoComplete}
                {...(maxLength && maxLength > 0 && { maxLength })}
                className={`w-full border rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2
                    ${error ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"}
                    ${isLoading ? "bg-gray-100 cursor-not-allowed" : ""}
                `}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
}