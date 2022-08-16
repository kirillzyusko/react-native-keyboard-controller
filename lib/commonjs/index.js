"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

require("./monkey-patch");

var _native = require("./native");

Object.keys(_native).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _native[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _native[key];
    }
  });
});

var _animated = require("./animated");

Object.keys(_animated).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _animated[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _animated[key];
    }
  });
});

var _replicas = require("./replicas");

Object.keys(_replicas).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _replicas[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _replicas[key];
    }
  });
});
//# sourceMappingURL=index.js.map