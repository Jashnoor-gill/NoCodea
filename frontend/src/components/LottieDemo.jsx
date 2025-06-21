import React from 'react';
import Lottie from 'lottie-react';
import rocketAnimation from './rocket-lottie.json'; // We'll use a local file for reliability

const LottieDemo = () => (
  <div style={{ width: 300, height: 300, background: '#18181b', borderRadius: 16, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <Lottie animationData={rocketAnimation} loop={true} style={{ width: 220, height: 220 }} />
  </div>
);

export default LottieDemo; 