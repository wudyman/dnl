(function( $ ) {
  // constants
  var SHOW_CLASS = 'show',
      HIDE_CLASS = 'hide',
      ACTIVE_CLASS = 'active';
  
  $( '.tabs' ).on( 'click', 'li a', function(e){
    e.preventDefault();
    var $tab = $( this ),
         href = $tab.attr( 'href' );
  
     $( '.active' ).removeClass( ACTIVE_CLASS );
     $tab.addClass( ACTIVE_CLASS );
  
     $( '.show' )
        .removeClass( SHOW_CLASS )
        .addClass( HIDE_CLASS )
        .hide();
    
      $(href)
        .removeClass( HIDE_CLASS )
        .addClass( SHOW_CLASS )
        .hide()
        .fadeIn( 550 );
  });
})( jQuery );
function checkValid()
{
    alert("need checkValid");
    return true;
}
function checkSelectOption()
{
    $('#topics_select').on('show.bs.select', function (e) {
    // do something...
        var bIsGetAll="1";
        $.post("/ajax/topics/"+bIsGetAll+"/0/0/", function(ret){
            if("fail"!=ret)
            {
                $('#topics_select').empty();
                for (var i in ret)
                {
                    var topic_id=ret[i][0];
                    var topic_name=ret[i][1];
                    $('#topics_select').append("<option value=" + topic_id + ":" + topic_name + ">" + topic_name + "</option>");
                }   
                $('.selectpicker').selectpicker('refresh');
            }  
        })
    });
}

//获取滚动条当前的位置 
function getScrollTop() { 
var scrollTop = 0; 
if (document.documentElement && document.documentElement.scrollTop) { 
scrollTop = document.documentElement.scrollTop; 
} 
else if (document.body) { 
scrollTop = document.body.scrollTop; 
} 
return scrollTop; 
} 

//获取当前可是范围的高度 
function getClientHeight() { 
var clientHeight = 0; 
if (document.body.clientHeight && document.documentElement.clientHeight) { 
clientHeight = Math.min(document.body.clientHeight, document.documentElement.clientHeight); 
} 
else { 
clientHeight = Math.max(document.body.clientHeight, document.documentElement.clientHeight); 
} 
return clientHeight; 
} 

//获取文档完整的高度 
function getScrollHeight() { 
return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight); 
} 

function getIndexImg(content){
    var imgReg=/<img.*?(?:>|\/>)/gi;
    var arr=content.match(imgReg);
    if(arr!=null)
    {
        var srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;
        imgsrc=arr[0].match(srcReg);
        return imgsrc[1];
    }
    else
        return null;
}

function removeImg(content){
    var imgReg=/<img.*?(?:>|\/>)/gi;
    var temp=content.replace(imgReg,"").replace(/<[^>]+>/g,"").replace(/&nbsp;/ig,"").substr(0,150);
    for(var i=0;i<100;i++)
        temp=temp+"&nbsp;";
    return temp;
    //return content.replace(imgReg,"").replace(/<p>/gi,"").replace(/<\/p>/gi,"").replace(/(^\s*)|(\s*$)/g,"");
}

function addClassImg(content,classStr)
{
    var temp=content.replace(/<img/gi,"<img "+classStr);
    return temp;
}

function updateValue(type,value)
{
    $(".NumberBoard-value").each(function(){
        var item=$(this);
        if(type==item.attr("data-update-value-type"))
            item.text(value)
    });
}
function followPeople(button){
    var er_id=button.attr("data-er-id");
    var who=button.attr("data-who");
    if("true"==button.attr("data-followed"))
    {
        $.post("/ajax/er_follow/0/"+er_id+"/",function(ret){
            if("fail"!=ret)
            {
                if ("she"==who)
                    button.removeClass("Button--grey").addClass("Button--green").text("关注她");
                else if ("he"==who)
                    button.removeClass("Button--grey").addClass("Button--green").text("关注他");
                else
                    button.removeClass("Button--grey").addClass("Button--green").text("关注");
                button.attr("data-followed","false");
                updateValue("people-followed",ret);
            }
        }); 
    }
    else
    {
        $.post("/ajax/er_follow/1/"+er_id+"/",function(ret){
            if("fail"!=ret)
            {
                button.removeClass("Button--green").addClass("Button--grey").text("已关注");
                button.attr("data-followed","true");
                updateValue("people-followed",ret);
            }
        });  
    }
} 

function followTopic(button){
    var topic_id=button.attr("data-topic-id");
    if("true"==button.attr("data-followed"))
    {
        $.post("/ajax/topic_follow/0/"+topic_id+"/",function(ret){
            if("fail"!=ret)
            {
                button.removeClass("Button--grey").addClass("Button--green").text("关注");
                button.attr("data-followed","false");
                updateValue("topic-followed",ret);
            }
        }); 
    }
    else
    {
        $.post("/ajax/topic_follow/1/"+topic_id+"/",function(ret){
            if("fail"!=ret)
            {
                button.removeClass("Button--green").addClass("Button--grey").text("已关注");
                button.attr("data-followed","true");
                updateValue("topic-followed",ret);
            }
        });  
    }
} 

function followQuestion(button){
    var question_id=button.attr("data-question-id");
    if("true"==button.attr("data-followed"))
    {
        $.post("/ajax/question_follow/0/"+question_id+"/",function(ret){
            if("fail"!=ret)
            {
                button.removeClass("Button--grey").addClass("Button--green").text("关注");
                button.attr("data-followed","false");
                updateValue("question-followed",ret);
            }
        }); 
    }
    else
    {
        $.post("/ajax/question_follow/1/"+question_id+"/",function(ret){
            if("fail"!=ret)
            {
                button.removeClass("Button--green").addClass("Button--grey").text("已关注");
                button.attr("data-followed","true");
                updateValue("question-followed",ret);
            }
        });  
    }
}  

function checkFollow()
{
    $(".FollowButton").off("click");
    $(".FollowButton").each(function(){
        var button=$(this);
        button.click(function(){
            console.log("checkFollow");
            if("people"==button.attr("data-follow-type"))
                followPeople(button);
            else if("topic"==button.attr("data-follow-type"))
                followTopic(button);
            else if("question"==button.attr("data-follow-type"))
                followQuestion(button);
            });
    });
}

function checkContentCollapse(){
    $(".ContentItem-less").off("click");
    $(".ContentItem-less").each(function(){
        $(this).click(function(){
            $(this).addClass("is-hide");
            $(this).parent().siblings(".RichContent-inner").children(".less").removeClass("is-hide");
            $(this).parent().siblings(".RichContent-inner").children(".more").addClass("is-hide");
            $(this).parent().siblings(".RichContent-inner").children(".ContentItem-more").removeClass("is-hide");
            $(this).parent().siblings(".ContentItem-more").removeClass("is-hide");
            if($(this).parent().siblings(".RichContent-cover").length<=0)//no this element
                $(this).parent().siblings(".RichContent-inner").css("max-height","400px");
            $(this).parents(".RichContent").addClass("is-collapsed");
            var index_img_url=$(this).parent().siblings(".RichContent-cover").find(".RichContent-cover-inner").attr("data-index-img-url");
            if("null"!=index_img_url)
            {
                $(this).parent().siblings(".RichContent-cover").find(".RichContent-cover-inner").empty();
                $(this).parent().siblings(".RichContent-cover").find(".RichContent-cover-inner").append('<img src="'+index_img_url+'">');
                $(this).parent().siblings(".RichContent-cover").removeClass("is-hide");
                
                if($(this).parents(".ScrollIntoMark").length>0)
                {
                    var id=$(this).parents(".ScrollIntoMark").attr("id");
                    document.getElementById(id).scrollIntoView();
                    $(this).parents(".ScrollIntoMark").removeAttr("id");
                }
            }
        });
    });
}

function checkContentExpand(){
    $(".RichContent-inner").off("click");
    $(".RichContent-inner").each(function(){
        
        if($(this).siblings(".ContentItem-more").hasClass("is-hide"))
        {
            if($(this).parents(".ScrollIntoMark").length>0)
            {
                var timestamp=new Date().getTime();
                $(this).parents(".ScrollIntoMark").attr("id",timestamp);
            }
        }
        var index_img_url=$(this).siblings(".RichContent-cover").find(".RichContent-cover-inner").attr("data-index-img-url")
        if("null"==index_img_url)
        {
            $(this).siblings(".RichContent-cover").addClass("is-hide");
        }
        else
        {
            $(this).siblings(".RichContent-cover").find(".RichContent-cover-inner").append('<img src="'+index_img_url+'">');
        }
        $(this).click(function(){
            console.log("checkContentExpand 1");
            $(this).children(".less").addClass("is-hide");
            $(this).children(".more").removeClass("is-hide");
            $(this).children(".ContentItem-more").addClass("is-hide");
            $(this).siblings(".ContentItem-more").addClass("is-hide");
            $(this).siblings(".ContentItem-actions").children(".ContentItem-less").removeClass("is-hide");
            $(this).parent().removeClass("is-collapsed");
            $(this).siblings(".RichContent-cover").addClass("is-hide");
            if($(this).siblings(".RichContent-cover").length<=0)//no this element
            {
                $(this).css("max-height","");
            }
            //$(this).siblings(".ContentItem-actions").addClass("Sticky RichContent-actions is-fixed is-bottom").css({"width": "455.2px", "bottom": "0px", "left": "0px"});
            if($(this).parents(".ScrollIntoMark").length>0)
            {
                var timestamp=new Date().getTime();
                $(this).parents(".ScrollIntoMark").attr("id",timestamp);
            }
        });
    });
    
    $(".ContentItem-more").off("click");
    $(".ContentItem-more").each(function(){
        $(this).click(function(e){
            console.log("checkContentExpand 2");
            $(this).siblings(".less").addClass("is-hide");
            $(this).siblings(".more").removeClass("is-hide");
            $(this).addClass("is-hide");
            $(this).parent().siblings(".ContentItem-actions").children(".ContentItem-less").removeClass("is-hide");
            $(this).siblings(".ContentItem-actions").children(".ContentItem-less").removeClass("is-hide");
            $(this).parent().removeClass("is-collapsed");
            $(this).parent().parent().removeClass("is-collapsed");
            $(this).parent().siblings(".RichContent-cover").addClass("is-hide");
            if($(this).siblings(".RichContent-cover").length<=0)//no this element
            {
                $(this).siblings(".RichContent-inner").css("max-height","");
            }
            //$(this).siblings(".ContentItem-actions").addClass("Sticky RichContent-actions is-fixed is-bottom").css({"width": "455.2px", "bottom": "0px", "left": "0px"});
            if($(this).parents(".ScrollIntoMark").length>0)
            {
                var timestamp=new Date().getTime();
                $(this).parents(".ScrollIntoMark").attr("id",timestamp);
            }
            e.stopPropagation();
        });
    });
    
}

