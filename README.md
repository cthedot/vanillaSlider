# vanillaSlider

A simple Vanilla JS based slider.

Default settings:

    {
      itemSelector: 'div',
      prefix: 'vslider-',

      // if null set height automatically else use height
      // number (=px) or expliocit like "3em"
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


    var slider = vanillaSlider(someDomElement, {
      // optional options
      height: '5em'
    })
    slider.prev()
    slider.next()
