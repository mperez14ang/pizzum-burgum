export function transformCreationData(creationData) {
    const products = [];

    if (creationData.type === 'PIZZA') {
        // Para pizzas
        if (creationData.size) products.push({quantity: 1, productId: creationData.size.id});
        if (creationData.dough) products.push({quantity: 1, productId: creationData.dough.id});
        if (creationData.sauce) products.push({quantity: 1, productId: creationData.sauce.id});
        if (creationData.cheese) products.push({quantity: 1, productId: creationData.cheese.id});
        if (creationData.toppings) {
            creationData.toppings.forEach(topping => {
                products.push({quantity: 1, productId: topping.id});
            });
        }
    } else if (creationData.type === 'HAMBURGER') {
        // Para hamburguesas
        if (creationData.bread) products.push({quantity: 1, productId: creationData.bread.id});
        if (creationData.meat) products.push({
            quantity: creationData.meatQuantity || 1,
            productId: creationData.meat.id
        });
        if (creationData.cheese) products.push({quantity: 1, productId: creationData.cheese.id});
        if (creationData.toppings) {
            creationData.toppings.forEach(topping => {
                products.push({quantity: 1, productId: topping.id});
            });
        }
        if (creationData.sauces) {
            creationData.sauces.forEach(sauce => {
                products.push({quantity: 1, productId: sauce.id});
            });
        }
    }

    return {
        name: creationData.name,
        type: creationData.type,
        price: creationData.price,
        products: products,
        quantity: creationData.quantity
    };
}

export function getBackendErrorMessage(error){
    let message = error.message;

    // Intentar extraer el texto del JSON que devolvió el backend
    try {
        const parsed = JSON.parse(message);
        if (parsed.error) message = parsed.error;
    } catch {
        // Si no es JSON, usar el mensaje tal cual
    }

    return message;
}