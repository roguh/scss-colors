const sast = require('sast');
const find = require('unist-util-find');
const visit = require('unist-util-visit');
const colorString = require('color-string');

const is = type => node => node.type === type;

const scssColors = (scssString) => {
  const colors = {};
  try {
    const tree = sast.parse(scssString);
    visit(tree, is('declaration'), (decl) => {
      const nameNode = find(decl, is('ident'));
      const valueNode = find(decl, is('value'));
      if (nameNode && valueNode) {
        const colorNode = (find(valueNode, is('color')) || find(valueNode, is('ident')));
        if (colorNode) {
          const name = nameNode.value;
          let color = colorNode.value;
          color = color && (colorString.get(color) || colorString.get(`#${color}`));
          if (color) {
            colors[name] = colorString.to.hex(color.value);
          }
        }
      }
    });
  } catch (TypeError) {
    return {};
  }
  return colors;
};

module.exports = scssColors;
