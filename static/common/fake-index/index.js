function article_js(){
	
	//侧边栏TAB效果
	$('.tab_menu a').click(function (e) { 
		e.preventDefault();
		$(this).tab('show');//显示当前选中的链接及关联的content
	});

	$('.tabs2 a').on('click', function(){
		$('body,html').animate({scrollTop:20},500);
	});
	
	// 文字展开
	$(".showmore span").click(function(e){
		$(this).html(["<i class='fa fa-caret-down'></i>", "<i class='fa fa-caret-up'></i>"][this.hutia^=1]);
		$(this.parentNode.parentNode).next().slideToggle();
		e.preventDefault();
	});
	
    //工具提示
    $(".btip").tooltip();
    
    $('#def-html').darkTooltip({
    	opacity:.7
	});
	
	$('.single-share').hover(
	function(){
		$('.share-yuansu').show(500);
	},
	function(){
		$('.share-yuansu').hide();
	}
	);
	
	$( '.post-img a').has('img').addClass('post-title');
	
    $('.post-image-slide').slick({
        dots: true,
		autoplay: true,
        infinite: true,
		arrows: false,
        speed: 500,
        fade: true,
        slide: 'div',
        cssEase: 'linear'
    });
	
	$('.lazy').slick({
		slidesToShow: 3,
		dots: true,
		arrows: false,
		autoplay: true,
        infinite: true,
		slidesToScroll: 1
    });
	
	$('.faded').slick({
        dots: true,
		arrows: false,
        infinite: true,
        speed: 700,
		autoplaySpeed: 4000,
        fade: true,
        slide: 'div',
        cssEase: 'linear',
		autoplay: true
    });
	if( $('#top-slide-three').length ){
	var owl = $('#top-slide-three'); 
		owl.owlCarousel({
		items:1,
		loop:true,
		margin:10,
		autoplay:true,
		autoplayTimeout:3000,
		responsive: {

			768 : {
				items: 1,
				margin: 0,
			},
			992 : {
				items: 2,
				margin: 20,
				center: true,
				autoWidth:true,
				nav : true,
				navText:'',

			}
		}
	});
	}
	
	//lrcplayer
	var settings = {
        progressbarWidth: '100%',
        progressbarHeight: '4px',
        progressbarColor: '#f2626f',
        progressbarBGColor: '#ffffff',
        defaultVolume: 0.8
    };
    $(".playerd").player(settings);	

	$("#jp_container span").on('click',function(){
		if($("#wenkmPlayer").hasClass("playing")){
			$('#w_pause').click();
		}
	});
	
	$(".simple-player-container li").on('click',function(){
		if($("#wenkmPlayer").hasClass("playing")){
			$('#w_pause').click();
		}
	});
	
    if (typeof scrollMonitor != 'undefined')
     {
        $(".post").each(function(i, el)
         {
            var ael = $(el),
            watcher = scrollMonitor.create(el, -100);
            ael.addClass('left-hide');
            watcher.enterViewport(function(ev)
             {
                if (!ael.hasClass('left-show'))
                 {
                    ael.addClass('left-show');
                }
            });
        });
    }
	//评论表情
	$('.smilies-icon').hover(function(){
		$('#smilies').addClass('selected');
	});
	$('body').click(function(){
		$('#smilies').removeClass('selected');
	})
	

	//瀑布流
	$(".cimage-img").gridalicious({
		gutter: 20,
		width: 200,
		animate: true,
		animationOptions: {
			speed: 150,
			duration: 300
		},
	});
	
	page_archive();
	
	var $items = $('#personal>ul>li');
	$items.click(function() {
		$items.removeClass('selected');
		$(this).addClass('selected');
		var index = $items.index($(this));
		$('#personal>div').hide().eq(index).fadeIn(200);
	}).eq(0).click();
	
	if ($(".single-music-so").length > 0) {
		document.onkeydown = function (e) {
			var theEvent = window.event || e; 
			var code = theEvent.keyCode || theEvent.which; 
			if (document.getElementById("somusic").value.length>0  && code == 13) {
				$(".pbutton").click(); 
			}
		}
	}
	qqmusic();

}

