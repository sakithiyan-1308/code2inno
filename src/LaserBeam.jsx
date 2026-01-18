import React, { useRef } from 'react';
import { useFrame, extend } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Create the Shader Material
const LaserBeamMaterial = shaderMaterial(
    {
        uTime: 0,
        uColor: new THREE.Color('#FF6800'), // Default Orange
    },
    // Vertex Shader
    `
    varying vec2 vUv;
    varying vec3 vPosition;
    
    void main() {
        vUv = uv;
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
    `,
    // Fragment Shader
    `
    uniform vec3 uColor;
    varying vec2 vUv;

void main() {
        // Static alpha gradient (fades out at top)
        float alpha = 1.0 - smoothstep(0.0, 1.0, vUv.y);

        // Core glow: brighter in center of the beam (horizontally)
        float core = 1.0 - abs(vUv.x - 0.5) * 2.0;
    core = pow(core, 4.0); // Make it sharp

    // Combine soft edge and core
    alpha *= (0.5 + core * 0.8);

    gl_FragColor = vec4(uColor * 2.0, alpha);
}
`
);

// Register the material so it can be used as <laserBeamMaterial />
extend({ LaserBeamMaterial });

const LaserBeam = ({ position, color = '#FF6800', radius = 0.25, height = 250 }) => {
    const materialRef = useRef();

    useFrame(() => {
        if (materialRef.current) {
            materialRef.current.uColor.set(color);
        }
    });

    return (
        <group position={position}>
            <mesh>
                {/* Cylinder: radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded */}
                {/* THINNER: 0.25 radius, Height 500 */}
                <cylinderGeometry args={[radius, radius, height, 32, 1, true]} />
                <laserBeamMaterial
                    ref={materialRef}
                    transparent
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                    side={THREE.DoubleSide}
                />
            </mesh>
        </group>
    );
};

export default LaserBeam;
