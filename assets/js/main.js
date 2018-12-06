/*====================================================
  TABLE OF CONTENT
  1. function declearetion
  2. Initialization
====================================================*/
(function($) {
    /*===========================
    1. function declearetion
    ===========================*/
	var themeApp = {

        featuredSlider: function() {
            $('.featured-slider').slick({
                autoplay: true,
                fade: true,
                cssEase: 'linear',
                appendArrows : $('.arrow-wrap'),
                prevArrow: '<i class="fa fa-angle-left"></i>',
                nextArrow: '<i class="fa fa-angle-right"></i>',
                 dots: true,
                customPaging : function(slider, i) {
                    var thumb = $(slider.$slides[i]).data('number');
                    return thumb;
                }
            });
        },
        postWrapper: function() {
            var tile = $('.post-tile');
            var max_height = 0;
            if(tile.length > 0) {
                $.each(tile, function(){
                    var h = $(this).height();
                    max_height = h > max_height ? h : max_height;
                });
                tile.height(max_height);
            }
        },
        setNavbar: function() {
            if(typeof fixed_navbar != "undefined" && fixed_navbar == true) {
                $('body').addClass('has-fixed-navbar');
                $('#main-navbar').addClass('fixed');
            }
        },
		featuredMedia: function(){
            $(".post-single").each(function() {
                var thiseliment = $(this);
                var image = $(this).find('.featured-image.single');
                var container = $(this).find('.small-container');
                var firstPara = $(this).find('.post-content p').first();
                var media_wrapper = $(this).find('featured');
                var media_content_embeded = media_wrapper.find('iframe');
                if (media_content_embeded.length > 0) {
                    $(image).remove();
                    $(container).before(media_content_embeded);
                    $(media_content_embeded).wrap("<div class='featured-media align-center media-embeded'></div>");
                    thiseliment.addClass('embeded-media');
                    media_wrapper.remove();
                    var newString = firstPara.html().replace(/(\s*<br\s*\/?>\s*\n\s*)/g,'');
                    firstPara.html(newString);
                }
            });
        },
        responsiveIframe: function() {
    		$('.post').fitVids();
    	},
        highlighter: function() {
            $('pre code').each(function(i, block) {
                hljs.highlightBlock(block);
            });
        },
        mobileMenu:function() {
            $('#mobile-menu').html($('#main-menu').html());
            $('#nav-toggle-button').on('click', function(e){
                e.preventDefault();
                $('body').toggleClass('mobile-menu-opened');
            });
            $('#backdrop').on('click', function(){
                $('body').toggleClass('mobile-menu-opened');
            });
            var li = $(".mobile-menu").find('li');
            $(li).has('ul').addClass('menu-item-has-children').prepend('<span class="submenu-toggle-button"><i class="fa fa-angle-down"></i></span>');
            $('.menu-item-has-children').find('.submenu-toggle-button').on('click', function(){
                $(this).toggleClass('opened');
                $(this).siblings('ul').slideToggle();
            });
        },
		mailchimp: function() {
            function IsEmail(email) {
                var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
                return regex.test(email);
            }
            var form = $('#mc-embedded-subscribe-form');
            form.attr("action", mailchimp_form_url);
            var message = $('#message');
            var submit_button = $('mc-embedded-subscribe');
            form.submit(function(e){
                e.preventDefault();
                $('#mc-embedded-subscribe').attr('disabled','disabled');
                if($('#mce-EMAIL').val() != '' && IsEmail($('#mce-EMAIL').val())) {
                    message.html('please wait...').fadeIn(1000);
                    var url=form.attr('action');
                    if(url=='' || url=='YOUR_MAILCHIMP_WEB_FORM_URL_HERE') {
                        alert('Please config your mailchimp form url for this widget');
                        return false;
                    }
                    else{
                        url=url.replace('?u=', '/post-json?u=').concat('&c=?');
                        console.log(url);
                        var data = {};
                        var dataArray = form.serializeArray();
                        $.each(dataArray, function (index, item) {
                        data[item.name] = item.value;
                        });
                        $.ajax({
                            url: url,
                            type: "POST",
                            data: data,
                            dataType: 'json',
                            success: function(response, text){
                                if (response.result === 'success') {
                                    message.html(success_message).delay(10000).fadeOut(500);
                                    $('#mc-embedded-subscribe').removeAttr('disabled');
                                    $('#mce-EMAIL').val('');
                                }
                                else{
                                    message.html(response.result+ ": " + response.msg).delay(10000).fadeOut(500);
                                    console.log(response);
                                    $('#mc-embedded-subscribe').removeAttr('disabled');
                                    $('#mce-EMAIL').focus().select();
                                }
                            },
                            dataType: 'jsonp',
                            error: function (response, text) {
                                console.log('mailchimp ajax submit error: ' + text);
                                $('#mc-embedded-subscribe').removeAttr('disabled');
                                $('#mce-EMAIL').focus().select();
                            }
                        });
                        return false;
                    }
                }
                else {
                    message.html('Please provide valid email').fadeIn(1000);
                    $('#mc-embedded-subscribe').removeAttr('disabled');
                    $('#mce-EMAIL').focus().select();
                }
            });
        },
        siteSearch: function() {
            var searchInput = $('#search-input');
            $('#searchmodal').on('shown.bs.modal', function(){
                searchInput.focus();
            })
            var searchField = searchInput.ghostHunter({
                results: "#search-results",
                zeroResultsInfo : false,
                onKeyUp         : true,
                onPageLoad      : true,
                includepages    : true,
                info_template   : "<div class=\"info align-center\">{{amount}} posts found</div>",
                result_template : "<div class=\"result\" id=\"gh-{{ref}}\"><a href='{{link}}'><div class=\"h5\">{{title}}</div><div class=\"date\">{{pubDate}}</div>{{description}}</a></div>"
            });
            $('#searchmodal').on('hidden.bs.modal', function() {
                 searchField.clear();
            });
        },
        backToTop: function() {
            $(window).scroll(function(){
                if ($(this).scrollTop() > 100) {
                    $('#back-to-top').fadeIn();
                } else {
                    $('#back-to-top').fadeOut();
                }
            });
            $('#back-to-top').on('click', function(e){
                e.preventDefault();
                $('html, body').animate({scrollTop : 0},1000);
                return false;
            });
        },
        gallery: function() {
            var images = document.querySelectorAll('.kg-gallery-image img');
            images.forEach(function (image) {
                var container = image.closest('.kg-gallery-image');
                var width = image.attributes.width.value;
                var height = image.attributes.height.value;
                var ratio = width / height;
                container.style.flex = ratio + ' 1 0%';
            });
            mediumZoom('.kg-gallery-image img', {
                margin: 30
            });
        },
		init:function(){
            themeApp.featuredSlider();
            themeApp.postWrapper();
            themeApp.setNavbar();
    		themeApp.featuredMedia();
            themeApp.responsiveIframe();
    		themeApp.highlighter();
    		themeApp.mobileMenu();
            themeApp.siteSearch();
    		themeApp.mailchimp();
            themeApp.backToTop();
            themeApp.gallery();
    	}
	}
    /*===========================
    2. Initialization
    ===========================*/
    $(document).ready(function(){
    	themeApp.init();
    });
}(jQuery));
