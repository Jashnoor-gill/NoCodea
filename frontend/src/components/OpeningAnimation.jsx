import React, { useRef } from 'react';
import smokeVideo from '../assets/smoke.mp4';

const letters = ['N', 'O', 'C', 'O', 'D', 'E', 'A'];

const animationDelays = [
  '1s', '1.3s', '1.6s', '1.9s', '2.2s', '2.5s', '2.8s'
];

const OpeningAnimation = ({ onComplete }) => {
  const videoRef = useRef(null);

  // When the video ends, call onComplete to open the website
  const handleVideoEnd = () => {
    if (onComplete) onComplete();
  };

  return (
    <section style={{
      height: '100vh',
      backgroundColor: '#000',
      overflow: 'hidden',
      position: 'relative',
      margin: 0,
      padding: 0,
      boxSizing: 'border-box',
      fontFamily: "'Poppins', sans-serif"
    }}>
      <video
        ref={videoRef}
        src={smokeVideo}
        autoPlay
        muted
        playsInline
        onEnded={handleVideoEnd}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0,
          top: 0,
          left: 0,
        }}
      />
      {/* Colorful gradient overlay for colorful smoke */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          top: 0,
          left: 0,
          zIndex: 1,
          pointerEvents: 'none',
          background: 'linear-gradient(120deg, #ff0080, #7928ca, #00cfff, #00ffb8, #ffeb3b, #ff0080)',
          mixBlendMode: 'color',
        }}
      />
      <h1 style={{
        position: 'absolute',
        fontSize: '5em',
        color: '#fff',
        top: '50%',
        left: 0,
        width: '100%',
        textAlign: 'center',
        transform: 'translateY(-50%)',
        zIndex: 2,
        margin: 0,
        letterSpacing: '0.1em',
      }}>
        {letters.map((letter, idx) => (
          <span
            key={idx}
            style={{
              display: 'inline-block',
              opacity: 0,
              transform: 'rotateY(90deg)',
              filter: 'blur(15px)',
              animation: 'opening-animate 1s linear forwards',
              animationDelay: animationDelays[idx],
            }}
          >
            {letter}
          </span>
        ))}
      </h1>
      <style>{`
        @keyframes opening-animate {
          0% {
            opacity: 0;
            transform: rotateY(90deg);
            filter: blur(15px);
          }
          100% {
            opacity: 1;
            transform: rotateY(0deg);
            filter: blur(0px);
          }
        }
      `}</style>
    </section>
  );
};

export default OpeningAnimation; 