import React, { useEffect, useState } from "react";
import { auth, db, signOut } from "../config/firebase";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import 'react-toastify/dist/ReactToastify.css';

const UserProfile = () => {
  const [orders, setOrders] = useState([]);
  const [userName, setUserName] = useState(""); // State for user's name
  const user = auth.currentUser;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUserName(userDoc.data().name); // Set the user's name
        }
      } catch (err) {
        toast.error(`Error fetching user data: ${err.message}`);
      }
    };

    const fetchOrderHistory = async () => {
      if (!user) return;

      try {
        const ordersRef = collection(db, "kalit-store");
        const q = query(ordersRef, where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        
        const fetchedOrders = querySnapshot.docs.map(doc => doc.data());
        
        const aggregatedOrders = fetchedOrders.reduce((acc, order) => {
          const existingOrder = acc.find(o => o.orderDate === order.orderDate);
          if (existingOrder) {
            order.items.forEach(item => {
              const existingItem = existingOrder.items.find(i => i.name === item.name);
              if (existingItem) {
                existingItem.quantity += item.quantity;
                existingItem.price += item.price;
              } else {
                existingOrder.items.push(item);
              }
            });
            existingOrder.totalAmount += order.totalAmount;
          } else {
            acc.push({ ...order, items: [...order.items] });
          }
          return acc;
        }, []);
  
        setOrders(aggregatedOrders);
      } catch (err) {
        toast.error(`Error fetching order history: ${err.message}`);
      }
    };

    fetchUserData();
    fetchOrderHistory();
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('Logged out successfully');
      navigate('/'); // Redirect to home
    } catch (err) {
      toast.error(`Error: ${err.message}`);
    }
  };

  const getInitials = (email) => {
    return email ? email.charAt(0).toUpperCase() : "";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="flex flex-col items-center p-6 bg-white rounded-lg max-w-md mx-auto my-20">
      {user ? (
        <>
          <div className="flex flex-col items-center">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt="User Profile"
                className="rounded-full w-32 h-32 object-cover mb-4"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-red-500 border-2 border-red-950 flex items-center justify-center text-red-950 text-5xl font-bold mb-4">
                {getInitials(user.email)}
              </div>
            )}
            <h2 className="text-2xl font-semibold mb-2">{userName || "User"}</h2>
            <p className="text-gray-600 mb-4">{user.email}</p>
          </div>

          <div className="w-full text-center mb-6">
            <h3 className="text-lg font-semibold mb-2">Order History</h3>
            {orders.length > 0 ? (
              orders.map((order, index) => (
                <div key={order.orderDate + index} className="mb-4 p-4 border rounded-lg">
                  <p className="text-lg font-semibold mb-2">Order Date: {formatDate(order.orderDate)}</p>
                  <div className="grid grid-cols-4 gap-4 mb-2">
                    <span className="font-semibold text-left">Order #</span>
                    <span className="font-semibold text-left">Item</span>
                    <span className="font-semibold text-center">Quantity</span>
                    <span className="font-semibold text-right">Price</span>
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    {order.items.map((item, i) => (
                      <React.Fragment key={i}>
                        <span className="text-left">{i + 1}</span>
                        <span className="text-left">{item.name}</span>
                        <span className="text-center">{item.quantity}</span>
                        <span className="text-right">${item.price.toFixed(2)}</span>
                      </React.Fragment>
                    ))}
                  </div>
                  <p className="font-semibold mt-2 text-right">Total: ${order.totalAmount}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No orders yet</p>
            )}
          </div>

          <button
            onClick={handleLogout}
            className="py-2 px-6 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition duration-300"
          >
            Logout
          </button>
        </>
      ) : (
        <p className="text-gray-500">No user is signed in</p>
      )}
    </div>
  );
};

export default UserProfile;
