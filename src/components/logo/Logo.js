import React from "react";
import Tilt from 'react-parallax-tilt';
import './Logo.css';
import eye from './eye.png';

const Logo = () => {
    return (
        <div className="ma4 mt0">
            <Tilt className="Tilt br2 shadow-2" 
                    scale={1.5} 
                    tiltReverse={true} 
                    glareEnable={true} 
                    glareMaxOpacity={0.5} 
                    glareColor="lightblue" 
                    glarePosition="all" 
                    style={{ height: 100, width: 100 }} >
                <div className="Tilt-inner pa3">
                    <img src={eye} alt="logo" />
                </div>
            </Tilt>
        </div>
    );
}

export default Logo;