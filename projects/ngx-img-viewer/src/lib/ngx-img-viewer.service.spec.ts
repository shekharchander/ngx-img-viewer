import { TestBed } from '@angular/core/testing';

import { ImageViewerService } from './ngx-img-viewer.service';

describe('ImageViewerService', () => {
  let service: ImageViewerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImageViewerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
