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
    alert("yyyyyyyyyyyyyyyy");
    return false;
}

$('#topics_select').on('show.bs.select', function (e) {
  // do something...
  $.post("/ajax/topics/", function(ret){
  $('#topics_select').empty();
  for (var i in ret)
  {
    $('#topics_select').append("<option value=" + ret[i][0] + ":" + ret[i][1] + ">" + ret[i][1] + "</option>");
  }
    
  $('.selectpicker').selectpicker('refresh');
  
  })

});

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
    return content.replace(imgReg,"").replace(/<[^>]+>/g,"").replace(/&nbsp;/ig,"").substr(0,150);
    //return content.replace(imgReg,"").replace(/<p>/gi,"").replace(/<\/p>/gi,"").replace(/(^\s*)|(\s*$)/g,"");
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
    if("true"==button.attr("data-followed"))
    {
        $.post("/ajax/er_follow/0/"+er_id+"/",function(ret){
            button.removeClass("Button--grey").addClass("Button--green").text("关注");
            button.attr("data-followed","false");
            updateValue("people-followed",ret);
        }); 
    }
    else
    {
        $.post("/ajax/er_follow/1/"+er_id+"/",function(ret){
            button.removeClass("Button--green").addClass("Button--grey").text("已关注");
            button.attr("data-followed","true");
            updateValue("people-followed",ret);
        });  
    }
} 

function followTopic(button){
    var topic_id=button.attr("data-topic-id");
    if("true"==button.attr("data-followed"))
    {
        $.post("/ajax/topic_follow/0/"+topic_id+"/",function(ret){
            button.removeClass("Button--grey").addClass("Button--green").text("关注");
            button.attr("data-followed","false");
            updateValue("topic-followed",ret);
        }); 
    }
    else
    {
        $.post("/ajax/topic_follow/1/"+topic_id+"/",function(ret){
            button.removeClass("Button--green").addClass("Button--grey").text("已关注");
            button.attr("data-followed","true");
            update_value("topic-followed",ret);
        });  
    }
} 

function followQuestion(button){
    var question_id=button.attr("data-question-id");
    if("true"==button.attr("data-followed"))
    {
        $.post("/ajax/question_follow/0/"+question_id+"/",function(ret){
            button.removeClass("Button--grey").addClass("Button--green").text("关注");
            button.attr("data-followed","false");
            updateValue("question-followed",ret);
        }); 
    }
    else
    {
        $.post("/ajax/question_follow/1/"+question_id+"/",function(ret){
            button.removeClass("Button--green").addClass("Button--grey").text("已关注");
            button.attr("data-followed","true");
            updateValue("question-followed",ret);
        });  
    }
}  

function checkFollow()
{
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
    $(".ContentItem-less.NC-RichContent-type1").off("click");
    $(".ContentItem-less.NC-RichContent-type1").each(function(){
        $(this).click(function(){
            $(this).addClass("is-hide");
            $(this).parent().siblings(".RichContent-inner").children(".less").removeClass("is-hide");
            $(this).parent().siblings(".RichContent-inner").children(".more").addClass("is-hide");
            $(this).parent().siblings(".RichContent-inner").children(".ContentItem-more.NC-RichContent-type1").removeClass("is-hide");
            $(this).parents(".RichContent").addClass("is-collapsed");
            var index_img_url=$(this).parent().siblings(".RichContent-cover").find(".RichContent-cover-inner").attr("data-index-img-url");
            if("null"!=index_img_url)
            {
                $(this).parent().siblings(".RichContent-cover").find(".RichContent-cover-inner").empty();
                $(this).parent().siblings(".RichContent-cover").find(".RichContent-cover-inner").append('<img src="'+index_img_url+'">');
                $(this).parent().siblings(".RichContent-cover").removeClass("is-hide");
            }
        });
    });
}

function checkContentExpand(){
    $(".RichContent-inner").off("click");
    $(".RichContent-inner").each(function(){
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
            console.log("checkContentExpand");
            $(this).children(".less").addClass("is-hide");
            $(this).children(".more").removeClass("is-hide");
            $(this).children(".ContentItem-more.NC-RichContent-type1").addClass("is-hide");
            $(this).siblings(".ContentItem-actions").children(".ContentItem-less.NC-RichContent-type1").removeClass("is-hide");
            $(this).parent().removeClass("is-collapsed");
            $(this).siblings(".RichContent-cover").addClass("is-hide");
        });
    });
}

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
    $(".RichContent-inner").off("click");
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

