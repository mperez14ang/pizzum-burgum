import { Header } from '../components/common/Header';
import { FavoritesCarousel } from '../components/FavoritesCarousel';
import burgerImg from '../assets/burger.jpg';
import pizzaImg from '../assets/pizza.jpg';
import {useCreatorStore} from "../contexts/creatorcontext.jsx";
import {useAuth} from "../contexts/AuthContext.jsx";

export const HomePage = ({ onNavigate }) => {
    const { logout } = useAuth();

    return (
        <div className="min-h-screen bg-gray-50">
            <Header onNavigate={onNavigate}/>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        Create Your Perfect Experience
                    </h2>
                    <p className="text-xl text-gray-600">
                        Design your ideal burger or pizza with fresh, quality ingredients
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
                {/* Prueba tarjeta */}
                <div
                    onClick={() => onNavigate('card')}
                    className="relative h-10 rounded-2xl overflow-hidden cursor-pointer group shadow-lg hover:shadow-2xl transition-all"
                    >Card Prueba</div>

                {/* Prueba login */}
                <div
                    onClick={() => onNavigate('login')}
                    className="relative h-10 rounded-2xl overflow-hidden cursor-pointer group shadow-lg hover:shadow-2xl transition-all"
                >Login</div>

                {/* Prueba register */}
                <div
                    onClick={() => onNavigate('register')}
                    className="relative h-10 rounded-2xl overflow-hidden cursor-pointer group shadow-lg hover:shadow-2xl transition-all"
                >Register</div>

                {/* Prueba logout */}
                <div
                    onClick={() => logout()}
                    className="relative h-10 rounded-2xl overflow-hidden cursor-pointer group shadow-lg hover:shadow-2xl transition-all"
                >Logout</div>

                {/* Favorites Carousel - Dinámico desde el backend */}
                <FavoritesCarousel onNavigate={onNavigate}/>
            </main>
        </div>
    );
};