# vanillaSlider

A simple Vanilla JS based slider.

Demo: http://cthedot.de/vanilla-slider/

Default settings:

    {
      itemSelector: 'div',
      prefix: 'vslider-',

      // if null set height automatically else use height
      // number (=px) or explicit like "3em"
      height: null,

      rotation: true,
      autoplay: options.rotation === false ? false : true,
      initialTimeout: 4000,
      timeout: 8000,

      navigation: true,
      keyboardnavigation: true,
      // needs Hammer
      swipenavigation: true,
      swipedirection: 'h', // h or v
      wheelnavigation: false,
      onSwipeWheel: null,

      status: true,
      statusContent: function (c, length) {
        return '•';
      },

      after: function (c, length) {}
    }

Example:

    <div class="vslider">
      <div>1</div>
      <div>2</div>
      <div>3</div>
    </div>

    // single slider
    var slider = vanillaSlider(someDomElement)
    slider.prev()
    slider.next()
    slider.next(index) // optionally which to show next

    // multiple sliders
    var sliders = vanillaSlider(someDomElements, {
      // optional options
      height: '5em'
    })
    sliders[0].next(3)


Files needed:

    /css/vanillaslider.css
    /js/vanillaslider.js
    // optionally Hammer JS