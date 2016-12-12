import Ember from 'ember';
import { task, } from 'ember-concurrency';
import rasterizeHtmlMethod from 'npm:rasterizehtml';
import canvasUrlFromImage from '../utils/canvas-url-from-image';
import generateNodeTree from '../utils/generate-node-tree';
import copyStyles from '../utils/copy-styles';

const {
  $,
  assert,
  get,
  RSVP,
  set,
} = Ember;

const supportedTypes = [
  'html',
  'svg',
];

export default Ember.Service.extend({
  clone: null,
  fontSize: null,

  rasterize(type, source, configFontSize=1) {
    assert('HTML and SVG are supported', supportedTypes.includes(type));

    const fontSize = this._splitRawFontSize(configFontSize);

    set(this, 'fontSize', fontSize);

    const clone = this._cloneSource(source);

    set(this, 'clone', clone);

    return get(this, `_rasterize${Ember.String.capitalize(type)}`)
      .perform();
  },

  _cloneSource(source) {
    const destinationEl = $(source).clone()[0];
    const sourceNodes = generateNodeTree(source);
    const destinationNodes = generateNodeTree(destinationEl);
    const fontSize = get(this, 'fontSize');

    sourceNodes.forEach((sourceNode, index) => {
      copyStyles(sourceNode, destinationNodes[index], fontSize);
    });

    return destinationEl;
  },

  _rasterizeHtml: task(function * () {
    const clone = get(this, 'clone');

    return yield rasterizeHtmlMethod.drawDocument(clone).then(({image}) => {
      const canvasUrl = canvasUrlFromImage(image);

      return canvasUrl;
    });
  }),

  _rasterizeSvg: task(function * () {
    const clone = get(this, 'clone');
    const sourceString = (new XMLSerializer()).serializeToString(clone);
    const image = new Image();

    image.src = `data:image/svg+xml,${encodeURIComponent(sourceString)}`;

    return yield new RSVP.Promise((resolve, reject) => {
      image.onerror = () => {
        reject('An error occurred saving the chart');
      };

      image.onload = () => {
        const canvasUrl = canvasUrlFromImage(image);

        resolve(canvasUrl);
      };
    });
  }),

  _splitRawFontSize(configFontSize) {
    const sizeString = configFontSize.toString();
    const unitsRegex = /(\d+\.?\d*)(cm|em|ex|in|mm|pc|pt|px|rem)*$/;
    const matches = unitsRegex.exec(sizeString);

    assert('Must pass a valid size', matches);
    if (!matches) { return; }

    const size = matches[1];
    const units = matches[2];

    return {
      size,
      units,
    };
  },
});
