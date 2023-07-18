import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageViewerComponent } from './ngx-img-viewer.component';
import { ToggleFullscreenDirective } from './fullscreen.directive';
import * as i0 from "@angular/core";
export class ImageViewerModule {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWltZy12aWV3ZXIubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvbmd4LWltZy12aWV3ZXIvc3JjL2xpYi9uZ3gtaW1nLXZpZXdlci5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBdUIsTUFBTSxlQUFlLENBQUM7QUFDOUQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBRWxFLE9BQU8sRUFBRSx5QkFBeUIsRUFBRSxNQUFNLHdCQUF3QixDQUFDOztBQWFuRSxNQUFNLE9BQU8saUJBQWlCO0lBQzVCLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBMEI7UUFDdkMsT0FBTztZQUNMLFFBQVEsRUFBRSxpQkFBaUI7WUFDM0IsU0FBUyxFQUFFLENBQUMsRUFBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUMsQ0FBQztTQUNuRCxDQUFDO0lBQ0osQ0FBQzs7OEdBTlUsaUJBQWlCOytHQUFqQixpQkFBaUIsaUJBUDFCLG9CQUFvQjtRQUNwQix5QkFBeUIsYUFKekIsWUFBWSxhQU9aLG9CQUFvQjsrR0FHWCxpQkFBaUIsWUFWMUIsWUFBWTsyRkFVSCxpQkFBaUI7a0JBWjdCLFFBQVE7bUJBQUM7b0JBQ1IsT0FBTyxFQUFFO3dCQUNQLFlBQVk7cUJBQ2I7b0JBQ0QsWUFBWSxFQUFFO3dCQUNaLG9CQUFvQjt3QkFDcEIseUJBQXlCO3FCQUMxQjtvQkFDRCxPQUFPLEVBQUU7d0JBQ1Asb0JBQW9CO3FCQUNyQjtpQkFDRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlLCBNb2R1bGVXaXRoUHJvdmlkZXJzIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XHJcbmltcG9ydCB7IEltYWdlVmlld2VyQ29tcG9uZW50IH0gZnJvbSAnLi9uZ3gtaW1nLXZpZXdlci5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBJbWFnZVZpZXdlckNvbmZpZyB9IGZyb20gJy4vbmd4LWltZy12aWV3ZXItY29uZmlnLm1vZGVsJztcclxuaW1wb3J0IHsgVG9nZ2xlRnVsbHNjcmVlbkRpcmVjdGl2ZSB9IGZyb20gJy4vZnVsbHNjcmVlbi5kaXJlY3RpdmUnO1xyXG5ATmdNb2R1bGUoe1xyXG4gIGltcG9ydHM6IFtcclxuICAgIENvbW1vbk1vZHVsZVxyXG4gIF0sXHJcbiAgZGVjbGFyYXRpb25zOiBbXHJcbiAgICBJbWFnZVZpZXdlckNvbXBvbmVudCxcclxuICAgIFRvZ2dsZUZ1bGxzY3JlZW5EaXJlY3RpdmVcclxuICBdLFxyXG4gIGV4cG9ydHM6IFtcclxuICAgIEltYWdlVmlld2VyQ29tcG9uZW50XHJcbiAgXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgSW1hZ2VWaWV3ZXJNb2R1bGUge1xyXG4gIHN0YXRpYyBmb3JSb290KGNvbmZpZz86IEltYWdlVmlld2VyQ29uZmlnKTogTW9kdWxlV2l0aFByb3ZpZGVyczxJbWFnZVZpZXdlck1vZHVsZT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgbmdNb2R1bGU6IEltYWdlVmlld2VyTW9kdWxlLFxyXG4gICAgICBwcm92aWRlcnM6IFt7cHJvdmlkZTogJ2NvbmZpZycsIHVzZVZhbHVlOiBjb25maWd9XVxyXG4gICAgfTtcclxuICB9XHJcbn1cclxuIl19