import React from 'react';
interface SmoothTextProps {
    incomingText: string;
    windowSize: number;
    delayMultiplier?: number;
}
declare const SmoothText: React.FC<SmoothTextProps>;
export default SmoothText;
