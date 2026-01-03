import { Canvas, useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { Float, Stars, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

const FloatingShape = ({ position, color, speed }) => {
    const meshRef = useRef();

    useFrame((state, delta) => {
        meshRef.current.rotation.x += delta * speed;
        meshRef.current.rotation.y += delta * speed * 0.5;
    });

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
            <mesh ref={meshRef} position={position}>
                <torusKnotGeometry args={[1, 0.3, 100, 16]} />
                <meshStandardMaterial color={color} roughness={0.3} metalness={0.8} />
            </mesh>
        </Float>
    );
};

const ThreeScene = () => {
    return (
        <div className="fixed inset-0 z-0 h-full w-full pointer-events-none">
            <Canvas>
                <PerspectiveCamera makeDefault position={[0, 0, 10]} />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8b5cf6" />

                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

                <FloatingShape position={[-4, 2, -5]} color="#3b82f6" speed={0.2} />
                <FloatingShape position={[4, -2, -6]} color="#a855f7" speed={0.3} />
                <FloatingShape position={[0, 3, -8]} color="#ec4899" speed={0.1} />

                <fog attach="fog" args={['#0f172a', 5, 20]} />
            </Canvas>
        </div>
    );
};

export default ThreeScene;
