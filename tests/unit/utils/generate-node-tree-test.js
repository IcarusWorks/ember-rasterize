import generateNodeTree from 'ember-rasterize/utils/generate-node-tree';
import { module, test } from 'qunit';

module('Unit | Utility | generate node tree');

const createTree = () => {
  const parent = document.createElement('div');
  const child1 = document.createElement('p');
  const child2 = document.createElement('p');
  const child3 = document.createElement('p');
  const grandchild1 = document.createElement('span');
  const grandchild2 = document.createElement('span');

  child1.appendChild(grandchild1);
  child1.appendChild(grandchild2);
  parent.appendChild(child1);
  parent.appendChild(child2);
  parent.appendChild(child3);

  return parent;
};

test('it works', function(assert) {
  const tree = createTree();
  const result = generateNodeTree(tree).map((node) => {
    return node.nodeName.toLowerCase();
  });
  const expected = [
    'div',
    'p',
    'span',
    'span',
    'p',
    'p',
  ];

  assert.deepEqual(
    result,
    expected,
    'correct node tree should be generated'
  );
});
