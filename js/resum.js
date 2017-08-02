define(['jquery'],function(){
    (function($){
    "use strict";
    let checkAtrr = (function(ele){
        let Arr = ["webkit","o","moz","ms"];
        let fixprops = "";
        for(let i in Arr){
            fixprops = Arr[i] + "Transition";
          if(ele.style[fixprops] !== undefined) {
            return "-"+Arr[i].toLowerCase()+"-";
          } 
          return false;
        }
    })(document.createElement(PagePlugin));

    var PagePlugin = (function(){

        function runPage(ele,ops){
            this.setting = $.extend(true , $.fn.PageSwitch.default , ops||{});
            this.elements = ele;
            this.init();

        }

        runPage.prototype = {
            init :function() {
                let me = this;
                me.seletName = me.setting.seletName;
                me.selection = me.elements.find(me.seletName.selection);
                me.section = me.selection.find(me.seletName.section);
                me.pageCount = me.pageCount();
                me.canscroll = true;
                me.index = (me.setting.index >= 0 && me.setting.index <= me.pageCount)? me.setting.index : 0;
                me.direction = (me.setting.direction === "vertical")?true : false;

                
                if(me.direction){
                    me._initPage();
                };

                if(!me.direction){
                    me._layoutPage();
                };
                me.page
                me.initEvent();
            },

            pageCount : function(){
                return this.section.length;
            },

            _initPage : function(){
                let me = this;
                me.classPage = me.setting.seletName.page.substring(1);
                me.classActive = me.setting.seletName.active.substring(1);
                let htmlEle = "<ul>";

                for (let i = 0 ; i < me.pageCount ; i++) {
                    htmlEle+= "<li></li>";
                }
                me.elements.append(htmlEle);
                me.pageUl = $('div.contanier>ul').addClass(me.classPage);
                me.pageIteam = me.pageUl.find('li').eq(me.index).addClass(me.classActive);

                if(me.direction&&me.setting.pageination){
                    me.pageUl.addClass("vertical");
                }else if(!me.direction){
                    me.pageUl.addClass("horizental");
                }

            },

            _layoutPage : function(){

            },

            elementsHeight : function(){
                return this.direction ? this.elements.height() : this.elements.width();
            },

            initEvent : function(){
                let me = this;
                //鼠标滚轮
                me.elements.on("mousewheel DDOMMouseScroll",function(e){
                    e.preventDefault();
                    let wheelDir = e.originalEvent.wheelDelta || -e.originalEvent.detail;
                    console.log(me.canscroll);
                    if(me.canscroll){
                        if(wheelDir < 0 && (me.index < (me.pageCount-1) && !me.setting.loop || me.setting.loop)){
                            //(me.index < (me.pageCount-1) && !me.setting.loop )||me.setting.loop
                            me.next();
                        }else if (wheelDir > 0 && (me.index && !me.setting.loop || me.setting.loop)){
                            me.pre();
                        }
                    }
                });

                //点击事件
                me.elements.on("click",function(e){
                    try{
                        if (e.target && e.target.nodeName == "LI") {
                            me.index = $(e.target).index();
                            me.scrollPage();
                        } else if(e.target && e.target.id == "nextpage") {
                            me.next();
                        } 
                    }catch(err){
                        console.log(err);
                    }     
                });

                //键盘事件
                if(me.setting.keybord){
                    $(window).keydown(function(e){
                        let keycode = e.keyCode;
                        if(keycode == 37 || keycode == 38){
                            me.pre();
                        }else if(keycode == 39 || keycode == 40){
                            me.next();
                        }
                    })
                }
                //动画结束后将canscroll初始化为true
                if(checkAtrr){
                    me.selection.on("transitionend webkitTransitionEnd oTransitionEnd otransitionend",function(){
                        me.canscroll = true;
                        if(me.setting.callback && $.type(me.setting.callback === "function")){
                            me.setting.callback();
                        }
                    })
                }
                //窗口改变事件
                let resieWindow;
                $(window).resize(function(){
                    console.log(0)
                    clearTimeout(resieWindow);
                    resieWindow = setTimeout(function(){
                        let currL = me.elementsHeight();
                        let offL = me.direction ? me.section.eq(me.index).offset().top : mme.section.eq(me.index).offset().left ;
                        if(Math.abs(offL) > currL/2 && me.index < me.pageCount-1){
                            me.index ++;
                            me.scrollPage();
                        }
                    },500);
                });
            },

            next : function(){
                var me = this;
                if(me.index < me.pageCount){
                    me.index ++;
                }else if(me.setting.loop){
                    me.index = 0;
                }
                me.scrollPage();
            },

            pre : function(){
                var me = this;
                if(me.index > 0 ){
                    me.index--;
                }else if(me.setting.loop){
                    me.index = me.pageCount - 1;
                }   
                me.scrollPage();
            },

            scrollPage : function(){
                
                const me = this;
                let dest = me.section.eq(me.index).position();
                if(!dest) return;
                
                me.canscroll = false;
                if (checkAtrr) {
                
                    let cssTrans = me.direction ? "translateY(-" + dest.top + "px)" : "translateX(-" + dest.left + "px)";
                    me.selection.css(checkAtrr + "transition", "all " + me.setting.duration + "ms " + me.setting.eas);

                    //jquery css方法需要进一步学习
                    //css3 transition需要进一步学习
                    me.selection.css(checkAtrr + "transform", cssTrans);
                } else {
                    let animate = me.direction ? {
                        top: -dest.top()
                    } : {
                        left: dest.left()
                    };
                    me.selection.animate(animate, me.setting.duration, me.setting.eas, function() {
                        return me.canscroll = true;
                    });
                }
                if (me.setting.pageination) {
                    me.pageUl.find('li').eq(me.index).addClass(me.classActive).siblings("li").removeClass(me.classActive);
                }
            }
        }

        return runPage
    })();


    $.fn.PageSwitch = function(options){
        return this.each(function (){
            // body...
            const thisObj = $(this);
            let plugin = thisObj.data("PageSwitch");
            if (!plugin) {
                 thisObj.data("PageSwitch",(plugin = new PagePlugin(thisObj,options)));
            }
            if($.type(options) === "string"){
                  return plugin[options]();         
            }

        })
    };

    $.fn.PageSwitch.default = {
        seletName:{
            selection : ".selection",
            section : ".section",
            page : ".pages",
            active : ".active",
            arrow : ".arrow",
        },
        index : 0,
        duration : 500,
        keybord : true,
        pageination : true,
        direction : "vertical",
        eas : "ease-in-out",
        loop : false,
        callback : ""
    }
})(jQuery);
})

