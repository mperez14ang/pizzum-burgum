import React, {useEffect, useRef, useState} from 'react';
import {Header} from '../components/common/Header';
import {FavoritesCarousel} from '../components/FavoritesCarousel';
import burgerImg from '../assets/burger.jpg';
import pizzaImg from '../assets/pizza.jpg';
import {useAuth} from "../contexts/AuthContext.jsx";
import {LoginAndRegisterModal} from "./modals/LoginAndRegisterModal.jsx";
import OrderStatusModal from "./modals/OrderStatusModal.jsx";
import {adminService} from "../services/api.js";

export const HomePage = ({ onNavigate, orderPayedId=null }) => {
    const { logout } = useAuth();

    const [isShowLoginModal, setIsShowLoginModal] = useState(false);

    // Order Status Modal
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [selectedOrderForStatus, setSelectedOrderForStatus] = useState(null);

    useEffect(() => {
        const getOrder = async () => {
            const response = await adminService.getOrder(orderPayedId)
            if (response){
                setIsStatusModalOpen(true)
                setSelectedOrderForStatus(response)
            }
        }
        if (orderPayedId){
            getOrder()
        }
    }, [orderPayedId]);

    return (
        <div className="min-h-screen bg-gray-50">

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        Diseña Crea Disfruta
                    </h2>
                    <p className="text-xl text-gray-600">
                        Diseña tu creacion perfecta con ingredientes premium
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-16">
                    {/* Hamburgers Section */}
                    <div
                        onClick={() => onNavigate('burger')}
                        className="relative h-96 rounded-2xl overflow-hidden cursor-pointer group shadow-lg hover:shadow-2xl transition-all"
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                        <img
                            src={burgerImg}
                            alt="Hamburger"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                            <h3 className="text-4xl font-bold text-white mb-2">Burgers</h3>
                            <p className="text-white/90 text-lg">Build your perfect burger</p>
                        </div>
                    </div>

                    {/* Pizzas Section */}
                    <div
                        onClick={() => onNavigate('pizza')}
                        className="relative h-96 rounded-2xl overflow-hidden cursor-pointer group shadow-lg hover:shadow-2xl transition-all"
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                        <img
                            src={pizzaImg}
                            alt="Pizza"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                            <h3 className="text-4xl font-bold text-white mb-2">Pizzas</h3>
                            <p className="text-white/90 text-lg">Create your artisan pizza</p>
                        </div>
                    </div>
                </div>

                {/* Favorites Carousel - Dinámico desde el backend */}
                <FavoritesCarousel onOpenLogin={() => setIsShowLoginModal(true)} onNavigateToFavorites={() => onNavigate("favorites")}/>

                {/* Modal de login prompt */}
                <LoginAndRegisterModal isOpen={isShowLoginModal}
                                       onClose={() => {setIsShowLoginModal(false)}}/>

                <OrderStatusModal
                    isOpen={isStatusModalOpen}
                    onClose={() => {
                        setIsStatusModalOpen(false);
                    }}
                    order={selectedOrderForStatus}
                    title={`Estado del pedido`}
                />
            </main>
        </div>
    );
};