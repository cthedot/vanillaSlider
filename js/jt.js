  jQuery.fn.transformer = function (options) {

    var prefix = settings.prefix

    return this.each(function (i) {
      var transformer = $(this)
      var images = transformer.find(settings.itemSelector)
      var lenimages = images.length
      var prevButton
      var nextButton
      var status
      var statusActiveClass = prefix + 'status-current'
      var timer = null
      var transitions = Modernizr && Modernizr.csstransitions

      var items = []
      var c = 0

      var updateStatus = function () {
        status.children('.' + statusActiveClass).removeClass(statusActiveClass)
        status.children('li').eq(c).addClass(statusActiveClass)
      }

      var outCurrent = function (back, index) {
        var out = $(items[c])

        if (index !== undefined) {
          back = index < c ? true : false
          c = index
        }
        else {
          if (!back) {
            c = (c == items.length - 1) ? 0 : c + 1
          }
          else {
            c = (c == 0) ? items.length - 1 : c - 1
          }
        }
        return {
          out: out,
          current: $(items[c]),
          back: back
        }
      }
      var next = function (back, index) {
        // returns true if no rotate and no next slide shown
        if (index == c) {
          return true
        }

        if (!settings.rotate && (index === undefined)) {
          // check if do next step or not
          if ((!back && (c == items.length - 1)) || (back && (c == 0))) {
            return true
          }
        }

        // new browsers, anim via CSS
        var jump = (index !== undefined) && (Math.abs((c - index)) <= 1)
        var oc = outCurrent(back, index)
        var cur = oc.current
        var out = oc.out

        back = oc.back

        if (transitions && !back) {
          out.addClass(prefix + 'out')

          if (jump) {
            out.prevAll().addClass(prefix + 'out')
          }

          // initial
          out.removeClass(prefix + 'current')

          cur.addClass(prefix + 'direct')
          cur.removeClass(prefix + 'out')
          cur.removeClass(prefix + 'current')
          getComputedStyle(cur[0]).opacity // DO IT!
          // pos
          cur.removeClass(prefix + 'direct')
          cur.addClass(prefix + 'current')

          settings.status && updateStatus()

          settings.after(c, lenimages)
        }
        else if (transitions && back) {
          out.removeClass(prefix + 'current')

          // initial
          cur.addClass(prefix + 'direct')
          cur.addClass(prefix + 'current')
          cur.addClass(prefix + 'out')
          getComputedStyle(cur[0]).opacity // DO IT!
          // final
          cur.removeClass(prefix + 'direct')
          cur.removeClass(prefix + 'out')

          settings.status && updateStatus()

          settings.after(c, lenimages)
        }
        if (settings.autoplay) {
          timer = setTimeout(next, settings.timeout)
        }
      }

      // start if at least 2 items
      if (lenimages > 1) {
        images.each(function (i) {
          var image = $(this)
          var item = settings.imageAdd(image)

          item.addClass(prefix + 'item')
          items.push(item)
        })

        if (transitions) {
          $(items[0]).addClass(prefix + 'current')
        }
        else {
          // IE
          $(items).each(function (i) {
            $(this).css({
              opacity: i == 0 ? 1.0 : 0.01
            })
          })
        }


        // NAV
        if (settings.navigation) {
          prevButton = $('<span class="' + prefix + 'prev"></span>').appendTo(transformer)
          nextButton = $('<span class="' + prefix + 'next"></span>').appendTo(transformer)
          prevButton.on('click', function () {
            clearTimeout(timer)
            next(true)
          })
          nextButton.on('click', function () {
            clearTimeout(timer)
            next(false)
          })
        }


        // STATUS
        if (settings.status) {
          status = $('<ol class="' + prefix + 'status"></ol>')

          for (var i = 0, upto = lenimages; i < upto; i++) {
            (function (index) {
              status.append($('<li></li>', {
                text: settings.statusContent(i, lenimages),
                click: function () {
                  clearTimeout(timer)
                  next(null, index)
                }
              }))
            }(i));
          }

          // ?
          if (!settings.rotate) {
            status.append($('<li></li>', {
              text: settings.statusContent(i, lenimages),
            }))
          }
          // /?

          status.appendTo(transformer)
        }


        var stop = false

        // TOUCH
        if (Hammer && (settings.swipenavigation || settings.navigation)) {
          var swipenext = 'swiperight'
          var swipeprev = 'swipeleft'

          if (settings.swipedirection == 'v') {
            swipenext = 'swipeup'
            swipeprev = 'swipedown'
          }

          var swipehammer = Hammer(transformer[0], {
            drag: false,
            tap: false
          })

          swipehammer.on(swipenext, function (e) {
            var nomove = false

            clearTimeout(timer)
            if (!stop) {
              nomove = next(false)
            }
            stop = settings.swipewheelcallback(false, c, lenimages, nomove)
          })
          swipehammer.on(swipeprev, function (e) {
            var nomove = false

            clearTimeout(timer)
            if (!stop) {
              nomove = next(true)
            }
            stop = settings.swipewheelcallback(true, c, lenimages, nomove)
          })
        }

        // WHEEL
        if (settings.wheelnavigation && $.debounce) {
          var wheelcall = $.debounce(200, true, function (e) {
            var nomove = false
            var back = e.deltaY > 0

            clearTimeout(timer)
            if (!stop) {
              nomove = next(back)
            }
            stop = settings.swipewheelcallback(back, c, lenimages, nomove)
          })

          transformer.on('mousewheel', function (e) {
            wheelcall(e)
            e.preventDefault()
          })
        }

        // KEYBOARD
        if (settings.keyboardnavigation) {
          $(window).on('keydown', function (e) {
            var keyCode = e.keyCode
            var nomove = false

            switch (keyCode) {
              case 39:
              case 40:
                if (!stop) {
                  clearTimeout(timer)
                  nomove = next()
                }
                stop = settings.swipewheelcallback(false, c, lenimages, nomove)
                break
              case 37:
              case 38:
                if (!stop) {
                  clearTimeout(timer)
                  nomove = next(true)
                }
                stop = settings.swipewheelcallback(true, c, lenimages, nomove)
                break
            }
          })
        }

        // resize
        $(window).on('resize', function () {
          transformer.height('auto')
          transformer.height(settings.height || transformer.height())
        })

        // start
        transformer
          .height(settings.height || transformer.height())
          .addClass(prefix + 'loaded')

        settings.status && updateStatus()

        if (settings.addNextActionToElement) {
          // add to DOM element
          transformer[0].next = function (index) {
            console.log(index, next)
            clearTimeout(timer)
            next(null, index)
          }
        }

        if (settings.autoplay) {
          setTimeout(function () {
            $(items).show()
            timer = setTimeout(next, settings.initialTimeout)
          }, 100)
        }
      }

    })

  };

  $.fn.transformer.VERSION = '4.6'
})(jQuery);