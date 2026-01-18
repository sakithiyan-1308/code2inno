import React from 'react';
import './PlaystationInput.css';

/* From Uiverse.io by Novaxlo */
import { useGameStore } from './useGameStore';

/* From Uiverse.io by Novaxlo */
const PlaystationInput = () => {
    const setNavigationTarget = useGameStore((state) => state.setNavigationTarget);

    const handleTeleport = (target) => {
        setNavigationTarget(target);
    };

    return (
        <div className="playstation-container">
            <div className="playstation-input">
                <div id="cross-input">
                    <div id="cross-title">CHECKPOINT 1</div>
                    <button id="cross" onClick={() => handleTeleport(0.15)}><p>x</p></button>
                </div>
                <div id="circle-input">
                    <div id="circle-title">CHECKPOINT 2</div>
                    <button id="circle" onClick={() => handleTeleport(0.30)}><div></div></button>
                </div>
                <div id="square-input">
                    <div id="square-title">CHECKPOINT 3</div>
                    <button id="square" onClick={() => handleTeleport(0.45)}><div></div></button>
                </div>
                <div id="triangle-input">
                    <div id="triangle-title">CHECKPOINT 4</div>
                    <button id="triangle" onClick={() => handleTeleport(0.60)}><p>△</p></button>
                </div>
            </div>
        </div>
    );
};

export default PlaystationInput;
