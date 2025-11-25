import React, {useEffect, useRef, useState} from 'react';
import {Header} from '../components/common/Header.jsx';
import {FavoritesCarousel} from '../components/FavoritesCarousel';
import {useAuth} from "../contexts/AuthContext.jsx";
import {LoginAndRegisterModal} from "./modals/LoginAndRegisterModal.jsx";
import {adminService} from "../services/api.js";
import {OrderDetailModal} from "./modals/OrderDetailModal.jsx";
import {BURGER_IMAGE, LOGO_BLACK, PIZZA_IMAGE} from "../utils/assets.jsx";

export const HomePage = ({ onNavigate, orderPayedId=null }) => {
    // Obtenemos el objeto user del contexto
    const { user, logout } = useAuth();

    const [isShowLoginModal, setIsShowLoginModal] = useState(false);

    // Order Status Modal
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        const getOrder = async () => {
            const response = await adminService.getOrder(orderPayedId)
            if (response){
                setIsStatusModalOpen(true)
                setSelectedOrder(response)
            }
        }
        if (orderPayedId){
            getOrder()
        }
    }, [orderPayedId]);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow w-full">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
                        Diseña, <span className="text-orange-600">Crea</span>, Disfruta
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        La experiencia culinaria donde tú eres el chef. Ingredientes premium para creaciones únicas.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-16">
                    {/* Hamburgers Section */}
                    <div
                        onClick={() => onNavigate('burger')}
                        className="relative h-96 rounded-3xl overflow-hidden cursor-pointer group shadow-xl hover:shadow-2xl transition-all duration-300"
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 transition-opacity duration-300 group-hover:from-black/90"></div>
                        <img
                            src={BURGER_IMAGE}
                            alt="Hamburger"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                        />
                        <div className="absolute bottom-0 left-0 right-0 p-8 z-20 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                            <h3 className="text-4xl font-bold text-white mb-2">Hamburguesas</h3>
                            <div className="h-1 w-12 bg-orange-500 mb-4 rounded-full group-hover:w-20 transition-all duration-300"></div>
                            <p className="text-white/90 text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
                                Jugosa carne premium y toppings frescos.
                            </p>
                        </div>
                    </div>

                    {/* Pizzas Section */}
                    <div
                        onClick={() => onNavigate('pizza')}
                        className="relative h-96 rounded-3xl overflow-hidden cursor-pointer group shadow-xl hover:shadow-2xl transition-all duration-300"
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 transition-opacity duration-300 group-hover:from-black/90"></div>
                        <img
                            src={PIZZA_IMAGE}
                            alt="Pizza"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                        />
                        <div className="absolute bottom-0 left-0 right-0 p-8 z-20 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                            <h3 className="text-4xl font-bold text-white mb-2">Pizzas</h3>
                            <div className="h-1 w-12 bg-orange-500 mb-4 rounded-full group-hover:w-20 transition-all duration-300"></div>
                            <p className="text-white/90 text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
                                Masa artesanal y los mejores quesos.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Favorites Carousel */}
                <FavoritesCarousel onOpenLogin={() => setIsShowLoginModal(true)} onNavigateToFavorites={() => onNavigate("favorites")}/>

                {/* Modals */}
                <LoginAndRegisterModal isOpen={isShowLoginModal} onClose={() => {setIsShowLoginModal(false)}}/>
                <OrderDetailModal isOpen={isStatusModalOpen} onClose={() => {setIsStatusModalOpen(false);}} order={selectedOrder} />
            </main>

            <footer className="bg-[#111827] text-gray-300 mt-16 border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="grid md:grid-cols-4 gap-12 mb-12">

                        <div className="col-span-1 md:col-span-2">
                            <h3 className="text-2xl font-bold mb-6 text-white tracking-wider flex items-center gap-2">
                                <span className="bg-orange-600 text-white px-2 py-1 rounded text-lg">P&B</span>
                                PizzUM & BurgUM
                            </h3>
                            <p className="text-gray-400 mb-6 leading-relaxed max-w-sm">
                                Redefiniendo la comida rápida con ingredientes gourmet y tecnología de punta. Creamos experiencias, no solo comida.
                            </p>
                        </div>

                        <div>
                            <h4 className="text-lg font-semibold text-white mb-6 border-b-2 border-orange-600 inline-block pb-1">Navegación</h4>
                            <ul className="space-y-3">
                                <li>
                                    <button onClick={() => onNavigate('burger')} className="hover:text-orange-500 hover:translate-x-1 transition-all duration-200 flex items-center gap-2">
                                        <span>&rsaquo;</span> Hamburguesas
                                    </button>
                                </li>
                                <li>
                                    <button onClick={() => onNavigate('pizza')} className="hover:text-orange-500 hover:translate-x-1 transition-all duration-200 flex items-center gap-2">
                                        <span>&rsaquo;</span> Pizzas
                                    </button>
                                </li>

                                {user && (
                                    <>
                                        <li>
                                            <button onClick={() => onNavigate('favorites')} className="hover:text-orange-500 hover:translate-x-1 transition-all duration-200 flex items-center gap-2">
                                                <span>&rsaquo;</span> Mis Favoritos
                                            </button>
                                        </li>
                                        <li>
                                            <button onClick={() => onNavigate('profile')} className="hover:text-orange-500 hover:translate-x-1 transition-all duration-200 flex items-center gap-2">
                                                <span>&rsaquo;</span> Mi Perfil
                                            </button>
                                        </li>
                                        <li>
                                            <button onClick={() => onNavigate('orders')} className="hover:text-orange-500 hover:translate-x-1 transition-all duration-200 flex items-center gap-2">
                                                <span>&rsaquo;</span> Historial de Pedidos
                                            </button>
                                        </li>
                                    </>
                                )}
                                <li>
                                    <a
                                        href="https://docs.google.com/document/d/1APTAv9IL2haCkU1Y-JkYMQt930Ro6PnuKNkB6Z54ad4/edit?usp=sharing"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:text-orange-500 hover:translate-x-1 transition-all duration-200 flex items-center gap-2"
                                    >
                                        <span>&rsaquo;</span> Manual de Usuario
                                    </a>
                                </li>
                            </ul>

                        </div>

                        <div>
                            <h4 className="text-lg font-semibold text-white mb-6 border-b-2 border-orange-600 inline-block pb-1">Contáctanos</h4>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3 group cursor-default">
                                    <div className="bg-gray-800 p-2 rounded-lg group-hover:bg-orange-600/20 transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <span className="text-sm text-gray-400 group-hover:text-gray-200 transition-colors">info@synergysoftware.com</span>
                                </li>
                                <li className="flex items-start gap-3 group cursor-default">
                                    <div className="bg-gray-800 p-2 rounded-lg group-hover:bg-orange-600/20 transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    </div>
                                    <span className="text-sm text-gray-400 group-hover:text-gray-200 transition-colors">+598 99 123 456</span>
                                </li>
                                <li className="flex items-start gap-3 group cursor-default">
                                    <div className="bg-gray-800 p-2 rounded-lg group-hover:bg-orange-600/20 transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <span className="text-sm text-gray-400 group-hover:text-gray-200 transition-colors">Montevideo, Uruguay</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="text-sm text-gray-500">
                            <p>&copy; {new Date().getFullYear()} Synergy Software. Todos los derechos reservados.</p>
                        </div>

                        <div className="opacity-50 hover:opacity-100 transition-opacity duration-300">
                            <img
                                src={LOGO_BLACK}
                                alt="Logo"
                                className="h-12 w-auto brightness-0 invert filter"
                            />
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};