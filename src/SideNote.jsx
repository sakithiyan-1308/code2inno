import React from 'react';
import { useGameStore } from './useGameStore';

const SideNote = () => {
    const { activeNote, closeNote } = useGameStore();

    if (!activeNote) return null;

    return (
        <div className="side-note-container">
            <div className="side-note-content">
                <div className="side-note-header">
                    <span>SYSTEM_MSG_LOG</span>
                    <span>[ REC ]</span>
                </div>
                <div className="side-note-text">
                    {activeNote}
                </div>
            </div>
        </div>
    );
};

export default SideNote;
