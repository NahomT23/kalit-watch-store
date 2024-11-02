import React, { useState, useContext, useEffect } from "react";
import { CartContext } from '../context/CartContextProvider';
import { formatNumberWithCommas } from '../utility';
import ItemPopup from '../ItemPopup';

function Item({ item, onSendToTelegram }) {
    const { name, description, price, imageUrls = [], id } = item;
    const { addToCart, removeFromCart, updateCartQuantity, cartItems } = useContext(CartContext);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [quantity, setQuantity] = useState(0);
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        // Load cart items from local storage
        const storedCart = JSON.parse(localStorage.getItem('cartItems')) || {};
        if (storedCart[id]) {
            setQuantity(storedCart[id].quantity);
        } else {
            setQuantity(0);
        }
    }, [cartItems, id]);

    useEffect(() => {
        // Save cart items to local storage whenever they change
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    const handleNextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imageUrls.length);
    };

    const handlePrevImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === 0 ? imageUrls.length - 1 : prevIndex - 1
        );
    };

    const handleAddToCart = () => {
        addToCart({ id, name, price, description, imageUrls });
        setQuantity(1);
    };

    const handleIncreaseQuantity = () => {
        setQuantity((prevQuantity) => {
            const newQuantity = prevQuantity + 1;
            updateCartQuantity(id, newQuantity);
            return newQuantity;
        });
    };

    const handleDecreaseQuantity = () => {
        setQuantity((prevQuantity) => {
            const newQuantity = Math.max(prevQuantity - 1, 0);
            updateCartQuantity(id, newQuantity);
            return newQuantity;
        });
    };

    const handleRemoveFromCart = () => {
        removeFromCart(id);
        setQuantity(0);
    };

    const handleDoubleClick = () => {
        setShowPopup(true);
    };

    const handleClosePopup = () => {
        setShowPopup(false);
    };

    const handleMoreInfo = () => {
        setShowPopup(true);
    };

    return (
        <div
            className="item border rounded-lg p-4 shadow-md bg-white flex flex-col justify-between cursor-pointer hover:shadow-lg transition-shadow duration-500 overflow-hidden"
            onDoubleClick={handleDoubleClick}
        >
 
            {imageUrls.length > 0 && (
                <div className="relative w-full mb-2">
                    <div className="flex items-center justify-center h-48">
                        <img
                            src={imageUrls[currentImageIndex]}
                            alt={`Image ${currentImageIndex + 1}`}
                            className="object-contain max-h-full max-w-full"
                        />
                    </div>
                    <div className="flex justify-center mt-2">
                        {imageUrls.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentImageIndex(index)}
                                className={`w-3 h-3 mx-1 rounded-full border-2 border-black transition-colors duration-200 ${
                                    currentImageIndex === index
                                        ? "bg-gray-800"
                                        : "bg-transparent hover:bg-gray-800"
                                }`}
                            />
                        ))}
                    </div>
                </div>
            )}
            <p className="mt-2 font-bold truncate">{name}</p>
            <p className="text-sm overflow-hidden text-ellipsis whitespace-normal">{description}</p>
            <p className="font-bold">{formatNumberWithCommas(price)}</p>
            <p 
                className="text-red-950 cursor-pointer hover:scale-105 mt-1 hover:text-red-800 transition ease-in-out" 
                onClick={handleMoreInfo}
            >
                More Info
            </p>
            <div className="flex flex-col items-center mt-4">
                {quantity > 0 ? (
                    <div className="flex items-center space-x-2 mb-2">
                        <button onClick={handleDecreaseQuantity} className="w-8 h-8 border-2 border-red-950 rounded-full text-xl hover:bg-red-900 hover:text-white transition-all duration-200 flex items-center justify-center">
                            -
                        </button>
                        <span>{quantity}</span>
                        <button onClick={handleIncreaseQuantity} className="w-8 h-8 border-2 border-red-950 rounded-full text-xl hover:bg-red-900 hover:text-white transition-all duration-200 flex items-center justify-center">
                            +
                        </button>

                    </div>
                ) : (
                    <button onClick={handleAddToCart} className="w-32 h-10 border-2 border-red-950 rounded-lg hover:bg-red-900 hover:text-white transition-all duration-300 flex items-center justify-center mb-2">
                        Add To Cart
                    </button>
                )}
            </div>
            {/* Popup for More Details */}
            {showPopup && (
                <ItemPopup
                    item={item}
                    currentImageIndex={currentImageIndex}
                    handleNextImage={handleNextImage}
                    handlePrevImage={handlePrevImage}
                    setCurrentImageIndex={setCurrentImageIndex}
                    handleClosePopup={handleClosePopup}
                    handleAddToCart={handleAddToCart}
                    handleIncreaseQuantity={handleIncreaseQuantity}
                    handleDecreaseQuantity={handleDecreaseQuantity}
                    quantity={quantity}
                    formatNumberWithCommas={formatNumberWithCommas}
                />
            )}
        </div>
    );
}

export default Item;
