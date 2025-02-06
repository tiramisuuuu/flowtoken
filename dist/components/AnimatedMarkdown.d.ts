import React from "react";
import "./animations.css";
import "./custom-lists.css";
interface SmoothTextProps {
    content: string;
    sep?: string;
    animation?: string | null;
    animationDuration?: string;
    animationTimingFunction?: string;
    codeStyle?: any;
    htmlComponents?: any;
    customComponents?: any;
}
interface CustomRendererProps {
    rows: any[];
    stylesheet: any;
    useInlineStyles: boolean;
}
export declare const customCodeRenderer: ({ animation, animationDuration, animationTimingFunction, }: any) => ({ rows, stylesheet, useInlineStyles }: CustomRendererProps) => React.JSX.Element[];
declare const MarkdownAnimateText: React.FC<SmoothTextProps>;
export default MarkdownAnimateText;
