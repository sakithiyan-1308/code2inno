import React, { useMemo, useRef, useState, useEffect } from 'react';
import { useGLTF, useAnimations, OrbitControls } from '@react-three/drei';
import { useControls } from 'leva';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ALL_ROUTE_POINTS } from './LevelTrack';
import { useGameStore } from './useGameStore';

const PlayerVehicle = () => {
    // 1. Asset Loading (New GLB File)
    const group = useRef();
    const modelRef = useRef(); // Extra ref for independent rotation
    const controlsRef = useRef();
    const { scene, animations } = useGLTF('/optimized/spaceship_final.glb');
    const { actions } = useAnimations(animations, group);

    // 2. Leva Controls (Calibration)
    const { scale, rotation, hoverHeight, speed } = useControls('Vehicle Settings', {
        scale: { value: 0.1, min: 0.001, max: 0.5, step: 0.001 },
        rotation: { value: [0, 0, 0], step: 0.1 }, // Default rotation reset
        hoverHeight: { value: 3.0, min: 0.5, max: 5.0, step: 0.1 },
        speed: { value: 0.0001, min: 0.00001, max: 0.0005, step: 0.00001 }
    });

    // 3. Visual Enhancements
    useEffect(() => {
        if (scene) {
            scene.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    if (child.material) {
                        child.material.envMapIntensity = 2.0;
                        child.material.needsUpdate = true;
                    }
                }
            });
        }
    }, [scene]);

    // 4. Movement Logic (Rail System)
    const curve = useMemo(() => {
        return new THREE.CatmullRomCurve3(ALL_ROUTE_POINTS, true); // Closed path (Loop)
    }, []);

    const SCROLL_SPEED = speed;
    const targetProgress = useRef(0);
    const currentProgress = useRef(0);
    const isReversing = useRef(false); // Track direction

    // Navigation / Autopilot Logic
    const navigationTarget = useGameStore((state) => state.navigationTarget);
    const clearNavigationTarget = useGameStore((state) => state.clearNavigationTarget);

    useFrame((state, delta) => {
        if (navigationTarget !== null) {
            const current = targetProgress.current;
            const target = navigationTarget;
            const navSpeed = 0.5 * delta; // Adjust speed as needed

            // 1. Determine direction (Simple linear for now, since scroll is clamped 0-1)
            let diff = target - current;

            // 2. Move towards target
            if (Math.abs(diff) < 0.005) {
                // Snap and finish
                targetProgress.current = target;
                clearNavigationTarget();
            } else {
                targetProgress.current += Math.sign(diff) * Math.min(Math.abs(diff), navSpeed);
            }
        }
    });

    // Scroll Event Listener (Disabled when autopilot is running could be nice, but simple mix is fine)
    useEffect(() => {
        const handleWheel = (e) => {
            // Cancel autopilot if user interferes? Or just let them fight.
            // For now, let's clear autopilot on manual interaction to give control back.
            if (useGameStore.getState().navigationTarget !== null) {
                useGameStore.getState().clearNavigationTarget();
            }

            const delta = e.deltaY * SCROLL_SPEED;
            targetProgress.current += delta;

            // Direction Logic
            if (e.deltaY > 0) isReversing.current = false;
            if (e.deltaY < 0) isReversing.current = true;

            // Clamp targetProgress (Stop at ends)
            targetProgress.current = Math.max(0, Math.min(1, targetProgress.current));
        };

        window.addEventListener('wheel', handleWheel);
        return () => window.removeEventListener('wheel', handleWheel);
    }, [SCROLL_SPEED]);

    // Animation Logic
    const [isMoving, setIsMoving] = useState(false);

    useFrame(() => {
        const diff = Math.abs(targetProgress.current - currentProgress.current);
        setIsMoving(diff > 0.0001);
    });

    // Play animations
    useEffect(() => {
        if (actions && Object.keys(actions).length > 0) {
            const actionKey = Object.keys(actions)[0];
            const action = actions[actionKey];
            if (action) {
                if (isMoving) {
                    action.reset().fadeIn(0.2).play();
                } else {
                    action.fadeOut(0.5);
                }
            }
            return () => {
                if (action) action.fadeOut(0.5);
            };
        }
    }, [isMoving, actions]);

    // Hybrid Camera State
    const [isDragging, setDragging] = useState(false);

    useFrame((state) => {
        if (!curve || !group.current) return;

        // Smoothly interpolate currentProgress
        currentProgress.current = THREE.MathUtils.lerp(currentProgress.current, targetProgress.current, 0.1);
        const progress = Math.max(0, Math.min(1, currentProgress.current));

        // Sync to Store (Transient update to avoid re-renders)
        useGameStore.getState().setGameProgress(progress);

        // Position & Rotation Base
        const position = curve.getPointAt(progress);
        const tangent = curve.getTangentAt(progress).normalize();

        const trackOffset = new THREE.Vector3(0, 0.2, 0);
        const hoverOffset = new THREE.Vector3(0, hoverHeight, 0);

        group.current.position.copy(position).add(trackOffset).add(hoverOffset);

        // Look At (Target + Tangent) - Always look forward along path
        const lookAtTarget = group.current.position.clone().add(tangent);
        group.current.lookAt(lookAtTarget);

        // Reverse Rotation Logic (Flip the model 180 if reversing)
        if (modelRef.current) {
            // Target Y rotation: 0 if forward, Math.PI if reversing
            const targetRotY = isReversing.current ? Math.PI : 0;
            // Smoothly damp the rotation
            modelRef.current.rotation.y = THREE.MathUtils.lerp(modelRef.current.rotation.y, targetRotY, 0.1);
        }

        // Camera Follow Logic (Flip offset if reversing)
        const camera = state.camera;

        if (controlsRef.current) {
            controlsRef.current.target.copy(group.current.position);
            controlsRef.current.update();
        }

        if (!isDragging) {
            const camDist = 0.8;
            const camHeight = 0.4;

            // If reversing, camera goes "in front" of tangential point (which is behind the reversed ship)
            // Forward: -tangent (Behind)
            // Reverse: +tangent (Front of curve, but Behind ship)
            const targetTangentMult = isReversing.current ? camDist : -camDist;

            const cameraOffset = tangent.clone().multiplyScalar(targetTangentMult).add(new THREE.Vector3(0, camHeight, 0));
            const idealCameraPos = group.current.position.clone().add(cameraOffset);

            camera.position.lerp(idealCameraPos, 0.05);
            camera.lookAt(group.current.position);
        }
    });

    return (
        <group ref={group} dispose={null}>
            {/* Wrapper for Independent Rotation */}
            <group ref={modelRef}>
                <primitive
                    object={scene}
                    scale={[scale, scale, scale]}
                    rotation={rotation}
                />
            </group>

            <OrbitControls
                ref={controlsRef}
                enablePan={false}
                enableZoom={false}
                enableRotate={true}
                onStart={() => setDragging(true)}
                onEnd={() => setDragging(false)}
            />
        </group>
    );
};

export default PlayerVehicle;
