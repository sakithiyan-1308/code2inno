import React, { useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const SkyBackground = () => {
    const gltf = useGLTF('/optimized/golden_horizon_final.glb');

    useEffect(() => {
        if (gltf.scene) {
            gltf.scene.traverse((child) => {
                if (child.isMesh) {
                    console.log("Skybox Mesh Found:", child.name);

                    // Render on the inside of the sphere
                    child.material.side = THREE.BackSide;

                    // Crucial: Draw this first, behind everything else
                    child.material.depthWrite = false;

                    // 1. Reset Color: ensure texture shows true colors
                    child.material.color.set('white');

                    // 2. Disable Fog & ToneMapping: ensure crisp, bright colors
                    child.material.fog = false;
                    child.material.toneMapped = false;

                    // Ensure basic material properties aren't culling or hiding it
                    child.material.transparent = false;

                    child.castShadow = false;
                    child.receiveShadow = false;
                }
            });
        }
    }, [gltf]);

    return (
        <primitive
            object={gltf.scene}
            scale={[1000, 1000, 1000]} // Massive scale to wrap the city
        />
    );
};

export default SkyBackground;
