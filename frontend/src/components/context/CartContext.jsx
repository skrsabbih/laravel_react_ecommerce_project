import { createContext, useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartData, setCartData] = useState(JSON.parse(localStorage.getItem('cart')) || []);

    const addToCart = (product, size = null) => {
        let updatedCart = [...cartData];

        // if cart is empty
        if (cartData.length === 0) {
            updatedCart.push({
                // this is not better for unique id because same product but diff id generate
                // id: `${product.id}-${Math.floor(Math.random() * 10000000)}`,
                // this is better for unique id because same product same id, just size change
                id: `${product.id}-${size?.id || "no-size"}`,
                product_id: product.id,
                size_id: size?.id || null,
                size_name: size?.name || null,
                title: product.title,
                price: product.price,
                qty: 1,
                image_url: product.image_url
            });
        } else {
            // if cart is not empty and product is exits (product with size) or not
            if (size) {
                const isProductExist = updatedCart.find(item =>
                    item.product_id == product.id && item.size_id == size.id
                )
                // if product and size combination exits and qty is increase
                if (isProductExist) {
                    updatedCart = updatedCart.map(item => (item.product_id == product.id && item.size_id == size.id) ? { ...item, qty: item.qty + 1 } : item);
                } else {
                    // if product and size combination not exits then add in cart
                    updatedCart.push({
                        id: `${product.id}-${size.id}`,
                        product_id: product.id,
                        size_id: size.id,
                        size_name: size.name,
                        title: product.title,
                        price: product.price,
                        qty: 1,
                        image_url: product.image_url
                    });
                }
            } else {
                // when size is null
                const isProductExist = updatedCart.find(item =>
                    item.product_id == product.id
                )
                // then  product exits and qty is increase
                if (isProductExist) {
                    updatedCart = updatedCart.map(item => (item.product_id == product.id) ? { ...item, qty: item.qty + 1 } : item);
                } else {
                    // if product not exits then add in cart
                    updatedCart.push({
                        id: `${product.id}-${size.id}`,
                        product_id: product.id,
                        size_id: size.id,
                        size_name: size.name,
                        title: product.title,
                        price: product.price,
                        qty: 1,
                        image_url: product.image_url
                    });
                }
            }
        }

        // state is updated and local storage is updated
        setCartData(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    }

    // shipping context method
    const shipping = () => {
        return 0;
    }
    // subtotal method
    const subTotal = () => {
        let subtotal = 0;
        cartData.map(item => {
            subtotal += item.price * item.qty;
        })

        return subtotal;
    }

    // grand total method
    const grandTotal = () => {
        return subTotal() + shipping();
    }

    // update cart item globally increase or decrease quantity
    const updateCartItem = ($itemId, qty) => {
        let updatedCart = [...cartData];
        updatedCart = updatedCart.map(item => item.id == $itemId ? { ...item, qty: qty } : item);
        setCartData(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    }

    // for cart icon count 
    const getQty = () => {
        let qty = 0;
        cartData.map(item => {
            qty += parseInt(item.qty || 0);
        });

        return qty;
    }

    // delete cart item globally
    const deleteCartItem = ($itemId) => {
        let updatedCart = [...cartData];
        updatedCart = updatedCart.filter(item => item.id != $itemId);
        setCartData(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    }

    return (
        <CartContext.Provider value={{ addToCart, cartData, shipping, subTotal, grandTotal, updateCartItem, deleteCartItem, getQty }}>
            {children}
        </CartContext.Provider>
    )
}