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
            var rich_content='<div class="RichContent '+richContent_class+'"><div class="RichContent-expand"><div class="RichContent-inner" style="max-height: 400px;"><span class="RichText CopyrightRichText-richText">'+addClassImg(answer_content,'class="origin_image"')+'</span></div><button class="'+expand_btn_class+'" type="button">展开阅读全文'+expand_icon_svg+'</button></div><div class="ContentItem-actions"><span><button class="Button-like-nouse Button Button--plain" type="button" data-like-type="answer" data-like-id="'+answer_id+'">'+like_icon_svg+like_nums+'</button></span><button class="Button ContentItem-action Button--plain Button--withIcon Button--withLabel" type="button"><span style="display: inline-flex; align-items: center;">&#8203;'+comment_icon_svg+'</span>'+comment_nums+' 条评论</button>'+share_button+'<button class="'+collapse_btn_class+'" type="button"><span class="RichContent-collapsedText">收起</span>'+collapsed_icon_svg+'</button></div></div>';
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
                var pub_date=ret[i][9];
                var author_id=ret[i][10];
                var author_name=ret[i][11];
                var author_avatar=ret[i][12];
                var author_mood=ret[i][13];
                var author_sexual=ret[i][14];
                var author_question_nums=ret[i][15];
                var author_article_nums=ret[i][16];
                var author_answer_nums=ret[i][17];
                var author_followto_nums=ret[i][18];
                var author_follower_nums=ret[i][19];
                var author_followtopic_nums=ret[i][21];
                var author_followquestion_nums=ret[i][21];                              
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
            var rich_content='<div class="RichContent is-collapsed RichContent--withMask"><div class="RichContent-content" '+data_content_url+'><div class="RichContent-cover RichContent-cover--mobile"><div class="RichContent-cover-inner" data-index-img-url="'+index_img_url+'"></div></div><div class="RichContent-inner RichContent-inner--collapsed"><span class="RichText CopyrightRichText-richText">'+removeImg(answer_content)+'</span></div></div><div class="ContentItem-actions"><span><button class="Button-like-nouse Button Button--plain" type="button" '+like_element_attr+'>'+like_icon_svg+like_nums+'</button></span><button class="Button ContentItem-action Button--plain Button--withIcon Button--withLabel" type="button"><span style="display: inline-flex; align-items: center;">&#8203;'+comment_icon_svg+'</span>'+comment_nums+' 条评论</button>'+share_button+'</div></div>';
        }
        
        
        var appendElement='<div class="List-item ScrollIntoMark"><div class="ContentItem AnswerItem" '+content_type_element+' data-comment-nums="'+comment_nums+'">'+question_title_element+'<div class="ContentItem-meta"><div class="AuthorInfo AnswerItem-authorInfo AuthorInfo--plain"><span class="UserLink AuthorInfo-avatarWrapper"><a class="UserLink-link" target="_blank" href="/er/'+author_id+'/"><img class="Avatar AuthorInfo-avatar" width="24" height="24" src="'+author_avatar+'" srcset="'+author_avatar+'" alt="'+author_name+'"></a></span><div class="AuthorInfo-content"><div class="AuthorInfo-head"><span class="UserLink AuthorInfo-name"><a class="UserLink-link" target="_blank" href="/er/'+author_id+'/">'+author_name+'</a></span></div><div class="AuthorInfo-detail"><div class="AuthorInfo-badge"><div class="RichText AuthorInfo-badgeText">'+author_mood+'</div></div></div></div></div></div>'+rich_content+'</div></div>';
        
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
            var question_element='<h2 class="ContentItem-title"><div><a target="_blank" href="/article/'+article_id+'/">'+article_title+'</a></div>';
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
            var question_element='<h2 class="ContentItem-title"><div><a target="_blank" href="/question/'+question_id+'/?ans='+answer_id+'">'+question_title+'</a></div></h2>';
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
        var pub_date=ret[i][9];
        var author_id=ret[i][10];
        var author_name=ret[i][11];
        var author_avatar=ret[i][12];
        var author_mood=ret[i][13];
        var author_sexual=ret[i][14];
        var author_question_nums=ret[i][15];
        var author_article_nums=ret[i][16];
        var author_answer_nums=ret[i][17];
        var author_followto_nums=ret[i][18];
        var author_follower_nums=ret[i][19];
        var author_followtopic_nums=ret[i][20];
        var author_followquestion_nums=ret[i][21];
        
        var topics_data='';
        for(i in topics)
        {
            var topic_id=topics[i][0];
            var topic_name=topics[i][1];
            topics_data+='<span style="margin-right:15px;"><a href="/topic/'+topic_id+'/" class="1TopicPopover" data-topic-id="'+topic_id+'" data-toggle="popover" data-placement="bottom" data-trigger="manual" data-content="null" data-html="true">'+topic_name+'</a></span>';
        }

        var topic_element='<div class="FeedSource-firstline"><span>'+topics_data+'</span></div>';


        var index_img_url=getIndexImg(content);
        

        var author_info_element='<div class="AuthorInfo FeedSource-byline AuthorInfo--plain"><span class="UserLink AuthorInfo-avatarWrapper"><a class="UserLink-link" target="_blank" href="/er/'+author_id+'/"><img class="Avatar AuthorInfo-avatar" width="24" height="24" src="'+author_avatar+'" srcset="'+author_avatar+'" alt="'+author_name+'"></a></span><div class="AuthorInfo-content"><div class="AuthorInfo-head"><span class="UserLink AuthorInfo-name"><a class="UserLink-link" target="_blank" href="/er/'+author_id+'/">'+author_name+'</a><a class="UserLink-badge" 111data-tooltip="优秀回答者" href="/er/'+author_id+'/" target="_blank"><svg viewBox="0 0 20 20" class="Icon Icon--badgeGlorious" width="16" height="16" aria-hidden="true" style="height: 16px; width: 16px;"><title>用户标识</title><g><g fill="none" fill-rule="evenodd">     <path d="M.64 11.39c1.068.895 1.808 2.733 1.66 4.113l.022-.196c-.147 1.384.856 2.4 2.24 2.278l-.198.016c1.387-.12 3.21.656 4.083 1.735l-.125-.154c.876 1.085 2.304 1.093 3.195.028l-.127.152c.895-1.068 2.733-1.808 4.113-1.66l-.198-.022c1.386.147 2.402-.856 2.28-2.238l.016.197c-.12-1.388.656-3.212 1.735-4.084l-.154.125c1.084-.876 1.093-2.304.028-3.195l.152.127c-1.068-.895-1.808-2.732-1.66-4.113l-.022.198c.147-1.386-.856-2.4-2.24-2.28l.198-.016c-1.387.122-3.21-.655-4.083-1.734l.125.153C10.802-.265 9.374-.274 8.483.79L8.61.64c-.895 1.068-2.733 1.808-4.113 1.662l.198.02c-1.386-.147-2.4.857-2.28 2.24L2.4 4.363c.12 1.387-.656 3.21-1.735 4.084l.154-.126C-.265 9.2-.274 10.626.79 11.517L.64 11.39z" fill="#FF9500"></path>     <path d="M10.034 12.96L7.38 14.58c-.47.286-.747.09-.618-.45l.72-3.024-2.36-2.024c-.418-.357-.318-.68.235-.725l3.1-.25 1.195-2.87c.21-.508.55-.513.763 0l1.195 2.87 3.1.25c.547.043.657.365.236.725l-2.362 2.024.72 3.025c.13.535-.143.74-.616.45l-2.654-1.62z" fill="#FFF"></path>   </g></g></svg></a></span></div><div class="AuthorInfo-detail"><div class="AuthorInfo-badge"><div class="RichText AuthorInfo-badgeText">'+author_mood+'</div></div></div></div></div></div>';
        var answer_element='<div class="ContentItem AnswerItem" '+content_type_element+' data-comment-nums="'+comment_nums+'">'+question_element+'<div class="ContentItem-meta"></div><div class="RichContent is-collapsed RichContent--withMask"><div class="RichContent-content" '+data_content_url+'><div class="RichContent-cover RichContent-cover--mobile"><div class="RichContent-cover-inner" data-index-img-url="'+index_img_url+'"></div></div><div class="RichContent-inner RichContent-inner--collapsed" style="1max-height:400px"><span class="RichText CopyrightRichText-richText">'+removeImg(content)+'</span></div></div><div class="ContentItem-actions"><span><button class="Button-like-nouse Button Button--plain" type="button" '+like_element_attr+'>'+like_icon_svg+like_nums+'</button></span><button class="Button ContentItem-action Button--plain Button--withIcon Button--withLabel" type="button"><span style="display: inline-flex; align-items: center;">&#8203;'+comment_icon_svg+'</span>'+comment_nums+' 条评论</button>'+share_button+'</div></div>';
        var appendElement='<div class="Card TopstoryItem TopstoryItem--experimentExpand ScrollIntoMark"><div class="Feed"><div class="FeedSource">'+topic_element+author_info_element+answer_element+'</div></div></div>';
                           
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

        var data='<div class="List-item"><div class="ContentItem"><div class="ContentItem-main"><div class="ContentItem-image"><span class="UserLink UserItem-avatar"><a class="UserLink-link" target="_blank" href="/er/'+adept_id+'"><img class="Avatar Avatar--large UserLink-avatar PeoplePopover" width="60" height="60" src="'+adept_avatar+'" srcset="'+adept_avatar+'" alt="'+adept_name+'" data-author-id="'+adept_id+'" data-toggle="popover" data-placement="bottom" data-trigger="manual" data-content="null" data-html="true"></a></span></div><div class="ContentItem-head"><h2 class="ContentItem-title"><div class="UserItem-title"><span class="UserLink UserItem-name"><a class="UserLink-link" target="_blank" href="/er/'+adept_id+'"><span class="RichText">'+adept_name+'</span></a></span></div></h2><div class="ContentItem-meta"><div><div class="ContentItem-status"><div class="ContentItem-statusItem">'+adept_mood+'</div></div></div></div></div><div class="ContentItem-extra"><button class="Button Button--green Invite" type="button" data-receiver="'+adept_id+'">邀请回答</button></div></div></div></div>';
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
    var data='<div class="List-item NextPage" data-next-page-type="questions"><div class="ContentItem"><div class="ContentItem-main"><div class="1ContentItem-head"><h2 class="1ContentItem-title">关注的问题</h2></div><div class="ContentItem-extra">'+g_followquestion_nums+'</div></div></div></div><div class="List-item NextPage" data-next-page-type="topics"><div class="ContentItem"><div class="ContentItem-main"><div class="1ContentItem-head"><h2 class="1ContentItem-title">关注的栏目</h2></div><div class="ContentItem-extra">'+g_followtopic_nums+'</div></div></div></div>';
    $("#appendArea").append(data);
    checkNextPage();
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
                        button.removeClass("Button--grey").addClass("Button--green").text(follow_tips);
                        button.attr("data-followed","false");
                    }
                    else
                    {
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

function checkQuestionDetailCollapse(){
    $(".QuestionHeader-detail-less").off("click");
    $(".QuestionHeader-detail-less").each(function(){
        $(this).click(function(){
            $(this).addClass("is-hide");
            $(this).parents(".RichContent").find(".QuestionHeader-detail-more").removeClass("is-hide");
            $(this).parents(".RichContent").addClass("is-collapsed");
            $(this).parents(".RichContent").find(".RichContent-inner").css("max-height","200px");
            
            if($(this).parents(".ScrollIntoMark").length>0)
            {
                var id=$(this).parents(".ScrollIntoMark").attr("id");
                document.getElementById(id).scrollIntoView();
                $(this).parents(".ScrollIntoMark").removeAttr("id");
            }
        });
    });
}

function checkQuestionDetailExpand(){
    $(".QuestionHeader-detail-expand").off("click");
    $(".QuestionHeader-detail-expand").each(function(){
        console.log($(this).height());
        if($(this).height()>=200)
        {
            $(this).find(".QuestionHeader-detail-more").removeClass("is-hide");
            $(this).parents(".RichContent").addClass("is-collapsed");
        }
        else
        {
            $(this).find(".QuestionHeader-detail-more").addClass("is-hide");
            $(this).parents(".RichContent").find(".QuestionHeader-detail-less").addClass("is-hide");
        }
        if($(this).parents(".ScrollIntoMark").length>0)
        {
            var randomId=""+Math.random();
            $(this).parents(".ScrollIntoMark").attr("id",randomId);
        }
        $(this).click(function(){
            $(this).children(".QuestionHeader-detail-more").addClass("is-hide");
            $(this).parents(".RichContent").find(".QuestionHeader-detail-less").removeClass("is-hide");
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
                $("#appendArea").empty();
                g_last_getmoredata_index=0;
                getMoreData();
            }
            else
            {
                $(".Icon.Icon--search").css({"fill":"#afbdcf"});
            }
        }
    });
    
        
    $("#searchInput").off("blur");
    $("#searchInput").on("blur",function(){
        input_lock="false";
    });
        
    $("#searchInput").off("compositionstart");
    $("#searchInput").on("compositionstart",function(e){
        input_lock="true";
    });
    
    $("#searchInput").off("compositionend");
    $("#searchInput").on("compositionend",function(e){
        input_lock="false";
    });  
    
    $(".Tabs-link").off("click");
    $(".Tabs-link").on("click",function(){
        $(".Tabs-link").removeClass("is-active");
        $(this).addClass("is-active");
        g_search_type=$(this).attr("data-search-type");
        $("#appendArea").empty();
        g_last_getmoredata_index=0;
        getMoreData();
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
            var data='<div><div class="MobileAppHeader-expandContainer"><span><div class="MobileAppHeader-expand"><a href="/topic"><svg class="Zi Zi--Home" fill="#8590a6" viewBox="0 0 24 24" width="24" height="24"><path d="M3 3.99C3 2.892 3.893 2 4.995 2h14.01C20.107 2 21 2.898 21 3.99v16.02c0 1.099-.893 1.99-1.995 1.99H4.995A1.997 1.997 0 0 1 3 20.01V3.99zM6 7c0 .556.449 1 1.002 1h9.996a.999.999 0 1 0 0-2H7.002C6.456 6 6 6.448 6 7zm0 5c0 .556.449 1 1.002 1h9.996a.999.999 0 1 0 0-2H7.002C6.456 11 6 11.448 6 12zm0 5c0 .556.446 1 .997 1h6.006c.544 0 .997-.448.997-1 0-.556-.446-1-.997-1H6.997C6.453 16 6 16.448 6 17z"></path></svg>栏目</a><a href="/search/"><svg class="Zi Zi--Search" fill="#8590a6" viewBox="0 0 24 24" width="24" height="24"><path d="M17.068 15.58a8.377 8.377 0 0 0 1.774-5.159 8.421 8.421 0 1 0-8.42 8.421 8.38 8.38 0 0 0 5.158-1.774l3.879 3.88c.957.573 2.131-.464 1.488-1.49l-3.879-3.878zm-6.647 1.157a6.323 6.323 0 0 1-6.316-6.316 6.323 6.323 0 0 1 6.316-6.316 6.323 6.323 0 0 1 6.316 6.316 6.323 6.323 0 0 1-6.316 6.316z" fill-rule="evenodd"></path></svg>搜索&nbsp;<span style="color:#cbcbcb">|</span>&nbsp;提问</a><a href="/notifications"><svg viewBox="0 0 24 24" class="Zi Zi--Setting" width="24" height="26" fill="#8590a6" style="height: 26px; width: 24px;"><title></title><g><path d="M18.868 15.185c-.164.096-.315.137-.452.137-.123 0-1.397-.26-1.617-.233-1.355.013-1.782 1.275-1.836 1.74-.055.454 0 .893.19 1.304.138.29.125.577-.067.85-.863.893-2.165 1.016-2.357 1.016-.123 0-.247-.055-.356-.15-.11-.097-.685-1.14-1.07-1.47-1.303-.954-2.246-.328-2.63 0-.397.33-.67.7-.835 1.126-.07.18-.18.302-.33.37-1.354.426-2.918-.92-3.014-1.056-.082-.11-.123-.22-.123-.356-.014-.138.383-1.276.342-1.688-.342-1.9-1.836-1.687-2.096-1.673-.303.014-.604.068-.92.178-.205.056-.396.03-.588-.054-.888-.462-1.137-2.332-1.11-2.51.055-.315.192-.52.438-.604.425-.164.81-.452 1.15-.85.932-1.262.344-2.25 0-2.634-.34-.356-.725-.645-1.15-.81-.137-.04-.233-.15-.328-.315C-.27 6.07.724 4.95.978 4.733c.255-.22.6-.055.723 0 .426.164.878.22 1.344.15C4.7 4.636 4.784 3.14 4.81 2.908c.015-.247-.11-1.29-.136-1.4-.027-.123-.014-.22.027-.315C5.318.178 7.073 0 7.223 0c.178 0 .33.055.44.178.108.124.63 1.11 1 1.4.398.338 1.582.83 2.588.013.398-.273.96-1.288 1.083-1.412.123-.123.26-.178.384-.178 1.56 0 2.33 1.03 2.438 1.22.083.124.096.248.07.37-.03.152-.33 1.153-.262 1.606.366 1.537 1.384 1.742 1.89 1.783.494.027 1.645-.357 1.81-.344.164.014.315.083.424.206.535.31.85 1.715.905 2.14.027.233-.014.44-.11.562-.11.138-1.165.714-1.48 1.112-.855.982-.342 2.25-.068 2.606.26.37 1.22.905 1.288.96.15.137.26.302.315.494.146 1.413-.89 2.387-1.07 2.47zm-8.905-.535c.644 0 1.246-.123 1.822-.356.575-.248 1.082-.59 1.493-1.016.425-.425.754-.92 1-1.495.247-.562.357-1.18.357-1.81 0-.66-.11-1.262-.356-1.825-.248-.562-.577-1.056-1.002-1.48-.41-.427-.918-.756-1.493-1.003-.576-.233-1.178-.357-1.822-.357-.644 0-1.247.124-1.81.357-.56.247-1.067.576-1.478 1.002-.425.425-.768.92-1 1.48-.247.564-.37 1.167-.37 1.826 0 .644.123 1.248.37 1.81.232.563.575 1.07 1 1.495.424.426.917.768 1.48 1.016.56.233 1.164.356 1.808.356z"></path></g></svg>通知&nbsp;<span style="color:#cbcbcb">|</span>&nbsp;私信&nbsp;<span style="color:#cbcbcb">|</span>&nbsp;设置</a><a href="/er/'+g_user_id+'"><svg class="Zi Zi--Profile" fill="#8590a6" viewBox="0 0 24 24" width="24" height="24"><path d="M15.417 12.923c-.376.653-.837 1.281-.763 1.863.292 2.273 5.562 1.77 6.78 3.048.566.595.566.664.566 4.164-6.611-.07-13.363 0-20 0 .027-3.5 0-3.478.62-4.164 1.303-1.44 6.581-.715 6.78-3.133.045-.545-.38-1.114-.763-1.778C6.511 9.233 5.697 2 12 2s5.422 7.443 3.417 10.923z" fill-rule="evenodd"></path></svg>我的主页</a><a href="/exit/"><svg class="Zi Zi--Logout" fill="#8590a6" viewBox="0 0 24 24" width="24" height="24"><path d="M2 11.999c0-2.756 1.154-5.417 3.167-7.3a1.266 1.266 0 0 1 1.73 1.847 7.396 7.396 0 0 0-2.367 5.453c0 4.119 3.35 7.47 7.47 7.47 4.119 0 7.47-3.351 7.47-7.47a7.41 7.41 0 0 0-2.279-5.37 1.266 1.266 0 0 1 1.76-1.819A9.923 9.923 0 0 1 22 12c0 5.513-4.486 10-10 10s-10-4.487-10-10zm8.699-.482V3.26a1.26 1.26 0 1 1 2.52 0v8.257a1.26 1.26 0 1 1-2.52 0z" fill-rule="evenodd"></path></svg>退出帐号</a><div class="MobileAppHeader-expandBackdrop"></div></div></span></div></div>';
            $("body").addClass("MobileAppHeader-noScrollBody").append(data);
            
        }
        else if($('.MobileAppHeader-expandBtn').children('svg').hasClass('Zi--Close'))
        {
            var svg='<svg class="Zi Zi--More" fill="currentColor" viewBox="0 0 24 24" width="24" height="24"><path d="M3.5 5h16a1.5 1.5 0 0 1 0 3h-16a1.5 1.5 0 0 1 0-3zm0 6h16a1.5 1.5 0 0 1 0 3h-16a1.5 1.5 0 0 1 0-3zm0 6h16a1.5 1.5 0 0 1 0 3h-16a1.5 1.5 0 0 1 0-3z" fill-rule="evenodd"></path></svg>';
            $('.MobileAppHeader-expandBtn').empty().append(svg);
            $("body").removeClass("MobileAppHeader-noScrollBody");
            $(".MobileAppHeader-expandContainer").parent().remove();
            
        }
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
            $(".SignFlowHeader-title").text("注册"+SITE);
            $(".SignFlowHeader-subTitle").text(SITE_SLOGAN);
            $("#register").removeClass("is-hide");
            $("#login").addClass("is-hide");
        }
        else
        {
            $(this).text("注册");
            $("#registerLoginText").text("没有帐号？");
            swith_element.attr("data-action","login");
            $(".SignFlowHeader-title").text("登录"+SITE);
            $(".SignFlowHeader-subTitle").text(SITE_SLOGAN);
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
        g_command="following";
        g_subcmd=$(this).attr("data-next-page-type");
        g_cache_page=$("main").html();
        var head='<div class="Card Profile-datalist" id="Profile-datalist"><div id="appendArea" class=""><div class="ProfileHeader-expandActions ProfileEdit-expandActions"><button class="Button--green ReturnHomePage" style="margin:3px" type="button">返回我的主页</button></div></div></div>';
        $("main").empty().append(head);
        getMoreData();
        checkReturnHomePage();
    });
}

