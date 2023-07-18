import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageViewerComponent } from './ngx-img-viewer.component';

describe('ImageViewerComponent', () => {
  let component: ImageViewerComponent;
  let fixture: ComponentFixture<ImageViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should have default config values', () => {
    const defaultVal = component.config.btnClass;
    expect(defaultVal).toBeTruthy();
  });
});
