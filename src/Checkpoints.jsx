import React, { useMemo, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
// import { useGLTF } from '@react-three/drei';
import { ALL_ROUTE_POINTS } from './LevelTrack';
import LaserBeam from './LaserBeam';
import { useGameStore } from './useGameStore';

const NOTES = [
    "Checkpoint 1: Welcome to Neo-Tokyo Outer Rim.",
    "Checkpoint 2: Caution: High Drone Activity.",
    "Checkpoint 3: Entering Industrial Zone 4.",
    "Checkpoint 4: Speed Boost Available in 500m.",
    "Checkpoint 5: Final Stretch - Approach City Center."
];

const CheckpointItem = ({ position, active }) => {
    return (
        <group position={position}>
            {/* Thin Laser Beam shooting up */}
            <LaserBeam
                position={[0, 125, 0]}
                radius={0.05}
                height={250}
                color={active ? '#00FF00' : '#FF6800'}
            />
        </group>
    );
};

const Checkpoints = () => {
    // Generate points along the curve
    const checkpoints = useMemo(() => {
        const points = [];
        // indices: 0.15, 0.30, 0.45, 0.60, 0.75
        const tValues = [0.15, 0.30, 0.45, 0.60, 0.75];

        // We need the curve from LevelTrack to be accessible or recreated.
        // Since ALL_ROUTE_POINTS are exported, we can recreate the curve or just sample.
        // Ideally we should export the curve or a helper, but for now we'll recreate it cheaply 
        // or just use the logic from previous Checkpoints implementation if it was working.

        // RE-CREATING CURVE (Optimized: create once)
        const curve = new THREE.CatmullRomCurve3(
            ALL_ROUTE_POINTS.map(p => new THREE.Vector3(...p)),
            true // closed -> true (Restore original Loop)
        );

        tValues.forEach(t => {
            const point = curve.getPointAt(t);
            points.push([point.x, point.y, point.z]);
        });

        return points;
    }, []);

    const setNote = useGameStore((state) => state.setNote);
    const activeNote = useGameStore((state) => state.activeNote); // Read strictly for comparison
    const [activeIndex, setActiveIndex] = useState(-1);

    useFrame(() => {
        // Read progress directly from store to avoid re-renders
        const progress = useGameStore.getState().gameProgress;

        // Checkpoint T-Values matching the position generation
        const tValues = [0.15, 0.30, 0.45, 0.60, 0.75];
        const THRESHOLD = 0.015; // Tighter threshold for accuracy

        let foundIndex = -1;

        for (let i = 0; i < tValues.length; i++) {
            if (Math.abs(progress - tValues[i]) < THRESHOLD) {
                foundIndex = i;
                break;
            }
        }

        // Update Store only if changed
        if (foundIndex !== -1) {
            const targetNote = NOTES[foundIndex] || "Unknown Checkpoint";
            if (activeNote !== targetNote) {
                setNote(targetNote);
            }
        } else {
            if (activeNote !== null) {
                setNote(null);
            }
        }

        // Update Local Visual State
        if (activeIndex !== foundIndex) {
            setActiveIndex(foundIndex);
        }
    });

    return (
        <group>
            {checkpoints.map((pos, index) => (
                <CheckpointItem
                    key={index}
                    position={pos}
                    active={index === activeIndex}
                />
            ))}
        </group>
    );
};

export default Checkpoints;
