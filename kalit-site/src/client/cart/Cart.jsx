import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContextProvider';
import CartItem from './CartItem';
import { db, auth } from '../config/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { toast } from 'react-toastify'; // Import toast
import 'react-toastify/dist/ReactToastify.css'; // Ensure CSS is included

const Cart = () => {
    const navigate = useNavigate();
    const [showPopup, setShowPopup] = useState(false);

    const { cartItems, clearCart, getTotalCartAmount } = useContext(CartContext);
    const itemsInCart = Object.values(cartItems).filter(item => item.quantity > 0);
    const totalAmount = getTotalCartAmount();

    const storeCollectionRef = collection(db, "kalit-store");

    const addToDb = async () => {
        try {
            if (!auth.currentUser) {
                // Store in the local storage
                localStorage.setItem('pendingOrder', JSON.stringify({
                    cartItems,
                    totalAmount,
                    orderDate: new Date().toISOString()
                }));
                setShowPopup(true);
                return;
            }
            clearCart();
            navigate('/');
            // Create checkoutItems from cartItems
            const checkoutItems = Object.values(cartItems).map(item => ({
                id: item.id, // Add the item ID
                quantity: item.quantity // Include the quantity
            }));
    
            // Create checkout session
            fetch('/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    items: checkoutItems // Send the cart items to the backend
                })
            })
            .then(res => {
                if (!res.ok) {
                    return res.json().then(error => {
                        throw new Error(`HTTP error! status: ${res.status}, message: ${error.message}`);
                    });
                }
                return res.json();
            })
            .then(data => {
                if (data.url) {
                    window.location.href = data.url; 
                }
            })
            .catch(error => {
                console.error('Error creating checkout session:', error);
            });
    
            const itemsData = Object.values(cartItems).map(item => ({
                name: item.name,
                description: item.description || 'No description available',
                quantity: item.quantity,
                price: parseFloat(item.price.toString().replace(/,/g, '')) * item.quantity
            }));
    
            const orderDate = new Date().toISOString();
    
            await addDoc(storeCollectionRef, {
                userId: auth.currentUser.uid,
                userName: auth.currentUser.email,
                totalAmount,
                items: itemsData,
                orderDate,
            });
    


            toast.success("Purchase was successful!");
    
            await fetch("/api/sendOrderToTelegram", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    totalAmount, 
                    items: itemsData, 
                    userId: auth.currentUser.uid,
                    userName: auth.currentUser.email,
                    orderDate,
                }),
            });
    

        } catch (err) {
            console.error("Error adding document: ", err);
        }
    };
    
    const handleLoginRedirect = () => {
        navigate('/auth');
    };

    const handleStayLoggedOut = () => {
        setShowPopup(false);
        navigate('/');
    };

    return (
        <div className="cart-page p-4">
            <div className="cart-items">
                {itemsInCart.length > 0 ? (
                    itemsInCart.map((item) => (
                        <CartItem key={item.id} data={item} />
                    ))
                ) : (
                    <div className='grid items-center justify-center'>
                        <p className='text-3xl font-sans text-red-950'>Your cart is empty</p>
                        <button className='border-2 border-red-950 py-1 font-sans text-xl hover:bg-red-800 mt-3 rounded-xl hover:text-white hover:scale-105' onClick={() => navigate('/')}>Back to Home</button>
                    </div>
                )}
            </div>
            {itemsInCart.length > 0 && (
                <div className="total-container flex flex-col items-center gap-4">
                    <p className="text-xl font-bold">Total: ${totalAmount}</p>
                    <button
                        onClick={clearCart}
                        className=" text-lg mt-4 border border-red-800 px-4 py-2 rounded hover:bg-red-800 hover:text-white transition-colors duration-200 w-40"
                    >
                        Clear Cart
                    </button>

                     <button 
                        className=' border border-1 px-2 py-2 rounded border-green-800 hover:bg-green-800 hover:text-white text-lg w-40 transition-colors'
                        onClick={addToDb}
                    >
                        Check Out
                    </button>  

                </div>
            )}

            {showPopup && (
                <div className="popup-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="popup-content bg-white p-8 rounded-lg shadow-lg text-center">
                        <p className="text-2xl font-bold mb-4">You need to be logged in to checkout!</p>
                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={handleLoginRedirect}
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200"
                            >
                                Login/Sign up
                            </button>
                            <button
                                onClick={handleStayLoggedOut}
                                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-200"
                            >
                                Stay Logged Out
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
