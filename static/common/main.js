if (!HTMLCanvasElement.prototype.toBlob) {
        Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
            value: function (callback, type, quality) {
                var canvas = this;
                setTimeout(function() {
                    var binStr = atob(canvas.toDataURL(type, quality).split(',')[1]);
                    var len = binStr.length, arr = new Uint8Array(len);

                    for (var i = 0; i < len; i++ ) {
                        arr[i] = binStr.charCodeAt(i);
                    }

                    callback(new Blob([arr], {type: type || 'image/png'}));
                });
            }
        });
    }
function utf8_to_b64(str) {   
    //return window.btoa(encodeURIComponent(str));
    return window.btoa(unescape(encodeURIComponent(str)));
    //return encodeURIComponent(str);
    //return encodeURI(str);
}

function b64_to_utf8(str) {
    //return decodeURIComponent(window.atob(str));
    return decodeURIComponent(escape(window.atob(str)));
    //return decodeURIComponent(str);
    //return decodeURI(str);
}
function setCookie(name,value,secs)
{
    var exp = new Date();
    exp.setTime(exp.getTime() + secs*1000);
    //document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString()+";path=/";
    document.cookie = name + "="+ value + ";expires=" + exp.toGMTString()+";path=/";
}
function getCookie(name)
{
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg))
        return (arr[2]);
    else
        return null;
}
function delCookie(name)
{
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval=getCookie(name);
    if(cval!=null)
        document.cookie= name + "="+cval+";expires="+exp.toGMTString()+";path=/";
}

function getDateDiff(dateStr) {
    var timestamp = Date.parse(new Date(dateStr.replace(/-/g,"/")));
    var publishTime = timestamp / 1000,
    d_seconds,
    d_minutes,
    d_hours,
    d_days,
    timeNow = parseInt(new Date().getTime() / 1000),
    d, 
    date = new Date(publishTime * 1000),
    Y = date.getFullYear(),
    M = date.getMonth() + 1,
    D = date.getDate(),
    H = date.getHours(),
    m = date.getMinutes(),
    s = date.getSeconds();
    //小于10的在前面补0
    if (M < 10) {
    M = '0' + M;
    }
    if (D < 10) {
    D = '0' + D;
    }
    if (H < 10) {
    H = '0' + H;
    }
    if (m < 10) {
    m = '0' + m;
    }
    if (s < 10) {
    s = '0' + s;
    }
 
    d = timeNow - publishTime;
    d_days = parseInt(d / 86400);
    d_hours = parseInt(d / 3600);
    d_minutes = parseInt(d / 60);
    d_seconds = parseInt(d);
    

    if (d_days > 0 && d_days < 3) {
    return d_days + '天前';
    } else if (d_days <= 0 && d_hours > 0) {
    return d_hours + '小时前';
    } else if (d_hours <= 0 && d_minutes > 0) {
    return d_minutes + '分钟前';
    } else if (d_seconds < 60) {
    if (d_seconds <= 0) {
      return '刚刚';
    } else {
      return d_seconds + '秒前';
    }
    } else if (d_days >= 3 && d_days < 30) {
    return M + '-' + D;// + ' ' + H + ':' + m;
    } else if (d_days >= 30) {
    return Y + '-' + M + '-' + D;// + ' ' + H + ':' + m;
    }
}

function countDown()
{
    if(0==g_countdown_secs)
    {
        $(".SignFlow-smsInputButton").removeClass("is-counting").text("获取短信验证码");
        delCookie("countdown");
    }
    else
    {
        g_countdown_secs-=1;
        $("#counting-num").text(g_countdown_secs);
        setCookie("countdown",g_countdown_secs,g_countdown_secs);
        setTimeout("countDown()",1000);        
    }
}

function adjustChooseBox()
{
    var width=200;
    var height=200;
    var left=$("#preview_avatar").position().left+50;
    var top=$("#preview_avatar").position().top+50;
   
    var refLeft=$("#preview_avatar").position().left;
    var refTop=$("#preview_avatar").position().top;
  
    var adjust=$("#adjust_choosebox").val();
    width=width+(adjust-50)*2;
    height=height+(adjust-50)*2;
    left=left-adjust+50;
    top=top-adjust+50;
    
    $('#chooseBox').css({
                    width:width+'px',
                    height:height+'px',
                    left:left+'px',
                    top:top+'px'
    });
    
    
    $('#chooseBox').mousedown(function (e) {
            var originX= e.offsetX;
            var originY= e.offsetY;
            left=$("#chooseBox").position().left;
            top=$("#chooseBox").position().top;
            console.log("mousedown");
            window.onmousemove=function (e) {
                $('#chooseBox').css({
                    position:'absolute',
                    left:left+e.offsetX-originX+'px',
                    top: top+e.offsetY-originY+'px'
                });              
                
                if($('#chooseBox').position().left<=refLeft){
                    $('#chooseBox').css({
                        left:refLeft+'px'
                    });
                }
                if($('#chooseBox').position().left>=refLeft+300-width){
                    $('#chooseBox').css({
                        left:refLeft+300-width+'px'
                    });
                }
                if($('#chooseBox').position().top<=refTop){
                    $('#chooseBox').css({
                        top:refTop+'px'
                    });
                }
                if($('#chooseBox').position().top>=refTop+300-height){
                    $('#chooseBox').css({
                        top:refTop+300-height+'px'
                    });
                }
                
                $('#chooseBox').mouseout(function () {
                    console.log("mouseout");
                    window.onmousemove=null;
                    return
                })
            };
            window.onmouseup= function () {
                console.log("onmouseup");
                window.onmousemove=null;
                return
            }
        });
}

function getObjectURL(file) {
    var url = null ;
    if (window.createObjectURL!=undefined) { // basic
        url = window.createObjectURL(file) ;
    } else if (window.URL!=undefined) { // mozilla(firefox)
        url = window.URL.createObjectURL(file) ;
    } else if (window.webkitURL!=undefined) { // webkit or chrome
        url = window.webkitURL.createObjectURL(file) ;
    }
    return url ;
}



function getScrollTop() 
{ 
    var scrollTop = 0; 
    if (document.documentElement && document.documentElement.scrollTop) { 
        scrollTop = document.documentElement.scrollTop; 
    } 
    else if (document.body) { 
        scrollTop = document.body.scrollTop; 
    } 
    return scrollTop; 
} 
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
function getScrollHeight() { 
    return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight); 
} 




function uploadImage(type,file)
{
    if("forAvatar"==type)
        var url_data="/ajax/upload/avatar/";
    else if("forTopicAvatar"==type)
        var url_data="/ajax/upload/topic_avatar/"+g_topic_id+"/";
    else
        var url_data="/ajax/upload/img/";
    var data=new FormData();
    data.append("imgfile",file,"image.jpg");
    $.ajax({
        data:data,
        type:"POST",
        url:url_data,
        cache:false,
        contentType:false,
        processData:false,
        success:function(url){
            if("fail"!=url)
            {
                if("forQuestion"==type)
                    $("#summernote_question").summernote('insertImage', url, 'image name');
                else if("forAnswer"==type)
                    $("#summernote_answer").summernote('insertImage', url, 'image name');
                else if("forWrite"==type)
                    $("#summernote_write").summernote('insertImage', url, 'image name');
                else if(("forAvatar"==type)||("forTopicAvatar"==type))
                {
                    $("#upAvatarModal").modal('hide');
                    $("#id_avatar").attr("src",url).attr("srcset",url);
                }                  
            }
        }
    });
}
function scaleAndUploadImage(type,file,scale_value){
    var reader = new FileReader(); 
    reader.readAsDataURL(file);
    reader.onload = function(e){ 
        var img=new Image();
        img.onload=function(){
            var dst_width=scale_value;
            var dst_height=(dst_width)/(img.naturalWidth)*(img.naturalHeight);
            if(dst_height*9>dst_width*16) //16:9 is max
                dst_height=dst_width*16/9;
            var canvas = document.createElement('canvas');
            var context = canvas.getContext('2d');
            canvas.width = dst_width;//default is 300
            canvas.height = dst_height;//default is 150
            context.drawImage(img,0,0,dst_width,dst_height);
            canvas.toBlob(function(blobUrl){
                uploadImage(type,blobUrl);
            },"image/jpeg"); 
        };
        img.src=this.result;              
    }
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
    //for(var i=0;i<100;i++)
    //    temp=temp+"&nbsp;";
    return temp;
    //return content.replace(imgReg,"").replace(/<p>/gi,"").replace(/<\/p>/gi,"").replace(/(^\s*)|(\s*$)/g,"");
}

function addClassImg(content,classStr)
{
    var temp=content.replace(/<img/gi,"<img "+classStr);
    return temp;
}


function appendMessageElement(ret)
{
    var user_id=$("#MenuPopover").attr("data-er-id");
    $(".Messages-list").empty();
    for (i in ret)
    {
        var conversation_id=ret[i][0];
        var conversation_delete_id=ret[i][1];
        var conversation_update=ret[i][2];
        var initator_id=ret[i][3];
        var initator_name=ret[i][4];
        var initator_avatar=ret[i][5];
        var parter_id=ret[i][6];
        var parter_name=ret[i][7];
        var parter_avatar=ret[i][8];
        var latest_message_content=ret[i][9];
    
        
        if (conversation_delete_id==user_id) //user have delete this message
            continue;
                
        if(initator_id!=g_user_id)
        {
            var er_id=initator_id;
            var er_name=initator_name;
            var er_avatar=initator_avatar;
        }
        else
        {
            var er_id=parter_id;
            var er_name=parter_name;
            var er_avatar=parter_avatar;
        }
            
        var data='<a href="/conversations/?i='+conversation_id+'" class="Messages-item Messages-followItem"><span class="UserLink"><img class="Avatar Avatar--medium UserLink-avatar" width="40" height="40" src="'+er_avatar+'" alt="'+er_name+'"></span><div class="Messages-user"><div class="Messages-userName"><span class="UserLink">'+er_name+'</span></div><div class="Messages-itemContent">'+latest_message_content+'</div></div></a>';
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
        var notification_pub_date=ret[i][2];
        var notification_sender_id=ret[i][3];
        var notification_sender_first_name=ret[i][4];
        var notification_target_id=ret[i][5];
        var notification_target_title=ret[i][6];
        var notification_status=ret[i][7];
        
        if("invite"==notification_type)
        {
            var data='<div class="PushNotifications-item"><span><span><span class="UserLink"><a class="UserLink-link" href="/er/'+notification_sender_id+'">'+notification_sender_first_name+'</a></span></span></span><span> 邀请你回答 </span><span><a href="/question/'+notification_target_id+'">'+notification_target_title+'</a></span></div>';
        }
        $(".PushNotifications-list").append(data);
    }
}

function appendPopoverSearchElement(ret,keyword)
{
    var data='<div class="Popover-content Popover-content--bottom Popover-content--fixed Popover-content-enter Popover-content-enter-active" style="left: 212.4px; top: 43px;"><div class="Menu AutoComplete-menu SearchBar-menu" role="listbox"><div id="IdQuestion" class="AutoComplete-group"></div><div class="AutoComplete-group"><div role="option"><div data-za-module="TopNavBar"><div data-za-module="SearchResultList"><div><a class="SearchBar-searchLink" data-za-not-track-link="true" href="/search?type=all&amp;q='+keyword+'" target="_blank">查看全部搜索结果</a></div></div></div></div></div></div></div>';
    $('#searchInput').attr("data-content",data);
    $('#searchInput').popover('show');
    for (var i in ret)
    {
        var question_id=ret[i][0];
        var question_title=ret[i][1];
        var question_answer_num=ret[i][2];
        var data='<div class="Menu-item" role="option"><div data-za-module="TopNavBar"><div data-za-module="SearchResultList"><div data-za-detail-view-path-module="QuestionItem"><a class="SearchBar-contentResult" data-za-not-track-link="true" href="/question/'+question_id+'" target="_blank">'+question_title+'<span class="SearchBar-contentSuffix">'+question_answer_num+' 个回答</span></a></div></div></div></div>';
        $("#IdQuestion").append(data);
    }
}
function appendCommentsElement(ret)
{
    for( var i in ret)
    {
        var comment_id=ret[i][0];
        var comment_content=ret[i][1];
        var comment_like_nums=ret[i][2];
        var comment_parent_id=ret[i][3];
        var comment_pub_date=ret[i][4];//.split(".")[0];
        var comment_author_id=ret[i][5];
        var comment_author_name=ret[i][6];
        var comment_author_avatar=ret[i][7];
        var comment_author_mood=ret[i][8];
        
        var element_data='<div class="CommentItem" data-comment-id="'+comment_id+'" data-comment-author-name="'+comment_author_name+'"><div><div class="CommentItem-meta"><span class="UserLink CommentItem-avatar"><a class="UserLink-link" target="_blank" href="/er/'+comment_author_id+'"><img class="Avatar UserLink-avatar" width="24" height="24" src="'+comment_author_avatar+'" alt="'+comment_author_name+'"></a></span><span class="UserLink"><a class="UserLink-link" target="_blank" href="'+comment_author_id+'">'+comment_author_name+'</a></span><span class="CommentItem-time">'+getDateDiff(comment_pub_date)+'</span></div><div class="RichText ztext CommentItem-content">'+comment_content+'</div><div class="CommentItem-footer"><button type="button" class="Button-like-nouse Button CommentItem-likeBtn Button--plain" data-like-type="comment" data-like-id="'+comment_id+'">'+like_icon_svg+comment_like_nums+'</button><button type="button" class="Button CommentItem-hoverBtn Button--plain"><svg viewBox="0 0 22 16" class="Icon Icon--reply Icon--left" width="13" height="16" aria-hidden="true" style="height: 16px; width: 13px;"><title></title><g><path d="M21.96 13.22c-1.687-3.552-5.13-8.062-11.637-8.65-.54-.053-1.376-.436-1.376-1.56V.677c0-.52-.635-.915-1.116-.52L.47 6.67C.18 6.947 0 7.334 0 7.763c0 .376.14.722.37.987 0 0 6.99 6.818 7.442 7.114.453.295 1.136.124 1.135-.5V13c.027-.814.703-1.466 1.532-1.466 1.185-.14 7.596-.077 10.33 2.396 0 0 .395.257.535.257.892 0 .614-.967.614-.967z"></path></g></svg>回复</button></div></div></div>';
        $(".CommentList.CommentList--current").append(element_data);
        if(0!=comment_parent_id)
        {
            $(".CommentItem").each(function(){
                if($(this).attr("data-comment-id")==comment_parent_id)
                {
                    parent_element=$(this);
                }
                else if($(this).attr("data-comment-id")==comment_id)
                {
                    var current_element=$(this);
                    var parent_element_innerhtml=parent_element[0].innerHTML;
                    var temp_comment_id=parent_element.attr("data-comment-id");
                    var temp_comment_author_name=parent_element.attr("data-comment-author-name");
                    var parent_element_html='<div class="CommentItem CommentItem--border" data-comment-id="'+temp_comment_id+'" data-comment-author-name="'+temp_comment_author_name+'">'+parent_element_innerhtml+'</div>';
                    current_element.find(".CommentItem-meta").after(parent_element_html);
                }
            });
        }
    }
    
    if(ret.length>10)
        $(".CommentEditor--nouse--bottom").removeClass("is-hide");
    
    $(".CommentItem-hoverBtn").off("click");
    $(".CommentItem-hoverBtn").on("click",function(){
        console.log("comment-reply click");
        $(".CommentItem-footer").removeClass("is-hide");
        $(".CommentItem-editor").remove();
        
        var comment_element=$(this).closest(".CommentItem");
        var comment_id=comment_element.attr("data-comment-id");
        var comment_author_name=comment_element.attr("data-comment-author-name");
        var commentItem_editor='<div class="CommentItem-editor CommentEditor--inCommentItem CommentEditor--nouse"><div class="CommentEditor-input Input-wrapper Input-wrapper--spread Input-wrapper--large Input-wrapper--noPadding"><div class="Input Editable"><div class="Dropzone RichText ztext" style="min-height: 198px;"><div class="DraftEditor-root"><div class="public-DraftEditorPlaceholder-root"><div class="public-DraftEditorPlaceholder-inner">回复'+comment_author_name+'</div></div><div class="DraftEditor-editorContainer"><div class="notranslate public-DraftEditor-content" contenteditable="true" role="textbox" spellcheck="true" tabindex="0" style="outline: none; white-space: pre-wrap; word-wrap: break-word;"></div></div></div></div><div></div></div></div><div class="CommentEditor-actions"><button type="button" class="Button Button-comment-cancle Button--plain">取消</button><button disabled="" type="button" class="Button Button-comment-send Button--primary Button--green">评论</button></div></div>';
        comment_element.append(commentItem_editor);
        comment_element.find(".CommentItem-footer").addClass("is-hide");
        checkComment();
    });
}

