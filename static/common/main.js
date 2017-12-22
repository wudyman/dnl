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

function get_index_img(content){
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

function remove_img(content){
    var imgReg=/<img.*?(?:>|\/>)/gi;
    return content.replace(imgReg,"").replace(/<[^>]+>/g,"").replace(/&nbsp;/ig,"").substr(0,150);
    //return content.replace(imgReg,"").replace(/<p>/gi,"").replace(/<\/p>/gi,"").replace(/(^\s*)|(\s*$)/g,"");
}
function update_value(type,value)
{
    $(".NumberBoard-value").each(function(){
        var item=$(this);
        if(type==item.attr("data-update-value-type"))
            item.text(value)
    });
}
function follow_people(button){
    erid=button.attr("data-er-id");
    if("true"==button.attr("data-followed"))
    {
        $.post("/ajax/er_follow/0/"+erid+"/",function(ret){
            button.removeClass("Button--grey").addClass("Button--green").text("关注");
            button.attr("data-followed","false");
            update_value("people-followed",ret);
        }); 
    }
    else
    {
        $.post("/ajax/er_follow/1/"+erid+"/",function(ret){
            button.removeClass("Button--green").addClass("Button--grey").text("已关注");
            button.attr("data-followed","true");
            update_value("people-followed",ret);
        });  
    }
} 

function follow_topic(button){
    topicid=button.attr("data-topic-id");
    if("true"==button.attr("data-followed"))
    {
        $.post("/ajax/topic_follow/0/"+topicid+"/",function(ret){
            button.removeClass("Button--grey").addClass("Button--green").text("关注");
            button.attr("data-followed","false");
            update_value("topic-followed",ret);
        }); 
    }
    else
    {
        $.post("/ajax/topic_follow/1/"+topicid+"/",function(ret){
            button.removeClass("Button--green").addClass("Button--grey").text("已关注");
            button.attr("data-followed","true");
            update_value("topic-followed",ret);
        });  
    }
}  

function check_follow()
{
    $(".FollowButton").each(function(){
        var button=$(this);
        button.click(function(){
            if("people"==button.attr("data-follow-type"))
                follow_people(button);
            else if("topic"==button.attr("data-follow-type"))
                follow_topic(button);
            else if("question"==button.attr("data-follow-type"))
                follow_question(button);
            });
    });
}
function check_content_collapse(){
    $(".ContentItem-less").each(function(){
        $(this).click(function(){
            $(this).addClass("is-hide");
            $(this).parent().siblings(".RichContent-inner").children(".less").removeClass("is-hide");
            $(this).parent().siblings(".RichContent-inner").children(".more").addClass("is-hide");
            $(this).parent().siblings(".RichContent-inner").children(".ContentItem-more").removeClass("is-hide");
            $(this).parents(".RichContent").addClass("is-collapsed");
            if("null"!=$(this).parent().siblings(".RichContent-cover").find("img").attr("src"))
            {
                $(this).parent().siblings(".RichContent-cover").removeClass("is-hide");
            }
        });
    });
}

function check_content_expand(){
    $(".RichContent-inner").each(function(){
        if("null"==$(this).siblings(".RichContent-cover").find("img").attr("src"))
        {
            $(this).siblings(".RichContent-cover").addClass("is-hide");
        }
        $(this).click(function(){
            $(this).children(".less").addClass("is-hide");
            $(this).children(".more").removeClass("is-hide");
            $(this).children(".ContentItem-more").addClass("is-hide");
            $(this).siblings(".ContentItem-actions").children(".ContentItem-less").removeClass("is-hide");
            $(this).parent().removeClass("is-collapsed");
            $(this).siblings(".RichContent-cover").addClass("is-hide");
        });
    });
}
function check_answer_like(){
    $(".AnswerLike").each(function(){
        $(this).click(function(){
            element=$(this);
            answer_id=$(this).attr("data-answer-id");
            $.get("/ajax/answer_like/"+answer_id+"/",function(ret){
                element.text(ret);
            });
        });
    });

}

function check_popover_show(){ 
    $('.PeoplePopover').each(function(){
            $(this).parent().hover(function(){
                element=$(this).children(".PeoplePopover");
                authorid=element.attr("data-author-id");
                $.get("/ajax/er/"+authorid+"/",function(ret){
                    er_id=ret[0];
                    er_name=ret[1];
                    er_avatar=ret[2];
                    er_mood=ret[3];
                    er_answer_nums=ret[4];
                    er_follower_nums=ret[5];
                    er_followed=ret[6];
                    
                    var data1='<div><div class="HoverCard-titleContainer HoverCard-titleContainer--noAvatar"><img class="Avatar Avatar--large HoverCard-avatar" width="68" height="68" src="'+er_avatar+'" srcset="'+er_avatar+'"><div class="HoverCard-titleText"><div class="HoverCard-title"><span><a href="/er/'+er_id+'">'+er_name+'</a></span></div><div class="HoverCard-subtitle"><span class="RichText">'+er_mood+'</span></div></div></div></div><div class="HoverCard-item"><div class="NumberBoard"><a class="Button NumberBoard-item Button--plain" type="button" href="/er/'+er_id+'/answers"><div class="NumberBoard-name">回答</div><div class="NumberBoard-value">'+er_answer_nums+'</div></a><a class="Button NumberBoard-item Button--plain" type="button" href="/er/'+er_id+'/posts"><div class="NumberBoard-name">文章</div><div class="NumberBoard-value">0</div></a><a class="Button NumberBoard-item Button--plain" type="button" href="/er/'+er_id+'/followers"><div class="NumberBoard-name">关注者</div><div class="NumberBoard-value" data-update-value-type="people-followed">'+er_follower_nums+'</div></a></div>';
                    if(er_followed)
                        var data2='<div class="MemberButtonGroup ProfileButtonGroup HoverCard-buttons"><button class="Button FollowButton Button--primary Button--grey" type="button" data-er-id="'+er_id+'" data-follow-type="people" data-followed="true">已关注</button><button class="Button" type="button"><svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" class="Icon Button-icon Icon--comments" width="15" height="16" aria-hidden="true" style="height: 16px; width: 15px;"><title></title><g><g>     <path d="M9 0C3.394 0 0 4.13 0 8c0 1.654.522 3.763 2.014 5.566.314.292.518.82.454 1.17-.165 1.488-.842 1.905-.842 1.905-.328.332.105.67.588.582 1.112-.2 2.07-.58 3.526-1.122.4-.202.464-.147.78-.078C11.524 17.764 18 14 18 8c0-3.665-3.43-8-9-8z"></path>     <path d="M19.14 9.628c.758.988.86 2.01.86 3.15 0 1.195-.62 3.11-1.368 3.938-.21.23-.354.467-.308.722.12 1.073.614 1.5.614 1.5.237.24-.188.563-.537.5-.802-.145-1.494-.42-2.545-.81-.29-.146-.336-.106-.563-.057-2.043.712-4.398.476-6.083-.926 5.964-.524 8.726-3.03 9.93-8.016z"></path>   </g></g></svg><span>发私信</span></button></div></div>';
                    else
                        var data2='<div class="MemberButtonGroup ProfileButtonGroup HoverCard-buttons"><button class="Button FollowButton Button--primary Button--green" type="button" data-er-id="'+er_id+'" data-follow-type="people" data-followed="false">关注</button><button class="Button" type="button"><svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" class="Icon Button-icon Icon--comments" width="15" height="16" aria-hidden="true" style="height: 16px; width: 15px;"><title></title><g><g>     <path d="M9 0C3.394 0 0 4.13 0 8c0 1.654.522 3.763 2.014 5.566.314.292.518.82.454 1.17-.165 1.488-.842 1.905-.842 1.905-.328.332.105.67.588.582 1.112-.2 2.07-.58 3.526-1.122.4-.202.464-.147.78-.078C11.524 17.764 18 14 18 8c0-3.665-3.43-8-9-8z"></path>     <path d="M19.14 9.628c.758.988.86 2.01.86 3.15 0 1.195-.62 3.11-1.368 3.938-.21.23-.354.467-.308.722.12 1.073.614 1.5.614 1.5.237.24-.188.563-.537.5-.802-.145-1.494-.42-2.545-.81-.29-.146-.336-.106-.563-.057-2.043.712-4.398.476-6.083-.926 5.964-.524 8.726-3.03 9.93-8.016z"></path>   </g></g></svg><span>发私信</span></button></div></div>';
                    var data=data1+data2;
                    element.attr("data-content",data);
                    element.popover('show'); 
                    check_follow(); 
                    //element.siblings(".popover").attr("in",true);
                    //element.siblings(".popover").children().attr("in",true);
                });
            },function(){
                    $(this).children(".PeoplePopover").popover('hide');
                    //setTimeout(function(){/*if ($(this).attr("in")) console.log("true"); else console.log("not ture");*/$(this).children().popover('hide');},1000);
            });
    });
    
    $('.TopicPopover').each(function(){
            $(this).parent().hover(function(){
                element=$(this).children(".TopicPopover");
                topicid=element.attr("data-topic-id");
                $.get("/ajax/topic/"+topicid+"/",function(ret){
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
                    check_follow(); 
                });
            },function(){
                    $(this).children(".TopicPopover").popover('hide');
            });
    });
    
    $('#NotificationPopover').click(function(e){
        $("#MessagePopover").popover("hide");
        $("#MenuPopover").popover("hide");
        e.stopPropagation();
        var data='<div class="Menu PushNotifications-menu"><div class="PushNotifications-content"><div class="PushNotifications-header" role="tablist"><button class="Button PushNotifications-tab Button--plain" role="tab" aria-controls="PushNotifications-default" aria-label="消息" type="button"><svg viewBox="0 0 20 15" class="Icon PushNotifications-tabIcon PushNotifications-selectedTabIcon Icon--lastNews" width="20" height="16" aria-hidden="true" style="height: 16px; width: 20px;"><title></title><g><path d="M6.493 6C5.668 6 5 6.666 5 7.5 5 8.328 5.664 9 6.493 9h12.014C19.332 9 20 8.334 20 7.5c0-.828-.664-1.5-1.493-1.5H6.493zm0 6C5.668 12 5 12.666 5 13.5c0 .828.664 1.5 1.493 1.5h12.014c.825 0 1.493-.666 1.493-1.5 0-.828-.664-1.5-1.493-1.5H6.493zM1.5 0C.672 0 0 .666 0 1.5 0 2.328.666 3 1.5 3 2.328 3 3 2.334 3 1.5 3 .672 2.334 0 1.5 0zm0 6C.672 6 0 6.666 0 7.5 0 8.328.666 9 1.5 9 2.328 9 3 8.334 3 7.5 3 6.672 2.334 6 1.5 6zm0 6c-.828 0-1.5.666-1.5 1.5 0 .828.666 1.5 1.5 1.5.828 0 1.5-.666 1.5-1.5 0-.828-.666-1.5-1.5-1.5zM6.493 0C5.668 0 5 .666 5 1.5 5 2.328 5.664 3 6.493 3h12.014C19.332 3 20 2.334 20 1.5c0-.828-.664-1.5-1.493-1.5H6.493z"></path></g></svg></button><button class="Button PushNotifications-tab Button--plain" role="tab" aria-controls="PushNotifications-follow" aria-label="用户" type="button"><svg viewBox="0 0 24 17" class="Icon PushNotifications-tabIcon Icon--userNews" width="20" height="16" aria-hidden="true" style="height: 16px; width: 20px;"><title></title><g><path d="M9.464 7.705c-.265.46-.59.904-.538 1.315.206 1.603 3.205 1.92 4.087 2.99.643.783.91 1.97.972 3.96.01.32 0 1.03-.946 1.03H1.02c-1 0-1.01-.683-1-.995.068-1.994.318-3.208.976-3.994.886-1.056 4.084-1.345 4.224-3.05.032-.385-.268-.786-.538-1.255C3.182 5.102 2.608 0 7.054 0s3.824 5.25 2.41 7.705zM18.27 8.545c.963.126 2.924-.574 2.924-.574-.664-.68-.815-1.472-1.294-4.586C19.507.27 16.8.3 16.597.3c-.203 0-2.91-.03-3.297 3.084-.485 3.113-.636 3.907-1.3 4.586 0 0 1.96.7 2.923.575l-.003.68c-.494.542-1.79.725-2.376 1.077 2.796.316 2.954 3.696 2.954 6.678 1.475-.002 6.497.02 7.5.02 1.002 0 .996-.674.986-.976-.06-1.8-.28-2.786-.418-3.434-.416-1.976-3.58-1.488-5.292-3.364l-.003-.68z"></path></g></svg></button><button class="Button PushNotifications-tab Button--plain" role="tab" aria-controls="PushNotifications-vote-thank" aria-label="赞同和感谢" type="button"><div><svg viewBox="0 0 20 18" class="Icon PushNotifications-tabIcon Icon--thankNews" width="20" height="16" aria-hidden="true" style="height: 16px; width: 20px;"><title></title><g><path d="M0,5.43706401 C5.73656627e-08,2.50510671 2.2938809,0.094365083 5.20737357,1.60732864e-07 C7.2427157,-0.000505078569 9.0922816,1.19013727 9.9999282,3 C10.8228521,1.24236064 12.6486957,1.60732867e-07 14.6514359,1.60732864e-07 C17.5445125,1.60732867e-07 19.9999282,2.50715387 19.9999282,5.43242499 C19.9999282,13.2399998 11.8420757,18 9.99997552,18 C8.15785253,18 -1.52669543e-07,13.2399998 0,5.43706401 Z"></path></g></svg></div></button></div><div class="PushNotifications-list"><div class="PushNotifications-item"><span><span><span class="UserLink"><a class="UserLink-link" data-za-detail-view-element_name="User" href="/people/aall-55">Aall</a></span><span style="color: rgb(62, 122, 194);">、</span></span><span><span class="UserLink"><a class="UserLink-link" data-za-detail-view-element_name="User" href="/people/jiang-zheng-52-14-81">姜铮</a></span><span style="color: rgb(62, 122, 194);">、</span></span><span><span class="UserLink"><a class="UserLink-link" data-za-detail-view-element_name="User" href="/people/lillian-68-42">拂晓</a></span><span style="color: rgb(62, 122, 194);">、</span></span><span><span class="UserLink"><a class="UserLink-link" data-za-detail-view-element_name="User" href="/people/pi-pi-hui-ke-ting">皮皮鲁</a></span><span style="color: rgb(62, 122, 194);">、</span></span><span><span class="UserLink"><a class="UserLink-link" data-za-detail-view-element_name="User" href="/people/wang-xiao-yang-48-49">王潇洋</a></span></span></span><span> 回答了 </span><span><a href="/question/66834114?group_id=907384988165775360">有哪些「以为会碾压，结果被秒杀」 的例子？</a></span></div><div class="PushNotifications-item"><span><span><span class="UserLink"><a class="UserLink-link" data-za-detail-view-element_name="User" href="/people/di-xin-liang">我不是亮哥</a></span></span></span><span> 回答了 </span><span><a href="/question/22049270/answer/250850226">外国的民谣歌词和中国的民谣歌词有什么比较不一样的地方？</a></span></div><div class="PushNotifications-item"><span><span><span class="UserLink"><a class="UserLink-link" data-za-detail-view-element_name="User" href="/people/hubertuswi">顾宇</a></span><span style="color: rgb(62, 122, 194);">、</span></span><span><span class="UserLink"><a class="UserLink-link" data-za-detail-view-element_name="User" href="/people/kkleft">你典哥哥</a></span><span style="color: rgb(62, 122, 194);">、</span></span><span><span class="UserLink"><a class="UserLink-link" data-za-detail-view-element_name="User" href="/people/ye-xiao-zi">夜小紫</a></span><span style="color: rgb(62, 122, 194);">、</span></span><span><span class="UserLink"><a class="UserLink-link" data-za-detail-view-element_name="User" href="/people/bao-mi-mi">包咪咪</a></span><span style="color: rgb(62, 122, 194);">、</span></span><span><span class="UserLink"><a class="UserLink-link" data-za-detail-view-element_name="User" href="/people/chen-ke-55-65">皮耶霍</a></span></span></span><span> 回答了 </span><span><a href="/question/66834114?group_id=904733421180817408">有哪些「以为会碾压，结果被秒杀」 的例子？</a></span></div><div></div></div><div class="Notifications-footer"><a class="Button Button--plain" href="/settings/notification" type="button"><svg viewBox="0 0 20 20" class="Icon Button-icon Icon--setting" width="14" height="16" aria-hidden="true" style="height: 16px; width: 14px;"><title></title><g><path d="M18.868 15.185c-.164.096-.315.137-.452.137-.123 0-1.397-.26-1.617-.233-1.355.013-1.782 1.275-1.836 1.74-.055.454 0 .893.19 1.304.138.29.125.577-.067.85-.863.893-2.165 1.016-2.357 1.016-.123 0-.247-.055-.356-.15-.11-.097-.685-1.14-1.07-1.47-1.303-.954-2.246-.328-2.63 0-.397.33-.67.7-.835 1.126-.07.18-.18.302-.33.37-1.354.426-2.918-.92-3.014-1.056-.082-.11-.123-.22-.123-.356-.014-.138.383-1.276.342-1.688-.342-1.9-1.836-1.687-2.096-1.673-.303.014-.604.068-.92.178-.205.056-.396.03-.588-.054-.888-.462-1.137-2.332-1.11-2.51.055-.315.192-.52.438-.604.425-.164.81-.452 1.15-.85.932-1.262.344-2.25 0-2.634-.34-.356-.725-.645-1.15-.81-.137-.04-.233-.15-.328-.315C-.27 6.07.724 4.95.978 4.733c.255-.22.6-.055.723 0 .426.164.878.22 1.344.15C4.7 4.636 4.784 3.14 4.81 2.908c.015-.247-.11-1.29-.136-1.4-.027-.123-.014-.22.027-.315C5.318.178 7.073 0 7.223 0c.178 0 .33.055.44.178.108.124.63 1.11 1 1.4.398.338 1.582.83 2.588.013.398-.273.96-1.288 1.083-1.412.123-.123.26-.178.384-.178 1.56 0 2.33 1.03 2.438 1.22.083.124.096.248.07.37-.03.152-.33 1.153-.262 1.606.366 1.537 1.384 1.742 1.89 1.783.494.027 1.645-.357 1.81-.344.164.014.315.083.424.206.535.31.85 1.715.905 2.14.027.233-.014.44-.11.562-.11.138-1.165.714-1.48 1.112-.855.982-.342 2.25-.068 2.606.26.37 1.22.905 1.288.96.15.137.26.302.315.494.146 1.413-.89 2.387-1.07 2.47zm-8.905-.535c.644 0 1.246-.123 1.822-.356.575-.248 1.082-.59 1.493-1.016.425-.425.754-.92 1-1.495.247-.562.357-1.18.357-1.81 0-.66-.11-1.262-.356-1.825-.248-.562-.577-1.056-1.002-1.48-.41-.427-.918-.756-1.493-1.003-.576-.233-1.178-.357-1.822-.357-.644 0-1.247.124-1.81.357-.56.247-1.067.576-1.478 1.002-.425.425-.768.92-1 1.48-.247.564-.37 1.167-.37 1.826 0 .644.123 1.248.37 1.81.232.563.575 1.07 1 1.495.424.426.917.768 1.48 1.016.56.233 1.164.356 1.808.356z"></path></g></svg><!-- react-text: 28 -->设置<!-- /react-text --></a><a class="Button Button--plain" href="/notifications" type="button"><!-- react-text: 30 -->查看全部提醒<!-- /react-text --></a></div></div></div>';
        $('#NotificationPopover').attr("data-content",data);
        $('#NotificationPopover').popover('show');

    });
    
    $('#MessagePopover').click(function(e){
        $("#NotificationPopover").popover("hide");
        $("#MenuPopover").popover("hide");
        e.stopPropagation();
        var data='<div class="Menu Messages-menu"><div class="Messages-content"><div class="Messages-header" role="tablist"><button class="Button Messages-tab Messages-myMessageTab Button--plain" type="button"><!-- react-text: 9 -->我的私信<!-- /react-text --></button></div><div class="Messages-list"><a href="/inbox/5587284910" class="Messages-item Messages-followItem"><span class="UserLink"><img class="Avatar Avatar--medium UserLink-avatar" width="40" height="40" src="https://pic3.zhimg.com/v2-b14587a6079c43702f1f0251098f3ec2_xs.jpg" srcset="https://pic3.zhimg.com/v2-b14587a6079c43702f1f0251098f3ec2_l.jpg 2x" alt="verna wu"></span><div class="Messages-user"><div class="Messages-userName"><span class="UserLink"><!-- react-text: 26 -->verna wu<!-- /react-text --></span></div><div class="Messages-itemContent">hi verna</div></div></a><a href="/inbox/6213324000" class="Messages-item Messages-followItem"><span class="UserLink"><img class="Avatar Avatar--medium UserLink-avatar" width="40" height="40" src="https://pic3.zhimg.com/fd56780c37f0b316c56f27fe8b388532_xs.jpg" srcset="https://pic3.zhimg.com/fd56780c37f0b316c56f27fe8b388532_l.jpg 2x" alt="知乎团队"></span><div class="Messages-user"><div class="Messages-userName"><span class="UserLink"><!-- react-text: 34 -->知乎团队<!-- /react-text --></span></div><div class="Messages-itemContent">wudy:见信好。第三届「知乎盐 Club」将于 5 月 14 日在上海国际时尚中心举办，届时将有丰富有趣的「15 分钟」演讲、展位互动和知友见面会「知乎 Live」，以及一年一度的「盐 Club」颁奖礼。欢迎关注「知识青年」专栏：https://zhuanlan.zhihu.com/p/20852694?source=message ，了解更多活动信息。如果活动当天你无法到场参与，也期待你参与我们的线上直播互动，视频直播地址： http://www.bilibili.com/html/activity-zh-yanclub.html 。和真实的你在一起知乎团队</div></div></a><div></div></div><div class="Messages-footer"><button class="Button Button--plain" type="button"><svg viewBox="0 0 12 12" class="Icon Button-icon Icon--modify" width="14" height="16" aria-hidden="true" style="height: 16px; width: 14px;"><title></title><g><path d="M.423 10.32L0 12l1.667-.474 1.55-.44-2.4-2.33-.394 1.564zM10.153.233c-.327-.318-.85-.31-1.17.018l-.793.817 2.49 2.414.792-.814c.318-.328.312-.852-.017-1.17l-1.3-1.263zM3.84 10.536L1.35 8.122l6.265-6.46 2.49 2.414-6.265 6.46z" fill-rule="evenodd"></path></g></svg><!-- react-text: 17 -->写新私信<!-- /react-text --></button><a class="Button Button--plain" href="/inbox" type="button"><!-- react-text: 19 -->查看全部私信<!-- /react-text --></a></div></div></div>';
        $('#MessagePopover').attr("data-content",data);
        $('#MessagePopover').popover('show');

    });
    
    $('#MenuPopover').click(function(e){
        $("#NotificationPopover").popover("hide");
        $("#MessagePopover").popover("hide");
        e.stopPropagation();
        var data='<div class="Menu">\
        <a class="Button Menu-item AppHeaderProfileMenu-item Button--plain" type="button" href="/er/{{user.id}}/"><svg viewBox="0 0 20 20" class="Icon Button-icon Icon--profile" width="14" height="16" aria-hidden="true" style="height: 16px; width: 14px;"><title></title><g><path d="M13.4170937,10.9231839 C13.0412306,11.5757324 12.5795351,12.204074 12.6542924,12.7864225 C12.9457074,15.059449 18.2164534,14.5560766 19.4340179,15.8344151 C20,16.4286478 20,16.4978969 20,19.9978966 C13.3887136,19.9271077 6.63736785,19.9978966 0,19.9978966 C0.0272309069,16.4978969 0,16.5202878 0.620443914,15.8344151 C1.92305664,14.3944356 7.20116276,15.1185829 7.40016946,12.7013525 C7.44516228,12.1563518 7.02015319,11.5871442 6.63736814,10.9228381 C4.51128441,7.2323256 3.69679769,4.67956187e-11 10,9.32587341e-14 C16.3032023,-4.66091013e-11 15.4216968,7.4429255 13.4170937,10.9231839 Z"></path></g></svg>我的主页</a>\
        <a class="Button Menu-item AppHeaderProfileMenu-item Button--plain" href="/settings/profile" type="button"><svg viewBox="0 0 20 20" class="Icon Button-icon Icon--setting" width="14" height="16" aria-hidden="true" style="height: 16px; width: 14px;"><title></title><g><path d="M18.868 15.185c-.164.096-.315.137-.452.137-.123 0-1.397-.26-1.617-.233-1.355.013-1.782 1.275-1.836 1.74-.055.454 0 .893.19 1.304.138.29.125.577-.067.85-.863.893-2.165 1.016-2.357 1.016-.123 0-.247-.055-.356-.15-.11-.097-.685-1.14-1.07-1.47-1.303-.954-2.246-.328-2.63 0-.397.33-.67.7-.835 1.126-.07.18-.18.302-.33.37-1.354.426-2.918-.92-3.014-1.056-.082-.11-.123-.22-.123-.356-.014-.138.383-1.276.342-1.688-.342-1.9-1.836-1.687-2.096-1.673-.303.014-.604.068-.92.178-.205.056-.396.03-.588-.054-.888-.462-1.137-2.332-1.11-2.51.055-.315.192-.52.438-.604.425-.164.81-.452 1.15-.85.932-1.262.344-2.25 0-2.634-.34-.356-.725-.645-1.15-.81-.137-.04-.233-.15-.328-.315C-.27 6.07.724 4.95.978 4.733c.255-.22.6-.055.723 0 .426.164.878.22 1.344.15C4.7 4.636 4.784 3.14 4.81 2.908c.015-.247-.11-1.29-.136-1.4-.027-.123-.014-.22.027-.315C5.318.178 7.073 0 7.223 0c.178 0 .33.055.44.178.108.124.63 1.11 1 1.4.398.338 1.582.83 2.588.013.398-.273.96-1.288 1.083-1.412.123-.123.26-.178.384-.178 1.56 0 2.33 1.03 2.438 1.22.083.124.096.248.07.37-.03.152-.33 1.153-.262 1.606.366 1.537 1.384 1.742 1.89 1.783.494.027 1.645-.357 1.81-.344.164.014.315.083.424.206.535.31.85 1.715.905 2.14.027.233-.014.44-.11.562-.11.138-1.165.714-1.48 1.112-.855.982-.342 2.25-.068 2.606.26.37 1.22.905 1.288.96.15.137.26.302.315.494.146 1.413-.89 2.387-1.07 2.47zm-8.905-.535c.644 0 1.246-.123 1.822-.356.575-.248 1.082-.59 1.493-1.016.425-.425.754-.92 1-1.495.247-.562.357-1.18.357-1.81 0-.66-.11-1.262-.356-1.825-.248-.562-.577-1.056-1.002-1.48-.41-.427-.918-.756-1.493-1.003-.576-.233-1.178-.357-1.822-.357-.644 0-1.247.124-1.81.357-.56.247-1.067.576-1.478 1.002-.425.425-.768.92-1 1.48-.247.564-.37 1.167-.37 1.826 0 .644.123 1.248.37 1.81.232.563.575 1.07 1 1.495.424.426.917.768 1.48 1.016.56.233 1.164.356 1.808.356z"></path></g></svg>设置</a>\
        <a class="Button Menu-item AppHeaderProfileMenu-item Button--plain" href="/exit/" type="button"><svg viewBox="0 0 20 20" class="Icon Button-icon Icon--logout" width="14" height="16" aria-hidden="true" style="height: 16px; width: 14px;"><title></title><g><path d="M0 10C0 7.242 1.154 4.58 3.167 2.697c.51-.477 1.31-.45 1.79.06.475.51.45 1.31-.06 1.787C3.37 5.975 2.53 7.91 2.53 10c0 4.118 3.35 7.468 7.47 7.468 4.12 0 7.47-3.35 7.47-7.47 0-2.04-.81-3.948-2.28-5.37-.5-.485-.514-1.286-.028-1.788.485-.5 1.286-.517 1.79-.03C18.915 4.712 20 7.265 20 10c0 5.512-4.486 9.998-10 9.998s-10-4.486-10-10zm8.7-.483V1.26C8.7.564 9.26 0 9.96 0c.695 0 1.26.564 1.26 1.26v8.257c0 .696-.565 1.26-1.26 1.26-.698 0-1.26-.564-1.26-1.26z"></path></g></svg>退出</a></div>';
        $('#MenuPopover').attr("data-content",data);
        $('#MenuPopover').popover('show');

    });
    
}
/*
function follow_people(){
    erid=$("#pop-button-follow").attr("data-er-id");
    if("true"==$("#pop-button-follow").attr("data-people-followed"))
    {
        $.post("/ajax/er_follow/0/"+erid+"/",function(ret){
        //alert(ret);
        $("#follower_num").text(ret);
        //$("#pop-button-follow").removeClass("btn-default").addClass("btn-success").text("关注");
        $("#pop-button-follow").removeClass("Button--grey").addClass("Button--green").text("关注");
        $("#pop-button-follow").attr("data-people-followed","false");
    }); 
    }
    else
    {
        $.post("/ajax/er_follow/1/"+erid+"/",function(ret){
            //alert(ret);
            $("#follower_num").text(ret);
            //$("#pop-button-follow").removeClass("btn-success").addClass("btn-default").text("已关注");
            $("#pop-button-follow").removeClass("Button--green").addClass("Button--grey").text("已关注");
            $("#pop-button-follow").attr("data-people-followed","true");
        });  
    }
} 

function follow_topic(){
    topicid=$("#pop-button-follow").attr("data-topic-id");
    if("true"==$("#pop-button-follow").attr("data-topic-followed"))
    {
        $.post("/ajax/topic_follow/0/"+topicid+"/",function(ret){
        //alert(ret);
        $("#follower_num").text(ret);
        //$("#pop-button-follow").removeClass("btn-default").addClass("btn-success").text("关注");
        $("#pop-button-follow").removeClass("Button--grey").addClass("Button--green").text("关注");
        $("#pop-button-follow").attr("data-topic-followed","false");
    }); 
    }
    else
    {
        $.post("/ajax/topic_follow/1/"+topicid+"/",function(ret){
            //alert(ret);
            $("#follower_num").text(ret);
            //$("#pop-button-follow").removeClass("btn-success").addClass("btn-default").text("已关注");
            $("#pop-button-follow").removeClass("Button--green").addClass("Button--grey").text("已关注");
            $("#pop-button-follow").attr("data-topic-followed","true");
        });  
    }
}  
*/