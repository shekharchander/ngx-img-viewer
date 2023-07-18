import { Component, Input, Optional, Inject, Output, EventEmitter, HostListener, SecurityContext } from '@angular/core';
import { CustomEvent } from './ngx-img-viewer-config.model';
import heic2any from 'heic2any';
import * as i0 from "@angular/core";
import * as i1 from "@angular/platform-browser";
import * as i2 from "@angular/common";
import * as i3 from "./fullscreen.directive";
const DEFAULT_CONFIG = {
    zoomFactor: 0.1,
    containerStyle: {
        'background-color': '#ccc'
    },
    wheelZoom: false,
    allowFullscreen: true,
    allowKeyboardNavigation: true,
};
export class ImageViewerComponent {
    constructor(moduleConfig, sanitizer) {
        this.moduleConfig = moduleConfig;
        this.sanitizer = sanitizer;
        this.src = [];
        this.index = 0;
        this.config = {
            containerStyle: {
                'background-color': '#ccc'
            }
        };
        this.indexChange = new EventEmitter();
        this.configChange = new EventEmitter();
        this.customEvent = new EventEmitter();
        this.checkedIndex = [];
        this.style = { transform: '', msTransform: '', oTransform: '', webkitTransform: '' };
        this.fullscreen = false;
        this.loading = true;
        this.scale = 1;
        this.rotation = 0;
        this.translateX = 0;
        this.translateY = 0;
        this.hovered = false;
    }
    ngOnInit() {
        this.checkedIndex = [];
        const merged = this.mergeConfig(DEFAULT_CONFIG, this.moduleConfig);
        this.config = this.mergeConfig(merged, this.config);
        if (this.config.imgStyle) {
            this.style = Object.assign({}, this.config.imgStyle, this.style);
        }
        this.triggerConfigBinding();
    }
    // @HostListener('window:keyup.ArrowRight',  ['$event'])
    // nextImage(event:Event) {
    //   if (this.canNavigate(event) && this.index < this.src.length - 1) {
    //     this.loading = true;
    //     this.index++;
    //     this.triggerIndexBinding();
    //     this.reset();
    //   }
    // }
    // @HostListener('window:keyup.ArrowLeft', ['$event'])
    // prevImage(event:Event) {
    //   if (this.canNavigate(event) && this.index > 0) {
    //     this.loading = true;
    //     this.index--;
    //     this.triggerIndexBinding();
    //     this.reset();
    //   }
    // }
    zoomIn() {
        if (this.config.zoomFactor)
            this.scale *= (1 + this.config.zoomFactor);
        this.updateStyle();
    }
    zoomOut() {
        if (this.config.zoomFactor)
            if (this.scale > this.config.zoomFactor) {
                this.scale /= (1 + this.config.zoomFactor);
            }
        this.updateStyle();
    }
    onError(index) {
        if (this.checkedIndex.includes(index)) {
            return;
        }
        this.checkedIndex.push(index);
        fetch(this.src[index]).then((r) => {
            if (r.ok) {
                r.blob().then((imageBlob) => {
                    heic2any({
                        blob: imageBlob,
                        toType: 'image/jpeg',
                    }).then((img) => {
                        var reader = new FileReader();
                        reader.readAsDataURL(img);
                        reader.onloadend = () => {
                            var b64 = reader.result;
                            this.src[index] = this.sanitizer.sanitize(SecurityContext.RESOURCE_URL, this.sanitizer.bypassSecurityTrustResourceUrl(b64));
                        };
                    }, (error) => {
                        if (error.code == 1) {
                            var reader = new FileReader();
                            reader.readAsDataURL(imageBlob);
                            reader.onloadend = () => {
                                var b64 = reader.result;
                                this.src[index] = this.sanitizer.sanitize(SecurityContext.RESOURCE_URL, this.sanitizer.bypassSecurityTrustResourceUrl(b64));
                            };
                        }
                        else {
                            this.customEvent.emit({
                                name: 'error',
                                imageIndex: this.index
                            });
                        }
                    });
                });
            }
            else {
                this.customEvent.emit({
                    name: 'error',
                    imageIndex: this.index
                });
            }
        }, (error) => {
            this.customEvent.emit({
                name: 'error',
                imageIndex: this.index
            });
        });
    }
    scrollZoom(evt) {
        if (this.config.wheelZoom) {
            evt.deltaY > 0 ? this.zoomOut() : this.zoomIn();
            return false;
        }
        else {
            return;
        }
    }
    rotateClockwise() {
        this.rotation += 90;
        this.updateStyle();
    }
    rotateCounterClockwise() {
        this.rotation -= 90;
        this.updateStyle();
    }
    onLoad() {
        this.customEvent.emit({
            name: "load",
            imageIndex: this.index
        });
    }
    onLoadStart() {
        this.customEvent.emit({
            name: "loadStart",
            imageIndex: this.index
        });
    }
    onDragOver(evt) {
        if (this.prevX)
            this.translateX += (evt.clientX - this.prevX);
        if (this.prevY)
            this.translateY += (evt.clientY - this.prevY);
        this.prevX = evt.clientX;
        this.prevY = evt.clientY;
        this.updateStyle();
    }
    onDragStart(evt) {
        let nextSibling = evt.target.nextElementSibling;
        if (evt.dataTransfer && evt.dataTransfer.setDragImage && nextSibling) {
            evt.dataTransfer.setDragImage(nextSibling, 0, 0);
        }
        this.prevX = evt.clientX;
        this.prevY = evt.clientY;
    }
    toggleFullscreen() {
        this.fullscreen = !this.fullscreen;
        if (!this.fullscreen) {
            this.reset();
        }
    }
    triggerIndexBinding() {
        this.indexChange.emit(this.index);
    }
    triggerConfigBinding() {
        this.configChange.next(this.config);
    }
    fireCustomEvent(name, imageIndex) {
        this.customEvent.emit(new CustomEvent(name, imageIndex));
    }
    reset() {
        this.scale = 1;
        this.rotation = 0;
        this.translateX = 0;
        this.translateY = 0;
        this.updateStyle();
    }
    onMouseOver() {
        this.hovered = true;
    }
    onMouseLeave() {
        this.hovered = false;
    }
    canNavigate(event) {
        return event == null || (this.config.allowKeyboardNavigation && this.hovered);
    }
    updateStyle() {
        this.style.transform = `translate(${this.translateX}px, ${this.translateY}px) rotate(${this.rotation}deg) scale(${this.scale})`;
        this.style.msTransform = this.style.transform;
        this.style.webkitTransform = this.style.transform;
        this.style.oTransform = this.style.transform;
    }
    mergeConfig(defaultValues, overrideValues) {
        let result = { ...defaultValues };
        if (overrideValues) {
            result = { ...defaultValues, ...overrideValues };
        }
        return result;
    }
}
ImageViewerComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.9", ngImport: i0, type: ImageViewerComponent, deps: [{ token: 'config', optional: true }, { token: i1.DomSanitizer }], target: i0.ɵɵFactoryTarget.Component });
ImageViewerComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.9", type: ImageViewerComponent, selector: "ngx-img-viewer", inputs: { src: "src", index: "index", config: "config" }, outputs: { src: "src", indexChange: "indexChange", configChange: "configChange", customEvent: "customEvent" }, host: { listeners: { "mouseover": "onMouseOver()", "mouseleave": "onMouseLeave()" } }, ngImport: i0, template: "<div [ngxToggleFullscreen]=\"fullscreen\" [ngStyle]=\"config.containerStyle\" class=\"img-container\"\r\n    (wheel)=\"scrollZoom($event)\" (dragover)=\"onDragOver($event)\">\r\n    <img [src]=\"src[index]\" (error)=\"onError(index)\" [ngStyle]=\"style\" alt=\"Image not found...\" (dragstart)=\"onDragStart($event)\" (load)=\"onLoad()\" (loadstart)=\"onLoadStart()\"/>\r\n  <!-- Div below will be used to hide the 'ghost' image when dragging -->\r\n  <div></div>\r\n  <ng-content></ng-content> <!-- Used to capture any content that you want to add to this module (To support full screen elements)-->\r\n</div>", styles: [".img-container{height:100%;width:100%;overflow:hidden;position:relative}.img-container img{z-index:2;margin:0 auto;display:block;max-width:100%;max-height:100%}@keyframes rotation{0%{-webkit-transform:rotate(0deg)}to{-webkit-transform:rotate(359deg)}}\n"], dependencies: [{ kind: "directive", type: i2.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "directive", type: i3.ToggleFullscreenDirective, selector: "[ngxToggleFullscreen]", inputs: ["ngxToggleFullscreen"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.9", ngImport: i0, type: ImageViewerComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-img-viewer', template: "<div [ngxToggleFullscreen]=\"fullscreen\" [ngStyle]=\"config.containerStyle\" class=\"img-container\"\r\n    (wheel)=\"scrollZoom($event)\" (dragover)=\"onDragOver($event)\">\r\n    <img [src]=\"src[index]\" (error)=\"onError(index)\" [ngStyle]=\"style\" alt=\"Image not found...\" (dragstart)=\"onDragStart($event)\" (load)=\"onLoad()\" (loadstart)=\"onLoadStart()\"/>\r\n  <!-- Div below will be used to hide the 'ghost' image when dragging -->\r\n  <div></div>\r\n  <ng-content></ng-content> <!-- Used to capture any content that you want to add to this module (To support full screen elements)-->\r\n</div>", styles: [".img-container{height:100%;width:100%;overflow:hidden;position:relative}.img-container img{z-index:2;margin:0 auto;display:block;max-width:100%;max-height:100%}@keyframes rotation{0%{-webkit-transform:rotate(0deg)}to{-webkit-transform:rotate(359deg)}}\n"] }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: ['config']
                }] }, { type: i1.DomSanitizer }]; }, propDecorators: { src: [{
                type: Input
            }, {
                type: Output
            }], index: [{
                type: Input
            }], config: [{
                type: Input
            }], indexChange: [{
                type: Output
            }], configChange: [{
                type: Output
            }], customEvent: [{
                type: Output
            }], onMouseOver: [{
                type: HostListener,
                args: ['mouseover']
            }], onMouseLeave: [{
                type: HostListener,
                args: ['mouseleave']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWltZy12aWV3ZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvbmd4LWltZy12aWV3ZXIvc3JjL2xpYi9uZ3gtaW1nLXZpZXdlci5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3gtaW1nLXZpZXdlci9zcmMvbGliL25neC1pbWctdmlld2VyLmNvbXBvbmVudC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBQyxTQUFTLEVBQVUsS0FBSyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRSxZQUFZLEVBQUUsZUFBZSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQy9ILE9BQU8sRUFBcUIsV0FBVyxFQUFFLE1BQU0sK0JBQStCLENBQUM7QUFDL0UsT0FBTyxRQUFRLE1BQU0sVUFBVSxDQUFDOzs7OztBQUdoQyxNQUFNLGNBQWMsR0FBc0I7SUFDeEMsVUFBVSxFQUFFLEdBQUc7SUFDZixjQUFjLEVBQUU7UUFDZCxrQkFBa0IsRUFBQyxNQUFNO0tBQzFCO0lBQ0QsU0FBUyxFQUFFLEtBQUs7SUFDaEIsZUFBZSxFQUFFLElBQUk7SUFDckIsdUJBQXVCLEVBQUUsSUFBSTtDQUM5QixDQUFDO0FBT0YsTUFBTSxPQUFPLG9CQUFvQjtJQXFDL0IsWUFDdUMsWUFBK0IsRUFDN0QsU0FBdUI7UUFETyxpQkFBWSxHQUFaLFlBQVksQ0FBbUI7UUFDN0QsY0FBUyxHQUFULFNBQVMsQ0FBYztRQXBDaEMsUUFBRyxHQUFhLEVBQUUsQ0FBQztRQUduQixVQUFLLEdBQUcsQ0FBQyxDQUFDO1FBR1YsV0FBTSxHQUFzQjtZQUMxQixjQUFjLEVBQUU7Z0JBQ2Qsa0JBQWtCLEVBQUMsTUFBTTthQUMxQjtTQUNGLENBQUE7UUFHRCxnQkFBVyxHQUF5QixJQUFJLFlBQVksRUFBRSxDQUFDO1FBR3ZELGlCQUFZLEdBQW9DLElBQUksWUFBWSxFQUFF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QyxLQUFLLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDO1FBQ2xELElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDO0lBQy9DLENBQUM7SUFFTyxXQUFXLENBQUMsYUFBZ0MsRUFBRSxjQUFpQztRQUNyRixJQUFJLE1BQU0sR0FBc0IsRUFBRSxHQUFHLGFBQWEsRUFBRSxDQUFDO1FBQ3JELElBQUksY0FBYyxFQUFFO1lBQ2xCLE1BQU0sR0FBRyxFQUFFLEdBQUcsYUFBYSxFQUFFLEdBQUcsY0FBYyxFQUFFLENBQUM7U0FDbEQ7UUFDRCxPQUFPLE1BQU0sQ0FBQztJQUNoQixDQUFDOztpSEFuUFUsb0JBQW9CLGtCQXNDVCxRQUFRO3FHQXRDbkIsb0JBQW9CLHNUQ3BCakMsb21CQU1NOzJGRGNPLG9CQUFvQjtrQkFMaEMsU0FBUzsrQkFDRSxnQkFBZ0I7OzBCQTBDdkIsUUFBUTs7MEJBQUksTUFBTTsyQkFBQyxRQUFRO3VFQW5DOUIsR0FBRztzQkFERixLQUFLOztzQkFBSSxNQUFNO2dCQUloQixLQUFLO3NCQURKLEtBQUs7Z0JBSU4sTUFBTTtzQkFETCxLQUFLO2dCQVFOLFdBQVc7c0JBRFYsTUFBTTtnQkFJUCxZQUFZO3NCQURYLE1BQU07Z0JBSVAsV0FBVztzQkFEVixNQUFNO2dCQW9NQyxXQUFXO3NCQURsQixZQUFZO3VCQUFDLFdBQVc7Z0JBTWpCLFlBQVk7c0JBRG5CLFlBQVk7dUJBQUMsWUFBWSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Q29tcG9uZW50LCBPbkluaXQsIElucHV0LCBPcHRpb25hbCwgSW5qZWN0LCBPdXRwdXQsIEV2ZW50RW1pdHRlciwgSG9zdExpc3RlbmVyLCBTZWN1cml0eUNvbnRleHQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSW1hZ2VWaWV3ZXJDb25maWcsIEN1c3RvbUV2ZW50IH0gZnJvbSAnLi9uZ3gtaW1nLXZpZXdlci1jb25maWcubW9kZWwnO1xyXG5pbXBvcnQgaGVpYzJhbnkgZnJvbSAnaGVpYzJhbnknO1xyXG5pbXBvcnQgeyBEb21TYW5pdGl6ZXIgfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyJztcclxuXHJcbmNvbnN0IERFRkFVTFRfQ09ORklHOiBJbWFnZVZpZXdlckNvbmZpZyA9IHtcclxuICB6b29tRmFjdG9yOiAwLjEsXHJcbiAgY29udGFpbmVyU3R5bGU6IHtcclxuICAgICdiYWNrZ3JvdW5kLWNvbG9yJzonI2NjYydcclxuICB9LFxyXG4gIHdoZWVsWm9vbTogZmFsc2UsXHJcbiAgYWxsb3dGdWxsc2NyZWVuOiB0cnVlLFxyXG4gIGFsbG93S2V5Ym9hcmROYXZpZ2F0aW9uOiB0cnVlLFxyXG59O1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICduZ3gtaW1nLXZpZXdlcicsXHJcbiAgdGVtcGxhdGVVcmw6ICcuL25neC1pbWctdmlld2VyLmNvbXBvbmVudC5odG1sJyxcclxuICBzdHlsZVVybHM6IFsnLi9uZ3gtaW1nLXZpZXdlci5jb21wb25lbnQuc2NzcyddXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBJbWFnZVZpZXdlckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XHJcblxyXG4gIEBJbnB1dCgpIEBPdXRwdXQoKVxyXG4gIHNyYzogc3RyaW5nW10gPSBbXTtcclxuXHJcbiAgQElucHV0KClcclxuICBpbmRleCA9IDA7XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgY29uZmlnOiBJbWFnZVZpZXdlckNvbmZpZyA9IHtcclxuICAgIGNvbnRhaW5lclN0eWxlOiB7XHJcbiAgICAgICdiYWNrZ3JvdW5kLWNvbG9yJzonI2NjYydcclxuICAgIH1cclxuICB9XHJcblxyXG4gIEBPdXRwdXQoKVxyXG4gIGluZGV4Q2hhbmdlOiBFdmVudEVtaXR0ZXI8bnVtYmVyPiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcbiAgQE91dHB1dCgpXHJcbiAgY29uZmlnQ2hhbmdlOiBFdmVudEVtaXR0ZXI8SW1hZ2VWaWV3ZXJDb25maWc+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuICBAT3V0cHV0KClcclxuICBjdXN0b21FdmVudDogRXZlbnRFbWl0dGVyPEN1c3RvbUV2ZW50PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcbiAgY2hlY2tlZEluZGV4Om51bWJlcltdID0gW107XHJcblxyXG4gIHB1YmxpYyBzdHlsZSA9IHsgdHJhbnNmb3JtOiAnJywgbXNUcmFuc2Zvcm06ICcnLCBvVHJhbnNmb3JtOiAnJywgd2Via2l0VHJhbnNmb3JtOiAnJyB9O1xyXG4gIHB1YmxpYyBmdWxsc2NyZWVuID0gZmFsc2U7XHJcbiAgcHVibGljIGxvYWRpbmcgPSB0cnVlO1xyXG4gIHByaXZhdGUgc2NhbGUgPSAxO1xyXG4gIHByaXZhdGUgcm90YXRpb24gPSAwO1xyXG4gIHByaXZhdGUgdHJhbnNsYXRlWCA9IDA7XHJcbiAgcHJpdmF0ZSB0cmFuc2xhdGVZID0gMDtcclxuICBwcml2YXRlIHByZXZYPzogbnVtYmVyO1xyXG4gIHByaXZhdGUgcHJldlk/OiBudW1iZXI7XHJcbiAgcHJpdmF0ZSBob3ZlcmVkID0gZmFsc2U7XHJcblxyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdCgnY29uZmlnJykgcHVibGljIG1vZHVsZUNvbmZpZzogSW1hZ2VWaWV3ZXJDb25maWcsXHJcbiAgICBwdWJsaWMgc2FuaXRpemVyOiBEb21TYW5pdGl6ZXJcclxuICApIHt9XHJcblxyXG4gIG5nT25Jbml0KCkge1xyXG4gICAgdGhpcy5jaGVja2VkSW5kZXggPSBbXTtcclxuICAgIGNvbnN0IG1lcmdlZCA9IHRoaXMubWVyZ2VDb25maWcoREVGQVVMVF9DT05GSUcsIHRoaXMubW9kdWxlQ29uZmlnKTtcclxuICAgIHRoaXMuY29uZmlnID0gdGhpcy5tZXJnZUNvbmZpZyhtZXJnZWQsIHRoaXMuY29uZmlnKTtcclxuICAgIGlmKHRoaXMuY29uZmlnLmltZ1N0eWxlKXtcclxuICAgICAgdGhpcy5zdHlsZSA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuY29uZmlnLmltZ1N0eWxlLCB0aGlzLnN0eWxlKTtcclxuICAgIH1cclxuICAgIHRoaXMudHJpZ2dlckNvbmZpZ0JpbmRpbmcoKTtcclxuICB9XHJcbiAgLy8gQEhvc3RMaXN0ZW5lcignd2luZG93OmtleXVwLkFycm93UmlnaHQnLCAgWyckZXZlbnQnXSlcclxuICAvLyBuZXh0SW1hZ2UoZXZlbnQ6RXZlbnQpIHtcclxuICAvLyAgIGlmICh0aGlzLmNhbk5hdmlnYXRlKGV2ZW50KSAmJiB0aGlzLmluZGV4IDwgdGhpcy5zcmMubGVuZ3RoIC0gMSkge1xyXG4gIC8vICAgICB0aGlzLmxvYWRpbmcgPSB0cnVlO1xyXG4gIC8vICAgICB0aGlzLmluZGV4Kys7XHJcbiAgLy8gICAgIHRoaXMudHJpZ2dlckluZGV4QmluZGluZygpO1xyXG4gIC8vICAgICB0aGlzLnJlc2V0KCk7XHJcbiAgLy8gICB9XHJcbiAgLy8gfVxyXG5cclxuICAvLyBASG9zdExpc3RlbmVyKCd3aW5kb3c6a2V5dXAuQXJyb3dMZWZ0JywgWyckZXZlbnQnXSlcclxuICAvLyBwcmV2SW1hZ2UoZXZlbnQ6RXZlbnQpIHtcclxuICAvLyAgIGlmICh0aGlzLmNhbk5hdmlnYXRlKGV2ZW50KSAmJiB0aGlzLmluZGV4ID4gMCkge1xyXG4gIC8vICAgICB0aGlzLmxvYWRpbmcgPSB0cnVlO1xyXG4gIC8vICAgICB0aGlzLmluZGV4LS07XHJcbiAgLy8gICAgIHRoaXMudHJpZ2dlckluZGV4QmluZGluZygpO1xyXG4gIC8vICAgICB0aGlzLnJlc2V0KCk7XHJcbiAgLy8gICB9XHJcbiAgLy8gfVxyXG5cclxuICB6b29tSW4oKSB7XHJcbiAgICBpZih0aGlzLmNvbmZpZy56b29tRmFjdG9yKVxyXG4gICAgdGhpcy5zY2FsZSAqPSAoMSArIHRoaXMuY29uZmlnLnpvb21GYWN0b3IpO1xyXG4gICAgdGhpcy51cGRhdGVTdHlsZSgpO1xyXG4gIH1cclxuXHJcbiAgem9vbU91dCgpIHtcclxuICAgIGlmKHRoaXMuY29uZmlnLnpvb21GYWN0b3IpXHJcbiAgICBpZiAodGhpcy5zY2FsZSA+IHRoaXMuY29uZmlnLnpvb21GYWN0b3IpIHtcclxuICAgICAgdGhpcy5zY2FsZSAvPSAoMSArIHRoaXMuY29uZmlnLnpvb21GYWN0b3IpO1xyXG4gICAgfVxyXG4gICAgdGhpcy51cGRhdGVTdHlsZSgpO1xyXG4gIH1cclxuICBcclxuICBvbkVycm9yKGluZGV4Om51bWJlcil7XHJcbiAgICBpZih0aGlzLmNoZWNrZWRJbmRleC5pbmNsdWRlcyhpbmRleCkpe1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICB0aGlzLmNoZWNrZWRJbmRleC5wdXNoKGluZGV4KTtcclxuICAgIGZldGNoKHRoaXMuc3JjW2luZGV4XSkudGhlbihcclxuICAgICAgKHIpPT57XHJcbiAgICAgICAgaWYoci5vayl7XHJcbiAgICAgICAgICByLmJsb2IoKS50aGVuKChpbWFnZUJsb2IpPT57XHJcbiAgICAgICAgICAgIGhlaWMyYW55KHtcclxuICAgICAgICAgICAgICBibG9iOiBpbWFnZUJsb2IsXHJcbiAgICAgICAgICAgICAgdG9UeXBlOiAnaW1hZ2UvanBlZycsXHJcbiAgICAgICAgICAgIH0pLnRoZW4oKGltZzphbnkpPT57XHJcbiAgICAgICAgICAgIHZhciByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xyXG4gICAgICAgICAgICByZWFkZXIucmVhZEFzRGF0YVVSTChpbWcpXHJcbiAgICAgICAgICAgIHJlYWRlci5vbmxvYWRlbmQgPSAoKT0+e1xyXG4gICAgICAgICAgICAgIHZhciBiNjQ6YW55ID0gcmVhZGVyLnJlc3VsdDtcclxuICAgICAgICAgICAgICB0aGlzLnNyY1tpbmRleF0gPSB0aGlzLnNhbml0aXplci5zYW5pdGl6ZShTZWN1cml0eUNvbnRleHQuUkVTT1VSQ0VfVVJMLCB0aGlzLnNhbml0aXplci5ieXBhc3NTZWN1cml0eVRydXN0UmVzb3VyY2VVcmwoYjY0KSkhO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9LChlcnJvcjphbnkpPT57XHJcbiAgICAgICAgICAgIGlmKGVycm9yLmNvZGUgPT0gMSl7XHJcbiAgICAgICAgICAgICAgdmFyIHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XHJcbiAgICAgICAgICAgICAgcmVhZGVyLnJlYWRBc0RhdGFVUkwoaW1hZ2VCbG9iKVxyXG4gICAgICAgICAgICAgIHJlYWRlci5vbmxvYWRlbmQgPSAoKT0+e1xyXG4gICAgICAgICAgICAgICAgdmFyIGI2NDphbnkgPSByZWFkZXIucmVzdWx0O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zcmNbaW5kZXhdID0gdGhpcy5zYW5pdGl6ZXIuc2FuaXRpemUoU2VjdXJpdHlDb250ZXh0LlJFU09VUkNFX1VSTCwgdGhpcy5zYW5pdGl6ZXIuYnlwYXNzU2VjdXJpdHlUcnVzdFJlc291cmNlVXJsKGI2NCkpITtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgICB0aGlzLmN1c3RvbUV2ZW50LmVtaXQoe1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ2Vycm9yJyxcclxuICAgICAgICAgICAgICAgIGltYWdlSW5kZXg6IHRoaXMuaW5kZXhcclxuICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZXtcclxuICAgICAgICAgIHRoaXMuY3VzdG9tRXZlbnQuZW1pdCh7XHJcbiAgICAgICAgICAgIG5hbWU6ICdlcnJvcicsXHJcbiAgICAgICAgICAgIGltYWdlSW5kZXg6IHRoaXMuaW5kZXhcclxuICAgICAgICAgIH0pICAgIFxyXG4gICAgICAgIH1cclxuICAgIH0sKGVycm9yKT0+e1xyXG4gICAgICB0aGlzLmN1c3RvbUV2ZW50LmVtaXQoe1xyXG4gICAgICAgIG5hbWU6ICdlcnJvcicsXHJcbiAgICAgICAgaW1hZ2VJbmRleDogdGhpcy5pbmRleFxyXG4gICAgICB9KSBcclxuICAgIH0pXHJcbiAgfVxyXG5cclxuICBzY3JvbGxab29tKGV2dDphbnkpIHtcclxuICAgIGlmICh0aGlzLmNvbmZpZy53aGVlbFpvb20pIHtcclxuICAgICAgZXZ0LmRlbHRhWSA+IDAgPyB0aGlzLnpvb21PdXQoKSA6IHRoaXMuem9vbUluKCk7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIGVsc2V7XHJcbiAgICAgIHJldHVyblxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcm90YXRlQ2xvY2t3aXNlKCkge1xyXG4gICAgdGhpcy5yb3RhdGlvbiArPSA5MDtcclxuICAgIHRoaXMudXBkYXRlU3R5bGUoKTtcclxuICB9XHJcblxyXG4gIHJvdGF0ZUNvdW50ZXJDbG9ja3dpc2UoKSB7XHJcbiAgICB0aGlzLnJvdGF0aW9uIC09IDkwO1xyXG4gICAgdGhpcy51cGRhdGVTdHlsZSgpO1xyXG4gIH1cclxuXHJcbiAgb25Mb2FkKCkge1xyXG4gICAgdGhpcy5jdXN0b21FdmVudC5lbWl0KHtcclxuICAgICAgbmFtZTogXCJsb2FkXCIsXHJcbiAgICAgIGltYWdlSW5kZXg6IHRoaXMuaW5kZXhcclxuICAgIH0pXHJcbiAgfVxyXG5cclxuICBvbkxvYWRTdGFydCgpIHtcclxuICAgIHRoaXMuY3VzdG9tRXZlbnQuZW1pdCh7XHJcbiAgICAgIG5hbWU6IFwibG9hZFN0YXJ0XCIsXHJcbiAgICAgIGltYWdlSW5kZXg6IHRoaXMuaW5kZXhcclxuICAgIH0pXHJcbiAgfVxyXG5cclxuICBvbkRyYWdPdmVyKGV2dDpEcmFnRXZlbnQpIHtcclxuICAgIGlmKHRoaXMucHJldlgpXHJcbiAgICB0aGlzLnRyYW5zbGF0ZVggKz0gKGV2dC5jbGllbnRYIC0gdGhpcy5wcmV2WCk7XHJcbiAgICBpZih0aGlzLnByZXZZKVxyXG4gICAgdGhpcy50cmFuc2xhdGVZICs9IChldnQuY2xpZW50WSAtIHRoaXMucHJldlkpO1xyXG4gICAgdGhpcy5wcmV2WCA9IGV2dC5jbGllbnRYO1xyXG4gICAgdGhpcy5wcmV2WSA9IGV2dC5jbGllbnRZO1xyXG4gICAgdGhpcy51cGRhdGVTdHlsZSgpO1xyXG4gIH1cclxuXHJcbiAgb25EcmFnU3RhcnQoZXZ0OkRyYWdFdmVudCkge1xyXG4gICAgbGV0IG5leHRTaWJsaW5nOkVsZW1lbnQgfCBudWxsID0gKGV2dC50YXJnZXQgYXMgSFRNTEVsZW1lbnQpLm5leHRFbGVtZW50U2libGluZztcclxuICAgIGlmIChldnQuZGF0YVRyYW5zZmVyICYmIGV2dC5kYXRhVHJhbnNmZXIuc2V0RHJhZ0ltYWdlICYmIG5leHRTaWJsaW5nKSB7XHJcbiAgICAgIGV2dC5kYXRhVHJhbnNmZXIuc2V0RHJhZ0ltYWdlKG5leHRTaWJsaW5nLCAwLCAwKTtcclxuICAgIH1cclxuICAgIHRoaXMucHJldlggPSBldnQuY2xpZW50WDtcclxuICAgIHRoaXMucHJldlkgPSBldnQuY2xpZW50WTtcclxuICB9XHJcblxyXG4gIHRvZ2dsZUZ1bGxzY3JlZW4oKSB7XHJcbiAgICB0aGlzLmZ1bGxzY3JlZW4gPSAhdGhpcy5mdWxsc2NyZWVuO1xyXG4gICAgaWYgKCF0aGlzLmZ1bGxzY3JlZW4pIHtcclxuICAgICAgdGhpcy5yZXNldCgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgdHJpZ2dlckluZGV4QmluZGluZygpIHtcclxuICAgIHRoaXMuaW5kZXhDaGFuZ2UuZW1pdCh0aGlzLmluZGV4KTtcclxuICB9XHJcblxyXG4gIHRyaWdnZXJDb25maWdCaW5kaW5nKCkge1xyXG4gICAgdGhpcy5jb25maWdDaGFuZ2UubmV4dCh0aGlzLmNvbmZpZyk7XHJcbiAgfVxyXG5cclxuICBmaXJlQ3VzdG9tRXZlbnQobmFtZTogc3RyaW5nLCBpbWFnZUluZGV4OiBudW1iZXIpIHtcclxuICAgIHRoaXMuY3VzdG9tRXZlbnQuZW1pdChuZXcgQ3VzdG9tRXZlbnQobmFtZSwgaW1hZ2VJbmRleCkpO1xyXG4gIH1cclxuXHJcbiAgcmVzZXQoKSB7XHJcbiAgICB0aGlzLnNjYWxlID0gMTtcclxuICAgIHRoaXMucm90YXRpb24gPSAwO1xyXG4gICAgdGhpcy50cmFuc2xhdGVYID0gMDtcclxuICAgIHRoaXMudHJhbnNsYXRlWSA9IDA7XHJcbiAgICB0aGlzLnVwZGF0ZVN0eWxlKCk7XHJcbiAgfVxyXG5cclxuICBASG9zdExpc3RlbmVyKCdtb3VzZW92ZXInKVxyXG4gIHByaXZhdGUgb25Nb3VzZU92ZXIoKSB7XHJcbiAgICB0aGlzLmhvdmVyZWQgPSB0cnVlO1xyXG4gIH1cclxuXHJcbiAgQEhvc3RMaXN0ZW5lcignbW91c2VsZWF2ZScpXHJcbiAgcHJpdmF0ZSBvbk1vdXNlTGVhdmUoKSB7XHJcbiAgICB0aGlzLmhvdmVyZWQgPSBmYWxzZTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgY2FuTmF2aWdhdGUoZXZlbnQ6IGFueSkge1xyXG4gICAgcmV0dXJuIGV2ZW50ID09IG51bGwgfHwgICh0aGlzLmNvbmZpZy5hbGxvd0tleWJvYXJkTmF2aWdhdGlvbiAmJiB0aGlzLmhvdmVyZWQpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSB1cGRhdGVTdHlsZSgpIHtcclxuICAgIHRoaXMuc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZSgke3RoaXMudHJhbnNsYXRlWH1weCwgJHt0aGlzLnRyYW5zbGF0ZVl9cHgpIHJvdGF0ZSgke3RoaXMucm90YXRpb259ZGVnKSBzY2FsZSgke3RoaXMuc2NhbGV9KWA7XHJcbiAgICB0aGlzLnN0eWxlLm1zVHJhbnNmb3JtID0gdGhpcy5zdHlsZS50cmFuc2Zvcm07XHJcbiAgICB0aGlzLnN0eWxlLndlYmtpdFRyYW5zZm9ybSA9IHRoaXMuc3R5bGUudHJhbnNmb3JtO1xyXG4gICAgdGhpcy5zdHlsZS5vVHJhbnNmb3JtID0gdGhpcy5zdHlsZS50cmFuc2Zvcm07XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIG1lcmdlQ29uZmlnKGRlZmF1bHRWYWx1ZXM6IEltYWdlVmlld2VyQ29uZmlnLCBvdmVycmlkZVZhbHVlczogSW1hZ2VWaWV3ZXJDb25maWcpOiBJbWFnZVZpZXdlckNvbmZpZyB7XHJcbiAgICBsZXQgcmVzdWx0OiBJbWFnZVZpZXdlckNvbmZpZyA9IHsgLi4uZGVmYXVsdFZhbHVlcyB9O1xyXG4gICAgaWYgKG92ZXJyaWRlVmFsdWVzKSB7XHJcbiAgICAgIHJlc3VsdCA9IHsgLi4uZGVmYXVsdFZhbHVlcywgLi4ub3ZlcnJpZGVWYWx1ZXMgfTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG5cclxufVxyXG4iLCI8ZGl2IFtuZ3hUb2dnbGVGdWxsc2NyZWVuXT1cImZ1bGxzY3JlZW5cIiBbbmdTdHlsZV09XCJjb25maWcuY29udGFpbmVyU3R5bGVcIiBjbGFzcz1cImltZy1jb250YWluZXJcIlxyXG4gICAgKHdoZWVsKT1cInNjcm9sbFpvb20oJGV2ZW50KVwiIChkcmFnb3Zlcik9XCJvbkRyYWdPdmVyKCRldmVudClcIj5cclxuICAgIDxpbWcgW3NyY109XCJzcmNbaW5kZXhdXCIgKGVycm9yKT1cIm9uRXJyb3IoaW5kZXgpXCIgW25nU3R5bGVdPVwic3R5bGVcIiBhbHQ9XCJJbWFnZSBub3QgZm91bmQuLi5cIiAoZHJhZ3N0YXJ0KT1cIm9uRHJhZ1N0YXJ0KCRldmVudClcIiAobG9hZCk9XCJvbkxvYWQoKVwiIChsb2Fkc3RhcnQpPVwib25Mb2FkU3RhcnQoKVwiLz5cclxuICA8IS0tIERpdiBiZWxvdyB3aWxsIGJlIHVzZWQgdG8gaGlkZSB0aGUgJ2dob3N0JyBpbWFnZSB3aGVuIGRyYWdnaW5nIC0tPlxyXG4gIDxkaXY+PC9kaXY+XHJcbiAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PiA8IS0tIFVzZWQgdG8gY2FwdHVyZSBhbnkgY29udGVudCB0aGF0IHlvdSB3YW50IHRvIGFkZCB0byB0aGlzIG1vZHVsZSAoVG8gc3VwcG9ydCBmdWxsIHNjcmVlbiBlbGVtZW50cyktLT5cclxuPC9kaXY+Il19