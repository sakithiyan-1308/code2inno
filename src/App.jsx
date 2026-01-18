import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import LevelTrack from './LevelTrack';
import Checkpoints from './Checkpoints';
import CityModel from './CityModel';
import PlayerVehicle from './PlayerVehicle';
import ModelErrorBoundary from './ModelErrorBoundary';

import SkyBackground from './SkyBackground';
import SideNote from './SideNote';
import PlaystationInput from './PlaystationInput';

import Loader from './Loader';

import { useMemo } from 'react';
import { getDeviceCapabilities } from './utils/DeviceCapabilities';

const App = () => {
    const device = useMemo(() => getDeviceCapabilities(), []);

    return (
        <>
            <SideNote />
            <PlaystationInput />
            <Canvas
                shadows={device.shadows}
                dpr={device.dpr}
                camera={{ position: [10, 10, 10], fov: 60, far: 10000 }}
                style={{ width: '100vw', height: '100vh', background: '#111' }}
                gl={{ toneMappingExposure: 1.0, antialias: device.postProcessing }}
            >
                <Suspense fallback={<Loader />}>
                    {/* 1. The Sky (Background Layer) */}
                    <SkyBackground />

                    {/* 2. The World (Foreground Layer) */}
                    {/* Lighting setup for Sunrise */}
                    <Environment files="/hdr/venice_sunset_1k.hdr" background={false} />
                    <hemisphereLight args={['#ffaa00', '#000000', 0.01]} />
                    <ambientLight intensity={0.01} color="#ffaa00" />
                    <directionalLight position={[50, 50, 50]} intensity={20} color="#ffddaa" castShadow />
                    <pointLight position={[-5, 5, -5]} intensity={20} color="#00ffcc" />

                    {/* --- GAME WORLD --- */}
                    <CityModel />

                    {/* Remove explicit fog or ensure it matches the skybox if needed */}
                    {/* <fogExp2 attach="fog" args={['#ffcc00', 0.002]} /> */}

                    {/* --- LEVEL TRACK (LIFTED) --- */}
                    <LevelTrack position={[0, 0.2, 0]} />
                    <Checkpoints />

                    {/* --- PLAYER --- */}
                    <ModelErrorBoundary>
                        <PlayerVehicle />
                    </ModelErrorBoundary>

                </Suspense>
            </Canvas>
        </>
    );
};

export default App;
