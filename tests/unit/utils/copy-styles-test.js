import copyStyles from 'ember-rasterize/utils/copy-styles';
import { module, test } from 'qunit';

module('Unit | Utility | copy styles');

const createElement = () => {
  return document.createElement('div');
};

test('it inlines styles from one element to another', function(assert) {
  const sourceElement = document.getElementById('sample-html-element'); // TODO: try this.render('<div>stuff</div>')
  const destinationElement = createElement();
  const fontSize = {
    size: '16px',
  };

  copyStyles(sourceElement, destinationElement, fontSize);

  const destinationStyles = destinationElement.getAttribute('style')
    .replace(/(\r?\n|\r|\s)+/gi, "");
  const expected = `animation:none0sease0s1normalnonerunning;background:rgba(0,0,0,0)nonerepeatscroll0%0%/autopadding-boxborder-box;border:0pxnonergb(255,0,0);bottom:auto;clear:none;clip:auto;color:rgb(255,0,0);columns:autoauto;contain:none;cursor:auto;cx:0px;cy:0px;d:none;direction:ltr;display:block;fill:rgb(0,0,0);filter:none;flex:01auto;float:none;font:normalnormalnormalnormalNaNpx/normalTimes;height:18px;isolation:auto;left:auto;margin:0px;mask:none;motion:none0pxauto0deg;opacity:1;order:0;orphans:2;outline:rgb(255,0,0)none0px;overflow:visible;padding:0px;perspective:none;position:static;r:0px;resize:none;right:auto;rx:auto;ry:auto;speak:normal;stroke:none;top:auto;transform:none;transition:all0sease0s;visibility:visible;widows:2;width:1249px;x:0px;y:0px;zoom:1;`;

  assert.equal(
    destinationStyles,
    expected,
    'destination element should have source element\'s styles inline'
  );
});
