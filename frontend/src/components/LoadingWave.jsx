import React from 'react';
import Lottie from 'lottie-react';
import loadingAnimation from '../assets/lottie/loading-spinner.json';

const LoadingWave = ({ text = 'Loading...' }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center z-50">
      <div className="w-48 h-48">
        <Lottie animationData={loadingAnimation} loop={true} />
      </div>
      <p className="text-white text-xl font-semibold mt-4">{text}</p>
    </div>
  );
};

export default LoadingWave; 