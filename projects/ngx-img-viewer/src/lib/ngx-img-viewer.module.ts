import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageViewerComponent } from './ngx-img-viewer.component';
import { ImageViewerConfig } from './ngx-img-viewer-config.model';
import { ToggleFullscreenDirective } from './fullscreen.directive';
@NgModule({
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
})
export class ImageViewerModule {
  static forRoot(config?: ImageViewerConfig): ModuleWithProviders<ImageViewerModule> {
    return {
      ngModule: ImageViewerModule,
      providers: [{provide: 'config', useValue: config}]
    };
  }
}
