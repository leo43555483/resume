define(['jquery'],function(){
    (function($) {

        let PlugTab = function(obj) {
            this.wrap = obj[0];
               
            let timer = null;
            this.init();
        }

        PlugTab.prototype = {

            init: function() {
                let me =this.wrap,
                divList = me.getElementsByTagName('div');
                me.addEventListener("mouseover", function(e){
                    e.stopPropagation();
                    if (this.timer) {
                    clearTimeout(this.timer);
                }
                this.timer = setTimeout(function() {
                    let target = e.target;
                    if (target.nodeName === "LI") {
                        let ct = $(target).index();
                        $(target).addClass('tabaction').siblings().removeClass();
                        $('[data-tab]>div').eq(ct).fadeIn(50).siblings('div').fadeOut(50);
                         

                    }
                }, 500)
                });
            },

            getIndex: function(list,x) {
                if (list.length && list.length > 0) {
                    for (let i = 0; i < list.length; i++) {
                        if (list[i] === x) return i;
                    }
                } else {
                    return null
                }
            }
        }

        window.tab = PlugTab;

        $.fn.extend({
            tab: function() {
                this.each(function() {

                    new PlugTab($(this));
                });
                return this
            }
        });

        
    })(jQuery);

})


