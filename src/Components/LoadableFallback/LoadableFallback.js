import React from 'react'
import './LoadbleFallback.css'

export default function LoadableFallback() {
    return (
        <div className="LoadableFallback_container_loader">
            <div className="lds-dual-ring-lazy"></div>
        </div>
    )
}
