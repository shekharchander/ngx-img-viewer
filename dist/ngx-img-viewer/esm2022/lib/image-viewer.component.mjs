import { Component, Input, Optional, Inject, Output, EventEmitter, HostListener, SecurityContext } from '@angular/core';
import { CustomEvent } from './image-viewer-config.model';
import heic2any from 'heic2any';
import * as i0 from "@angular/core";
import * as i1 from "@angular/platform-browser";
import * as i2 from "@angular/common";
import * as i3 from "./fullscreen.directive";
const DEFAULT_CONFIG = {
    zoomFactor: 0.1,
    containerBackgroundColor: '#ccc',
    wheelZoom: false,
    allowFullscreen: true,
    allowKeyboardNavigation: true,
};
export class ImageViewerComponent {
    moduleConfig;
    sanitizer;
    src = [];
    index = 0;
    config = {};
    indexChange = new EventEmitter();
    configChange = new EventEmitter();
    customEvent = new EventEmitter();
    checkedIndex = [];
    style = { transform: '', msTransform: '', oTransform: '', webkitTransform: '' };
    fullscreen = false;
    loading = true;
    scale = 1;
    rotation = 0;
    translateX = 0;
    translateY = 0;
    prevX;
    prevY;
    hovered = false;
    constructor(moduleConfig, sanitizer) {
        this.moduleConfig = moduleConfig;
        this.sanitizer = sanitizer;
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
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.1.5", ngImport: i0, type: ImageViewerComponent, deps: [{ token: 'config', optional: true }, { token: i1.DomSanitizer }], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.1.5", type: ImageViewerComponent, selector: "ngx-image-preview", inputs: { src: "src", index: "index", config: "config" }, outputs: { src: "src", indexChange: "indexChange", configChange: "configChange", customEvent: "customEvent" }, host: { listeners: { "mouseover": "onMouseOver()", "mouseleave": "onMouseLeave()" } }, ngImport: i0, template: "<div [ngxToggleFullscreen]=\"fullscreen\" [ngStyle]=\"config.containerStyle\" class=\"img-container\"\r\n    (wheel)=\"scrollZoom($event)\" (dragover)=\"onDragOver($event)\">\r\n    <img [src]=\"src[index]\" (error)=\"onError(index)\" [ngStyle]=\"style\" alt=\"Image not found...\" (dragstart)=\"onDragStart($event)\" (load)=\"onLoad()\" (loadstart)=\"onLoadStart()\"/>\r\n  <!-- Div below will be used to hide the 'ghost' image when dragging -->\r\n  <div></div>\r\n  <ng-content></ng-content> <!-- Used to capture any content that you want to add to this module (To support full screen elements)-->\r\n</div>", styles: [".img-container{height:100%;width:100%;overflow:hidden;position:relative}.img-container img{z-index:2;margin:0 auto;display:block;max-width:100%;max-height:100%}@keyframes rotation{0%{-webkit-transform:rotate(0deg)}to{-webkit-transform:rotate(359deg)}}\n"], dependencies: [{ kind: "directive", type: i2.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "directive", type: i3.ToggleFullscreenDirective, selector: "[ngxToggleFullscreen]", inputs: ["ngxToggleFullscreen"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.1.5", ngImport: i0, type: ImageViewerComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-image-preview', template: "<div [ngxToggleFullscreen]=\"fullscreen\" [ngStyle]=\"config.containerStyle\" class=\"img-container\"\r\n    (wheel)=\"scrollZoom($event)\" (dragover)=\"onDragOver($event)\">\r\n    <img [src]=\"src[index]\" (error)=\"onError(index)\" [ngStyle]=\"style\" alt=\"Image not found...\" (dragstart)=\"onDragStart($event)\" (load)=\"onLoad()\" (loadstart)=\"onLoadStart()\"/>\r\n  <!-- Div below will be used to hide the 'ghost' image when dragging -->\r\n  <div></div>\r\n  <ng-content></ng-content> <!-- Used to capture any content that you want to add to this module (To support full screen elements)-->\r\n</div>", styles: [".img-container{height:100%;width:100%;overflow:hidden;position:relative}.img-container img{z-index:2;margin:0 auto;display:block;max-width:100%;max-height:100%}@keyframes rotation{0%{-webkit-transform:rotate(0deg)}to{-webkit-transform:rotate(359deg)}}\n"] }]
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1hZ2Utdmlld2VyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9saWIvaW1hZ2Utdmlld2VyLmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uL3NyYy9saWIvaW1hZ2Utdmlld2VyLmNvbXBvbmVudC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBQyxTQUFTLEVBQVUsS0FBSyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRSxZQUFZLEVBQUUsZUFBZSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQy9ILE9BQU8sRUFBcUIsV0FBVyxFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDN0UsT0FBTyxRQUFRLE1BQU0sVUFBVSxDQUFDOzs7OztBQUdoQyxNQUFNLGNBQWMsR0FBc0I7SUFDeEMsVUFBVSxFQUFFLEdBQUc7SUFDZix3QkFBd0IsRUFBRSxNQUFNO0lBQ2hDLFNBQVMsRUFBRSxLQUFLO0lBQ2hCLGVBQWUsRUFBRSxJQUFJO0lBQ3JCLHVCQUF1QixFQUFFLElBQUk7Q0FDOUIsQ0FBQztBQU9GLE1BQU0sT0FBTyxvQkFBb0I7SUFrQ1E7SUFDOUI7SUFoQ1QsR0FBRyxHQUFhLEVBQUUsQ0FBQztJQUduQixLQUFLLEdBQUcsQ0FBQyxDQUFDO0lBR1YsTUFBTSxHQUFzQixFQUFFLENBQUM7SUFHL0IsV0FBVyxHQUF5QixJQUFJLFlBQVksRUFBRSxDQUFDO0lBR3ZELFlBQVksR0FBb0MsSUFBSSxZQUFZLEVBQUUsQ0FBQztJQUduRSxXQUFXLEdBQThCLElBQUksWUFBWSxFQUFFLENBQUM7SUFFNUQsWUFBWSxHQUFZLEVBQUUsQ0FBQztJQUVwQixLQUFLLEdBQUcsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFLFdBQVcsRUFBRSxFQUFFLEVBQUUsVUFBVSxFQUFFLEVBQUUsRUFBRSxlQUFlLEVBQUUsRUFBRSxFQUFFLENBQUM7SUFDaEYsVUFBVSxHQUFHLEtB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LEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUM7SUFDL0MsQ0FBQztJQUVPLFdBQVcsQ0FBQyxhQUFnQyxFQUFFLGNBQWlDO1FBQ3JGLElBQUksTUFBTSxHQUFzQixFQUFFLEdBQUcsYUFBYSxFQUFFLENBQUM7UUFDckQsSUFBSSxjQUFjLEVBQUU7WUFDbEIsTUFBTSxHQUFHLEVBQUUsR0FBRyxhQUFhLEVBQUUsR0FBRyxjQUFjLEVBQUUsQ0FBQztTQUNsRDtRQUNELE9BQU8sTUFBTSxDQUFDO0lBQ2hCLENBQUM7dUdBL09VLG9CQUFvQixrQkFrQ1QsUUFBUTsyRkFsQ25CLG9CQUFvQix5VENsQmpDLG9tQkFNTTs7MkZEWU8sb0JBQW9CO2tCQUxoQyxTQUFTOytCQUNFLG1CQUFtQjs7MEJBc0MxQixRQUFROzswQkFBSSxNQUFNOzJCQUFDLFFBQVE7dUVBL0I5QixHQUFHO3NCQURGLEtBQUs7O3NCQUFJLE1BQU07Z0JBSWhCLEtBQUs7c0JBREosS0FBSztnQkFJTixNQUFNO3NCQURMLEtBQUs7Z0JBSU4sV0FBVztzQkFEVixNQUFNO2dCQUlQLFlBQVk7c0JBRFgsTUFBTTtnQkFJUCxXQUFXO3NCQURWLE1BQU07Z0JBb01DLFdBQVc7c0JBRGxCLFlBQVk7dUJBQUMsV0FBVztnQkFNakIsWUFBWTtzQkFEbkIsWUFBWTt1QkFBQyxZQUFZIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtDb21wb25lbnQsIE9uSW5pdCwgSW5wdXQsIE9wdGlvbmFsLCBJbmplY3QsIE91dHB1dCwgRXZlbnRFbWl0dGVyLCBIb3N0TGlzdGVuZXIsIFNlY3VyaXR5Q29udGV4dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBJbWFnZVZpZXdlckNvbmZpZywgQ3VzdG9tRXZlbnQgfSBmcm9tICcuL2ltYWdlLXZpZXdlci1jb25maWcubW9kZWwnO1xyXG5pbXBvcnQgaGVpYzJhbnkgZnJvbSAnaGVpYzJhbnknO1xyXG5pbXBvcnQgeyBEb21TYW5pdGl6ZXIgfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyJztcclxuXHJcbmNvbnN0IERFRkFVTFRfQ09ORklHOiBJbWFnZVZpZXdlckNvbmZpZyA9IHtcclxuICB6b29tRmFjdG9yOiAwLjEsXHJcbiAgY29udGFpbmVyQmFja2dyb3VuZENvbG9yOiAnI2NjYycsXHJcbiAgd2hlZWxab29tOiBmYWxzZSxcclxuICBhbGxvd0Z1bGxzY3JlZW46IHRydWUsXHJcbiAgYWxsb3dLZXlib2FyZE5hdmlnYXRpb246IHRydWUsXHJcbn07XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ25neC1pbWFnZS1wcmV2aWV3JyxcclxuICB0ZW1wbGF0ZVVybDogJy4vaW1hZ2Utdmlld2VyLmNvbXBvbmVudC5odG1sJyxcclxuICBzdHlsZVVybHM6IFsnLi9pbWFnZS12aWV3ZXIuY29tcG9uZW50LnNjc3MnXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgSW1hZ2VWaWV3ZXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xyXG5cclxuICBASW5wdXQoKSBAT3V0cHV0KClcclxuICBzcmM6IHN0cmluZ1tdID0gW107XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgaW5kZXggPSAwO1xyXG5cclxuICBASW5wdXQoKVxyXG4gIGNvbmZpZzogSW1hZ2VWaWV3ZXJDb25maWcgPSB7fTtcclxuXHJcbiAgQE91dHB1dCgpXHJcbiAgaW5kZXhDaGFuZ2U6IEV2ZW50RW1pdHRlcjxudW1iZXI+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuICBAT3V0cHV0KClcclxuICBjb25maWdDaGFuZ2U6IEV2ZW50RW1pdHRlcjxJbWFnZVZpZXdlckNvbmZpZz4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG4gIEBPdXRwdXQoKVxyXG4gIGN1c3RvbUV2ZW50OiBFdmVudEVtaXR0ZXI8Q3VzdG9tRXZlbnQ+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuICBjaGVja2VkSW5kZXg6bnVtYmVyW10gPSBbXTtcclxuXHJcbiAgcHVibGljIHN0eWxlID0geyB0cmFuc2Zvcm06ICcnLCBtc1RyYW5zZm9ybTogJycsIG9UcmFuc2Zvcm06ICcnLCB3ZWJraXRUcmFuc2Zvcm06ICcnIH07XHJcbiAgcHVibGljIGZ1bGxzY3JlZW4gPSBmYWxzZTtcclxuICBwdWJsaWMgbG9hZGluZyA9IHRydWU7XHJcbiAgcHJpdmF0ZSBzY2FsZSA9IDE7XHJcbiAgcHJpdmF0ZSByb3RhdGlvbiA9IDA7XHJcbiAgcHJpdmF0ZSB0cmFuc2xhdGVYID0gMDtcclxuICBwcml2YXRlIHRyYW5zbGF0ZVkgPSAwO1xyXG4gIHByaXZhdGUgcHJldlg/OiBudW1iZXI7XHJcbiAgcHJpdmF0ZSBwcmV2WT86IG51bWJlcjtcclxuICBwcml2YXRlIGhvdmVyZWQgPSBmYWxzZTtcclxuXHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KCdjb25maWcnKSBwdWJsaWMgbW9kdWxlQ29uZmlnOiBJbWFnZVZpZXdlckNvbmZpZyxcclxuICAgIHB1YmxpYyBzYW5pdGl6ZXI6IERvbVNhbml0aXplclxyXG4gICkge31cclxuXHJcbiAgbmdPbkluaXQoKSB7XHJcbiAgICB0aGlzLmNoZWNrZWRJbmRleCA9IFtdO1xyXG4gICAgY29uc3QgbWVyZ2VkID0gdGhpcy5tZXJnZUNvbmZpZyhERUZBVUxUX0NPTkZJRywgdGhpcy5tb2R1bGVDb25maWcpO1xyXG4gICAgdGhpcy5jb25maWcgPSB0aGlzLm1lcmdlQ29uZmlnKG1lcmdlZCwgdGhpcy5jb25maWcpO1xyXG4gICAgaWYodGhpcy5jb25maWcuaW1nU3R5bGUpe1xyXG4gICAgICB0aGlzLnN0eWxlID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5jb25maWcuaW1nU3R5bGUsIHRoaXMuc3R5bGUpO1xyXG4gICAgfVxyXG4gICAgdGhpcy50cmlnZ2VyQ29uZmlnQmluZGluZygpO1xyXG4gIH1cclxuICAvLyBASG9zdExpc3RlbmVyKCd3aW5kb3c6a2V5dXAuQXJyb3dSaWdodCcsICBbJyRldmVudCddKVxyXG4gIC8vIG5leHRJbWFnZShldmVudDpFdmVudCkge1xyXG4gIC8vICAgaWYgKHRoaXMuY2FuTmF2aWdhdGUoZXZlbnQpICYmIHRoaXMuaW5kZXggPCB0aGlzLnNyYy5sZW5ndGggLSAxKSB7XHJcbiAgLy8gICAgIHRoaXMubG9hZGluZyA9IHRydWU7XHJcbiAgLy8gICAgIHRoaXMuaW5kZXgrKztcclxuICAvLyAgICAgdGhpcy50cmlnZ2VySW5kZXhCaW5kaW5nKCk7XHJcbiAgLy8gICAgIHRoaXMucmVzZXQoKTtcclxuICAvLyAgIH1cclxuICAvLyB9XHJcblxyXG4gIC8vIEBIb3N0TGlzdGVuZXIoJ3dpbmRvdzprZXl1cC5BcnJvd0xlZnQnLCBbJyRldmVudCddKVxyXG4gIC8vIHByZXZJbWFnZShldmVudDpFdmVudCkge1xyXG4gIC8vICAgaWYgKHRoaXMuY2FuTmF2aWdhdGUoZXZlbnQpICYmIHRoaXMuaW5kZXggPiAwKSB7XHJcbiAgLy8gICAgIHRoaXMubG9hZGluZyA9IHRydWU7XHJcbiAgLy8gICAgIHRoaXMuaW5kZXgtLTtcclxuICAvLyAgICAgdGhpcy50cmlnZ2VySW5kZXhCaW5kaW5nKCk7XHJcbiAgLy8gICAgIHRoaXMucmVzZXQoKTtcclxuICAvLyAgIH1cclxuICAvLyB9XHJcblxyXG4gIHpvb21JbigpIHtcclxuICAgIGlmKHRoaXMuY29uZmlnLnpvb21GYWN0b3IpXHJcbiAgICB0aGlzLnNjYWxlICo9ICgxICsgdGhpcy5jb25maWcuem9vbUZhY3Rvcik7XHJcbiAgICB0aGlzLnVwZGF0ZVN0eWxlKCk7XHJcbiAgfVxyXG5cclxuICB6b29tT3V0KCkge1xyXG4gICAgaWYodGhpcy5jb25maWcuem9vbUZhY3RvcilcclxuICAgIGlmICh0aGlzLnNjYWxlID4gdGhpcy5jb25maWcuem9vbUZhY3Rvcikge1xyXG4gICAgICB0aGlzLnNjYWxlIC89ICgxICsgdGhpcy5jb25maWcuem9vbUZhY3Rvcik7XHJcbiAgICB9XHJcbiAgICB0aGlzLnVwZGF0ZVN0eWxlKCk7XHJcbiAgfVxyXG4gIFxyXG4gIG9uRXJyb3IoaW5kZXg6bnVtYmVyKXtcclxuICAgIGlmKHRoaXMuY2hlY2tlZEluZGV4LmluY2x1ZGVzKGluZGV4KSl7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIHRoaXMuY2hlY2tlZEluZGV4LnB1c2goaW5kZXgpO1xyXG4gICAgZmV0Y2godGhpcy5zcmNbaW5kZXhdKS50aGVuKFxyXG4gICAgICAocik9PntcclxuICAgICAgICBpZihyLm9rKXtcclxuICAgICAgICAgIHIuYmxvYigpLnRoZW4oKGltYWdlQmxvYik9PntcclxuICAgICAgICAgICAgaGVpYzJhbnkoe1xyXG4gICAgICAgICAgICAgIGJsb2I6IGltYWdlQmxvYixcclxuICAgICAgICAgICAgICB0b1R5cGU6ICdpbWFnZS9qcGVnJyxcclxuICAgICAgICAgICAgfSkudGhlbigoaW1nOmFueSk9PntcclxuICAgICAgICAgICAgdmFyIHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XHJcbiAgICAgICAgICAgIHJlYWRlci5yZWFkQXNEYXRhVVJMKGltZylcclxuICAgICAgICAgICAgcmVhZGVyLm9ubG9hZGVuZCA9ICgpPT57XHJcbiAgICAgICAgICAgICAgdmFyIGI2NDphbnkgPSByZWFkZXIucmVzdWx0O1xyXG4gICAgICAgICAgICAgIHRoaXMuc3JjW2luZGV4XSA9IHRoaXMuc2FuaXRpemVyLnNhbml0aXplKFNlY3VyaXR5Q29udGV4dC5SRVNPVVJDRV9VUkwsIHRoaXMuc2FuaXRpemVyLmJ5cGFzc1NlY3VyaXR5VHJ1c3RSZXNvdXJjZVVybChiNjQpKSE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0sKGVycm9yOmFueSk9PntcclxuICAgICAgICAgICAgaWYoZXJyb3IuY29kZSA9PSAxKXtcclxuICAgICAgICAgICAgICB2YXIgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcclxuICAgICAgICAgICAgICByZWFkZXIucmVhZEFzRGF0YVVSTChpbWFnZUJsb2IpXHJcbiAgICAgICAgICAgICAgcmVhZGVyLm9ubG9hZGVuZCA9ICgpPT57XHJcbiAgICAgICAgICAgICAgICB2YXIgYjY0OmFueSA9IHJlYWRlci5yZXN1bHQ7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNyY1tpbmRleF0gPSB0aGlzLnNhbml0aXplci5zYW5pdGl6ZShTZWN1cml0eUNvbnRleHQuUkVTT1VSQ0VfVVJMLCB0aGlzLnNhbml0aXplci5ieXBhc3NTZWN1cml0eVRydXN0UmVzb3VyY2VVcmwoYjY0KSkhO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICAgIHRoaXMuY3VzdG9tRXZlbnQuZW1pdCh7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnZXJyb3InLFxyXG4gICAgICAgICAgICAgICAgaW1hZ2VJbmRleDogdGhpcy5pbmRleFxyXG4gICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNle1xyXG4gICAgICAgICAgdGhpcy5jdXN0b21FdmVudC5lbWl0KHtcclxuICAgICAgICAgICAgbmFtZTogJ2Vycm9yJyxcclxuICAgICAgICAgICAgaW1hZ2VJbmRleDogdGhpcy5pbmRleFxyXG4gICAgICAgICAgfSkgICAgXHJcbiAgICAgICAgfVxyXG4gICAgfSwoZXJyb3IpPT57XHJcbiAgICAgIHRoaXMuY3VzdG9tRXZlbnQuZW1pdCh7XHJcbiAgICAgICAgbmFtZTogJ2Vycm9yJyxcclxuICAgICAgICBpbWFnZUluZGV4OiB0aGlzLmluZGV4XHJcbiAgICAgIH0pIFxyXG4gICAgfSlcclxuICB9XHJcblxyXG4gIHNjcm9sbFpvb20oZXZ0OmFueSkge1xyXG4gICAgaWYgKHRoaXMuY29uZmlnLndoZWVsWm9vbSkge1xyXG4gICAgICBldnQuZGVsdGFZID4gMCA/IHRoaXMuem9vbU91dCgpIDogdGhpcy56b29tSW4oKTtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgZWxzZXtcclxuICAgICAgcmV0dXJuXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByb3RhdGVDbG9ja3dpc2UoKSB7XHJcbiAgICB0aGlzLnJvdGF0aW9uICs9IDkwO1xyXG4gICAgdGhpcy51cGRhdGVTdHlsZSgpO1xyXG4gIH1cclxuXHJcbiAgcm90YXRlQ291bnRlckNsb2Nrd2lzZSgpIHtcclxuICAgIHRoaXMucm90YXRpb24gLT0gOTA7XHJcbiAgICB0aGlzLnVwZGF0ZVN0eWxlKCk7XHJcbiAgfVxyXG5cclxuICBvbkxvYWQoKSB7XHJcbiAgICB0aGlzLmN1c3RvbUV2ZW50LmVtaXQoe1xyXG4gICAgICBuYW1lOiBcImxvYWRcIixcclxuICAgICAgaW1hZ2VJbmRleDogdGhpcy5pbmRleFxyXG4gICAgfSlcclxuICB9XHJcblxyXG4gIG9uTG9hZFN0YXJ0KCkge1xyXG4gICAgdGhpcy5jdXN0b21FdmVudC5lbWl0KHtcclxuICAgICAgbmFtZTogXCJsb2FkU3RhcnRcIixcclxuICAgICAgaW1hZ2VJbmRleDogdGhpcy5pbmRleFxyXG4gICAgfSlcclxuICB9XHJcblxyXG4gIG9uRHJhZ092ZXIoZXZ0OkRyYWdFdmVudCkge1xyXG4gICAgaWYodGhpcy5wcmV2WClcclxuICAgIHRoaXMudHJhbnNsYXRlWCArPSAoZXZ0LmNsaWVudFggLSB0aGlzLnByZXZYKTtcclxuICAgIGlmKHRoaXMucHJldlkpXHJcbiAgICB0aGlzLnRyYW5zbGF0ZVkgKz0gKGV2dC5jbGllbnRZIC0gdGhpcy5wcmV2WSk7XHJcbiAgICB0aGlzLnByZXZYID0gZXZ0LmNsaWVudFg7XHJcbiAgICB0aGlzLnByZXZZID0gZXZ0LmNsaWVudFk7XHJcbiAgICB0aGlzLnVwZGF0ZVN0eWxlKCk7XHJcbiAgfVxyXG5cclxuICBvbkRyYWdTdGFydChldnQ6RHJhZ0V2ZW50KSB7XHJcbiAgICBsZXQgbmV4dFNpYmxpbmc6RWxlbWVudCB8IG51bGwgPSAoZXZ0LnRhcmdldCBhcyBIVE1MRWxlbWVudCkubmV4dEVsZW1lbnRTaWJsaW5nO1xyXG4gICAgaWYgKGV2dC5kYXRhVHJhbnNmZXIgJiYgZXZ0LmRhdGFUcmFuc2Zlci5zZXREcmFnSW1hZ2UgJiYgbmV4dFNpYmxpbmcpIHtcclxuICAgICAgZXZ0LmRhdGFUcmFuc2Zlci5zZXREcmFnSW1hZ2UobmV4dFNpYmxpbmcsIDAsIDApO1xyXG4gICAgfVxyXG4gICAgdGhpcy5wcmV2WCA9IGV2dC5jbGllbnRYO1xyXG4gICAgdGhpcy5wcmV2WSA9IGV2dC5jbGllbnRZO1xyXG4gIH1cclxuXHJcbiAgdG9nZ2xlRnVsbHNjcmVlbigpIHtcclxuICAgIHRoaXMuZnVsbHNjcmVlbiA9ICF0aGlzLmZ1bGxzY3JlZW47XHJcbiAgICBpZiAoIXRoaXMuZnVsbHNjcmVlbikge1xyXG4gICAgICB0aGlzLnJlc2V0KCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB0cmlnZ2VySW5kZXhCaW5kaW5nKCkge1xyXG4gICAgdGhpcy5pbmRleENoYW5nZS5lbWl0KHRoaXMuaW5kZXgpO1xyXG4gIH1cclxuXHJcbiAgdHJpZ2dlckNvbmZpZ0JpbmRpbmcoKSB7XHJcbiAgICB0aGlzLmNvbmZpZ0NoYW5nZS5uZXh0KHRoaXMuY29uZmlnKTtcclxuICB9XHJcblxyXG4gIGZpcmVDdXN0b21FdmVudChuYW1lOiBzdHJpbmcsIGltYWdlSW5kZXg6IG51bWJlcikge1xyXG4gICAgdGhpcy5jdXN0b21FdmVudC5lbWl0KG5ldyBDdXN0b21FdmVudChuYW1lLCBpbWFnZUluZGV4KSk7XHJcbiAgfVxyXG5cclxuICByZXNldCgpIHtcclxuICAgIHRoaXMuc2NhbGUgPSAxO1xyXG4gICAgdGhpcy5yb3RhdGlvbiA9IDA7XHJcbiAgICB0aGlzLnRyYW5zbGF0ZVggPSAwO1xyXG4gICAgdGhpcy50cmFuc2xhdGVZID0gMDtcclxuICAgIHRoaXMudXBkYXRlU3R5bGUoKTtcclxuICB9XHJcblxyXG4gIEBIb3N0TGlzdGVuZXIoJ21vdXNlb3ZlcicpXHJcbiAgcHJpdmF0ZSBvbk1vdXNlT3ZlcigpIHtcclxuICAgIHRoaXMuaG92ZXJlZCA9IHRydWU7XHJcbiAgfVxyXG5cclxuICBASG9zdExpc3RlbmVyKCdtb3VzZWxlYXZlJylcclxuICBwcml2YXRlIG9uTW91c2VMZWF2ZSgpIHtcclxuICAgIHRoaXMuaG92ZXJlZCA9IGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBjYW5OYXZpZ2F0ZShldmVudDogYW55KSB7XHJcbiAgICByZXR1cm4gZXZlbnQgPT0gbnVsbCB8fCAgKHRoaXMuY29uZmlnLmFsbG93S2V5Ym9hcmROYXZpZ2F0aW9uICYmIHRoaXMuaG92ZXJlZCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHVwZGF0ZVN0eWxlKCkge1xyXG4gICAgdGhpcy5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlKCR7dGhpcy50cmFuc2xhdGVYfXB4LCAke3RoaXMudHJhbnNsYXRlWX1weCkgcm90YXRlKCR7dGhpcy5yb3RhdGlvbn1kZWcpIHNjYWxlKCR7dGhpcy5zY2FsZX0pYDtcclxuICAgIHRoaXMuc3R5bGUubXNUcmFuc2Zvcm0gPSB0aGlzLnN0eWxlLnRyYW5zZm9ybTtcclxuICAgIHRoaXMuc3R5bGUud2Via2l0VHJhbnNmb3JtID0gdGhpcy5zdHlsZS50cmFuc2Zvcm07XHJcbiAgICB0aGlzLnN0eWxlLm9UcmFuc2Zvcm0gPSB0aGlzLnN0eWxlLnRyYW5zZm9ybTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgbWVyZ2VDb25maWcoZGVmYXVsdFZhbHVlczogSW1hZ2VWaWV3ZXJDb25maWcsIG92ZXJyaWRlVmFsdWVzOiBJbWFnZVZpZXdlckNvbmZpZyk6IEltYWdlVmlld2VyQ29uZmlnIHtcclxuICAgIGxldCByZXN1bHQ6IEltYWdlVmlld2VyQ29uZmlnID0geyAuLi5kZWZhdWx0VmFsdWVzIH07XHJcbiAgICBpZiAob3ZlcnJpZGVWYWx1ZXMpIHtcclxuICAgICAgcmVzdWx0ID0geyAuLi5kZWZhdWx0VmFsdWVzLCAuLi5vdmVycmlkZVZhbHVlcyB9O1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcblxyXG59XHJcbiIsIjxkaXYgW25neFRvZ2dsZUZ1bGxzY3JlZW5dPVwiZnVsbHNjcmVlblwiIFtuZ1N0eWxlXT1cImNvbmZpZy5jb250YWluZXJTdHlsZVwiIGNsYXNzPVwiaW1nLWNvbnRhaW5lclwiXHJcbiAgICAod2hlZWwpPVwic2Nyb2xsWm9vbSgkZXZlbnQpXCIgKGRyYWdvdmVyKT1cIm9uRHJhZ092ZXIoJGV2ZW50KVwiPlxyXG4gICAgPGltZyBbc3JjXT1cInNyY1tpbmRleF1cIiAoZXJyb3IpPVwib25FcnJvcihpbmRleClcIiBbbmdTdHlsZV09XCJzdHlsZVwiIGFsdD1cIkltYWdlIG5vdCBmb3VuZC4uLlwiIChkcmFnc3RhcnQpPVwib25EcmFnU3RhcnQoJGV2ZW50KVwiIChsb2FkKT1cIm9uTG9hZCgpXCIgKGxvYWRzdGFydCk9XCJvbkxvYWRTdGFydCgpXCIvPlxyXG4gIDwhLS0gRGl2IGJlbG93IHdpbGwgYmUgdXNlZCB0byBoaWRlIHRoZSAnZ2hvc3QnIGltYWdlIHdoZW4gZHJhZ2dpbmcgLS0+XHJcbiAgPGRpdj48L2Rpdj5cclxuICA8bmctY29udGVudD48L25nLWNvbnRlbnQ+IDwhLS0gVXNlZCB0byBjYXB0dXJlIGFueSBjb250ZW50IHRoYXQgeW91IHdhbnQgdG8gYWRkIHRvIHRoaXMgbW9kdWxlIChUbyBzdXBwb3J0IGZ1bGwgc2NyZWVuIGVsZW1lbnRzKS0tPlxyXG48L2Rpdj4iXX0=