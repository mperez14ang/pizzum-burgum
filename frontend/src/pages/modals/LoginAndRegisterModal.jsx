import {Modal} from "../../components/common/Modal.jsx";
import {AuthPage} from "../AuthPage.jsx";
import {useState} from "react";

export const LoginAndRegisterModal = ({isOpen, onClose}) => {
    const [authType, setAuthType] = useState('login');

    const handleToggleAuthType = () => {
        setAuthType(prev => prev === 'login' ? 'register' : 'login');
    };

    const closeAction = () => {
        setAuthType('login')
        onClose()
    }

    return <Modal
        isOpen={isOpen}
        onClose={closeAction}
        title={authType === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
        size="md"
    >
        <AuthPage type={authType} onToggleAuthType={handleToggleAuthType} />
    </Modal>
}