;
(function ($) {
  "use strict";

  function init() {

    var $v1 = document.getElementById('vslider-1')

    var v1 = vanillaSlider($v1, {
      height: '5em',
      // rotate: false,
      status: true,
      navigation: true,
      keyboardnavigation: true
      // wheelnavigation: true,
      // onSwipeWheel: function () {
      //   console.log(arguments)
      // }
    })

  }

  document.addEventListener('DOMContentLoaded', init, false);

}());