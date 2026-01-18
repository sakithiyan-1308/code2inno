import React, { useMemo } from 'react';
import * as THREE from 'three';
import { extend } from '@react-three/fiber';

// --- DATA ---
const START_POINT = new THREE.Vector3(9.92, 0.13, 9.66);

const CHECKPOINTS = [
    new THREE.Vector3(9.92, 0.13, 9.66), // Start
    new THREE.Vector3(5.23, 0.13, 7.27),
    new THREE.Vector3(2.85, 0.15, 2.94),
    new THREE.Vector3(1.74, 0.14, 1.63)
];

export const ALL_ROUTE_POINTS = [
    new THREE.Vector3(-4.779, 0.525, 9.344),
    new THREE.Vector3(-4.771, 0.404, 7.956),
    new THREE.Vector3(-4.771, 0.403, 7.942),
    new THREE.Vector3(0.071, 0.234, 7.844),
    new THREE.Vector3(0.071, 0.234, 7.838),
    new THREE.Vector3(1.377, 0.234, 6.707),
    new THREE.Vector3(1.518, 0.234, 5.920),
    new THREE.Vector3(1.405, 0.234, 5.177),
    new THREE.Vector3(1.622, 0.234, 3.968),
    new THREE.Vector3(1.772, 0.234, 1.796),
    new THREE.Vector3(3.010, 0.254, 0.941),
    new THREE.Vector3(3.011, 0.254, 0.940),
    new THREE.Vector3(1.563, 0.234, -1.558),
    new THREE.Vector3(-0.366, 0.234, -3.730),
    new THREE.Vector3(-0.364, 0.234, -3.734),
    new THREE.Vector3(-0.808, 0.234, -5.911),
    new THREE.Vector3(-4.763, 0.234, -6.112),
    new THREE.Vector3(-4.792, 0.234, -6.044)
];

const LevelTrack = (props) => {
    const curve = useMemo(() => {
        return new THREE.CatmullRomCurve3(ALL_ROUTE_POINTS, true); // Closed loop
    }, []);

    return (
        <group {...props}>
            {/* --- ROAD SURFACE --- */}
            <mesh scale={[1, 0.05, 1]}>
                <tubeGeometry args={[curve, 600, 0.15, 8, true]} />
                <meshStandardMaterial color="#222" roughness={0.8} />
            </mesh>

            {/* --- CENTER LINE (Hidden) --- */}
            {/* <mesh position={[0, 0.02, 0]}>
                <tubeGeometry args={[curve, 600, 0.02, 8, true]} />
                <meshBasicMaterial color="#FFD700" />
            </mesh> */}

            {/* --- CHECKPOINTS --- */}
            {/* --- CHECKPOINTS (Hidden) --- */}
            {/* {CHECKPOINTS.map((point, index) => (
                <mesh key={index} position={[point.x, point.y + 0.02, point.z]}>
                    <cylinderGeometry args={[0.3, 0.3, 0.05, 32]} />
                    <meshBasicMaterial color="#00ff00" toneMapped={false} />
                </mesh>
            ))} */}
        </group>
    );
};

export default LevelTrack;
