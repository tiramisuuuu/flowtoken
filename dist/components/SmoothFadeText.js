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
require("./animations.css");
var Separator;
(function (Separator) {
    Separator["Word"] = "word";
    Separator["Char"] = "char";
})(Separator || (Separator = {}));
const SmoothAnimateText = ({ content, windowSize = 0, delayMultiplier = 1.05, sep = "word", animation = "fadeIn", animationDuration = "1s", animationTimingFunction = "ease-in-out" }) => {
    const tokens = (0, react_1.useRef)([]);
    // const [completedTokens, setCompletedTokens] = useState<string[]>([]);
    const [animatingTokens, setAnimatingTokens] = (0, react_1.useState)([]);
    const receivedTextLength = (0, react_1.useRef)(0);
    const timerHandle = (0, react_1.useRef)(null);
    const lastTokenTime = (0, react_1.useRef)(performance.now());
    const lastDisplayTime = (0, react_1.useRef)(performance.now());
    const tokenIndex = (0, react_1.useRef)(0);
    const averageInterval = (0, react_1.useRef)(0);
    const addToken = () => {
        const tokenInfo = tokens.current[tokenIndex.current];
        if (!tokenInfo) {
            timerHandle.current = null;
            return;
        }
        tokenIndex.current += 1;
        setAnimatingTokens(prev => [...prev, tokenInfo]);
        lastDisplayTime.current = performance.now();
        const delay = averageInterval.current * delayMultiplier;
        // console.log('Delay:', delay, 'ms');
        timerHandle.current = setTimeout(addToken, delay);
    };
    (0, react_1.useEffect)(() => {
        if (content) {
            const textToSplit = content.slice(receivedTextLength.current);
            // Split the text and include spaces in the tokens list
            let newTokens = [];
            if (sep === 'word') {
                newTokens = textToSplit.split(/(\s+)/).filter(token => token.length > 0);
            }
            else if (sep === 'char') {
                newTokens = textToSplit.split('');
            }
            else {
                throw new Error('Invalid separator');
            }
            const currentTime = performance.now();
            const additionalTokens = newTokens.map((token, index) => ({
                token,
                timestamp: lastTokenTime.current + (currentTime - lastTokenTime.current) * index / newTokens.length
            }));
            tokens.current = [...tokens.current, ...additionalTokens];
            lastTokenTime.current = currentTime;
            receivedTextLength.current = content.length;
            if (windowSize > 1) {
                const relevantTokens = tokens.current.slice(-windowSize);
                const intervals = relevantTokens.slice(1).map((t, i) => t.timestamp - relevantTokens[i].timestamp);
                averageInterval.current = intervals.length > 0 ? intervals.reduce((acc, val) => acc + val, 0) / intervals.length : 0; // default 1 second
                // console.log('Average interval:', averageInterval.current);
            }
            else {
                averageInterval.current = 0; // default 1 second
            }
            // Schedule each new token for display
            if (!timerHandle.current) {
                addToken();
            }
        }
    }, [content]);
    return (react_1.default.createElement(react_1.default.Fragment, null, animatingTokens.map(({ token, timestamp }, index) => {
        if (token === '\n')
            return react_1.default.createElement("br", { key: `${index}` }); // key={`${timestamp}-${index}`}
        return react_1.default.createElement("span", { key: `${index}`, style: {
                animationName: animation,
                animationDuration: animationDuration,
                animationTimingFunction: animationTimingFunction,
                animationIterationCount: 1,
                whiteSpace: 'pre',
                display: 'inline-block',
            } }, token);
    })));
};
exports.default = SmoothAnimateText;
