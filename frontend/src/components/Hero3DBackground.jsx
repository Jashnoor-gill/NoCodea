import React, { useEffect } from 'react';

const keyframes = `
@keyframes floatBall1 {
  0% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(60px, 40px) scale(1.08); }
  100% { transform: translate(0, 0) scale(1); }
}
@keyframes floatBall2 {
  0% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(-80px, -60px) scale(0.95); }
  100% { transform: translate(0, 0) scale(1); }
}
`;

const Hero3DBackground = () => {
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = keyframes;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {/* Ball 1 */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        left: '-10%',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle at 30% 30%, #7f5af0 0%, #2cb67d 100%)',
        opacity: 0.35,
        filter: 'blur(60px)',
        borderRadius: '50%',
        animation: 'floatBall1 14s ease-in-out infinite',
      }} />
      {/* Ball 2 */}
      <div style={{
        position: 'absolute',
        bottom: '-15%',
        right: '-10%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle at 70% 70%, #ff8906 0%, #f25f4c 100%)',
        opacity: 0.28,
        filter: 'blur(70px)',
        borderRadius: '50%',
        animation: 'floatBall2 18s ease-in-out infinite',
      }} />
    </div>
  );
};

export default Hero3DBackground; 