import UserAvatar from "./UserAvatar.jsx";
import {capitalize, formatDateToSpanish} from "../utils/StringUtils.jsx";
import {Cake, Calendar, Mail, User, Loader2} from "lucide-react";
import React, {useEffect, useState} from "react";
import {userService} from "../services/api.js";
import {Loading} from "./common/Loading.jsx";

export const UserInfoComponent = ({
                                      user = {},
                                  }) => {
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const firstName = user?.firstName ?? '';
    const lastName = user?.lastName ?? '';

    useEffect(() => {
        if (!user) return;

        const fetchUserInfo = async () => {
            setLoading(true);
            try {
                const response = await userService.getUserInfo(user);
                if (response) {
                    setUserInfo(response);
                }
            } catch (error) {
                console.error("Error al obtener información del usuario:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserInfo();
    }, [user]);

    const age = userInfo?.birthDate
        ? Math.floor(
            (new Date() - new Date(userInfo.birthDate)) / (1000 * 60 * 60 * 24 * 365.25)
        )
        : "—";

    if (loading) {
        return (
            <Loading size="lg" text="Cargando ..." color='border-blue-600' />
        );
    }

    return <div>
        <div className="bg-white/60 rounded-3xl border border-white/50 p-8 mb-8">
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
                {/* Avatar y nombre */}
                <div className="flex flex-col items-center text-center lg:w-1/3">
                    <UserAvatar
                        userInfo={userInfo}
                        size={140}
                        className="shadow-2xl ring-4 ring-white/50"
                        randomizeButton={true}
                    />
                    <h1 className="mt-6 text-4xl font-bold text-gray-900 tracking-tight">
                        {capitalize(firstName)} {capitalize(lastName)}
                    </h1>
                    <p className="mt-2 text-gray-600 flex items-center gap-2">
                        <Mail size={16} />
                        {user.email}
                    </p>
                </div>

                {/* Información del usuario */}
                <div className="flex-1 lg:w-2/3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-5 border border-pink-100">
                            <div className="flex items-center gap-3">
                                <div className="bg-white rounded-full p-3">
                                    <Cake size={20} className="text-pink-600" />
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Edad</p>
                                    <p className="text-lg font-semibold text-gray-900">{age}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-5 border border-blue-100">
                            <div className="flex items-center gap-3">
                                <div className="bg-white rounded-full p-3">
                                    <Calendar size={20} className="text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Miembro desde</p>
                                    <p className="text-lg font-semibold text-gray-900">{formatDateToSpanish(userInfo?.createdDate)}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-5 border border-blue-100">
                            <div className="flex items-center gap-3">
                                <div className="bg-white rounded-full p-3">
                                    <User size={20} className="text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">DNI</p>
                                    <p className="text-lg font-semibold text-gray-900">{userInfo?.dni ? `${userInfo.dni.slice(0, 1)}.${userInfo.dni.slice(1, 4)}.${userInfo.dni.slice(4, 7)}-${userInfo.dni.slice(-1)}` : '—'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

}