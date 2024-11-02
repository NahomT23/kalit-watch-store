import React, { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../config/firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ReviewSection({ itemId }) {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [showReviews, setShowReviews] = useState(false);
  const [showReviewInput, setShowReviewInput] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const reviewsRef = collection(db, 'reviews');
        const reviewSnapshot = await getDocs(reviewsRef);
        const reviewList = reviewSnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(review => review.itemId === itemId); // Filter by itemId

        setReviews(reviewList);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    };

    fetchReviews();
  }, [itemId]);

  const handleStarClick = (star) => {
    setRating(star);
  };

  const handleReviewChange = (e) => {
    setReview(e.target.value);
  };

  const handleSubmitReview = async () => {
    if (!auth.currentUser) {
      setShowPopup(true);
      return;
    }

    const user = auth.currentUser;
    const userName = user.displayName || user.email.split('@')[0];
    const profilePicture = user.photoURL || `https://ui-avatars.com/api/?name=${userName}&background=random`;

    try {
      await addDoc(collection(db, 'reviews'), {
        user: userName,
        profilePicture,
        rating,
        text: review,
        itemId, // Add the itemId to the review
        timestamp: new Date()
      });

      toast.success("Review submitted!");
      setRating(0);
      setReview("");
      setShowReviewInput(false);
      fetchReviews(); // Fetch new reviews after submission
    } catch (err) {
      console.error("Error submitting review:", err);
    }
  };

  const toggleReviews = () => {
    setShowReviews(!showReviews);
  };

  const toggleReviewInput = () => {
    setShowReviewInput(!showReviewInput);
  };

  const handleLoginRedirect = () => {
    navigate('/auth');
  };

  const handleStayLoggedOut = () => {
    setShowPopup(false);
  };

  return (
    <div className="w-full flex flex-col items-center md:items-start mt-4">
      <ToastContainer />
      <div className="flex space-x-2 mb-4">
        <button onClick={toggleReviewInput} className="py-1 px-3 bg-red-400 text-white rounded-lg hover:bg-red-500 focus:outline-none text-sm">
          {showReviewInput ? 'Hide Review Input' : 'Add Review'}
        </button>
        <button onClick={toggleReviews} className="py-1 px-3 bg-red-400 text-white rounded-lg hover:bg-red-500 focus:outline-none text-sm">
          {showReviews ? 'Hide Reviews' : 'View Reviews'}
        </button>
      </div>

      {showReviewInput && (
        <>
          <div className="w-full mb-4">
            <textarea value={review} onChange={handleReviewChange} placeholder="Add your review..." className="w-full h-20 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none" />
          </div>
          <div className="flex items-center mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar key={star} className={`cursor-pointer text-2xl ${star <= rating ? 'text-yellow-500' : 'text-gray-400'}`} onClick={() => handleStarClick(star)} />
            ))}
          </div>
          <button onClick={handleSubmitReview} className="mt-2 py-1 px-3 bg-red-400 text-white rounded-lg hover:bg-red-500 focus:outline-none text-sm">
            Submit Your Review
          </button>
        </>
      )}

      {showReviews && (
        <div className="w-full mt-4">
          <h4 className="font-semibold text-xl mb-2">Other Reviews:</h4>
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review.id} className="mb-4 p-4 border rounded-lg bg-gray-50 shadow-sm flex items-start">
                <img src={review.profilePicture} alt={`${review.user}'s profile`} className="w-10 h-10 rounded-full mr-4" />
                <div className="flex-1">
                  <p className="font-semibold">{review.user}</p>
                  <div className="flex mb-2">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className={`text-lg ${i < review.rating ? 'text-yellow-400' : 'text-gray-400'}`} />
                    ))}
                  </div>
                  <p>{review.text}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No reviews yet.</p>
          )}
          <button onClick={toggleReviews} className="mb-5 mt-2 py-1 px-3 bg-red-400 text-white rounded-lg hover:bg-red-500 text-sm">
            Show Less
          </button>
        </div>
      )}

      {showPopup && (
        <div className="popup-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="popup-content bg-white p-8 rounded-lg shadow-lg text-center">
            <p className="text-2xl font-bold mb-4">You need to be logged in to submit a review!</p>
            <div className="flex gap-4 justify-center">
              <button onClick={handleLoginRedirect} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200">Login/Sign up</button>
              <button onClick={handleStayLoggedOut} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-200">Stay Logged Out</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReviewSection;
