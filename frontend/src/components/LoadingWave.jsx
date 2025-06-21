import React, { useEffect, useState } from 'react';

const LoadingWave = ({ duration = 2500, onFinish }) => {
  const [visible, setVisible] = useState(true);
  const [activeLines, setActiveLines] = useState(0);

  // Array of lines with different delays/colors
  const lines = [
    { color: '#7f5af0', y: 60 },
    { color: '#2cb67d', y: 100 },
    { color: '#ff8906', y: 140 },
    { color: '#f25f4c', y: 180 },
    { color: '#43d9ad', y: 220 },
  ];

  // Animate lines one by one, each starts when previous is halfway
  useEffect(() => {
    let timeouts = [];
    lines.forEach((_, i) => {
      timeouts.push(setTimeout(() => setActiveLines(i + 1), i * 400));
    });
    // Hide loader after all lines finish
    const totalDuration = 400 * (lines.length - 1) + 2000;
    const hideTimeout = setTimeout(() => {
      setVisible(false);
      if (onFinish) onFinish();
    }, totalDuration);
    return () => {
      timeouts.forEach(clearTimeout);
      clearTimeout(hideTimeout);
    };
  }, [onFinish, lines.length]);

  if (!visible) return null;

  // CSS keyframes for moving lines
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes waveLine {
        0% { transform: translateX(-120vw); opacity: 0.0; }
        10% { opacity: 0.7; }
        20% { opacity: 1; }
        80% { opacity: 1; }
        100% { transform: translateX(120vw); opacity: 0.0; }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Helper for thick-in-middle path (simulate by overlaying a blurred, thick path)
  function ThickWave({ d, color, delay }) {
    return (
      <>
        <path
          d={d}
          stroke={color}
          strokeWidth="18"
          fill="none"
          strokeLinecap="round"
          style={{
            filter: 'blur(16px)',
            opacity: 0.25,
            animation: `waveLine 2s cubic-bezier(.4,1,.6,1) ${delay}ms forwards`,
            animationFillMode: 'forwards',
          }}
        />
        <path
          d={d}
          stroke={color}
          strokeWidth="7"
          fill="none"
          strokeLinecap="round"
          style={{
            filter: 'blur(6px)',
            opacity: 0.85,
            animation: `waveLine 2s cubic-bezier(.4,1,.6,1) ${delay}ms forwards`,
            animationFillMode: 'forwards',
          }}
        />
      </>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      background: 'linear-gradient(135deg, #18181b 60%, #232946 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'opacity 0.6s',
      opacity: visible ? 1 : 0,
    }}>
      <svg width="100vw" height="320" viewBox="0 0 1440 320" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100vw', height: 320 }}>
        {lines.slice(0, activeLines).map((line, i) => (
          <ThickWave
            key={i}
            d={`M0,${line.y} Q360,${line.y-40} 720,${line.y} T1440,${line.y}`}
            color={line.color}
            delay={i * 400}
          />
        ))}
      </svg>
    </div>
  );
};

export default LoadingWave; 