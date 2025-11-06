import React, {useState} from 'react';
import { KeyRound } from 'lucide-react';
import {capitalize} from "../../utils/StringUtils.jsx";
import {EditPasswordModal} from "../modals/EditPasswordModal.jsx";
import {UserInfoComponent} from "../../components/UserInfoComponent.jsx";

export const ProfilePage = ({
  user = {}
}) => {
  const firstName = user?.firstName ?? '';
  const lastName = user?.lastName ?? '';
  const [editPasswordModal, setEditPasswordModal] = useState(false);

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Perfil</h2>

          <button
            onClick={() => setEditPasswordModal(true)}
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-800"
            title="Editar contraseña"
          >
            <KeyRound size={16} className="mr-1" />
            Editar contraseña
          </button>
        </div>
      </div>

        {/* Sección de perfil */}
        <section className="mb-8">
            <UserInfoComponent user={user}/>
        </section>

      <EditPasswordModal isOpen={editPasswordModal}
                         onClose={() => setEditPasswordModal(false)}
                         onSave={() => setEditPasswordModal(false)}
      />
    </div>
  );
};

export default ProfilePage;
