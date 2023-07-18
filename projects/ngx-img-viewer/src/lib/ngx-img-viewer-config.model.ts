export interface ImageViewerConfig {
    zoomFactor?: number;
    wheelZoom?: boolean;
    allowFullscreen?: boolean;
    containerStyle: {};
    imgStyle?: {};
    allowKeyboardNavigation?: boolean;
    customBtns?: Array<
      {
        name: string;
        icon: string;
      }
    >;
}

export class CustomEvent {
  name: string;
  imageIndex: number;

  constructor(name:string, imageIndex: number) {
    this.name = name;
    this.imageIndex = imageIndex;
  }
}