/*
function checkContentCollapse2(){
    $(".ContentItem-less.NC-RichContent-type2").off("click");
    $(".ContentItem-less.NC-RichContent-type2").each(function(){
        $(this).click(function(){
            $(this).addClass("is-hide");
            $(this).parent().siblings(".ContentItem-more.NC-RichContent-type2").removeClass("is-hide");
            $(this).parents(".RichContent").addClass("is-collapsed");
            $(this).parent().siblings(".RichContent-inner").css("max-height","400px");
        });
    });
}

function checkContentExpand2(){
    //$(".RichContent-inner").off("click");
    $(".RichContent-inner").each(function(){
        $(this).click(function(){
            $(this).siblings(".ContentItem-more.NC-RichContent-type2").addClass("is-hide");
            $(this).siblings(".ContentItem-actions").children(".ContentItem-less.NC-RichContent-type2").removeClass("is-hide");
            $(this).parent().removeClass("is-collapsed");
            $(this).css("max-height","");
        });
    });
    $(".ContentItem-more.NC-RichContent-type2").off("click");
    $(".ContentItem-more.NC-RichContent-type2").each(function(){
        $(this).click(function(){
            $(this).addClass("is-hide");
            $(this).siblings(".ContentItem-actions").children(".ContentItem-less.NC-RichContent-type2").removeClass("is-hide");
            $(this).parent().removeClass("is-collapsed");
            $(this).siblings(".RichContent-inner").css("max-height","");
        });
    });
}
*/

function checkAnswerLike(){
    $(".AnswerLike").off("click");
    $(".AnswerLike").each(function(){
        $(this).click(function(){
            var element=$(this);
            answer_id=$(this).attr("data-answer-id");
            $.get("/ajax/answer_like/"+answer_id+"/",function(ret){
                if("fail"!=ret)
                {
                    element.text(ret);
                }
            });
        });
    });

}