function checkAnswerLike(){
    $(".AnswerLike").off("click");
    $(".AnswerLike").each(function(){
        $(this).click(function(){
            var element=$(this);
            answer_id=$(this).attr("data-answer-id");
            $.get("/ajax/answer_like/"+answer_id+"/",function(ret){
                element.text(ret);
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
                    er_id=ret[0];
                    er_name=ret[1];
                    er_avatar=ret[2];
                    er_mood=ret[3];
                    er_answer_nums=ret[4];
                    er_follower_nums=ret[5];
                    er_followed=ret[6];
                    
                    var data1='<div><div class="HoverCard-titleContainer HoverCard-titleContainer--noAvatar"><img class="Avatar Avatar--large HoverCard-avatar" width="68" height="68" src="'+er_avatar+'" srcset="'+er_avatar+'"><div class="HoverCard-titleText"><div class="HoverCard-title"><span><a href="/er/'+er_id+'">'+er_name+'</a></span></div><div class="HoverCard-subtitle"><span class="RichText">'+er_mood+'</span></div></div></div></div><div class="HoverCard-item"><div class="NumberBoard"><a class="Button NumberBoard-item Button--plain" type="button" href="/er/'+er_id+'/answers"><div class="NumberBoard-name">回答</div><div class="NumberBoard-value">'+er_answer_nums+'</div></a><a class="Button NumberBoard-item Button--plain" type="button" href="/er/'+er_id+'/posts"><div class="NumberBoard-name">文章</div><div class="NumberBoard-value">0</div></a><a class="Button NumberBoard-item Button--plain" type="button" href="/er/'+er_id+'/followers"><div class="NumberBoard-name">关注者</div><div class="NumberBoard-value" data-update-value-type="people-followed">'+er_follower_nums+'</div></a></div>';
                    if(er_followed)
                        var data2='<div class="MemberButtonGroup ProfileButtonGroup HoverCard-buttons"><button class="Button FollowButton Button--primary Button--grey" type="button" data-er-id="'+er_id+'" data-follow-type="people" data-followed="true">已关注</button><button class="Button" type="button" data-toggle="modal" data-target="#letterModal"><svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" class="Icon Button-icon Icon--comments" width="15" height="16" aria-hidden="true" style="height: 16px; width: 15px;"><title></title><g><g>     <path d="M9 0C3.394 0 0 4.13 0 8c0 1.654.522 3.763 2.014 5.566.314.292.518.82.454 1.17-.165 1.488-.842 1.905-.842 1.905-.328.332.105.67.588.582 1.112-.2 2.07-.58 3.526-1.122.4-.202.464-.147.78-.078C11.524 17.764 18 14 18 8c0-3.665-3.43-8-9-8z"></path>     <path d="M19.14 9.628c.758.988.86 2.01.86 3.15 0 1.195-.62 3.11-1.368 3.938-.21.23-.354.467-.308.722.12 1.073.614 1.5.614 1.5.237.24-.188.563-.537.5-.802-.145-1.494-.42-2.545-.81-.29-.146-.336-.106-.563-.057-2.043.712-4.398.476-6.083-.926 5.964-.524 8.726-3.03 9.93-8.016z"></path>   </g></g></svg><span>发私信</span></button></div></div>';
                    else
                        var data2='<div class="MemberButtonGroup ProfileButtonGroup HoverCard-buttons"><button class="Button FollowButton Button--primary Button--green" type="button" data-er-id="'+er_id+'" data-follow-type="people" data-followed="false">关注</button><button class="Button" type="button" data-toggle="modal" data-target="#letterModal"><svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" class="Icon Button-icon Icon--comments" width="15" height="16" aria-hidden="true" style="height: 16px; width: 15px;"><title></title><g><g>     <path d="M9 0C3.394 0 0 4.13 0 8c0 1.654.522 3.763 2.014 5.566.314.292.518.82.454 1.17-.165 1.488-.842 1.905-.842 1.905-.328.332.105.67.588.582 1.112-.2 2.07-.58 3.526-1.122.4-.202.464-.147.78-.078C11.524 17.764 18 14 18 8c0-3.665-3.43-8-9-8z"></path>     <path d="M19.14 9.628c.758.988.86 2.01.86 3.15 0 1.195-.62 3.11-1.368 3.938-.21.23-.354.467-.308.722.12 1.073.614 1.5.614 1.5.237.24-.188.563-.537.5-.802-.145-1.494-.42-2.545-.81-.29-.146-.336-.106-.563-.057-2.043.712-4.398.476-6.083-.926 5.964-.524 8.726-3.03 9.93-8.016z"></path>   </g></g></svg><span>发私信</span></button></div></div>';
                    var data=data1+data2;
                    element.attr("data-content",data);
                    element.popover('show');                    
                    setLetterReceiver(er_id,er_name);
                    checkFollow(); 
                    $(".popover").on("mouseleave",function(){
                        element.popover('hide'); 
                    });
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

    /*
    $('.PeoplePopover').each(function(){
            $(this).parent().hover(function(){
                var element=$(this).children(".PeoplePopover");
                var author_id=element.attr("data-author-id");
                console.log("popover");
                $.get("/ajax/er/"+author_id+"/",function(ret){
                    er_id=ret[0];
                    er_name=ret[1];
                    er_avatar=ret[2];
                    er_mood=ret[3];
                    er_answer_nums=ret[4];
                    er_follower_nums=ret[5];
                    er_followed=ret[6];
                    
                    var data1='<div><div class="HoverCard-titleContainer HoverCard-titleContainer--noAvatar"><img class="Avatar Avatar--large HoverCard-avatar" width="68" height="68" src="'+er_avatar+'" srcset="'+er_avatar+'"><div class="HoverCard-titleText"><div class="HoverCard-title"><span><a href="/er/'+er_id+'">'+er_name+'</a></span></div><div class="HoverCard-subtitle"><span class="RichText">'+er_mood+'</span></div></div></div></div><div class="HoverCard-item"><div class="NumberBoard"><a class="Button NumberBoard-item Button--plain" type="button" href="/er/'+er_id+'/answers"><div class="NumberBoard-name">回答</div><div class="NumberBoard-value">'+er_answer_nums+'</div></a><a class="Button NumberBoard-item Button--plain" type="button" href="/er/'+er_id+'/posts"><div class="NumberBoard-name">文章</div><div class="NumberBoard-value">0</div></a><a class="Button NumberBoard-item Button--plain" type="button" href="/er/'+er_id+'/followers"><div class="NumberBoard-name">关注者</div><div class="NumberBoard-value" data-update-value-type="people-followed">'+er_follower_nums+'</div></a></div>';
                    if(er_followed)
                        var data2='<div class="MemberButtonGroup ProfileButtonGroup HoverCard-buttons"><button class="Button FollowButton Button--primary Button--grey" type="button" data-er-id="'+er_id+'" data-follow-type="people" data-followed="true">已关注</button><button class="Button" type="button" data-toggle="modal" data-target="#letterModal"><svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" class="Icon Button-icon Icon--comments" width="15" height="16" aria-hidden="true" style="height: 16px; width: 15px;"><title></title><g><g>     <path d="M9 0C3.394 0 0 4.13 0 8c0 1.654.522 3.763 2.014 5.566.314.292.518.82.454 1.17-.165 1.488-.842 1.905-.842 1.905-.328.332.105.67.588.582 1.112-.2 2.07-.58 3.526-1.122.4-.202.464-.147.78-.078C11.524 17.764 18 14 18 8c0-3.665-3.43-8-9-8z"></path>     <path d="M19.14 9.628c.758.988.86 2.01.86 3.15 0 1.195-.62 3.11-1.368 3.938-.21.23-.354.467-.308.722.12 1.073.614 1.5.614 1.5.237.24-.188.563-.537.5-.802-.145-1.494-.42-2.545-.81-.29-.146-.336-.106-.563-.057-2.043.712-4.398.476-6.083-.926 5.964-.524 8.726-3.03 9.93-8.016z"></path>   </g></g></svg><span>发私信</span></button></div></div>';
                    else
                        var data2='<div class="MemberButtonGroup ProfileButtonGroup HoverCard-buttons"><button class="Button FollowButton Button--primary Button--green" type="button" data-er-id="'+er_id+'" data-follow-type="people" data-followed="false">关注</button><button class="Button" type="button" data-toggle="modal" data-target="#letterModal"><svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" class="Icon Button-icon Icon--comments" width="15" height="16" aria-hidden="true" style="height: 16px; width: 15px;"><title></title><g><g>     <path d="M9 0C3.394 0 0 4.13 0 8c0 1.654.522 3.763 2.014 5.566.314.292.518.82.454 1.17-.165 1.488-.842 1.905-.842 1.905-.328.332.105.67.588.582 1.112-.2 2.07-.58 3.526-1.122.4-.202.464-.147.78-.078C11.524 17.764 18 14 18 8c0-3.665-3.43-8-9-8z"></path>     <path d="M19.14 9.628c.758.988.86 2.01.86 3.15 0 1.195-.62 3.11-1.368 3.938-.21.23-.354.467-.308.722.12 1.073.614 1.5.614 1.5.237.24-.188.563-.537.5-.802-.145-1.494-.42-2.545-.81-.29-.146-.336-.106-.563-.057-2.043.712-4.398.476-6.083-.926 5.964-.524 8.726-3.03 9.93-8.016z"></path>   </g></g></svg><span>发私信</span></button></div></div>';
                    var data=data1+data2;
                    element.attr("data-content",data);
                    element.popover('show'); 
                    setLetterReceiver(er_id,er_name);
                    checkFollow();                     
                    //element.siblings(".popover").attr("in",true);
                    //element.siblings(".popover").children().attr("in",true);
                });
            },function(){
                    $(this).children(".PeoplePopover").popover('hide');
            });
    });
    */
    $('.TopicPopover').off("mouseenter mouseleave");
    $('.TopicPopover').on("mouseenter mouseleave",function(event){
        if(event.type=="mouseenter")
        {
                console.log("TopicPopover show");
                var element=$(this);//.children(".TopicPopover");
                var topic_id=element.attr("data-topic-id");
                $.get("/ajax/topic/"+topic_id+"/",function(ret){
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
    /*
    $('.TopicPopover').each(function(){
            $(this).parent().hover(function(){
                console.log("TopicPopover show");
                var element=$(this).children(".TopicPopover");
                var topic_id=element.attr("data-topic-id");
                $.get("/ajax/topic/"+topic_id+"/",function(ret){
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
                });
            },function(){
                    console.log("TopicPopover hide");
                    $(this).children(".TopicPopover").popover('hide');
            });
    });
    */
    $('#NotificationPopover').off("click");
    $('#NotificationPopover').click(function(e){
        console.log("NotificationPopover click");
        $("#MessagePopover").popover("hide");
        $("#MenuPopover").popover("hide");
        e.stopPropagation();
        //var data='<div class="Menu PushNotifications-menu"><div class="PushNotifications-content"><div class="PushNotifications-header" role="tablist"><button class="Button PushNotifications-tab Button--plain" role="tab" aria-controls="PushNotifications-default" aria-label="消息" type="button"><svg viewBox="0 0 20 15" class="Icon PushNotifications-tabIcon PushNotifications-selectedTabIcon Icon--lastNews" width="20" height="16" aria-hidden="true" style="height: 16px; width: 20px;"><title></title><g><path d="M6.493 6C5.668 6 5 6.666 5 7.5 5 8.328 5.664 9 6.493 9h12.014C19.332 9 20 8.334 20 7.5c0-.828-.664-1.5-1.493-1.5H6.493zm0 6C5.668 12 5 12.666 5 13.5c0 .828.664 1.5 1.493 1.5h12.014c.825 0 1.493-.666 1.493-1.5 0-.828-.664-1.5-1.493-1.5H6.493zM1.5 0C.672 0 0 .666 0 1.5 0 2.328.666 3 1.5 3 2.328 3 3 2.334 3 1.5 3 .672 2.334 0 1.5 0zm0 6C.672 6 0 6.666 0 7.5 0 8.328.666 9 1.5 9 2.328 9 3 8.334 3 7.5 3 6.672 2.334 6 1.5 6zm0 6c-.828 0-1.5.666-1.5 1.5 0 .828.666 1.5 1.5 1.5.828 0 1.5-.666 1.5-1.5 0-.828-.666-1.5-1.5-1.5zM6.493 0C5.668 0 5 .666 5 1.5 5 2.328 5.664 3 6.493 3h12.014C19.332 3 20 2.334 20 1.5c0-.828-.664-1.5-1.493-1.5H6.493z"></path></g></svg></button><button class="Button PushNotifications-tab Button--plain" role="tab" aria-controls="PushNotifications-follow" aria-label="用户" type="button"><svg viewBox="0 0 24 17" class="Icon PushNotifications-tabIcon Icon--userNews" width="20" height="16" aria-hidden="true" style="height: 16px; width: 20px;"><title></title><g><path d="M9.464 7.705c-.265.46-.59.904-.538 1.315.206 1.603 3.205 1.92 4.087 2.99.643.783.91 1.97.972 3.96.01.32 0 1.03-.946 1.03H1.02c-1 0-1.01-.683-1-.995.068-1.994.318-3.208.976-3.994.886-1.056 4.084-1.345 4.224-3.05.032-.385-.268-.786-.538-1.255C3.182 5.102 2.608 0 7.054 0s3.824 5.25 2.41 7.705zM18.27 8.545c.963.126 2.924-.574 2.924-.574-.664-.68-.815-1.472-1.294-4.586C19.507.27 16.8.3 16.597.3c-.203 0-2.91-.03-3.297 3.084-.485 3.113-.636 3.907-1.3 4.586 0 0 1.96.7 2.923.575l-.003.68c-.494.542-1.79.725-2.376 1.077 2.796.316 2.954 3.696 2.954 6.678 1.475-.002 6.497.02 7.5.02 1.002 0 .996-.674.986-.976-.06-1.8-.28-2.786-.418-3.434-.416-1.976-3.58-1.488-5.292-3.364l-.003-.68z"></path></g></svg></button><button class="Button PushNotifications-tab Button--plain" role="tab" aria-controls="PushNotifications-vote-thank" aria-label="赞同和感谢" type="button"><div><svg viewBox="0 0 20 18" class="Icon PushNotifications-tabIcon Icon--thankNews" width="20" height="16" aria-hidden="true" style="height: 16px; width: 20px;"><title></title><g><path d="M0,5.43706401 C5.73656627e-08,2.50510671 2.2938809,0.094365083 5.20737357,1.60732864e-07 C7.2427157,-0.000505078569 9.0922816,1.19013727 9.9999282,3 C10.8228521,1.24236064 12.6486957,1.60732867e-07 14.6514359,1.60732864e-07 C17.5445125,1.60732867e-07 19.9999282,2.50715387 19.9999282,5.43242499 C19.9999282,13.2399998 11.8420757,18 9.99997552,18 C8.15785253,18 -1.52669543e-07,13.2399998 0,5.43706401 Z"></path></g></svg></div></button></div><div class="PushNotifications-list"></div><div class="Notifications-footer"><a class="Button Button--plain" href="/settings/notification" type="button"><svg viewBox="0 0 20 20" class="Icon Button-icon Icon--setting" width="14" height="16" aria-hidden="true" style="height: 16px; width: 14px;"><title></title><g><path d="M18.868 15.185c-.164.096-.315.137-.452.137-.123 0-1.397-.26-1.617-.233-1.355.013-1.782 1.275-1.836 1.74-.055.454 0 .893.19 1.304.138.29.125.577-.067.85-.863.893-2.165 1.016-2.357 1.016-.123 0-.247-.055-.356-.15-.11-.097-.685-1.14-1.07-1.47-1.303-.954-2.246-.328-2.63 0-.397.33-.67.7-.835 1.126-.07.18-.18.302-.33.37-1.354.426-2.918-.92-3.014-1.056-.082-.11-.123-.22-.123-.356-.014-.138.383-1.276.342-1.688-.342-1.9-1.836-1.687-2.096-1.673-.303.014-.604.068-.92.178-.205.056-.396.03-.588-.054-.888-.462-1.137-2.332-1.11-2.51.055-.315.192-.52.438-.604.425-.164.81-.452 1.15-.85.932-1.262.344-2.25 0-2.634-.34-.356-.725-.645-1.15-.81-.137-.04-.233-.15-.328-.315C-.27 6.07.724 4.95.978 4.733c.255-.22.6-.055.723 0 .426.164.878.22 1.344.15C4.7 4.636 4.784 3.14 4.81 2.908c.015-.247-.11-1.29-.136-1.4-.027-.123-.014-.22.027-.315C5.318.178 7.073 0 7.223 0c.178 0 .33.055.44.178.108.124.63 1.11 1 1.4.398.338 1.582.83 2.588.013.398-.273.96-1.288 1.083-1.412.123-.123.26-.178.384-.178 1.56 0 2.33 1.03 2.438 1.22.083.124.096.248.07.37-.03.152-.33 1.153-.262 1.606.366 1.537 1.384 1.742 1.89 1.783.494.027 1.645-.357 1.81-.344.164.014.315.083.424.206.535.31.85 1.715.905 2.14.027.233-.014.44-.11.562-.11.138-1.165.714-1.48 1.112-.855.982-.342 2.25-.068 2.606.26.37 1.22.905 1.288.96.15.137.26.302.315.494.146 1.413-.89 2.387-1.07 2.47zm-8.905-.535c.644 0 1.246-.123 1.822-.356.575-.248 1.082-.59 1.493-1.016.425-.425.754-.92 1-1.495.247-.562.357-1.18.357-1.81 0-.66-.11-1.262-.356-1.825-.248-.562-.577-1.056-1.002-1.48-.41-.427-.918-.756-1.493-1.003-.576-.233-1.178-.357-1.822-.357-.644 0-1.247.124-1.81.357-.56.247-1.067.576-1.478 1.002-.425.425-.768.92-1 1.48-.247.564-.37 1.167-.37 1.826 0 .644.123 1.248.37 1.81.232.563.575 1.07 1 1.495.424.426.917.768 1.48 1.016.56.233 1.164.356 1.808.356z"></path></g></svg>设置</a><a class="Button Button--plain" href="/notifications" type="button">查看全部提醒</a></div></div></div>';
        var data='<div class="Menu PushNotifications-menu"><div class="PushNotifications-content"><div class="PushNotifications-header" role="tablist"><button class="Button PushNotifications-tab PushNotifications-tab-active Button--plain" type="button">我的提醒</button></div><div class="PushNotifications-list"></div><div class="Notifications-footer"><a class="Button Button--plain" href="/settings/notification" type="button"><svg viewBox="0 0 20 20" class="Icon Button-icon Icon--setting" width="14" height="16" aria-hidden="true" style="height: 16px; width: 14px;"><title></title><g><path d="M18.868 15.185c-.164.096-.315.137-.452.137-.123 0-1.397-.26-1.617-.233-1.355.013-1.782 1.275-1.836 1.74-.055.454 0 .893.19 1.304.138.29.125.577-.067.85-.863.893-2.165 1.016-2.357 1.016-.123 0-.247-.055-.356-.15-.11-.097-.685-1.14-1.07-1.47-1.303-.954-2.246-.328-2.63 0-.397.33-.67.7-.835 1.126-.07.18-.18.302-.33.37-1.354.426-2.918-.92-3.014-1.056-.082-.11-.123-.22-.123-.356-.014-.138.383-1.276.342-1.688-.342-1.9-1.836-1.687-2.096-1.673-.303.014-.604.068-.92.178-.205.056-.396.03-.588-.054-.888-.462-1.137-2.332-1.11-2.51.055-.315.192-.52.438-.604.425-.164.81-.452 1.15-.85.932-1.262.344-2.25 0-2.634-.34-.356-.725-.645-1.15-.81-.137-.04-.233-.15-.328-.315C-.27 6.07.724 4.95.978 4.733c.255-.22.6-.055.723 0 .426.164.878.22 1.344.15C4.7 4.636 4.784 3.14 4.81 2.908c.015-.247-.11-1.29-.136-1.4-.027-.123-.014-.22.027-.315C5.318.178 7.073 0 7.223 0c.178 0 .33.055.44.178.108.124.63 1.11 1 1.4.398.338 1.582.83 2.588.013.398-.273.96-1.288 1.083-1.412.123-.123.26-.178.384-.178 1.56 0 2.33 1.03 2.438 1.22.083.124.096.248.07.37-.03.152-.33 1.153-.262 1.606.366 1.537 1.384 1.742 1.89 1.783.494.027 1.645-.357 1.81-.344.164.014.315.083.424.206.535.31.85 1.715.905 2.14.027.233-.014.44-.11.562-.11.138-1.165.714-1.48 1.112-.855.982-.342 2.25-.068 2.606.26.37 1.22.905 1.288.96.15.137.26.302.315.494.146 1.413-.89 2.387-1.07 2.47zm-8.905-.535c.644 0 1.246-.123 1.822-.356.575-.248 1.082-.59 1.493-1.016.425-.425.754-.92 1-1.495.247-.562.357-1.18.357-1.81 0-.66-.11-1.262-.356-1.825-.248-.562-.577-1.056-1.002-1.48-.41-.427-.918-.756-1.493-1.003-.576-.233-1.178-.357-1.822-.357-.644 0-1.247.124-1.81.357-.56.247-1.067.576-1.478 1.002-.425.425-.768.92-1 1.48-.247.564-.37 1.167-.37 1.826 0 .644.123 1.248.37 1.81.232.563.575 1.07 1 1.495.424.426.917.768 1.48 1.016.56.233 1.164.356 1.808.356z"></path></g></svg>设置</a><a class="Button Button--plain" href="/notifications" type="button">查看全部提醒</a></div></div></div>';
        $('#NotificationPopover').attr("data-content",data);
        $('#NotificationPopover').popover('show');
        if("null"==notifications)
        {
            $.get("/ajax/notifications/",function(ret){
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
            $.get("/ajax/notifications/",function(ret){
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
        var data='<div class="Menu Messages-menu"><div class="Messages-content"><div class="Messages-header" role="tablist"><button class="Button Messages-tab Messages-myMessageTab Button--plain" type="button">我的私信</button></div><div class="Messages-list"><div></div></div><div class="Messages-footer"><a class="Button Button--plain" href="/conversation/" type="button">查看全部私信</a></div></div></div>';
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
        <a class="Button Menu-item AppHeaderProfileMenu-item Button--plain" href="/settings/profile" type="button"><svg viewBox="0 0 20 20" class="Icon Button-icon Icon--setting" width="14" height="16" aria-hidden="true" style="height: 16px; width: 14px;"><title></title><g><path d="M18.868 15.185c-.164.096-.315.137-.452.137-.123 0-1.397-.26-1.617-.233-1.355.013-1.782 1.275-1.836 1.74-.055.454 0 .893.19 1.304.138.29.125.577-.067.85-.863.893-2.165 1.016-2.357 1.016-.123 0-.247-.055-.356-.15-.11-.097-.685-1.14-1.07-1.47-1.303-.954-2.246-.328-2.63 0-.397.33-.67.7-.835 1.126-.07.18-.18.302-.33.37-1.354.426-2.918-.92-3.014-1.056-.082-.11-.123-.22-.123-.356-.014-.138.383-1.276.342-1.688-.342-1.9-1.836-1.687-2.096-1.673-.303.014-.604.068-.92.178-.205.056-.396.03-.588-.054-.888-.462-1.137-2.332-1.11-2.51.055-.315.192-.52.438-.604.425-.164.81-.452 1.15-.85.932-1.262.344-2.25 0-2.634-.34-.356-.725-.645-1.15-.81-.137-.04-.233-.15-.328-.315C-.27 6.07.724 4.95.978 4.733c.255-.22.6-.055.723 0 .426.164.878.22 1.344.15C4.7 4.636 4.784 3.14 4.81 2.908c.015-.247-.11-1.29-.136-1.4-.027-.123-.014-.22.027-.315C5.318.178 7.073 0 7.223 0c.178 0 .33.055.44.178.108.124.63 1.11 1 1.4.398.338 1.582.83 2.588.013.398-.273.96-1.288 1.083-1.412.123-.123.26-.178.384-.178 1.56 0 2.33 1.03 2.438 1.22.083.124.096.248.07.37-.03.152-.33 1.153-.262 1.606.366 1.537 1.384 1.742 1.89 1.783.494.027 1.645-.357 1.81-.344.164.014.315.083.424.206.535.31.85 1.715.905 2.14.027.233-.014.44-.11.562-.11.138-1.165.714-1.48 1.112-.855.982-.342 2.25-.068 2.606.26.37 1.22.905 1.288.96.15.137.26.302.315.494.146 1.413-.89 2.387-1.07 2.47zm-8.905-.535c.644 0 1.246-.123 1.822-.356.575-.248 1.082-.59 1.493-1.016.425-.425.754-.92 1-1.495.247-.562.357-1.18.357-1.81 0-.66-.11-1.262-.356-1.825-.248-.562-.577-1.056-1.002-1.48-.41-.427-.918-.756-1.493-1.003-.576-.233-1.178-.357-1.822-.357-.644 0-1.247.124-1.81.357-.56.247-1.067.576-1.478 1.002-.425.425-.768.92-1 1.48-.247.564-.37 1.167-.37 1.826 0 .644.123 1.248.37 1.81.232.563.575 1.07 1 1.495.424.426.917.768 1.48 1.016.56.233 1.164.356 1.808.356z"></path></g></svg>设置</a>\
        <a class="Button Menu-item AppHeaderProfileMenu-item Button--plain" href="/exit/" type="button"><svg viewBox="0 0 20 20" class="Icon Button-icon Icon--logout" width="14" height="16" aria-hidden="true" style="height: 16px; width: 14px;"><title></title><g><path d="M0 10C0 7.242 1.154 4.58 3.167 2.697c.51-.477 1.31-.45 1.79.06.475.51.45 1.31-.06 1.787C3.37 5.975 2.53 7.91 2.53 10c0 4.118 3.35 7.468 7.47 7.468 4.12 0 7.47-3.35 7.47-7.47 0-2.04-.81-3.948-2.28-5.37-.5-.485-.514-1.286-.028-1.788.485-.5 1.286-.517 1.79-.03C18.915 4.712 20 7.265 20 10c0 5.512-4.486 9.998-10 9.998s-10-4.486-10-10zm8.7-.483V1.26C8.7.564 9.26 0 9.96 0c.695 0 1.26.564 1.26 1.26v8.257c0 .696-.565 1.26-1.26 1.26-.698 0-1.26-.564-1.26-1.26z"></path></g></svg>退出</a></div>';
        $('#MenuPopover').attr("data-content",data);
        $('#MenuPopover').popover('show');
        
        $(".Menu.Home-menu").click(function(e){
            e.stopPropagation();
        });

    });
    
}

function checkSets()
{
    checkFollow();
    checkContentExpand();
    checkContentCollapse();
    checkContentExpand2();
    checkContentCollapse2();
    checkPopoverShow();
    checkAnswerLike();
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
            $("#summernote_question").summernote('insertImage', url, 'image name'); // the insertImage API
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
            $("#summernote_answer").summernote('insertImage', url, 'image name'); // the insertImage API
        }
    });
}

function submitAnswer()
{
    var url=$(".AnswerToolbar").attr("data-question-answer-url");
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
        pushOneConversationMessagesElement();
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
        console.log(ret);
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
        <a href="/inbox/5587284910" class="Messages-records">查看私信记录</a>\
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
    $(".Messages-list").empty();
    for (i in ret)
    {
        var conversation_id=ret[i][0];
        var conversation_update=ret[i][1];
        var er_id=ret[i][2];
        var er_name=ret[i][3];
        var er_avatar=ret[i][4];
        var message_content=ret[i][5];
        
        var data='<a href="/conversation/?i='+conversation_id+'" class="Messages-item Messages-followItem"><span class="UserLink"><img class="Avatar Avatar--medium UserLink-avatar" width="40" height="40" src="'+er_avatar+'" srcset="'+er_avatar+'" alt="'+er_name+'"></span><div class="Messages-user"><div class="Messages-userName"><span class="UserLink">'+er_name+'</span></div><div class="Messages-itemContent">'+message_content+'</div></div></a>';
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

$(document).click(function(e) {
    $("#NotificationPopover").popover("hide");
    $("#MessagePopover").popover("hide");
    $("#MenuPopover").popover("hide");
});

function initCommon()
{
    notifications="null";
    messages="null";
    $('#summernote_question').summernote({
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
}

$(document).ready(function() {
    initCommon();
    init();
});