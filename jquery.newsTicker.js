/**
 * Created by me for me ;)
 * (c) Tomas Vahalik <tomas@vahalik.cz>
 * Date: 10/11/11
 * Time: 4:04 AM
 */

(function( $ ){
    $.fn.newsTicker = function(options) {
        var defaults = {
            controls: "#controls", // identificator of controls div
            label: "feature",
            speedOut: "500",
            speedIn: "500",
            pause: 5000,
            showControls: true,
            //animation: '', //mabe in future
            mousePause: true,
            isPaused: false,
            actualId: 0,
            maxId: 0
        };

        var settings = $.extend(defaults, options);

        createLink = function(input, num, options){
            var actualHtml = input.html();
            var newHtml;
            if(num == 0){
                newHtml = actualHtml + "<a rel='" + options.label + num + "' class='active'></a>";
            }
            else{
                newHtml = actualHtml + "<a rel='" + options.label + num + "'></a>";
            }
            input.html(newHtml);
        }

        changeToSpecificId = function(obj,id,options)
        {
            var e = obj.target || obj;
            $(e).find('li').fadeOut(options.speedOut);
            $(e).find('.'+options.label + id).fadeIn(options.speedIn);
            if(options.showControls){
                $(options.controls +" a").removeClass("active",options.speedOut);
                $(options.controls +' a'+"[rel=" + options.label + id+"]").addClass("active",options.speedIn);
            }
        }

        return this.each(function() {
            var obj = $(this);
            var options;
            if(!jQuery.data(obj,"settings")){
                jQuery.data(obj,"settings",settings);
                options = jQuery.data(obj,"settings");
            }else{
                options = jQuery.data(obj,"settings");
            }

            if(options.pause < 2500)
                options.pause = 2500;

            if(options.showControls){
                obj.find('li').each(function() {
                    $(this).addClass(options.label + options.maxId);
                    createLink($(options.controls), options.maxId++, options);
                });

                $(options.controls + " a").click(function(){
                    var selected = $(this).attr('rel');
                    var toId = selected.substring(options.label.length);
                    if(options.actualId != toId)
                    {// we dont want to change it to same num
                        changeToSpecificId(obj,toId,options);
                        options.actualId = toId;
                        options.isPaused = true;
                        setTimeout(function(){options.isPaused = false;},options.pause);
                    }
                });
            }else{
                obj.find('li').each(function() {
                    $(this).addClass(options.label + options.maxId++);
                });
            }

            if(options.mousePause)
            {
                obj.bind("mouseenter",function(){
                    options.isPaused = true;
                }).bind("mouseleave",function(){
                        options.isPaused = false;
                    });
            }

            var changeInterval = setInterval(function(){
                if(options.isPaused)
                    return;

                if(++options.actualId >= options.maxId)
                    options.actualId = 0;
                changeToSpecificId(obj,options.actualId,options);

            },options.pause);

        });
    };
})(jQuery);