function checkAvatar()
{
    $(".Profile-avatar.Modify-avatar,.MaskAvatar-content").click(function(){
        $("#id_avatar_input").click();
        $("#id_avatar_input").on("change",function(){
            var file = $('#id_avatar_input')[0].files[0];
            scaleAndUploadImage("forAvatar",file,200);
        });
    });
}
function checkHomePage()
{
    $(".ProfileEditButton,.Profile-infosOia").click(function(){
        console.log(this);
        g_cache_page=$("main").html();
        if($(this).hasClass("Profile-infosOia"))
        {
            var data='<div class="Card"><div class="ProfileHeader-expandActions ProfileEdit-expandActions"><button class="1Button 1Button--primary Button--green ReturnHomePage" style="margin:3px" type="button">返回我的主页</button></div><div class="Profile-intro"><img id="id_avatar" class="Profile-avatar Modify-avatar" src="'+g_er_avatar+'"alt=""></div><div class="Profile-data"><div class="Profile-datalist"><div class="Field List-item"><h6>昵称</h6><div class="Field-content"><div><span class="Field-text"><span class="RichText">'+g_er_name+'</span></span></div></div></div><div class="Field List-item"><h6>性别</h6><div class="Field-content"><div><span class="Field-text">'+g_er_sexual_han+'</span></div></div></div><div class="Field List-item"><h6>一句话介绍</h6><div class="Field-content"><div><span class="Field-text"><span class="RichText">'+g_er_mood+'</span></span></div></div></div><div class="Field List-item"><h6>居住地</h6><div class="Field-content"><div><span class="Field-text"><span class="RichText">'+g_er_residence+'</span></span></div></div></div><div class="Field List-item"><h6>所在行业</h6><div class="Field-content"><div><span class="Field-text">'+g_er_job+'</span></div></div></div><div class="Field List-item"><h6>个人简介</h6><div class="Field-content"><div class="DescriptionField-content"><span class="Field-text"><span class="RichText">'+g_er_intro+'</span></span></div></div></div></div></div></div>';
            $("main").empty().append(data);
            checkReturnHomePage();
        }
        else
        {
            var data='<div class="Card"><div class="ProfileHeader-expandActions ProfileEdit-expandActions"><button class="1Button 1Button--primary Button--green ReturnHomePage" style="margin:3px" type="button">返回我的主页</button></div><div class="Profile-intro"><img id="id_avatar" class="Profile-avatar Modify-avatar" src="'+g_er_avatar+'"alt=""><input id="id_avatar_input" name="file" type="file" accept="image/*" 1capture="camera" 1multiple="multiple" style="display: none;"/><div class="MaskAvatar"><div class="MaskAvatar-black"></div><div class="MaskAvatar-content"><svg class="Zi Zi--Camera MaskAvatar-cameraIcon" fill="currentColor" viewBox="0 0 24 24" width="36" height="36"><path d="M20.094 6S22 6 22 8v10.017S22 20 19 20H4.036S2 20 2 18V7.967S2 6 4 6h3s1-2 2-2h6c1 0 2 2 2 2h3.094zM12 16a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7zm0 1.5a5 5 0 1 0-.001-10.001A5 5 0 0 0 12 17.5zm7.5-8a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" fill-rule="evenodd"></path></svg><div class="UserAvatarEditor-maskInnerText">点击修改头像</div></div></div></div><div class="Profile-data"><div class="Profile-datalist"><div class="Field List-item"><h6>昵称</h6><div class="Field-content" data-field-type="nickname"><div><span class="Field-text"><span class="RichText">'+g_er_name+'</span></span><button class="Button ModifyButton Button--link" type="button">'+modify_icon_svg+'修改</button></div></div></div><div class="Field List-item"><h6>性别</h6><div class="Field-content" data-field-type="sexual"><div><span class="Field-text">'+g_er_sexual_han+'</span><button class="Button ModifyButton Button--link" type="button">'+modify_icon_svg+'修改</button></div></div></div><div class="Field List-item"><h6>一句话介绍</h6><div class="Field-content" data-field-type="mood"><div><span class="Field-text"><span class="RichText">'+g_er_mood+'</span></span><button class="Button ModifyButton Button--link" type="button">'+modify_icon_svg+'修改</button></div></div></div><div class="Field List-item"><h6>居住地</h6><div class="Field-content" data-field-type="residence"><div><span class="Field-text"><span class="RichText">'+g_er_residence+'</span></span><button class="Button ModifyButton Button--link" type="button">'+modify_icon_svg+'修改</button></div></div></div><div class="Field List-item"><h6>所在行业</h6><div class="Field-content" data-field-type="job"><div><span class="Field-text">'+g_er_job+'</span><button class="Button ModifyButton Button--link" type="button">'+modify_icon_svg+'修改</button></div></div></div><div class="Field List-item"><h6>个人简介</h6><div class="Field-content" data-field-type="intro"><div class="DescriptionField-content"><span class="Field-text"><span class="RichText">'+g_er_intro+'</span></span><button class="Button ModifyButton Button--link" type="button">'+modify_icon_svg+'修改</button></div></div></div></div></div></div>';
            
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
                
                var packup_button_element='<span><button class="Comments-Packup-Button" style="left:unset;right: 3px;z-index:999;"">收起评论<svg viewBox="0 0 10 6" class="Icon Icon--arrow" width="10" height="16" aria-hidden="true" style="height: 16px; width: 10px;"><title></title><g><path d="M8.716.217L5.002 4 1.285.218C.99-.072.514-.072.22.218c-.294.29-.294.76 0 1.052l4.25 4.512c.292.29.77.29 1.063 0L9.78 1.27c.293-.29.293-.76 0-1.052-.295-.29-.77-.29-1.063 0z"></path></g></svg></button></span>';
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
            $(".QuestionAsk .QuestionAsk-buttonGroup>button").removeAttr("disabled");
        }
        else
        {
            $(".QuestionAsk .QuestionAsk-buttonGroup>button").attr("disabled","");
        }
    }
    function checkAskTitle()
    {
        $(".QuestionAsk .QuestionAsk-title textarea").on("input",function(){
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
    $(".QuestionAsk .QuestionAsk-buttonGroup>button").click(function(){
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
    //checkPopoverShow();
    checkInteractionButton();
    checkExpandBtn();
    checkAnswerQuestion();
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
            var order=1;//pub_date
            var start=nums;
            var end=start+STEP*2;
            var bIsGetAll=0;
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
            console.log($("main").find(".ReturnHomePage").length);
            if($("main").find(".ReturnHomePage").length<=0)
                return;
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

function checkAndroidOrIos()
{
  var u = navigator.userAgent;
  var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android
  var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios
  if (isiOS)
      $(".MobileAppHeader-downloadLink").attr("href","");
  else
      $(".MobileAppHeader-downloadLink").attr("href","http://3rd.danongling.com/danongling-arm.apk");
}

function checkIsWeChat()
{
  var u = navigator.userAgent;
  var isWechat = u.indexOf('MicroMessenger') > -1;//wechat
  if (isWechat)
  {
        var winHeight = typeof window.innerHeight != 'undefined' ? window.innerHeight : document.documentElement.clientHeight;  //网页可视区高度
        var weixinTip = $('<div id="weixinTip"><p><img src="static/common/img/tip_download.png" alt="微信打开"/></p></div>');

        $("body").append(weixinTip);

        $("#weixinTip").css({
            "position": "fixed",
            "left": "0",
            "top": "0",
            "height": winHeight,
            "width": "100%",
            "z-index": "1000",
            "background-color": "rgba(0,0,0,0.8)",
            "filter": "alpha(opacity=80)",
        }).addClass("is-hide");
        $("#weixinTip p").css({
            "text-align": "center",
            "margin-top": "10%",
            "padding-left": "5%",
            "padding-right": "5%"
        });
        $("#weixinTip p img").css({
            "max-width": "100%",
            "height": "auto"
        });
        $(".MobileAppHeader-downloadLink").attr("href","javascript:;");
        $(".MobileAppHeader-downloadLink").click(function(){
            $("#weixinTip").removeClass("is-hide");
            return false;
        });
  }
}




function initElement()
{
    if("false"==g_init_data_done)
        return;
    
    setTimeout(function(){
    if(typeof(g_is_app) == "undefined" ? true : false)
        $(".Mobile-header").removeClass("is-hide");
    },100);
    if("true"==g_logged)
    { 
        appendLetterModal();
    }
    $('head title').text(SITE+" - "+SITE_SLOGAN);
    checkAndroidOrIos();  
    checkIsWeChat();
    if("question"==g_module)
    {
        
        $('head title').text(g_question_title+" - "+SITE);
        $(".QuestionHeader-title").empty().append('<a href="/question/'+g_question_id+'">'+g_question_title+'</a>');
        if($.inArray(""+g_question_id,g_user_follow_questions_list)>=0)
        {
            $(".FollowButton").removeClass("Button--green is-hide").addClass("Button--grey").attr("data-question-id",g_question_id).attr("data-followed","true").text("已关注");
        }
        else
        {
            $(".FollowButton").removeClass("Button--grey is-hide").addClass("Button--green").attr("data-question-id",g_question_id).attr("data-followed","false").text("关注问题");
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
        checkQuestionDetailExpand();
        checkQuestionDetailCollapse();
        
    }
    else if("topic"==g_module)
    {
        $('head title').text(g_topic_name+" - "+SITE);
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
        $(".TopicCard-title").append(g_topic_name);
        $(".TopicCard-description").html(g_topic_detail);
        $(".NumberBoard-value").append(g_topic_follower_nums);
        if($.inArray(""+g_topic_id,g_user_follow_topics_list)>=0)
            $(".FollowButton.TopicCard-followButton").removeClass("Button--green").addClass("Button--grey").attr("data-topic-id",g_topic_id).attr("data-followed","true").text("已关注");
        else
            $(".FollowButton.TopicCard-followButton").removeClass("Button--grey").addClass("Button--green").attr("data-topic-id",g_topic_id).attr("data-followed","false").text("关注栏目");   
    }
    else if("mytopic"==g_module)
    {
        $('head title').text("我关注的栏目"+" - "+SITE);
        if("true"==g_logged)
            $("#myfollow").attr("href","/er/"+g_user_id+"/following/topics/");
    }
    else if("search"==g_module)
    {
        $('head title').text("搜索"+" - "+SITE);
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
        $('head title').text("设置"+" - "+SITE);
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
            var data='<div class="List-item Conversation-messages-head"><div class="zg-section"><a href="/conversations">« 返回</a></div><div class="zg-section zg-14px"><span class="zg-gray-normal">发私信给 </span><span class="zg-gray-darker">'+g_parter_name+'</span>：</div><div class="zg-section LetterSend" id="zh-pm-editor-form"><div class="zg-editor-simple-wrap zg-form-text-input"><div class="zg-user-name" style="display:none"></div><textarea id="letterText" class="zg-editor-input zu-seamless-input-origin-element" style="font-weight: normal; height: 22px;" data-receiver-id="4"></textarea></div><div class="zh-pm-warnmsg" style="display:none;text-align:right;color:#C3412F;"></div><div class="zm-command"><button class="Button Messages-sendButton Button--primary Button--green" type="button" onclick="sendLetter()">发送</button></div></div></div>';
            $('#appendArea').prepend(data);
        }
        checkSettingPage();
    }
    else if("sign"==g_module)
    {
        $('head title').text(SITE+" - "+SITE_SLOGAN);
        $(".SignFlowHeader-title").text("登录"+SITE);
        $(".SignFlowHeader-subTitle").text(SITE_SLOGAN);
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
            var data='<div class="" style="position:relative;padding:0 16px;margin:100px auto;"><div class="" style="font-size:20px;font-weight:600;font-synthesis:style;color:#1a1a1a;text-align:center;padding:10px auto;"><h1 id="errorText" style="margin:20px auto;color:red;"></h1><a id="returnLink" style="color:blue;" href="/signinup/?next=/"></a></div></div>';
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
        $('head title').text(g_er_name+"的主页"+" - "+SITE);
        $(".Profile-avatar").attr("src",g_er_avatar);
        $(".Profile-name").text(g_er_name);
        $(".Profile-headline").html(g_er_mood);
        $("#residence").html(g_er_residence);
        $("#job").html(g_er_job);
        $("#followers").text(g_follower_nums);
        $("#followtos").text(g_followto_nums);
        if("f"==g_er_sexual)
        {
            var who="she";
            var who_han="她";
            g_er_sexual_han="女";
        }
        else
        {
            var who="he";
            var who_han="他";
            g_er_sexual_han="男";
        }
        if(("true"==g_logged)&&(g_er_id==g_user_id))
        {
            var who="me";
            var who_han="我";
            $(".ProfileEditButton").removeClass("is-hide");
            $(".ProfileLetterButton").addClass("is-hide");
            $(".ProfileFollowButton").addClass("is-hide");
        }
        else
        {
            $(".ProfileEditButton").addClass("is-hide");
            $(".ProfileLetterButton").removeClass("is-hide");
            if($.inArray(""+g_er_id,g_user_follow_peoples_list)>=0)
                $(".ProfileFollowButton").removeClass("is-hide Button--green").addClass("Button--grey").text("已关注").attr("data-followed","true").attr("data-er-id",g_er_id).attr("data-who",who);
            else
                $(".ProfileFollowButton").removeClass("is-hide Button--grey").addClass("Button--green").text("关注"+who_han).attr("data-followed","false").attr("data-er-id",g_er_id).attr("data-who",who);
        }
        $(".who").text(who_han);
           
        var answers_active="";
        var asks_active="";
        var posts_active="";
        var following_active="";	
        if ("answers"==g_command)
        {
            answers_active="is-active";
            //appendAnswerElement();
        }
        else if("asks"==g_command)
        {
            asks_active="is-active";
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
        
        var ul_list='<li role="tab" class="Tabs-item Tabs-item--noMeta" aria-controls="Profile-activities"><a class="Tabs-link '+answers_active+'" href="/er/'+g_er_id+'/answers/">回答</a></li><li role="tab" class="Tabs-item Tabs-item--noMeta" aria-controls="Profile-answers"><a class="Tabs-link '+asks_active+'" href="/er/'+g_er_id+'/asks/">提问</a></li><li role="tab" class="Tabs-item Tabs-item--noMeta" aria-controls="Profile-articals"><a class="Tabs-link '+posts_active+'" href="/er/'+g_er_id+'/posts/">文章</a></li><li role="tab" class="Tabs-item Tabs-item--noMeta" aria-controls="Profile-questions"><a class="Tabs-link '+following_active+'" href="/er/'+g_er_id+'/following/">关注</a></li>'
        $(".Tabs.ProfileBar").append(ul_list);
        
        setLetterReceiver(g_er_id,g_er_name);
        checkNextPage();
        checkHomePage();
    }
    else if("answer_page"==g_module)
    {
        $('head title').text("回答"+" - "+SITE);
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
        $('head title').text(g_article_title+" - "+SITE);
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
        
        $(".Post-Author .AuthorInfo-avatarWrapper .UserLink-link").attr("href","/er/"+g_article_author_id).attr("data-author-id",g_article_author_id).children("img").attr("alt",g_article_author_name).attr("src",g_article_author_avatar);
        $(".Post-Author .AuthorInfo-name .UserLink-link").attr("href","/er/"+g_article_author_id).empty().text(g_article_author_name);
        $(".Post-Author .AuthorInfo-detail .AuthorInfo-badgeText").html(g_article_author_mood);
        
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
        $('head title').text("写文章"+" - "+SITE);
        $('#summernote_write').summernote({
            toolbar: [
            // [groupName, [list of button]]
            ['style', ['bold', 'italic', 'underline']],
            ['para', ['paragraph']],
            ['table', ['table']],
            ['link', ['link']],
            ['picture', ['picture']],
            ['video', ['video']]
            ],
            height:null,
            minHeight:200,
            lang:'zh-CN',
            placeholder:'请输入文章内容(至少100字)',
            disableDragAndDrop:true,
            callbacks: {
                onImageUpload: function(files){
                    scaleAndUploadImage("forWrite",files[0],720);
                },
                onInit:function(){              
                    $("#summernote_write + .note-editor .note-btn-group.btn-group.note-picture").empty().html('<input id="summernote_write_picture" name="file" type="file" accept="image/*" style="display: none;"/><div class="note-btn btn btn-default btn-sm"><i class="note-icon-picture"></i></div>');
                    $("#summernote_write + .note-editor .note-btn-group.btn-group.note-picture .note-btn").click(function(){
                        $("#summernote_write_picture").click();
                    });
                    $("#summernote_write_picture").on("change",function(){
                        var file = $('#summernote_write_picture')[0].files[0];
                        scaleAndUploadImage("forWrite",file,720);
                    });
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
        g_question_detail=$("main").attr("data-question-detail");
                
        g_question_id=main_data.question_id;
        g_question_title=main_data.question_title;
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
        
        //g_show_detailed="false";
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
    $('#summernote_question').summernote({
        toolbar: [
        // [groupName, [list of button]]
        ['style', ['bold', 'italic', 'underline']],
        ['table', ['table']],
        ['link', ['link']],
        ['picture', ['picture']],
        ['video', ['video']]
        ],
        minHeight:100,
        lang:'zh-CN',
        placeholder:'问题背景、条件等详细信息',
        callbacks: {
            onImageUpload: function(files){
                scaleAndUploadImage("forQuestion",files[0],720);
            },
            onInit:function(){
                $(".note-statusbar").addClass("is-hide");
                
                $("#summernote_question + .note-editor .note-btn-group.btn-group.note-picture").empty().html('<input id="summernote_question_picture" name="file" type="file" accept="image/*" style="display: none;"/><div class="note-btn btn btn-default btn-sm"><i class="note-icon-picture"></i></div>');
                $("#summernote_question + .note-editor .note-btn-group.btn-group.note-picture .note-btn").click(function(){
                    $("#summernote_question_picture").click();
                });
                $("#summernote_question_picture").on("change",function(){
                    var file = $('#summernote_question_picture')[0].files[0];
                    scaleAndUploadImage("forQuestion",file,720);
                });
            }
        }
    });
    
    $('#summernote_answer').summernote({
    toolbar: [
        // [groupName, [list of button]]
        ['style', ['bold', 'italic', 'underline']],
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
                
                $("#summernote_answer + .note-editor .note-btn-group.btn-group.note-picture").empty().html('<input id="summernote_answer_picture" name="file" type="file" accept="image/*" style="display: none;"/><div class="note-btn btn btn-default btn-sm"><i class="note-icon-picture"></i></div>');
                $("#summernote_answer + .note-editor .note-btn-group.btn-group.note-picture .note-btn").click(function(){
                    $("#summernote_answer_picture").click();
                });
                $("#summernote_answer_picture").on("change",function(){
                    var file = $('#summernote_answer_picture')[0].files[0];
                    scaleAndUploadImage("forAnswer",file,720);
                });
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

$(document).ready(function(){
    console.log("init");
    //g_is_app="true";
    initCommon();
    init();
});
$(document).click(function(e) {
    $("#NotificationPopover").popover("hide");
    $("#MessagePopover").popover("hide");
    $("#MenuPopover").popover("hide");
    $("#SearchPopover").popover("hide");
});
window.onscroll = function () { 
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
SITE_SLOGAN="关注新农业,新农村,新农民";
//g_is_app="false";
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