function page_archive(){
	if ( !document.getElementById("archives") ) return false;
	var year = $( '.year:first' ).attr("id").replace("year-", "");
	var old_top = $( '#archives' ).offset().top;
	$( '.year:first, .month:first' ).addClass('selected');
	$( '.year:first' ).parent().addClass('current-year');
	
	$( '.month' ).click(function(){
		var id = "#" + $(this).attr("id").replace("m", "archive");
		var top = $(id).offset().top-40;
		$( '.month.selected' ).removeClass('selected');
		$(this).addClass('selected');
		$( 'body,html' ).scrollTop(top);
	});
	
	$('.year').click(function(){
		if ( !$(this).next().hasClass('selected')){
			$( '.year.selected' ).removeClass('selected');
			$( '.current-year' ).removeClass('current-year');
			$(this).parent().addClass('current-year');
			$(this).addClass('selected');
		}
		$(this).next().click();
	});
	if ( qq.is_mobile != 1 ){//移动端屏蔽
		$(window).scroll(function(){
			var top = $(this).scrollTop();
			$( '.archive-content' ).each(function(){
				var thistop = $(this).offset().top-40,
				thisbottom = thistop + $(this).height();
				var newyear = $(this).attr("id").replace(/archive-(\d*)-\d*/, "$1");
				if ( top >= thistop && top <= thisbottom){
					if ( newyear != year ){
						$( '#year-' + year ).parent().removeClass('current-year');
						$( '#year-' + newyear ).parent().addClass('current-year');
						$( '.year.selected' ).removeClass('selected');
						$( '#year-' + newyear ).addClass('selected');
						year = newyear;
					}
					var id = "#" + $(this).attr("id").replace("archive", "m");
					$( '.month.selected' ).removeClass('selected');
					$(id).addClass('selected');
				}
			});
		});
	}else{
		$( '#archive-nav' ).hide();
	}
	
	//h3标题格式化
	$( '#archives h4' ).each(function(){
		var text = $(this).text(),
			line_width = 0,
			margin_top = 0;
		$(this).empty();
		$(this).append('<span class="h3-text">' + text +'</span>');
	});
}

function scrollTop_js(){
	//滚屏
	//首先将#back-to-top隐藏
    $("#back-to-top").hide();
    //当滚动条的位置处于距顶部100像素以下时，跳转链接出现，否则消失
    $(function () {
    $(window).scroll(function(){
    	if ($(window).scrollTop()>100){
    		$("#back-to-top").fadeIn(500);
    	}
    	else
    	{
    		$("#back-to-top").fadeOut(500);
    	}
		if ($(".archives-fixed").length > 0) {
			if( $('#archives').offset().top-$(document).scrollTop() <= 0 ){
				$('.archive-nav').addClass('archive-nav-ys');
			}
			else{
				$('.archive-nav').removeClass('archive-nav-ys');
			}
		}
    });
    //当点击跳转链接后，回到页面顶部位置
    $("#back-to-top").click(function(){
    	$('body,html').animate({scrollTop:0},500);
    	return false;
    	});
    });
}

function chufa_js() {
	/* lazyload*/
	$(function() {
			$('.avatar').lazyload({
				data_attribute: 'src',
				placeholder: themeurl + '/images/avatar-default.png',
				threshold: 400
			})

			$('.thumb').lazyload({
				data_attribute: 'src',
				placeholder: themeurl + '/images/thumbnail.png',
				threshold: 400
			})
			
			$('#tabs-w .avatar').lazyload({
				data_attribute: 'src',
				placeholder: themeurl + '/images/avatar-default.png',
				threshold: 400
			})

			$('#tabs-l .avatar').lazyload({
				data_attribute: 'src',
				placeholder: themeurl + '/images/avatar-default.png',
				threshold: 400
			})
			
			$('.qqlogo').lazyload({
				data_attribute: 'src',
				placeholder: themeurl + '/images/avatar-default.png',
				threshold: 400
			})
		})
}

