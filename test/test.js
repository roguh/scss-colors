/* global describe, it */
const { expect } = require('chai');
const scssColors = require('..');

describe('parse colors', () => {
  it('should parse an SCSS variable set to a hex-value color', () => {
    const result = scssColors('$color: #c01085;');
    expect(result).to.deep.equal({ color: '#C01085' });
  });

  it('should parse an SCSS variable set to a short hex-value color', () => {
    const result = scssColors('$color: #fff;');
    expect(result).to.deep.equal({ color: '#FFFFFF' });
  });

  it('should parse an SCSS variable set to a web-safe color', () => {
    const result = scssColors('$color: red;');
    expect(result).to.deep.equal({ color: '#FF0000' });
  });

  it('should parse multiple SCSS variables', () => {
    const result = scssColors('$color1:red;$color2: blue;$color3: #000;$size:1px;');
    expect(result).to.deep.equal({ color1: '#FF0000', color2: '#0000FF', color3: '#000000' });
  });
});

describe('should not parse invalid or empty SCSS', () => {
  const samples = [
    '$bad: 123',
    '...',
    '',
  ];
  samples.forEach((scss) => it(`should not parse ${scss}`, () => expect(scssColors(scss)).to.deep.equal({})));
});

describe('should not parse non-color variables', () => {
  const samples = [
    '$unknown: $unknowable;',
    '$sz: $a * $b;',
    '$sz: \'font 1\', Font',
    '$sz: 12em;',
    '$sz: 12em;',
  ];
  samples.forEach((scss) => it(`should not parse ${scss}`, () => expect(scssColors(scss)).to.deep.equal({})));
});
