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
exports.generateSubRegexes = exports.splitRegexPattern = void 0;
const regexpTree = __importStar(require("regexp-tree"));
const splitRegexPattern = (pattern) => {
    // **Correction 1:** Pass the pattern string directly
    const ast = regexpTree.parse(pattern);
    const components = [];
    // Function to traverse the AST and collect components
    const collectComponents = (node) => {
        if (!node)
            return;
        switch (node.type) {
            case 'RegExp':
                collectComponents(node.body);
                break;
            case 'Alternative':
                node.expressions.forEach((expr) => collectComponents(expr));
                break;
            case 'Disjunction':
                collectComponents(node.left);
                components.push('|');
                collectComponents(node.right);
                break;
            case 'Group':
            case 'CapturingGroup':
            case 'NonCapturingGroup':
            case 'Lookahead':
            case 'Lookbehind':
                // **Correction 2:** Use regexpTree.generate(node)
                components.push(regexpTree.generate(node));
                break;
            case 'Repetition':
                collectComponents(node.expression);
                components.push(regexpTree.generate(node.quantifier));
                break;
            case 'Character':
            case 'CharacterClass':
            case 'CharacterClassRange':
            case 'Backreference':
            case 'Anchor':
            case 'ClassRange':
            case 'UnicodePropertyEscape':
                components.push(regexpTree.generate(node));
                break;
            default:
                // For any other node types, generate their string representation
                components.push(regexpTree.generate(node));
        }
    };
    collectComponents(ast);
    return components;
};
exports.splitRegexPattern = splitRegexPattern;
const generateSubRegexes = (pattern) => {
    const components = (0, exports.splitRegexPattern)(pattern);
    const subRegexes = [];
    for (let i = components.length; i > 0; i--) {
        const subRegex = components.slice(0, i).join('');
        subRegexes.push(subRegex);
    }
    return subRegexes;
};
exports.generateSubRegexes = generateSubRegexes;
