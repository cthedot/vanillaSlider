;
(function ($) {
  "use strict";

  function init() {

    vanillaSlider(
      document.getElementById('vslider-default')
    )

    vanillaSlider(
      document.getElementById('vslider-base'), {
        initialTimeout: 1500,
        timeout: 3000,
        navigation: false,
        keyboardnavigation: false,
        swipenavigation: false,
        status: false
      }
    )

    vanillaSlider(
      document.getElementById('vslider-noautoplay'), {
        autoplay: false
      }
    )

    vanillaSlider(
      document.getElementById('vslider-norotation'), {
        rotation: false,
        initialTimeout: 1000,
        timeout: 2000
      }
    )

    vanillaSlider(
      document.getElementById('vslider-norotation-autoplay'), {
        rotation: false,
        autoplay: true,
        initialTimeout: 1000,
        timeout: 2000
      }
    )

    vanillaSlider(
      document.getElementById('vslider-custom'), {
        height: '5em',
        statusContent: function (i, all) {
          return i + 1
        },
      }
    )

    // Should wait for images to load and set explicit height!
    vanillaSlider(
      document.getElementById('vslider-background'), {
        itemSelector: 'span',
        height: 300
      }
    )

    vanillaSlider(
      document.getElementById('vslider-images'), {
        height: 300
      }
    )


  }

  document.addEventListener('DOMContentLoaded', init, false);

}());