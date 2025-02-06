import React from 'react';
import './animations.css';
interface SmoothTextProps {
    content: string;
    windowSize?: number;
    delayMultiplier?: number;
    sep?: string;
    animation?: string;
    animationDuration?: string;
    animationTimingFunction?: string;
}
declare const SmoothAnimateText: React.FC<SmoothTextProps>;
export default SmoothAnimateText;
