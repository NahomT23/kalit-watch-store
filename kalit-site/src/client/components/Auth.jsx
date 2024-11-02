import React, { useState } from "react";
import { FaGoogle, FaRegEyeSlash } from "react-icons/fa";
import { FiEye } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider, db } from "../config/firebase"; // Ensure db is imported
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';
import { doc, setDoc } from "firebase/firestore"; // Import Firestore functions

const Auth = () => {
  const [name, setName] = useState(""); // State for name
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const createAccount = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error('Please fill out all fields');
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Store the user's name in Firestore
      await setDoc(doc(db, "users", user.uid), {
        name: name,
        email: email,
      });

      setEmail("");
      setPassword("");
      setName(""); // Clear name input
      toast.success(`Account created successfully for ${name}`); // Use name instead of user.name
      navigate('/');
    } catch (err) {
      console.log(err); // Log the full error object for debugging
      switch (err.code) {
        case 'auth/email-already-in-use':
          toast.error('Email already in use');
          break;
        case 'auth/weak-password':
          toast.error('Password should be at least 6 characters');
          break;
        case 'auth/invalid-email':
          toast.error('Invalid email address');
          break;
        default:
          toast.error(`Error: ${err.message}`);
      }
    }
  };

  const signInWithEmail = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill out the form');
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setEmail("");
      setPassword("");
      toast.success('Signed in successfully');
      navigate('/userProfile');
    } catch (err) {
      console.log(err); // Log the full error object for debugging
      switch (err.code) {
        case 'auth/user-not-found':
          toast.error('Account does not exist');
          break;
        case 'auth/wrong-password':
          toast.error('Incorrect password');
          break;
        case 'auth/invalid-email':
          toast.error('Invalid email address');
          break;
        case 'auth/invalid-credential':
          toast.error('Invalid password or Email');
          break;
        default:
          toast.error(`Error: ${err.message}`);
      }
    }
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success(`Signed in with ${auth.currentUser.email} successfully`);
      navigate('/userProfile');
    } catch (err) {
      console.log(err); // Log the full error object for debugging
      toast.error(`Error: ${err.message}`);
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-100">
      <motion.div
        className="bg-white p-6 sm:p-8 rounded-lg shadow-lg max-w-md w-full"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <form onSubmit={signInWithEmail} className="flex flex-col gap-5 pb-20 pt-10 mb-9">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <label className="block">
              <p className="text-gray-700 text-sm font-medium">Enter your name</p>
              <input
                type="text"
                placeholder="Name..."
                className="mt-1 p-3 border-2 border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <label className="block">
              <p className="text-gray-700 text-sm font-medium">Enter your email</p>
              <input
                type="email"
                placeholder="Email..."
                className="mt-1 p-3 border-2 border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <label className="block relative">
              <p className="text-gray-700 text-sm font-medium">Enter password</p>
              <div className="relative">
                <input
                  type={passwordVisible ? "text" : "password"}
                  placeholder="Password..."
                  className="mt-1 p-3 pr-12 border-2 border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  className="absolute inset-y-0 right-3 flex items-center justify-center text-gray-500"
                >
                  {passwordVisible ? <FiEye /> : <FaRegEyeSlash />}
                </button>
              </div>
            </label>
          </motion.div>
          <div className="flex flex-col gap-4 mt-4">
            <motion.button
              type="submit"
              className="py-3 px-4 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Sign in
            </motion.button>
            <motion.button
              type="button"
              onClick={createAccount}
              className="py-3 px-4 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Create Account
            </motion.button>
          </div>
          <div className="mt-4">
            <motion.button
              onClick={signInWithGoogle}
              className="flex items-center justify-center py-3 px-4 rounded-lg bg-white border-2 border-gray-300 shadow-sm font-semibold text-gray-700 w-full hover:bg-gray-100 transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaGoogle className="text-red-500 mr-2 text-xl" />
              Sign in with Google
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Auth;

