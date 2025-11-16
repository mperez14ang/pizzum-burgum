import React, {useEffect, useState} from 'react';
import {adminService} from '../../services/api';
import {Card, CardBody} from '../../components/common/Card';
import {Button} from '../../components/common/Button';
import {Select} from '../../components/common/Select';
import {Badge} from '../../components/common/Badge';
import {Loading} from '../../components/common/Loading';
import {Edit, Plus, ToggleLeft, ToggleRight, Trash2} from 'lucide-react';
import toast from 'react-hot-toast';
import {CreateProductModal} from "../modals/CreateProductModal.jsx";
import {useConfirm} from "../../contexts/UseConfirm.jsx";

const CATEGORY_LABELS = {
    PIZZA: 'Pizza',
    HAMBURGER: 'Hamburguesa',
    EXTRA: 'Extra'
};

export const ProductManagement = () => {
    const confirm = useConfirm();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categoryFilter, setCategoryFilter] = useState('');
    const [categories, setCategories] = useState([]);
    const [types, setTypes] = useState([]);
    const [isDeleted, setIsDeleted] = useState(false);
    const [isAvailable, setIsAvailable] = useState(null);

    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        category: '',
        type: '',
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

    const getCurrentFilters = () => ({
        deleted: isDeleted,
        available: isAvailable,
        category: categoryFilter || undefined
    });

    const loadProducts = async (filters = null) => {
        try {
            setLoading(true);

            const activeFilters = filters !== null ? filters : getCurrentFilters();
            const data = await adminService.getAllProducts(activeFilters);

            if (filters !== null) {
                setIsAvailable(activeFilters.available);
                setIsDeleted(activeFilters.deleted);
                setCategoryFilter(activeFilters.category || '');
            }

            setProducts(data);
        } catch (error) {
            toast.error('Error al cargar productos');
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
            category: '',
            type: '',
            available: true
        });
        setAvailableTypes([]);
        setFormErrors({});
        setIsFormModalOpen(true);
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData(product);
        setFormErrors({});
        if (product.category) {
            loadTypesByCategory(product.category);
        }
        setIsFormModalOpen(true);
    };

    const askDelete = async (product) => {
        const ok = await confirm("¿Desea borrar el producto?", "Eliminar Producto");

        if (!ok) return;

        try {
            await adminService.deleteProduct(product.id);
            toast.success('Producto eliminado');
            await loadProducts();
        } catch (error) {
            toast.error('Error al eliminar producto');
            console.error(error);
        }
    };

    const handleToggleAvailability = async (product) => {
        try {
            await adminService.toggleProductAvailability(product.id, !product.available);

            setProducts(prev =>
                prev.map(p =>
                    p.id === product.id ? { ...p, available: !p.available } : p
                )
            );

            toast.success(
                product.available
                    ? 'Producto marcado como no disponible'
                    : 'Producto marcado como disponible',
                { duration: 2000 }
            );
        } catch (error) {
            toast.error('Error al cambiar disponibilidad');
            console.error(error);
        }
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.name.trim()) errors.name = 'El nombre es obligatorio';
        if (!formData.price || parseFloat(formData.price) <= 0) errors.price = 'El precio debe ser mayor a 0';
        if (!formData.category) errors.category = 'La categoría es obligatoria';
        if (!formData.type) errors.type = 'El tipo es obligatorio';

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            setSubmitting(true);
            const payload = { ...formData, price: parseFloat(formData.price) };

            if (editingProduct) {
                await adminService.updateProduct(editingProduct.id, payload);

                setProducts(prev =>
                    prev.map(p =>
                        p.id === editingProduct.id ? { ...p, ...payload } : p
                    )
                );

                toast.success('Producto actualizado');
            } else {
                await adminService.createProduct(payload);
                toast.success('Producto creado');
                await loadProducts();
            }

            setIsFormModalOpen(false);
        } catch (error) {
            toast.error(editingProduct ? 'Error al actualizar producto' : 'Error al crear producto');
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleCategoryChange = async (category) => {
        await loadProducts({
            deleted: isDeleted,
            available: isAvailable,
            category: category || undefined
        });
    };

    const handleStatusFilterChange = async (value) => {
        if (value === "show_deleted") {
            await loadProducts({
                deleted: true,
                available: null,
                category: categoryFilter || undefined
            });
        } else if (value === "available") {
            await loadProducts({
                deleted: false,
                available: true,
                category: categoryFilter || undefined
            });
        } else if (value === "not_available") {
            await loadProducts({
                deleted: false,
                available: false,
                category: categoryFilter || undefined
            });
        } else {
            await loadProducts({
                deleted: false,
                available: null,
                category: categoryFilter || undefined
            });
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loading size="lg" text="Cargando productos..." />
            </div>
        );
    }

    return (
        <div>
            <div className="mb-6">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">Gestión de Productos</h2>
                    <Button onClick={handleCreate} className="flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        <span>Nuevo Producto</span>
                    </Button>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div className="flex gap-4 w-full sm:w-auto">
                        <div className="w-48">
                            <Select
                                placeholder="Todas las categorías"
                                value={categoryFilter}
                                onChange={(e) => handleCategoryChange(e.target.value)}
                                options={categories.map(cat => ({
                                    value: cat,
                                    label: CATEGORY_LABELS[cat] || cat
                                }))}
                            />
                        </div>

                        <div className="w-48">
                            <Select
                                placeholder={'Todos Los Activos'}
                                value={
                                    isDeleted
                                        ? "show_deleted"
                                        : isAvailable === true
                                            ? "available"
                                            : isAvailable === false
                                                ? "not_available"
                                                : "all_active"
                                }
                                onChange={(e) => handleStatusFilterChange(e.target.value)}
                                options={[
                                    { value: "available", label: "Disponibles" },
                                    { value: "not_available", label: "No Disponibles" },
                                    { value: "show_deleted", label: "Borrados" }
                                ]}
                            />
                        </div>
                    </div>

                    <p className="text-sm text-gray-600">
                        Mostrando {products.length} producto{products.length !== 1 ? 's' : ''}
                    </p>
                </div>
            </div>

            {products.length === 0 ? (
                <Card>
                    <CardBody>
                        <p className="text-center text-gray-500 py-8">No hay productos para mostrar</p>
                    </CardBody>
                </Card>
            ) : (
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {products.map((product) => (
                        <Card key={product.id}>
                            <CardBody>
                                <div className="space-y-3">
                                    {product.deleted && (
                                        <p className="text-red-600 font-bold text-sm">
                                            ESTE PRODUCTO ESTÁ BORRADO
                                        </p>
                                    )}

                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{product.name}</h3>
                                            <p className="text-sm text-gray-500">
                                                {product.type?.replace(/_/g, ' ')}
                                            </p>
                                        </div>

                                        <Badge variant={product.available ? 'success' : 'danger'}>
                                            {product.available ? 'Disponible' : 'No disponible'}
                                        </Badge>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-lg font-bold text-primary">
                                            ${Number(product.price).toFixed(2)}
                                        </span>
                                        <Badge>{CATEGORY_LABELS[product.category] || product.category}</Badge>
                                    </div>

                                    <div className="flex gap-2 pt-2">
                                        {!product.deleted && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleToggleAvailability(product)}
                                            >
                                                {product.available ? (
                                                    <ToggleRight className="w-4 h-4" />
                                                ) : (
                                                    <ToggleLeft className="w-4 h-4" />
                                                )}
                                            </Button>
                                        )}

                                        {!product.deleted && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleEdit(product)}
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                        )}

                                        {!product.deleted && (
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() => askDelete(product)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    ))}
                </div>
            )}

            <CreateProductModal
                isOpen={isFormModalOpen}
                onClose={() => setIsFormModalOpen(false)}
                submitting={submitting}
                onSubmit={handleSubmit}
                editingProduct={editingProduct}
                categories={categories}
                CATEGORY_LABELS={CATEGORY_LABELS}
                availableTypes={availableTypes}
                formData={formData}
                setFormData={setFormData}
                formErrors={formErrors}
                onCategoryChange={loadTypesByCategory}
            />
        </div>
    );
};
