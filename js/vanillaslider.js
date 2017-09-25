/*!
 * vanillaSlider
 */
;
(function () {
  "use strict";

  // Polyfill for e.g. IE
  if (typeof Object.assign != 'function') {
    // Must be writable: true, enumerable: false, configurable: true
    Object.defineProperty(Object, "assign", {
      value: function assign(target, varArgs) { // .length of function is 2
        'use strict';
        if (target == null) { // TypeError if undefined or null
          throw new TypeError('Cannot convert undefined or null to object');
        }

        var to = Object(target);

        for (var index = 1; index < arguments.length; index++) {
          var nextSource = arguments[index];

          if (nextSource != null) { // Skip over if undefined or null
            for (var nextKey in nextSource) {
              // Avoid bugs when hasOwnProperty is shadowed
              if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                to[nextKey] = nextSource[nextKey];
              }
            }
          }
        }
        return to;
      },
      writable: true,
      configurable: true
    });
  }

  function initSwipe($e, handler) {
    var POINTER_EVENTS = window.PointerEvent ? true : false
    var start = {};
    var end = {};
    var tracking = false;
    var thresholdTime = 500;
    var thresholdDistance = 100;

    function startHandler(e) {
      tracking = true;
      /* Hack - e.timeStamp is whack in Fx/Android */
      start.t = new Date().getTime();
      start.x = POINTER_EVENTS ? e.clientX : e.touches[0].clientX;
      start.y = POINTER_EVENTS ? e.clientY : e.touches[0].clientY;
    };

    function moveHandler(e) {
      if (tracking) {
        e.preventDefault();
        end.x = POINTER_EVENTS ? e.clientX : e.touches[0].clientX;
        end.y = POINTER_EVENTS ? e.clientY : e.touches[0].clientY;
      }
    }

    function endEvent(e) {
      if (tracking) {
        tracking = false;
        var now = new Date().getTime();
        var deltaTime = now - start.t;
        var deltaX = end.x - start.x;
        var deltaY = end.y - start.y;
        // if not too slow work out what the movement was
        if (deltaTime < thresholdTime) {
          if ((deltaX > thresholdDistance) && (Math.abs(deltaY) < thresholdDistance)) {
            handler('left')
          }
          else if ((-deltaX > thresholdDistance) && (Math.abs(deltaY) < thresholdDistance)) {
            handler('right')
          }
          else if ((deltaY > thresholdDistance) && (Math.abs(deltaX) < thresholdDistance)) {
            handler('up')
          }
          else if ((-deltaY > thresholdDistance) && (Math.abs(deltaX) < thresholdDistance)) {
            handler('down')
          }
        }
      }
    }
    if (POINTER_EVENTS) {
      $e.addEventListener('pointerdown', startHandler, false);
      $e.addEventListener('pointermove', moveHandler, false);
      $e.addEventListener('pointerup', endEvent, false);
      $e.addEventListener('pointerleave', endEvent, false);
      $e.addEventListener('pointercancel', endEvent, false);
    }
    else if (window.TouchEvent) {
      $e.addEventListener('touchstart', startHandler, false);
      $e.addEventListener('touchmove', moveHandler, false);
      $e.addEventListener('touchend', endEvent, false);
    }
  }


  var VanillaSlider = function ($slider, options) {
    var self = this
    var settings = this._settings = Object.assign({
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
      statusContent: function (index, length) {
        return '•';
      },

      after: function (index, length) {}
    }, options);
    this._$slides = $slider.querySelectorAll(settings.itemSelector)
    this._$status
    this._active = 0
    this._timer = null

    if (typeof settings.height === 'number') {
      settings.height = settings.height + 'px'
    }


    var MAX = this._MAX = this._$slides.length

    // status
    if (settings.status) {
      this._$status = document.createElement('ol')
      this._$status.classList.add(settings.prefix + 'status')

      for (var i = 0, upto = MAX; i < upto; i++) {
        (function (index) {
          var $i = document.createElement('li')

          $i.classList.add(settings.prefix + 'status-item')

          if (i === 0) {
            $i.classList.add(settings.prefix + 'status-item-active')
          }

          $i.textContent = settings.statusContent(i, MAX)
          $i.addEventListener('click', function (e) {
            self.next(index)
          }, false)
          self._$status.appendChild($i)
        }(i));
      }
      $slider.appendChild(self._$status)
    }


    // NAVIGATION

    if (settings.navigation) {
      var $prev = document.createElement('button')
      var $next = document.createElement('button')

      $prev.classList.add(this._settings.prefix + 'prev')
      $next.classList.add(this._settings.prefix + 'next')
      $prev.addEventListener('click', function (e) {
        self.prev()
      }, true)
      $next.addEventListener('click', function (e) {
        self.next()
      }, true)

      $slider.appendChild($prev)
      $slider.appendChild($next)
    }

    if (settings.keyboardnavigation) {
      window.addEventListener('keydown', function (e) {
        var keyCode = e.keyCode

        switch (keyCode) {
          case 39:
          case 40:
            self.next()
            break
          case 37:
          case 38:
            self.prev()
            break
        }
      })
    }

    if (settings.swipenavigation) {
      $slider.style.touchAction = settings.swipedirection === 'h' ?
        'pan-y' : 'pan-x';

      initSwipe($slider, function (direction) {
        if (settings.swipedirection === 'h') {
          if (direction === 'left') {
            self.prev()
          }
          if (direction === 'right') {
            self.next()
          }
        }
        if (settings.swipedirection === 'v') {
          if (direction === 'up') {
            self.prev()
          }
          if (direction === 'down') {
            self.next()
          }
        }
      })
    }

    if (settings.wheelnavigation) {
      $slider.addEventListener('wheel', function (e) {
        requestAnimationFrame(function () {
          var next = e.deltaY > 0

          self[next ? 'next' : 'prev']()
          settings.onSwipeWheel && settings.onSwipeWheel(self._active, MAX, !next)
        })
        e.preventDefault()
      }, false)
    }

    window.addEventListener('resize', function (e) {
      requestAnimationFrame(function () {
        $slider.style.height = 'auto'
        $slider.style.height = settings.height || getComputedStyle($slider).height
      })
    })

    // start
    if (MAX > 1) {
      $slider.style.height = settings.height || getComputedStyle($slider).height

      ;
      [].forEach.call(this._$slides, function ($slide, i) {
        if (i == 0) {
          $slide.classList.add(settings.prefix + 'active')
        }
        $slide.classList.add(settings.prefix + 'item')
      })

      if (settings.autoplay) {
        setTimeout(function () {
          this._timer = setTimeout(
            function () {
              this.next()
            }.bind(this),
            settings.initialTimeout)
        }.bind(this), 100)
      }
    }
  }

  VanillaSlider.prototype._updateStatus = function () {
    if (this._settings.status) {
      var activeClass = this._settings.prefix + 'status-item-active'

      this._$status.querySelector('.' + activeClass)
        .classList.remove(activeClass)
      this._$status.querySelector('li:nth-child(' + (this._active + 1) + ')')
        .classList.add(activeClass)
    }
  }

  VanillaSlider.prototype._getActive = function (back, index) {
    clearTimeout(this._timer)

    this._$slides[this._active].classList.remove(
      this._settings.prefix + 'active'
    )

    if (index !== undefined) {
      this._active = index >= 0 && index < this._MAX ?
        index : this._MAX - 1
    }
    else {
      if (!back) {
        this._active = (this._active === this._$slides.length - 1) ? 0 : this._active + 1
      }
      else {
        this._active = (this._active === 0) ? this._$slides.length - 1 : this._active - 1
      }
    }
    return this._$slides[this._active]
  }

  VanillaSlider.prototype.prev = function (index) {
    var prefix = this._settings.prefix

    if (index !== undefined && index === this._active) {
      return true
    }
    else if (index === undefined && !this._settings.rotation && this._active === 0) {
      return true
    }

    this._$slides[this._active].classList.add(prefix + 'before')

    var $active = this._getActive(true, index)

    $active.classList.add(prefix + 'direct')
    $active.classList.remove(prefix + 'before')
    $active.classList.remove(prefix + 'active')
    getComputedStyle($active).opacity // DO IT!
    $active.classList.remove(prefix + 'direct')
    $active.classList.add(prefix + 'active')

    this._updateStatus()
    this._settings.after(this._active, this._MAX)
    if (this._settings.autoplay) {
      this._timer = setTimeout(function () {
          this.next()
        }.bind(this),
        this._settings.timeout)
    }
  }

  VanillaSlider.prototype.next = function (index) {
    var prefix = this._settings.prefix

    if (index !== undefined && index === this._active) {
      return true
    }
    else if (index === undefined && !this._settings.rotation && this._active === this._$slides.length - 1) {
      return true
    }

    var $active = this._getActive(false, index)

    $active.classList.add(prefix + 'direct')
    $active.classList.add(prefix + 'active')
    $active.classList.add(prefix + 'before')
    getComputedStyle($active).opacity // DO IT!
    $active.classList.remove(prefix + 'direct')
    $active.classList.remove(prefix + 'before')

    this._updateStatus()
    this._settings.after(this._active, this._MAX)
    if (this._settings.autoplay) {
      this._timer = setTimeout(function () {
          this.next()
        }.bind(this),
        this._settings.timeout)
    }
  }


  function vanillaSlider($sliders, options) {
    var sliders = [];

    if ($sliders instanceof Node) {
      $sliders = [$sliders]
    }

    [].forEach.call($sliders, function ($slider, i) {
      sliders.push(
        new VanillaSlider($slider, options || {})
      )
    })
    return sliders.length > 1 ? sliders : sliders[0]
  }
  vanillaSlider.VERSION = 1.4

  window.vanillaSlider = vanillaSlider
}());