function checkPopoverShow(){
   
    $('.PeoplePopover').off("mouseenter mouseleave");
    $('.PeoplePopover').on("mouseenter mouseleave",function(event){
        if(event.type=="mouseenter")
        {
                console.log("PeoplePopover show1");
                var element=$(this);//.children(".PeoplePopover");
                var author_id=element.attr("data-author-id");
                $.get("/ajax/er/"+author_id+"/",function(ret){
                    if("fail"!=ret)
                    {
                        er_id=ret[0];
                        er_name=ret[1];
                        er_avatar=ret[2];
                        er_mood=ret[3];
                        er_answer_nums=ret[4];
                        er_follower_nums=ret[5];
                        er_followed=ret[6];
                        er_sexual=ret[7];
                        
                        if("f"==er_sexual)
                        {
                            var who="she";
                            var who_han="她";
                        }
                        else
                        {
                            var who="he";
                            var who_han="他";
                        }
                        
                        var data1='<div><div class="HoverCard-titleContainer HoverCard-titleContainer--noAvatar"><img class="Avatar Avatar--large HoverCard-avatar" width="68" height="68" src="'+er_avatar+'" srcset="'+er_avatar+'"><div class="HoverCard-titleText"><div class="HoverCard-title"><span><a href="/er/'+er_id+'">'+er_name+'</a></span></div><div class="HoverCard-subtitle"><span class="RichText">'+er_mood+'</span></div></div></div></div><div class="HoverCard-item"><div class="NumberBoard"><a class="Button NumberBoard-item Button--plain" type="button" href="/er/'+er_id+'/answers"><div class="NumberBoard-name">回答</div><div class="NumberBoard-value">'+er_answer_nums+'</div></a><a class="Button NumberBoard-item Button--plain" type="button" href="/er/'+er_id+'/posts"><div class="NumberBoard-name">文章</div><div class="NumberBoard-value">0</div></a><a class="Button NumberBoard-item Button--plain" type="button" href="/er/'+er_id+'/followers"><div class="NumberBoard-name">关注者</div><div class="NumberBoard-value" data-update-value-type="people-followed">'+er_follower_nums+'</div></a></div>';
                        if(er_followed)
                            var data2='<div class="MemberButtonGroup ProfileButtonGroup HoverCard-buttons"><button class="Button FollowButton Button--primary Button--grey" type="button" data-er-id="'+er_id+'" data-follow-type="people" data-followed="true" data-who="'+who+'">已关注</button><button class="Button" type="button" data-toggle="modal" data-target="#letterModal"><svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" class="Icon Button-icon Icon--comments" width="15" height="16" aria-hidden="true" style="height: 16px; width: 15px;"><title></title><g><g>     <path d="M9 0C3.394 0 0 4.13 0 8c0 1.654.522 3.763 2.014 5.566.314.292.518.82.454 1.17-.165 1.488-.842 1.905-.842 1.905-.328.332.105.67.588.582 1.112-.2 2.07-.58 3.526-1.122.4-.202.464-.147.78-.078C11.524 17.764 18 14 18 8c0-3.665-3.43-8-9-8z"></path>     <path d="M19.14 9.628c.758.988.86 2.01.86 3.15 0 1.195-.62 3.11-1.368 3.938-.21.23-.354.467-.308.722.12 1.073.614 1.5.614 1.5.237.24-.188.563-.537.5-.802-.145-1.494-.42-2.545-.81-.29-.146-.336-.106-.563-.057-2.043.712-4.398.476-6.083-.926 5.964-.524 8.726-3.03 9.93-8.016z"></path>   </g></g></svg><span>发私信</span></button></div></div>';
                        else
                            var data2='<div class="MemberButtonGroup ProfileButtonGroup HoverCard-buttons"><button class="Button FollowButton Button--primary Button--green" type="button" data-er-id="'+er_id+'" data-follow-type="people" data-followed="false" data-who="'+who+'">关注'+who_han+'</button><button class="Button" type="button" data-toggle="modal" data-target="#letterModal"><svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" class="Icon Button-icon Icon--comments" width="15" height="16" aria-hidden="true" style="height: 16px; width: 15px;"><title></title><g><g>     <path d="M9 0C3.394 0 0 4.13 0 8c0 1.654.522 3.763 2.014 5.566.314.292.518.82.454 1.17-.165 1.488-.842 1.905-.842 1.905-.328.332.105.67.588.582 1.112-.2 2.07-.58 3.526-1.122.4-.202.464-.147.78-.078C11.524 17.764 18 14 18 8c0-3.665-3.43-8-9-8z"></path>     <path d="M19.14 9.628c.758.988.86 2.01.86 3.15 0 1.195-.62 3.11-1.368 3.938-.21.23-.354.467-.308.722.12 1.073.614 1.5.614 1.5.237.24-.188.563-.537.5-.802-.145-1.494-.42-2.545-.81-.29-.146-.336-.106-.563-.057-2.043.712-4.398.476-6.083-.926 5.964-.524 8.726-3.03 9.93-8.016z"></path>   </g></g></svg><span>发私信</span></button></div></div>';
                        var data=data1+data2;
                        element.attr("data-content",data);
                        element.popover('show');                    
                        setLetterReceiver(er_id,er_name);
                        checkFollow(); 
                        $(".popover").on("mouseleave",function(){
                            element.popover('hide'); 
                        });
                    }
                });
        }
        else if(event.type=="mouseleave"){
            var element=$(this);
            console.log("PeoplePopover hide");
            setTimeout(function(){
                console.log($(".popover:hover").length);
                if(!$(".popover:hover").length)
                    element.popover('hide');
                },300);
        }
    
    });

    $('.TopicPopover').off("mouseenter mouseleave");
    $('.TopicPopover').on("mouseenter mouseleave",function(event){
        if(event.type=="mouseenter")
        {
                console.log("TopicPopover show");
                var element=$(this);//.children(".TopicPopover");
                var topic_id=element.attr("data-topic-id");
                $.get("/ajax/topic/"+topic_id+"/",function(ret){
                    if("fail"!=ret)
                    {
                        topic_id=ret[0];
                        topic_name=ret[1];
                        topic_avatar=ret[2];
                        topic_question_nums=ret[3];
                        topic_follower_nums=ret[4];
                        topic_followed=ret[5];

                        var data1='<div><div class="HoverCard-titleContainer HoverCard-titleContainer--noAvatar"><img class="Avatar Avatar--large HoverCard-avatar" width="68" height="68" src="'+topic_avatar+'" srcset="'+topic_avatar+'"><div class="HoverCard-titleText"><div class="HoverCard-title"><a target="_blank" href="/topic/'+topic_id+'">'+topic_name+'</a></div></div></div></div><div class="HoverCard-item"><div class="NumberBoard"><a class="Button NumberBoard-item Button--plain" href="/topic/'+topic_id+'/questions" type="button"><div class="NumberBoard-name">问题&nbsp;</div><div class="NumberBoard-value">'+topic_question_nums+'</div></a><a class="Button NumberBoard-item Button--plain" href="/topic/'+topic_id+'/followers" type="button"><div class="NumberBoard-name">关注者</div><div class="NumberBoard-value" data-update-value-type="topic-followed">'+topic_follower_nums+'</div></a></div>';
                        if(topic_followed)
                            var data2='<div class="HoverCard-buttons"><button class="Button FollowButton Button--primary Button--grey" type="button" data-topic-id="'+topic_id+'" data-follow-type="topic" data-followed="true">已关注</button></div></div>';
                        else
                            var data2='<div class="HoverCard-buttons"><button class="Button FollowButton Button--primary Button--green" type="button" data-topic-id="'+topic_id+'" data-follow-type="topic" data-followed="false">关注</button></div></div>';
                        var data=data1+data2;
                        element.attr("data-content",data);
                        element.popover('show');
                        checkFollow(); 
                        $(".popover").on("mouseleave",function(){
                            element.popover('hide'); 
                        });
                    }
                });
        }
        else if(event.type=="mouseleave"){
                var element=$(this);
                console.log("TopicPopover hide");
                setTimeout(function(){
                    console.log($(".popover:hover").length);
                    if(!$(".popover:hover").length)
                        element.popover('hide');
                },300);
        }
    
    }); 

    $('#NotificationPopover').off("click");
    $('#NotificationPopover').click(function(e){
        console.log("NotificationPopover click");
        $("#MessagePopover").popover("hide");
        $("#MenuPopover").popover("hide");
        e.stopPropagation();
        //var data='<div class="Menu PushNotifications-menu"><div class="PushNotifications-content"><div class="PushNotifications-header" role="tablist"><button class="Button PushNotifications-tab Button--plain" role="tab" aria-controls="PushNotifications-default" aria-label="消息" type="button"><svg viewBox="0 0 20 15" class="Icon PushNotifications-tabIcon PushNotifications-selectedTabIcon Icon--lastNews" width="20" height="16" aria-hidden="true" style="height: 16px; width: 20px;"><title></title><g><path d="M6.493 6C5.668 6 5 6.666 5 7.5 5 8.328 5.664 9 6.493 9h12.014C19.332 9 20 8.334 20 7.5c0-.828-.664-1.5-1.493-1.5H6.493zm0 6C5.668 12 5 12.666 5 13.5c0 .828.664 1.5 1.493 1.5h12.014c.825 0 1.493-.666 1.493-1.5 0-.828-.664-1.5-1.493-1.5H6.493zM1.5 0C.672 0 0 .666 0 1.5 0 2.328.666 3 1.5 3 2.328 3 3 2.334 3 1.5 3 .672 2.334 0 1.5 0zm0 6C.672 6 0 6.666 0 7.5 0 8.328.666 9 1.5 9 2.328 9 3 8.334 3 7.5 3 6.672 2.334 6 1.5 6zm0 6c-.828 0-1.5.666-1.5 1.5 0 .828.666 1.5 1.5 1.5.828 0 1.5-.666 1.5-1.5 0-.828-.666-1.5-1.5-1.5zM6.493 0C5.668 0 5 .666 5 1.5 5 2.328 5.664 3 6.493 3h12.014C19.332 3 20 2.334 20 1.5c0-.828-.664-1.5-1.493-1.5H6.493z"></path></g></svg></button><button class="Button PushNotifications-tab Button--plain" role="tab" aria-controls="PushNotifications-follow" aria-label="用户" type="button"><svg viewBox="0 0 24 17" class="Icon PushNotifications-tabIcon Icon--userNews" width="20" height="16" aria-hidden="true" style="height: 16px; width: 20px;"><title></title><g><path d="M9.464 7.705c-.265.46-.59.904-.538 1.315.206 1.603 3.205 1.92 4.087 2.99.643.783.91 1.97.972 3.96.01.32 0 1.03-.946 1.03H1.02c-1 0-1.01-.683-1-.995.068-1.994.318-3.208.976-3.994.886-1.056 4.084-1.345 4.224-3.05.032-.385-.268-.786-.538-1.255C3.182 5.102 2.608 0 7.054 0s3.824 5.25 2.41 7.705zM18.27 8.545c.963.126 2.924-.574 2.924-.574-.664-.68-.815-1.472-1.294-4.586C19.507.27 16.8.3 16.597.3c-.203 0-2.91-.03-3.297 3.084-.485 3.113-.636 3.907-1.3 4.586 0 0 1.96.7 2.923.575l-.003.68c-.494.542-1.79.725-2.376 1.077 2.796.316 2.954 3.696 2.954 6.678 1.475-.002 6.497.02 7.5.02 1.002 0 .996-.674.986-.976-.06-1.8-.28-2.786-.418-3.434-.416-1.976-3.58-1.488-5.292-3.364l-.003-.68z"></path></g></svg></button><button class="Button PushNotifications-tab Button--plain" role="tab" aria-controls="PushNotifications-vote-thank" aria-label="赞同和感谢" type="button"><div><svg viewBox="0 0 20 18" class="Icon PushNotifications-tabIcon Icon--thankNews" width="20" height="16" aria-hidden="true" style="height: 16px; width: 20px;"><title></title><g><path d="M0,5.43706401 C5.73656627e-08,2.50510671 2.2938809,0.094365083 5.20737357,1.60732864e-07 C7.2427157,-0.000505078569 9.0922816,1.19013727 9.9999282,3 C10.8228521,1.24236064 12.6486957,1.60732867e-07 14.6514359,1.60732864e-07 C17.5445125,1.60732867e-07 19.9999282,2.50715387 19.9999282,5.43242499 C19.9999282,13.2399998 11.8420757,18 9.99997552,18 C8.15785253,18 -1.52669543e-07,13.2399998 0,5.43706401 Z"></path></g></svg></div></button></div><div class="PushNotifications-list"></div><div class="Notifications-footer"><a class="Button Button--plain" href="/settings/notification" type="button"><svg viewBox="0 0 20 20" class="Icon Button-icon Icon--setting" width="14" height="16" aria-hidden="true" style="height: 16px; width: 14px;"><title></title><g><path d="M18.868 15.185c-.164.096-.315.137-.452.137-.123 0-1.397-.26-1.617-.233-1.355.013-1.782 1.275-1.836 1.74-.055.454 0 .893.19 1.304.138.29.125.577-.067.85-.863.893-2.165 1.016-2.357 1.016-.123 0-.247-.055-.356-.15-.11-.097-.685-1.14-1.07-1.47-1.303-.954-2.246-.328-2.63 0-.397.33-.67.7-.835 1.126-.07.18-.18.302-.33.37-1.354.426-2.918-.92-3.014-1.056-.082-.11-.123-.22-.123-.356-.014-.138.383-1.276.342-1.688-.342-1.9-1.836-1.687-2.096-1.673-.303.014-.604.068-.92.178-.205.056-.396.03-.588-.054-.888-.462-1.137-2.332-1.11-2.51.055-.315.192-.52.438-.604.425-.164.81-.452 1.15-.85.932-1.262.344-2.25 0-2.634-.34-.356-.725-.645-1.15-.81-.137-.04-.233-.15-.328-.315C-.27 6.07.724 4.95.978 4.733c.255-.22.6-.055.723 0 .426.164.878.22 1.344.15C4.7 4.636 4.784 3.14 4.81 2.908c.015-.247-.11-1.29-.136-1.4-.027-.123-.014-.22.027-.315C5.318.178 7.073 0 7.223 0c.178 0 .33.055.44.178.108.124.63 1.11 1 1.4.398.338 1.582.83 2.588.013.398-.273.96-1.288 1.083-1.412.123-.123.26-.178.384-.178 1.56 0 2.33 1.03 2.438 1.22.083.124.096.248.07.37-.03.152-.33 1.153-.262 1.606.366 1.537 1.384 1.742 1.89 1.783.494.027 1.645-.357 1.81-.344.164.014.315.083.424.206.535.31.85 1.715.905 2.14.027.233-.014.44-.11.562-.11.138-1.165.714-1.48 1.112-.855.982-.342 2.25-.068 2.606.26.37 1.22.905 1.288.96.15.137.26.302.315.494.146 1.413-.89 2.387-1.07 2.47zm-8.905-.535c.644 0 1.246-.123 1.822-.356.575-.248 1.082-.59 1.493-1.016.425-.425.754-.92 1-1.495.247-.562.357-1.18.357-1.81 0-.66-.11-1.262-.356-1.825-.248-.562-.577-1.056-1.002-1.48-.41-.427-.918-.756-1.493-1.003-.576-.233-1.178-.357-1.822-.357-.644 0-1.247.124-1.81.357-.56.247-1.067.576-1.478 1.002-.425.425-.768.92-1 1.48-.247.564-.37 1.167-.37 1.826 0 .644.123 1.248.37 1.81.232.563.575 1.07 1 1.495.424.426.917.768 1.48 1.016.56.233 1.164.356 1.808.356z"></path></g></svg>设置</a><a class="Button Button--plain" href="/notifications" type="button">查看全部提醒</a></div></div></div>';
        var data='<div class="Menu PushNotifications-menu"><div class="PushNotifications-content"><div class="PushNotifications-header" role="tablist"><button class="Button PushNotifications-tab PushNotifications-tab-active Button--plain" type="button">我的提醒</button></div><div class="PushNotifications-list"></div><div class="Notifications-footer"><a class="Button Button--plain" href="/settings/?sub=notification" type="button"><svg viewBox="0 0 20 20" class="Icon Button-icon Icon--setting" width="14" height="16" aria-hidden="true" style="height: 16px; width: 14px;"><title></title><g><path d="M18.868 15.185c-.164.096-.315.137-.452.137-.123 0-1.397-.26-1.617-.233-1.355.013-1.782 1.275-1.836 1.74-.055.454 0 .893.19 1.304.138.29.125.577-.067.85-.863.893-2.165 1.016-2.357 1.016-.123 0-.247-.055-.356-.15-.11-.097-.685-1.14-1.07-1.47-1.303-.954-2.246-.328-2.63 0-.397.33-.67.7-.835 1.126-.07.18-.18.302-.33.37-1.354.426-2.918-.92-3.014-1.056-.082-.11-.123-.22-.123-.356-.014-.138.383-1.276.342-1.688-.342-1.9-1.836-1.687-2.096-1.673-.303.014-.604.068-.92.178-.205.056-.396.03-.588-.054-.888-.462-1.137-2.332-1.11-2.51.055-.315.192-.52.438-.604.425-.164.81-.452 1.15-.85.932-1.262.344-2.25 0-2.634-.34-.356-.725-.645-1.15-.81-.137-.04-.233-.15-.328-.315C-.27 6.07.724 4.95.978 4.733c.255-.22.6-.055.723 0 .426.164.878.22 1.344.15C4.7 4.636 4.784 3.14 4.81 2.908c.015-.247-.11-1.29-.136-1.4-.027-.123-.014-.22.027-.315C5.318.178 7.073 0 7.223 0c.178 0 .33.055.44.178.108.124.63 1.11 1 1.4.398.338 1.582.83 2.588.013.398-.273.96-1.288 1.083-1.412.123-.123.26-.178.384-.178 1.56 0 2.33 1.03 2.438 1.22.083.124.096.248.07.37-.03.152-.33 1.153-.262 1.606.366 1.537 1.384 1.742 1.89 1.783.494.027 1.645-.357 1.81-.344.164.014.315.083.424.206.535.31.85 1.715.905 2.14.027.233-.014.44-.11.562-.11.138-1.165.714-1.48 1.112-.855.982-.342 2.25-.068 2.606.26.37 1.22.905 1.288.96.15.137.26.302.315.494.146 1.413-.89 2.387-1.07 2.47zm-8.905-.535c.644 0 1.246-.123 1.822-.356.575-.248 1.082-.59 1.493-1.016.425-.425.754-.92 1-1.495.247-.562.357-1.18.357-1.81 0-.66-.11-1.262-.356-1.825-.248-.562-.577-1.056-1.002-1.48-.41-.427-.918-.756-1.493-1.003-.576-.233-1.178-.357-1.822-.357-.644 0-1.247.124-1.81.357-.56.247-1.067.576-1.478 1.002-.425.425-.768.92-1 1.48-.247.564-.37 1.167-.37 1.826 0 .644.123 1.248.37 1.81.232.563.575 1.07 1 1.495.424.426.917.768 1.48 1.016.56.233 1.164.356 1.808.356z"></path></g></svg>设置</a><a class="Button Button--plain" href="/notifications" type="button">查看全部提醒</a></div></div></div>';
        $('#NotificationPopover').attr("data-content",data);
        $('#NotificationPopover').popover('show');
        if("null"==notifications)
        {
            $.get("/ajax/notifications/1/0/10/",function(ret){
                if("fail"!=ret)
                {
                    notifications=ret;
                    appendNotificationElement(notifications);
                }
            });
        }
        else
        {
            appendNotificationElement(notifications);
        }
        
        $(".PushNotifications-tab").click(function(){
            $.get("/ajax/notifications/1/0/10/",function(ret){
                if("fail"!=ret)
                {
                    notifications=ret;
                    appendNotificationElement(notifications);
                }
            });
        });
        
        $(".Menu.PushNotifications-menu").click(function(e){
            e.stopPropagation();
        });
         
    });
    
    $('#MessagePopover').off("click");
    $('#MessagePopover').click(function(e){
        console.log("MessagePopover click");
        $("#NotificationPopover").popover("hide");
        $("#MenuPopover").popover("hide");
        e.stopPropagation();
        //var data='<div class="Menu Messages-menu"><div class="Messages-content"><div class="Messages-header" role="tablist"><button class="Button Messages-tab Messages-myMessageTab Button--plain" type="button">????</button></div><div class="Messages-list"><a href="/inbox/5587284910" class="Messages-item Messages-followItem"><span class="UserLink"><img class="Avatar Avatar--medium UserLink-avatar" width="40" height="40" src="https://pic3.zhimg.com/v2-b14587a6079c43702f1f0251098f3ec2_xs.jpg" srcset="https://pic3.zhimg.com/v2-b14587a6079c43702f1f0251098f3ec2_l.jpg 2x" alt="verna wu"></span><div class="Messages-user"><div class="Messages-userName"><span class="UserLink"><!-- react-text: 26 -->verna wu<!-- /react-text --></span></div><div class="Messages-itemContent">hi verna</div></div></a><a href="/inbox/6213324000" class="Messages-item Messages-followItem"><span class="UserLink"><img class="Avatar Avatar--medium UserLink-avatar" width="40" height="40" src="https://pic3.zhimg.com/fd56780c37f0b316c56f27fe8b388532_xs.jpg" srcset="https://pic3.zhimg.com/fd56780c37f0b316c56f27fe8b388532_l.jpg 2x" alt="????"></span><div class="Messages-user"><div class="Messages-userName"><span class="UserLink"><!-- react-text: 34 -->????<!-- /react-text --></span></div><div class="Messages-itemContent">wudy:??????????? Club??? 5 ? 14 ???????????????????????15 ??????????????????? Live??????????? Club??????????????????https://zhuanlan.zhihu.com/p/20852694?source=message ??????????????????????????????????????????????? http://www.bilibili.com/html/activity-zh-yanclub.html ?????????????</div></div></a><div></div></div><div class="Messages-footer"><button class="Button Button--plain" type="button"><svg viewBox="0 0 12 12" class="Icon Button-icon Icon--modify" width="14" height="16" aria-hidden="true" style="height: 16px; width: 14px;"><title></title><g><path d="M.423 10.32L0 12l1.667-.474 1.55-.44-2.4-2.33-.394 1.564zM10.153.233c-.327-.318-.85-.31-1.17.018l-.793.817 2.49 2.414.792-.814c.318-.328.312-.852-.017-1.17l-1.3-1.263zM3.84 10.536L1.35 8.122l6.265-6.46 2.49 2.414-6.265 6.46z" fill-rule="evenodd"></path></g></svg>????</button><a class="Button Button--plain" href="/inbox" type="button">??????</a></div></div></div>';
        var data='<div class="Menu Messages-menu"><div class="Messages-content"><div class="Messages-header" role="tablist"><button class="Button Messages-tab Messages-myMessageTab Button--plain" type="button">我的私信</button></div><div class="Messages-list"><div></div></div><div class="Messages-footer"><a class="Button Button--plain" href="/settings/?sub=conversation" type="button"><svg viewBox="0 0 20 20" class="Icon Button-icon Icon--setting" width="14" height="16" aria-hidden="true" style="height: 16px; width: 14px;"><title></title><g><path d="M18.868 15.185c-.164.096-.315.137-.452.137-.123 0-1.397-.26-1.617-.233-1.355.013-1.782 1.275-1.836 1.74-.055.454 0 .893.19 1.304.138.29.125.577-.067.85-.863.893-2.165 1.016-2.357 1.016-.123 0-.247-.055-.356-.15-.11-.097-.685-1.14-1.07-1.47-1.303-.954-2.246-.328-2.63 0-.397.33-.67.7-.835 1.126-.07.18-.18.302-.33.37-1.354.426-2.918-.92-3.014-1.056-.082-.11-.123-.22-.123-.356-.014-.138.383-1.276.342-1.688-.342-1.9-1.836-1.687-2.096-1.673-.303.014-.604.068-.92.178-.205.056-.396.03-.588-.054-.888-.462-1.137-2.332-1.11-2.51.055-.315.192-.52.438-.604.425-.164.81-.452 1.15-.85.932-1.262.344-2.25 0-2.634-.34-.356-.725-.645-1.15-.81-.137-.04-.233-.15-.328-.315C-.27 6.07.724 4.95.978 4.733c.255-.22.6-.055.723 0 .426.164.878.22 1.344.15C4.7 4.636 4.784 3.14 4.81 2.908c.015-.247-.11-1.29-.136-1.4-.027-.123-.014-.22.027-.315C5.318.178 7.073 0 7.223 0c.178 0 .33.055.44.178.108.124.63 1.11 1 1.4.398.338 1.582.83 2.588.013.398-.273.96-1.288 1.083-1.412.123-.123.26-.178.384-.178 1.56 0 2.33 1.03 2.438 1.22.083.124.096.248.07.37-.03.152-.33 1.153-.262 1.606.366 1.537 1.384 1.742 1.89 1.783.494.027 1.645-.357 1.81-.344.164.014.315.083.424.206.535.31.85 1.715.905 2.14.027.233-.014.44-.11.562-.11.138-1.165.714-1.48 1.112-.855.982-.342 2.25-.068 2.606.26.37 1.22.905 1.288.96.15.137.26.302.315.494.146 1.413-.89 2.387-1.07 2.47zm-8.905-.535c.644 0 1.246-.123 1.822-.356.575-.248 1.082-.59 1.493-1.016.425-.425.754-.92 1-1.495.247-.562.357-1.18.357-1.81 0-.66-.11-1.262-.356-1.825-.248-.562-.577-1.056-1.002-1.48-.41-.427-.918-.756-1.493-1.003-.576-.233-1.178-.357-1.822-.357-.644 0-1.247.124-1.81.357-.56.247-1.067.576-1.478 1.002-.425.425-.768.92-1 1.48-.247.564-.37 1.167-.37 1.826 0 .644.123 1.248.37 1.81.232.563.575 1.07 1 1.495.424.426.917.768 1.48 1.016.56.233 1.164.356 1.808.356z"></path></g></svg>设置</a><a class="Button Button--plain" href="/conversations/" type="button">查看全部私信</a></div></div></div>';
        $('#MessagePopover').attr("data-content",data);
        $('#MessagePopover').popover('show');
        if("null"==messages)
        {
            $.get("/ajax/conversations/1/0/10/",function(ret){
                if("fail"!=ret)
                {
                    messages=ret;
                    appendMessageElement(messages);
                }
            });
        }
        else
        {
            appendMessageElement(messages);
        }
        
        $(".Messages-tab").click(function(){
            $.get("/ajax/conversations/1/0/10/",function(ret){
                if("fail"!=ret)
                {
                    messages=ret;
                    appendMessageElement(messages);
                }
            });
        });
        
        $(".Menu.Messages-menu").click(function(e){
            e.stopPropagation();
        });               

    });
    
    $('#MenuPopover').off("click");
    $('#MenuPopover').click(function(e){
        console.log("MenuPopover click");
        $("#NotificationPopover").popover("hide");
        $("#MessagePopover").popover("hide");
        e.stopPropagation();
        var er_id=$(this).attr("data-er-id");
        var data='<div class="Menu Home-menu">\
        <a class="Button Menu-item AppHeaderProfileMenu-item Button--plain" type="button" href="/er/'+er_id+'/"><svg viewBox="0 0 20 20" class="Icon Button-icon Icon--profile" width="14" height="16" aria-hidden="true" style="height: 16px; width: 14px;"><title></title><g><path d="M13.4170937,10.9231839 C13.0412306,11.5757324 12.5795351,12.204074 12.6542924,12.7864225 C12.9457074,15.059449 18.2164534,14.5560766 19.4340179,15.8344151 C20,16.4286478 20,16.4978969 20,19.9978966 C13.3887136,19.9271077 6.63736785,19.9978966 0,19.9978966 C0.0272309069,16.4978969 0,16.5202878 0.620443914,15.8344151 C1.92305664,14.3944356 7.20116276,15.1185829 7.40016946,12.7013525 C7.44516228,12.1563518 7.02015319,11.5871442 6.63736814,10.9228381 C4.51128441,7.2323256 3.69679769,4.67956187e-11 10,9.32587341e-14 C16.3032023,-4.66091013e-11 15.4216968,7.4429255 13.4170937,10.9231839 Z"></path></g></svg>我的主页</a>\
        <a class="Button Menu-item AppHeaderProfileMenu-item Button--plain" href="/settings/?sub=profile" type="button"><svg viewBox="0 0 20 20" class="Icon Button-icon Icon--setting" width="14" height="16" aria-hidden="true" style="height: 16px; width: 14px;"><title></title><g><path d="M18.868 15.185c-.164.096-.315.137-.452.137-.123 0-1.397-.26-1.617-.233-1.355.013-1.782 1.275-1.836 1.74-.055.454 0 .893.19 1.304.138.29.125.577-.067.85-.863.893-2.165 1.016-2.357 1.016-.123 0-.247-.055-.356-.15-.11-.097-.685-1.14-1.07-1.47-1.303-.954-2.246-.328-2.63 0-.397.33-.67.7-.835 1.126-.07.18-.18.302-.33.37-1.354.426-2.918-.92-3.014-1.056-.082-.11-.123-.22-.123-.356-.014-.138.383-1.276.342-1.688-.342-1.9-1.836-1.687-2.096-1.673-.303.014-.604.068-.92.178-.205.056-.396.03-.588-.054-.888-.462-1.137-2.332-1.11-2.51.055-.315.192-.52.438-.604.425-.164.81-.452 1.15-.85.932-1.262.344-2.25 0-2.634-.34-.356-.725-.645-1.15-.81-.137-.04-.233-.15-.328-.315C-.27 6.07.724 4.95.978 4.733c.255-.22.6-.055.723 0 .426.164.878.22 1.344.15C4.7 4.636 4.784 3.14 4.81 2.908c.015-.247-.11-1.29-.136-1.4-.027-.123-.014-.22.027-.315C5.318.178 7.073 0 7.223 0c.178 0 .33.055.44.178.108.124.63 1.11 1 1.4.398.338 1.582.83 2.588.013.398-.273.96-1.288 1.083-1.412.123-.123.26-.178.384-.178 1.56 0 2.33 1.03 2.438 1.22.083.124.096.248.07.37-.03.152-.33 1.153-.262 1.606.366 1.537 1.384 1.742 1.89 1.783.494.027 1.645-.357 1.81-.344.164.014.315.083.424.206.535.31.85 1.715.905 2.14.027.233-.014.44-.11.562-.11.138-1.165.714-1.48 1.112-.855.982-.342 2.25-.068 2.606.26.37 1.22.905 1.288.96.15.137.26.302.315.494.146 1.413-.89 2.387-1.07 2.47zm-8.905-.535c.644 0 1.246-.123 1.822-.356.575-.248 1.082-.59 1.493-1.016.425-.425.754-.92 1-1.495.247-.562.357-1.18.357-1.81 0-.66-.11-1.262-.356-1.825-.248-.562-.577-1.056-1.002-1.48-.41-.427-.918-.756-1.493-1.003-.576-.233-1.178-.357-1.822-.357-.644 0-1.247.124-1.81.357-.56.247-1.067.576-1.478 1.002-.425.425-.768.92-1 1.48-.247.564-.37 1.167-.37 1.826 0 .644.123 1.248.37 1.81.232.563.575 1.07 1 1.495.424.426.917.768 1.48 1.016.56.233 1.164.356 1.808.356z"></path></g></svg>设置</a>\
        <a class="Button Menu-item AppHeaderProfileMenu-item Button--plain" href="/exit/" type="button"><svg viewBox="0 0 20 20" class="Icon Button-icon Icon--logout" width="14" height="16" aria-hidden="true" style="height: 16px; width: 14px;"><title></title><g><path d="M0 10C0 7.242 1.154 4.58 3.167 2.697c.51-.477 1.31-.45 1.79.06.475.51.45 1.31-.06 1.787C3.37 5.975 2.53 7.91 2.53 10c0 4.118 3.35 7.468 7.47 7.468 4.12 0 7.47-3.35 7.47-7.47 0-2.04-.81-3.948-2.28-5.37-.5-.485-.514-1.286-.028-1.788.485-.5 1.286-.517 1.79-.03C18.915 4.712 20 7.265 20 10c0 5.512-4.486 9.998-10 9.998s-10-4.486-10-10zm8.7-.483V1.26C8.7.564 9.26 0 9.96 0c.695 0 1.26.564 1.26 1.26v8.257c0 .696-.565 1.26-1.26 1.26-.698 0-1.26-.564-1.26-1.26z"></path></g></svg>退出</a></div>';
        $('#MenuPopover').attr("data-content",data);
        $('#MenuPopover').popover('show');
        
        $(".Menu.Home-menu").click(function(e){
            e.stopPropagation();
        });

    });
    
}

