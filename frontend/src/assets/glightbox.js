(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.GLightbox = factory());
}(this, (function () { 'use strict';

  // ... (full JS code as provided by user) ...

  function glightbox () {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var instance = new GlightboxInit(options);
    instance.init();
    return instance;
  }

  return glightbox;

}))); 