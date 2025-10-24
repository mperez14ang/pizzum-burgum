import React from 'react';
import { KeyRound } from 'lucide-react';

export const ProfilePage = ({
  user = {},
  onEditPassword,
}) => {
  const firstName = user?.firstName ?? '';
  const lastName = user?.lastName ?? '';

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Perfil</h2>

          <button
            onClick={onEditPassword}
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-800"
            title="Editar contraseña"
          >
            <KeyRound size={16} className="mr-1" />
            Editar contraseña
          </button>
        </div>
      </div>

      <div className="text-center mb-10">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900">
          Nombre: <span className="font-black">{firstName || '—'}</span>
        </h1>
        <p className="mt-3 text-2xl sm:text-3xl text-gray-700">
          Apellido: <span className="font-semibold">{lastName || '—'}</span>
        </p>
      </div>
    </div>
  );
};

export default ProfilePage;