function checkExpandBtn(){
    $('.MobileAppHeader-expandBtn').off("click");
    $('.MobileAppHeader-expandBtn').click(function(e){
        console.log("MobileAppHeader-expandBtn click");
        if($('.MobileAppHeader-expandBtn').children('svg').hasClass('Zi--More'))
        {
            var svg='<svg class="Zi Zi--Close" fill="currentColor" viewBox="0 0 24 24" width="24" height="24"><path d="M13.486 12l5.208-5.207a1.048 1.048 0 0 0-.006-1.483 1.046 1.046 0 0 0-1.482-.005L12 10.514 6.793 5.305a1.048 1.048 0 0 0-1.483.005 1.046 1.046 0 0 0-.005 1.483L10.514 12l-5.208 5.207a1.048 1.048 0 0 0 .006 1.483 1.046 1.046 0 0 0 1.482.005L12 13.486l5.207 5.208a1.048 1.048 0 0 0 1.483-.006 1.046 1.046 0 0 0 .005-1.482L13.486 12z" fill-rule="evenodd"></path></svg>';
            $('.MobileAppHeader-expandBtn').empty().append(svg);
            var data='<div><div class="MobileAppHeader-expandContainer"><span><div class="MobileAppHeader-expand">\
                        <a href="/topic"><svg class="Zi Zi--Home" fill="#8590a6" viewBox="0 0 24 24" width="24" height="24"><path d="M3 3.99C3 2.892 3.893 2 4.995 2h14.01C20.107 2 21 2.898 21 3.99v16.02c0 1.099-.893 1.99-1.995 1.99H4.995A1.997 1.997 0 0 1 3 20.01V3.99zM6 7c0 .556.449 1 1.002 1h9.996a.999.999 0 1 0 0-2H7.002C6.456 6 6 6.448 6 7zm0 5c0 .556.449 1 1.002 1h9.996a.999.999 0 1 0 0-2H7.002C6.456 11 6 11.448 6 12zm0 5c0 .556.446 1 .997 1h6.006c.544 0 .997-.448.997-1 0-.556-.446-1-.997-1H6.997C6.453 16 6 16.448 6 17z"></path></svg>话题</a>\
                        <a href="/search/"><svg class="Zi Zi--Search" fill="#8590a6" viewBox="0 0 24 24" width="24" height="24"><path d="M17.068 15.58a8.377 8.377 0 0 0 1.774-5.159 8.421 8.421 0 1 0-8.42 8.421 8.38 8.38 0 0 0 5.158-1.774l3.879 3.88c.957.573 2.131-.464 1.488-1.49l-3.879-3.878zm-6.647 1.157a6.323 6.323 0 0 1-6.316-6.316 6.323 6.323 0 0 1 6.316-6.316 6.323 6.323 0 0 1 6.316 6.316 6.323 6.323 0 0 1-6.316 6.316z" fill-rule="evenodd"></path></svg>搜索&提问</a>\
                        <a href="/notifications"><svg class="Zi Zi--Profile" fill="#8590a6" viewBox="0 0 24 24" width="24" height="24"><path d="M15.417 12.923c-.376.653-.837 1.281-.763 1.863.292 2.273 5.562 1.77 6.78 3.048.566.595.566.664.566 4.164-6.611-.07-13.363 0-20 0 .027-3.5 0-3.478.62-4.164 1.303-1.44 6.581-.715 6.78-3.133.045-.545-.38-1.114-.763-1.778C6.511 9.233 5.697 2 12 2s5.422 7.443 3.417 10.923z" fill-rule="evenodd"></path></svg>通知&私信&设置</a>\
                        <a href="/er/'+g_user_id+'"><svg class="Zi Zi--Profile" fill="#8590a6" viewBox="0 0 24 24" width="24" height="24"><path d="M15.417 12.923c-.376.653-.837 1.281-.763 1.863.292 2.273 5.562 1.77 6.78 3.048.566.595.566.664.566 4.164-6.611-.07-13.363 0-20 0 .027-3.5 0-3.478.62-4.164 1.303-1.44 6.581-.715 6.78-3.133.045-.545-.38-1.114-.763-1.778C6.511 9.233 5.697 2 12 2s5.422 7.443 3.417 10.923z" fill-rule="evenodd"></path></svg>我的主页</a>\
                        <a href="/exit/"><svg class="Zi Zi--Logout" fill="#8590a6" viewBox="0 0 24 24" width="24" height="24"><path d="M2 11.999c0-2.756 1.154-5.417 3.167-7.3a1.266 1.266 0 0 1 1.73 1.847 7.396 7.396 0 0 0-2.367 5.453c0 4.119 3.35 7.47 7.47 7.47 4.119 0 7.47-3.351 7.47-7.47a7.41 7.41 0 0 0-2.279-5.37 1.266 1.266 0 0 1 1.76-1.819A9.923 9.923 0 0 1 22 12c0 5.513-4.486 10-10 10s-10-4.487-10-10zm8.699-.482V3.26a1.26 1.26 0 1 1 2.52 0v8.257a1.26 1.26 0 1 1-2.52 0z" fill-rule="evenodd"></path></svg>退出帐号</a>\
                        <div class="MobileAppHeader-expandBackdrop"></div></div></span></div></div>';
            $(".Mobile-body").addClass("MobileAppHeader-noScrollBody").append(data);
            
        }
        else if($('.MobileAppHeader-expandBtn').children('svg').hasClass('Zi--Close'))
        {
            var svg='<svg class="Zi Zi--More" fill="currentColor" viewBox="0 0 24 24" width="24" height="24"><path d="M3.5 5h16a1.5 1.5 0 0 1 0 3h-16a1.5 1.5 0 0 1 0-3zm0 6h16a1.5 1.5 0 0 1 0 3h-16a1.5 1.5 0 0 1 0-3zm0 6h16a1.5 1.5 0 0 1 0 3h-16a1.5 1.5 0 0 1 0-3z" fill-rule="evenodd"></path></svg>';
            $('.MobileAppHeader-expandBtn').empty().append(svg);
            $(".Mobile-body").removeClass("MobileAppHeader-noScrollBody");
            $(".MobileAppHeader-expandContainer").parent().remove();
            
        }
    });
}