function appendAnswerElementList(ret,type,direction)
{
    //console.log(ret.sort());
    ret.sort();
    for(i in ret)
    {
        if(("all"==type))
        {
            var answer_id=ret[i][0];
            var answer_content=ret[i][1];
            var like_nums=ret[i][2];
            var comment_nums=ret[i][3];
            var answer_pub_date=ret[i][4];
            var author_id=ret[i][5];
            var author_name=ret[i][6];
            var author_avatar=ret[i][7];
            var author_mood=ret[i][8];
            var author_sexual=ret[i][9];
            var author_question_nums=ret[i][10];
            var author_article_nums=ret[i][11];
            var author_answer_nums=ret[i][12];
            var author_followto_nums=ret[i][13];
            var author_follower_nums=ret[i][14];
            var author_followtopic_nums=ret[i][15];
            var author_followquestion_nums=ret[i][16];

            var richContent_class="RichContent--unescapable";
            var expand_btn_class="Button ContentItem-more ContentItem-rightButton Button--plain is-hide";
            var collapse_btn_class="Button ContentItem-less ContentItem-rightButton Button--plain is-hide";
            
            var question_title_element="";
            var content_type_element='data-content-type="answer" data-content-id="'+answer_id+'"';
            var expand_icon_svg='<svg viewBox="0 0 10 6" class="Icon ContentItem-arrowIcon Icon--arrow" width="10" height="16" aria-hidden="true" style="height: 16px; width: 10px;"><title></title><g><path d="M8.716.217L5.002 4 1.285.218C.99-.072.514-.072.22.218c-.294.29-.294.76 0 1.052l4.25 4.512c.292.29.77.29 1.063 0L9.78 1.27c.293-.29.293-.76 0-1.052-.295-.29-.77-.29-1.063 0z"></path></g></svg>';
            var collapsed_icon_svg='<svg viewBox="0 0 10 6" class="Icon ContentItem-arrowIcon is-active Icon--arrow" width="10" height="16" aria-hidden="true" style="height: 16px; width: 10px;"><title></title><g><path d="M8.716.217L5.002 4 1.285.218C.99-.072.514-.072.22.218c-.294.29-.294.76 0 1.052l4.25 4.512c.292.29.77.29 1.063 0L9.78 1.27c.293-.29.293-.76 0-1.052-.295-.29-.77-.29-1.063 0z"></path></g></svg>';
            var rich_content='<div class="RichContent '+richContent_class+'"><div class="RichContent-expand"><div class="RichContent-inner" style="max-height: 400px;"><span class="RichText CopyrightRichText-richText">'+answer_content+'</span></div><button class="'+expand_btn_class+'" type="button">展开阅读全文'+expand_icon_svg+'</button></div><div class="ContentItem-actions"><span><button class="Button-like-nouse Button Button--plain" type="button" data-like-type="answer" data-like-id="'+answer_id+'">'+like_icon_svg+like_nums+'</button></span><button class="Button ContentItem-action Button--plain Button--withIcon Button--withLabel" type="button"><span style="display: inline-flex; align-items: center;">&#8203;'+comment_icon_svg+'</span>'+comment_nums+' 条评论</button>'+share_button+'<button class="'+collapse_btn_class+'" type="button"><span class="RichContent-collapsedText">收起</span>'+collapsed_icon_svg+'</button></div></div>';
        }
        else if(("topic"==type)||("homepage"==type))
        {
            if("topic"==type)
            {
                var content_type=ret[i][2];       
                if("article"==content_type)
                {
                    var article_id=ret[i][0];
                    var article_title=ret[i][1];
                    var topics=ret[i][3];
                    var click_nums=ret[i][4];
                    var question_title_element='<h2 class="ContentItem-title"><div><a target="_blank" href="/article/'+article_id+'/">'+article_title+'</a></div></h2>';
                    var data_content_url='data-content-url="/article/'+article_id+'/"';
                    var content_type_element='data-content-type="article" data-content-id="'+article_id+'"';
                    var like_element_attr='data-like-type="article" data-like-id="'+article_id+'"';
                    
                    if($.inArray(""+article_id,g_cache_article_id_list)>=0)
                        continue;
                    else
                        g_cache_article_id_list.push(""+article_id);
                }
                else
                {
                    var question_id=ret[i][0];
                    var question_title=ret[i][1];
                    var topics=ret[i][3];
                    var answer_id=ret[i][4];
                    var question_title_element='<h2 class="ContentItem-title"><div><a target="_blank" href="/question/'+question_id+'/?ans='+answer_id+'">'+question_title+'</a></div></h2>';
                    var data_content_url='data-content-url="/question/'+question_id+'/?ans='+answer_id+'"';
                    var content_type_element='data-content-type="answer" data-content-id="'+answer_id+'"';
                    var like_element_attr='data-like-type="answer" data-like-id="'+answer_id+'"';
                    
                    if($.inArray(""+question_id,g_cache_question_id_list)>=0)
                        continue;
                    else
                        g_cache_question_id_list.push(""+question_id);
                }
        
                var answer_push_index=ret[i][5];
                var answer_content=ret[i][6];
                var like_nums=ret[i][7];
                var comment_nums=ret[i][8];
                var author_id=ret[i][9];
                var author_name=ret[i][10];
                var author_avatar=ret[i][11];
                var author_mood=ret[i][12];
                var author_sexual=ret[i][13];
                var author_question_nums=ret[i][14];
                var author_article_nums=ret[i][15];
                var author_answer_nums=ret[i][16];
                var author_followto_nums=ret[i][17];
                var author_follower_nums=ret[i][18];
                var author_followtopic_nums=ret[i][19];
                var author_followquestion_nums=ret[i][20];                              
            }
            else if("homepage"==type)
            {
                var answer_id=ret[i][0];
                var question_id=ret[i][1];
                var question_title=ret[i][2];
                var answer_content=ret[i][3];
                var like_nums=ret[i][4];
                var comment_nums=ret[i][5];
                
                var author_id=ret[i][6];
                var author_name=ret[i][7];
                var author_avatar=ret[i][8];
                var author_mood=ret[i][9];
                
                var question_title_element='<h2 class="ContentItem-title"><div><a target="_blank" href="/question/'+question_id+'/?ans='+answer_id+'">'+question_title+'</a></div></h2>';
                var data_content_url='data-content-url="/question/'+question_id+'/?ans='+answer_id+'"';
                var content_type_element='data-content-type="answer" data-content-id="'+answer_id+'"';
                var like_element_attr='data-like-type="answer" data-like-id="'+answer_id+'"';
            }
            var index_img_url=getIndexImg(answer_content);
            var play_icon_svg='<svg viewBox="0 0 64 64" class="Icon Icon--play" width="50" height="50" aria-hidden="true" style="height: 50px; width: 50px;"><title></title><g><path fill-opacity="0.9" fill="#fff" d="M32,64 C14.326888,64 0,49.673112 0,32 C0,14.326888 14.326888,0 32,0 C49.673112,0 64,14.326888 64,32 C64,49.673112 49.673112,64 32,64 Z M32.2363929,61.6 C48.5840215,61.6 61.8363929,48.3476286 61.8363929,32 C61.8363929,15.6523714 48.5840215,2.4 32.2363929,2.4 C15.8887643,2.4 2.63639293,15.6523714 2.63639293,32 C2.63639293,48.3476286 15.8887643,61.6 32.2363929,61.6 Z"></path>   <circle fill-opacity="0.3" fill="#000" cx="32" cy="32" r="29.6"></circle>   <path fill-opacity="0.9" fill="#fff" d="M43.5634409,30.7271505 C44.6882014,31.4301259 44.6868607,32.5707121 43.5634409,33.2728495 L28.4365591,42.7271505 C27.3117986,43.4301259 26.4,42.9221451 26.4,41.5999847 L26.4,22.4000153 C26.4,21.0745235 27.3131393,20.5707121 28.4365591,21.2728495 L43.5634409,30.7271505 Z"></path></g></svg>';
            var rich_content='<div class="RichContent is-collapsed"><div class="RichContent-content" '+data_content_url+'><div class="RichContent-cover"><div class="RichContent-cover-inner" data-index-img-url="'+index_img_url+'"></div><div class="RichContent-cover-play is-hide">'+play_icon_svg+'</div></div><div class="RichContent-inner"><span class="RichText CopyrightRichText-richText">'+removeImg(answer_content)+'</span></div></div><div class="ContentItem-actions"><span><button class="Button-like-nouse Button Button--plain" type="button" '+like_element_attr+'>'+like_icon_svg+like_nums+'</button></span><button class="Button ContentItem-action Button--plain Button--withIcon Button--withLabel" type="button"><span style="display: inline-flex; align-items: center;">&#8203;'+comment_icon_svg+'</span>'+comment_nums+' 条评论</button>'+share_button+'</div></div>';
        }

        var people_popover_data='data-author-id="'+author_id+'" data-author-name="'+author_name+'" data-author-avatar="'+author_avatar+'" data-author-mood="'+author_mood+'" data-author-sexual="'+author_sexual+'" data-author-answer-nums="'+author_answer_nums+'" data-author-article-nums="'+author_article_nums+'" data-author-follower-nums="'+author_follower_nums+'"';
        var appendElement='<div class="List-item ScrollIntoMark"><div class="ContentItem AnswerItem" '+content_type_element+' data-comment-nums="'+comment_nums+'">'+question_title_element+'<div class="ContentItem-meta"><div class="AnswerItem-meta AnswerItem-meta--related"><div class="AuthorInfo"><span class="UserLink AuthorInfo-avatarWrapper"><a class="UserLink-link PeoplePopover" href="/er/'+author_id+'" '+people_popover_data+' data-toggle="popover" data-placement="right" data-trigger="manual" data-content="null" data-html="true"><img class="Avatar AuthorInfo-avatar" width="40" height="40" src="'+author_avatar+'" srcset="'+author_avatar+'" alt="'+author_name+'"></a></span><div class="AuthorInfo-content"><div class="AuthorInfo-head"><span class="UserLink AuthorInfo-name"><a class="UserLink-link" href="/er/'+author_id+'">'+author_name+'</a></span></div><div class="AuthorInfo-detail"><div class="AuthorInfo-badge"><div class="RichText AuthorInfo-badgeText">'+author_mood+'</div></div></div></div></div></div></div>'+rich_content+'</div></div>';
        
        if("prepend"==direction)
            $("#appendArea").prepend(appendElement);
        else
            $("#appendArea").append(appendElement);
    }
}
function appendAnswerElementCard(ret,type,direction)
{
    ret.sort();
    for(i in ret)
    {
        var content_type=ret[i][2];       
        if("article"==content_type)
        {
            var article_id=ret[i][0];
            var article_title=ret[i][1];
            var topics=ret[i][3];
            var click_nums=ret[i][4];
            var question_element='<h2 class="ContentItem-title"><a href="/article/'+article_id+'/">'+article_title+'</a></h2>';
            var data_content_url='data-content-url="/article/'+article_id+'/"';
            var content_type_element='data-content-type="article" data-content-id="'+article_id+'"';
            var like_element_attr='data-like-type="article" data-like-id="'+article_id+'"';
            
            if($.inArray(""+article_id,g_cache_article_id_list)>=0)
                continue;
            else
                g_cache_article_id_list.push(""+article_id);
        }
        else
        {
            var question_id=ret[i][0];
            var question_title=ret[i][1];
            var topics=ret[i][3];
            var answer_id=ret[i][4];
            var question_element='<h2 class="ContentItem-title"><a href="/question/'+question_id+'/?ans='+answer_id+'">'+question_title+'</a></h2>';
            var data_content_url='data-content-url="/question/'+question_id+'/?ans='+answer_id+'"';
            var content_type_element='data-content-type="answer" data-content-id="'+answer_id+'"';
            var like_element_attr='data-like-type="answer" data-like-id="'+answer_id+'"';
            
            if($.inArray(""+question_id,g_cache_question_id_list)>=0)
                continue;
            else
                g_cache_question_id_list.push(""+question_id);
        }
        var push_index=ret[i][5];
        var content=ret[i][6];
        var like_nums=ret[i][7];
        var comment_nums=ret[i][8];
        var author_id=ret[i][9];
        var author_name=ret[i][10];
        var author_avatar=ret[i][11];
        var author_mood=ret[i][12];
        var author_sexual=ret[i][13];
        var author_question_nums=ret[i][14];
        var author_article_nums=ret[i][15];
        var author_answer_nums=ret[i][16];
        var author_followto_nums=ret[i][17];
        var author_follower_nums=ret[i][18];
        var author_followtopic_nums=ret[i][19];
        var author_followquestion_nums=ret[i][20];
        
        var topics_data='';
        for(i in topics)
        {
            var topic_id=topics[i][0];
            var topic_name=topics[i][1];
            topics_data+='<span style="margin-right:15px;"><a href="/topic/'+topic_id+'/" class="1TopicPopover" data-topic-id="'+topic_id+'" data-toggle="popover" data-placement="bottom" data-trigger="manual" data-content="null" data-html="true">'+topic_name+'</a></span>';
        }
        var topic_element='<div class="Feed-title"><div class="Feed-meta"><span class="Feed-meta-item">'+topics_data+'</span></div></div>';


        
        var index_img_url=getIndexImg(content);
        var people_popover_data='data-author-id="'+author_id+'" data-author-name="'+author_name+'" data-author-avatar="'+author_avatar+'" data-author-mood="'+author_mood+'" data-author-sexual="'+author_sexual+'" data-author-answer-nums="'+author_answer_nums+'" data-author-article-nums="'+author_article_nums+'" data-author-follower-nums="'+author_follower_nums+'"';
        var author_info_element='<div class="AuthorInfo Feed-meta-author AuthorInfo--plain"><span class="UserLink AuthorInfo-avatarWrapper"><a class="UserLink-link PeoplePopover" href="/er/'+author_id+'/" '+people_popover_data+' data-toggle="popover" data-placement="right" data-trigger="manual" data-content="null" data-html="true"><img src="'+author_avatar+'" width="40" height="40"></a></span><div class="AuthorInfo-content"><div class="AuthorInfo-head"><span class="UserLink AuthorInfo-name"><a href="/er/'+author_id+'/" class="UserLink-link 1PeoplePopover" data-author-id="'+author_id+'" data-toggle="popover" data-placement="right" data-trigger="manual" data-content="null" data-html="true">'+author_name+'</a></span></div><div class="AuthorInfo-detail"><div class="AuthorInfo-badge"><div class="RichText AuthorInfo-badgeText">'+author_mood+'</div></div></div></div></div>';
        var answer_element='<div class="ContentItem AnswerItem" '+content_type_element+' data-comment-nums="'+comment_nums+'">'+question_element+'<div class="RichContent is-collapsed"><div class="RichContent-content" '+data_content_url+'><div class="RichContent-cover"><div class="RichContent-cover-inner" data-index-img-url="'+index_img_url+'"></div></div><div class="RichContent-inner"><span class="RichText CopyrightRichText-richText">'+removeImg(content)+'</span></div></div><div class="ContentItem-actions"><span><button class="Button-like-nouse Button Button--plain" type="button" '+like_element_attr+'>'+like_icon_svg+like_nums+'</button></span><button class="Button ContentItem-action Button--plain Button--withIcon Button--withLabel" type="button"><span style="display: inline-flex; align-items: center;">&#8203;'+comment_icon_svg+'</span>'+comment_nums+' 条评论</button>'+share_button+'</div></div></div>';
        var appendElement='<div class="Card QuestionFrame ScrollIntoMark"><div class="Feed">'+topic_element+author_info_element+answer_element+'</div></div>';
        if("prepend"==direction)
            $("#appendArea").prepend(appendElement);
        else
            $("#appendArea").append(appendElement);
    }
}
function appendTopicElement(ret)
{
    for( var i in ret)
    {
        var topic_id=ret[i][0];
        var topic_name=ret[i][1];
        var topic_avatar=ret[i][2];
        var topic_detail=ret[i][3];
        var topic_question_nums=ret[i][4];
        var topic_follower_nums=ret[i][5];
        var topic_pub_date=ret[i][6];
        
        console.log(g_user_follow_topics_list);
        if($.inArray(""+topic_id,g_user_follow_topics_list)>=0)
            var follow_button_data='<button class="Button Button--grey FollowButton" type="button" data-follow-type="topic" data-topic-id="'+topic_id+'" data-followed="true">已关注</button>';
        else
            var follow_button_data='<button class="Button Button--green FollowButton" type="button" data-follow-type="topic" data-topic-id="'+topic_id+'" data-followed="false">关注栏目</button>';

        var data='<div class="List-item"><div class="ContentItem"><div class="ContentItem-main"><div class="ContentItem-image"><span class="TopicLink TopicItem-avatar"><a class="TopicLink-link" target="_blank" href="/topic/'+topic_id+'"><img class="Avatar Avatar--large TopicLink-avatar" width="60" height="60" src="'+topic_avatar+'"  alt="'+topic_name+'"></a></span></div><div class="ContentItem-head"><h2 class="ContentItem-title"><div class="TopicItem-title"><span class="TopicLink TopicItem-name"><a class="TopicLink-link" target="_blank" href="/topic/'+topic_id+'"><span class="RichText">'+topic_name+'</span></a></span></div></h2><div class="ContentItem-meta"><div><div class="ContentItem-status"><div class="ContentItem-statusItem">'+topic_detail+'</div></div></div></div></div><div class="ContentItem-extra">'+follow_button_data+'</div></div></div></div>';
        $("#appendArea").append(data);
    }
} 
function appendInviteElement(ret)
{
    for( i in ret)
    {
        var adept_id=ret[i][0];
        var adept_name=ret[i][1];
        var adept_avatar=ret[i][2];
        var adept_mood=ret[i][3];

        var data='<div class="List-item"><div class="ContentItem"><div class="ContentItem-main"><div class="ContentItem-image"><span class="UserLink UserItem-avatar"><a class="UserLink-link" target="_blank" href="/er/'+adept_id+'"><img class="Avatar Avatar--large UserLink-avatar 1PeoplePopover" width="60" height="60" src="'+adept_avatar+'" srcset="'+adept_avatar+'" alt="'+adept_name+'" data-author-id="'+adept_id+'" data-toggle="popover" data-placement="bottom" data-trigger="manual" data-content="null" data-html="true"></a></span></div><div class="ContentItem-head"><h2 class="ContentItem-title"><div class="UserItem-title"><span class="UserLink UserItem-name"><a class="UserLink-link" target="_blank" href="/er/'+adept_id+'"><span class="RichText">'+adept_name+'</span></a></span></div></h2><div class="ContentItem-meta"><div><div class="ContentItem-status"><div class="ContentItem-statusItem">'+adept_mood+'</div></div></div></div></div><div class="ContentItem-extra"><button class="Button Button--green Invite" type="button" data-receiver="'+adept_id+'">邀请回答</button></div></div></div></div>';
        $(".QuestionInvitation-content.List").append(data);
    }
}
function appendSearchPageElement(ret)
{
    for ( var i in ret)
    {
        var question_id=ret[i][0];
        var question_title=ret[i][1];
        var question_answer_nums=ret[i][2];
        question_title=question_title.replace(g_search_keyword,"<em>"+g_search_keyword+"</em>");
        var data='<div class="List-item"><div class="ContentItem AnswerItem"><h2 class="ContentItem-title"><div><meta itemprop="url" content="/question/'+question_id+'"><a target="_blank" href="/question/'+question_id+'"><span class="Highlight">'+question_title+'</span></a></div></h2></div></div>';
        $("#appendArea").append(data);
    }
}
function pushOneConversationMessagesElement(message_id)
{
    var message_content=$("#letterText").val();
    var date = new Date();
    var time=date.toLocaleTimeString(); 
    var data='<div class="List-item Conversation-messages-item" data-action="delete_conversation_message" data-action-id="'+message_id+'"><a class="zm-item-link-avatar50" href="/er/'+g_user_id+'"><img class="zm-item-img-avatar50" src="'+g_user_avatar+'"></a><div class="zm-pm-item-main"><a class="pm-touser author-link" title="verna wu" href="/er/'+g_user_id+'">我</a>：'+message_content+'</div><div class="zg-gray zu-pm-item-meta"><span class="zg-gray zg-left">'+time+'</span><a class="zg-link-litblue" href="javascript:;" name="delete">删除</a></div></div>';   
    $(".List-item.Conversation-messages-head").after(data);
    checkSettingPage();
}
function appendSettingPageElement(ret)
{
    for(i in ret)
    {
        if("conversations"==g_setting_type)
        {
            var conversation_id=ret[i][0];
            var conversation_delete_id=ret[i][1];
            var conversation_update=ret[i][2];
            var initator_id=ret[i][3];
            var initator_name=ret[i][4];
            var initator_avatar=ret[i][5];
            var parter_id=ret[i][6];
            var parter_name=ret[i][7];
            var parter_avatar=ret[i][8];
            var latest_message_content=ret[i][9];
    
            if (conversation_delete_id==g_user_id) //user have delete this message
                continue;
                
            if(initator_id!=g_user_id)
            {
                var er_id=initator_id;
                var er_name=initator_name;
                var er_avatar=initator_avatar;
            }
            else
            {
                var er_id=parter_id;
                var er_name=parter_name;
                var er_avatar=parter_avatar;
            }

            var data='<div class="List-item Conversations-item" data-action="delete_conversation" data-action-id="'+conversation_id+'" data-receiver-id="'+er_id+'"  data-receiver-name="'+er_name+'"><a class="zm-item-link-avatar50" href="/er/'+er_id+'"><img class="zm-item-img-avatar50" src="'+er_avatar+'"></a><div class="zm-pm-item-main"><a class="pm-touser author-link" href="/er/'+er_id+'">'+er_name+'</a>：'+latest_message_content+'</div><div class="zg-gray zu-pm-item-meta"><span class="zg-gray zg-left">'+conversation_update+'</span><a class="zg-link-litblue" href="javascript:;" name="messages">查看对话</a><span class="zg-bull">|</span><a class="zg-link-litblue" href="javascript:;" name="reply" data-receiver-id="'+er_id+'"  data-receiver-name="'+er_name+'" data-toggle="modal" data-target="#letterModal">回复</a><span class="zg-bull">|</span><a class="zg-link-litblue" href="javascript:;" name="delete">删除</a></div></div>';

            $('#appendArea').append(data);
        }
        else if("conversation_messages"==g_setting_type)
        {
            var message_id=ret[i][0];
            var message_content=ret[i][1];
            var message_status=ret[i][2];
            var message_delete_id=ret[i][3];
            var message_pub_date=ret[i][4];
            var sender_id=ret[i][5];
            var sender_name=ret[i][6];
            var sender_avatar=ret[i][7];
            var receiver_id=ret[i][8];
            var receiver_name=ret[i][9];
            var receiver_avatar=ret[i][10];

            if (message_delete_id==g_user_id) //user have delete this message
            continue;

            if(sender_id==g_user_id)
            {
                var sender_name="我";
                var letter_id=receiver_id;
                var letter_name=receiver_name;
            }
            else
            {
                var letter_id=sender_id;
                var letter_name=sender_name;
            }
            $(".Conversation-messages-head .zg-gray-darker").text(letter_name);
            $(".Conversation-messages-head #letterText").attr("data-receiver-id",letter_id);
            var data='<div class="List-item Conversation-messages-item" data-action="delete_conversation_message" data-action-id="'+message_id+'"><a class="zm-item-link-avatar50" href="/er/'+sender_id+'"><img class="zm-item-img-avatar50" src="'+sender_avatar+'"></a><div class="zm-pm-item-main"><a class="pm-touser author-link" href="/er/'+sender_id+'">'+sender_name+'</a>：'+message_content+'</div><div class="zg-gray zu-pm-item-meta"><span class="zg-gray zg-left">'+message_pub_date+'</span><a class="zg-link-litblue" href="javascript:;" name="delete">删除</a></div></div>';

            $('#appendArea').append(data);
        }
        else if("notifications"==g_setting_type)
        {
            var notification_id=ret[i][0];
            var notification_type=ret[i][1];
            var notification_pub_date=ret[i][2];
            var notification_sender_id=ret[i][3];
            var notification_sender_first_name=ret[i][4];
            var notification_target_id=ret[i][5];
            var notification_target_title=ret[i][6];
            var notification_status=ret[i][7];

            if("invite"==notification_type)
            {
                var question_title=ret[i][7];
                var data='<div class="List-item day"><h3>'+notification_pub_date+'</h3><div><i></i><div><span><span><a href="/er/'+notification_sender_id+'" target="_blank">'+notification_sender_first_name+'</a></span>邀请你回答 <a href="/question/'+notification_target_id+'">'+notification_target_title+'</a></span></div></div></div>';
            }
            $("#appendArea").append(data);
        }
    }
    checkSettingPage();
}
function appendInvitedQuestionElement(ret)
{
    for ( var i in ret)
    {       
        var notification_id=ret[i][0];
        var notification_type=ret[i][1];
        var notification_pub_date=ret[i][2];
        var notification_sender_id=ret[i][3];
        var notification_sender_first_name=ret[i][4];
        var notification_question_id=ret[i][5];
        var notification_question_title=ret[i][6];
        var notification_question_answer_nums=ret[i][7];
        var notification_question_follower_nums=ret[i][8];
        var notification_status=ret[i][9];
        
        var data='<div class="List-item"><div class="ContentItem"><h3 class="ContentItem-title"><div class="QuestionItem-title"><a href="/question/'+notification_question_id+'" target="_blank">'+notification_question_title+'</a></div></h3><div class="ContentItem-status"><span class="ContentItem-statusItem"><a href="/er/'+notification_sender_id+'">'+notification_sender_first_name+'</a></span><span class="ContentItem-statusItem">邀请你回答</span><span class="ContentItem-statusItem">'+notification_pub_date+' </span><span class="ContentItem-statusItem">'+notification_question_answer_nums+' 个回答</span><span class="ContentItem-statusItem">'+notification_question_follower_nums+' 个关注</span></div></div></div>';
        $("#appendArea").append(data);
    }
}
function appendQuestionElement(ret)
{
    for (var i in ret)
    {
        var question_id=ret[i][0];
        var question_title=ret[i][1];
        var question_answer_nums=ret[i][2];
        var question_follower_nums=ret[i][3];
        var question_pubdate=ret[i][4].split(".")[0];
        
        var data='<div class="List-item"><div class="ContentItem"><h2 class="ContentItem-title"><div class="QuestionItem-title"><a href="/question/'+question_id+'" target="_blank">'+question_title+'</a></div></h2><div class="ContentItem-status"><span class="ContentItem-statusItem">'+question_pubdate+'</span><span class="ContentItem-statusItem">'+question_answer_nums+' 个回答</span><span class="ContentItem-statusItem">'+question_follower_nums+' 个关注</span></div></div></div>';
        $("#appendArea").append(data);
    }
}
function appendFollowOrMoreElement(ret)
{
    for (var i in ret)
    {
        if(("followtos"==g_subcmd)||("followers"==g_subcmd))
        {
            var people_id=ret[i][0];
            var people_name=ret[i][1];
            var people_avatar=ret[i][2];
            var people_mood=ret[i][3];
            var people_sexual=ret[i][4];
            var people_anwser_nums=ret[i][5];
            var people_article_nums=ret[i][6];
            var people_follower_nums=ret[i][7];
            if("f"==people_sexual)
            {
                var who="she";
                var who_han="她";
            }
            else
            {
                var who="he";
                var who_han="他";
            }
            if($.inArray(""+people_id,g_user_follow_peoples_list)>=0)
                var followed_html='<button class="Button FollowButton Button--primary Button--grey" type="button" data-er-id="'+people_id+'" data-er-sexual="'+people_sexual+'" data-follow-type="people" data-followed="true" data-who="'+who+'">已关注</button>';
            else
                var followed_html='<button class="Button FollowButton Button--primary Button--green" type="button" data-er-id="'+people_id+'" data-er-sexual="'+people_sexual+'" data-follow-type="people" data-followed="false" data-who="'+who+'">关注'+who_han+'</button>';
            //if("1"==people_followed_each)
            //    var followed_each_html='<span class="FollowStatus">相互关注</span>';
            //else
                var followed_each_html='';
            var data='<div class="List-item"><div class="ContentItem"><div class="ContentItem-main"><div class="ContentItem-image"><span class="UserLink UserItem-avatar"><div class="Popover"><div id="Popover-28784-64463-toggle" aria-haspopup="true" aria-expanded="false" aria-owns="Popover-28784-64463-content"><a class="UserLink-link" target="_blank" href="/er/'+people_id+'"><img class="Avatar Avatar--large UserLink-avatar" width="60" height="60" src="'+people_avatar+'" srcset="'+people_avatar+'" alt="'+people_name+'"></a></div></div></span></div><div class="ContentItem-head"><h2 class="ContentItem-title"><div class="UserItem-title"><span class="UserLink UserItem-name"><div class="Popover"><div id="Popover-28784-44728-toggle" aria-haspopup="true" aria-expanded="false" aria-owns="Popover-28784-44728-content"><a class="UserLink-link" data-za-detail-view-element_name="User" target="_blank" href="/er/'+people_id+'">'+people_name+'</a></div></div></span>'+followed_each_html+'</div></h2><div class="ContentItem-meta"><div><div class="RichText">'+people_mood+'</div><div class="ContentItem-status"><span class="ContentItem-statusItem">'+people_anwser_nums+' 回答</span><span class="ContentItem-statusItem">'+people_article_nums+' 文章</span><span class="ContentItem-statusItem">'+people_follower_nums+' 关注者</span></div></div></div></div><div class="ContentItem-extra">'+followed_html+'</div></div></div></div>';
            $("#appendArea").append(data);
        }
        else if("topics"==g_subcmd)
        {
            var topic_id=ret[i][0];
            var topic_name=ret[i][1];
            var topic_avatar=ret[i][2];
            var topic_detail=ret[i][3];
            
            var data='<div class="List-item"><div class="ContentItem"><div class="ContentItem-main"><div class="ContentItem-image"><img class="Avatar Avatar--large" width="60" height="60" src="'+topic_avatar+'" srcset="'+topic_avatar+' 2x"></div><div class="ContentItem-head"><h2 class="ContentItem-title"><a class="TopicLink" href="/topic/'+topic_id+'" target="_blank"><div class="Popover"><div id="Popover-92518-2569-toggle" aria-haspopup="true" aria-expanded="false" aria-owns="Popover-92518-2569-content">'+topic_name+'</div></div></a></h2><div class="ContentItem-meta"><div class="ContentItem-status">'+topic_detail+'</div></div></div></div></div></div>';
            $("#appendArea").append(data);
        }
        else if("questions"==g_subcmd)
        {
            var question_id=ret[i][0];
            var question_title=ret[i][1];
            var question_answer_nums=ret[i][2];
            var question_follower_nums=ret[i][3];
            var question_pubdate=ret[i][4];
            var data='\
                    <div class="List-item"><div class="ContentItem" ><h2 class="ContentItem-title"><div class="QuestionItem-title"><a href="/question/'+question_id+'" target="_blank">'+question_title+'</a></div></h2><div class="ContentItem-status"><span class="ContentItem-statusItem">'+question_pubdate+'</span><span class="ContentItem-statusItem">'+question_answer_nums+' 个回答</span><span class="ContentItem-statusItem">'+question_follower_nums+' 个关注</span></div></div></div>';
            $("#appendArea").append(data);
        }
    }
}
function appendFollowOrMoreHead()
{       
    var data='<div class="List" id="Profile-following"><div class="List-header"><h4 class="List-headerText"><div class="SubTabs"><a class="SubTabs-item" href="/er/'+g_er_id+'/following/followtos">'+g_who_han+'关注的人</a><a class="SubTabs-item" href="/er/'+g_er_id+'/following/followers">关注'+g_who_han+'的人</a><a class="SubTabs-item" href="/er/'+g_er_id+'/following/topics">'+g_who_han+'关注的栏目</a><a class="SubTabs-item" href="/er/'+g_er_id+'/following/questions">'+g_who_han+'关注的问题</a></div></h4></div><div id="appendArea"></div></div>';
    $("#profileMainContent").append(data);
    
    $(".SubTabs-item").each(function(){
        if($(this).attr("href"))
        {
            if($(this).attr("href").indexOf(g_subcmd)>-1)
                $(this).addClass("is-active");
        }
    });
}
function appendLetterModal()
{
    var close_icon_svg='<svg class="Zi Zi--Close Modal-closeIcon" fill="currentColor" viewBox="0 0 24 24" width="24" height="24"><path d="M13.486 12l5.208-5.207a1.048 1.048 0 0 0-.006-1.483 1.046 1.046 0 0 0-1.482-.005L12 10.514 6.793 5.305a1.048 1.048 0 0 0-1.483.005 1.046 1.046 0 0 0-.005 1.483L10.514 12l-5.208 5.207a1.048 1.048 0 0 0 .006 1.483 1.046 1.046 0 0 0 1.482.005L12 13.486l5.207 5.208a1.048 1.048 0 0 0 1.483-.006 1.046 1.046 0 0 0 .005-1.482L13.486 12z" fill-rule="evenodd"></path></svg>';
    var data='<div class="modal fade" id="letterModal" tabindex="0" role="dialog" aria-labelledby="letterModalLabel" aria-hidden="true"><div class="modal-dialog lettermodal"><div class="Modal-inner"><h3 class="Modal-title">发送私信</h3><div class="Modal-content"><div class="Messages-newDialog"><div class="Messages-receiver"><span class="Messages-receiverInfo" data-receiver-id="">who</span></div><div class="Messages-sendContent Input-wrapper Input-wrapper--spread Input-wrapper--multiline"><textarea id="letterTextModal" rows="5" class="Input" placeholder="私信内容"></textarea></div><span class="Messages-warning"></span><div class="ModalButtonGroup ModalButtonGroup--vertical"><button class="Button Messages-sendButton Button--primary Button--green" type="button" onclick="sendLetterViaModal()">发送</button></div></div></div></div><button class="Button Modal-closeButton Button--plain" data-dismiss="modal" aria-label="关闭" type="button">'+close_icon_svg+'</button></div></div>';

    $("body").append(data);
    
    $("#letterModal").on("show.bs.modal", function(){
        $(".PeoplePopover").popover("hide");
    });
}
function invite()
{
    $(".Invite").each(function(index,element){
        $(element).click(function(){
            receiver=$(element).attr("data-receiver");
            if("true"==g_lock_ajax)
                return;
            g_lock_ajax="true";
            $.post("/ajax/invite/",{question:g_question_id,to:receiver},function(ret){
                $(element).attr("disabled","").text("已邀请");
                g_lock_ajax="false";
            });
        });
    });
}
function showInvite()
{
    var topics="";
    $(".TopicLink").each(function(){
        topics+=($(this).attr("data-topic-id"))+";";
    });
    if("true"==g_lock_ajax)
        return;
    g_lock_ajax="true";
    $.post("/ajax/topic_adept/",{"topics":topics},function(ret){
        if("fail"!=ret)
        {
            $(".QuestionInvitation-content.List").empty();
            appendInviteElement(ret);
            $("#inviteModal").modal('show');
            checkSets();
            invite();
        }
        g_lock_ajax="false";
    })
}
function sendLetter()
{
    var value=$("#letterText").val();
    var er_id=$("#letterText").attr("data-receiver-id");
    if("true"==g_lock_ajax)
        return;
    g_lock_ajax="true";
    $.post("/ajax/send_message/"+er_id+"/",{"content":value},function(ret){
        if("fail"!=ret)
        {
            var message_id=ret;
            pushOneConversationMessagesElement(message_id);
        }
        g_lock_ajax="false";
    });
}
function sendLetterViaModal()
{
    var value=$("#letterTextModal").val();
    var er_id=$(".Messages-receiverInfo").attr("data-receiver-id");
    console.log(value);
    $('#letterModal').modal('toggle');
    if("true"==g_lock_ajax)
        return;
    g_lock_ajax="true";
    $.post("/ajax/send_message/"+er_id+"/",{"content":value},function(ret){
        if("fail"!=ret)
        {
            console.log(ret);
        }
        g_lock_ajax="false";
    });
}
function setLetterReceiver(id,name)
{
    $(".Messages-receiverInfo").attr("data-receiver-id",id);
    $(".Messages-receiverInfo").text(name);
}

