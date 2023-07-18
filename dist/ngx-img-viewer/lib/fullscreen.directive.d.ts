import { OnChanges, ElementRef } from '@angular/core';
import * as i0 from "@angular/core";
export declare class ToggleFullscreenDirective implements OnChanges {
    private el;
    isFullscreen?: boolean;
    constructor(el: ElementRef);
    ngOnChanges(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ToggleFullscreenDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ToggleFullscreenDirective, "[ngxToggleFullscreen]", never, { "isFullscreen": "ngxToggleFullscreen"; }, {}, never>;
}
