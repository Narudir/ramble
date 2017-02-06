const escodegen = require('escodegen');
const lave = require('lave');

function generate(ast) {
  return escodegen.generate(ast, {
    format: {
      semicolons: false,
      quotes: 'auto'
    }
  });
}

module.exports = function (obj) {
  return lave(obj, { generate });
};
