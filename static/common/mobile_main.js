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

function appendAnswerElementList(ret,type,direction)
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
        
        if("prepend"==direction)
            $('#appendArea').prepend(appendElement);
        else
            $('#appendArea').append(appendElement);
    }
}
function appendAnswerElementCard(ret,type,direction)
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
                           
        if("prepend"==direction)
            $('#appendArea').prepend(appendElement);
        else
            $('#appendArea').append(appendElement);
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
        var topic_followed=ret[i][7];
        
        if(topic_followed)
            var follow_button_data='<button class="Button Button--grey FollowButton" type="button" data-follow-type="topic" data-topic-id="'+topic_id+'" data-followed="true">已关注</button>';
        else
            var follow_button_data='<button class="Button Button--blue FollowButton" type="button" data-follow-type="topic" data-topic-id="'+topic_id+'" data-followed="false">关注话题</button>';
        
        var data='<div class="List-item">\
                    <div class="ContentItem">\
                    <div class="ContentItem-main">\
                    <div class="ContentItem-image">\
                    <span class="TopicLink TopicItem-avatar">\
                    <a class="TopicLink-link" target="_blank" href="/topic/'+topic_id+'">\
                    <img class="Avatar Avatar--large TopicLink-avatar" width="60" height="60" src="'+topic_avatar+'"  alt="'+topic_name+'" data-author-id="'+topic_id+'" data-toggle="popover" data-placement="bottom" data-trigger="manual" data-content="null" data-html="true">\
                    </a>\
                    </span>\
                    </div>\
                    <div class="ContentItem-head">\
                    <h2 class="ContentItem-title">\
                    <div class="TopicItem-title">\
                    <span class="TopicLink TopicItem-name">\
                    <a class="TopicLink-link" target="_blank" href="/er/'+topic_id+'"><span class="RichText">'+topic_name+'</span></a>\
                    </span>\
                    </div>\
                    </h2>\
                    <div class="ContentItem-meta">\
                    <div>\
                    <div class="ContentItem-status">\
                    <div class="ContentItem-statusItem">'+topic_detail+'</div>\
                    </div>\
                    </div>\
                    </div>\
                    </div>\
                    <div class="ContentItem-extra">'+follow_button_data+'</div>\
                    </div>\
                    </div>\
                    </div>\
                    ';
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
        
        var data='<div class="List-item">\
                    <div class="ContentItem">\
                    <div class="ContentItem-main">\
                    <div class="ContentItem-image">\
                    <span class="UserLink UserItem-avatar">\
                    <a class="UserLink-link" target="_blank" href="/er/'+adept_id+'">\
                    <img class="Avatar Avatar--large UserLink-avatar PeoplePopover" width="60" height="60" src="'+adept_avatar+'" srcset="'+adept_avatar+'" alt="'+adept_name+'" data-author-id="'+adept_id+'" data-toggle="popover" data-placement="bottom" data-trigger="manual" data-content="null" data-html="true">\
                    </a>\
                    </span>\
                    </div>\
                    <div class="ContentItem-head">\
                    <h2 class="ContentItem-title">\
                    <div class="UserItem-title">\
                    <span class="UserLink UserItem-name">\
                    <a class="UserLink-link" target="_blank" href="/er/'+adept_id+'"><span class="RichText">'+adept_name+'</span></a>\
                    </span>\
                    </div>\
                    </h2>\
                    <div class="ContentItem-meta">\
                    <div>\
                    <div class="ContentItem-status">\
                    <div class="ContentItem-statusItem">'+adept_mood+'</div>\
                    </div>\
                    </div>\
                    </div>\
                    </div>\
                    <div class="ContentItem-extra">\
                    <button class="Button Button--blue Invite" type="button" data-receiver="'+adept_id+'">邀请回答</button>\
                    </div>\
                    </div>\
                    </div>\
                    </div>\
                    ';
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