function checkFollow()
{
    $(".FollowButton").off("click");
    $(".FollowButton").each(function(){
        var button=$(this);
        button.click(function(){
            console.log("checkFollow");
            if(false==veriLogin())
                return;
            if("true"==button.attr("data-followed"))
            {
                follow_action="0";
            }
            else
            {
                follow_action="1";
            }
            if("people"==button.attr("data-follow-type"))
            {
                var who=button.attr("data-who");
                if ("she"==who)
                    var follow_tips="关注她";
                else
                    var follow_tips="关注他";
                var follow_type="people";
                var update_value_type="people-followed";
                var follow_id=button.attr("data-er-id");
            }
            else if("topic"==button.attr("data-follow-type"))
            {
                var follow_tips="关注栏目";
                var follow_type="topic";
                var update_value_type="topic-followed";
                var follow_id=button.attr("data-topic-id");
            }
            else if("question"==button.attr("data-follow-type"))
            {
                var follow_tips="关注问题";
                var follow_type="question";
                var update_value_type="question-followed";
                var follow_id=button.attr("data-question-id");
            }
            var post_data={'follow_type':follow_type,"follow_id":follow_id,"follow_action":follow_action};
            var url="/ajax/follow/";
            if("true"==g_lock_ajax)
                return;
            g_lock_ajax="true";
            $.post(url,post_data,function(ret){
                if("fail"!=ret)
                {
                    if("true"==button.attr("data-followed"))
                    {
                        if("alltopics"==g_module)
                            button.removeClass("zg-unfollow").addClass("zg-follow").removeClass("Button--grey").addClass("Button--green").text(follow_tips);
                        else
                            button.removeClass("Button--grey").addClass("Button--green").text(follow_tips);
                        button.attr("data-followed","false");
                    }
                    else
                    {
                        if("alltopics"==g_module)
                            button.removeClass("zg-follow").addClass("zg-unfollow").removeClass("Button--green").addClass("Button--grey").text("已关注");
                        else
                            button.removeClass("Button--green").addClass("Button--grey").text("已关注");
                        button.attr("data-followed","true");
                    }
                    
                    if("question"==follow_type)
                    {
                        delCookie("ufq"+g_user_token);
                        setCookie("ufq"+g_user_token,utf8_to_b64(ret[1]),g_cookie_expire);
                        var user_follow_questions=getCookie("ufq"+g_user_token);
                        g_user_follow_questions_list=b64_to_utf8(user_follow_questions).split(",");                        
                    }
                    else if("people"==follow_type)
                    {
                        delCookie("ufp"+g_user_token);
                        setCookie("ufp"+g_user_token,utf8_to_b64(ret[1]),g_cookie_expire);
                        var user_follow_peoples=getCookie("ufp"+g_user_token);
                        g_user_follow_peoples_list=b64_to_utf8(user_follow_peoples).split(",");
                    }
                    else if("topic"==follow_type)
                    {
                        delCookie("uft"+g_user_token);
                        setCookie("uft"+g_user_token,utf8_to_b64(ret[1]),g_cookie_expire);
                        var user_follow_topics=getCookie("uft"+g_user_token);
                        g_user_follow_topics_list=b64_to_utf8(user_follow_topics).split(",");
                    }
                    updateFollowValue(update_value_type,ret[0]);
                }
                g_lock_ajax="false";
            });  
        });
    });  

    function updateFollowValue(type,value)
    {
        $(".NumberBoard-value").each(function(){
            var item=$(this);
            if(type==item.attr("data-update-value-type"))
                item.text(value)
        });  
    }

}

function checkContentClick(){
    $(".RichContent-content").off("click");
    $(".RichContent-content").each(function(){
        var index_img_url=$(this).find(".RichContent-cover-inner").attr("data-index-img-url")
        if("null"==index_img_url)
        {
            $(this).find(".RichContent-cover").addClass("is-hide");
        }
        else
        {
            $(this).find(".RichContent-cover-inner").append('<img src="'+index_img_url+'">');
        }
        $(this).click(function(){
                var alink=$(this).attr("data-content-url");
                location.href=alink;
        });
    });
    
}

function checkContentCollapse(){
    $(".ContentItem-less").off("click");
    $(".ContentItem-less").each(function(){
        $(this).click(function(){
            $(this).addClass("is-hide");
            $(this).parent().siblings(".RichContent-expand").children(".ContentItem-more").removeClass("is-hide");
            $(this).parents(".RichContent").addClass("is-collapsed");
            $(this).parent().siblings(".RichContent-expand").children(".RichContent-inner").css("max-height","400px");
            
            if($(this).parents(".ScrollIntoMark").length>0)
            {
                var id=$(this).parents(".ScrollIntoMark").attr("id");
                document.getElementById(id).scrollIntoView();
                $(this).parents(".ScrollIntoMark").removeAttr("id");
            }
        });
    });
}

function checkContentExpand(){
    $(".RichContent-expand").off("click");
    $(".RichContent-expand").each(function(){
        console.log($(this).height());
        if($(this).height()>=400)
        {
            $(this).find(".ContentItem-more").removeClass("is-hide");
            $(this).parents(".RichContent").addClass("is-collapsed");
        }
        else
        {
            $(this).find(".ContentItem-more").remove();
            $(this).siblings(".ContentItem-actions").find(".ContentItem-less").remove();
        }
        if($(this).parents(".ScrollIntoMark").length>0)
        {
            var randomId=""+Math.random();
            $(this).parents(".ScrollIntoMark").attr("id",randomId);
        }
        $(this).click(function(){
            $(this).children(".ContentItem-more").addClass("is-hide");
            $(this).siblings(".ContentItem-actions").children(".ContentItem-less").removeClass("is-hide");
            $(this).parent().removeClass("is-collapsed");
            $(this).children(".RichContent-inner").css("max-height","");
            
            if($(this).parents(".ScrollIntoMark").length>0)
            {
                var randomId=""+Math.random();
                $(this).parents(".ScrollIntoMark").attr("id",randomId);
            }
        });
    });
}

function checkSearchSelect()
{
    $(".Menu-item").off("mouseenter mouseleave");
    $(".Menu-item").on("mouseenter mouseleave",function(event){
        if(event.type=="mouseenter")
        {
            $(this).addClass("is-active");
        }
        else if(event.type=="mouseleave"){
            $(this).removeClass("is-active");
        }
    
    });
}
function checkSearch()
{
    var input_lock="false";
    
    $("#searchInput").off("keyup click");
    $("#searchInput").on("keyup click",function(){
        if("false"==input_lock)
        {
            var keyword=$(this).val();
            g_search_keyword=keyword.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g,"");
            if (""!=g_search_keyword)
            {
                $(".Icon.Icon--search").css({"fill":"#228b22"});
                var type="all";
                var order=1;
                var start=0;
                var end=5;
                if("true"==g_lock_ajax)
                    return;
                g_lock_ajax="true";
                $.post('/ajax/search/'+type+'/'+order+'/'+start+'/'+end+'/',{keyword:g_search_keyword},function(ret)
                {
                    if("fail"!=ret)
                    {                        
                        appendPopoverSearchElement(ret,g_search_keyword);
                        checkSearchSelect();
                    }
                    g_lock_ajax="false";
                });
            }
            else
            {
                $(".Icon.Icon--search").css({"fill":"#afbdcf"});
                $('#searchInput').popover('hide');
            }
        }
    });
    
        
    $("#searchInput").off("blur");
    $("#searchInput").on("blur",function(){
        input_lock="false";
        $("#searchInput").popover("hide");
    });
        
    $("#searchInput").off("compositionstart");
    $("#searchInput").on("compositionstart",function(e){
        input_lock="true";
    });
    
    $("#searchInput").off("compositionend");
    $("#searchInput").on("compositionend",function(e){
        input_lock="false";
    });    
}