function checkSets()
{
    checkFollow();
    checkContentExpand();
    checkContentCollapse();
    //checkContentExpand2();
    //checkContentCollapse2();
    checkPopoverShow();
    checkAnswerLike();
    checkExpandBtn();
}

function sendFileQuestion(file){
    var data=new FormData();
    data.append("imgfile",file);
    //console.log(data.get("file"));
    $.ajax({
        data:data,
        type:"POST",
        url:"/ajax/upload/img/",
        cache:false,
        contentType:false,
        processData:false,
        success:function(url){
            if("fail"!=url)
            {
                $("#summernote_question").summernote('insertImage', url, 'image name'); // the insertImage API
            }
        }
    });
}

function sendFileAnswer(file){
    var data=new FormData();
    data.append("imgfile",file);
    //console.log(data.get("file"));
    $.ajax({
        data:data,
        type:"POST",
        url:"/ajax/upload/img/",
        cache:false,
        contentType:false,
        processData:false,
        success:function(url){
            if("fail"!=url)
            {
                $("#summernote_answer").summernote('insertImage', url, 'image name'); // the insertImage API
            }
        }
    });
}

function submitAnswer()
{
    var url="/ajax/question_answer/"+g_question_id+"/";//$(".AnswerToolbar").attr("data-question-answer-url");
    var content=$('#summernote_answer').summernote('code');
    var data=new FormData();
    data.append("content",content);
    $.ajax({
        data:data,
        type:"POST",
        url:url,
        cache:false,
        contentType:false,
        processData:false,
        success:function(ret){
            if("fail"!=ret)
            {
                appendMoreAnswerListElement(ret);
                hideAnswerToolbar();                
                checkSets();
            }
        }
    });
}

