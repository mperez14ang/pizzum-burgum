import {Select} from "../../components/common/Select.jsx";
import {Button} from "../../components/common/Button.jsx";
import {Input} from "postcss";
import {Modal} from "../../components/common/Modal.jsx";

export const CreateProductModal = (
    {isOpen, onClose, onSubmit, editingProduct, categories, CATEGORY_LABELS, availableTypes,
    formData, setFormData, formErrors}) => {
    return <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={editingProduct ? 'Editar Producto' : 'Crear Producto'}
    >
        <form onSubmit={onSubmit} className="space-y-4">
            <Select
                label="Categoría *"
                value={formData.productCategory}
                onChange={(e) => {
                    // Al cambiar la categoría, limpiar el tipo
                    setFormData({
                        ...formData,
                        productCategory: e.target.value,
                        productType: ''
                    });
                }}
                options={categories.map(cat => ({
                    value: cat,
                    label: CATEGORY_LABELS[cat] || cat
                }))}
                error={formErrors.productCategory}
            />

            <Select
                label="Tipo *"
                value={formData.productType}
                onChange={(e) => setFormData({ ...formData, productType: e.target.value })}
                options={availableTypes.map(type => ({
                    value: type,
                    label: type.replace(/_/g, ' ')
                }))}
                error={formErrors.productType}
                placeholder={formData.productCategory ? "Seleccionar tipo..." : "Primero selecciona una categoría"}
            />

            <Input
                label="Nombre *"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                error={formErrors.name}
            />

            <Input
                label="Precio *"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                error={formErrors.price}
            />

            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id="available"
                    checked={formData.available}
                    onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
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
                <Button
                    type="submit"
                    disabled={submitting}
                >
                    {submitting ? 'Guardando...' : editingProduct ? 'Actualizar' : 'Crear'}
                </Button>
            </div>
        </form>
    </Modal>
}