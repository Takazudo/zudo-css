---
sidebar_position: 3
---

# Responsive Images

## The Problem

Images are one of the most common sources of layout issues and performance problems. AI agents frequently output `<img>` tags with fixed widths, forget `object-fit` (causing stretched or squished images), omit `aspect-ratio` (causing layout shift), and rarely generate proper `srcset`/`sizes` attributes or `<picture>` elements for art direction.

## The Solution

Responsive images require both CSS techniques (`object-fit`, `aspect-ratio`) for visual presentation and HTML attributes (`srcset`, `sizes`, `<picture>`) for performance and art direction.

## Code Examples

### Preventing Stretched Images with object-fit

The `object-fit` property controls how an image fills its container, similar to `background-size` for background images.

```css
/* Fills the container, cropping to maintain aspect ratio */
.image-cover {
  width: 100%;
  height: 300px;
  object-fit: cover;
}

/* Fits entirely within the container, letterboxing if needed */
.image-contain {
  width: 100%;
  height: 300px;
  object-fit: contain;
}
```

### Controlling Crop Position with object-position

```css
/* Focus on the top of the image when cropping */
.image-top {
  width: 100%;
  height: 200px;
  object-fit: cover;
  object-position: center top;
}

/* Focus on a specific area */
.image-focal {
  width: 100%;
  height: 200px;
  object-fit: cover;
  object-position: 30% 20%;
}
```

### Preventing Layout Shift with aspect-ratio

```css
.card__image {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
}

.avatar {
  width: 3rem;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 50%;
}

.hero-image {
  width: 100%;
  aspect-ratio: 21 / 9;
  object-fit: cover;
}
```

### Basic Responsive Image with max-width

```css
img {
  max-width: 100%;
  height: auto;
}
```

This is the minimum CSS every project should apply to images. It prevents images from overflowing their container while maintaining aspect ratio.

### Resolution Switching with srcset and sizes

Use `srcset` to provide multiple image sizes and `sizes` to tell the browser how wide the image will be rendered at different viewport widths.

```html
<img
  src="photo-800.jpg"
  srcset="
    photo-400.jpg   400w,
    photo-800.jpg   800w,
    photo-1200.jpg 1200w,
    photo-1600.jpg 1600w
  "
  sizes="
    (max-width: 600px) 100vw,
    (max-width: 1200px) 50vw,
    33vw
  "
  alt="A descriptive alt text"
  width="800"
  height="450"
  loading="lazy"
/>
```

- `srcset` lists available image files and their intrinsic widths.
- `sizes` describes how wide the image will be in the layout at different viewport widths.
- The browser picks the optimal file based on viewport width and device pixel ratio.
- `width` and `height` attributes provide the intrinsic dimensions for aspect ratio calculation before the image loads.

### Art Direction with the picture Element

Use `<picture>` when you need to serve a completely different image (different crop, different content) at different viewport widths.

```html
<picture>
  <source
    media="(min-width: 1024px)"
    srcset="hero-wide.jpg"
  />
  <source
    media="(min-width: 600px)"
    srcset="hero-medium.jpg"
  />
  <img
    src="hero-mobile.jpg"
    alt="Hero image"
    width="600"
    height="400"
    loading="lazy"
  />
</picture>
```

### Format Switching with picture

Serve modern formats with fallbacks:

```html
<picture>
  <source type="image/avif" srcset="photo.avif" />
  <source type="image/webp" srcset="photo.webp" />
  <img src="photo.jpg" alt="Description" width="800" height="600" />
</picture>
```

### Complete Responsive Image Pattern

Combining all techniques:

```html
<picture>
  <source
    type="image/avif"
    srcset="photo-400.avif 400w, photo-800.avif 800w, photo-1200.avif 1200w"
    sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw"
  />
  <source
    type="image/webp"
    srcset="photo-400.webp 400w, photo-800.webp 800w, photo-1200.webp 1200w"
    sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw"
  />
  <img
    src="photo-800.jpg"
    srcset="photo-400.jpg 400w, photo-800.jpg 800w, photo-1200.jpg 1200w"
    sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw"
    alt="A descriptive alt text"
    width="800"
    height="600"
    loading="lazy"
    decoding="async"
  />
</picture>
```

```css
picture img {
  width: 100%;
  height: auto;
  aspect-ratio: 4 / 3;
  object-fit: cover;
}
```

## Common AI Mistakes

- **Forgetting `object-fit`**: Setting a fixed `width` and `height` on an image without `object-fit: cover`, resulting in stretched or squished images.
- **No `aspect-ratio`**: Omitting `aspect-ratio` causes layout shift (CLS) when the image loads.
- **Missing `width` and `height` attributes**: These HTML attributes let the browser calculate the aspect ratio before the image loads, preventing layout shift.
- **No `srcset` or `sizes`**: Serving a single large image file to all devices wastes bandwidth on mobile.
- **Incorrect `sizes` values**: Using `sizes="100vw"` when the image only takes up a portion of the viewport, causing the browser to download an oversized file.
- **Using `background-image` for content images**: Content images should use `<img>` for accessibility (alt text) and performance (lazy loading). Reserve `background-image` for decorative images.
- **Forgetting `loading="lazy"`**: Images below the fold should use `loading="lazy"` to defer loading. However, do not lazy-load the LCP (Largest Contentful Paint) image — typically the hero image.

## When to Use

- **`object-fit: cover`**: Card thumbnails, hero images, avatars — any fixed-dimension image container.
- **`aspect-ratio`**: Whenever an image has a fixed container and you need to prevent layout shift.
- **`srcset` + `sizes`**: Any image served in more than one viewport context. This is the standard for production images.
- **`<picture>`**: Art direction (different crops at different sizes) or format switching (AVIF/WebP with JPEG fallback).
- **`loading="lazy"`**: All images below the fold.

## References

- [Responsive Images — web.dev](https://web.dev/learn/design/responsive-images)
- [Responsive Images in HTML — MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Responsive_images)
- [HTML Responsive Images Guide — CSS-Tricks](https://css-tricks.com/a-guide-to-the-responsive-images-syntax-in-html/)
- [Responsive Images Best Practices in 2025 — DEV Community](https://dev.to/razbakov/responsive-images-best-practices-in-2025-4dlb)