function checkPopoverShow(){
   
    $('.PeoplePopover').off("mouseenter mouseleave");
    $('.PeoplePopover').on("mouseenter mouseleave",function(event){
        if(event.type=="mouseenter")
        {
            var element=$(this);//.children(".PeoplePopover");
            var author_id=element.attr("data-author-id");
            var author_name=element.attr("data-author-name");
            var author_avatar=element.attr("data-author-avatar");
            var author_mood=element.attr("data-author-mood");
            var author_sexual=element.attr("data-author-sexual");
            var author_answer_nums=element.attr("data-author-answer-nums");
            var author_article_nums=element.attr("data-author-article-nums");
            var author_follower_nums=element.attr("data-author-follower-nums");
                           
            if("f"==author_sexual)
            {
                var who="she";
                var who_han="她";
            }
            else
            {
                var who="he";
                var who_han="他";
            }
            
            var data1='<div><div class="HoverCard-titleContainer HoverCard-titleContainer--noAvatar"><img class="Avatar Avatar--large HoverCard-avatar" width="68" height="68" src="'+author_avatar+'" srcset="'+author_avatar+'"><div class="HoverCard-titleText"><div class="HoverCard-title"><span><a href="/er/'+author_id+'">'+author_name+'</a></span></div><div class="HoverCard-subtitle"><span class="RichText">'+author_mood+'</span></div></div></div></div><div class="HoverCard-item"><div class="NumberBoard"><a class="Button NumberBoard-item Button--plain" type="button" href="/er/'+author_id+'/answers"><div class="NumberBoard-name">回答</div><div class="NumberBoard-value">'+author_answer_nums+'</div></a><a class="Button NumberBoard-item Button--plain" type="button" href="/er/'+author_id+'/posts"><div class="NumberBoard-name">文章</div><div class="NumberBoard-value">'+author_article_nums+'</div></a><a class="Button NumberBoard-item Button--plain" type="button" href="/er/'+author_id+'/followers"><div class="NumberBoard-name">关注者</div><div class="NumberBoard-value" data-update-value-type="people-followed">'+author_follower_nums+'</div></a></div>';
            if($.inArray(""+author_id,g_user_follow_peoples_list)>=0)
                var data2='<div class="MemberButtonGroup ProfileButtonGroup HoverCard-buttons"><button class="Button FollowButton Button--primary Button--grey" type="button" data-er-id="'+author_id+'" data-follow-type="people" data-followed="true" data-who="'+who+'">已关注</button><button class="Button" type="button" data-toggle="modal" data-target="#letterModal">'+letter_icon_svg+'<span>发私信</span></button></div></div>';
            else
                var data2='<div class="MemberButtonGroup ProfileButtonGroup HoverCard-buttons"><button class="Button FollowButton Button--primary Button--green" type="button" data-er-id="'+author_id+'" data-follow-type="people" data-followed="false" data-who="'+who+'">关注'+who_han+'</button><button class="Button" type="button" data-toggle="modal" data-target="#letterModal">'+letter_icon_svg+'<span>发私信</span></button></div></div>';
            var data=data1+data2;
            element.attr("data-content",data);
            element.popover('show');                    
            setLetterReceiver(author_id,author_name);
            checkFollow(); 
            $(".popover").on("mouseleave",function(){
                element.popover('hide'); 
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
                var element=$(this);//.children(".TopicPopover");              
                var topic_id=element.attr("data-topic-id"); 
                var topic_name=element.attr("data-topic-name"); 
                var topic_avatar=element.attr("data-topic-avatar"); 
                var topic_detail=element.attr("data-topic-detail"); 
                var topic_question_nums=element.attr("data-topic-question-nums"); 
                var topic_article_nums=element.attr("data-topic-article-nums");
                var topic_follower_nums=element.attr("data-topic-follower-nums");                 
                                                 
                var data1='<div><div class="HoverCard-titleContainer HoverCard-titleContainer--noAvatar"><img class="Avatar Avatar--large HoverCard-avatar" width="68" height="68" src="'+topic_avatar+'" srcset="'+topic_avatar+'"><div class="HoverCard-titleText"><div class="HoverCard-title"><a target="_blank" href="/topic/'+topic_id+'">'+topic_name+'</a></div></div></div></div><div class="HoverCard-item"><div class="NumberBoard"><a class="Button NumberBoard-item Button--plain" href="/topic/'+topic_id+'/questions" type="button"><div class="NumberBoard-name">问题&nbsp;</div><div class="NumberBoard-value">'+topic_question_nums+'</div></a><a class="Button NumberBoard-item Button--plain" href="/topic/'+topic_id+'/followers" type="button"><div class="NumberBoard-name">关注者</div><div class="NumberBoard-value" data-update-value-type="topic-followed">'+topic_follower_nums+'</div></a></div>';
                if($.inArray(""+topic_id,g_user_follow_topics_list)>=0)
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
        else if(event.type=="mouseleave"){
                var element=$(this);
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
        $("#NotificationPopover").popover("hide");
        $("#MenuPopover").popover("hide");
        e.stopPropagation();
        
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
        $("#NotificationPopover").popover("hide");
        $("#MessagePopover").popover("hide");
        e.stopPropagation();
        var er_id=$(this).attr("data-er-id");
        var data='<div class="Menu Home-menu"><a class="Button Menu-item AppHeaderProfileMenu-item Button--plain" type="button" href="/er/'+er_id+'/"><svg viewBox="0 0 20 20" class="Icon Button-icon Icon--profile" width="14" height="16" aria-hidden="true" style="height: 16px; width: 14px;"><title></title><g><path d="M13.4170937,10.9231839 C13.0412306,11.5757324 12.5795351,12.204074 12.6542924,12.7864225 C12.9457074,15.059449 18.2164534,14.5560766 19.4340179,15.8344151 C20,16.4286478 20,16.4978969 20,19.9978966 C13.3887136,19.9271077 6.63736785,19.9978966 0,19.9978966 C0.0272309069,16.4978969 0,16.5202878 0.620443914,15.8344151 C1.92305664,14.3944356 7.20116276,15.1185829 7.40016946,12.7013525 C7.44516228,12.1563518 7.02015319,11.5871442 6.63736814,10.9228381 C4.51128441,7.2323256 3.69679769,4.67956187e-11 10,9.32587341e-14 C16.3032023,-4.66091013e-11 15.4216968,7.4429255 13.4170937,10.9231839 Z"></path></g></svg>我的主页</a><a class="Button Menu-item AppHeaderProfileMenu-item Button--plain" href="/settings/?sub=profile" type="button"><svg viewBox="0 0 20 20" class="Icon Button-icon Icon--setting" width="14" height="16" aria-hidden="true" style="height: 16px; width: 14px;"><title></title><g><path d="M18.868 15.185c-.164.096-.315.137-.452.137-.123 0-1.397-.26-1.617-.233-1.355.013-1.782 1.275-1.836 1.74-.055.454 0 .893.19 1.304.138.29.125.577-.067.85-.863.893-2.165 1.016-2.357 1.016-.123 0-.247-.055-.356-.15-.11-.097-.685-1.14-1.07-1.47-1.303-.954-2.246-.328-2.63 0-.397.33-.67.7-.835 1.126-.07.18-.18.302-.33.37-1.354.426-2.918-.92-3.014-1.056-.082-.11-.123-.22-.123-.356-.014-.138.383-1.276.342-1.688-.342-1.9-1.836-1.687-2.096-1.673-.303.014-.604.068-.92.178-.205.056-.396.03-.588-.054-.888-.462-1.137-2.332-1.11-2.51.055-.315.192-.52.438-.604.425-.164.81-.452 1.15-.85.932-1.262.344-2.25 0-2.634-.34-.356-.725-.645-1.15-.81-.137-.04-.233-.15-.328-.315C-.27 6.07.724 4.95.978 4.733c.255-.22.6-.055.723 0 .426.164.878.22 1.344.15C4.7 4.636 4.784 3.14 4.81 2.908c.015-.247-.11-1.29-.136-1.4-.027-.123-.014-.22.027-.315C5.318.178 7.073 0 7.223 0c.178 0 .33.055.44.178.108.124.63 1.11 1 1.4.398.338 1.582.83 2.588.013.398-.273.96-1.288 1.083-1.412.123-.123.26-.178.384-.178 1.56 0 2.33 1.03 2.438 1.22.083.124.096.248.07.37-.03.152-.33 1.153-.262 1.606.366 1.537 1.384 1.742 1.89 1.783.494.027 1.645-.357 1.81-.344.164.014.315.083.424.206.535.31.85 1.715.905 2.14.027.233-.014.44-.11.562-.11.138-1.165.714-1.48 1.112-.855.982-.342 2.25-.068 2.606.26.37 1.22.905 1.288.96.15.137.26.302.315.494.146 1.413-.89 2.387-1.07 2.47zm-8.905-.535c.644 0 1.246-.123 1.822-.356.575-.248 1.082-.59 1.493-1.016.425-.425.754-.92 1-1.495.247-.562.357-1.18.357-1.81 0-.66-.11-1.262-.356-1.825-.248-.562-.577-1.056-1.002-1.48-.41-.427-.918-.756-1.493-1.003-.576-.233-1.178-.357-1.822-.357-.644 0-1.247.124-1.81.357-.56.247-1.067.576-1.478 1.002-.425.425-.768.92-1 1.48-.247.564-.37 1.167-.37 1.826 0 .644.123 1.248.37 1.81.232.563.575 1.07 1 1.495.424.426.917.768 1.48 1.016.56.233 1.164.356 1.808.356z"></path></g></svg>设置</a><a class="Button Menu-item AppHeaderProfileMenu-item Button--plain" href="/exit/" type="button"><svg viewBox="0 0 20 20" class="Icon Button-icon Icon--logout" width="14" height="16" aria-hidden="true" style="height: 16px; width: 14px;"><title></title><g><path d="M0 10C0 7.242 1.154 4.58 3.167 2.697c.51-.477 1.31-.45 1.79.06.475.51.45 1.31-.06 1.787C3.37 5.975 2.53 7.91 2.53 10c0 4.118 3.35 7.468 7.47 7.468 4.12 0 7.47-3.35 7.47-7.47 0-2.04-.81-3.948-2.28-5.37-.5-.485-.514-1.286-.028-1.788.485-.5 1.286-.517 1.79-.03C18.915 4.712 20 7.265 20 10c0 5.512-4.486 9.998-10 9.998s-10-4.486-10-10zm8.7-.483V1.26C8.7.564 9.26 0 9.96 0c.695 0 1.26.564 1.26 1.26v8.257c0 .696-.565 1.26-1.26 1.26-.698 0-1.26-.564-1.26-1.26z"></path></g></svg>退出</a></div>';
        $('#MenuPopover').attr("data-content",data);
        $('#MenuPopover').popover('show');
        
        $(".Menu.Home-menu").click(function(e){
            e.stopPropagation();
        });

    });
    
}

function checkSmsSend()
{
    $(".SignFlow-smsInputButton").off("click");
    $(".SignFlow-smsInputButton").click(function(){
        var is_counting=$(this).hasClass("is-counting");
        if(is_counting)
        {
            console.log("counting,can`t click");
        }
        else
        {
            if("sign"==g_module)
                var value=$("input[name='regPhoneNo']").val();
            else
                var value=$("input[name='phoneNo']").val();
            console.log(value);
            var reg = /^1[3|4|5|7|8][0-9]{9}$/;
            var is_phone_no=reg.test(value)
            if(is_phone_no)
            {
                g_countdown_secs=59;
                $(this).addClass("is-counting").empty().append('<span id="counting-num">59</span>秒后可重发');
                setTimeout("countDown()",1000);
                setCookie("countdown",g_countdown_secs,g_countdown_secs);
                if("sign"==g_module)
                {
                    var post_data={"phone_no":value,"type":"register"};
                }
                else if("misc"==g_module)
                {
                    var post_data={"phone_no":value,"type":"password_reset"};
                }
                if("true"==g_lock_ajax)
                    return;
                g_lock_ajax="true";
                $.post("/ajax/send_sms/",post_data,function(ret){
                    if("fail"!=ret)
                    {
                        if("registered"==ret)
                        {
                            $(".SignFlow-accountInputContainer>.SignFlowInput-errorMask").removeClass("SignFlowInput-errorMask--hidden").text("该手机号已注册");
                        }
                        else if("unregistered"==ret)
                        {
                            $(".SignFlow-accountInputContainer>.SignFlowInput-errorMask").removeClass("SignFlowInput-errorMask--hidden").text("该手机号未注册，无此用户");
                        }
                        else
                        {
                            $(".StepHeader-subtitle").text("验证码已发送到您的手机上，请查看并输入");
                        }
                    }
                    g_lock_ajax="false";
                });
            }
            else
            {
                console.log("phone no error");
                $(".SignFlow-accountInputContainer>.SignFlowInput-errorMask").removeClass("SignFlowInput-errorMask--hidden").text("手机号格式错误");
            }
        }
        
    });
}
function checkSignAndMiscPage()
{
    //function checkErrorMask()
    //{
    $(".SignFlowInput-errorMask").click(function(){
        console.log("error mask click");
        $(this).addClass("SignFlowInput-errorMask--hidden");
        $(this).siblings(".Input-wrapper").children(".Input").val("").focus();
    });
    //}

    //function checkSwithPassword()
    //{
    $(".SignFlow-switchPassword").off("click");
    $(".SignFlow-switchPassword").click(function(){
        var input=$(this).parents(".SignFlow-password").find(".Input");
        if("password"==input.attr("type"))
        {
            input.attr("type","text");
            var password_icon='<svg width="24" height="20" viewBox="0 0 24 24" class="Icon SignFlow-switchPasswordIcon Icon--read" aria-hidden="true" style="vertical-align: middle; height: 20px; width: 24px;"><title></title><g><title>Read</title><path d="M1 11.5C1 15 7 19 12 19s11-4 11-7.5S17 4 12 4 1 8 1 11.5zm11 5c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm-3-5c0 1.66 1.34 3 3 3s3-1.34 3-3-1.34-3-3-3-3 1.34-3 3z" fill-rule="evenodd"></path></g></svg>';
        }
        else
        {
            input.attr("type","password");
            var password_icon='<svg width="24" height="20" viewBox="0 0 24 24" class="Icon SignFlow-switchPasswordIcon Icon--inconspicuous" aria-hidden="true" style="vertical-align: middle; height: 20px; width: 24px;"><title></title><g><title>Inconspicuous</title><path d="M17.007 11.504c0 .65-.13 1.26-.36 1.83l3 3.073S23 14.136 23 11.504C23 8.008 17.255 4 11.995 4c-1.4 0-2.741.25-3.982.701l2.161 2.16c.57-.23 1.18-.36 1.831-.36a5.004 5.004 0 0 1 5.002 5.003zM2.57 4.342l2.067 2.075C3.499 7.258 1 9.119 1 11.504c0 3.336 5.79 7.503 11.005 7.503 1.55 0 3.031-.3 4.382-.84l.42.42 2.125 2.118s.782.571 1.314 0-.074-1.305-.074-1.305L3.955 3.183s-.76-.742-1.385-.19c-.626.554 0 1.35 0 1.35zm4.963 4.96l1.55 1.552c-.05.21-.08.43-.08.65 0 1.66 1.341 3.001 3.002 3.001.22 0 .44-.03.65-.08l1.551 1.551c-.67.33-1.41.53-2.2.53a5.004 5.004 0 0 1-5.003-5.002c0-.79.2-1.53.53-2.201zm4.312-.78l3.151 3.152.02-.16c0-1.66-1.34-3.001-3.001-3.001l-.17.01z" fill-rule="evenodd"></path></g></svg>';
        }
        $(this).empty().append(password_icon);
    });
    //}

    $("#switchRegisterLogin").click(function(){
        var swith_element=$(".SignContainer-switch");
        if("login"==swith_element.attr("data-action"))
        {
            $(this).text("登录");
            $("#registerLoginText").text("已有帐号？");
            swith_element.attr("data-action","register");
            $(".SignFlowHeader-title").text("注册大农令");
            $(".SignFlowHeader-slogen").text("注册大农令，发现更大的世界");
            $("#register").removeClass("is-hide");
            $("#login").addClass("is-hide");
        }
        else
        {
            $(this).text("注册");
            $("#registerLoginText").text("没有帐号？");
            swith_element.attr("data-action","login");
            $(".SignFlowHeader-title").text("登录大农令");
            $(".SignFlowHeader-slogen").text("登录大农令，发现更大的世界");
            $("#register").addClass("is-hide");
            $("#login").removeClass("is-hide");
        }
    });
    
    $(".Login-cannotLogin").click(function(){
        location.href="/account/?arg=password_reset";
    });
    
    $(".Icon.Icon--remove").click(function(){
        console.log("Icon click");
        location.href="/";
    });
    
    
}
function checkRegisterValid()
{
    console.log("need checkRegisterValid");
    var result=true;
    
    var value=$("input[name='regPhoneNo']").val();
    var reg = /^1[3|4|5|7|8][0-9]{9}$/;
    var is_check=reg.test(value);
    if(!is_check)
    {
        console.log("phone no error");
        $(".SignFlow-accountInputContainer>.SignFlowInput-errorMask").removeClass("SignFlowInput-errorMask--hidden").text("手机号格式错误");
        result=false;
    }
    
    var value=$("input[name='digits']").val();
    var reg = /^[0-9]{6}$/;
    var is_check=reg.test(value);
    if(!is_check)
    {
        console.log("verification code error");
        $(".SignFlow-smsInput>.SignFlowInput-errorMask").removeClass("SignFlowInput-errorMask--hidden").text("验证码格式错误");
        result=false;
    }
    
    var value=$("input[name='nickname']").val();
    if(value.length>=30)
    {
        console.log("nickname too long:"+value.length);
        $(".SignFlow-username>.SignFlowInput>.SignFlowInput-errorMask").removeClass("SignFlowInput-errorMask--hidden").text("输入的昵称太长");
        result=false;
    }
    
    var value=$("input[name='regPassword']").val();
    var reg=/^[A-Za-z0-9]{6,18}$/;//    /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,18}$/;
    var is_check=reg.test(value);
    if(!is_check)
    {
        console.log("password error");
        $(".SignFlow-password>.SignFlowInput>.SignFlowInput-errorMask").removeClass("SignFlowInput-errorMask--hidden").text("密码为6~18位的字母或数字");
        result=false;
    }
       
    return result;
}
function checkLoginValid()
{
    console.log("need checkLoginValid");
    var result=true;
    
    var value=$("input[name='loginPhoneNo']").val();
    var reg = /^1[3|4|5|7|8][0-9]{9}$/;
    var is_check=reg.test(value);
    if(!is_check)
    {
        console.log("phone no error");
        $(".SignFlow-accountInputContainer>.SignFlowInput-errorMask").removeClass("SignFlowInput-errorMask--hidden").text("手机号格式错误");
        result=false;
    }
        
    var value=$("input[name='loginPassword']").val();
    console.log(value);
    var reg=/^[A-Za-z0-9]{6,18}$/;//  /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,18}$/;
    var is_check=reg.test(value);
    if(!is_check)
    {
        console.log("password error");
        $(".SignFlow-password>.SignFlowInput>.SignFlowInput-errorMask").removeClass("SignFlowInput-errorMask--hidden").text("密码为6~18位的字母或数字");
        result=false;
    }
       
    return result;
}
function checkSecondStep()
{
    var result=true;
    var value=$("input[name='password']").val();
    var reg=/^[A-Za-z0-9]{6,18}$/;// /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,18}$/;
    var is_check=reg.test(value);
    if(!is_check)
    {
        console.log("password error");
        $(".SignFlow-password.SignFlow-password-first>.SignFlowInput>.SignFlowInput-errorMask").removeClass("SignFlowInput-errorMask--hidden").text("6~18位的字母或数字");
        result=false;
    }
    
    var value_repeat=$("input[name='repeatPassword']").val();
    var reg=/^[A-Za-z0-9]{6,18}$/;// /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,18}$/;
    var is_check=reg.test(value_repeat);
    if(!is_check)
    {
        console.log("password error");
        $(".SignFlow-password.SignFlow-password-second>.SignFlowInput>.SignFlowInput-errorMask").removeClass("SignFlowInput-errorMask--hidden").text("6~18位的字母或数字");
        result=false;
    }
    if (false==result)
        return false;
    if(value!=value_repeat)
    {
        console.log("password not equal");
        $(".SignFlow-password>.SignFlowInput>.SignFlowInput-errorMask").removeClass("SignFlowInput-errorMask--hidden").text("两次密码输入不一致");
        result=false;
    }
    if (false==result)
        return false;
    var phone_no=$("input[name='phoneNo']").val(); 
    var veri_code=$("input[name='digits']").val();
    if("true"==g_lock_ajax)
        return;
    g_lock_ajax="true";
    $.post("/ajax/reset_pwd/",{"phone_no":phone_no,"veri_code":veri_code,"pwd":value},function(ret){
        if("fail"!=ret)
        {
            if("success"==ret)
            {
                console.log("reset ok");
                location.href="/account/?arg=reset_pwd_success";
            }
        }
        g_lock_ajax="false";
    });
    return false;
}
function checkFirstStep()
{
    var result=true;

    var phone_no=$("input[name='phoneNo']").val();
    console.log(phone_no);
    var reg = /^1[3|4|5|7|8][0-9]{9}$/;
    var is_check=reg.test(phone_no);
    if(!is_check)
    {
        console.log("phone no error");
        $(".SignFlow-accountInputContainer>.SignFlowInput-errorMask").removeClass("SignFlowInput-errorMask--hidden").text("手机号格式错误");
        result=false;
    }

    var veri_code=$("input[name='digits']").val();
    var reg = /^[0-9]{6}$/;
    var is_check=reg.test(veri_code);
    if(!is_check)
    {
        console.log("verification code error");
        $(".SignFlow-smsInput>.SignFlowInput-errorMask").removeClass("SignFlowInput-errorMask--hidden").text("验证码格式错误");
        result=false;
    }
    if(false==result)
        return false;
    if("true"==g_lock_ajax)
        return;
    g_lock_ajax="true";
    $.post("/ajax/check_sms/",{"phone_no":phone_no,"type":"password_reset","veri_code":veri_code},function(ret){
        if("fail"!=ret)
        {
            if("unregistered"==ret)
            {
                $(".SignFlow-accountInputContainer>.SignFlowInput-errorMask").removeClass("SignFlowInput-errorMask--hidden").text("该手机号未注册，无此用户");
            }
            else if("veri_code_error"==ret)
            {
                $(".SignFlow-smsInput>.SignFlowInput-errorMask").removeClass("SignFlowInput-errorMask--hidden").text("验证码错误");
            }
            else if("veri_code_ok"==ret)
            {
                console.log("check next step ok");
                $(".SignFlow-account").addClass("is-hide");
                $(".SignFlow-SMSInput").addClass("is-hide");
                $(".SignFlow-password").removeClass("is-hide");
                $(".PasswordReset-nextStep").text("重置密码");
                $(".StepHeader-title").text("设置新密码");
                $(".StepHeader-subtitle").text("新密码长度为6~18位，包含字母或数字");
                $(".PasswordReset-step").attr("onsubmit","return checkSecondStep()")
            }
        }
        g_lock_ajax="false";
    });
        
    return false;
}

function checkReturnHomePage(){
    $(".ReturnHomePage").off("click");
    $(".ReturnHomePage").click(function(){
        $("main").empty().append(g_cache_page);
        checkHomePage();
        checkNextPage();
    });
}
function checkNextPage()
{
    $(".NextPage").off("click");
    $(".NextPage").on("click",function(){
        console.log(this);
        g_subcmd=$(this).attr("data-next-page-type");
        g_cache_page=$("main").html();
        var head='<div class="Card Profile-datalist" id="Profile-datalist"><div id="appendArea" class=""><div class="ProfileHeader-expandActions ProfileEdit-expandActions"><button class="Button--green ReturnHomePage" style="margin:3px" type="button">返回我的主页</button></div></div></div>';
        $("main").empty().append(head);
        getMoreData();
        checkReturnHomePage();
    });
}

function checkAvatar(){
    $(".Avatar-editor").hover(
        function(){
            $(".Mask").removeClass("Mask-hidden");
        },
        function(){
            $(".Mask").addClass("Mask-hidden");
        }
    );
    
    $(".Mask-content").click(function(){
            $("#id_avatar_input").click();
    });
    
    $("#id_avatar_input").on("change",function(){
       console.log("********************");
       $("#upAvatarModal").modal('show');
        var objUrl = getObjectURL(this.files[0]);
        if (objUrl) { 
            $("#preview_avatar").attr("src", objUrl);
            $("#adjust_choosebox").val(50);                    
            
            setTimeout(adjustChooseBox,1*1000);
        }
    });
    
    $(".AvatarSave").click(function(){
        var type=$(this).attr("data-avatar-type");
        var img=document.getElementById("preview_avatar");
        imgWidth=img.naturalWidth;
        var can=document.getElementById("avatar_canvas");
        var ctx=can.getContext("2d");
        var newX=($('#chooseBox').position().left-$('#preview_avatar').position().left)*(img.naturalWidth/300);
        var newY=($('#chooseBox').position().top-$('#preview_avatar').position().top)*(img.naturalHeight/300);
        var newWidth=newHeight=(200+($("#adjust_choosebox").val()-50)*2)*(img.naturalWidth/300);
        var newHeight=(200+($("#adjust_choosebox").val()-50)*2)*(img.naturalHeight/300);
        ctx.drawImage(img,newX,newY,newWidth,newHeight,0,0,200,200);
        can.toBlob(function(blobUrl){
            console.log(blobUrl);
            uploadImage(type,blobUrl);
        },"image/jpeg"); 
    });
}

function checkHomePage()
{
    $(".ProfileEditButton,.ProfileHeader-expandButton").click(function(){
        g_cache_page=$("main").html();
        if($(this).hasClass("ProfileHeader-expandButton"))
        {
            if("true"!=g_show_detailed)
            {
                var data='<div><div class="ProfileHeader-detail"><div class="ProfileHeader-detailItem"><span class="ProfileHeader-detailLabel">居住地</span><div class="ProfileHeader-detailValue"><span>'+g_er_residence+'</span></div></div><div class="ProfileHeader-detailItem"><span class="ProfileHeader-detailLabel">所在行业</span><div class="ProfileHeader-detailValue">'+g_er_job+'</div></div><div class="ProfileHeader-detailItem"><span class="ProfileHeader-detailLabel">个人简介</span><div class="RichText ProfileHeader-detailValue">'+g_er_intro+'</div></div></div></div>';
                $(".ProfileHeader-contentBody").css({"height":"129px"}).empty().append(data);
                $(".ProfileHeader-expandButton").empty().append('<svg viewBox="0 0 10 6" class="Icon ProfileHeader-arrowIcon is-active Icon--arrow" width="10" height="16" aria-hidden="true" style="height: 16px; width: 10px;"><title></title><g><path d="M8.716.217L5.002 4 1.285.218C.99-.072.514-.072.22.218c-.294.29-.294.76 0 1.052l4.25 4.512c.292.29.77.29 1.063 0L9.78 1.27c.293-.29.293-.76 0-1.052-.295-.29-.77-.29-1.063 0z"></path></g></svg>收起详细资料');
                g_show_detailed="true";
            }
            else
            {
                $(".ProfileHeader-contentBody").css({"height":"50px"}).empty().append(g_contentbody_data);
                $(".ProfileHeader-expandButton").empty().append('<svg viewBox="0 0 10 6" class="Icon ProfileHeader-arrowIcon Icon--arrow" width="10" height="16" aria-hidden="true" style="height: 16px; width: 10px;"><title></title><g><path d="M8.716.217L5.002 4 1.285.218C.99-.072.514-.072.22.218c-.294.29-.294.76 0 1.052l4.25 4.512c.292.29.77.29 1.063 0L9.78 1.27c.293-.29.293-.76 0-1.052-.295-.29-.77-.29-1.063 0z"></path></g></svg>查看详细资料');
                g_show_detailed="false";
            }
        }
        else
        {
            var ProfileHeader_header='<div class="ProfileHeader-header"><div class="UserCoverEditor"><div><div class="UserCoverGuide"><div class="UserCoverGuide-inner"><div class="UserCoverGuide-buttonContainer"><button class="Button DynamicColorButton" type="button"><svg viewBox="0 0 20 16" class="Icon Icon--camera Icon--left" width="14" height="16" aria-hidden="true" style="height: 16px; width: 14px;"><title></title><g><path d="M18.094 2H15s-1-2-2-2H7C6 0 5 2 5 2H2C0 2 0 3.967 0 3.967V14c0 2 2.036 2 2.036 2H17c3 0 3-1.983 3-1.983V4c0-2-1.906-2-1.906-2zM10 12c-1.933 0-3.5-1.567-3.5-3.5S8.067 5 10 5s3.5 1.567 3.5 3.5S11.933 12 10 12zm0 1.5c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm7.5-8c-.552 0-1-.448-1-1s.448-1 1-1 1 .448 1 1-.448 1-1 1z" fill-rule="evenodd"></path></g></svg>上传封面图片</button></div><div class="UserCoverGuide-dialog"><h4 class="UserCoverGuide-dialogHead">上传一张图片，展示在这里</h4><div class="UserCoverGuide-dialogContent"><p class="UserCoverGuide-dialogDescription">你可以使用自己的摄影作品、你喜欢的照片，或是任何能展现你特质的图片。</p><a href="https://www.danongling.com/question/21757507" target="_blank" rel="noopener noreferrer">哪里能找到可免费使用的优质图片？</a></div></div></div><ul class="UserCoverGuide-items"></ul></div><div class="UserCover"></div></div><input type="file" accept="image/png,image/jpeg" style="display: none;"></div></div>';
            var ProfileHeader_avatar='<div><div class="UserAvatarEditor ProfileHeader-avatar"><div class="UserAvatar"><img id="id_avatar" class="Avatar Avatar--large UserAvatar-inner" width="160" height="160" src="'+g_er_avatar+'" srcset="'+g_er_avatar+'"></div><div class="Mask UserAvatarEditor-mask"><div class="Mask-mask Mask-mask--black UserAvatarEditor-maskInner"></div><div class="Mask-content"><svg class="Zi Zi--Camera UserAvatarEditor-cameraIcon" fill="currentColor" viewBox="0 0 24 24" width="36" height="36"><path d="M20.094 6S22 6 22 8v10.017S22 20 19 20H4.036S2 20 2 18V7.967S2 6 4 6h3s1-2 2-2h6c1 0 2 2 2 2h3.094zM12 16a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7zm0 1.5a5 5 0 1 0-.001-10.001A5 5 0 0 0 12 17.5zm7.5-8a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" fill-rule="evenodd"></path></svg><div class="UserAvatarEditor-maskInnerText">修改我的头像</div></div></div><input id="id_avatar_input" name="file" type="file" accept="image/png,image/jpeg" style="display: none;"></div></div>';
            var ProfileHeader_content='<div class="ProfileHeader-content"><div class="ProfileHeader-contentHead"><h1 class="ProfileHeader-title"><span class="ProfileHeader-name">'+g_er_name+'</span></h1><div class="ProfileHeader-expandActions ProfileEdit-expandActions"><a class="Button Button--plain" type="button" href="/er/'+g_er_id+'">返回我的主页<svg viewBox="0 0 10 6" class="Icon ProfileEdit-arrowIcon Icon--arrow" width="10" height="16" aria-hidden="true" style="height: 16px; width: 10px;"><title></title><g><path d="M8.716.217L5.002 4 1.285.218C.99-.072.514-.072.22.218c-.294.29-.294.76 0 1.052l4.25 4.512c.292.29.77.29 1.063 0L9.78 1.27c.293-.29.293-.76 0-1.052-.295-.29-.77-.29-1.063 0z"></path></g></svg></a></div></div><div class="ProfileEdit-fields"><form class="Field"><h3 class="Field-label">昵称</h3><div class="Field-content" data-field-type="nickname"><div><span class="Field-text"><span class="RichText">'+g_er_name+'</span></span><button class="Button ModifyButton Field-modify Field-modify-hidden Button--link" type="button">'+modify_icon_svg+'修改</button></div></div></form><form class="Field"><h3 class="Field-label">性别</h3><div class="Field-content" data-field-type="sexual"><div><span class="Field-text">'+g_er_sexual_han+'</span><button class="Button ModifyButton Field-modify Field-modify-hidden Button--link" type="button">'+modify_icon_svg+'修改</button></div></div></form><form class="Field"><h3 class="Field-label">一句话介绍</h3><div class="Field-content" data-field-type="mood"><div><span class="Field-text"><span class="RichText">'+g_er_mood+'</span></span><button class="Button ModifyButton Field-modify Field-modify-hidden Button--link" type="button">'+modify_icon_svg+'修改</button></div></div></form><form class="Field"><h3 class="Field-label">居住地</h3><div class="Field-content" data-field-type="residence"><div><span class="Field-text"><span class="RichText">'+g_er_residence+'</span></span><button class="Button ModifyButton Field-modify Field-modify-hidden Button--link" type="button">'+modify_icon_svg+'修改</button></div></div></form><form class="Field"><h3 class="Field-label">所在行业</h3><div class="Field-content" data-field-type="job"><div><span class="Field-text">'+g_er_job+'</span><button class="Button ModifyButton Field-modify Field-modify-hidden Button--link" type="button">'+modify_icon_svg+'修改</button></div></div></form><form class="Field"><h3 class="Field-label">个人简介</h3><div class="Field-content" data-field-type="intro"><div class="DescriptionField-content"><span class="Field-text"><span class="RichText">'+g_er_intro+'</span></span><button class="Button ModifyButton Field-modify Field-modify-hidden Button--link" type="button">'+modify_icon_svg+'修改</button></div></div></form></div></div></div>';
            var data='<div class="ProfileEdit"><div class="Card">'+ProfileHeader_header+'<div class="ProfileHeader-main">'+ProfileHeader_avatar+ProfileHeader_content+'</div></div>';
            $("main").empty().append(data);
            checkReturnHomePage();
            checkAvatar();
            checkProfileModify();
        }              
    });

    function checkProfileSave()
    {
        $(".save").off("click");
        $(".save").click(function(){
            var _this=$(this);
            var field_type=$(this).parents(".Field-content").attr("data-field-type");
            var value=$("input[name='"+field_type+"']").val();
            if("sexual"==field_type)
                var value=$("input[name='sexual']:checked").val();
            else if("intro"==field_type)
                var value=$("textarea[name='intro']").val();
            if("true"==g_lock_ajax)
                return;
            g_lock_ajax="true";
            $.post("/ajax/profile_edit/",{field_type:field_type,content:value},function(ret){
                if("fail"!=ret)
                {
                    if("nickname"==field_type)
                    {
                        g_er_name=ret;
                        var data='<div><span class="Field-text"><span class="RichText">'+g_er_name+'</span></span><button class="Button ModifyButton Button--link" type="button">'+modify_icon_svg+'修改</button></div>';  
                        $(".ProfileHeader-name").empty().append(g_er_name);                         
                    }
                    else if("sexual"==field_type)
                    {
                        if("f"==ret)
                        {
                            g_er_sexual="she";
                            g_er_sexual_han="女";
                        }
                        else if("m"==ret)
                        {
                            g_er_sexual="he";
                            g_er_sexual_han="男";
                        }
                        var data='<div><span class="Field-text">'+g_er_sexual_han+'</span><button class="Button ModifyButton Button--link" type="button">'+modify_icon_svg+'修改</button></div>';
                    }
                    else if("mood"==field_type)
                    {
                        g_er_mood=ret;
                        var data='<div><span class="Field-text"><span class="RichText">'+g_er_mood+'</span></span><button class="Button ModifyButton Button--link" type="button">'+modify_icon_svg+'修改</button></div>';
                    }
                    else if("residence"==field_type)
                    {
                        g_er_residence=ret; 
                        var data='<div><span class="Field-text"><span class="RichText">'+g_er_residence+'</span></span><button class="Button ModifyButton Button--link" type="button">'+modify_icon_svg+'修改</button></div>';

                    }
                    else if("job"==field_type)
                    {
                        g_er_job=ret;
                        var data='<div><span class="Field-text">'+g_er_job+'</span><button class="Button ModifyButton Button--link" type="button">'+modify_icon_svg+'修改</button></div>';
                    }
                    else if("intro"==field_type)
                    {
                        g_er_intro=ret;
                        var data='<div class="DescriptionField-content"><span class="Field-text"><span class="RichText">'+g_er_intro+'</span></span><button class="Button ModifyButton Button--link" type="button">'+modify_icon_svg+'修改</button></div>';
 
                    }
                    _this.parents(".Field-content").empty().append(data);
                }
                g_lock_ajax="false";
                checkProfileModify();
            });
        });

        $(".cancle").off("click");
        $(".cancle").click(function(){
            var field_type=$(this).parents(".Field-content").attr("data-field-type")
            if("nickname"==field_type)
            {
                var data='<div><span class="Field-text"><span class="RichText">'+g_er_name+'</span></span><button class="Button ModifyButton Button--link" type="button">'+modify_icon_svg+'修改</button></div>';
            }
            else if("sexual"==field_type)
            {			
                var data='<div><span class="Field-text">'+g_er_sexual_han+'</span><button class="Button ModifyButton Button--link" type="button">'+modify_icon_svg+'修改</button></div>';
            }
            else if("mood"==field_type)
            {
                var data='<div><span class="Field-text"><span class="RichText">'+g_er_mood+'</span></span><button class="Button ModifyButton Button--link" type="button">'+modify_icon_svg+'修改</button></div>';
            }
            else if("residence"==field_type)
            {
                var data='<div><span class="Field-text"><span class="RichText">'+g_er_residence+'</span></span><button class="Button ModifyButton Button--link" type="button">'+modify_icon_svg+'修改</button></div>';
            }
            else if("job"==field_type)
            {
                var data='<div><span class="Field-text">'+g_er_job+'</span><button class="Button ModifyButton Button--link" type="button">'+modify_icon_svg+'修改</button></div>';
            }
            else if("intro"==field_type)
            {
                var data='<div class="DescriptionField-content"><span class="Field-text"><span class="RichText">'+g_er_intro+'</span></span><button class="Button ModifyButton Button--link" type="button">'+modify_icon_svg+'修改</button></div>';
            }
            $(this).parents(".Field-content").empty().append(data);
            checkProfileModify();
        });
    }
    function checkProfileModify()
    {
        $(".Field").off("mouseenter mouseleave");
		$(".Field").on("mouseenter mouseleave",function(event){
			if(event.type=="mouseenter")
			{
				$(this).find(".ModifyButton").removeClass("Field-modify-hidden");
			}
			else if(event.type=="mouseleave")
			{
				$(this).find(".ModifyButton").addClass("Field-modify-hidden");
			}
		});

    
        $(".Field").find(".ModifyButton").off("click");
        $(".Field").find(".ModifyButton").click(function(){
            var field_type=$(this).parents(".Field-content").attr("data-field-type");
            if("nickname"==field_type)
            {
                var data='<div><div class="HeadlineField-input Input-wrapper"><input name="nickname" class="Input" value="'+g_er_name+'"></div><div class="HeadlineField-actions"><div class="ButtonGroup HeadlineField-buttonGroup"><button class="Button Button--primary Button--green save" type="button">保存</button><button class="Button Button--grey cancle" type="button">取消</button></div><span class="MaxLength"></span></div></div>';
            }
            else if("sexual"==field_type)
            {
                if("f"==g_er_sexual)
                    var data='<div><input type="radio" name="sexual" value="m"> 男<input type="radio" name="sexual" value="f" checked style="margin-left: 30px;"> 女<div class="ButtonGroup"><button class="Button Button--primary Button--green save" type="button">保存</button><button class="Button Button--grey cancle" type="button">取消</button></div></div>';
                else
                    var data='<div><input type="radio" name="sexual" value="m" checked> 男<input type="radio" name="sexual" value="f" style="margin-left: 30px;"> 女<div class="ButtonGroup"><button class="Button Button--primary Button--green save" type="button">保存</button><button class="Button Button--grey cancle" type="button">取消</button></div></div>';
            }
            else if("mood"==field_type)
            {
                var data='<div><div class="HeadlineField-input Input-wrapper"><input name="mood" class="Input" value="'+g_er_mood+'"></div><div class="HeadlineField-actions"><div class="ButtonGroup HeadlineField-buttonGroup"><button class="Button Button--primary Button--green save" type="button">保存</button><button class="Button Button--grey cancle" type="button">取消</button></div><span class="MaxLength"></span></div></div>';
            }
            else if("residence"==field_type)
            {
                var data='<div><div class="HeadlineField-input Input-wrapper"><input name="residence" class="Input" value="'+g_er_residence+'"></div><div class="HeadlineField-actions"><div class="ButtonGroup HeadlineField-buttonGroup"><button class="Button Button--primary Button--green save" type="button">保存</button><button class="Button Button--grey cancle" type="button">取消</button></div><span class="MaxLength"></span></div></div>';
                $(this).parents(".Field-content").empty().append(data);
            }
            else if("job"==field_type)
            {
                var data='<div><div class="HeadlineField-input Input-wrapper"><input name="job" class="Input" value="'+g_er_job+'"></div><div class="HeadlineField-actions"><div class="ButtonGroup HeadlineField-buttonGroup"><button class="Button Button--primary Button--green save" type="button">保存</button><button class="Button Button--grey cancle" type="button">取消</button></div><span class="MaxLength"></span></div></div>';
            }
            else if("intro"==field_type)
            {
                var data='<div><textarea name="intro" rows="3" class="DescriptionField-input TextArea">'+g_er_intro+'</textarea><div class="DescriptionField-actions"><div class="ButtonGroup DescriptionField-buttonGroup"><button class="Button Button--primary Button--green save" type="button">保存</button><button class="Button Button--grey cancle" type="button">取消</button></div><span class="MaxLength"></span></div></div>';
            }
            $(this).parents(".Field-content").empty().append(data);
            checkProfileSave();
        });
    }
}
function checkSettingPage()
{
    $("a[name='messages']").off("click");
    $("a[name='messages']").on("click",function(){
        var element=$(this).parents(".List-item");
        console.log(element);
        var conversation_id=element.attr("data-action-id");
        var id=element.attr("data-receiver-id");
        var name=element.attr("data-receiver-name");
        show_conversion_messages(conversation_id,id,name);
    });
    
    $("a[name='reply']").off("click");
    $("a[name='reply']").on("click",function(){
        var element=$(this).parents(".List-item");
        console.log(element);
        var id=element.attr("data-receiver-id");
        var name=element.attr("data-receiver-name");
        setLetterReceiver(id,name);
    });


    $("a[name='delete']").off("click");
    $("a[name='delete']").on("click",function(){
        var element=$(this).parents(".List-item");
        var action=element.attr("data-action");
        var action_id=element.attr("data-action-id");
        if("true"==g_lock_ajax)
            return;
        g_lock_ajax="true";
        $.post("/ajax/"+action+"/"+action_id+"/",function(ret){
            if("success"==ret)
                element.remove();
            g_lock_ajax="false";
        });
    });
}

function checkSelectOption()
{
    $('.selectpicker').on('show.bs.select', function (e) {
        if("false"==g_selectpicker_init)
        {
            if(""==cache_topics)
            {
                var bIsGetAll="1";
                if("true"==g_lock_ajax)
                    return;
                g_lock_ajax="true";
                $.post("/ajax/topics/"+bIsGetAll+"/0/0/", function(ret){
                    if("fail"!=ret)
                    {
                        //$('.selectpicker').empty();
                        cache_topics=ret;
                        for (var i in cache_topics)
                        {
                            var topic_id=cache_topics[i][0];
                            var topic_name=cache_topics[i][1];
                            $('.selectpicker').append("<option value=" + topic_id + ":" + topic_name + ">" + topic_name + "</option>");
                            
                        } 
                        $('.selectpicker').selectpicker('refresh');
                        g_selectpicker_init="true";                       
                    }  
                    g_lock_ajax="false";            
                });
            }
            else
            {
                        for (var i in cache_topics)
                        {
                            var topic_id=cache_topics[i][0];
                            var topic_name=cache_topics[i][1];
                            $('.selectpicker').append("<option value=" + topic_id + ":" + topic_name + ">" + topic_name + "</option>");
                            
                        } 
                        $('.selectpicker').selectpicker('refresh');
                        g_selectpicker_init="true";
            }
        }
        else
        {
            console.log("select has init");
        }
        
    });
}


function checkComment()
{
    var commpent_text="";
    var input_lock="false";
    $(".Button-comment-send.CommentEditor-singleButton").attr("disabled","");
    $(".Comments-footer").find(".public-DraftEditorPlaceholder-inner").removeClass("is-hide");
    $(".Comments-footer").find(".public-DraftEditor-content").empty();
    
    $(".Button-comment-send").off("mousedown");
    $(".Button-comment-send").on("mousedown",function(){
        console.log("mousedown");
        var parent_comment_id=$(this).closest(".CommentItem").attr("data-comment-id");
        if("article"==g_module)
        {
            var c_type="article";
            var a_id=g_article_id;
        }
        else
        {
            var c_type=$(this).parents(".ContentItem.AnswerItem").attr("data-content-type");
            var a_id=$(this).parents(".ContentItem.AnswerItem").attr("data-content-id");
        }
        if (typeof(parent_comment_id) == "undefined")
        {
            parent_comment_id=0;
        }
        console.log(a_id);
        console.log(parent_comment_id);
        if(commpent_text.length>MIDDLE_TEXT_MAX_LENGTH)
        {
            commpent_text=commpent_text.substr(0,MIDDLE_TEXT_MAX_LENGTH-1);
        }
        var post_data={c_type:c_type,a_id:a_id,c_content:commpent_text,parent_comment_id:parent_comment_id};
        $.post("/ajax/comment/",post_data,function(ret){
            if("fail"!=ret)
            {
                console.log("comment success");
                appendCommentsElement(ret);
                checkComment();
            }
        });
        
        $(this).attr("disabled","");
        $(this).parents(".Comments-footer").find(".public-DraftEditorPlaceholder-inner").removeClass("is-hide");
        $(this).parents(".Comments-footer").find(".public-DraftEditor-content").empty();
        
        $(this).closest(".CommentItem").find(".CommentItem-footer").removeClass("is-hide");
        $(this).closest(".CommentItem-editor").remove();
    });
    
    $(".Button-comment-cancle").off("mousedown");
    $(".Button-comment-cancle").on("mousedown",function(){
        console.log("mousedown");
        $(this).closest(".CommentItem").find(".CommentItem-footer").removeClass("is-hide");
        $(this).closest(".CommentItem-editor").remove();
    });
    
    $(".public-DraftEditor-content").off("click");
    $(".public-DraftEditor-content").on("click",function(){
        $(this).parents(".CommentEditor--nouse").addClass("CommentEditor--active");
        $(this).parents(".CommentEditor-input").addClass("is-focus");
        $(this).parents(".Input.Editable").addClass("Editable--focus");
    });
    
    $(".public-DraftEditor-content").off("keyup");
    $(".public-DraftEditor-content").on("keyup",function(){
        $(this).parents(".DraftEditor-root").find(".public-DraftEditorPlaceholder-inner").addClass("is-hide");
        if("false"==input_lock)
        {
            commpent_text=$(this).text();
            console.log(commpent_text);
            if(""!=commpent_text)
            {
                $(this).parents(".CommentEditor--nouse").find(".Button-comment-send").removeAttr("disabled");
            }
            else
            {
                $(this).parents(".CommentEditor--nouse").find(".Button-comment-send").attr("disabled","");
            }
        }
    });
    
    $(".public-DraftEditor-content").off("compositionstart");
    $(".public-DraftEditor-content").on("compositionstart",function(e){
        input_lock="true";
    });
    
    $(".public-DraftEditor-content").off("compositionend");
    $(".public-DraftEditor-content").on("compositionend",function(e){
        input_lock="false";
        //$(".public-DraftEditor-content").trigger("keyup");
    });
    
    $(".public-DraftEditor-content").off("blur");
    $(".public-DraftEditor-content").on("blur",function(){
        console.log("blur");
        $(this).parents(".CommentEditor--nouse").removeClass("CommentEditor--active");
        $(this).parents(".CommentEditor-input").removeClass("is-focus");
        $(this).parents(".Input.Editable").removeClass("Editable--focus");
        input_lock="false";
    });
    
    $(".Comments-Packup-Button").off("click");
    $(".Comments-Packup-Button").on("click",function(){
        var parent_element=$(this).parents(".ContentItem.AnswerItem");
        parent_element.find(".Comments-container").remove();
        var comment_nums=parent_element.attr("data-comment-nums");
        var icon_element=parent_element.find(".Zi--Comment.Button-zi").closest("span");
        parent_element.find(".Zi--Comment.Button-zi").closest("button").empty().append(icon_element).children("span").after(comment_nums+" 条评论");
        $(this).closest("span").remove();
    });
    
    $(".Button-like-nouse").off("click");
    $(".Button-like-nouse").each(function(){
        $(this).click(function(){
            var button_element=$(this);
            var l_type=button_element.attr("data-like-type");
            var l_id=button_element.attr("data-like-id");
            if("comment"==l_type)
            {
                if(button_element.closest(".ContentItem.AnswerItem").length>0)
                    l_type="comment_answer";
                else
                    l_type="comment_article";
            }
            console.log(l_type);
            console.log(l_id);
            var post_data={l_type:l_type,l_id:l_id};
            if("true"==g_lock_ajax)
                return;
            g_lock_ajax="true";
            $.post("/ajax/like/",post_data,function(ret){
                if("fail"!=ret)
                {
                    var like_icon=button_element.children("svg");
                    button_element.attr("disabled","").empty().append(like_icon).append(ret);
                }
                g_lock_ajax="false";
            });
        });
    });

}

function checkInteractionButton()
{
    $(".Button-like-nouse").off("click");
    $(".Button-like-nouse").each(function(){
        $(this).click(function(){
            var button_element=$(this);
            var l_type=button_element.attr("data-like-type");
            var l_id=button_element.attr("data-like-id");
            if("comment"==l_type)
            {
                if(button_element.closest(".ContentItem.AnswerItem").length>0)
                    l_type="comment_answer";
                else
                    l_type="comment_article";
            }
            console.log(l_type);
            console.log(l_id);
            var post_data={l_type:l_type,l_id:l_id};
            if("true"==g_lock_ajax)
                return;
            g_lock_ajax="true";
            $.post("/ajax/like/",post_data,function(ret){
                if("fail"!=ret)
                {
                    var like_icon=button_element.children("svg");
                    button_element.attr("disabled","").empty().append(like_icon).append(ret);
                }
                g_lock_ajax="false";
            });
        });
    });


    $(".Zi--Comment.Button-zi").closest("button").off("click");
    $(".Zi--Comment.Button-zi").closest("button").on("click",function(){
        
        if("article"==g_module)
        {
                console.log("scroll into comment");
                document.getElementsByClassName("CommentList")[0].scrollIntoView();
        }
        else
        {
            var parent_element=$(this).parents(".ContentItem.AnswerItem");
            if(parent_element.find(".Comments-container").length>0)
            {
                parent_element.find(".Comments-container").remove();
                var comment_nums=parent_element.attr("data-comment-nums");
                var icon_element=$(this).children("span");
                $(this).empty().append(icon_element).children("span").after(comment_nums+" 条评论");
                parent_element.find(".Comments-Packup-Button").closest("span").remove();
            }
            else
            {
                $(".CommentList").removeClass("CommentList--current");
                var comment_nums=parent_element.attr("data-comment-nums");
                var comment_list_element='<div class="Comments-container"><div class="Comments Comments--withEditor Comments-withPagination"><div class="Topbar CommentTopbar"><div class="Topbar-title"><h2 class="CommentTopbar-title">'+comment_nums+' 条评论</h2></div><div class="Topbar-options"><button type="button" class="Button Button--plain Button--withIcon Button--withLabel"><span style="display: inline-flex; align-items: center;">&#8203;<svg class="Zi Zi--Switch Button-zi" fill="currentColor" viewBox="0 0 24 24" width="1.2em" height="1.2em"><path d="M13.004 7V4.232c0-.405.35-.733.781-.733.183 0 .36.06.501.17l6.437 5.033c.331.26.376.722.1 1.033a.803.803 0 0 1-.601.264H2.75a.75.75 0 0 1-.75-.75V7.75A.75.75 0 0 1 2.75 7h10.254zm-1.997 9.999v2.768c0 .405-.35.733-.782.733a.814.814 0 0 1-.5-.17l-6.437-5.034a.702.702 0 0 1-.1-1.032.803.803 0 0 1 .6-.264H21.25a.75.75 0 0 1 .75.75v1.499a.75.75 0 0 1-.75.75H11.007z" fill-rule="evenodd"></path></svg></span>切换为时间排序</button></div></div><div class="Comments-footer CommentEditor--normal CommentEditor--nouse"><div class="CommentEditor-input Input-wrapper Input-wrapper--spread Input-wrapper--large Input-wrapper--noPadding"><div class="Input Editable"><div class="Dropzone RichText ztext" style="min-height: 198px;"><div class="DraftEditor-root"><div class="public-DraftEditorPlaceholder-root"><div class="public-DraftEditorPlaceholder-inner">写下你的评论...</div></div><div class="DraftEditor-editorContainer"><div class="notranslate public-DraftEditor-content" contenteditable="true" role="textbox" spellcheck="true" tabindex="0" style="outline: none; white-space: pre-wrap; word-wrap: break-word;"></div></div></div></div><div></div></div></div><button disabled="" type="button" class="Button Button-comment-send CommentEditor-singleButton Button--primary Button--green">评论</button></div><div class="CommentList CommentList--current"></div><div class="Comments-footer CommentEditor--normal CommentEditor--nouse CommentEditor--nouse--bottom is-hide"><div class="CommentEditor-input Input-wrapper Input-wrapper--spread Input-wrapper--large Input-wrapper--noPadding"><div class="Input Editable"><div class="Dropzone RichText ztext" style="min-height: 198px;"><div class="DraftEditor-root"><div class="public-DraftEditorPlaceholder-root"><div class="public-DraftEditorPlaceholder-inner">写下你的评论...</div></div><div class="DraftEditor-editorContainer"><div class="notranslate public-DraftEditor-content" contenteditable="true" role="textbox" spellcheck="true" tabindex="0" style="outline: none; white-space: pre-wrap; word-wrap: break-word;"></div></div></div></div><div></div></div></div><button disabled="" type="button" class="Button Button-comment-send CommentEditor-singleButton Button--primary Button--green">评论</button></div></div></div>';
                parent_element.append(comment_list_element);

                var icon_element=$(this).children("span");
                $(this).empty().append(icon_element).children("span").after("收起评论");                
                
                var packup_button_element='<span><button class="Comments-Packup-Button" style="left: 673px;z-index:999;">收起评论<svg viewBox="0 0 10 6" class="Icon Icon--arrow" width="10" height="16" aria-hidden="true" style="height: 16px; width: 10px;"><title></title><g><path d="M8.716.217L5.002 4 1.285.218C.99-.072.514-.072.22.218c-.294.29-.294.76 0 1.052l4.25 4.512c.292.29.77.29 1.063 0L9.78 1.27c.293-.29.293-.76 0-1.052-.295-.29-.77-.29-1.063 0z"></path></g></svg></button></span>';
                parent_element.append(packup_button_element);
                var content_id=parent_element.attr("data-content-id");
                var content_type=parent_element.attr("data-content-type");
                getComments(content_type,content_id);
            }
        }
    });
}
function checkAnswerQuestion()
{
    var content="";
    function checkAnswerButtonValid()
    {
        if((content.length>=TEXT_MIN_LENGTH_LOW))
        {
            $(".AnswerForm-submit").removeAttr("disabled");
        }
        else
        {
            $(".AnswerForm-submit").attr("disabled","");
        }
    }

    $('#summernote_answer').on('summernote.change', function(we, contents, $editable) {
        content=contents.replace("<p><br></p>","").replace("<p>","").replace("</p>","");
        checkAnswerButtonValid();
    });
    
    $(".ShowAnswerBar-nouse").off("click");
    $(".ShowAnswerBar-nouse").on("click",function(){
        if(false==veriLogin())
            return;
        if($(".AnswerToolbar").hasClass("is-hide"))
        {
            $(".AnswerToolbar").removeClass("is-hide");
            $(".AnswerToolbar .AuthorInfo-avatar").attr("src",g_user_avatar).attr("alt",g_user_name);
            $(".AnswerToolbar .AuthorInfo-name").empty().append(g_user_name);
        }
        else
        {
            $(".AnswerToolbar").addClass("is-hide");
        }
    });
    $(".HideAnswerBar-nouse").off("click");
    $(".HideAnswerBar-nouse").on("click",function(){
        $(".AnswerToolbar").addClass("is-hide");
    });

    $(".AnswerForm-submit").off("click");
    $(".AnswerForm-submit").on("click",function(){
        var url="/ajax/question_answer/"+g_question_id+"/";
        var content=$('#summernote_answer').summernote('code');
        if(content>LARGE_TEXT_MAX_LENGTH)
        {
            content=content.substr(0,LARGE_TEXT_MAX_LENGTH-1);
        }      
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
                    location.href=ret;
                    //appendAnswerElementList(ret,"all","prepend")
                    //$(".AnswerToolbar").addClass("is-hide");               
                    //checkSets();
                }
            }
        });
    });
}