function appendSettingPageElement(ret)
{
    for(i in ret)
    {
        if("conversations"==g_setting_type)
        {
            var conversation_id=ret[i][0];
            var conversation_delete_id=ret[i][1];
            var conversation_update=ret[i][2].split('.')[0];
            var er_id=ret[i][3];
            var er_name=ret[i][4];
            var er_avatar=ret[i][5];
            var message_content=ret[i][6];
    
            if (conversation_delete_id==g_user_id) //user have delete this message
                continue;

            var data='<div class="List-item Conversations-item" data-action="delete_conversation" data-action-id="'+conversation_id+'">\
                <a class="zm-item-link-avatar50" href="/er/'+er_id+'">\
                <img class="zm-item-img-avatar50" src="'+er_avatar+'">\
                </a>\
                <div class="zm-pm-item-main"><a class="pm-touser author-link" title="verna wu" href="/er/'+er_id+'">'+er_name+'</a>：'+message_content+'</div>\
                <div class="zg-gray zu-pm-item-meta">\
                <span class="zg-gray zg-left">'+conversation_update+'</span>\
                <a class="zg-link-litblue" href="/conversations/?i='+conversation_id+'">查看对话</a>\
                <span class="zg-bull">|</span>\
                <a class="zg-link-litblue" href="javascript:;" name="reply" data-receiver-id="'+er_id+'"  data-receiver-name="'+er_name+'" data-toggle="modal" data-target="#letterModal">回复</a>\
                <span class="zg-bull">|</span>\
                <a class="zg-link-litblue" href="javascript:;" name="delete">删除</a>\
                </div>\
                </div>\
                ';

            $('#appendArea').append(data);
        }
        else if("conversation_messages"==g_setting_type)
        {
            var message_id=ret[i][0];
            var message_content=ret[i][1];
            var message_status=ret[i][2];
            var message_delete_id=ret[i][3];
            var message_pub_date=ret[i][4].split('.')[0];
            var er_id=ret[i][5];
            var er_name=ret[i][6];
            var er_avatar=ret[i][7];

            if (message_delete_id==g_user_id) //user have delete this message
            continue;

            if(er_id==g_user_id)
            er_name="我";

            var data='<div class="List-item Conversation-messages-item" data-action="delete_conversation_message" data-action-id="'+message_id+'">\
            <a class="zm-item-link-avatar50" href="/er/'+er_id+'">\
            <img class="zm-item-img-avatar50" src="'+er_avatar+'">\
            </a>\
            <div class="zm-pm-item-main"><a class="pm-touser author-link" title="verna wu" href="/er/'+er_id+'">'+er_name+'</a>：'+message_content+'</div>\
            <div class="zg-gray zu-pm-item-meta">\
            <span class="zg-gray zg-left">'+message_pub_date+'</span>\
            <a class="zg-link-litblue" href="javascript:;" name="delete">删除</a>\
            </div>\
            </div>\
            ';

            $('#appendArea').append(data);
        }
        else if("notifications"==g_setting_type)
        {
            var notification_id=ret[i][0];
            var notification_type=ret[i][1];
            var notification_active_id=ret[i][2];
            var notification_status=ret[i][3];
            var notification_pub_date=ret[i][4].split('.')[0];
            var notification_sender_id=ret[i][5];
            var notification_sender_first_name=ret[i][6];

            if("invite"==notification_type)
            {
                var question_title=ret[i][7];
                var data='<div class="List-item day"><h3>'+notification_pub_date+'</h3><div><i></i><div><span><span><a href="/er/'+notification_sender_id+'" target="_blank" style="color:#259">'+notification_sender_first_name+'</a></span>邀请你回答 <a style="color:#259" href="/question/'+notification_active_id+'">'+question_title+'</a></span></div></div></div>';
            }
            $("#appendArea").append(data);
        }
    }
    checkSettingPage();
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
function invite()
{
    $(".Invite").each(function(index,element){
        $(element).click(function(){
            var question_id=$(".QuestionPage").attr("data-question-id");
            //inviter=$(element).attr("data-from");
            receiver=$(element).attr("data-receiver");
            //$.get('/ajax/invite/?question='+question_id+'&from='+inviter+'&to='+invitee,function(ret){
            $.get('/ajax/invite/?question='+question_id+'&to='+receiver,function(ret){
                alert(ret);
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

    $.post("/ajax/topic_adept/",{"topics":topics},function(ret){
        if("fail"!=ret)
        {
            appendInviteElement(ret);
            $("#inviteModal").modal('show');
            checkSets();
            invite();
        }
    })
    //$("#inviteModal").modal('show');
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

function checkSearch()
{
    $("#q").on("input",function(){
        var keyword=$(this).val();
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
    });
    
    $("#search_button").on("click",function(){
        $("#appendArea").empty();
        g_last_getmoredata_index=0;
        getMoreData();
    });
    
    //$(".Tabs-link").off("click");
    $(".Tabs-link").click(function(){
        $(".Tabs-link").removeClass("is-active");
        $(this).addClass("is-active");
        g_search_type=$(this).attr("data-search-type");
        $("#appendArea").empty();
        g_last_getmoredata_index=0;
        getMoreData();
    });
}
function checkSettingPage()
{
    $("a[name='reply']").off("click");
    $("a[name='reply']").on("click",function(){
        var element=$(this);
        console.log(element);
        var id=element.attr("data-receiver-id");
        var name=element.attr("data-receiver-name");
        setLetterReceiver(id,name);
    });


    $("a[name='delete']").off("click");
    $("a[name='delete']").on("click",function(){
        var element=$(this).parents(".Setting-item");
        var action=element.attr("data-action");
        var action_id=element.attr("data-action-id");
        $.get("/ajax/"+action+"/"+action_id+"/",function(ret){
            if("success"==ret)
                element.remove();
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
                    $.post("/ajax/send_sms/",{"phone_no":value,"type":"register"},function(ret){
                        if("fail"!=ret)
                        {
                            if("registered"==ret)
                                $(".SignFlow-accountInputContainer>.SignFlowInput-errorMask").removeClass("SignFlowInput-errorMask--hidden").text("该手机号已注册");
                        }
                    });
                }
                else if("misc"==g_module)
                {
                    $.post("/ajax/send_sms/",{"phone_no":value,"type":"password_reset"},function(ret){
                        if("fail"!=ret)
                        {
                            if("unregistered"==ret)
                            {
                                $(".SignFlow-accountInputContainer>.SignFlowInput-errorMask").removeClass("SignFlowInput-errorMask--hidden").text("该手机号未注册，无此用户");
                            }
                            else
                            {
                                $(".StepHeader-subtitle").text("验证码已发送到您的手机上，请查看并输入");
                            }
                        }
                    });
                }
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
            //swith_element.attr("data-action","register").empty().append('已有帐号？<span id="switchRegisterLogin">登录</span>');
            $(".SignFlowHeader-title").text("注册知乎");
            $("#register").removeClass("is-hide");
            $("#login").addClass("is-hide");
        }
        else
        {
            $(this).text("登录");
            $("#registerLoginText").text("没有帐号？");
            swith_element.attr("data-action","login");
            //swith_element.attr("data-action","login").empty().append('没有帐号？<span id="switchRegisterLogin">注册</span>');
            $(".SignFlowHeader-title").text("登录知乎");
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
    $.post("/ajax/reset_pwd/",{"phone_no":phone_no,"veri_code":veri_code,"pwd":value},function(ret){
        if("fail"!=ret)
        {
            if("success"==ret)
            {
                console.log("reset ok");
                location.href="/account/?arg=reset_pwd_success";
            }
        }
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
    });
        
    return false;
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

function checkHomePage()
{
    $(".ProfileEditButton,.Profile-infosOia").click(function(){
        console.log(this);
        g_cache_page=$("main").html();
        if($(this).hasClass("Profile-infosOia"))
        {
            var data='\
			<div class="Card">\
            <div class="ProfileHeader-expandActions ProfileEdit-expandActions">\
			<button class="1Button 1Button--primary Button--blue ReturnHomePage" style="margin:3px" type="button">返回我的主页</button>\
			</div>\
            <div class="Profile-intro">\
            <img id="id_avatar" class="Profile-avatar Modify-avatar" src="'+g_er_avatar+'"alt="">\
            </div>\
            <div class="Profile-data">\
            <div class="Profile-datalist">\
			<div class="Field List-item"><h6>昵称</h6><div class="Field-content"><div><span class="Field-text"><span class="RichText">'+g_er_name+'</span></span></div></div></div>\
			<div class="Field List-item"><h6>性别</h6><div class="Field-content"><div><span class="Field-text">'+g_er_sexual_han+'</span></div></div></div>\
			<div class="Field List-item"><h6>一句话介绍</h6><div class="Field-content"><div><span class="Field-text"><span class="RichText">'+g_er_mood+'</span></span></div></div></div>\
			<div class="Field List-item"><h6>居住地</h6><div class="Field-content"><div><span class="Field-text"><span class="RichText">'+g_er_residence+'</span></span></div></div></div>\
			<div class="Field List-item"><h6>所在行业</h6><div class="Field-content"><div><span class="Field-text">'+g_er_job+'</span></div></div></div>\
			<div class="Field List-item"><h6>个人简介</h6><div class="Field-content"><div class="DescriptionField-content"><span class="Field-text"><span class="RichText">'+g_er_intro+'</span></span></div></div></div>\
            </div></div>\
			</div>';
            $("main").empty().append(data);
            checkReturnHomePage();
        }
        else
        {
            var data='\
			<div class="Card">\
            <div class="ProfileHeader-expandActions ProfileEdit-expandActions">\
			<button class="1Button 1Button--primary Button--blue ReturnHomePage" style="margin:3px" type="button">返回我的主页</button>\
			</div>\
            <div class="Profile-intro">\
            <img id="id_avatar" class="Profile-avatar Modify-avatar" src="'+g_er_avatar+'"alt="">\
            <input id="id_avatar_input" name="file" type="file" accept="image/png,image/jpeg" style="display: none;"/>\
            </div>\
            <div class="Profile-data">\
            <div class="Profile-datalist">\
			<div class="Field List-item"><h6>昵称</h6><div class="Field-content" data-field-type="nickname"><div><span class="Field-text"><span class="RichText">'+g_er_name+'</span></span><button class="Button ModifyButton Button--link" type="button"><svg viewBox="0 0 12 12" class="Icon ModifyButton-icon Icon--modify" width="12" height="16" aria-hidden="true" style="height: 16px; width: 12px;"><title></title><g><path d="M.423 10.32L0 12l1.667-.474 1.55-.44-2.4-2.33-.394 1.564zM10.153.233c-.327-.318-.85-.31-1.17.018l-.793.817 2.49 2.414.792-.814c.318-.328.312-.852-.017-1.17l-1.3-1.263zM3.84 10.536L1.35 8.122l6.265-6.46 2.49 2.414-6.265 6.46z" fill-rule="evenodd"></path></g></svg>修改</button></div></div></div>\
			<div class="Field List-item"><h6>性别</h6><div class="Field-content" data-field-type="sexual"><div><span class="Field-text">'+g_er_sexual_han+'</span><button class="Button ModifyButton Button--link" type="button"><svg viewBox="0 0 12 12" class="Icon ModifyButton-icon Icon--modify" width="12" height="16" aria-hidden="true" style="height: 16px; width: 12px;"><title></title><g><path d="M.423 10.32L0 12l1.667-.474 1.55-.44-2.4-2.33-.394 1.564zM10.153.233c-.327-.318-.85-.31-1.17.018l-.793.817 2.49 2.414.792-.814c.318-.328.312-.852-.017-1.17l-1.3-1.263zM3.84 10.536L1.35 8.122l6.265-6.46 2.49 2.414-6.265 6.46z" fill-rule="evenodd"></path></g></svg>修改</button></div></div></div>\
			<div class="Field List-item"><h6>一句话介绍</h6><div class="Field-content" data-field-type="mood"><div><span class="Field-text"><span class="RichText">'+g_er_mood+'</span></span><button class="Button ModifyButton Button--link" type="button"><svg viewBox="0 0 12 12" class="Icon ModifyButton-icon Icon--modify" width="12" height="16" aria-hidden="true" style="height: 16px; width: 12px;"><title></title><g><path d="M.423 10.32L0 12l1.667-.474 1.55-.44-2.4-2.33-.394 1.564zM10.153.233c-.327-.318-.85-.31-1.17.018l-.793.817 2.49 2.414.792-.814c.318-.328.312-.852-.017-1.17l-1.3-1.263zM3.84 10.536L1.35 8.122l6.265-6.46 2.49 2.414-6.265 6.46z" fill-rule="evenodd"></path></g></svg>修改</button></div></div></div>\
			<div class="Field List-item"><h6>居住地</h6><div class="Field-content" data-field-type="residence"><div><span class="Field-text"><span class="RichText">'+g_er_residence+'</span></span><button class="Button ModifyButton Button--link" type="button"><svg viewBox="0 0 12 12" class="Icon ModifyButton-icon Icon--modify" width="12" height="16" aria-hidden="true" style="height: 16px; width: 12px;"><title></title><g><path d="M.423 10.32L0 12l1.667-.474 1.55-.44-2.4-2.33-.394 1.564zM10.153.233c-.327-.318-.85-.31-1.17.018l-.793.817 2.49 2.414.792-.814c.318-.328.312-.852-.017-1.17l-1.3-1.263zM3.84 10.536L1.35 8.122l6.265-6.46 2.49 2.414-6.265 6.46z" fill-rule="evenodd"></path></g></svg>修改</button></div></div></div>\
			<div class="Field List-item"><h6>所在行业</h6><div class="Field-content" data-field-type="job"><div><span class="Field-text">'+g_er_job+'</span><button class="Button ModifyButton Button--link" type="button"><svg viewBox="0 0 12 12" class="Icon ModifyButton-icon Icon--modify" width="12" height="16" aria-hidden="true" style="height: 16px; width: 12px;"><title></title><g><path d="M.423 10.32L0 12l1.667-.474 1.55-.44-2.4-2.33-.394 1.564zM10.153.233c-.327-.318-.85-.31-1.17.018l-.793.817 2.49 2.414.792-.814c.318-.328.312-.852-.017-1.17l-1.3-1.263zM3.84 10.536L1.35 8.122l6.265-6.46 2.49 2.414-6.265 6.46z" fill-rule="evenodd"></path></g></svg>修改</button></div></div></div>\
			<div class="Field List-item"><h6>个人简介</h6><div class="Field-content" data-field-type="intro"><div class="DescriptionField-content"><span class="Field-text"><span class="RichText">'+g_er_intro+'</span></span><button class="Button ModifyButton Button--link" type="button"><svg viewBox="0 0 12 12" class="Icon ModifyButton-icon Icon--modify" width="12" height="16" aria-hidden="true" style="height: 16px; width: 12px;"><title></title><g><path d="M.423 10.32L0 12l1.667-.474 1.55-.44-2.4-2.33-.394 1.564zM10.153.233c-.327-.318-.85-.31-1.17.018l-.793.817 2.49 2.414.792-.814c.318-.328.312-.852-.017-1.17l-1.3-1.263zM3.84 10.536L1.35 8.122l6.265-6.46 2.49 2.414-6.265 6.46z" fill-rule="evenodd"></path></g></svg>修改</button></div></div></div>\
            </div></div>\
			</div>';
            
            $("main").empty().append(data);
            checkReturnHomePage();
            checkAvatarModify();
            checkProfileModify();
        }
        
        
    });
    function checkReturnHomePage(){
        $(".ReturnHomePage").off("click");
        $(".ReturnHomePage").click(function(){
            $("main").empty().append(g_cache_page);
            checkHomePage();
            checkNextPage();
        });
    }
    function checkProfileSave()
    {
        $(".save").off("click");
        $(".save").click(function(){
            var _this=$(this);
            var field_type=$(this).parents(".Field-content").attr("data-field-type")
            console.log(field_type);
            if("nickname"==field_type)
            {
                var value=$("input[name='nickname']").val();
                $.post("/ajax/profile_edit/nickname/",{content:value},function(ret){
                    if("fail"!=ret)
                    {
                        g_er_name=ret;                 
                    }
                    var data='<div><span class="Field-text"><span class="RichText">'+g_er_name+'</span></span><button class="Button ModifyButton Button--link" type="button"><svg viewBox="0 0 12 12" class="Icon ModifyButton-icon Icon--modify" width="12" height="16" aria-hidden="true" style="height: 16px; width: 12px;"><title></title><g><path d="M.423 10.32L0 12l1.667-.474 1.55-.44-2.4-2.33-.394 1.564zM10.153.233c-.327-.318-.85-.31-1.17.018l-.793.817 2.49 2.414.792-.814c.318-.328.312-.852-.017-1.17l-1.3-1.263zM3.84 10.536L1.35 8.122l6.265-6.46 2.49 2.414-6.265 6.46z" fill-rule="evenodd"></path></g></svg>修改</button></div>';
                    _this.parents(".Field-content").empty().append(data);
                    checkProfileModify();
                });

            }
            if("sexual"==field_type)
            {	
                var value=$("input[name='sexual']:checked").val();
                $.post("/ajax/profile_edit/sexual/",{content:value},function(ret){
                    if("fail"!=ret)
                    {
                        console.log(ret);
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
                    }
                    var data='<div><span class="Field-text">'+g_er_sexual_han+'</span><button class="Button ModifyButton Button--link" type="button"><svg viewBox="0 0 12 12" class="Icon ModifyButton-icon Icon--modify" width="12" height="16" aria-hidden="true" style="height: 16px; width: 12px;"><title></title><g><path d="M.423 10.32L0 12l1.667-.474 1.55-.44-2.4-2.33-.394 1.564zM10.153.233c-.327-.318-.85-.31-1.17.018l-.793.817 2.49 2.414.792-.814c.318-.328.312-.852-.017-1.17l-1.3-1.263zM3.84 10.536L1.35 8.122l6.265-6.46 2.49 2.414-6.265 6.46z" fill-rule="evenodd"></path></g></svg>修改</button></div>';
                    _this.parents(".Field-content").empty().append(data);
                    checkProfileModify();
                });
            }
            else if("mood"==field_type)
            {
                var value=$("input[name='mood']").val();
                $.post("/ajax/profile_edit/mood/",{content:value},function(ret){
                    if("fail"!=ret)
                    {
                        g_er_mood=ret;                 
                    }
                    var data='<div><span class="Field-text"><span class="RichText">'+g_er_mood+'</span></span><button class="Button ModifyButton Button--link" type="button"><svg viewBox="0 0 12 12" class="Icon ModifyButton-icon Icon--modify" width="12" height="16" aria-hidden="true" style="height: 16px; width: 12px;"><title></title><g><path d="M.423 10.32L0 12l1.667-.474 1.55-.44-2.4-2.33-.394 1.564zM10.153.233c-.327-.318-.85-.31-1.17.018l-.793.817 2.49 2.414.792-.814c.318-.328.312-.852-.017-1.17l-1.3-1.263zM3.84 10.536L1.35 8.122l6.265-6.46 2.49 2.414-6.265 6.46z" fill-rule="evenodd"></path></g></svg>修改</button></div>';
                    _this.parents(".Field-content").empty().append(data);
                    checkProfileModify();
                });

            }
            else if("residence"==field_type)
            {
                var value=$("input[name='residence']").val();
                $.post("/ajax/profile_edit/residence/",{content:value},function(ret){
                    if("fail"!=ret)
                    {
                        g_er_residence=ret;                     
                    }
                    var data='<div><span class="Field-text"><span class="RichText">'+g_er_residence+'</span></span><button class="Button ModifyButton Button--link" type="button"><svg viewBox="0 0 12 12" class="Icon ModifyButton-icon Icon--modify" width="12" height="16" aria-hidden="true" style="height: 16px; width: 12px;"><title></title><g><path d="M.423 10.32L0 12l1.667-.474 1.55-.44-2.4-2.33-.394 1.564zM10.153.233c-.327-.318-.85-.31-1.17.018l-.793.817 2.49 2.414.792-.814c.318-.328.312-.852-.017-1.17l-1.3-1.263zM3.84 10.536L1.35 8.122l6.265-6.46 2.49 2.414-6.265 6.46z" fill-rule="evenodd"></path></g></svg>修改</button></div>';
                    _this.parents(".Field-content").empty().append(data);
                    checkProfileModify();
                });
            }
            else if("job"==field_type)
            {
                var value=$("input[name='job']").val();
                $.post("/ajax/profile_edit/job/",{content:value},function(ret){
                    if("fail"!=ret)
                    {
                        g_er_job=ret;
                    }
                    var data='<div><span class="Field-text">'+g_er_job+'</span><button class="Button ModifyButton Button--link" type="button"><svg viewBox="0 0 12 12" class="Icon ModifyButton-icon Icon--modify" width="12" height="16" aria-hidden="true" style="height: 16px; width: 12px;"><title></title><g><path d="M.423 10.32L0 12l1.667-.474 1.55-.44-2.4-2.33-.394 1.564zM10.153.233c-.327-.318-.85-.31-1.17.018l-.793.817 2.49 2.414.792-.814c.318-.328.312-.852-.017-1.17l-1.3-1.263zM3.84 10.536L1.35 8.122l6.265-6.46 2.49 2.414-6.265 6.46z" fill-rule="evenodd"></path></g></svg>修改</button></div>';
                    _this.parents(".Field-content").empty().append(data);
                    checkProfileModify();
                });
            }
            else if("intro"==field_type)
            {
                var value=$("textarea[name='intro']").val();
                $.post("/ajax/profile_edit/intro/",{content:value},function(ret){
                    if("fail"!=ret)
                    {
                        g_er_intro=ret;
                    }
                    var data='<div class="DescriptionField-content"><span class="Field-text"><span class="RichText">'+g_er_intro+'</span></span><button class="Button ModifyButton Button--link" type="button"><svg viewBox="0 0 12 12" class="Icon ModifyButton-icon Icon--modify" width="12" height="16" aria-hidden="true" style="height: 16px; width: 12px;"><title></title><g><path d="M.423 10.32L0 12l1.667-.474 1.55-.44-2.4-2.33-.394 1.564zM10.153.233c-.327-.318-.85-.31-1.17.018l-.793.817 2.49 2.414.792-.814c.318-.328.312-.852-.017-1.17l-1.3-1.263zM3.84 10.536L1.35 8.122l6.265-6.46 2.49 2.414-6.265 6.46z" fill-rule="evenodd"></path></g></svg>修改</button></div>';
                    _this.parents(".Field-content").empty().append(data);
                    checkProfileModify();
                });
            }
            checkProfileModify();
        });
        $(".cancle").off("click");
        //$(".cancle").each(function(){
        $(".cancle").click(function(){
            var field_type=$(this).parents(".Field-content").attr("data-field-type")
            console.log(field_type);
            if("nickname"==field_type)
            {
                var data='<div><span class="Field-text"><span class="RichText">'+g_er_name+'</span></span><button class="Button ModifyButton Button--link" type="button"><svg viewBox="0 0 12 12" class="Icon ModifyButton-icon Icon--modify" width="12" height="16" aria-hidden="true" style="height: 16px; width: 12px;"><title></title><g><path d="M.423 10.32L0 12l1.667-.474 1.55-.44-2.4-2.33-.394 1.564zM10.153.233c-.327-.318-.85-.31-1.17.018l-.793.817 2.49 2.414.792-.814c.318-.328.312-.852-.017-1.17l-1.3-1.263zM3.84 10.536L1.35 8.122l6.265-6.46 2.49 2.414-6.265 6.46z" fill-rule="evenodd"></path></g></svg>修改</button></div>';
            }
            else if("sexual"==field_type)
            {			
                var data='<div><span class="Field-text">'+g_er_sexual_han+'</span><button class="Button ModifyButton Button--link" type="button"><svg viewBox="0 0 12 12" class="Icon ModifyButton-icon Icon--modify" width="12" height="16" aria-hidden="true" style="height: 16px; width: 12px;"><title></title><g><path d="M.423 10.32L0 12l1.667-.474 1.55-.44-2.4-2.33-.394 1.564zM10.153.233c-.327-.318-.85-.31-1.17.018l-.793.817 2.49 2.414.792-.814c.318-.328.312-.852-.017-1.17l-1.3-1.263zM3.84 10.536L1.35 8.122l6.265-6.46 2.49 2.414-6.265 6.46z" fill-rule="evenodd"></path></g></svg>修改</button></div>';
            }
            else if("mood"==field_type)
            {
                var data='<div><span class="Field-text"><span class="RichText">'+g_er_mood+'</span></span><button class="Button ModifyButton Button--link" type="button"><svg viewBox="0 0 12 12" class="Icon ModifyButton-icon Icon--modify" width="12" height="16" aria-hidden="true" style="height: 16px; width: 12px;"><title></title><g><path d="M.423 10.32L0 12l1.667-.474 1.55-.44-2.4-2.33-.394 1.564zM10.153.233c-.327-.318-.85-.31-1.17.018l-.793.817 2.49 2.414.792-.814c.318-.328.312-.852-.017-1.17l-1.3-1.263zM3.84 10.536L1.35 8.122l6.265-6.46 2.49 2.414-6.265 6.46z" fill-rule="evenodd"></path></g></svg>修改</button></div>';
            }
            else if("residence"==field_type)
            {
                var data='<div><span class="Field-text"><span class="RichText">'+g_er_residence+'</span></span><button class="Button ModifyButton Button--link" type="button"><svg viewBox="0 0 12 12" class="Icon ModifyButton-icon Icon--modify" width="12" height="16" aria-hidden="true" style="height: 16px; width: 12px;"><title></title><g><path d="M.423 10.32L0 12l1.667-.474 1.55-.44-2.4-2.33-.394 1.564zM10.153.233c-.327-.318-.85-.31-1.17.018l-.793.817 2.49 2.414.792-.814c.318-.328.312-.852-.017-1.17l-1.3-1.263zM3.84 10.536L1.35 8.122l6.265-6.46 2.49 2.414-6.265 6.46z" fill-rule="evenodd"></path></g></svg>修改</button></div>';
            }
            else if("job"==field_type)
            {
                var data='<div><span class="Field-text">'+g_er_job+'</span><button class="Button ModifyButton Button--link" type="button"><svg viewBox="0 0 12 12" class="Icon ModifyButton-icon Icon--modify" width="12" height="16" aria-hidden="true" style="height: 16px; width: 12px;"><title></title><g><path d="M.423 10.32L0 12l1.667-.474 1.55-.44-2.4-2.33-.394 1.564zM10.153.233c-.327-.318-.85-.31-1.17.018l-.793.817 2.49 2.414.792-.814c.318-.328.312-.852-.017-1.17l-1.3-1.263zM3.84 10.536L1.35 8.122l6.265-6.46 2.49 2.414-6.265 6.46z" fill-rule="evenodd"></path></g></svg>修改</button></div>';
            }
            else if("intro"==field_type)
            {
                var data='<div class="DescriptionField-content"><span class="Field-text"><span class="RichText">'+g_er_intro+'</span></span><button class="Button ModifyButton Button--link" type="button"><svg viewBox="0 0 12 12" class="Icon ModifyButton-icon Icon--modify" width="12" height="16" aria-hidden="true" style="height: 16px; width: 12px;"><title></title><g><path d="M.423 10.32L0 12l1.667-.474 1.55-.44-2.4-2.33-.394 1.564zM10.153.233c-.327-.318-.85-.31-1.17.018l-.793.817 2.49 2.414.792-.814c.318-.328.312-.852-.017-1.17l-1.3-1.263zM3.84 10.536L1.35 8.122l6.265-6.46 2.49 2.414-6.265 6.46z" fill-rule="evenodd"></path></g></svg>修改</button></div>';
            }
            $(this).parents(".Field-content").empty().append(data);
            checkProfileModify();
        });
        //});
    }
    function checkProfileModify()
    {
        $(".Field").find(".ModifyButton").off("click");
        $(".Field").find(".ModifyButton").click(function(){
            var field_type=$(this).parents(".Field-content").attr("data-field-type");
            console.log(field_type);
            if("nickname"==field_type)
            {
                var data='<div><div class="HeadlineField-input Input-wrapper"><input name="nickname" class="Input" value="'+g_er_name+'"></div><div class="HeadlineField-actions"><div class="ButtonGroup HeadlineField-buttonGroup"><button class="Button Button--primary Button--blue save" type="button">保存</button><button class="Button Button--grey cancle" type="button">取消</button></div><span class="MaxLength"></span></div></div>';
            }
            else if("sexual"==field_type)
            {
                if("f"==g_er_sexual)
                    var data='<div><input type="radio" name="sexual" value="m"> 男<input type="radio" name="sexual" value="f" checked style="margin-left: 30px;"> 女<div class="ButtonGroup"><button class="Button Button--primary Button--blue save" type="button">保存</button><button class="Button Button--grey cancle" type="button">取消</button></div></div>';
                else
                    var data='<div><input type="radio" name="sexual" value="m" checked> 男<input type="radio" name="sexual" value="f" style="margin-left: 30px;"> 女<div class="ButtonGroup"><button class="Button Button--primary Button--blue save" type="button">保存</button><button class="Button Button--grey cancle" type="button">取消</button></div></div>';
            }
            else if("mood"==field_type)
            {
                var data='<div><div class="HeadlineField-input Input-wrapper"><input name="mood" class="Input" value="'+g_er_mood+'"></div><div class="HeadlineField-actions"><div class="ButtonGroup HeadlineField-buttonGroup"><button class="Button Button--primary Button--blue save" type="button">保存</button><button class="Button Button--grey cancle" type="button">取消</button></div><span class="MaxLength"></span></div></div>';
            }
            else if("residence"==field_type)
            {
                var data='<div><div class="HeadlineField-input Input-wrapper"><input name="residence" class="Input" value="'+g_er_residence+'"></div><div class="HeadlineField-actions"><div class="ButtonGroup HeadlineField-buttonGroup"><button class="Button Button--primary Button--blue save" type="button">保存</button><button class="Button Button--grey cancle" type="button">取消</button></div><span class="MaxLength"></span></div></div>';
                $(this).parents(".Field-content").empty().append(data);
            }
            else if("job"==field_type)
            {
                var data='<div><div class="HeadlineField-input Input-wrapper"><input name="job" class="Input" value="'+g_er_job+'"></div><div class="HeadlineField-actions"><div class="ButtonGroup HeadlineField-buttonGroup"><button class="Button Button--primary Button--blue save" type="button">保存</button><button class="Button Button--grey cancle" type="button">取消</button></div><span class="MaxLength"></span></div></div>';
            }
            else if("intro"==field_type)
            {
                var data='<div><textarea name="intro" rows="3" class="DescriptionField-input TextArea">'+g_er_intro+'</textarea><div class="DescriptionField-actions"><div class="ButtonGroup DescriptionField-buttonGroup"><button class="Button Button--primary Button--blue save" type="button">保存</button><button class="Button Button--grey cancle" type="button">取消</button></div><span class="MaxLength"></span></div></div>';
            }
            $(this).parents(".Field-content").empty().append(data);
            checkProfileSave();
        });
            //ata-field-type="sexual"
    }
    function checkAvatarModify()
    {
        $(".Profile-avatar.Modify-avatar").click(function(){
            $("#id_avatar_input").click();
            $("#id_avatar_input").on("change",function(){
                //fileUpload();
                var file = $('#id_avatar_input')[0].files[0];
                scaleAndUploadImage("forAvatar",file,200);
            });
        });
    }
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



function getMoreData()
{
    if("index"==g_module)
    {
        var nums=g_last_getmoredata_index;
        var order=1;//pub_date
        var start=nums;
        var end=start+STEP;
        var url='/ajax/questions/'+order+'/'+start+'/'+end+'/';
        var post_data='';
    }
    else if("question"==g_module)
    {
        if("more"==g_list_type)
        {
            var order=1;
            var start=0;
            var end=2;
            var url='/ajax/answers/'+g_question_id+'/'+order+'/'+start+'/'+end+'/';
            var post_data='';
        }
        else
        {
            var nums=g_last_getmoredata_index;
            var order=1;//pub_date
            var start=nums;
            var end=start+STEP;
            var url='/ajax/answers/'+g_question_id+'/'+order+'/'+start+'/'+end+'/';
            var post_data='';
        }
    }
    else if("topic"==g_module)
    {
            var nums=g_last_getmoredata_index;
            var order=1;//pub_date
            var start=nums;
            var end=start+STEP;
            var url="/ajax/topic/"+g_topic_id+"/"+order+"/"+start+"/"+end+"/";
            var post_data='';
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
    $.post(url,post_data,function(ret){
        if("fail"!=ret)
        {
            if("index"==g_module)
            {
                appendAnswerElementCard(ret,"has_topic_question_title",diretion="append") ;
            }
            else if("question"==g_module)
            {
                if("more"==g_list_type)
                {
                    appendAnswerElementList(ret,"more");
                }
                else
                {
                    appendAnswerElementList(ret,"all");
                }
            }
            else if("topic"==g_module)
            {
                appendAnswerElementList(ret,"topic");
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
            checkSets();
            g_last_getmoredata_index+=STEP;
        }
        setLockScrollMoreData("false");
    });
}

function initElement()
{
    if("question"==g_module)
    {
        $('title').text(g_question_title+" - "+SITE);
        $(".QuestionHeader-title").append('<a href="/question/'+g_question_id+'">'+g_question_title+'</a>');
        $(".AuthorInfo-avatar").attr("src",g_user_avatar);
        $(".AuthorInfo-name").empty().append(g_user_name);
        if("true"==g_question_followed)
        {
            $(".FollowButton").removeClass("Button--blue").addClass("Button--grey").attr("data-question-id",g_question_id).attr("data-followed","true").text("已关注");
        }
        else
        {
            $(".FollowButton").removeClass("Button--grey").addClass("Button--blue").attr("data-question-id",g_question_id).attr("data-followed","false").text("关注问题");
        }
        
        var g_push_answer_content_scale_imge=addClassImg(g_push_answer_content,'class="origin_image"');
        $(".RichText.CopyrightRichText-richText").html(g_push_answer_content_scale_imge);
    }
    else if("topic"==g_module)
    {
        $(".Tabs.Topic-tabs").append('<li role="tab" class="Tabs-item Tabs-item--noMeta" aria-controls="Topic-hot"><a class="Tabs-link is-active" href="/topic/'+g_topic_id+'/hot">讨论</a></li><li role="tab" class="Tabs-item Tabs-item--noMeta" aria-controls="Topic-top"><a class="Tabs-link" href="/topic/'+g_topic_id+'/top-answers">精华</a></li><li role="tab" class="Tabs-item Tabs-item--noMeta" aria-controls="Topic-wait"><a class="Tabs-link" href="/topic/'+g_topic_id+'/unanswered">等待回答</a></li>');
        $(".TopicCard-image").empty().append('<img alt="'+g_topic_name+'" src="'+g_topic_avatar+'">');
        $(".TopicCard-title").append(g_topic_name);
        $(".TopicCard-description").append(g_topic_detail);
        $(".NumberBoard-value").append(g_topic_follower_nums);
        if("true"==g_topic_followed)
            $(".FollowButton.TopicCard-followButton").removeClass("Button--blue").addClass("Button--grey").attr("data-topic-id",g_topic_id).attr("data-followed","true").text("已关注");
        else
            $(".FollowButton.TopicCard-followButton").removeClass("Button--grey").addClass("Button--blue").attr("data-topic-id",g_topic_id).attr("data-followed","false").text("关注话题");   
    }
    else if("mytopic"==g_module)
    {
        if("true"==g_logged)
            $("#myfollow").attr("href","/er/"+g_user_id+"/following/topics/");
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
            var data='<div class="List-item Conversation-messages-head"><div class="zg-section"><a href="/conversations">« 返回</a></div><div class="zg-section zg-14px"><span class="zg-gray-normal">发私信给 </span><span class="zg-gray-darker">'+g_parter_name+'</span>：</div><div class="zg-section LetterSend" id="zh-pm-editor-form"><div class="zg-editor-simple-wrap zg-form-text-input"><div class="zg-user-name" style="display:none"></div><textarea id="letterText2" class="zg-editor-input zu-seamless-input-origin-element" style="font-weight: normal; height: 22px;" data-receiver-id="4"></textarea></div><div class="zh-pm-warnmsg" style="display:none;text-align:right;color:#C3412F;"></div><div class="zm-command"><button class="Button Messages-sendButton Button--primary Button--blue" type="button" onclick="sendLetter2()">发送</button></div></div></div>';
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
        $(".Profile-avatar").attr("src",g_er_avatar);
        $(".Profile-name").text(g_er_name);
        $(".Profile-headline").text(g_er_mood);
        $("#residence").text(g_er_residence);
        $("#job").text(g_er_job);
        $("#followers").text(g_followers_num);
        $("#followtos").text(g_followtos_num);
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
        if(g_user_id==g_er_id)
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
            if("true"==g_followed)
                $(".ProfileFollowButton").removeClass("is-hide Button--blue").addClass("Button--grey").text("已关注").attr("data-followed","true").attr("data-er-id",g_er_id).attr("data-who",who);
            else
                $(".ProfileFollowButton").removeClass("is-hide Button--grey").addClass("Button--blue").text("关注"+who_han).attr("data-followed","false").attr("data-er-id",g_er_id).attr("data-who",who);
        }
        $(".who").text(who_han);
           
        var answers_active="";
        var asks_active="";
        var posts_active="";
        var following_active="";	
        if ("answers"==g_command)
        {
            answers_active="is-active";
            appendAnswerElement();
        }
        else if("asks"==g_command)
        {
            asks_active="is-active";
            appendQuestionElement();
        }
        else if("posts"==g_command)
        {
            posts_active="is-active";
            //appendQuestionElement();
        }
        else if("following"==g_command)
        {
            following_active="is-active";
            appendFollowElement();
        }
        else 
            console.log("false");
        
        var ul_list='<li role="tab" class="Tabs-item Tabs-item--noMeta" aria-controls="Profile-activities"><a class="Tabs-link '+answers_active+'" href="/er/'+g_er_id+'/answers/">回答</a></li><li role="tab" class="Tabs-item Tabs-item--noMeta" aria-controls="Profile-answers"><a class="Tabs-link '+asks_active+'" href="/er/'+g_er_id+'/asks/">提问</a></li><li role="tab" class="Tabs-item Tabs-item--noMeta" aria-controls="Profile-articals"><a class="Tabs-link '+posts_active+'" href="/er/'+g_er_id+'/posts/">文章</a></li><li role="tab" class="Tabs-item Tabs-item--noMeta" aria-controls="Profile-questions"><a class="Tabs-link '+following_active+'" href="/er/'+g_er_id+'/following/">关注</a></li>'
        $(".Tabs.ProfileBar").append(ul_list);
        
        setLetterReceiver(g_er_id,g_er_name);
        checkNextPage();
        checkHomePage();
    }
}
function initData()
{
    g_last_getmoredata_index=0;
	var str_main_data=$("main").attr("data-dfs-main");
	console.log(str_main_data);
	var main_data=JSON.parse(str_main_data);//str_main_data.parseJSON();
	g_logged=main_data.logged;
    if("true"==g_logged)
    {
        g_user_id=main_data.user_id;
        g_user_name=main_data.user_name;
        g_user_avatar=main_data.user_avatar;
    }
    if("question"==g_module)
    {
        g_question_id=main_data.question_id;
        g_question_title=main_data.question_title;
        g_question_answer_nums=main_data.question_answer_nums;
        g_question_followed=main_data.question_followed;
        g_push_answer_id=main_data.answer_id;
        g_push_answer_like_nums=main_data.answer_like_nums;
        g_push_answer_content=$("main").attr("data-answer-content");
        g_author_id=main_data.author_id;
        g_author_name=main_data.author_name;
        g_author_avatar=main_data.author_avatar;
        g_author_mood=main_data.author_mood;

        if(""!=g_push_answer_id)
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
        g_topic_followed=main_data.topic_followed;
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
        g_parter_name=main_data.parter_name;
    }
    else if("misc"==g_module)
    {
        g_arg=main_data.arg;
    }
    else if("home"==g_module)
    {
        var str_ext_data=$("main").attr("data-dfs-ext");
        var ext_data=JSON.parse(str_ext_data);

        g_user_id=main_data.user_id;
        g_user_name=main_data.user_name;
        g_user_avatar=main_data.user_avatar;

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

        g_questions_num=ext_data.questions_num;
        g_answers_num=ext_data.answers_num;
        g_followtos_num=ext_data.followtos_num;
        g_followers_num=ext_data.followers_num;
        g_followtopics_num=ext_data.followtopics_num;
        g_followquestions_num=ext_data.followquestions_num;
    }
} 

function init()
{
    g_module=$("main").attr("data-module");
    initData();
    initElement();
    if(("sign"!=g_module)&&("misc"!=g_module))
    {
        getMoreData();
        checkSets();
        appendLetterModal();
    }
}
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
SITE="知乎";
STEP=10;
LOCK_SCROLL_MOREDATA="true";
ENABLE_SCREEN_LOG="true";//"false"