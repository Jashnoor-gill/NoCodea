import React, { useEffect, useRef, useState } from 'react';
import './OpeningAnimation.css';

const OpeningAnimation = ({ onComplete }) => {
  const canvasRef = useRef(null);
  const [isComplete, setIsComplete] = useState(false);
  const [particles, setParticles] = useState([]);
  const [codeLines, setCodeLines] = useState([]);

  // NC logo path coordinates (detailed for particles)
  const logoPath = [
    // N shape - left vertical line
    { x: 0.15, y: 0.2 }, { x: 0.15, y: 0.25 }, { x: 0.15, y: 0.3 }, { x: 0.15, y: 0.35 },
    { x: 0.15, y: 0.4 }, { x: 0.15, y: 0.45 }, { x: 0.15, y: 0.5 }, { x: 0.15, y: 0.55 },
    { x: 0.15, y: 0.6 }, { x: 0.15, y: 0.65 }, { x: 0.15, y: 0.7 }, { x: 0.15, y: 0.75 },
    { x: 0.15, y: 0.8 },
    
    // N shape - diagonal line
    { x: 0.18, y: 0.25 }, { x: 0.21, y: 0.3 }, { x: 0.24, y: 0.35 }, { x: 0.27, y: 0.4 },
    { x: 0.3, y: 0.45 }, { x: 0.33, y: 0.5 }, { x: 0.36, y: 0.55 }, { x: 0.39, y: 0.6 },
    { x: 0.42, y: 0.65 }, { x: 0.45, y: 0.7 },
    
    // N shape - right vertical line
    { x: 0.45, y: 0.2 }, { x: 0.45, y: 0.25 }, { x: 0.45, y: 0.3 }, { x: 0.45, y: 0.35 },
    { x: 0.45, y: 0.4 }, { x: 0.45, y: 0.45 }, { x: 0.45, y: 0.5 }, { x: 0.45, y: 0.55 },
    { x: 0.45, y: 0.6 }, { x: 0.45, y: 0.65 }, { x: 0.45, y: 0.7 }, { x: 0.45, y: 0.75 },
    { x: 0.45, y: 0.8 },
    
    // C shape - top horizontal (more open)
    { x: 0.55, y: 0.2 }, { x: 0.6, y: 0.2 }, { x: 0.65, y: 0.2 }, { x: 0.7, y: 0.2 },
    { x: 0.75, y: 0.2 }, { x: 0.8, y: 0.2 }, { x: 0.85, y: 0.2 },
    
    // C shape - left vertical
    { x: 0.55, y: 0.25 }, { x: 0.55, y: 0.3 }, { x: 0.55, y: 0.35 }, { x: 0.55, y: 0.4 },
    { x: 0.55, y: 0.45 }, { x: 0.55, y: 0.5 }, { x: 0.55, y: 0.55 }, { x: 0.55, y: 0.6 },
    { x: 0.55, y: 0.65 }, { x: 0.55, y: 0.7 }, { x: 0.55, y: 0.75 },
    
    // C shape - bottom horizontal (more open)
    { x: 0.6, y: 0.8 }, { x: 0.65, y: 0.8 }, { x: 0.7, y: 0.8 }, { x: 0.75, y: 0.8 },
    { x: 0.8, y: 0.8 }, { x: 0.85, y: 0.8 },
    
    // C shape - top curve (more angular, less rounded)
    { x: 0.6, y: 0.25 }, { x: 0.65, y: 0.25 }, { x: 0.7, y: 0.25 }, { x: 0.75, y: 0.25 },
    { x: 0.8, y: 0.25 }, { x: 0.85, y: 0.25 }, { x: 0.85, y: 0.3 }, { x: 0.85, y: 0.35 },
    
    // C shape - bottom curve (more angular, less rounded)
    { x: 0.85, y: 0.65 }, { x: 0.85, y: 0.7 }, { x: 0.85, y: 0.75 }, { x: 0.8, y: 0.75 },
    { x: 0.75, y: 0.75 }, { x: 0.7, y: 0.75 }, { x: 0.65, y: 0.75 }, { x: 0.6, y: 0.75 },
    
    // Additional fill points for better coverage
    { x: 0.18, y: 0.35 }, { x: 0.21, y: 0.4 }, { x: 0.24, y: 0.45 }, { x: 0.27, y: 0.5 },
    { x: 0.3, y: 0.55 }, { x: 0.33, y: 0.6 }, { x: 0.36, y: 0.65 }, { x: 0.39, y: 0.7 },
    { x: 0.42, y: 0.75 }, { x: 0.18, y: 0.4 }, { x: 0.21, y: 0.45 }, { x: 0.24, y: 0.5 },
    { x: 0.27, y: 0.55 }, { x: 0.3, y: 0.6 }, { x: 0.33, y: 0.65 }, { x: 0.36, y: 0.7 },
    { x: 0.39, y: 0.75 }, { x: 0.42, y: 0.8 }
  ];

  // Generate random code lines for background
  const generateCodeLines = () => {
    const lines = [];
    const codeSnippets = [
      'const data = await fetch("/api/stream");',
      'function processMatrix(matrix) {',
      'neural_network.forward(activation);',
      'cyberpunk_2077.init();',
      'quantum_state.measure();',
      'blockchain.verify(transaction);',
      'ai_model.predict(input_data);',
      'crypto_hash = sha256(data);',
      'virtual_reality.render();',
      'machine_learning.train(dataset);'
    ];

    for (let i = 0; i < 15; i++) {
      lines.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        text: codeSnippets[Math.floor(Math.random() * codeSnippets.length)],
        opacity: Math.random() * 0.3 + 0.1,
        speed: Math.random() * 0.5 + 0.2,
        flicker: Math.random() * 0.5
      });
    }
    return lines;
  };

  // Generate particles streaming from edges
  const generateParticles = () => {
    const newParticles = [];
    const numParticles = 300; // Increased for better logo formation

    for (let i = 0; i < numParticles; i++) {
      const side = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
      let x, y, vx, vy;

      switch (side) {
        case 0: // top
          x = Math.random() * window.innerWidth;
          y = -20;
          vx = (Math.random() - 0.5) * 2;
          vy = Math.random() * 3 + 1;
          break;
        case 1: // right
          x = window.innerWidth + 20;
          y = Math.random() * window.innerHeight;
          vx = -(Math.random() * 3 + 1);
          vy = (Math.random() - 0.5) * 2;
          break;
        case 2: // bottom
          x = Math.random() * window.innerWidth;
          y = window.innerHeight + 20;
          vx = (Math.random() - 0.5) * 2;
          vy = -(Math.random() * 3 + 1);
          break;
        case 3: // left
          x = -20;
          y = Math.random() * window.innerHeight;
          vx = Math.random() * 3 + 1;
          vy = (Math.random() - 0.5) * 2;
          break;
      }

      newParticles.push({
        x,
        y,
        vx,
        vy,
        size: Math.random() * 3 + 1,
        color: Math.random() > 0.5 ? '#00ff41' : '#bf00ff', // neon green or purple
        targetX: 0,
        targetY: 0,
        arrived: false,
        glow: Math.random() * 0.5 + 0.5
      });
    }

    return newParticles;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize particles and code lines
    setParticles(generateParticles());
    setCodeLines(generateCodeLines());

    let animationId;
    let frameCount = 0;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw flickering code lines
      codeLines.forEach((line, index) => {
        const flicker = Math.sin(frameCount * line.speed + line.flicker) * 0.5 + 0.5;
        ctx.fillStyle = `rgba(0, 255, 65, ${line.opacity * flicker})`;
        ctx.font = '12px "Courier New", monospace';
        ctx.fillText(line.text, line.x, line.y);
        
        // Move code lines
        line.y += line.speed;
        if (line.y > canvas.height) {
          line.y = -20;
          line.x = Math.random() * canvas.width;
        }
      });

      // Update and draw particles
      setParticles(prevParticles => {
        const updatedParticles = prevParticles.map((particle, index) => {
          if (!particle.arrived) {
            // Calculate target position for NC logo
            const targetIndex = index % logoPath.length;
            const target = logoPath[targetIndex];
            const targetX = centerX + (target.x - 0.5) * 300; // Increased size
            const targetY = centerY + (target.y - 0.5) * 300; // Increased size

            // Move towards target
            const dx = targetX - particle.x;
            const dy = targetY - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 5) {
              particle.arrived = true;
              particle.x = targetX;
              particle.y = targetY;
            } else {
              particle.x += dx * 0.02;
              particle.y += dy * 0.02;
            }
          }

          // Draw particle with glow effect
          const gradient = ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, particle.size * 3
          );
          gradient.addColorStop(0, particle.color);
          gradient.addColorStop(1, 'transparent');

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
          ctx.fill();

          // Draw core particle
          ctx.fillStyle = particle.color;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();

          return particle;
        });

        // Check if all particles have arrived
        const allArrived = updatedParticles.every(p => p.arrived);
        if (allArrived && !isComplete) {
          setTimeout(() => {
            setIsComplete(true);
            onComplete && onComplete();
          }, 2000);
        }

        return updatedParticles;
      });

      frameCount++;
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, [isComplete, onComplete]);

  if (isComplete) {
    return null;
  }

  return (
    <div className="opening-animation">
      <canvas
        ref={canvasRef}
        className="animation-canvas"
      />
      <div className="loading-text">
        <span className="neon-text">INITIALIZING</span>
        <div className="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
};

export default OpeningAnimation; 