'use client';
import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Stage } from '@react-three/drei';
import { useGLTF } from '@react-three/drei';

function Model({ url }) {
  const { scene } = useGLTF(url);
  const ref = useRef();

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    }
  });

  return <primitive ref={ref} object={scene} scale={1.5} />;
}

function FallbackBox() {
  const ref = useRef();
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.getElapsedTime() * 0.5;
      ref.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.2;
    }
  });

  return (
    <mesh ref={ref}>
      <boxGeometry args={[1.5, 1.5, 1.5]} />
      <meshStandardMaterial
        color="#00F5FF"
        emissive="#00F5FF"
        emissiveIntensity={0.3}
        metalness={0.8}
        roughness={0.2}
        wireframe
      />
    </mesh>
  );
}

export default function ModelViewer({ modelUrl, height = 400 }) {
  return (
    <div
      className="relative rounded-none overflow-hidden border border-cyan/20"
      style={{ height }}
    >
      {/* Corner decorations */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-cyan z-10" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-cyan z-10" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-cyan z-10" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-cyan z-10" />

      <Canvas
        camera={{ position: [0, 0, 4], fov: 50 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} color="#00F5FF" intensity={1} />
        <pointLight position={[-10, -10, -10]} color="#FFD700" intensity={0.5} />

        <Suspense fallback={null}>
          {modelUrl ? (
            <Stage environment="city" intensity={0.5}>
              <Model url={modelUrl} />
            </Stage>
          ) : (
            <FallbackBox />
          )}
        </Suspense>

        <OrbitControls
          enableZoom={false}
          autoRotate={false}
          enablePan={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI * 0.75}
        />
      </Canvas>

      {/* Label */}
      <div className="absolute bottom-3 left-3">
        <span className="text-[9px] font-mono text-cyan/40 tracking-widest uppercase">
          ◈ 3D PREVIEW — DRAG TO ROTATE
        </span>
      </div>
    </div>
  );
}
