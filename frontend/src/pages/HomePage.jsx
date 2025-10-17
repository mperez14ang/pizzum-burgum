import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Header } from '../components/common/Header';
import { FAVORITES } from '../constants/favorites';

export const HomePage = ({ onNavigate }) => {
    const [scrollPosition, setScrollPosition] = useState(0);

    const scrollCarousel = (direction) => {
        const container = document.getElementById('favorites-carousel');
        const scrollAmount = 320;
        const newPosition = direction === 'left'
            ? scrollPosition - scrollAmount
            : scrollPosition + scrollAmount;

        container.scrollTo({ left: newPosition, behavior: 'smooth' });
        setScrollPosition(newPosition);
    };

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

                {/* Favorites Carousel */}
                <div className="mb-12">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-3xl font-bold text-gray-900">Your Favorites</h3>
                        <div className="flex gap-2">
                            <button
                                onClick={() => scrollCarousel('left')}
                                className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                            >
                                <ChevronDown className="w-6 h-6 rotate-90" />
                            </button>
                            <button
                                onClick={() => scrollCarousel('right')}
                                className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                            >
                                <ChevronDown className="w-6 h-6 -rotate-90" />
                            </button>
                        </div>
                    </div>

                    <div
                        id="favorites-carousel"
                        className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {FAVORITES.map(item => (
                            <div
                                key={item.id}
                                onClick={() => onNavigate(item.type)}
                                className="flex-shrink-0 w-72 bg-white rounded-xl shadow-md hover:shadow-xl transition-all cursor-pointer group"
                            >
                                <div className="relative h-48 overflow-hidden rounded-t-xl">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                </div>
                                <div className="p-4">
                                    <h4 className="text-lg font-bold text-gray-900 mb-1">{item.name}</h4>
                                    <p className="text-sm text-gray-600 mb-2 capitalize">
                                        {item.type === 'burger' ? 'Burger' : 'Pizza'}
                                    </p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-2xl font-bold text-orange-600">${item.price}</span>
                                        <button className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors">
                                            Repeat
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};