const sast = require('sast');
const find = require('unist-util-find');
const visit = require('unist-util-visit');
const colorString = require('color-string');

const is = type => node => node.type === type;

const scssColors = (scssString) => {
  const colors = {};
  const tree = sast.parse(scssString);
  visit(tree, is('declaration'), (decl) => {
    const nameNode = find(decl, is('ident'));
    const valueNode = find(decl, is('value'));
    if (nameNode && valueNode) {
      const name = nameNode.value;
      const colorNode = (find(valueNode, is('color')) || find(valueNode, is('ident')));
      if (!colorNode.value) return;
      let color = colorNode.value;
      color = colorString.get(color) || colorString.get(`#${color}`);
      if (!color) return;
      colors[name] = colorString.to.hex(color.value);
    }
  });
  return colors;
};

module.exports = scssColors;
