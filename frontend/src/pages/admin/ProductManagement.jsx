import { useState, useEffect } from 'react';
import { adminService } from '../../services/api';
import { Card, CardHeader, CardBody } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Loading } from '../../components/common/Loading';
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import {CreateProductModal} from "../modals/CreateProductModal.jsx";

const CATEGORY_LABELS = {
    PIZZA: 'Pizza',
    HAMBURGER: 'Hamburguesa',
    EXTRA: 'Extra'
};

export const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categoryFilter, setCategoryFilter] = useState('');
    const [categories, setCategories] = useState([]);
    const [types, setTypes] = useState([]);

    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        productCategory: '',
        productType: '',
        available: true
    });
    const [formErrors, setFormErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [availableTypes, setAvailableTypes] = useState([]);

    useEffect(() => {
        loadProducts();
        loadCategories();
        loadTypes();
    }, []);

    useEffect(() => {
        if (categoryFilter) {
            setFilteredProducts(products.filter(p => p.productCategory === categoryFilter));
        } else {
            setFilteredProducts(products);
        }
    }, [categoryFilter, products]);

    useEffect(() => {
        // Cuando cambia la categoría en el formulario, cargar los tipos correspondientes
        if (formData.productCategory) {
            loadTypesByCategory(formData.productCategory);
        } else {
            setAvailableTypes([]);
        }
    }, [formData.productCategory]);

    const loadProducts = async () => {
        try {
            setLoading(true);
            const data = await adminService.getAllProducts();
            console.log(data)
            setProducts(data);
            setFilteredProducts(data);
        } catch (error) {
            toast.error('Error al cargar productos', { duration: 2000 });
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const loadCategories = async () => {
        try {
            const data = await adminService.getProductCategories();
            setCategories(data);
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    };

    const loadTypes = async () => {
        try {
            const data = await adminService.getProductTypes();
            setTypes(data);
        } catch (error) {
            console.error('Error loading types:', error);
        }
    };

    const loadTypesByCategory = async (category) => {
        try {
            const data = await adminService.getProductTypesByCategory(category);
            console.log(`Tipos cargados para ${category}:`, data);
            setAvailableTypes(data);
        } catch (error) {
            console.error('Error loading types by category:', error);
            setAvailableTypes([]);
        }
    };

    const handleCreate = () => {
        setEditingProduct(null);
        setFormData({
            name: '',
            price: '',
            productCategory: '',
            productType: '',
            available: true
        });
        setAvailableTypes([]);
        setFormErrors({});
        setIsFormModalOpen(true);
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            price: product.price,
            productCategory: product.productCategory,
            productType: product.productType,
            available: product.available !== false
        });
        setFormErrors({});
        // Cargar los tipos de la categoría del producto
        if (product.productCategory) {
            loadTypesByCategory(product.productCategory);
        }
        setIsFormModalOpen(true);
    };

    const handleDelete = async (product) => {
        if (!window.confirm(`¿Estás seguro de eliminar el producto "${product.name}"?`)) {
            return;
        }

        try {
            await adminService.deleteProduct(product.id);
            toast.success('Producto eliminado', { duration: 2000 });
            loadProducts();
        } catch (error) {
            toast.error('Error al eliminar producto', { duration: 2000 });
            console.error(error);
        }
    };

    const handleToggleAvailability = async (product) => {
        try {
            await adminService.toggleProductAvailability(product.id, !product.available);
            toast.success(product.available ? 'Producto marcado como no disponible' : 'Producto marcado como disponible', { duration: 2000 });
            loadProducts();
        } catch (error) {
            toast.error('Error al cambiar disponibilidad', { duration: 2000 });
            console.error(error);
        }
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.name.trim()) {
            errors.name = 'El nombre es obligatorio';
        }

        if (!formData.price || parseFloat(formData.price) <= 0) {
            errors.price = 'El precio debe ser mayor a 0';
        }

        if (!formData.productCategory) {
            errors.productCategory = 'La categoría es obligatoria';
        }

        if (!formData.productType) {
            errors.productType = 'El tipo es obligatorio';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setSubmitting(true);
            const payload = {
                ...formData,
                price: parseFloat(formData.price)
            };

            console.log('Enviando producto:', payload);

            if (editingProduct) {
                await adminService.updateProduct(editingProduct.id, payload);
                toast.success('Producto actualizado', { duration: 2000 });
            } else {
                await adminService.createProduct(payload);
                toast.success('Producto creado', { duration: 2000 });
            }

            setIsFormModalOpen(false);
            loadProducts();
        } catch (error) {
            toast.error(editingProduct ? 'Error al actualizar producto' : 'Error al crear producto', { duration: 2000 });
            console.error('Error completo:', error);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loading size="lg" text="Cargando productos..." />
            </div>
        );
    }

    const createProductsProps = {
        isOpen: isFormModalOpen,
        onClose: () => setIsFormModalOpen(false),
        formData,
        setFormData,
        formErrors,
        editingProduct,
        submitting,
        onSubmit: handleSubmit,
        categories,
        CATEGORY_LABELS,
        availableTypes
    };

    return (
        <div>

            <div className="mb-6">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">Gestión de Productos</h2>
                    <Button
                        onClick={handleCreate}
                        className="flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Nuevo Producto</span>
                    </Button>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div className="w-full sm:w-64">
                        <Select
                            placeholder="Todas las categorías"
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            options={categories.map(cat => ({
                                value: cat,
                                label: CATEGORY_LABELS[cat] || cat
                            }))}
                        />
                    </div>
                    <p className="text-sm text-gray-600">
                        Mostrando {filteredProducts.length} de {products.length} productos
                    </p>
                </div>
            </div>

            {filteredProducts.length === 0 ? (
                <Card>
                    <CardBody>
                        <p className="text-center text-gray-500 py-8">No hay productos para mostrar</p>
                    </CardBody>
                </Card>
            ) : (
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {filteredProducts.map((product) => (
                        <Card key={product.id}>
                            <CardBody>
                                <div className="space-y-3">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{product.name}</h3>
                                            <p className="text-sm text-gray-500">{product.productType?.replace('_', ' ')}</p>
                                        </div>
                                        <Badge variant={product.available ? 'success' : 'danger'}>
                                            {product.available ? 'Disponible' : 'No disponible'}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-lg font-bold text-primary">
                                            ${Number(product.price).toFixed(2)}
                                        </span>
                                        <Badge>{CATEGORY_LABELS[product.productCategory] || product.productCategory}</Badge>
                                    </div>
                                    <div className="flex gap-2 pt-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleToggleAvailability(product)}
                                            title={product.available ? 'Marcar como no disponible' : 'Marcar como disponible'}
                                        >
                                            {product.available ? (
                                                <ToggleRight className="w-4 h-4" />
                                            ) : (
                                                <ToggleLeft className="w-4 h-4" />
                                            )}
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleEdit(product)}
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => handleDelete(product)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    ))}
                </div>
            )}

            {/* Crear Producto Modal */}
            <CreateProductModal {...createProductsProps} />;

        </div>
    );
};
