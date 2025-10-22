import { ShoppingCart, User } from 'lucide-react';
import {useAuth} from "../../contexts/AuthContext.jsx";
import React from "react";

export const Header = ( { onNavigate } ) => {
    const { user } = useAuth();
    console.log(user)
    return (
        <header className="bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">PizzUM & BurgUM</h1>

                    <div className="flex items-center gap-4">
                        {/* Mostrar el correo si el usuario existe */}
                        {user ? (
                            <>
                                <span className="text-gray-700 text-sm font-medium">{user.email}</span>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => onNavigate('login')}
                                    className='w-full px-8 py-3 text-base rounded-lg transition-colors flex items-center justify-center '
                                >Login
                                </button>
                            </>
                        )}

                        <button className="p-2 hover:bg-gray-100 rounded-full">
                            <ShoppingCart className="w-6 h-6" />
                        </button>

                        <button className="p-2 hover:bg-gray-100 rounded-full">
                            <User className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};