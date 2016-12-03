import computeFontSize from 'ember-rasterize/utils/compute-font-size';
import { module, test } from 'qunit';

module('Unit | Utility | compute font size');

test('new line height and size should be multiplied by passed in size if it has no units', function(assert) {
  assert.expect(1);

  const newSize = '2';
  const sizeValue = '12.4';
  const lineHeight = '14px';
  const lineHeightValue = '14';

  const result = computeFontSize(
    newSize,
    undefined,
    sizeValue,
    lineHeight,
    lineHeightValue
  );
  const expectedResult = {
    increasedFontSize: '24.8px',
    increasedLineHeight: '28px',
  };
  assert.deepEqual(
    result,
    expectedResult,
    'new size and line height should be multiplied by what is passed in'
  );
});

test('new line height and size should equal passed in size if it has units', function(assert) {
  assert.expect(1);

  const newSize = '12';
  const newSizeUnits = 'px';
  const sizeValue = '1234';
  const lineHeight = '14px';
  const lineHeightValue = '14';

  const result = computeFontSize(
    newSize,
    newSizeUnits,
    sizeValue,
    lineHeight,
    lineHeightValue
  );
  const expectedResult = {
    increasedFontSize: '12px',
    increasedLineHeight: '12px',
  };
  assert.deepEqual(
    result,
    expectedResult,
    'new size and line height should be exactly what is passed in'
  );
});

test('line height should not be modified if it doesn\'t have a numeric value', function(assert) {
  assert.expect(2);

  const newSize = '12';
  let newSizeUnits = 'px';
  const sizeValue = '1234';
  const lineHeight = 'normal';

  let result = computeFontSize(
    newSize,
    newSizeUnits,
    sizeValue,
    lineHeight
  );
  let expectedResult = 'normal';
  assert.equal(
    result.increasedLineHeight,
    expectedResult,
    'line height should not be changed if new size has units'
  );

  newSizeUnits = undefined;
  result = computeFontSize(
    newSize,
    newSizeUnits,
    sizeValue,
    lineHeight
  );
  expectedResult = 'normal';
  assert.equal(
    result.increasedLineHeight,
    expectedResult,
    'line height should not be changed if new size has no units'
  );
});
