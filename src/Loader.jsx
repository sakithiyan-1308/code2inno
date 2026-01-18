import React from 'react';
import { useProgress, Html } from '@react-three/drei';

const Loader = () => {
    const { progress } = useProgress();
    return (
        <Html center>
            <div id="global-loader" style={{
                color: '#00ffcc',
                fontFamily: 'monospace',
                textAlign: 'center',
                background: 'rgba(0,0,0,0.8)',
                padding: '20px',
                borderRadius: '8px',
                border: '1px solid #00ffcc'
            }}>
                <h1 style={{ fontSize: '1.5rem', margin: '0 0 10px 0' }}>SYSTEM INITIALIZING</h1>
                <div style={{ width: '200px', height: '4px', background: '#333', margin: '0 auto' }}>
                    <div style={{ width: `${progress}%`, height: '100%', background: '#00ffcc', transition: 'width 0.2s' }}></div>
                </div>
                <p style={{ margin: '10px 0 0 0' }}>{Math.round(progress)}%</p>
            </div>
        </Html>
    );
};

export default Loader;