function showAnswerToolbar()
{
    $(".AnswerToolbar").removeClass("is-hide");
}

function hideAnswerToolbar()
{
    $(".AnswerToolbar").addClass("is-hide");
}
function sendLetter2()
{
    var value=$("#letterText2").val();
    var er_id=$("#letterText2").attr("data-receiver-id");
    console.log(value);
    $.post("/ajax/send_message/"+er_id+"/",{"content":value},function(ret){
        if("fail"!=ret)
        {
            var message_id=ret;
            pushOneConversationMessagesElement(message_id);
        }
    });
}
function sendLetter()
{
    var value=$("#letterText").val();
    var er_id=$(".Messages-receiverInfo").attr("data-receiver-id");
    console.log(value);
    //$("#letterModal").modal("hide");
    $('#letterModal').modal('toggle');
    $.post("/ajax/send_message/"+er_id+"/",{"content":value},function(ret){
        if("fail"!=ret)
        {
            console.log(ret);
        }
    });
}
function setLetterReceiver(id,name)
{
    $(".Messages-receiverInfo").attr("data-receiver-id",id);
    $(".Messages-receiverInfo").text(name);
}

function appendLetterModal()
{
    var data='<div class="modal fade" id="letterModal" tabindex="0" role="dialog" aria-labelledby="letterModalLabel" aria-hidden="true">\
        <div class="modal-dialog lettermodal">\
        <div class="Modal-inner">\
        <h3 class="Modal-title">发送私信</h3>\
        <div class="Modal-content">\
        <div class="Messages-newDialog">\
        <div class="Messages-receiver">\
        <span class="Messages-receiverInfo" data-receiver-id="">who</span>\
        </div>\
        <div class="Messages-sendContent Input-wrapper Input-wrapper--spread Input-wrapper--multiline">\
        <textarea id="letterText" rows="5" class="Input" placeholder="私信内容"></textarea>\
        </div>\
        <span class="Messages-warning"></span>\
        <div class="ModalButtonGroup ModalButtonGroup--vertical">\
        <button class="Button Messages-sendButton Button--primary Button--blue" type="button" onclick="sendLetter()">发送</button>\
        </div>\
        </div>\
        </div>\
        </div>\
        <button class="Button Modal-closeButton Button--plain" data-dismiss="modal" aria-label="关闭" type="button"><svg class="Zi Zi--Close Modal-closeIcon" fill="currentColor" viewBox="0 0 24 24" width="24" height="24"><path d="M13.486 12l5.208-5.207a1.048 1.048 0 0 0-.006-1.483 1.046 1.046 0 0 0-1.482-.005L12 10.514 6.793 5.305a1.048 1.048 0 0 0-1.483.005 1.046 1.046 0 0 0-.005 1.483L10.514 12l-5.208 5.207a1.048 1.048 0 0 0 .006 1.483 1.046 1.046 0 0 0 1.482.005L12 13.486l5.207 5.208a1.048 1.048 0 0 0 1.483-.006 1.046 1.046 0 0 0 .005-1.482L13.486 12z" fill-rule="evenodd"></path></svg></button>\
        </div>\
        </div>\
        ';

    $("body").append(data);
    
    $("#letterModal").on("show.bs.modal", function(){
        $(".PeoplePopover").popover("hide");
    });
}

function appendMessageElement(ret)
{
    var user_id=$("#MenuPopover").attr("data-er-id");
    $(".Messages-list").empty();
    for (i in ret)
    {
        var conversation_id=ret[i][0];
        var conversation_delete_id=ret[i][1];
        var conversation_update=ret[i][2].split('.')[0];
        var er_id=ret[i][3];
        var er_name=ret[i][4];
        var er_avatar=ret[i][5];
        var message_content=ret[i][6];
        
        if (conversation_delete_id==user_id) //user have delete this message
            continue;
        var data='<a href="/conversations/?i='+conversation_id+'" class="Messages-item Messages-followItem"><span class="UserLink"><img class="Avatar Avatar--medium UserLink-avatar" width="40" height="40" src="'+er_avatar+'" srcset="'+er_avatar+'" alt="'+er_name+'"></span><div class="Messages-user"><div class="Messages-userName"><span class="UserLink">'+er_name+'</span></div><div class="Messages-itemContent">'+message_content+'</div></div></a>';
        $(".Messages-list").append(data);
    }
}

function appendNotificationElement(ret)
{
    $(".PushNotifications-list").empty();
    for (i in ret)
    {
        var notification_id=ret[i][0];
        var notification_type=ret[i][1];
        var notification_active_id=ret[i][2];
        var notification_status=ret[i][3];
        var notification_pub_date=ret[i][4];
        var notification_sender_id=ret[i][5];
        var notification_sender_first_name=ret[i][6];
        
        if("invite"==notification_type)
        {
            var question_title=ret[i][7];
            var data='<div class="PushNotifications-item"><span><span><span class="UserLink"><a class="UserLink-link" href="/er/'+notification_sender_id+'">'+notification_sender_first_name+'</a></span></span></span><span> 邀请你回答 </span><span><a href="/question/'+notification_active_id+'">'+question_title+'</a></span></div>';
        }
        $(".PushNotifications-list").append(data);
    }
}

