export default function computeFontSize(
  newSize,
  newSizeUnits,
  sizeValue,
  lineHeight,
  lineHeightValue
) {
  let increasedFontSize, increasedLineHeight;

  if (newSizeUnits) {
    increasedFontSize = `${newSize}${newSizeUnits}`;
    increasedLineHeight = lineHeightValue ? increasedFontSize : lineHeight;
  } else {
    increasedFontSize = `${sizeValue * newSize}px`;
    increasedLineHeight = lineHeightValue ? `${lineHeightValue * newSize}px` : lineHeight;
  }

  return {
    increasedFontSize,
    increasedLineHeight,
  };
}
