import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './CityScene.css'

// Ensure React 18 createRoot is used
ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)
