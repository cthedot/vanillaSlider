# vanillaSlider

A simple accessible Vanilla JS based slider/carousel.

Demo: http://cthedot.de/vanilla-slider/

## Default settings

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
      swipenavigation: true,
      swipedirection: 'h', // h or v
      wheelnavigation: false,
      onSwipeWheel: null,

      status: true,
      statusContent: function (index, length) {
        return '•';
      },

      i18n: {
        title: 'Carousel',
        navigation: 'Carousel navigation',
        next: 'next',
        prev: 'previous'
      },

      after: function (index, length) {}
    }

## Example

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


## Files needed

    /css/vanillaslider.css
    /js/vanillaslider.js
    // optionally Hammer JS

## Cross Browser
Tested in the following browsers but should work in most modern ones

- Firefox (tested in 58)
- Chrome (tested in 64)
- Edge (tested in 16)
- Safari (tested in 10)
- IE 11

## Thanks
PointerEvents Swipe implementation adapted from https://patrickhlauke.github.io/touch/swipe/pointerevents.html
