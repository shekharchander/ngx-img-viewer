import { ModuleWithProviders } from '@angular/core';
import { ImageViewerConfig } from './image-viewer-config.model';
import * as i0 from "@angular/core";
import * as i1 from "./image-viewer.component";
import * as i2 from "./fullscreen.directive";
import * as i3 from "@angular/common";
export declare class ImageViewerModule {
    static forRoot(config?: ImageViewerConfig): ModuleWithProviders<ImageViewerModule>;
    static ɵfac: i0.ɵɵFactoryDeclaration<ImageViewerModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ImageViewerModule, [typeof i1.ImageViewerComponent, typeof i2.ToggleFullscreenDirective], [typeof i3.CommonModule], [typeof i1.ImageViewerComponent]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ImageViewerModule>;
}