function checkAsk()
{
    var title="";
    var select_topic=[];
    var content="";
    function checkAskValid()
    {
        if((""!=title)&&(select_topic.length>0))
        {
            $("#askModal .QuestionAsk-buttonGroup>button").removeAttr("disabled");
        }
        else
        {
            $("#askModal .QuestionAsk-buttonGroup>button").attr("disabled","");
        }
    }
    function checkAskTitle()
    {
        $("#askModal .QuestionAsk-title textarea").on("input",function(){
            title=$("textarea[name='title']").val();
            checkAskValid();
        });
    }
    function checkAskSelect()
    {
        $('.QuestionAsk .selectpicker').on('changed.bs.select',function(e){
            select_topic=$('.QuestionAsk .selectpicker').val();
            console.log(select_topic.length);
            checkAskValid();
            $(".bootstrap-select .dropdown-menu").trigger("click");
        });
    }
    function checkAskDetail()
    {
        $('#summernote_question').on('summernote.change', function(we, contents, $editable) {
            content=contents.replace("<p><br></p>","").replace("<p>","").replace("</p>","");
        });
    }
    $("#askModal .QuestionAsk-buttonGroup>button").click(function(){
        if(title.length>LITTLE_TEXT_MAX_LENGTH)
        {
            title=title.substr(0,LITTLE_TEXT_MAX_LENGTH-1);
            $("textarea[name='title']").val(title);
        }
        if(content.length>MIDDLE_TEXT_MAX_LENGTH)
        {
            content=content.substr(0,MIDDLE_TEXT_MAX_LENGTH-1);
        }
        $("input[name='detail']").val(content);
        $(this).closest("form").submit();
    });
    checkAskTitle();
    checkAskSelect();
    checkAskDetail();   
    
    $('#askModal').on('shown.bs.modal', function(){
        if(false==veriLogin())
            return;
        $("#askModal").off('click.dismiss.bs.modal','[data-dismiss="modal"]');
        $("#askModal").on('click.dismiss.bs.modal','[data-dismiss="modal"]',function(){
            $('#askModal .modal').modal('hide');
            $('#askModal').modal('hide');
        });
    });
     
    $("#askModal .note-editor button.close").off("mousedown");
    $("#askModal .note-editor button.close").on("mousedown",function(event){
        $("#askModal").off('click.dismiss.bs.modal','[data-dismiss="modal"]');
        event.preventDefault();
        setTimeout(function(){
            $("#askModal").on('click.dismiss.bs.modal','[data-dismiss="modal"]',function(){
                $('#askModal .modal').modal('hide');
                $('#askModal').modal('hide');
            });
        },1000);
    });
    
    $("#askModal .Modal-closeButton").off("click");
    $("#askModal .Modal-closeButton").on("click",function(){
        console.log("modal close buttion click");
        $("textarea[name='title']").val("");
        $('.selectpicker').empty();
        $('.selectpicker').selectpicker('refresh');
        g_selectpicker_init="false";
        $('#summernote_question').summernote('code','');
    });
}
function checkWrite()
{
    var title="";
    var select_topic=[];
    var content="";
    function checkWriteValid()
    {
        if((""!=title)&&(select_topic.length>0)&&(content.length>=TEXT_MIN_LENGTH_HIGH))
        {
            $(".WritePost").removeAttr("disabled");
        }
        else
        {
            $(".WritePost").attr("disabled","");
        }
    }
    function checkWriteTitle()
    {
        $(".WriteIndex-titleInput .Input").on("input",function(){
            title=$("input[name='writeTitle']").val();
            checkWriteValid();
        });
    }
    function checkWriteSelect()
    {
        $('.Wirte-select .selectpicker').on('changed.bs.select',function(e){
            select_topic=$('.Wirte-select .selectpicker').val();
            console.log(select_topic.length);
            checkWriteValid();
            $(".bootstrap-select .dropdown-menu").trigger("click");
        });
    }
    function checkWriteContent()
    {
        $('#summernote_write').on('summernote.change', function(we, contents, $editable) {
            content=contents.replace("<p><br></p>","").replace("<p>","").replace("</p>","");
            checkWriteValid();
        });
    }
    $(".WritePost").click(function(){
        if(title.length>LITTLE_TEXT_MAX_LENGTH)
        {
            title=title.substr(0,LITTLE_TEXT_MAX_LENGTH-1);
            $("input[name='writeTitle']").val(title);
        }
        if(content.length>LARGE_TEXT_MAX_LENGTH)
        {
            content=content.substr(0,LARGE_TEXT_MAX_LENGTH-1);
        }
        $("input[name='writeContent']").val(content);
        $(this).closest("form").submit();
    });
    checkWriteTitle();
    checkWriteSelect();
    checkWriteContent();
}
function checkSets()
{
    checkAsk();
    checkFollow();
    checkContentClick();
    checkContentExpand();
    checkContentCollapse();
    checkPopoverShow();
    checkInteractionButton();
    checkAnswerQuestion();
    checkSearch();
    //checkExpandBtn();
}
function getComments(type,id)
{
    var post_data={c_type:type,a_id:id};
    if("true"==g_lock_ajax)
        return;
    g_lock_ajax="true";
    $.post("/ajax/get_comments/",post_data,function(ret){
        if("fail"!=ret)
        {
            console.log("get comments success");
            appendCommentsElement(ret);
        }
        checkComment();
        g_lock_ajax="false";
    });
}
function getMoreData()
{
    if($(".List-item.NoMoreData").length>0)
        return;
    if("index"==g_module)
    {
        var nums=g_last_getmoredata_index;
        var order=1;//pub_date
        var start=nums;
        var end=start+STEP;
        var url='/ajax/questions/'+order+'/'+start+'/'+end+'/';
        var post_data={'follow_topics':""+g_user_follow_topics_list};
    }
    else if("question"==g_module)
    {
        if("all"==g_list_type)
        {
            var nums=g_last_getmoredata_index;
            var order=1;//pub_date
            var start=nums;
            var end=start+STEP;
            var url='/ajax/answers/'+g_question_id+'/'+order+'/'+start+'/'+end+'/';
            var post_data='';
        }
        else
            return;
    }
    else if("topic"==g_module)
    {
        var nums=g_last_getmoredata_index;
        var order=1;//pub_date
        var start=nums;
        var end=start+STEP;
        var url="/ajax/topic/"+g_topic_id+"/"+order+"/"+start+"/"+end+"/";
        var post_data={type:g_type};
    }
    else if("mytopic"==g_module)
    {
        var nums=g_last_getmoredata_index;
        var order=1;
        var start=nums;
        var end=start+STEP;
        var url="/ajax/topic/"+g_topic_id+"/"+order+"/"+start+"/"+end+"/";
        var post_data={type:"hot"};
    }
    else if("alltopics"==g_module)
    {
        var nums=g_last_getmoredata_index;///;;$('.item.even').length;
        var bIsGetAll="0";//pub_date
        var start=nums;
        var end=start+STEP;
        var url='/ajax/topics/'+bIsGetAll+'/'+start+'/'+end+'/';
        var post_data='';
    }
    else if("search"==g_module)
    {
        if((""!=g_search_keyword)&&(""!=g_search_type))
        {
            var nums=g_last_getmoredata_index;
            var order=1;//pub_date
            var start=nums;
            var end=start+STEP;
            var url='/ajax/search/'+g_search_type+'/'+order+'/'+start+'/'+end+'/';
            var post_data={keyword:g_search_keyword};
        }
        else
            return;
    }
    else if("setting"==g_module)
    {
        if("settings"==g_setting_type)
            return;
        var nums=g_last_getmoredata_index;//$('.Setting-item').length;
        var order=1;//pub_date
        var start=nums;
        var end=start+STEP;
        if("conversation_messages"==g_setting_type)
            var url='/ajax/'+g_setting_type+'/'+g_conversation_id+'/'+order+'/'+start+'/'+end+'/';
        else
            var url='/ajax/'+g_setting_type+'/'+order+'/'+start+'/'+end+'/';
        var post_data='';
    }
    else if("home"==g_module)
    {
        if ("answers"==g_command)
        {
            var url="/ajax/er/"+g_er_id+"/answers/";
            var post_data={'start':g_last_getmoredata_index,'end':g_last_getmoredata_index+STEP};
        }
        else if ("asks"==g_command)
        {
            var url="/ajax/er/"+g_er_id+"/asks/";
            var post_data={'start':g_last_getmoredata_index,'end':g_last_getmoredata_index+STEP*10};
        }
        else if ("following"==g_command)
        {
            var url="/ajax/er/"+g_er_id+"/following/"+g_subcmd+"/";
            var post_data={'start':g_last_getmoredata_index,'end':g_last_getmoredata_index+STEP*10};
        }
    }
    else if("answer_page"==g_module)
    {
        var nums=g_last_getmoredata_index;
        var order=1;//pub_date
        var start=nums;
        var end=start+STEP;
        var url='/ajax/answer_page/'+g_type+'/'+order+'/'+start+'/'+end+'/';
        var post_data='';
    }
    else
    {
        return;
    }
    if("true"==g_lock_ajax)
        return;
    g_lock_ajax="true";
    $.post(url,post_data,function(ret){
        if("fail"!=ret)
        {
            if("index"==g_module)
            {
                appendAnswerElementCard(ret,"has_topic_question_title",diretion="append") ;
            }
            else if("question"==g_module)
            {
                if("all"==g_list_type)
                {
                    appendAnswerElementList(ret,"all","append");
                }
            }
            else if("topic"==g_module)
            {
                if("unanswered"==g_type)
                    appendQuestionElement(ret);
                else
                    appendAnswerElementList(ret,"topic","append");
            }
            else if("mytopic"==g_module)
            {
                appendAnswerElementList(ret,"topic","append");  
            }
            else if("alltopics"==g_module)
            {
                appendTopicElement(ret);
            }
            else if("search"==g_module)
            {
                appendSearchPageElement(ret);
            }
            else if("setting"==g_module)
            {
                appendSettingPageElement(ret);
            }
            else if("home"==g_module)
            {
                if ("answers"==g_command)
                {
                    appendAnswerElementList(ret,"homepage","append");
                }
                else if ("asks"==g_command)
                {
                    appendQuestionElement(ret);
                }
                else if ("following"==g_command)
                {
                    appendFollowOrMoreElement(ret);
                }
            }
            else if("answer_page"==g_module)
            {
                if("invited"==g_type)
                    appendInvitedQuestionElement(ret)
                else
                    appendQuestionElement(ret);
            }
            checkSets();
            g_last_getmoredata_index+=STEP;
        }
        else
        {
            console.log("no more data");
            $("#appendArea").append('<div class="List-item NoMoreData"><div class="ContentItem" ><div class="ContentItem-status"  style="text-align:center">没有更多内容</div></div></div>');
        }
        g_lock_ajax="false";
        //setLockScrollMoreData("false");
    });
}
function show_conversion_messages(conversation_id,er_id,er_name)
{
    var data='<div class="List-item Conversation-messages-head"><div class="zg-section"><a href="/conversations">« 返回</a></div><div class="zg-section zg-14px"><span class="zg-gray-normal">发私信给 </span><span class="zg-gray-darker">'+er_name+'</span>：</div><div class="zg-section LetterSend" id="zh-pm-editor-form"><div class="zg-editor-simple-wrap zg-form-text-input"><div class="zg-user-name" style="display:none"></div><textarea id="letterText" class="zg-editor-input zu-seamless-input-origin-element" style="font-weight: normal; height: 22px;" data-receiver-id="'+er_id+'"></textarea></div><div class="zh-pm-warnmsg" style="display:none;text-align:right;color:#C3412F;"></div><div class="zm-command"><button class="Button Messages-sendButton Button--primary Button--green" type="button" onclick="sendLetter()">发送</button></div></div></div>';
    $('#appendArea').empty().prepend(data);
    g_last_getmoredata_index=0;
    g_setting_type="conversation_messages";
    var nums=g_last_getmoredata_index;//$('.Setting-item').length;
    var order=1;//pub_date
    var start=nums;
    var end=start+STEP;
    var url='/ajax/'+g_setting_type+'/'+conversation_id+'/'+order+'/'+start+'/'+end+'/';
    var post_data='';
    if("true"==g_lock_ajax)
        return;
    g_lock_ajax="true";
    $.post(url,post_data,function(ret){
        if("fail"!=ret)
        {
            g_last_getmoredata_index+=STEP;
            appendSettingPageElement(ret);
        }
        else
        {
            console.log("no more data");
            $("#appendArea").append('<div class="List-item NoMoreData"><div class="ContentItem" ><div class="ContentItem-status"  style="text-align:center">没有更多内容</div></div></div>');
        }
        g_lock_ajax="false";
    });
}
function initElement()
{
    if("false"==g_init_data_done)
        return;
    if("true"==g_logged)
    { 
        $("#MenuPopover").attr("data-er-id",g_user_id).attr("data-er-avatar",g_user_avatar).find("img").attr("src",g_user_avatar).removeClass("is-hide");
        appendLetterModal();
    }
    if("question"==g_module)
    {
        
        $('title').text(g_question_title+" - "+SITE);
        $(".QuestionHeader-title").empty().append('<a href="/question/'+g_question_id+'">'+g_question_title+'</a>');
        if($.inArray(""+g_question_id,g_user_follow_questions_list)>=0)
        {
            $(".QuestionButtonGroup .FollowButton").removeClass("Button--green").addClass("Button--grey").attr("data-question-id",g_question_id).attr("data-followed","true").text("已关注");
        }
        else
        {
            $(".QuestionButtonGroup .FollowButton").removeClass("Button--grey").addClass("Button--green").attr("data-question-id",g_question_id).attr("data-followed","false").text("关注问题");
        }
        
        $(".RichText img").addClass("origin_image");
        
        $(".QuestionFollowStatus-counts .NumberBoard-value:first").empty().text(g_question_follower_nums);
        $(".QuestionFollowStatus-counts .NumberBoard-value:last").empty().text(g_question_click_nums);

        var follow_botton=$(".Card.AnswerAuthor .FollowButton");
        var author_id=follow_botton.attr("data-author-id");
        var author_name=follow_botton.attr("data-author-name");
        var author_sexual=follow_botton.attr("data-author-sexual");
        console.log(author_id);
        console.log(author_sexual);
        if("f"==author_sexual)
        {
            var who="she";
            var who_han="她";
        }
        else
        {
            var who="he";
            var who_han="他";
        }
        if($.inArray(""+author_id,g_user_follow_peoples_list)>=0)
        {
            follow_botton.removeClass("Button--green").addClass("Button--grey").attr("data-followed","true").attr("data-who",who).text("已关注");
        }
        else
        {
            follow_botton.removeClass("Button--grey").addClass("Button--green").attr("data-followed","false").attr("data-who",who).text("关注"+who_han);
        }
        setLetterReceiver(author_id,author_name);
   
    }
    else if("topic"==g_module)
    {
        var hot_active_class="";
        var unanswered_active_class="";
        if("hot"==g_type)
            hot_active_class="is-active";
        else if("unanswered"==g_type)
            unanswered_active_class="is-active";
        else
        {
            g_type="hot";
            hot_active_class="is-active";
        }
        $(".Tabs.Topic-tabs").append('<li role="tab" class="Tabs-item Tabs-item--noMeta" aria-controls="Topic-hot"><a class="Tabs-link '+hot_active_class+'" href="/topic/'+g_topic_id+'/hot">讨论</a></li><li role="tab" class="Tabs-item Tabs-item--noMeta" aria-controls="Topic-wait"><a class="Tabs-link '+unanswered_active_class+'" href="/topic/'+g_topic_id+'/unanswered">等待回答</a></li>');
        $(".TopicCard-image").empty().append('<img alt="'+g_topic_name+'" src="'+g_topic_avatar+'">');
        $(".TopicCard-titleText").text(g_topic_name);
        $(".TopicCard-description>.RichText").text(g_topic_detail);
        $(".NumberBoard-value").append(g_topic_follower_nums);
        if($.inArray(""+g_topic_id,g_user_follow_topics_list)>=0)
            $(".FollowButton.TopicCard-followButton").removeClass("Button--green").addClass("Button--grey").attr("data-topic-id",g_topic_id).attr("data-followed","true").text("已关注");
        else
            $(".FollowButton.TopicCard-followButton").removeClass("Button--grey").addClass("Button--green").attr("data-topic-id",g_topic_id).attr("data-followed","false").text("关注栏目");   
    }
    else if("mytopic"==g_module)
    {
        window.onhashchange=hashChange;
        var current_topic=null;
        if((location.hash!="")&&(location.hash!=undefined))
        {
            g_topic_id=location.hash.replace("#","");
            $(".FollowedTopic").each(function(){
                if(g_topic_id==$(this).attr("data-topic-id"))
                {
                    $(this).addClass("current");
                    current_topic=$(this);
                }
                else
                    $(this).removeClass("current");
                    
            });
        }
        else
        {
            current_topic=$(".FollowedTopic:first");
        }
        g_topic_id=current_topic.addClass("current").attr("data-topic-id");
        g_topic_name=current_topic.attr("data-topic-name");
        g_topic_avatar=current_topic.attr("data-topic-avatar");
        g_topic_detail=current_topic.attr("data-topic-detail");
        
        $(".Card-section.Topic--current .TopicLink-link").attr("href","/topic/"+g_topic_id+"/");
        $(".Card-section.Topic--current img").attr("src",g_topic_avatar).attr("alt",g_topic_name);
        $(".Card-section.Topic--current .RichText").empty().text(g_topic_name);
        $(".Card-section.Topic--current .ContentItem-statusItem").empty().text(g_topic_detail);
        $('#appendArea').empty();
                
        

    }
    else if("alltopics"==g_module)
    {
    }
    else if("search"==g_module)
    {
        if(""==g_search_type)
        {
            g_search_type="question";
        }
        $(".Tabs-link").removeClass("is-active");
        $(".Tabs-link").each(function(){
            if($(this).attr("data-search-type")==g_search_type)
                $(this).addClass("is-active");
        });
        checkSearch();
    }
    else if("setting"==g_module)
    {
        $(".Tabs-link").removeClass("is-active");
        $(".Tabs-link").each(function(){
            if($(this).attr("href"))
            {
                if($(this).attr("href").indexOf(g_setting_type)>-1)
                    $(this).addClass("is-active");
            }
        });
        if("conversation_messages"==g_setting_type)
        {
            var data='<div class="List-item Conversation-messages-head"><div class="zg-section"><a href="/conversations">« 返回</a></div><div class="zg-section zg-14px"><span class="zg-gray-normal">发私信给 </span><span class="zg-gray-darker"></span>：</div><div class="zg-section LetterSend" id="zh-pm-editor-form"><div class="zg-editor-simple-wrap zg-form-text-input"><div class="zg-user-name" style="display:none"></div><textarea id="letterText" class="zg-editor-input zu-seamless-input-origin-element" style="font-weight: normal; height: 22px;" data-receiver-id="4"></textarea></div><div class="zh-pm-warnmsg" style="display:none;text-align:right;color:#C3412F;"></div><div class="zm-command"><button class="Button Messages-sendButton Button--primary Button--green" type="button" onclick="sendLetter()">发送</button></div></div></div>';
            $('#appendArea').prepend(data);
        }
        else if("settings"==g_setting_type)
        {
            var data='<div class="List-item"><div><label><input type="radio" name="notification-receive" value="all" checked="">允许接收通知</label>&nbsp;<label><input type="radio" name="notification-receive" value="all" checked="">禁止接收通知</label></div><button type="submit" class="Button Button--primary Button--green">保存</button></div><div class="List-item"><div><label><input type="radio" name="inboxmsg-receive" value="all" checked="">允许接收私信</label>&nbsp;<label><input type="radio" name="inboxmsg-receive" value="all" checked="">禁止接收私信</label></div><button type="submit" class="Button Button--primary Button--green">保存</button></div>';;
            $('#appendArea').prepend(data);
        }
        checkSettingPage();
    }
    else if("sign"==g_module)
    {
        checkSmsSend();
        checkSignAndMiscPage();
        var secs=getCookie("countdown");
        if(null!=secs)
        {
            g_countdown_secs=secs;
            $(".SignFlow-smsInputButton").addClass("is-counting").empty().append('<span id="counting-num">59</span>秒后可重发');
            setTimeout("countDown()",1000);
        }
    }
    else if("misc"==g_module)
    {
        if("password_reset"!=g_arg)
        {
            var data='<div class="" style="position:relative;padding:0 16px;margin:100px auto;"><div class="" style="font-size:20px;font-weight:600;font-synthesis:style;color:#1a1a1a;text-align:center;padding:10px auto;"><h1 id="errorText" style="margin:20px auto;color:red;"></h1><a id="returnLink" style="color:blue;" href="/"></a></div></div>';
            $("main").empty().append(data);
            if("e_veri_code"==g_arg)
            {
                $("#errorText").text("验证码错误，注册失败，请尝试返回注册页面重新注册");
                $("#returnLink").text("返回重新注册");
                setTimeout(function(){window.location.href="/signinup/?next=/";},10*1000);
            }
            else if("e_u_p"==g_arg)
            {
                $("#errorText").text("用户名密码错误，登录失败，请尝试返回登录页面重新登录");
                $("#returnLink").text("返回重新登录");
                setTimeout(function(){window.location.href="/signinup/?next=/";},10*1000);
            }
            else if("e_registered"==g_arg)
            {
                $("#errorText").text("该手机号已被注册，请尝试找回密码或更换手机号重新注册");
                $("#returnLink").text("返回重新注册");
                setTimeout(function(){window.location.href="/signinup/?next=/";},10*1000);
            }
            else if("reset_pwd_success"==g_arg)
            {
                $("#errorText").text("重置密码成功");
                $("#returnLink").text("返回重新登录");
                setTimeout(function(){window.location.href="/signinup/?next=/";},10*1000);
            }
        }
        else
        {
            checkSmsSend();
            checkSignAndMiscPage();
            var secs=getCookie("countdown");
            if(null!=secs)
            {
                g_countdown_secs=secs;
                $(".SignFlow-smsInputButton").addClass("is-counting").empty().append('<span id="counting-num">59</span>秒后可重发');
                setTimeout("countDown()",1000);
            }
        }
    }
    else if("home"==g_module)
    {
        $("#MenuPopover").attr({"src":g_user_avatar,"srcset":g_user_avatar,"data-er-id":g_user_id});
        $(".ProfileHeader-name").text(g_er_name);
        $("#id_avatar").attr({"src":g_er_avatar,"srcset":g_er_avatar});
        $(".ProfileHeader-headline").text(g_er_mood);
        
        var job_element='<div class="ProfileHeader-infoItem"><div class="ProfileHeader-iconWrapper"><svg viewBox="0 0 20 18" class="Icon Icon--company" width="13" height="16" aria-hidden="true" style="height: 16px; width: 13px;"><title></title><g><path d="M15 3.998v-2C14.86.89 13.98 0 13 0H7C5.822 0 5.016.89 5 2v2l-3.02-.002c-1.098 0-1.97.89-1.97 2L0 16c0 1.11.882 2 1.98 2h16.033c1.1 0 1.98-.89 1.987-2V6c-.007-1.113-.884-2.002-1.982-2.002H15zM7 4V2.5s-.004-.5.5-.5h5c.5 0 .5.5.5.5V4H7z"></path></g></svg></div>'+g_er_job+'</div>'
        
        if("f"==g_er_sexual)
        {
            g_er_sexual_han="女";
            g_who="she";
            g_who_han="她";
            var followed_text="关注她";
            var sexual_icon='<div class="ProfileHeader-infoItem"><div class="ProfileHeader-iconWrapper"><svg width="14" height="16" viewBox="0 0 12 16" class="Icon Icon--female" aria-hidden="true" style="height: 16px; width: 14px;"><title></title><g><path d="M6 0C2.962 0 .5 2.462.5 5.5c0 2.69 1.932 4.93 4.485 5.407-.003.702.01 1.087.01 1.087H3C1.667 12 1.667 14 3 14s1.996-.006 1.996-.006v1c0 1.346 2.004 1.346 1.998 0-.006-1.346 0-1 0-1S7.658 14 8.997 14c1.34 0 1.34-2-.006-2.006H6.996s-.003-.548-.003-1.083C9.555 10.446 11.5 8.2 11.5 5.5 11.5 2.462 9.038 0 6 0zM2.25 5.55C2.25 3.48 3.93 1.8 6 1.8c2.07 0 3.75 1.68 3.75 3.75C9.75 7.62 8.07 9.3 6 9.3c-2.07 0-3.75-1.68-3.75-3.75z" fill-rule="evenodd"></path></g></svg></div></div>';
        }
        else
        {
            g_er_sexual_han="男";
            g_who="he";
            g_who_han="他";
            var followed_text="关注他";
            var sexual_icon='<div class="ProfileHeader-infoItem"><div class="ProfileHeader-iconWrapper"><svg width="14" height="16" viewBox="0 0 14 14" class="Icon Icon--male" aria-hidden="true" style="height: 16px; width: 14px;"><title></title><g><path d="M3.025 10.64c-1.367-1.366-1.367-3.582 0-4.95 1.367-1.366 3.583-1.366 4.95 0 1.367 1.368 1.367 3.584 0 4.95-1.367 1.368-3.583 1.368-4.95 0zm10.122-9.368c-.002-.414-.34-.75-.753-.753L8.322 0c-.413-.002-.746.33-.744.744.002.413.338.75.75.752l2.128.313c-.95.953-1.832 1.828-1.832 1.828-2.14-1.482-5.104-1.27-7.013.64-2.147 2.147-2.147 5.63 0 7.777 2.15 2.148 5.63 2.148 7.78 0 1.908-1.91 2.12-4.873.636-7.016l1.842-1.82.303 2.116c.003.414.34.75.753.753.413.002.746-.332.744-.745l-.52-4.073z" fill-rule="evenodd"></path></g></svg></div></div>';
        }
        g_contentbody_data='<div class="ProfileHeader-info">'+job_element+sexual_icon+'</div>';
        $(".ProfileHeader-contentBody").empty().append(g_contentbody_data);
        var detail_icon_svg='<svg viewBox="0 0 10 6" class="Icon ProfileHeader-arrowIcon Icon--arrow" width="10" height="16" aria-hidden="true" style="height: 16px; width: 10px;"><title></title><g><path d="M8.716.217L5.002 4 1.285.218C.99-.072.514-.072.22.218c-.294.29-.294.76 0 1.052l4.25 4.512c.292.29.77.29 1.063 0L9.78 1.27c.293-.29.293-.76 0-1.052-.295-.29-.77-.29-1.063 0z"></path></g></svg>';
        if(g_er_id==g_user_id)
        {
            g_who="me";
            g_who_han="我";
            var data='<button class="Button ProfileHeader-expandButton Button--plain" type="button">'+detail_icon_svg+'查看详细资料</button><div class="ProfileButtonGroup ProfileHeader-buttons"><button class="ProfileEditButton Button Button--green" type="button">编辑个人资料</button></div>';
        }
        else
        {
            if($.inArray(""+g_er_id,g_user_follow_peoples_list)>=0)
            {
                var followed_text="已关注";
                var followed_status="true";
                var followed_button_class="Button--grey";
            }
            else
            {
                var followed_status="false";
                var followed_button_class="Button--green";
            }
            var data='<button class="Button ProfileHeader-expandButton Button--plain" type="button">'+detail_icon_svg+'查看详细资料</button><div class="MemberButtonGroup ProfileButtonGroup ProfileHeader-buttons"><button class="Button FollowButton Button--primary '+followed_button_class+'" type="button" data-er-id="'+g_er_id+'" data-who="'+g_who+'" data-follow-type="people" data-followed='+followed_status+'>'+followed_text+'</button><button class="Button Button--grey Button--withIcon Button--withLabel" type="button" data-toggle="modal" data-target="#letterModal"><span style="display: inline-flex; align-items: center;">&#8203;'+letter_icon_svg+'</span>发私信</button></div>';
        }
        $(".ProfileHeader-contentFooter").append(data);
           
        var answers_active="";
        var asks_active="";
        var posts_active="";
        var following_active="";	
        if ("answers"==g_command)
        {
            answers_active="is-active";
            var data='<div class="List Profile-answers"><div class="List-header"><h4 class="List-headerText"><span>'+g_who_han+'的回答</span></h4></div><div id="appendArea"></div></div>';
            $("#profileMainContent").append(data);
            //appendAnswerElement();
        }
        else if("asks"==g_command)
        {
            asks_active="is-active";
            var data='<div class="List Profile-answers"><div class="List-header"><h4 class="List-headerText"><span>'+g_who_han+'的问题</span></h4></div><div id="appendArea"></div></div>';
            $("#profileMainContent").append(data);
            //appendQuestionElement();
        }
        else if("posts"==g_command)
        {
            posts_active="is-active";
            //appendQuestionElement();
        }
        else if("following"==g_command)
        {
            following_active="is-active";
            appendFollowOrMoreHead();
            //appendFollowElement();
        }
        else 
            console.log("false");
        
        var tabs='<li role="tab" class="Tabs-item" aria-controls="Profile-answers"><a class="Tabs-link '+answers_active+'" href="/er/'+g_er_id+'/answers/">回答<span class="Tabs-meta">'+g_answer_nums+'</span></a></li><li role="tab" class="Tabs-item" aria-controls="Profile-asks"><a class="Tabs-link '+asks_active+'" href="/er/'+g_er_id+'/asks/">提问<span class="Tabs-meta">'+g_question_nums+'</span></a></li><li role="tab" class="Tabs-item" aria-controls="Profile-posts"><a class="Tabs-link '+posts_active+'" href="/er/'+g_er_id+'/posts/">文章<span class="Tabs-meta">0</span></a></li><li role="tab" class="Tabs-item" aria-controls="Profile-following"><a class="Tabs-link '+following_active+'" href="/er/'+g_er_id+'/following/">关注<span class="Tabs-meta"><svg viewBox="0 0 10 6" class="Icon ProfileMain-tabIcon Icon--arrow" width="10" height="16" aria-hidden="true" style="height: 16px; width: 10px;"><title></title><g><path d="M8.716.217L5.002 4 1.285.218C.99-.072.514-.072.22.218c-.294.29-.294.76 0 1.052l4.25 4.512c.292.29.77.29 1.063 0L9.78 1.27c.293-.29.293-.76 0-1.052-.295-.29-.77-.29-1.063 0z"></path></g></svg></span></a></li>';
        $(".Tabs.ProfileMain-tabs").append(tabs);
        
        
        var data='<div class="NumberBoard FollowshipCard-counts NumberBoard--divider"><a class="Button NumberBoard-item Button--plain" type="button" href="/er/'+g_er_id+'/following/followtos"><div class="NumberBoard-itemInner"><div class="NumberBoard-itemName">关注了</div><strong class="NumberBoard-itemValue">'+g_followto_nums+'</strong></div></a><a class="Button NumberBoard-item Button--plain" type="button" href="/er/'+g_er_id+'/following/followers"><div class="NumberBoard-itemInner"><div class="NumberBoard-itemName">关注者</div><strong class="NumberBoard-itemValue NumberBoard-value" data-update-value-type="people-followed">'+g_follower_nums+'</strong></div></a></div>';
        $(".Card.FollowshipCard").append(data);
        
        var data='<a class="Profile-lightItem" href="/er/'+g_er_id+'/following/topics"><span class="Profile-lightItemName">关注的栏目</span><span class="Profile-lightItemValue">'+g_followtopic_nums+'</span></a><a class="Profile-lightItem" href="/er/'+g_er_id+'/following/questions"><span class="Profile-lightItemName">关注的问题</span><span class="Profile-lightItemValue">'+g_followquestion_nums+'</span></a>';
        
        $(".Profile-lightList").append(data);
        
        setLetterReceiver(g_er_id,g_er_name);
        checkAvatar();
        //checkNextPage();
        checkHomePage();
    }
    else if("answer_page"==g_module)
    {
        $(".ContentLayout-mainColumn .Tabs-item").each(function(){
            if(g_type==$(this).attr("data-type"))
                $(this).children(".Tabs-link").addClass("is-active");
        });
        if("all"==g_type)
            var lists_header_text='全站的问题';
        else if("invited"==g_type)
            var lists_header_text='邀请我回答的问题';
        else
            var lists_header_text='为你推荐的问题';
        $(".ContentLayout-mainColumn .Card .List .List-headerText").empty().append(lists_header_text);
    }
    else if("article"==g_module)
    {
        $(".Post-Title").empty().append(g_article_title);
        var article_content=$("main").attr("data-article-content");
        $(".Post-RichText").empty().append(addClassImg(article_content,'class="origin_image zh-lightbox-thumb lazy"'));
        var follow_text="关注她";
        var button_follow_class="Button--green";
        var data_who="she";
        if("f"!=g_article_author_sexual)
        {
            follow_text="关注他";
            data_who="he";
        }
        var followed="false";
        if($.inArray(""+g_article_author_id,g_user_follow_peoples_list)>=0)
        {
            button_follow_class="Button--grey";
            follow_text="已关注";
            followed="true";
        }
        $(".FollowButton").addClass(button_follow_class).removeClass("is-hide").attr("data-er-id",g_article_author_id).attr("data-followed",followed).attr("data-who",data_who).children("span").text(follow_text);
        
        $(".Post-Author .AuthorInfo-avatarWrapper .UserLink-link").attr("href","/er/"+g_article_author_id).children("img").attr("alt",g_article_author_name).attr("src",g_article_author_avatar);
        $(".Post-Author .AuthorInfo-name .UserLink-link").attr("href","/er/"+g_article_author_id).empty().text(g_article_author_name);
        $(".Post-Author .AuthorInfo-detail .AuthorInfo-badgeText").empty().text(g_article_author_mood);
        
        var pub_date_text="发布于 "+g_article_pub_date.split('.')[0];
        $(".ContentItem-time>a").attr("href","/article/"+g_article_id+"/").children("span").attr("data-tooltip",pub_date_text).text(pub_date_text);
        
        $(".Comment--nums--nouse").empty().text(g_article_comment_nums);
        $(".Article--likenums--nouse").empty().text(g_article_like_nums);
        $(".Button-like-nouse").attr("data-like-id",g_article_id);
        
        checkInteractionButton();
        getComments("article",g_article_id);
    }
    else if("write"==g_module)
    {
        $('#summernote_write').summernote({
            toolbar: [
            // [groupName, [list of button]]
            ['style', ['bold', 'italic', 'underline']],
            ['font', ['strikethrough', 'superscript', 'subscript']],
            ['para', ['paragraph']],
            ['table', ['table']],
            ['link', ['link']],
            ['picture', ['picture']],
            ['video', ['video']]
            ],
            height:null,
            minHeight:500,
            lang:'zh-CN',
            placeholder:'请输入文章内容(至少100字)',
            disableDragAndDrop:true,
            callbacks: {
                onImageUpload: function(files){
                    scaleAndUploadImage("forWrite",files[0],720);
                }
            }
        });
        $(".note-statusbar").addClass("is-hide");
        checkWrite();
    }
    g_init_element_done="true";
}

