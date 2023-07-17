# ImageViewer

Updated and upgraded version of [jpilfold/ngx-image-viewer](https://github.com/jpilfold/ngx-image-viewer) with loads of features.

# NgxImageViewer

A configurable Angular image viewer component, compatible with Angular 13+

## Features:
 * Compatible with Angular 13+
 * Configurable
 * Rotate image
 * Zoom image
 * Drag to move image
 * Toggle fullscreen mode
 * HEIC support built in
 * Content projection to add your own html to the module

---

## Set up

To use default configuration, simply import the ImageViewerModule into your module, like so:

```javascript
import { ImageViewerModule } from "ngx-image-viewer";

@NgModule({
  //...
  imports: [
    //...
    ImageViewerModule.forRoot()
  ],
  //...
})
```

Then, add the component to your template, providing an array of image URLs. You can also optionally add an index, to indicate which image should be shown first. The default will be the first item in the array.

```html
<ngx-image-viewer  [src]="images" [(index)]="imageIndex"></ngx-image-viewer>
```

By default, the image viewer will fill its container. If you wish to restrict the size, simply place it within a div, and set the size constraints on the div.

---

## Configuration

Configuration can be provided at the module level (by passing the object as an argument to `forRoot()`, or at the component level, by passing it as the `config` input. Any configuration provided at the component level will override that which is set at the module level.

The configuration object is structured as below. All values are optional, and if ommitted, the default value shown below will be used.

```javascript
{
  btnClass: 'default', // The CSS class(es) that will apply to the buttons
  zoomFactor: 0.1, // The amount that the scale will be increased by
  containerBackgroundColor: '#ccc', // The color to use for the background. This can provided in hex, or rgb(a).
  wheelZoom: true, // If true, the mouse wheel can be used to zoom in
  allowFullscreen: true, // If true, the fullscreen button will be shown, allowing the user to entr fullscreen mode
  allowKeyboardNavigation: true, // If true, the left / right arrow keys can be used for navigation
};
```
---

## Content Project
By default, only the image is rendered in full screen mode. If you want to show anything else in the fullscreen, you can make use of this. To use it, simply put your content inside the 'ngx-image-viewer' element. It will automatically appear on the fullscreen. 

```html 
<ngx-image-viewer [src]="images">
    <div> Extra content for FS</div>
</ngx-image-viewer>
```