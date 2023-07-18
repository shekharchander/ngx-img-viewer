import {Component, OnInit, Input, Optional, Inject, Output, EventEmitter, HostListener, SecurityContext } from '@angular/core';
import { ImageViewerConfig, CustomEvent } from './ngx-img-viewer-config.model';
import heic2any from 'heic2any';
import { DomSanitizer } from '@angular/platform-browser';

const DEFAULT_CONFIG: ImageViewerConfig = {
  zoomFactor: 0.1,
  containerStyle: {
    'background-color':'#ccc'
  },
  wheelZoom: false,
  allowFullscreen: true,
  allowKeyboardNavigation: true,
};

@Component({
  selector: 'ngx-img-viewer',
  templateUrl: './ngx-img-viewer.component.html',
  styleUrls: ['./ngx-img-viewer.component.scss']
})
export class ImageViewerComponent implements OnInit {

  @Input() @Output()
  src: string[] = [];

  @Input()
  index = 0;

  @Input()
  config: ImageViewerConfig = {
    containerStyle: {
      'background-color':'#ccc'
    }
  }

  @Output()
  indexChange: EventEmitter<number> = new EventEmitter();

  @Output()
  configChange: EventEmitter<ImageViewerConfig> = new EventEmitter();

  @Output()
  customEvent: EventEmitter<CustomEvent> = new EventEmitter();

  checkedIndex:number[] = [];

  public style = { transform: '', msTransform: '', oTransform: '', webkitTransform: '' };
  public fullscreen = false;
  public loading = true;
  private scale = 1;
  private rotation = 0;
  private translateX = 0;
  private translateY = 0;
  private prevX?: number;
  private prevY?: number;
  private hovered = false;

  constructor(
    @Optional() @Inject('config') public moduleConfig: ImageViewerConfig,
    public sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.checkedIndex = [];
    const merged = this.mergeConfig(DEFAULT_CONFIG, this.moduleConfig);
    this.config = this.mergeConfig(merged, this.config);
    if(this.config.imgStyle){
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
    if(this.config.zoomFactor)
    this.scale *= (1 + this.config.zoomFactor);
    this.updateStyle();
  }

  zoomOut() {
    if(this.config.zoomFactor)
    if (this.scale > this.config.zoomFactor) {
      this.scale /= (1 + this.config.zoomFactor);
    }
    this.updateStyle();
  }
  
  onError(index:number){
    if(this.checkedIndex.includes(index)){
      return;
    }
    this.checkedIndex.push(index);
    fetch(this.src[index]).then(
      (r)=>{
        if(r.ok){
          r.blob().then((imageBlob)=>{
            heic2any({
              blob: imageBlob,
              toType: 'image/jpeg',
            }).then((img:any)=>{
            var reader = new FileReader();
            reader.readAsDataURL(img)
            reader.onloadend = ()=>{
              var b64:any = reader.result;
              this.src[index] = this.sanitizer.sanitize(SecurityContext.RESOURCE_URL, this.sanitizer.bypassSecurityTrustResourceUrl(b64))!;
            }
          },(error:any)=>{
            if(error.code == 1){
              var reader = new FileReader();
              reader.readAsDataURL(imageBlob)
              reader.onloadend = ()=>{
                var b64:any = reader.result;
                this.src[index] = this.sanitizer.sanitize(SecurityContext.RESOURCE_URL, this.sanitizer.bypassSecurityTrustResourceUrl(b64))!;
              }
            }
            else{
              this.customEvent.emit({
                name: 'error',
                imageIndex: this.index
              })
            }
          })
          })
        }
        else{
          this.customEvent.emit({
            name: 'error',
            imageIndex: this.index
          })    
        }
    },(error)=>{
      this.customEvent.emit({
        name: 'error',
        imageIndex: this.index
      }) 
    })
  }

  scrollZoom(evt:any) {
    if (this.config.wheelZoom) {
      evt.deltaY > 0 ? this.zoomOut() : this.zoomIn();
      return false;
    }
    else{
      return
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
    })
  }

  onLoadStart() {
    this.customEvent.emit({
      name: "loadStart",
      imageIndex: this.index
    })
  }

  onDragOver(evt:DragEvent) {
    if(this.prevX)
    this.translateX += (evt.clientX - this.prevX);
    if(this.prevY)
    this.translateY += (evt.clientY - this.prevY);
    this.prevX = evt.clientX;
    this.prevY = evt.clientY;
    this.updateStyle();
  }

  onDragStart(evt:DragEvent) {
    let nextSibling:Element | null = (evt.target as HTMLElement).nextElementSibling;
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

  fireCustomEvent(name: string, imageIndex: number) {
    this.customEvent.emit(new CustomEvent(name, imageIndex));
  }

  reset() {
    this.scale = 1;
    this.rotation = 0;
    this.translateX = 0;
    this.translateY = 0;
    this.updateStyle();
  }

  @HostListener('mouseover')
  private onMouseOver() {
    this.hovered = true;
  }

  @HostListener('mouseleave')
  private onMouseLeave() {
    this.hovered = false;
  }

  private canNavigate(event: any) {
    return event == null ||  (this.config.allowKeyboardNavigation && this.hovered);
  }

  private updateStyle() {
    this.style.transform = `translate(${this.translateX}px, ${this.translateY}px) rotate(${this.rotation}deg) scale(${this.scale})`;
    this.style.msTransform = this.style.transform;
    this.style.webkitTransform = this.style.transform;
    this.style.oTransform = this.style.transform;
  }

  private mergeConfig(defaultValues: ImageViewerConfig, overrideValues: ImageViewerConfig): ImageViewerConfig {
    let result: ImageViewerConfig = { ...defaultValues };
    if (overrideValues) {
      result = { ...defaultValues, ...overrideValues };
    }
    return result;
  }

}
