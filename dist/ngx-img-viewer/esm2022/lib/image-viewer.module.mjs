import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageViewerComponent } from './image-viewer.component';
import { ToggleFullscreenDirective } from './fullscreen.directive';
import * as i0 from "@angular/core";
export class ImageViewerModule {
    static forRoot(config) {
        return {
            ngModule: ImageViewerModule,
            providers: [{ provide: 'config', useValue: config }]
        };
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.1.5", ngImport: i0, type: ImageViewerModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
    static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.1.5", ngImport: i0, type: ImageViewerModule, declarations: [ImageViewerComponent,
            ToggleFullscreenDirective], imports: [CommonModule], exports: [ImageViewerComponent] });
    static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.1.5", ngImport: i0, type: ImageViewerModule, imports: [CommonModule] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.1.5", ngImport: i0, type: ImageViewerModule, decorators: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1hZ2Utdmlld2VyLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9saWIvaW1hZ2Utdmlld2VyLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUF1QixNQUFNLGVBQWUsQ0FBQztBQUM5RCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFFaEUsT0FBTyxFQUFFLHlCQUF5QixFQUFFLE1BQU0sd0JBQXdCLENBQUM7O0FBYW5FLE1BQU0sT0FBTyxpQkFBaUI7SUFDNUIsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUEwQjtRQUN2QyxPQUFPO1lBQ0wsUUFBUSxFQUFFLGlCQUFpQjtZQUMzQixTQUFTLEVBQUUsQ0FBQyxFQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBQyxDQUFDO1NBQ25ELENBQUM7SUFDSixDQUFDO3VHQU5VLGlCQUFpQjt3R0FBakIsaUJBQWlCLGlCQVAxQixvQkFBb0I7WUFDcEIseUJBQXlCLGFBSnpCLFlBQVksYUFPWixvQkFBb0I7d0dBR1gsaUJBQWlCLFlBVjFCLFlBQVk7OzJGQVVILGlCQUFpQjtrQkFaN0IsUUFBUTttQkFBQztvQkFDUixPQUFPLEVBQUU7d0JBQ1AsWUFBWTtxQkFDYjtvQkFDRCxZQUFZLEVBQUU7d0JBQ1osb0JBQW9CO3dCQUNwQix5QkFBeUI7cUJBQzFCO29CQUNELE9BQU8sRUFBRTt3QkFDUCxvQkFBb0I7cUJBQ3JCO2lCQUNGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmdNb2R1bGUsIE1vZHVsZVdpdGhQcm92aWRlcnMgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcclxuaW1wb3J0IHsgSW1hZ2VWaWV3ZXJDb21wb25lbnQgfSBmcm9tICcuL2ltYWdlLXZpZXdlci5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBJbWFnZVZpZXdlckNvbmZpZyB9IGZyb20gJy4vaW1hZ2Utdmlld2VyLWNvbmZpZy5tb2RlbCc7XHJcbmltcG9ydCB7IFRvZ2dsZUZ1bGxzY3JlZW5EaXJlY3RpdmUgfSBmcm9tICcuL2Z1bGxzY3JlZW4uZGlyZWN0aXZlJztcclxuQE5nTW9kdWxlKHtcclxuICBpbXBvcnRzOiBbXHJcbiAgICBDb21tb25Nb2R1bGVcclxuICBdLFxyXG4gIGRlY2xhcmF0aW9uczogW1xyXG4gICAgSW1hZ2VWaWV3ZXJDb21wb25lbnQsXHJcbiAgICBUb2dnbGVGdWxsc2NyZWVuRGlyZWN0aXZlXHJcbiAgXSxcclxuICBleHBvcnRzOiBbXHJcbiAgICBJbWFnZVZpZXdlckNvbXBvbmVudFxyXG4gIF1cclxufSlcclxuZXhwb3J0IGNsYXNzIEltYWdlVmlld2VyTW9kdWxlIHtcclxuICBzdGF0aWMgZm9yUm9vdChjb25maWc/OiBJbWFnZVZpZXdlckNvbmZpZyk6IE1vZHVsZVdpdGhQcm92aWRlcnM8SW1hZ2VWaWV3ZXJNb2R1bGU+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIG5nTW9kdWxlOiBJbWFnZVZpZXdlck1vZHVsZSxcclxuICAgICAgcHJvdmlkZXJzOiBbe3Byb3ZpZGU6ICdjb25maWcnLCB1c2VWYWx1ZTogY29uZmlnfV1cclxuICAgIH07XHJcbiAgfVxyXG59XHJcbiJdfQ==