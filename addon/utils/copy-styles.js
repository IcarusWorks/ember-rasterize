import computeFontSize from './compute-font-size';

export default function copyStyles(
  element,
  destinationElement,
  {
    size,
    units,
  }
) {
  const elementStyles = window.getComputedStyle(element);
  const destinationElementStyles = window.getComputedStyle(destinationElement);
  const styles = Object.keys(elementStyles).reduce((styleString, propName) => {
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
        const pattern = /((?:\D|\s|\-)+)((\d*\.?\d+)px)( \/ )((\d*\.?\d+)px|normal)((?:\D|\s|\-)+)/ig;

        const updatedPropValue = propValue.replace(pattern, (
          match,
          fontStyleVariantWeightStretch,
          fontSize,
          fontSizeValue,
          separator,
          lineHeight,
          lineHeightValue,
          fontFamily
        ) => {
          const {
            increasedFontSize,
            increasedLineHeight,
          } = computeFontSize(
            size,
            units,
            fontSizeValue,
            lineHeight,
            lineHeightValue
          );

          return `
            ${fontStyleVariantWeightStretch}
            ${increasedFontSize}
            ${separator}
            ${increasedLineHeight} ${fontFamily}
          `;
        });

        styleString += `${propName}:${updatedPropValue};`;
      } else {
        styleString += `${propName}:${propValue};`;
      }
    }
    return styleString;
  }, '');

  destinationElement.setAttribute('style', styles);
}
