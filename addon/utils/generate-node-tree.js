export default function generateNodeTree(obj, tree = []) {
  tree.push(obj);

  if (obj && obj.hasChildNodes()) {
    let child = obj.firstChild;

    while (child) {
      if (child.nodeType === 1 && child.nodeName !== 'SCRIPT') {
        generateNodeTree(child, tree);
      }
      child = child.nextSibling;
    }
  }

  return tree;
}
