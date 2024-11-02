import React, { useState, useContext } from 'react';
import { CartContext } from '../context/CartContextProvider';

const CartItem = ({ data }) => {
    const { imageUrls, name, description, price, quantity, id } = data;
    const { removeFromCart, updateCartQuantity } = useContext(CartContext);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const handleRemove = () => {
        removeFromCart(id);
    };

    const handleIncrease = () => {
        updateCartQuantity(id, quantity + 1);
    };

    const handleDecrease = () => {
        if (quantity > 1) {
            updateCartQuantity(id, quantity - 1);
        } else {
            handleRemove();
        }
    };

    const handleNextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imageUrls.length);
    };

    const handlePrevImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === 0 ? imageUrls.length - 1 : prevIndex - 1
        );
    };

    return (
        <div className="flex justify-center items-center"> 
            <div className="cart-item flex items-center border rounded-lg p-4 mb-4 shadow-md bg-white max-w-md w-full">
                <div className="relative flex-shrink-0" style={{ width: '150px', height: '150px', marginRight: '16px' }}>
                    {imageUrls && imageUrls.length > 0 ? (
                        <div className="relative w-full h-full">
                            <img
                                src={imageUrls[currentImageIndex]}
                                alt={`Image for ${name}`}
                                className="w-full h-full object-cover"
                            />
                            {imageUrls.length > 1 && (
                                <>
                                    <button
                                        onClick={handlePrevImage}
                                        className="absolute top-1/2 left-0 transform -translate-y-1/2 text-black text-3xl"
                                    >
                                        &lt;
                                    </button>
                                    <button
                                        onClick={handleNextImage}
                                        className="absolute top-1/2 right-0 transform -translate-y-1/2 text-black text-3xl"
                                    >
                                        &gt;
                                    </button>
                                </>
                            )}
                        </div>
                    ) : (
                        <p>No image available</p>
                    )}
                </div>
                <div className="flex-grow">
                    <p className="mb-2">
                        <strong>Name:</strong> {name}
                    </p>
                    <p className="mb-2">
                        <strong>Description:</strong> {description || 'No description available'}
                    </p>
                    <p className="mb-2">
                        <strong>Price:</strong> ${price}
                    </p>
                    <div className="quantity-controls flex items-center mb-2">
                        <button
                            onClick={handleDecrease}
                            className="border-2 border-gray-800 px-4 py-2 rounded hover:bg-gray-800 hover:text-white transition-colors duration-200"
                        >
                            -
                        </button>
                        <span className="mx-4">{quantity}</span>
                        <button
                            onClick={handleIncrease}
                            className="border-2 border-gray-800 px-4 py-2 rounded hover:bg-gray-800 hover:text-white transition-colors duration-200"
                        >
                            +
                        </button>
                    </div>
                    <button
                        onClick={handleRemove}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors duration-200"
                    >
                        Remove
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartItem;












