# ember-rasterize

Rasterize HTML or SVG to an image in Ember. Useful for rendering HTML and SVG
charts in PDFs.

## Installation

In the root of your Ember application run:

```sh
ember install ember-rasterize
```

## Usage

### `rasterize(type, source[, fontMultiplier])`

Import `ember-rasterize` and call `rasterize` with `type`, `source`, and
optionally a `fontMultiplier`.

```js
import { rasterize } from 'ember-rasterize';

export default Ember.Component.extend({
  myRasterize() {
    const html = '<span>stuff</span>';
    return rasterize('html', html, 1.3);
  },
});
```

#### Parameters

| Name             | Type   | Required | Default  | Description                                       |
| ---------------- | ------ | -------- | -------- | ------------------------------------------------- |
| `type`           | string | Yes      | `<none>` | Valid options are `html` or `svg`.                |
| `source`         | string | Yes      | `<none>` | An HTMl or SVG string.                            |
| `fontMultiplier` | number | No       | `1`      | A multiplier by which to increase all font sizes. |

#### Returns

A URL encoded PNG image.
