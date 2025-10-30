import {ProductImage} from "./ProductImage.jsx";
import {SummaryItems} from "./SummaryItems.jsx";
import {SummaryTotal} from "./SummaryTotal.jsx";
import {SummaryActions} from "./SummaryActions.jsx";

export const SummaryPanel = ({
                                 productConfig,
                                 selections,
                                 total,
                                 favoriteName,
                                 onFavoriteNameChange,
                                 onSaveFavorite,
                                 onAddToCart,
                                 isSavingFavorite,
                                 isAuthenticated
                             }) => {
    return (
        <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-6">
                {/* Imagen del producto */}
                <ProductImage
                    productConfig={productConfig}
                />

                <h3 className="text-xl font-bold mb-4">Resumen</h3>

                {/* Items seleccionados */}
                <SummaryItems
                    productConfig={productConfig}
                    selections={selections}
                />

                {/* Total */}
                <SummaryTotal total={total} />

                {/* Botones de acción */}
                <SummaryActions
                    productConfig={productConfig}
                    favoriteName={favoriteName}
                    onFavoriteNameChange={onFavoriteNameChange}
                    onSaveFavorite={onSaveFavorite}
                    onAddToCart={onAddToCart}
                    isSavingFavorite={isSavingFavorite}
                    isAuthenticated={isAuthenticated}
                />
            </div>
        </div>
    );
};