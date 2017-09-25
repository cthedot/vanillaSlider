# vanillaSlider

A simple Vanilla JS based slider.

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

- Firefox (tested in 55)
- Chrome (tested in 61)
- Edge (tested in 15)
- Safari (tested in 10)
- IE 11

## Thanks
PointerEvents Swipe implementation from https://patrickhlauke.github.io/touch/swipe/pointerevents.html

## TODO
- aria and use aria for styling?
  https://stackoverflow.com/questions/16840054/wai-aria-roles-for-carousels-a-k-a-sliders-slideshows-galleries
    tablist? https://www.marcozehe.de/2013/02/02/advanced-aria-tip-1-tabs-in-web-apps/
    http://heydonworks.com/practical_aria_examples/#tab-interface
    http://accessibility.athena-ict.com/aria/examples/carousel.shtml