function appendSearchElement(ret,keyword)
{
//<div class="AutoComplete-group"><div class="SearchBar-label">用户</div><div class="Menu-item" role="option"><div data-za-module="TopNavBar"><div data-za-module="SearchResultList"><div data-za-detail-view-path-module="UserItem"><a class="SearchBar-peopleResult" data-za-not-track-link="true" href="/people/fang-jie-9-6-38" target="_blank"><div class="AuthorInfo" itemprop="author" itemscope="" itemtype="http://schema.org/Person"><meta itemprop="name" content="房价"><meta itemprop="image" content="https://pic2.zhimg.com/66162bae6d34b7b0c5a454cd93e90769_s.jpg"><meta itemprop="url" content="https://www.zhihu.com/people/fang-jie-9-6-38"><meta itemprop="zhihu:followerCount"><span class="UserLink AuthorInfo-avatarWrapper"><img class="Avatar Avatar--medium AuthorInfo-avatar" width="40" height="40" src="https://pic2.zhimg.com/66162bae6d34b7b0c5a454cd93e90769_xs.jpg" srcset="https://pic2.zhimg.com/66162bae6d34b7b0c5a454cd93e90769_l.jpg 2x" alt="房价"></span><div class="AuthorInfo-content"><div class="AuthorInfo-head"><span class="UserLink AuthorInfo-name">房价</span></div><div class="AuthorInfo-detail"><div class="AuthorInfo-badge"></div></div></div></div></a></div></div></div></div><div class="Menu-item" role="option"><div data-za-module="TopNavBar"><div data-za-module="SearchResultList"><div data-za-detail-view-path-module="UserItem" data-za-detail-view-path-index="1"><a class="SearchBar-peopleResult" data-za-not-track-link="true" href="/people/fang-jie-40-53" target="_blank"><div class="AuthorInfo" itemprop="author" itemscope="" itemtype="http://schema.org/Person"><meta itemprop="name" content="房价"><meta itemprop="image" content="https://pic4.zhimg.com/da8e974dc_s.jpg"><meta itemprop="url" content="https://www.zhihu.com/people/fang-jie-40-53"><meta itemprop="zhihu:followerCount"><span class="UserLink AuthorInfo-avatarWrapper"><img class="Avatar Avatar--medium AuthorInfo-avatar" width="40" height="40" src="https://pic4.zhimg.com/da8e974dc_xs.jpg" srcset="https://pic4.zhimg.com/da8e974dc_l.jpg 2x" alt="房价"></span><div class="AuthorInfo-content"><div class="AuthorInfo-head"><span class="UserLink AuthorInfo-name">房价</span></div><div class="AuthorInfo-detail"><div class="AuthorInfo-badge"><div class="RichText AuthorInfo-badgeText">经济学在读</div></div></div></div></div></a></div></div></div></div><div class="Menu-item" role="option"><div data-za-module="TopNavBar"><div data-za-module="SearchResultList"><div data-za-detail-view-path-module="UserItem" data-za-detail-view-path-index="2"><a class="SearchBar-peopleResult" data-za-not-track-link="true" href="/people/nu-wang-da-ren-ni-hao" target="_blank"><div class="AuthorInfo" itemprop="author" itemscope="" itemtype="http://schema.org/Person"><meta itemprop="name" content="高是房价太高的高"><meta itemprop="image" content="https://pic2.zhimg.com/v2-2b47db6a78c66355ca13c88909004fcb_s.jpg"><meta itemprop="url" content="https://www.zhihu.com/people/nu-wang-da-ren-ni-hao"><meta itemprop="zhihu:followerCount"><span class="UserLink AuthorInfo-avatarWrapper"><img class="Avatar Avatar--medium AuthorInfo-avatar" width="40" height="40" src="https://pic2.zhimg.com/v2-2b47db6a78c66355ca13c88909004fcb_xs.jpg" srcset="https://pic2.zhimg.com/v2-2b47db6a78c66355ca13c88909004fcb_l.jpg 2x" alt="高是房价太高的高"></span><div class="AuthorInfo-content"><div class="AuthorInfo-head"><span class="UserLink AuthorInfo-name">高是房价太高的高</span></div><div class="AuthorInfo-detail"><div class="AuthorInfo-badge"><div class="RichText AuthorInfo-badgeText">举杯邀明月   对影成三人</div></div></div></div></div></a></div></div></div></div></div>\
//<div class="AutoComplete-group"><div class="SearchBar-label">话题</div><div class="Menu-item" role="option"><div data-za-module="TopNavBar"><div data-za-module="SearchResultList"><div data-za-detail-view-path-module="TopicItem"><a class="SearchBar-topicResult" data-za-not-track-link="true" href="/topic/19554569" target="_blank">房价<span class="SearchBar-topicSuffix">999 个精华回答</span></a></div></div></div></div></div>\
//<div id="IdQuestion" class="AutoComplete-group"><div class="Menu-item is-active" role="option"><div data-za-module="TopNavBar"><div data-za-module="SearchResultList"><div data-za-detail-view-path-module="QuestionItem"><a class="SearchBar-contentResult" data-za-not-track-link="true" href="/question/53369195" target="_blank">2018 年房价会涨吗？<span class="SearchBar-contentSuffix">2,188 个回答</span></a></div></div></div></div><div class="Menu-item" role="option"><div data-za-module="TopNavBar"><div data-za-module="SearchResultList"><div data-za-detail-view-path-module="PostItem" data-za-detail-view-path-index="1"><a class="SearchBar-contentResult" data-za-not-track-link="true" href="//zhuanlan.zhihu.com/p/26262058" target="_blank">一苒说：2017年，房价的拐点是不是到了？<span class="SearchBar-contentSuffix">4,774 个赞</span></a></div></div></div></div><div class="Menu-item" role="option"><div data-za-module="TopNavBar"><div data-za-module="SearchResultList"><div data-za-detail-view-path-module="QuestionItem" data-za-detail-view-path-index="2"><a class="SearchBar-contentResult" data-za-not-track-link="true" href="/question/33412557" target="_blank">深圳的高房价会导致人才流失吗？<span class="SearchBar-contentSuffix">1,021 个回答</span></a></div></div></div></div><div class="Menu-item" role="option"><div data-za-module="TopNavBar"><div data-za-module="SearchResultList"><div data-za-detail-view-path-module="QuestionItem" data-za-detail-view-path-index="3"><a class="SearchBar-contentResult" data-za-not-track-link="true" href="/question/27605852" target="_blank">2015 年全国房价会呈什么趋势？<span class="SearchBar-contentSuffix">409 个回答</span></a></div></div></div></div><div class="Menu-item" role="option"><div data-za-module="TopNavBar"><div data-za-module="SearchResultList"><div data-za-detail-view-path-module="QuestionItem" data-za-detail-view-path-index="4"><a class="SearchBar-contentResult" data-za-not-track-link="true" href="/question/22451840" target="_blank">中国人为什么买得起房子？中国房价高吗？为什么？<span class="SearchBar-contentSuffix">701 个回答</span></a></div></div></div></div></div>\
//var data='<div class="Popover-content Popover-content--bottom Popover-content--fixed Popover-content-enter Popover-content-enter-active" id="Popover-37601-45625-content" aria-labelledby="Popover-37601-45625-toggle" style="left: 212.4px; top: 43px;"><div class="Menu AutoComplete-menu SearchBar-menu" role="listbox"><div class="AutoComplete-group"><div class="Menu-item" id="AutoComplet-37601-58607-content-0" role="option"><div data-za-module="TopNavBar"><div data-za-module="SearchResultList"><div data-za-detail-view-path-module="QuestionItem" data-za-extra-module="{&quot;card&quot;:{&quot;content&quot;:{&quot;type&quot;:&quot;Question&quot;,&quot;token&quot;:&quot;53369195&quot;}}}"><a class="SearchBar-contentResult" data-za-not-track-link="true" href="/question/53369195" target="_blank"><!-- react-text: 11 -->2018 年房价会涨吗？<!-- /react-text --><span class="SearchBar-contentSuffix">2,188 个回答</span></a></div></div></div></div><div class="Menu-item" id="AutoComplet-37601-58607-content-1" role="option"><div data-za-module="TopNavBar"><div data-za-module="SearchResultList"><div data-za-detail-view-path-module="PostItem" data-za-detail-view-path-index="1" data-za-extra-module="{&quot;card&quot;:{&quot;content&quot;:{&quot;type&quot;:&quot;Post&quot;,&quot;token&quot;:&quot;26262058&quot;}}}"><a class="SearchBar-contentResult" data-za-not-track-link="true" href="//zhuanlan.zhihu.com/p/26262058" target="_blank"><!-- react-text: 18 -->一苒说：2017年，房价的拐点是不是到了？<!-- /react-text --><span class="SearchBar-contentSuffix">4,774 个赞</span></a></div></div></div></div><div class="Menu-item" id="AutoComplet-37601-58607-content-2" role="option"><div data-za-module="TopNavBar"><div data-za-module="SearchResultList"><div data-za-detail-view-path-module="QuestionItem" data-za-detail-view-path-index="2" data-za-extra-module="{&quot;card&quot;:{&quot;content&quot;:{&quot;type&quot;:&quot;Question&quot;,&quot;token&quot;:&quot;33412557&quot;}}}"><a class="SearchBar-contentResult" data-za-not-track-link="true" href="/question/33412557" target="_blank"><!-- react-text: 25 -->深圳的高房价会导致人才流失吗？<!-- /react-text --><span class="SearchBar-contentSuffix">1,021 个回答</span></a></div></div></div></div><div class="Menu-item" id="AutoComplet-37601-58607-content-3" role="option"><div data-za-module="TopNavBar"><div data-za-module="SearchResultList"><div data-za-detail-view-path-module="QuestionItem" data-za-detail-view-path-index="3" data-za-extra-module="{&quot;card&quot;:{&quot;content&quot;:{&quot;type&quot;:&quot;Question&quot;,&quot;token&quot;:&quot;27605852&quot;}}}"><a class="SearchBar-contentResult" data-za-not-track-link="true" href="/question/27605852" target="_blank"><!-- react-text: 32 -->2015 年全国房价会呈什么趋势？<!-- /react-text --><span class="SearchBar-contentSuffix">409 个回答</span></a></div></div></div></div><div class="Menu-item" id="AutoComplet-37601-58607-content-4" role="option"><div data-za-module="TopNavBar"><div data-za-module="SearchResultList"><div data-za-detail-view-path-module="QuestionItem" data-za-detail-view-path-index="4" data-za-extra-module="{&quot;card&quot;:{&quot;content&quot;:{&quot;type&quot;:&quot;Question&quot;,&quot;token&quot;:&quot;22451840&quot;}}}"><a class="SearchBar-contentResult" data-za-not-track-link="true" href="/question/22451840" target="_blank"><!-- react-text: 39 -->中国人为什么买得起房子？中国房价高吗？为什么？<!-- /react-text --><span class="SearchBar-contentSuffix">701 个回答</span></a></div></div></div></div></div><div class="AutoComplete-group"><div class="SearchBar-label">用户</div><div class="Menu-item" id="AutoComplet-37601-58607-people-0" role="option"><div data-za-module="TopNavBar"><div data-za-module="SearchResultList"><div data-za-detail-view-path-module="UserItem" data-za-extra-module="{&quot;card&quot;:{&quot;content&quot;:{&quot;type&quot;:&quot;User&quot;,&quot;member_hash_id&quot;:&quot;824eb6bfb1b90655582ef22390719cc6&quot;}}}"><a class="SearchBar-peopleResult" data-za-not-track-link="true" href="/people/fang-jie-9-6-38" target="_blank"><div class="AuthorInfo" itemprop="author" itemscope="" itemtype="http://schema.org/Person"><meta itemprop="name" content="房价"><meta itemprop="image" content="https://pic2.zhimg.com/66162bae6d34b7b0c5a454cd93e90769_s.jpg"><meta itemprop="url" content="https://www.zhihu.com/people/fang-jie-9-6-38"><meta itemprop="zhihu:followerCount"><span class="UserLink AuthorInfo-avatarWrapper"><img class="Avatar Avatar--medium AuthorInfo-avatar" width="40" height="40" src="https://pic2.zhimg.com/66162bae6d34b7b0c5a454cd93e90769_xs.jpg" srcset="https://pic2.zhimg.com/66162bae6d34b7b0c5a454cd93e90769_l.jpg 2x" alt="房价"></span><div class="AuthorInfo-content"><div class="AuthorInfo-head"><span class="UserLink AuthorInfo-name"><!-- react-text: 58 -->房价<!-- /react-text --><!-- react-empty: 59 --></span></div><div class="AuthorInfo-detail"><div class="AuthorInfo-badge"><!-- react-empty: 62 --></div></div></div></div></a></div></div></div></div><div class="Menu-item" id="AutoComplet-37601-58607-people-1" role="option"><div data-za-module="TopNavBar"><div data-za-module="SearchResultList"><div data-za-detail-view-path-module="UserItem" data-za-detail-view-path-index="1" data-za-extra-module="{&quot;card&quot;:{&quot;content&quot;:{&quot;type&quot;:&quot;User&quot;,&quot;member_hash_id&quot;:&quot;21a23a1730bd47ded60b160e700138a0&quot;}}}"><a class="SearchBar-peopleResult" data-za-not-track-link="true" href="/people/fang-jie-40-53" target="_blank"><div class="AuthorInfo" itemprop="author" itemscope="" itemtype="http://schema.org/Person"><meta itemprop="name" content="房价"><meta itemprop="image" content="https://pic4.zhimg.com/da8e974dc_s.jpg"><meta itemprop="url" content="https://www.zhihu.com/people/fang-jie-40-53"><meta itemprop="zhihu:followerCount"><span class="UserLink AuthorInfo-avatarWrapper"><img class="Avatar Avatar--medium AuthorInfo-avatar" width="40" height="40" src="https://pic4.zhimg.com/da8e974dc_xs.jpg" srcset="https://pic4.zhimg.com/da8e974dc_l.jpg 2x" alt="房价"></span><div class="AuthorInfo-content"><div class="AuthorInfo-head"><span class="UserLink AuthorInfo-name"><!-- react-text: 78 -->房价<!-- /react-text --><!-- react-empty: 79 --></span></div><div class="AuthorInfo-detail"><div class="AuthorInfo-badge"><div class="RichText AuthorInfo-badgeText">经济学在读</div></div></div></div></div></a></div></div></div></div><div class="Menu-item" id="AutoComplet-37601-58607-people-2" role="option"><div data-za-module="TopNavBar"><div data-za-module="SearchResultList"><div data-za-detail-view-path-module="UserItem" data-za-detail-view-path-index="2" data-za-extra-module="{&quot;card&quot;:{&quot;content&quot;:{&quot;type&quot;:&quot;User&quot;,&quot;member_hash_id&quot;:&quot;058a022782cecaef87c1f271c5445a75&quot;}}}"><a class="SearchBar-peopleResult" data-za-not-track-link="true" href="/people/nu-wang-da-ren-ni-hao" target="_blank"><div class="AuthorInfo" itemprop="author" itemscope="" itemtype="http://schema.org/Person"><meta itemprop="name" content="高是房价太高的高"><meta itemprop="image" content="https://pic2.zhimg.com/v2-2b47db6a78c66355ca13c88909004fcb_s.jpg"><meta itemprop="url" content="https://www.zhihu.com/people/nu-wang-da-ren-ni-hao"><meta itemprop="zhihu:followerCount"><span class="UserLink AuthorInfo-avatarWrapper"><img class="Avatar Avatar--medium AuthorInfo-avatar" width="40" height="40" src="https://pic2.zhimg.com/v2-2b47db6a78c66355ca13c88909004fcb_xs.jpg" srcset="https://pic2.zhimg.com/v2-2b47db6a78c66355ca13c88909004fcb_l.jpg 2x" alt="高是房价太高的高"></span><div class="AuthorInfo-content"><div class="AuthorInfo-head"><span class="UserLink AuthorInfo-name"><!-- react-text: 98 -->高是房价太高的高<!-- /react-text --><!-- react-empty: 99 --></span></div><div class="AuthorInfo-detail"><div class="AuthorInfo-badge"><div class="RichText AuthorInfo-badgeText">举杯邀明月   对影成三人</div></div></div></div></div></a></div></div></div></div></div><div class="AutoComplete-group"><div class="SearchBar-label">话题</div><div class="Menu-item" id="AutoComplet-37601-58607-topic-0" role="option"><div data-za-module="TopNavBar"><div data-za-module="SearchResultList"><div data-za-detail-view-path-module="TopicItem" data-za-extra-module="{&quot;card&quot;:{&quot;content&quot;:{&quot;type&quot;:&quot;Topic&quot;,&quot;token&quot;:&quot;19554569&quot;}}}"><a class="SearchBar-topicResult" data-za-not-track-link="true" href="/topic/19554569" target="_blank"><!-- react-text: 110 -->房价<!-- /react-text --><span class="SearchBar-topicSuffix"><!-- react-text: 112 -->999<!-- /react-text --><!-- react-text: 113 --> 个精华回答<!-- /react-text --></span></a></div></div></div></div></div><div class="AutoComplete-group"><div class="Menu-item" id="AutoComplet-37601-58607-searchLink-0" role="option"><div data-za-module="TopNavBar"><div data-za-module="SearchResultList"><div><a class="SearchBar-searchLink" data-za-not-track-link="true" href="/search?type=content&amp;q='+keyword+'" target="_blank">查看全部搜索结果</a></div></div></div></div></div></div></div>';
    var data='<div class="Popover-content Popover-content--bottom Popover-content--fixed Popover-content-enter Popover-content-enter-active" style="left: 212.4px; top: 43px;"><div class="Menu AutoComplete-menu SearchBar-menu" role="listbox">\
        <div id="IdQuestion" class="AutoComplete-group"></div>\
        <div class="AutoComplete-group"><div role="option"><div data-za-module="TopNavBar"><div data-za-module="SearchResultList"><div><a class="SearchBar-searchLink" data-za-not-track-link="true" href="/search?type=all&amp;q='+keyword+'" target="_blank">查看全部搜索结果</a></div></div></div></div></div>\
        </div></div>';
    $('#SearchPopover').attr("data-content",data);
    $('#SearchPopover').popover('show');
    for (var i in ret)
    {
        var question_id=ret[i][0];
        var question_title=ret[i][1];
        var question_answer_num=ret[i][2];
        var data='<div class="Menu-item" role="option"><div data-za-module="TopNavBar"><div data-za-module="SearchResultList"><div data-za-detail-view-path-module="QuestionItem"><a class="SearchBar-contentResult" data-za-not-track-link="true" href="/question/'+question_id+'" target="_blank">'+question_title+'<span class="SearchBar-contentSuffix">'+question_answer_num+' 个回答</span></a></div></div></div></div>';
        $("#IdQuestion").append(data);
    }
}
function checkSearchSelect()
{
    $(".Menu-item").off("mouseenter mouseleave");
    $(".Menu-item").on("mouseenter mouseleave",function(event){
        if(event.type=="mouseenter")
        {
            console.log(".Menu-item  enter");
            $(this).addClass("is-active");
        }
        else if(event.type=="mouseleave"){
            console.log(".Menu-item  leave");
            $(this).removeClass("is-active");
        }
    
    });
}
function checkSearchSubmit(e)
{
    console.log(e);
    if((""!=g_search_keyword)&&(""!=g_search_type))
    {
        var nums=$('.List-item').length;
        var order=1;//pub_date
        var start=nums;
        var end=start+10;
        $.post('/ajax/search/'+g_search_type+'/'+order+'/'+start+'/'+end+'/',{keyword:g_search_keyword},function(ret){
            if("fail"!=ret)
            {
                appendSearchPageElement(ret);  
                checkSets();
            }
        });
    }
}
function checkSearch(e)
{
    var keyword=$(e).val();
    g_search_keyword=keyword.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g,"");
    console.log(g_search_keyword);
    if (""!=g_search_keyword)
    {
        console.log("can search");
        $(".Icon.Icon--search").css({"fill":"#0084ff"});
    }
    else
    {
        console.log("can`t search");
        $(".Icon.Icon--search").css({"fill":"#afbdcf"});
    }
    /*
    if (keyword!="")
    {
        var type="all";
        var order=1;
        var start=0;
        var end=5;
        $.get('/ajax/search/'+keyword+'/'+type+'/'+order+'/'+start+'/'+end+'/',function(ret)
        {
            if("fail"!=ret)
            {
                appendSearchElement(ret,keyword);
                checkSearchSelect();
            }
        });
    }
    else
    {
        $('#SearchPopover').popover('hide');
    }
    */
}

