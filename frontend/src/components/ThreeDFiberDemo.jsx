import React from 'react';
import { Canvas } from '@react-three/fiber';

function Box() {
  return (
    <mesh rotation={[Math.PI / 4, Math.PI / 4, 0]} position={[0, 0, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={'#3b82f6'} />
    </mesh>
  );
}

const ThreeDFiberDemo = () => (
  <div style={{ width: '100%', height: 300, background: '#18181b', borderRadius: 16, overflow: 'hidden' }}>
    <Canvas camera={{ position: [2, 2, 2] }}>
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <Box />
    </Canvas>
  </div>
);

export default ThreeDFiberDemo; 