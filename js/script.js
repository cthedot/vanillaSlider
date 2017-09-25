;
(function () {
  "use strict";

  // example script


  function init() {

    // multiple
    window.defaultSliders = vanillaSlider(
      document.querySelectorAll('.vslider-default')
    )
    console.log('window.defaultSliders:', window.defaultSliders)

    var $input = document.getElementById('custom-input')
    var baseSlider = vanillaSlider(
      document.getElementById('vslider-base'), {
        autoplay: false,
        navigation: false,
        keyboardnavigation: false,
        swipenavigation: false,
        wheelnavigation: true,
        status: false,
        after: function (index, length) {
          $input.value = index
        }
      }
    )
    window.baseSlider = baseSlider

    // custom controls
    $input.addEventListener('change', function (e) {
      baseSlider.next(
        parseInt(e.target.value)
      )
    }, false)
    document.getElementById('custom-prev').addEventListener('click', function (e) {
      baseSlider.prev()
    }, false)
    document.getElementById('custom-next').addEventListener('click', function (e) {
      baseSlider.next()
    }, false)

    vanillaSlider(
      document.getElementById('vslider-noautoplay'), {
        autoplay: false,
        i18n: {
          title: 'Custom Carousel',
          navigation: 'Custom Carousel navigation',
          next: 'next Custom',
          prev: 'previous Custom'
        }
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

    vanillaSlider(
      document.getElementById('vslider-images'), {
        height: 300
      }
    )


    // Should wait for images to load and set explicit height!
    vanillaSlider(
      document.getElementById('vslider-background'), {
        itemSelector: 'span',
        height: '50vh',
        swipedirection: 'v'
      }
    )

  }

  document.addEventListener('DOMContentLoaded', init, false);

}());