function fssilde(){
	var mheader = document.getElementById( 'm-header' ),
		menuLeft = document.getElementById( 'm-nav' ),
		mcontainer = document.getElementById( 'm-container' ),
		mfooter = document.getElementById( 'm-footer' ),
		showLeftPush = document.getElementById( 'showLeftPush' );
	showLeftPush.onclick = function() {
		classie.toggle( mheader, 'm-header-open' );
		classie.toggle( menuLeft, 'm-nav-open' );
		classie.toggle( mcontainer, 'm-container-open' );
		classie.toggle( mfooter, 'm-footer-open' );
		disableOther( 'showLeftPush' );
	};
	function disableOther( button ) {
		if( button !== 'showLeftPush' ) {
			classie.toggle( showLeftPush, 'disabled' );
		}
			if( $('.m-container-open').length ){
		$(".container").click(function() {
			$( '#m-header' ).removeClass('m-header-open');
			$( '#m-nav' ).removeClass('m-nav-open');
			$( '#m-container' ).removeClass('m-container-open');
			$( '#m-footer' ).removeClass('m-footer-open');
		});
	}
	}

var eventClick = 'click';
var closeEnable = false;
	$('#search-trigger').bind(eventClick, function(event) {
		$('#search-form').addClass('active');
		closeEnable = false;
		setTimeout(function() {
			closeEnable = true;
		}, 500);
	});

	$('#search-input-s').bind('blur', function(event) {
		if ( closeEnable ) {
			$('#search-form').removeClass('active');
		}
	});

	$('#search-form-close').bind(eventClick, function(event) {
		event.preventDefault();
		if (closeEnable) {
			$('#search-form').removeClass('active');
			$('#search-input-s').blur();
			closeEnable = false;
		}
	});
}

/*
 *jPlayer -> post-music
 */
function audio_init(){
	//播放器界面初始化
	$( '#jquery_jplayer' ).jPlayer('destroy');//销毁播放器
	$( '.stop' ).hide();
	$( '.jplay' ).show();
}
//载入jPlayer
function audio_load(mp3_url){
	$( '#jquery_jplayer' ).jPlayer({
		ready:function(){
			$(this).jPlayer("setMedia",{
				mp3:mp3_url
			});
			$( '#jquery_jplayer' ).jPlayer('play');
		},
		ended:function(){
			audio_init();
		},
		swfPath:"http://jplayer.org/latest/js",
		supplied:"mp3"
	});
}
//绑定播放暂停控制事件
function audio_event(){
	$( '.jplay' ).click(function(){
		audio_init();
		var _this = $(this);
		_this.hide();
		_this.parent().find( '.stop' ).show();	
		//do it
		audio_load(_this.attr('rel'));
	});
	$( '.stop' ).click(function(){
		$(this).hide();
		$(this).parent().find( '.jplay' ).show();
		$( '#jquery_jplayer' ).jPlayer('stop');
		audio_init();
	});
	$( '.auto' ).each(function(){
		if($(this).attr('rel') == 1){
			$(this).parent().find('.jplay').click();
		}
	});
}
//文章载入，遍历播放
function audio_ready(){
	audio_event();
	audio_init();//ajax载入文章销毁播放器
}

function get_post_content() {
    if ($(".reply-to-read").length > 0) {
        var ajax_data = {
            action: "ajax_post_content",
            id: $("#comment_post_ID").attr("value"),
        };
        $.post(homeurl +"/wp-admin/admin-ajax.php", ajax_data,
        function(data) {
            $(".single-content").html(data);
        });
    }
}

function qqmusic() {
	$("#qqsobutton").click(function(){
		var loading = '<center><i class="fa fa-spinner fa-spin"></i>歌曲资源加载中...</center>';
		$.ajax({
			url: qq.ajaxurl,
			type:'POST',
			data:{action:'qqmusic', name: $("#somusic").val()},
			dataType:'html',
			beforeSend: function() {
				$( '#cards' ).empty().html(loading);
			},
			error: function(request) {
				$('#cards').html('<center><i class="fa fa-warning"></i>提示：资源加载错误！</center>');
				},
			success:function(data){
				$("#cards").html(data);
				reload_js();//自身重载一次
			}
		});
		return false;
	});
}

$(document).ready(function(){
	article_js();
	scrollTop_js();
	chufa_js();
	page_archive();
	fssilde();
	audio_ready();
	qqmusic();
	$(window).resize(function(){
		if($('.containerall').width()<1000){
			$('#wenkmPlayer').hide();
		}else{
			$('#wenkmPlayer').show();
		}
	});
	$(".navbar-collapse .main-nav li").hover(function(){
		$(this).find(".sub-menu").stop(true,true).animate({height:'show'},250);}
		,function(){
		$(this).find(".sub-menu").stop(true,true).animate({height:'hide'},250);}
	);
	
});
