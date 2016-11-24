import Ember from 'ember';
import { task, } from 'ember-concurrency';
import rasterizeHtml from 'npm:rasterizehtml';

const {
  $,
  get,
  RSVP,
  set,
} = Ember;

const rasterizer = {
  fontMultiplier: 1,

  rasterizeHtml: task(function * (html) {
    const inlinedStylesEl = this.inlineStyles(html);
    return yield rasterizeHtml.drawDocument(inlinedStylesEl).then(({image}) => {
      const canvasUrl = this.canvasUrlFromImage(image);

      return canvasUrl;
    });
  }),

  rasterizeSvg: task(function * (svg) {
    const inlinedStylesEl = this.inlineStyles(svg);
    const source = (new XMLSerializer()).serializeToString(inlinedStylesEl);
    const image = new Image();

    image.src = `data:image/svg+xml,${encodeURIComponent(source)}`;

    return yield new RSVP.Promise((resolve, reject) => {
      image.onerror = () => {
        reject('An error occurred saving the chart');
      };

      image.onload = () => {
        const canvasUrl = this.canvasUrlFromImage(image);

        resolve(canvasUrl);
      };
    });
  }),

  canvasUrlFromImage(image) {
    const canvas = document.createElement('canvas');

    canvas.width = image.width;
    canvas.height = image.height;

    const context = canvas.getContext('2d');

    context.drawImage(image, 0, 0);

    return canvas.toDataURL("image/png");
  },

  inlineStyles(sourceEl) {
    const destinationEl = $(sourceEl).clone()[0];
    const sourceNodes = this.generateNodeTree(sourceEl);
    const destinationNodes = this.generateNodeTree(destinationEl);

    sourceNodes.forEach((sourceNode, index) => {
      this.copyStyles(sourceNode, destinationNodes[index]);
    });

    return destinationEl;
  },

  generateNodeTree(obj, tree = []) {
    tree.push(obj);

    if (obj.hasChildNodes()) {
      let child = obj.firstChild;

      while (child) {
        if (child.nodeType === 1 && child.nodeName !== 'SCRIPT') {
          this.generateNodeTree(child, tree);
        }
        child = child.nextSibling;
      }
    }

    return tree;
  },

  copyStyles(element, destinationElement) {
    const elementStyles = window.getComputedStyle(element);
    const destinationElementStyles = window.getComputedStyle(destinationElement);
    let styleString = "";

    Object.keys(elementStyles).forEach((propName) => {
      const propValue = elementStyles.getPropertyValue(propName);

      if (propValue !== destinationElementStyles.getPropertyValue(propName)) {
        const fontProp = new RegExp('font', 'gi').test(propName);

        if (propName === 'visibility' && propValue === 'hidden') {
          styleString += 'display:none;';
        } else if (fontProp) {
          // Example:
          // normal normal normal normal 10px / 23.33px normal sans-serif
          //
          // Group #1: normal normal normal normal
          // Group #2: 10px
          // Group #3: 10
          // Group #4:  /
          // Group #5: 23.33px
          // Group #6: 23.33
          // Group #7:  normal sans-serif
          const fontMultiplier = get(this, 'fontMultiplier');
          const pattern = /((?:\D|\s|\-)+)((\d*\.?\d+)px)( \/ )((\d*\.?\d+)px)?((?:\D|\s|\-)+)/ig;
          const updatedPropValue = propValue.replace(pattern, (match, g1, g2, g3, g4, g5, g6, g7) => {
            const increasedFontSize = `${g3 * fontMultiplier}px`;
            const increasedLineHeight = g6 ? `${g6 * fontMultiplier}px` : '';

            return `${g1}${increasedFontSize}${g4}${increasedLineHeight}${g7}`;
          });

          styleString += `${propName}:${updatedPropValue};`;
        } else {
          styleString += `${propName}:${propValue};`;
        }
      }
    });

    destinationElement.setAttribute('style', styleString);
  },
};

export function rasterize(type, source, fontMultiplier=1) {
  set(rasterizer, 'fontMultiplier', fontMultiplier);
  return get(rasterizer, `rasterize${type.capitalize()}`)
    .perform(source);
}
