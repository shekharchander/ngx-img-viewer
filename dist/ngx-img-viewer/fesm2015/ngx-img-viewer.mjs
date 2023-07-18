import * as i0 from '@angular/core';
import { Injectable, Directive, Input, EventEmitter, SecurityContext, Component, Optional, Inject, Output, HostListener, NgModule } from '@angular/core';
import heic2any from 'heic2any';
import * as i1 from '@angular/platform-browser';
import * as i2 from '@angular/common';
import { CommonModule } from '@angular/common';
import * as screenfull from 'screenfull';

class ImageViewerService {
    constructor() { }
}
ImageViewerService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.9", ngImport: i0, type: ImageViewerService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
ImageViewerService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.2.9", ngImport: i0, type: ImageViewerService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.9", ngImport: i0, type: ImageViewerService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: function () { return []; } });

class CustomEvent {
    constructor(name, imageIndex) {
        this.name = name;
        this.imageIndex = imageIndex;
    }
}

class ToggleFullscreenDirective {
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
ToggleFullscreenDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.9", ngImport: i0, type: ToggleFullscreenDirective, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive });
ToggleFullscreenDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.9", type: ToggleFullscreenDirective, selector: "[ngxToggleFullscreen]", inputs: { isFullscreen: ["ngxToggleFullscreen", "isFullscreen"] }, usesOnChanges: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.9", ngImport: i0, type: ToggleFullscreenDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[ngxToggleFullscreen]'
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }]; }, propDecorators: { isFullscreen: [{
                type: Input,
                args: ['ngxToggleFullscreen']
            }] } });

const DEFAULT_CONFIG = {
    zoomFactor: 0.1,
    containerStyle: {
        'background-color': '#ccc'
    },
    wheelZoom: false,
    allowFullscreen: true,
    allowKeyboardNavigation: true,
};
class ImageViewerComponent {
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
        let result = Object.assign({}, defaultValues);
        if (overrideValues) {
            result = Object.assign(Object.assign({}, defaultValues), overrideValues);
        }
        return result;
    }
}
ImageViewerComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.9", ngImport: i0, type: ImageViewerComponent, deps: [{ token: 'config', optional: true }, { token: i1.DomSanitizer }], target: i0.ɵɵFactoryTarget.Component });
ImageViewerComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.9", type: ImageViewerComponent, selector: "ngx-img-viewer", inputs: { src: "src", index: "index", config: "config" }, outputs: { src: "src", indexChange: "indexChange", configChange: "configChange", customEvent: "customEvent" }, host: { listeners: { "mouseover": "onMouseOver()", "mouseleave": "onMouseLeave()" } }, ngImport: i0, template: "<div [ngxToggleFullscreen]=\"fullscreen\" [ngStyle]=\"config.containerStyle\" class=\"img-container\"\r\n    (wheel)=\"scrollZoom($event)\" (dragover)=\"onDragOver($event)\">\r\n    <img [src]=\"src[index]\" (error)=\"onError(index)\" [ngStyle]=\"style\" alt=\"Image not found...\" (dragstart)=\"onDragStart($event)\" (load)=\"onLoad()\" (loadstart)=\"onLoadStart()\"/>\r\n  <!-- Div below will be used to hide the 'ghost' image when dragging -->\r\n  <div></div>\r\n  <ng-content></ng-content> <!-- Used to capture any content that you want to add to this module (To support full screen elements)-->\r\n</div>", styles: [".img-container{height:100%;width:100%;overflow:hidden;position:relative}.img-container img{z-index:2;margin:0 auto;display:block;max-width:100%;max-height:100%}@keyframes rotation{0%{-webkit-transform:rotate(0deg)}to{-webkit-transform:rotate(359deg)}}\n"], dependencies: [{ kind: "directive", type: i2.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "directive", type: ToggleFullscreenDirective, selector: "[ngxToggleFullscreen]", inputs: ["ngxToggleFullscreen"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.9", ngImport: i0, type: ImageViewerComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-img-viewer', template: "<div [ngxToggleFullscreen]=\"fullscreen\" [ngStyle]=\"config.containerStyle\" class=\"img-container\"\r\n    (wheel)=\"scrollZoom($event)\" (dragover)=\"onDragOver($event)\">\r\n    <img [src]=\"src[index]\" (error)=\"onError(index)\" [ngStyle]=\"style\" alt=\"Image not found...\" (dragstart)=\"onDragStart($event)\" (load)=\"onLoad()\" (loadstart)=\"onLoadStart()\"/>\r\n  <!-- Div below will be used to hide the 'ghost' image when dragging -->\r\n  <div></div>\r\n  <ng-content></ng-content> <!-- Used to capture any content that you want to add to this module (To support full screen elements)-->\r\n</div>", styles: [".img-container{height:100%;width:100%;overflow:hidden;position:relative}.img-container img{z-index:2;margin:0 auto;display:block;max-width:100%;max-height:100%}@keyframes rotation{0%{-webkit-transform:rotate(0deg)}to{-webkit-transform:rotate(359deg)}}\n"] }]
        }], ctorParameters: function () {
        return [{ type: undefined, decorators: [{
                        type: Optional
                    }, {
                        type: Inject,
                        args: ['config']
                    }] }, { type: i1.DomSanitizer }];
    }, propDecorators: { src: [{
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

class ImageViewerModule {
    static forRoot(config) {
        return {
            ngModule: ImageViewerModule,
            providers: [{ provide: 'config', useValue: config }]
        };
    }
}
ImageViewerModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.9", ngImport: i0, type: ImageViewerModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
ImageViewerModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.2.9", ngImport: i0, type: ImageViewerModule, declarations: [ImageViewerComponent,
        ToggleFullscreenDirective], imports: [CommonModule], exports: [ImageViewerComponent] });
ImageViewerModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.2.9", ngImport: i0, type: ImageViewerModule, imports: [CommonModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.9", ngImport: i0, type: ImageViewerModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule
                    ],
                    declarations: [
                        ImageViewerComponent,
                        ToggleFullscreenDirective
                    ],
                    exports: [
                        ImageViewerComponent
                    ]
                }]
        }] });

/*
 * Public API Surface of ngx-img-viewer
 */

/**
 * Generated bundle index. Do not edit.
 */

export { ImageViewerComponent, ImageViewerModule, ImageViewerService };
//# sourceMappingURL=ngx-img-viewer.mjs.map