function initData()
{
	var str_main_data=$("main").attr("data-dfs-main");
	console.log(str_main_data);
	var main_data=JSON.parse(str_main_data);//str_main_data.parseJSON();
	g_logged=main_data.logged;

    if("question"==g_module)
    {
        g_question_id=main_data.question_id;
        g_question_title=main_data.question_title;
        g_question_detail=$("main").attr("data-question-detail");
        g_question_follower_nums=main_data.question_follower_nums;
        g_question_answer_nums=main_data.question_answer_nums;
        g_question_click_nums=main_data.question_click_nums;

        if($(".Question-main .Card.AnswerCard").length>0)
            g_list_type="more";
        else
            g_list_type="all";
    }
    else if("topic"==g_module)
    {
        g_topic_id=main_data.topic_id;
        g_topic_name=main_data.topic_name;
        g_topic_avatar=main_data.topic_avatar;
        g_topic_detail=main_data.topic_detail;
        g_topic_follower_nums=main_data.topic_follower_nums;
        g_type=main_data.type;
    }
    else if("mytopic"==g_module)
    {
    }
    else if("alltopics"==g_module)
    {
        g_topiclist_item_index=1;
    }
    else if("search"==g_module)
    {
        g_search_keyword=main_data.search_keyword;
        g_search_type=main_data.search_type;
    }
    else if("setting"==g_module)
    {
        g_setting_type=main_data.type;
        g_conversation_id=main_data.conversation_id;
    }
    else if("misc"==g_module)
    {
        g_arg=main_data.arg;
    }
    else if("home"==g_module)
    {
        var str_ext_data=$("main").attr("data-dfs-ext");
        var ext_data=JSON.parse(str_ext_data);

        g_er_id=main_data.er_id;
        g_er_name=main_data.er_name;
        g_er_avatar=main_data.er_avatar;
        g_er_mood=main_data.er_mood;
        g_er_sexual=main_data.er_sexual;
        g_er_residence=main_data.er_residence;
        g_er_job=main_data.er_job;
        g_er_intro=main_data.er_intro;

        g_followed=main_data.followed;
        g_command=main_data.command;
        g_subcmd=main_data.subcmd;

        g_question_nums=ext_data.question_nums;
        g_article_nums=ext_data.article_nums;
        g_answer_nums=ext_data.answer_nums;
        g_followto_nums=ext_data.followto_nums;
        g_follower_nums=ext_data.follower_nums;
        g_followtopic_nums=ext_data.followtopic_nums;
        g_followquestion_nums=ext_data.followquestion_nums;
        
        g_show_detailed="false";
    }
    else if("article"==g_module)
    {
        g_article_id=main_data.article_id;
        g_article_title=main_data.article_title;
        g_article_click_nums=main_data.article_click_nums;
        g_article_like_nums=main_data.article_like_nums;
        g_article_comment_nums=main_data.article_comment_nums;
        g_article_pub_date=main_data.article_pub_date;
        g_article_author_id=main_data.author_id;
        g_article_author_name=main_data.author_name;
        g_article_author_avatar=main_data.author_avatar;
        g_article_author_mood=main_data.author_mood;
        g_article_author_sexual=main_data.author_sexual;
    }
    else if("answer_page"==g_module)
    {
        g_type=main_data.type;
    }
    
    if("true"==g_logged)
    {               
        g_user_id=main_data.user_id;
        g_user_name=main_data.user_name;
        //g_user_avatar=main_data.user_avatar;
        //g_user_mood=main_data.user_mood;
        
        g_user_token=g_user_id.substr(g_user_id.length-5,g_user_id.length); 
        g_cookie_expire=1*24*60*60;        
                            
        var user_follow_peoples=getCookie("ufp"+g_user_token);
        var user_follow_topics=getCookie("uft"+g_user_token);
        var user_follow_questions=getCookie("ufq"+g_user_token);
        var user_profile=getCookie("up"+g_user_token);
        if((null==user_follow_peoples)||(null==user_follow_questions)||(null==user_follow_topics)|(null==user_profile))
        {          
            var url='/ajax/user_data/'+g_user_id+'/';
            var post_data={"type":"all"};
            $.post(url,post_data,function(ret){
                if("fail"!=ret)
                {
                    g_user_follow_peoples_list=String(ret[0]).split(",");
                    g_user_follow_topics_list=String(ret[1]).split(",");
                    g_user_follow_questions_list=String(ret[2]).split(",");
                    g_user_profile_list=ret[3];
                    
                    //g_user_id=g_user_profile_list[0];
                    //g_user_name=g_user_profile_list[1];
                    g_user_avatar=g_user_profile_list[2];
                    g_user_mood=g_user_profile_list[3];
                    

            
                    delCookie("ufp"+g_user_token);
                    delCookie("uft"+g_user_token);
                    delCookie("ufq"+g_user_token);
                    delCookie("up"+g_user_token);
                    
                    setCookie("ufp"+g_user_token,utf8_to_b64(ret[0]),g_cookie_expire);
                    setCookie("uft"+g_user_token,utf8_to_b64(ret[1]),g_cookie_expire);
                    setCookie("ufq"+g_user_token,utf8_to_b64(ret[2]),g_cookie_expire);
                    setCookie("up"+g_user_token,utf8_to_b64(ret[3]),g_cookie_expire);  
                }
                g_init_data_done="true";
                initElement()
                action();
            });
        }
        else
        {
            g_user_follow_peoples_list=b64_to_utf8(user_follow_peoples).split(",");
            g_user_follow_topics_list=b64_to_utf8(user_follow_topics).split(",");
            g_user_follow_questions_list=b64_to_utf8(user_follow_questions).split(",");
            g_user_profile_list=b64_to_utf8(user_profile).split(",");           
            
            //g_user_id=g_user_profile_list[0];
            //g_user_name=g_user_profile_list[1];
            g_user_avatar=g_user_profile_list[2];
            g_user_mood=g_user_profile_list[3];
            
            g_init_data_done="true";
        }

    }
    else
    {
        g_init_data_done="true";
    }
} 
function action()
{
    if("false"==g_init_element_done)
        return;
    if(("sign"!=g_module)&&("misc"!=g_module)&&("nofeature"!=g_module))
    {
        getMoreData();
        checkSets();
    }
    g_init_done="true";
    console.log("init done");
}
function init()
{
    g_module=$("main").attr("data-module");
    initData();
    initElement();
    action();
}
function initCommon()
{
    LARGE_TEXT_MAX_LENGTH=10000;
    MIDDLE_TEXT_MAX_LENGTH=500;
    LITTLE_TEXT_MAX_LENGTH=100;
    TEXT_MIN_LENGTH_HIGH=100;
    TEXT_MIN_LENGTH_MID=50;
    TEXT_MIN_LENGTH_LOW=10;
    notifications="null";
    messages="null";
    g_last_getmoredata_index=0;
    g_sticky_show="false";
    cache_topics="";
    g_selectpicker_init="false";
    g_init_data_done="false";
    g_init_element_done="false";
    
    g_user_follow_peoples_list=[];
    g_user_follow_topics_list=[];
    g_user_follow_questions_list=[];
    
    g_cache_question_id_list=[];
    g_cache_article_id_list=[];
           
    modify_icon_svg='<svg viewBox="0 0 12 12" class="Icon ModifyButton-icon Icon--modify" width="12" height="16" aria-hidden="true" style="height: 16px; width: 12px;"><title></title><g><path d="M.423 10.32L0 12l1.667-.474 1.55-.44-2.4-2.33-.394 1.564zM10.153.233c-.327-.318-.85-.31-1.17.018l-.793.817 2.49 2.414.792-.814c.318-.328.312-.852-.017-1.17l-1.3-1.263zM3.84 10.536L1.35 8.122l6.265-6.46 2.49 2.414-6.265 6.46z" fill-rule="evenodd"></path></g></svg>';
    like_icon_svg='<svg viewBox="0 0 20 18" xmlns="http://www.w3.org/2000/svg" class="Icon Icon--like Icon--left" width="13" height="16" aria-hidden="true" style="height: 16px; width: 13px;"><title></title><g><path d="M.718 7.024c-.718 0-.718.63-.718.63l.996 9.693c0 .703.718.65.718.65h1.45c.916 0 .847-.65.847-.65V7.793c-.09-.88-.853-.79-.846-.79l-2.446.02zm11.727-.05S13.2 5.396 13.6 2.89C13.765.03 11.55-.6 10.565.53c-1.014 1.232 0 2.056-4.45 5.83C5.336 6.965 5 8.01 5 8.997v6.998c-.016 1.104.49 2 1.99 2h7.586c2.097 0 2.86-1.416 2.86-1.416s2.178-5.402 2.346-5.91c1.047-3.516-1.95-3.704-1.95-3.704l-5.387.007z"></path></g></svg>';
    comment_icon_svg='<svg class="Zi Zi--Comment Button-zi" fill="currentColor" viewBox="0 0 24 24" width="1.2em" height="1.2em"><path d="M10.241 19.313a.97.97 0 0 0-.77.2 7.908 7.908 0 0 1-3.772 1.482.409.409 0 0 1-.38-.637 5.825 5.825 0 0 0 1.11-2.237.605.605 0 0 0-.227-.59A7.935 7.935 0 0 1 3 11.25C3 6.7 7.03 3 12 3s9 3.7 9 8.25-4.373 9.108-10.759 8.063z" fill-rule="evenodd"></path></svg>'
    share_button='<div class="Popover ShareMenu ContentItem-action"><div class="" aria-haspopup="true" aria-expanded="false"><img class="ShareMenu-fakeQRCode" src="" alt="微信二维码"><button class="Button Button--plain Button--withIcon Button--withLabel" type="button"><span style="display: inline-flex; align-items: center;">&#8203;<svg class="Zi Zi--Share Button-zi" fill="currentColor" viewBox="0 0 24 24" width="1.2em" height="1.2em"><path d="M2.931 7.89c-1.067.24-1.275 1.669-.318 2.207l5.277 2.908 8.168-4.776c.25-.127.477.198.273.39L9.05 14.66l.927 5.953c.18 1.084 1.593 1.376 2.182.456l9.644-15.242c.584-.892-.212-2.029-1.234-1.796L2.93 7.89z" fill-rule="evenodd"></path></svg></span>分享</button></div></div>';
    letter_icon_svg='<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" class="Icon Button-icon Icon--comments" width="15" height="16" aria-hidden="true" style="height: 16px; width: 15px;"><title></title><g><g>     <path d="M9 0C3.394 0 0 4.13 0 8c0 1.654.522 3.763 2.014 5.566.314.292.518.82.454 1.17-.165 1.488-.842 1.905-.842 1.905-.328.332.105.67.588.582 1.112-.2 2.07-.58 3.526-1.122.4-.202.464-.147.78-.078C11.524 17.764 18 14 18 8c0-3.665-3.43-8-9-8z"></path>     <path d="M19.14 9.628c.758.988.86 2.01.86 3.15 0 1.195-.62 3.11-1.368 3.938-.21.23-.354.467-.308.722.12 1.073.614 1.5.614 1.5.237.24-.188.563-.537.5-.802-.145-1.494-.42-2.545-.81-.29-.146-.336-.106-.563-.057-2.043.712-4.398.476-6.083-.926 5.964-.524 8.726-3.03 9.93-8.016z"></path>   </g></g></svg>';
    $('#summernote_question').summernote({
        toolbar: [
        // [groupName, [list of button]]
        ['style', ['italic']],
        ['font', ['superscript', 'subscript']],
        ['table', ['table']],
        ['link', ['link']],
        ['picture', ['picture']],
        ['video', ['video']]
        ],
        minHeight:150,
        lang:'zh-CN',
        placeholder:'问题背景、条件等详细信息',
        callbacks: {
            onImageUpload: function(files){
                scaleAndUploadImage("forQuestion",files[0],720);
            },
            onInit:function(){
                $(".note-statusbar").addClass("is-hide");
            }
        }
    });
    
    $('#summernote_answer').summernote({
        toolbar: [
        // [groupName, [list of button]]
        ['style', ['bold', 'italic', 'underline']],
        ['font', ['strikethrough', 'superscript', 'subscript']],
        ['para', ['paragraph']],
        ['table', ['table']],
        ['link', ['link']],
        ['picture', ['picture']],
        ['video', ['video']]
        ],
        minHeight:150,
        lang:'zh-CN',
        placeholder:'写回答...',
        callbacks: {
            onImageUpload: function(files){
                scaleAndUploadImage("forAnswer",files[0],720);
            },
            onInit:function(){
                $(".note-statusbar").addClass("is-hide");
            }
        }
    });
    
    checkSelectOption();
}