$(document).click(function(e) {
    $("#NotificationPopover").popover("hide");
    $("#MessagePopover").popover("hide");
    $("#MenuPopover").popover("hide");
    $("#SearchPopover").popover("hide");
});

function initCommon()
{
    notifications="null";
    messages="null";
    $('#summernote_question').summernote({
        toolbar: [
        // [groupName, [list of button]]
        ['style', ['bold', 'italic', 'underline', 'clear']],
        ['font', ['strikethrough', 'superscript', 'subscript']],
        ['fontsize', ['fontsize']],
        ['color', ['color']],
        ['para', ['paragraph']],
        ['table', ['table']],
        ['link', ['link']],
        ['picture', ['picture']],
        ['video', ['video']],
        ['fullscreen', ['fullscreen']]
        ],
        height:120,
        lang:'zh-CN',
        placeholder:'问题背景、条件等详细信息',
        callbacks: {
            onImageUpload: function(files){
                img=sendFileQuestion(files[0]);
                console.log(img);
            }
        }
    });
    
    checkSelectOption();
}

ENABLE_SCREEN_LOG="true";//"false"
function slog(arg)
{
    if("true"==ENABLE_SCREEN_LOG)
    {
        var data='<div>'+arg+'</div>';
        $("#debug").append(data);
    }
}

STEP=5;
LOCK_SCROLL_MOREDATA="true";

function isLockScrollMoreData()
{
    console.log("now LOCK_SCROLL_MOREDATA="+LOCK_SCROLL_MOREDATA);
    return LOCK_SCROLL_MOREDATA;
}
function setLockScrollMoreData(val)
{
    LOCK_SCROLL_MOREDATA=val;
    console.log("LOCK_SCROLL_MOREDATA="+LOCK_SCROLL_MOREDATA);
}
window.onscroll = function () { 
//console.log(getScrollTop());
//console.log(getClientHeight());
//console.log(getScrollHeight());
if (getScrollTop() + getClientHeight() +10 >= getScrollHeight()) {
        if("false"==isLockScrollMoreData())
        {
            setLockScrollMoreData("true");
            setTimeout(function(){setLockScrollMoreData("false");},15*1000);
            getMoreData();
        }
    } 
}
$(document).ready(function(){
    initCommon();
    init();
});