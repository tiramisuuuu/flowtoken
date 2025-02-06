"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const SmoothText = ({ incomingText, windowSize, delayMultiplier = 1.1 }) => {
    const [tokens, setTokens] = (0, react_1.useState)([]);
    const [displayedText, setDisplayedText] = (0, react_1.useState)('');
    const [receivedText, setReceivedText] = (0, react_1.useState)(''); // Dummy state to trigger useEffect
    const timerHandles = (0, react_1.useRef)([]);
    const lastTokenTime = (0, react_1.useRef)(performance.now());
    const lastDisplayTime = (0, react_1.useRef)(performance.now());
    const lastScheduledTime = (0, react_1.useRef)(0);
    (0, react_1.useEffect)(() => {
        // Update the tokens array with new tokens and their arrival times
        const newTokens = incomingText.slice(receivedText.length).split(' ');
        if (newTokens.length === 0)
            return;
        setReceivedText(incomingText);
        const currentTime = performance.now();
        const additionalTokens = newTokens.map((token, index) => ({
            token,
            timestamp: lastTokenTime.current + (currentTime - lastTokenTime.current) * index / newTokens.length
        }));
        const updatedTokens = [...tokens, ...additionalTokens];
        setTokens(updatedTokens);
        // Calculate the average time interval between the last 'windowSize' tokens
        const relevantTokens = updatedTokens.slice(-windowSize);
        const intervals = relevantTokens.slice(1).map((t, i) => t.timestamp - relevantTokens[i].timestamp);
        const averageInterval = intervals.length > 0 ? intervals.reduce((acc, val) => acc + val, 0) / intervals.length : 1000; // default 1 second
        // Clear previous timers
        // timerHandles.current.forEach(handle => clearTimeout(handle));
        // timerHandles.current = [];
        const timeSinceLastDisplay = currentTime - lastScheduledTime.current;
        // Schedule each new token for display
        additionalTokens.forEach((tokenInfo, index) => {
            const delay = Math.max(0, (index + 1) * averageInterval - timeSinceLastDisplay / delayMultiplier) * delayMultiplier;
            // console.log('Delay:', delay, 'ms');
            lastScheduledTime.current = Math.max(currentTime + delay, lastScheduledTime.current);
            const handle = setTimeout(() => {
                setDisplayedText(prev => `${prev} ${tokenInfo.token}`);
                lastDisplayTime.current = performance.now();
            }, delay);
            timerHandles.current.push(handle);
        });
        lastTokenTime.current = currentTime;
    }, [incomingText, windowSize]); // Dependencies on incomingText and windowSize
    return (react_1.default.createElement(react_1.default.Fragment, null, displayedText));
};
exports.default = SmoothText;
