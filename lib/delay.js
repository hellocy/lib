;(function($) {

  $.fn.delay = function(selector, options) {
    var defaults = {
      delay: 200
    };

    if (arguments.length === 1 && (typeof(options) === 'undefined' || selector === null)) {
      options = selector;
      selector = null;
    }
    var opts = $.extend(defaults, options);

    var delay = function(obj, func) {
      return function(event) {
        var $obj = $(obj);
        var delay = $obj.data('delay-timer');
        if (typeof(delay) !== 'undefined' && delay !== null) {
          var now = (new Date()).getTime();
          if (now - delay.time < opts.delay) {
            clearTimeout(delay.timer);
          }
        }
        var _this = this;
        var timer = setTimeout(function(){
          func.call(_this, event);
          $obj.removeData('delay-timer');
        }, opts.delay);
        $obj.data('delay-timer', {timer: timer, time: (new Date()).getTime()});
      };
    };

    this.each(function(){
      var $this = $(this);
      $this.on("input", delay($this, opts["callback"]));
    });

  };

})(jQuery);