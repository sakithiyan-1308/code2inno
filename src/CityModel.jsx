import React, { useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { useControls } from 'leva';
import * as THREE from 'three';

const CityModel = () => {
    const gltf = useGLTF('/scene.gltf');

    // 1. Leva Controls
    const { envMapIntensity, fogColor, fogDensity } = useControls('City Atmosphere', {
        envMapIntensity: { value: 1.0, min: 0.0, max: 5.0, step: 0.1 },
        fogColor: { value: '#101010' },
        fogDensity: { value: 0.02, min: 0.0, max: 0.1, step: 0.001 }
    });

    // 2. Material Handling
    useEffect(() => {
        if (gltf.scene) {
            // Auto-centering
            const box = new THREE.Box3().setFromObject(gltf.scene);
            const center = box.getCenter(new THREE.Vector3());
            gltf.scene.position.x = -center.x;
            gltf.scene.position.z = -center.z;
            gltf.scene.position.y = -box.min.y;

            gltf.scene.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;

                    if (child.material) {
                        // Apply Environment Map Intensity
                        // Reflections: Set child.material.envMapIntensity = 1.5.
                        child.material.envMapIntensity = 1.5;

                        // Check for "Black/Dark" materials to convert to Glass
                        const color = child.material.color;
                        const isDark = color.r < 0.1 && color.g < 0.1 && color.b < 0.1;

                        if (isDark) {
                            // GLASS EFFECT (Reflective Opaque)
                            child.material.color.set('#aaccff'); // Light Blue tint
                            child.material.transparent = false; // Opaque as requested
                            child.material.opacity = 1.0;
                            child.material.roughness = 0.05; // Smooth
                            child.material.metalness = 0.9; // Reflective
                            child.material.side = THREE.DoubleSide; // Render both sides
                        } else {
                            // NORMAL BUILDINGS: Tint Golden
                            // Tint: Don't fully overwrite the colors, but tint them using child.material.color.lerp
                            child.material.color.lerp(new THREE.Color('#ffaa00'), 0.1);
                        }

                        // Force Vertex Colors (Common issue for "missing colors" in GLTF export)
                        child.material.vertexColors = true;

                        // Texture Fix logic
                        if (child.material.map) {
                            child.material.map.colorSpace = THREE.SRGBColorSpace;
                        }

                        child.material.needsUpdate = true;
                    }
                }
            });
        }
    }, [gltf, envMapIntensity]);

    return (
        <group>
            {/* Atmosphere (Disabled to show Skybox) */}
            {/* The Golden Fog (Crucial) */}
            <fog attach="fog" args={['#ffaa00', 10, 800]} />

            {/* <color attach="background" args={[fogColor]} /> */}
            {/* <fogExp2 attach="fog" args={[fogColor, fogDensity]} /> */}

            {/* Render Model */}
            <primitive object={gltf.scene} scale={[1, 1, 1]} />
        </group>
    );
};

export default CityModel;