function slog(arg)
{
    if("true"==ENABLE_SCREEN_LOG)
    {
        var data='<div>'+arg+'</div>';
        $("#debug").append(data);
    }
}

$(document).ready(function() {
    console.log("init");
    initCommon();
    init();
});
$(document).click(function(e) {
    $("#NotificationPopover").popover("hide");
    $("#MessagePopover").popover("hide");
    $("#MenuPopover").popover("hide");
    //$("#searchInput").popover("hide");
});
window.onscroll = function (){ 
    if("false"==g_init_done)
        return;
    if("article"==g_module)
    {
        if($(window).scrollTop()+$(window).height()>$(".RichContent-actions-anchor").offset().top)
        {
            if("true"==g_sticky_show)
            {
                $(".Sticky.RichContent-actions").removeClass("is-fixed").attr("style","");
                $(".Sticky--holder").remove();
                 g_sticky_show="false";
            }
        }
        else
        {
            if("false"==g_sticky_show)
            {
                $(".Sticky.RichContent-actions").addClass("is-fixed").attr("style","width: 690px; bottom: 0px; left: auto;");
                $(".Sticky--holder").remove();
                $(".RichContent-actions-nouse").after('<div class="Sticky--holder" style="position: static; top: auto; right: auto; bottom: 0px; left: 0px; display: block; float: none; margin: 0px 0px 10px; height: 54px;"></div>');
                g_sticky_show="true";
            }
        }
    }
    
    if (getScrollTop() + getClientHeight() +10 >= getScrollHeight()) {
                getMoreData();
        }
} 
SITE="大农令";
STEP=10;
g_lock_ajax="false";
g_init_done="false";
ENABLE_SCREEN_LOG="true";//"false"

function veriLogin()
{
    if("true"!=g_logged)
    {
        var old_href=location.href;
        location.href="/signinup/?next="+old_href;
        return false;
    }
    return true;
}

function hashChange()
{
        g_last_getmoredata_index=0;
        g_topic_id=location.hash.replace("#","");
        $(".FollowedTopic").each(function(){
            if(g_topic_id==$(this).attr("data-topic-id"))
            {
                $(this).addClass("current");
                g_topic_name=$(this).attr("data-topic-name");
                g_topic_avatar=$(this).attr("data-topic-avatar");
                g_topic_detail=$(this).attr("data-topic-detail");
            }
            else
                $(this).removeClass("current");
                
        });
        
        $(".Card-section.Topic--current .TopicLink-link").attr("href","/topic/"+g_topic_id+"/");
        $(".Card-section.Topic--current img").attr("src",g_topic_avatar).attr("alt",g_topic_name);
        $(".Card-section.Topic--current .RichText").empty().text(g_topic_name);
        $(".Card-section.Topic--current .ContentItem-statusItem").empty().text(g_topic_detail);
        $('#appendArea').empty();
        getMoreData();      
}



