import {Modal} from "../components/common/Modal.jsx";
import {AuthPage} from "./AuthPage.jsx";
import {useEffect} from "react";
import {useAuth} from "../contexts/AuthContext.jsx";

export const SessionExpiredPage = ({ onLogin, onBack}) => {
    const { isAuthenticated} = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            onLogin()
        }
    }, [isAuthenticated, onLogin]);

    return  <Modal
        isOpen={true}
        onClose={onBack}
        title='Su session expiró, inicie sessión'
        size="md"
    >
        <AuthPage type={'login'} canSwitch={false} />
    </Modal>
}