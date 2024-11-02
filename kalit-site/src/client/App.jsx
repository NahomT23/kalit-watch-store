import React from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Cart from './cart/Cart';
import Contact from './pages/Contact';
import About from './pages/About';
import Auth from './components/Auth';
import UserProfile from './components/UserProfile';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CartContextProvider } from './context/CartContextProvider';
import { auth } from './config/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import LoadingPage from './components/LoadingPage';
import './App.css'; // Ensure this is correctly imported

function App() {
  const [user, loading, error] = useAuthState(auth);

  if (loading) return <LoadingPage />; // Show custom loading page while checking auth

  return (
    <div className="App">
      <CartContextProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/cart' element={<Cart />} />
            <Route path='/about' element={<About />} />
            <Route path='/contact' element={<Contact />} />
            <Route path='/userProfile' element={user ? <UserProfile /> : <Navigate to='/auth' />} />
            <Route path='/auth' element={user ? <Navigate to='/userProfile' /> : <Auth />} />
          </Routes>
          <Footer />
        </Router>
        <ToastContainer
          className="toast-container"
          toastClassName="custom-toast"
          autoClose={2000}
          closeOnClick
          pauseOnHover
          draggable
          position="top-right" // Centers the toast on the screen
          newestOnTop={false}
        />
      </CartContextProvider>
    </div>
  );
}

export default App;
