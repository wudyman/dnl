function setCookie(name,value,secs)
{
    var exp = new Date();
    exp.setTime(exp.getTime() + secs*1000);
    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
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
        document.cookie= name + "="+cval+";expires="+exp.toGMTString();
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
                $("#summernote_question").summernote('insertImage', url, 'image name'); // the insertImage API
                else if("forAnswer"==type)
                    $("#summernote_answer").summernote('insertImage', url, 'image name'); // the insertImage API
                else if("forAvatar"==type)
                    $("#id_avatar").attr("src",url).attr("srcset",url);  
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

function appendAnswerElementList(ret,type,diretion="append")
{
    for(i in ret)
    {
        if(("all"==type)||("more"==type))
        {
            var answer_id=ret[i][0];
            var answer_content=ret[i][1]+"<p>&nbsp;</p><p>&nbsp;</p>";
            var answer_like_nums=ret[i][2];
            var answer_comment_nums=ret[i][3];
            var answer_pub_date=ret[i][4];
            var author_id=ret[i][5];
            var author_name=ret[i][6];
            var author_avatar=ret[i][7];
            var author_mood=ret[i][8];
            if("all"==type)
            {
                var richContent_class="RichContent--unescapable";
                var RichContent_inner_attr="";
                var expand_btn_class="Button ContentItem-more ContentItem-rightButton Button--plain is-hide";
                var collapse_btn_class="Button ContentItem-less ContentItem-rightButton Button--plain";
            }
            else if("more"==type)
            {
                console.log("more lsit");
                var richContent_class="RichContent--unescapable is-collapsed";
                var RichContent_inner_attr='style="max-height:400px"';
                var expand_btn_class="Button ContentItem-more ContentItem-rightButton Button--plain";
                var collapse_btn_class="Button ContentItem-less ContentItem-rightButton Button--plain is-hide";
            }
            var question_title_element="";                
            var rich_content='<div class="RichContent '+richContent_class+'">\
                                <div class="RichContent-expand">\
                                <div class="RichContent-inner" '+RichContent_inner_attr+'><span class="RichText CopyrightRichText-richText">'+addClassImg(answer_content,'class="origin_image"')+'</span></div>\
                                <button class="'+expand_btn_class+'" type="button">展开阅读全文<svg viewBox="0 0 10 6" class="Icon ContentItem-arrowIcon Icon--arrow" width="10" height="16" aria-hidden="true" style="height: 16px; width: 10px;"><title></title><g><path d="M8.716.217L5.002 4 1.285.218C.99-.072.514-.072.22.218c-.294.29-.294.76 0 1.052l4.25 4.512c.292.29.77.29 1.063 0L9.78 1.27c.293-.29.293-.76 0-1.052-.295-.29-.77-.29-1.063 0z"></path></g></svg></button>\
                                </div>\
                                <div class="ContentItem-actions">\
                                    <span><button class="AnswerLike Button LikeButton ContentItem-action" type="button" data-answer-id="'+answer_id+'"><svg viewBox="0 0 20 18" xmlns="http://www.w3.org/2000/svg" class="Icon 1Icon--like" style="height:16px;width:13px;" width="13" height="16" aria-hidden="true" data-reactid="433"><title data-reactid="434"></title><g data-reactid="435"><path d="M.718 7.024c-.718 0-.718.63-.718.63l.996 9.693c0 .703.718.65.718.65h1.45c.916 0 .847-.65.847-.65V7.793c-.09-.88-.853-.79-.846-.79l-2.446.02zm11.727-.05S13.2 5.396 13.6 2.89C13.765.03 11.55-.6 10.565.53c-1.014 1.232 0 2.056-4.45 5.83C5.336 6.965 5 8.01 5 8.997v6.998c-.016 1.104.49 2 1.99 2h7.586c2.097 0 2.86-1.416 2.86-1.416s2.178-5.402 2.346-5.91c1.047-3.516-1.95-3.704-1.95-3.704l-5.387.007z"></path></g></svg>'+answer_like_nums+'</button></span>\
                                    <button class="Button ContentItem-action Button--plain Button--withIcon Button--withLabel" type="button"><span style="display: inline-flex; align-items: center;">&#8203;<svg class="Zi Zi--Comment Button-zi" fill="currentColor" viewBox="0 0 24 24" width="1.2em" height="1.2em"><path d="M10.241 19.313a.97.97 0 0 0-.77.2 7.908 7.908 0 0 1-3.772 1.482.409.409 0 0 1-.38-.637 5.825 5.825 0 0 0 1.11-2.237.605.605 0 0 0-.227-.59A7.935 7.935 0 0 1 3 11.25C3 6.7 7.03 3 12 3s9 3.7 9 8.25-4.373 9.108-10.759 8.063z" fill-rule="evenodd"></path></svg></span>0 条评论</button>\
                                    <div class="Popover ShareMenu ContentItem-action"><div class="" aria-haspopup="true" aria-expanded="false"><img class="ShareMenu-fakeQRCode" src="" alt="微信二维码"><button class="Button Button--plain Button--withIcon Button--withLabel" type="button"><span style="display: inline-flex; align-items: center;">&#8203;<svg class="Zi Zi--Share Button-zi" fill="currentColor" viewBox="0 0 24 24" width="1.2em" height="1.2em"><path d="M2.931 7.89c-1.067.24-1.275 1.669-.318 2.207l5.277 2.908 8.168-4.776c.25-.127.477.198.273.39L9.05 14.66l.927 5.953c.18 1.084 1.593 1.376 2.182.456l9.644-15.242c.584-.892-.212-2.029-1.234-1.796L2.93 7.89z" fill-rule="evenodd"></path></svg></span>分享</button></div></div>\
                                    <button class="'+collapse_btn_class+'" type="button"><span class="RichContent-collapsedText">收起</span><svg viewBox="0 0 10 6" class="Icon ContentItem-arrowIcon is-active Icon--arrow" width="10" height="16" aria-hidden="true" style="height: 16px; width: 10px;"><title></title><g><path d="M8.716.217L5.002 4 1.285.218C.99-.072.514-.072.22.218c-.294.29-.294.76 0 1.052l4.25 4.512c.292.29.77.29 1.063 0L9.78 1.27c.293-.29.293-.76 0-1.052-.295-.29-.77-.29-1.063 0z"></path></g></svg></button>\
                                </div>\
                                </div>';
        }
        else if(("topic"==type)||("homepage"==type))
        {
            if("topic"==type)
            {
                var question_id=ret[i][0];
                var question_title=ret[i][1];
                var topic_id=ret[i][2];
                var topic_name=ret[i][3];
                var answer_id=ret[i][4];
                var author_id=ret[i][5];
                var author_name=ret[i][6];
                var author_avatar=ret[i][7];
                var author_mood=ret[i][8];
                var answer_content=ret[i][9];
                var answer_like_nums=ret[i][10];
            }
            else if("homepage"==type)
            {
                var author_id=g_er_id;
                var author_name=g_er_name;
                var author_avatar=g_er_avatar;
                var author_mood=g_er_mood;
                var answer_id=ret[i][0];
                var question_id=ret[i][1];
                var question_title=ret[i][2];
                var answer_content=ret[i][3];
                var answer_like_nums=ret[i][4];
            }
            var index_img_url=getIndexImg(answer_content);
            var question_title_element='<h2 class="ContentItem-title"><div><a target="_blank" href="/question/'+question_id+'/?ans='+answer_id+'">'+question_title+'</a></div></h2>';
            var rich_content='<div class="RichContent is-collapsed RichContent--withMask">\
                                <div class="RichContent-content" data-content-url="/question/'+question_id+'/?ans='+answer_id+'">\
                                <div class="RichContent-cover RichContent-cover--mobile"><div class="RichContent-cover-inner" data-index-img-url="'+index_img_url+'"></div></div>\
                                <div class="RichContent-inner RichContent-inner--collapsed">\
                                <span class="RichText CopyrightRichText-richText">'+removeImg(answer_content)+'</span>\
                                </div>\
                                </div>\
                                <div class="ContentItem-actions">\
                                <span>\
                                <button class="Button VoteButton VoteButton--up" aria-label="赞同" type="button"><svg viewBox="0 0 20 18" class="Icon VoteButton-upIcon Icon--triangle" width="9" height="16" aria-hidden="true" style="height: 16px; width: 9px;"><title></title><g><path d="M0 15.243c0-.326.088-.533.236-.896l7.98-13.204C8.57.57 9.086 0 10 0s1.43.57 1.784 1.143l7.98 13.204c.15.363.236.57.236.896 0 1.386-.875 1.9-1.955 1.9H1.955c-1.08 0-1.955-.517-1.955-1.9z"></path></g></svg>48</button>\
                                <button class="Button VoteButton VoteButton--down VoteButton--mobileDown" aria-label="反对" type="button"><svg viewBox="0 0 20 18" class="Icon VoteButton-downIcon Icon--triangle" width="9" height="16" aria-hidden="true" style="height: 16px; width: 9px;"><title></title><g><path d="M0 15.243c0-.326.088-.533.236-.896l7.98-13.204C8.57.57 9.086 0 10 0s1.43.57 1.784 1.143l7.98 13.204c.15.363.236.57.236.896 0 1.386-.875 1.9-1.955 1.9H1.955c-1.08 0-1.955-.517-1.955-1.9z"></path></g></svg></button>\
                                </span>\
                                <button class="Button ContentItem-action Button--plain Button--withIcon Button--withLabel" type="button"><span style="display: inline-flex; align-items: center;">&#8203;<svg class="Zi Zi--Comment Button-zi" fill="currentColor" viewBox="0 0 24 24" width="1.2em" height="1.2em"><path d="M10.241 19.313a.97.97 0 0 0-.77.2 7.908 7.908 0 0 1-3.772 1.482.409.409 0 0 1-.38-.637 5.825 5.825 0 0 0 1.11-2.237.605.605 0 0 0-.227-.59A7.935 7.935 0 0 1 3 11.25C3 6.7 7.03 3 12 3s9 3.7 9 8.25-4.373 9.108-10.759 8.063z" fill-rule="evenodd"></path></svg></span>评论 9</button>\
                                <button class="Button ContentItem-action Button--plain Button--withIcon Button--iconOnly" type="button"><span style="display: inline-flex; align-items: center;">&#8203;<svg class="Zi Zi--Star Button-zi" fill="currentColor" viewBox="0 0 24 24" width="1.2em" height="1.2em"><path d="M5.515 19.64l.918-5.355-3.89-3.792c-.926-.902-.639-1.784.64-1.97L8.56 7.74l2.404-4.871c.572-1.16 1.5-1.16 2.072 0L15.44 7.74l5.377.782c1.28.186 1.566 1.068.64 1.97l-3.89 3.793.918 5.354c.219 1.274-.532 1.82-1.676 1.218L12 18.33l-4.808 2.528c-1.145.602-1.896.056-1.677-1.218z" fill-rule="evenodd"></path></svg></span></button>\
                                </div>\
                                </div>';
        }
        
        
        var appendElement='<div class="ScrollIntoMark"><div class="List-item 1TopicFeedItem">\
                <div class="ContentItem AnswerItem">\
                '+question_title_element+'\
                <div class="ContentItem-meta">\
                <div class="AuthorInfo AnswerItem-authorInfo AuthorInfo--plain">\
                <span class="UserLink AuthorInfo-avatarWrapper"><a class="UserLink-link" target="_blank" href="/er/'+author_id+'/"><img class="Avatar AuthorInfo-avatar" width="24" height="24" src="'+author_avatar+'" srcset="'+author_avatar+'" alt="'+author_name+'"></a></span>\
                <div class="AuthorInfo-content">\
                <div class="AuthorInfo-head"><span class="UserLink AuthorInfo-name"><a class="UserLink-link" target="_blank" href="/er/'+author_id+'/">'+author_name+'</a></span></div>\
                <div class="AuthorInfo-detail"><div class="AuthorInfo-badge"><div class="RichText AuthorInfo-badgeText">'+author_mood+'</div></div></div>\
                </div>\
                </div>\
                </div>\
                '+rich_content+'\
                </div>\
                </div>\
                </div>';
        
        if("append"==diretion)
            $("#appendArea").append(appendElement);
        else
            $("#appendArea").prepend(appendElement);
    }
}
function appendAnswerElementCard(ret,type,diretion="append")
{
    for(i in ret)
    {
        var question_id=ret[i][0];
        var question_title=ret[i][1];
        var topic_id=ret[i][2];
        var topic_name=ret[i][3];
        var answer_id=ret[i][4];
        var author_id=ret[i][5];
        var author_name=ret[i][6];
        var author_avatar=ret[i][7];
        var author_mood=ret[i][8];
        var answer_content=ret[i][9];
        var answer_like_nums=ret[i][10];
        if("has_topic_question_title"==type)
        {   
            var topic_element='<div class="Feed-title"><div class="Feed-meta"><span class="Feed-meta-item">来自话题:<span><a href="/topic/'+topic_id+'/" class="TopicPopover" data-topic-id="'+topic_id+'" data-toggle="popover" data-placement="bottom" data-trigger="manual" data-content="null" data-html="true">'+topic_name+'</a></div></div>';
            var question_element='<h2 class="ContentItem-title"><a href="/question/'+question_id+'/?ans='+answer_id+'">'+question_title+'</a></h2>';
        }
        else if("has_question_title"==type)
        {
            var topic_element='';
            var question_element='<h2 class="ContentItem-title"><a href="/question/'+question_id+'/?ans='+answer_id+'">'+question_title+'</a></h2>';
        }
    
        for(var j=0;j<100;j++)
            answer_content=answer_content+"&nbsp;";
        var index_img_url=getIndexImg(answer_content);
        
        
        
        var appendElement='<div class="ScrollIntoMark"><div class="Card TopstoryItem TopstoryItem--experimentExpand">\
            <div class="Feed">\
            <div class="FeedSource">\
            <div class="FeedSource-firstline">来自话题: <span><a class="TopicLink" href="/topic/'+topic_id+'/" target="_blank">'+topic_name+'</a></span></div>\
            <div class="AuthorInfo FeedSource-byline AuthorInfo--plain">\
            <span class="UserLink AuthorInfo-avatarWrapper"><a class="UserLink-link" target="_blank" href="/er/'+author_id+'/"><img class="Avatar AuthorInfo-avatar" width="24" height="24" src="'+author_avatar+'" srcset="'+author_avatar+'" alt="'+author_name+'"></a></span>\
            <div class="AuthorInfo-content">\
            <div class="AuthorInfo-head">\
            <span class="UserLink AuthorInfo-name">\
            <a class="UserLink-link" target="_blank" href="/er/'+author_id+'/">'+author_name+'</a>\
            <a class="UserLink-badge" 111data-tooltip="优秀回答者" href="/er/'+author_id+'/" target="_blank"><svg viewBox="0 0 20 20" class="Icon Icon--badgeGlorious" width="16" height="16" aria-hidden="true" style="height: 16px; width: 16px;"><title>用户标识</title><g><g fill="none" fill-rule="evenodd">     <path d="M.64 11.39c1.068.895 1.808 2.733 1.66 4.113l.022-.196c-.147 1.384.856 2.4 2.24 2.278l-.198.016c1.387-.12 3.21.656 4.083 1.735l-.125-.154c.876 1.085 2.304 1.093 3.195.028l-.127.152c.895-1.068 2.733-1.808 4.113-1.66l-.198-.022c1.386.147 2.402-.856 2.28-2.238l.016.197c-.12-1.388.656-3.212 1.735-4.084l-.154.125c1.084-.876 1.093-2.304.028-3.195l.152.127c-1.068-.895-1.808-2.732-1.66-4.113l-.022.198c.147-1.386-.856-2.4-2.24-2.28l.198-.016c-1.387.122-3.21-.655-4.083-1.734l.125.153C10.802-.265 9.374-.274 8.483.79L8.61.64c-.895 1.068-2.733 1.808-4.113 1.662l.198.02c-1.386-.147-2.4.857-2.28 2.24L2.4 4.363c.12 1.387-.656 3.21-1.735 4.084l.154-.126C-.265 9.2-.274 10.626.79 11.517L.64 11.39z" fill="#FF9500"></path>     <path d="M10.034 12.96L7.38 14.58c-.47.286-.747.09-.618-.45l.72-3.024-2.36-2.024c-.418-.357-.318-.68.235-.725l3.1-.25 1.195-2.87c.21-.508.55-.513.763 0l1.195 2.87 3.1.25c.547.043.657.365.236.725l-2.362 2.024.72 3.025c.13.535-.143.74-.616.45l-2.654-1.62z" fill="#FFF"></path>   </g></g></svg></a>\
            </span></div>\
            <div class="AuthorInfo-detail"><div class="AuthorInfo-badge"><div class="RichText AuthorInfo-badgeText">'+author_mood+'</div></div></div></div></div></div>\
            <div class="ContentItem AnswerItem"><h2 class="ContentItem-title"><div><a target="_blank" href="/question/'+question_id+'/?ans='+answer_id+'">'+question_title+'</a></div></h2>\
            <div class="ContentItem-meta"></div>\
            <div class="RichContent is-collapsed RichContent--withMask">\
            <div class="RichContent-content" data-content-url="/question/'+question_id+'/?ans='+answer_id+'">\
            <div class="RichContent-cover RichContent-cover--mobile">\
            <div class="RichContent-cover-inner" data-index-img-url="'+index_img_url+'"></div>\
            </div>\
            <div class="RichContent-inner RichContent-inner--collapsed" style="1max-height:400px">\
            <span class="RichText CopyrightRichText-richText">'+removeImg(answer_content)+'</span>\
            </div>\
            </div>\
            <div class="ContentItem-actions">\
            <span>\
            <button class="Button VoteButton VoteButton--up" aria-label="赞同" type="button"><svg viewBox="0 0 20 18" class="Icon VoteButton-upIcon Icon--triangle" width="9" height="16" aria-hidden="true" style="height: 16px; width: 9px;"><title></title><g><path d="M0 15.243c0-.326.088-.533.236-.896l7.98-13.204C8.57.57 9.086 0 10 0s1.43.57 1.784 1.143l7.98 13.204c.15.363.236.57.236.896 0 1.386-.875 1.9-1.955 1.9H1.955c-1.08 0-1.955-.517-1.955-1.9z"></path></g></svg>95</button>\
            <button class="Button VoteButton VoteButton--down VoteButton--mobileDown" aria-label="反对" type="button"><svg viewBox="0 0 20 18" class="Icon VoteButton-downIcon Icon--triangle" width="9" height="16" aria-hidden="true" style="height: 16px; width: 9px;"><title></title><g><path d="M0 15.243c0-.326.088-.533.236-.896l7.98-13.204C8.57.57 9.086 0 10 0s1.43.57 1.784 1.143l7.98 13.204c.15.363.236.57.236.896 0 1.386-.875 1.9-1.955 1.9H1.955c-1.08 0-1.955-.517-1.955-1.9z"></path></g></svg></button>\
            </span>\
            <button class="Button ContentItem-action Button--plain Button--withIcon Button--withLabel" type="button"><span style="display: inline-flex; align-items: center;">&#8203;<svg class="Zi Zi--Comment Button-zi" fill="currentColor" viewBox="0 0 24 24" width="1.2em" height="1.2em"><path d="M10.241 19.313a.97.97 0 0 0-.77.2 7.908 7.908 0 0 1-3.772 1.482.409.409 0 0 1-.38-.637 5.825 5.825 0 0 0 1.11-2.237.605.605 0 0 0-.227-.59A7.935 7.935 0 0 1 3 11.25C3 6.7 7.03 3 12 3s9 3.7 9 8.25-4.373 9.108-10.759 8.063z" fill-rule="evenodd"></path></svg></span>评论 21</button>\
            <button class="Button ContentItem-action Button--plain Button--withIcon Button--iconOnly" type="button"><span style="display: inline-flex; align-items: center;">&#8203;<svg class="Zi Zi--Star Button-zi" fill="currentColor" viewBox="0 0 24 24" width="1.2em" height="1.2em"><path d="M5.515 19.64l.918-5.355-3.89-3.792c-.926-.902-.639-1.784.64-1.97L8.56 7.74l2.404-4.871c.572-1.16 1.5-1.16 2.072 0L15.44 7.74l5.377.782c1.28.186 1.566 1.068.64 1.97l-3.89 3.793.918 5.354c.219 1.274-.532 1.82-1.676 1.218L12 18.33l-4.808 2.528c-1.145.602-1.896.056-1.677-1.218z" fill-rule="evenodd"></path></svg></span></button>\
            </div></div></div></div></div>\
            </div>';
                           
        if("append"==diretion)
            $('#appendArea').append(appendElement);
        else
            $('#appendArea').prepend(appendElement);
    }
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
                appendAnswerElementList(ret,g_list_type,"prepend")
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
                    button.removeClass("Button--grey").addClass("Button--blue").text("关注她");
                else if ("he"==who)
                    button.removeClass("Button--grey").addClass("Button--blue").text("关注他");
                else
                    button.removeClass("Button--grey").addClass("Button--blue").text("关注");
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
                button.removeClass("Button--blue").addClass("Button--grey").text("已关注");
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
                button.removeClass("Button--grey").addClass("Button--blue").text("关注话题");
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
                button.removeClass("Button--blue").addClass("Button--grey").text("已关注");
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
                button.removeClass("Button--grey").addClass("Button--blue").text("关注问题");
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
                button.removeClass("Button--blue").addClass("Button--grey").text("已关注");
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
        if($(this).parents(".ScrollIntoMark").length>0)
        {
            var timestamp=new Date().getTime();
            $(this).parents(".ScrollIntoMark").attr("id",timestamp);
        }
        $(this).click(function(){
            $(this).children(".ContentItem-more").addClass("is-hide");
            $(this).siblings(".ContentItem-actions").children(".ContentItem-less").removeClass("is-hide");
            $(this).parent().removeClass("is-collapsed");
            $(this).children(".RichContent-inner").css("max-height","");
            
            if($(this).parents(".ScrollIntoMark").length>0)
            {
                var timestamp=new Date().getTime();
                $(this).parents(".ScrollIntoMark").attr("id",timestamp);
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
}

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
                        <a href="/search/"><svg class="Zi Zi--Search" fill="#8590a6" viewBox="0 0 24 24" width="24" height="24"><path d="M17.068 15.58a8.377 8.377 0 0 0 1.774-5.159 8.421 8.421 0 1 0-8.42 8.421 8.38 8.38 0 0 0 5.158-1.774l3.879 3.88c.957.573 2.131-.464 1.488-1.49l-3.879-3.878zm-6.647 1.157a6.323 6.323 0 0 1-6.316-6.316 6.323 6.323 0 0 1 6.316-6.316 6.323 6.323 0 0 1 6.316 6.316 6.323 6.323 0 0 1-6.316 6.316z" fill-rule="evenodd"></path></svg>搜索&nbsp;<span style="color:#cbcbcb">|</span>&nbsp;提问</a>\
                        <a href="/notifications"><svg viewBox="0 0 24 24" class="Zi Zi--Setting" width="24" height="26" fill="#8590a6" style="height: 26px; width: 24px;"><title></title><g><path d="M18.868 15.185c-.164.096-.315.137-.452.137-.123 0-1.397-.26-1.617-.233-1.355.013-1.782 1.275-1.836 1.74-.055.454 0 .893.19 1.304.138.29.125.577-.067.85-.863.893-2.165 1.016-2.357 1.016-.123 0-.247-.055-.356-.15-.11-.097-.685-1.14-1.07-1.47-1.303-.954-2.246-.328-2.63 0-.397.33-.67.7-.835 1.126-.07.18-.18.302-.33.37-1.354.426-2.918-.92-3.014-1.056-.082-.11-.123-.22-.123-.356-.014-.138.383-1.276.342-1.688-.342-1.9-1.836-1.687-2.096-1.673-.303.014-.604.068-.92.178-.205.056-.396.03-.588-.054-.888-.462-1.137-2.332-1.11-2.51.055-.315.192-.52.438-.604.425-.164.81-.452 1.15-.85.932-1.262.344-2.25 0-2.634-.34-.356-.725-.645-1.15-.81-.137-.04-.233-.15-.328-.315C-.27 6.07.724 4.95.978 4.733c.255-.22.6-.055.723 0 .426.164.878.22 1.344.15C4.7 4.636 4.784 3.14 4.81 2.908c.015-.247-.11-1.29-.136-1.4-.027-.123-.014-.22.027-.315C5.318.178 7.073 0 7.223 0c.178 0 .33.055.44.178.108.124.63 1.11 1 1.4.398.338 1.582.83 2.588.013.398-.273.96-1.288 1.083-1.412.123-.123.26-.178.384-.178 1.56 0 2.33 1.03 2.438 1.22.083.124.096.248.07.37-.03.152-.33 1.153-.262 1.606.366 1.537 1.384 1.742 1.89 1.783.494.027 1.645-.357 1.81-.344.164.014.315.083.424.206.535.31.85 1.715.905 2.14.027.233-.014.44-.11.562-.11.138-1.165.714-1.48 1.112-.855.982-.342 2.25-.068 2.606.26.37 1.22.905 1.288.96.15.137.26.302.315.494.146 1.413-.89 2.387-1.07 2.47zm-8.905-.535c.644 0 1.246-.123 1.822-.356.575-.248 1.082-.59 1.493-1.016.425-.425.754-.92 1-1.495.247-.562.357-1.18.357-1.81 0-.66-.11-1.262-.356-1.825-.248-.562-.577-1.056-1.002-1.48-.41-.427-.918-.756-1.493-1.003-.576-.233-1.178-.357-1.822-.357-.644 0-1.247.124-1.81.357-.56.247-1.067.576-1.478 1.002-.425.425-.768.92-1 1.48-.247.564-.37 1.167-.37 1.826 0 .644.123 1.248.37 1.81.232.563.575 1.07 1 1.495.424.426.917.768 1.48 1.016.56.233 1.164.356 1.808.356z"></path></g></svg>通知&nbsp;<span style="color:#cbcbcb">|</span>&nbsp;私信&nbsp;<span style="color:#cbcbcb">|</span>&nbsp;设置</a>\
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
function checkSets()
{
    checkFollow();
    checkContentClick();
    checkContentExpand();
    checkContentCollapse();
    //checkPopoverShow();
    checkAnswerLike();
    checkExpandBtn();
}
/*
function init()
{
    g_module=$("main").attr("data-module");
}
*/

function initCommon()
{
    notifications="null";
    messages="null";
    g_last_getmoredata_index=0;
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
        ['video', ['video']]
        ],
        height:120,
        lang:'zh-CN',
        placeholder:'问题背景、条件等详细信息',
        callbacks: {
            onImageUpload: function(files){
                scaleAndUploadImage("forQuestion",files[0],720);
            }
        }
    });
    
    $('#summernote_answer').summernote({
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
    height:200,
    lang:'zh-CN',
    placeholder:'写回答...',
    callbacks: {
        onImageUpload: function(files){
            scaleAndUploadImage("forAnswer",files[0],720);
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

function isLockScrollMoreData()
{
    return LOCK_SCROLL_MOREDATA;
}
function setLockScrollMoreData(val)
{
    LOCK_SCROLL_MOREDATA=val;
    console.log("LOCK_SCROLL_MOREDATA="+LOCK_SCROLL_MOREDATA);
}

$(document).ready(function(){
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

STEP=5;
LOCK_SCROLL_MOREDATA="true";
ENABLE_SCREEN_LOG="true";//"false"