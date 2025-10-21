import { Header } from '../components/common/Header';
import { FavoritesCarousel } from '../components/FavoritesCarousel';

export const HomePage = ({ onNavigate }) => {

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

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
                            src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop"
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
                            src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&h=600&fit=crop"
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

                {/* Favorites Carousel - Dinámico desde el backend */}
                <FavoritesCarousel />
            </main>
        </div>
    );
};