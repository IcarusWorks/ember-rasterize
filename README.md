# ember-rasterize

Rasterize HTML or SVG to an image in Ember. Useful for rendering HTML and SVG
charts in PDFs.

## Installation

In the root of your Ember application run:

```sh
ember install ember-rasterize
```

## Usage

### `rasterize(type, source[, fontSize])`

Inject the rasterizer service and call `rasterize` with `type`, `source`, and
optionally a `fontSize`.

```js
import Ember from 'ember';

const {
  inject,
} = Ember;

export default Ember.Component.extend({
  rasterizer: inject.service(),

  myRasterize() {
    const html = this.$();
    return get(this, 'rasterizer').rasterize('html', html, 1.3);
  },
});
```

#### Parameters

| Name       | Type          | Required | Default  | Description
| ---------- | ------------- | -------- | -------- | ------------------------------------------------------------------------------------------------------------------- |
| `type`     | string        | Yes      | `<none>` | Valid options are `html` or `svg`.                                                                                  |
| `source`   | string        | Yes      | `<none>` | An HTML or SVG string.                                                                                              |
| `fontSize` | number/string | No       | `1`      | A multiplier by which to increase all font sizes – or – a CSS font size string e.g., `10px`, `1rem`, `3.2em`, etc.  |

#### Returns

A URL encoded PNG image.
