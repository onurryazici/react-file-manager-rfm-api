var path = require('path');

module.exports = (function () {
  return path.dirname(require.main.filename.slice(0,-4) || process.mainModule.filename.slice(0,-4));
})();