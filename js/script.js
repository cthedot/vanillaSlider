;
(function ($) {
  "use strict";

  function init() {

    var $v1 = document.getElementById('vslider-1')

    var v1 = vanillaSlider($v1, {
      height: '5em',
      // rotate: false,
      status: true,
      keyboardnavigation: true
    })

  }

  document.addEventListener('DOMContentLoaded', init, false);

}());