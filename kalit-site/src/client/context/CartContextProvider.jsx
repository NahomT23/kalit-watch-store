import React, { createContext, useState, useEffect } from 'react';
import { formatNumberWithCommas } from '../utility';

export const CartContext = createContext();

export const CartContextProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        const storedCart = JSON.parse(localStorage.getItem('cartItems'));
        return storedCart || {};
    });

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (item) => {
        setCartItems((prev) => {
            const existingItem = prev[item.id];
            if (existingItem) {
                return {
                    ...prev,
                    [item.id]: {
                        ...existingItem,
                        quantity: existingItem.quantity + 1,
                    },
                };
            } else {
                return {
                    ...prev,
                    [item.id]: { ...item, quantity: 1 },
                };
            }
        });
    };

    const removeFromCart = (itemId) => {
        setCartItems((prev) => {
            const { [itemId]: _, ...rest } = prev;
            return rest;
        });
    };

    const updateCartQuantity = (itemId, quantity) => {
        setCartItems((prev) => {
            const existingItem = prev[itemId];
            if (existingItem) {
                return {
                    ...prev,
                    [itemId]: { ...existingItem, quantity },
                };
            }
            return prev;
        });
    };

    const clearCart = () => {
        setCartItems({});
    };

    const getTotalCartAmount = () => {
        const total = Object.values(cartItems).reduce(
            (total, item) => {
                const parsedPrice = parseFloat(item.price.toString().replace(/,/g, ''));
                return total + parsedPrice * item.quantity;
            },
            0
        );
        return formatNumberWithCommas(total);
    };

    const getTotalItemsInCart = () => {
        return Object.values(cartItems).reduce(
            (total, item) => total + item.quantity,
            0
        );
    };

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                updateCartQuantity,
                clearCart,
                getTotalCartAmount,
                getTotalItemsInCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export default CartContextProvider;


