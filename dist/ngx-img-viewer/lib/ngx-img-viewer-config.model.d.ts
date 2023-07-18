export interface ImageViewerConfig {
    zoomFactor?: number;
    wheelZoom?: boolean;
    allowFullscreen?: boolean;
    containerStyle: {};
    imgStyle?: {};
    allowKeyboardNavigation?: boolean;
    customBtns?: Array<{
        name: string;
        icon: string;
    }>;
}
export declare class CustomEvent {
    name: string;
    imageIndex: number;
    constructor(name: string, imageIndex: number);
}
