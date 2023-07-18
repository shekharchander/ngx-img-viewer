import { Directive, Input } from '@angular/core';
import * as screenfull from 'screenfull';
import * as i0 from "@angular/core";
export class ToggleFullscreenDirective {
    constructor(el) {
        this.el = el;
    }
    ngOnChanges() {
        if (this.isFullscreen && screenfull.default.isEnabled) {
            screenfull.default.request(this.el.nativeElement);
        }
        else if (screenfull.default.isEnabled) {
            screenfull.default.exit();
        }
    }
}
ToggleFullscreenDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.3.0", ngImport: i0, type: ToggleFullscreenDirective, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive });
ToggleFullscreenDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "14.3.0", type: ToggleFullscreenDirective, selector: "[ngxToggleFullscreen]", inputs: { isFullscreen: ["ngxToggleFullscreen", "isFullscreen"] }, usesOnChanges: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.3.0", ngImport: i0, type: ToggleFullscreenDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[ngxToggleFullscreen]'
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }]; }, propDecorators: { isFullscreen: [{
                type: Input,
                args: ['ngxToggleFullscreen']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnVsbHNjcmVlbi5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3gtaW1nLXZpZXdlci9zcmMvbGliL2Z1bGxzY3JlZW4uZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQTJCLEtBQUssRUFBYyxNQUFNLGVBQWUsQ0FBQztBQUN0RixPQUFPLEtBQUssVUFBVSxNQUFNLFlBQVksQ0FBQzs7QUFLekMsTUFBTSxPQUFPLHlCQUF5QjtJQUtsQyxZQUFvQixFQUFjO1FBQWQsT0FBRSxHQUFGLEVBQUUsQ0FBWTtJQUFJLENBQUM7SUFFdkMsV0FBVztRQUNQLElBQUksSUFBSSxDQUFDLFlBQVksSUFBSSxVQUFVLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRTtZQUNuRCxVQUFVLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1NBQ3JEO2FBQU0sSUFBSSxVQUFVLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRTtZQUNyQyxVQUFVLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDO1NBQzdCO0lBQ0wsQ0FBQzs7c0hBYlEseUJBQXlCOzBHQUF6Qix5QkFBeUI7MkZBQXpCLHlCQUF5QjtrQkFIckMsU0FBUzttQkFBQztvQkFDUCxRQUFRLEVBQUUsdUJBQXVCO2lCQUNwQztpR0FJRyxZQUFZO3NCQURYLEtBQUs7dUJBQUMscUJBQXFCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRGlyZWN0aXZlLCBIb3N0TGlzdGVuZXIsIE9uQ2hhbmdlcywgSW5wdXQsIEVsZW1lbnRSZWYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0ICogYXMgc2NyZWVuZnVsbCBmcm9tICdzY3JlZW5mdWxsJztcclxuXHJcbkBEaXJlY3RpdmUoe1xyXG4gICAgc2VsZWN0b3I6ICdbbmd4VG9nZ2xlRnVsbHNjcmVlbl0nXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBUb2dnbGVGdWxsc2NyZWVuRGlyZWN0aXZlIGltcGxlbWVudHMgT25DaGFuZ2VzIHtcclxuXHJcbiAgICBASW5wdXQoJ25neFRvZ2dsZUZ1bGxzY3JlZW4nKVxyXG4gICAgaXNGdWxsc2NyZWVuPzogYm9vbGVhbjtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGVsOiBFbGVtZW50UmVmKSB7IH1cclxuXHJcbiAgICBuZ09uQ2hhbmdlcygpIHtcclxuICAgICAgICBpZiAodGhpcy5pc0Z1bGxzY3JlZW4gJiYgc2NyZWVuZnVsbC5kZWZhdWx0LmlzRW5hYmxlZCkge1xyXG4gICAgICAgICAgICBzY3JlZW5mdWxsLmRlZmF1bHQucmVxdWVzdCh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoc2NyZWVuZnVsbC5kZWZhdWx0LmlzRW5hYmxlZCkge1xyXG4gICAgICAgICAgICBzY3JlZW5mdWxsLmRlZmF1bHQuZXhpdCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn1cclxuIl19