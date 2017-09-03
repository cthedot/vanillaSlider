/*!
 * vanillaSlider
 */
;
(function ($) {
  "use strict";

  var VanillaSlider = function ($slider, options) {
    var self = this
    var settings = this._settings = Object.assign({
      itemSelector: 'div',
      prefix: 'vslider-',
      height: null, // if null set height automatically else use height
      autoplay: true,
      timeout: 3000,
      initialTimeout: 1000,
      rotate: true,
      navigation: false,
      keyboardnavigation: false,
      swipenavigation: false,
      swipedirection: 'h', // h or v
      wheelnavigation: false,
      onSwipeWheel: null,
      status: false,
      statusContent: function (c, length) {
        return '•';
      },
      after: function (c, length) {}
    }, options);
    this._$slides = $slider.querySelectorAll(settings.itemSelector)
    this._$prevButton
    this._nextButton
    this._$status
    this._active = 0
    this._timer = null


    var MAX = this._MAX = this._$slides.length

    // status
    if (settings.status) {
      this._$status = document.createElement('ol')
      this._$status.classList.add(settings.prefix + 'status')

      for (var i = 0, upto = MAX; i < upto; i++) {
        (function (index) {
          var $i = document.createElement('li')

          if (i === 0) {
            $i.classList.add(settings.prefix + 'status-active')
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

    if (window.Hammer && (settings.swipenavigation || settings.navigation)) {
      var _swipehammer = Hammer($slider, {
        drag: false,
        tap: false
      })
      _swipehammer.on(
        settings.swipedirection === 'h' ? 'swipeleft' : 'swipedown',
        function (e) {
          self.prev()
          settings.onSwipeWheel && settings.onSwipeWheel(self._active, MAX, true)
        })
      _swipehammer.on(settings.swipedirection === 'h' ? 'swiperight' : 'swipeup',
        function (e) {
          self.next()
          settings.onSwipeWheel && settings.onSwipeWheel(self._active, MAX, false)
        })
    }

    if (settings.wheelnavigation) {
      $slider.addEventListener('wheel', function (e) {
        clearTimeout(self._timer)

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
      [].forEach.call(this._$slides, function ($slide, i) {
        if (i == 0) {
          $slide.classList.add(settings.prefix + 'active')
        }
        $slide.classList.add(settings.prefix + 'item')
      })

      $slider.style.height = settings.height || getComputedStyle($slider).height
      $slider.classList.add(settings.prefix + 'loaded')

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
      var activeClass = this._settings.prefix + 'status-active'

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
      this._active = index
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
    else if (!this._settings.rotate && this._active === 0) {
      return true
    }

    this._$slides[this._active].classList.add(prefix + 'before')

    var $active = this._getActive(true, index)

    $active.classList.add(prefix + 'direct')
    $active.classList.remove(prefix + 'before', prefix + 'active')
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
    else if (!this._settings.rotate && this._active === this._$slides.length - 1) {
      return true
    }

    var $active = this._getActive(false, index)

    $active.classList.add(prefix + 'direct', prefix + 'active', prefix + 'before')
    getComputedStyle($active).opacity // DO IT!
    $active.classList.remove(prefix + 'direct', prefix + 'before')

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
        new VanillaSlider($slider, options)
      )
    })
    return sliders.length > 1 ? sliders : sliders[0]
  }
  vanillaSlider.VERSION = 1.0

  window.vanillaSlider = vanillaSlider

}());