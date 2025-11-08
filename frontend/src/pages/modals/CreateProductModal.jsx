import { Select } from "../../components/common/Select.jsx";
import { Button } from "../../components/common/Button.jsx";
import { Modal } from "../../components/common/Modal.jsx";
import { Input } from "../../components/common/Input.jsx";
import {CATEGORY_IMAGES} from "../../utils/StringUtils.jsx";

export const CreateProductModal = ({
                                       isOpen,
                                       onClose,
                                       submitting,
                                       onSubmit,
                                       editingProduct,
                                       categories,
                                       CATEGORY_LABELS,
                                       availableTypes,
                                       formData,
                                       setFormData,
                                       formErrors,
                                       onCategoryChange,
                                   }) => {
    const handleCategoryChange = (e) => {
        const newCategory = e.target.value;
        setFormData({
            ...formData,
            category: newCategory,
            type: "",
            image: "",
        });

        if (onCategoryChange) {
            onCategoryChange(newCategory);
        }
    };

    const isExtraCategory =
        CATEGORY_LABELS[formData.category]?.toLowerCase() === "extra" ||
        formData.category?.toLowerCase() === "extra";

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={editingProduct ? "Editar Producto" : "Crear Producto"}
        >
            <form onSubmit={onSubmit} className="space-y-4">
                <Select
                    label="Categoría *"
                    value={formData.category}
                    onChange={handleCategoryChange}
                    options={categories.map((cat) => ({
                        value: cat,
                        label: CATEGORY_LABELS[cat] || cat,
                    }))}
                    error={formErrors.category}
                />

                <Select
                    label="Tipo *"
                    value={formData.type}
                    onChange={(e) =>
                        setFormData({ ...formData, type: e.target.value })
                    }
                    options={availableTypes.map((type) => ({
                        value: type,
                        label: type.replace(/_/g, " "),
                    }))}
                    error={formErrors.type}
                    placeholder={
                        formData.category
                            ? "Seleccionar tipo..."
                            : "Primero selecciona una categoría"
                    }
                />

                <Input
                    label="Nombre *"
                    value={formData.name}
                    onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                    }
                    error={formErrors.name}
                />

                <Input
                    label="Precio *"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                    }
                    error={formErrors.price}
                />

                {isExtraCategory && (
                    <div className="space-y-2">
                        <Input
                            label="URL de Imagen"
                            type="url"
                            value={formData.image || ""}
                            onChange={(e) =>
                                setFormData({ ...formData, image: e.target.value })
                            }
                            placeholder="https://ejemplo.com/imagen.jpg"
                            error={formErrors.image}
                        />

                        {/* Vista previa de la imagen */}
                        <div className="flex justify-center">
                            <img
                                key={formData.type} // 👈 fuerza el re-render cuando cambia el tipo
                                src={formData.image || CATEGORY_IMAGES[formData.type]}
                                alt="Vista previa"
                                className="w-32 h-32 object-cover rounded-xl border border-gray-200 shadow-sm"
                                onError={(e) => {
                                    e.target.src = CATEGORY_IMAGES[formData.type];
                                }}
                            />
                        </div>



                    </div>
                )}

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="available"
                        checked={formData.available}
                        onChange={(e) =>
                            setFormData({ ...formData, available: e.target.checked })
                        }
                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                    />
                    <label htmlFor="available" className="text-sm text-gray-700">
                        Disponible
                    </label>
                </div>

                <div className="flex gap-3 justify-end pt-4">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={onClose}
                        disabled={submitting}
                    >
                        Cancelar
                    </Button>
                    <Button type="submit" disabled={submitting}>
                        {submitting
                            ? "Guardando..."
                            : editingProduct
                                ? "Actualizar"
                                : "Crear"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
