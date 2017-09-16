/**
 * 自定义拖拽和改变尺寸
 */
(function(){
    $.fn.dragResize = function(opts){
        var defaults = {
            dragZone: 15,
            dragInParent: false
        };
        var options = $.extend(defaults, opts);

        return this.each(function(){
            var $this = $(this);
            var $parent = $(options.parent).length || $(this).parent();
            var isResize = false;

            $this.css("position", "absolute");

            $this.mousedown(function(e){
                this.onmousemove = null;

                var ix = e.clientX,
                    iy = e.clientY;
                var ox = Number($this.css('left').replace('px', '')),
                    oy = Number($this.css('top').replace('px', ''));

                var pr = $parent.width(); //容器宽度
                var pb = $parent.height(); //容器高度

                var ow = $this.width(),
                    oh = $this.height();

                options.start && options.start($this, ox, oy);

                document.onmousemove = function(e){
                    e.preventDefault();

                    var tx = e.clientX,
                        ty = e.clientY;
                    var dx = tx - ix,
                        dy = ty - iy;
                    var ex = ox + dx;
                    var ey = oy + dy;
                    if(isResize){
                        $this.width(ow + dx).height(oh + dy);
                        options.resize && options.resize($this, ow + dx, oh + dy);
                    }else{
                        var x = options.dragInParent ? Math.max(0, Math.min(ex, pr - $this.width())) : ex;
                        var y = options.dragInParent ? Math.max(0, Math.min(ey, pb - $this.height())) : ey;

                        $this.css({
                            left: x + 'px',
                            top: y + 'px'
                        })
                        options.move && options.move($this, x, y);
                    }
                }
                document.onmouseup = function(){
                    document.onmousemove = null;
                    $this[0].onmousemove = function(e){
                        resizeFn(e);
                    }
                }
            });
            this.onmousemove = function(e){
                resizeFn(e);
            };

            function resizeFn(e){
                var x = e.clientX,
                    y = e.clientY;

                var r = $this.offset().left + $this.width();
                var b = $this.offset().top + $this.height();
                var dx = r - x,
                    dy = b - y;
                if(dx >= -10 && dx < options.dragZone && dy >= -10 && dy <= options.dragZone){
                    $this.css("cursor", 'se-resize');
                    isResize = true;
                }else{
                    $this.css("cursor", 'move');
                    isResize = false;
                }
            }
        });
    };
})(jQuery);