import React, { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { formatNumberWithCommas } from './utility';
import ReviewSection from './components/ReviewSection';

function ItemPopup({
  item,
  handleClosePopup,
  handleAddToCart,
  handleIncreaseQuantity,
  handleDecreaseQuantity,
  quantity,
}) {
  const { id, name, description, price, imageUrls, specs } = item; 
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index);
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm"
      onClick={handleClosePopup}
    >
      <div
        className="bg-white rounded-lg p-4 md:p-6 max-w-full md:max-w-5xl w-full relative flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
        style={{ maxHeight: '90vh', overflowY: 'auto', overflowX: 'hidden' }}
      >
        <button
          className="absolute top-1 right-1 text-2xl md:text-4xl font-bold text-gray-800 hover:text-red-500"
          onClick={handleClosePopup}
          style={{ zIndex: 100 }}
        >
          <IoClose size={35} />
        </button>

        {/* Left Section with Images */}
        <div className="relative flex-shrink-0 w-full md:w-2/3 flex flex-col items-center md:items-start">
          <div className="flex items-center justify-center mb-2 md:mb-0">
            <img
              src={imageUrls[currentImageIndex]}
              alt={`Image ${currentImageIndex + 1}`}
              className="w-full md:w-3/4 h-auto max-h-60 object-cover rounded-lg ml-11"
            />
          </div>

          {imageUrls.length > 1 && (
            <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start md:mt-auto">
              {imageUrls.map((src, index) => (
                <img
                  key={index}
                  src={src}
                  alt={`Thumbnail ${index + 1}`}
                  className={`w-16 h-16 md:w-24 md:h-24 object-cover border-2 mt-20 mx-1 ${currentImageIndex === index ? 'border-red-500' : 'border-transparent'} cursor-pointer rounded`}
                  onClick={() => handleThumbnailClick(index)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Section with Texts */}
        <div className="flex-1 md:ml-4 flex flex-col items-center md:items-start">
          <p className="text-lg md:text-2xl font-bold mb-2">{name}</p>
          <p className="mb-2">{description}</p>

          {specs && (
            <div
              className="mb-4 overflow-auto"
              style={{
                maxHeight: '200px',
                minHeight: '150px',
                minWidth: '100%',
                boxShadow: specs.length > 200 ? 'inset 0 0 0 2px rgba(0, 0, 0, 0.2)' : 'none',
              }}
            >
              <p className="whitespace-pre-wrap">{specs}</p>
            </div>
          )}
          <p className="text-lg font-bold mb-2">Price: ${formatNumberWithCommas(price)}</p>

          <div className="flex items-center space-x-4 mb-4">
            {quantity > 0 ? (
              <div className="flex items-center space-x-2 mb-2">
                <button
                  onClick={handleDecreaseQuantity}
                  className="w-8 h-8 border-2 border-red-950 rounded-full text-xl hover:bg-red-900 hover:text-white transition-all duration-200 flex items-center justify-center focus:outline-none"
                >
                  -
                </button>
                <span className="text-xl">{quantity}</span>
                <button
                  onClick={handleIncreaseQuantity}
                  className="w-8 h-8 border-2 border-red-950 rounded-full text-xl hover:bg-red-900 hover:text-white transition-all duration-200 flex items-center justify-center focus:outline-none"
                >
                  +
                </button>
              </div>
            ) : (
              <button
                onClick={handleAddToCart}
                className="w-32 h-10 border-2 border-red-950 rounded-lg hover:bg-red-900 hover:text-white transition-all duration-300 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-red-700 focus:ring-opacity-50"
              >
                ADD TO CART
              </button>
            )}
          </div>

          {/* Review Section */}
          <ReviewSection itemId={id} /> {/* Pass the item ID here */}
        </div>
      </div>
    </div>
  );
}

export default ItemPopup;



