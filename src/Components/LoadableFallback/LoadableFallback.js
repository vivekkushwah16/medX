import React from 'react'
import './LoadbleFallback.css'

export default function LoadableFallback(props) {
    return (
        <div className="LoadableFallback_container_loader" style={props.tranparentBg ? { background: 'transparent' } : {}}>
            <div className="lds-dual-ring-lazy"></div>
        </div>
    )
}
