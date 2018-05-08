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
                    $("#summernote_question").summernote('insertImage', url, 'image name'); // the insertImage API
                else if("forAnswer"==type)
                    $("#summernote_answer").summernote('insertImage', url, 'image name'); // the insertImage API
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
                var richContent_class="RichContent--unescapable is-collapsed";
                var RichContent_inner_attr='style="max-height:400px"';
                var expand_btn_class="Button ContentItem-more ContentItem-rightButton Button--plain";
                var collapse_btn_class="Button ContentItem-less ContentItem-rightButton Button--plain is-hide";
            }
            var question_title_element="";               
            var rich_content='<div class="RichContent '+richContent_class+'">\
                                <div class="RichContent-expand">\
                                <div class="RichContent-inner" '+RichContent_inner_attr+'><span class="RichText CopyrightRichText-richText">'+answer_content+'</span></div>\
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
            var rich_content='<div class="RichContent is-collapsed">\
                                <div class="RichContent-content" data-content-url="/question/'+question_id+'/?ans='+answer_id+'">\
                                    <div class="RichContent-cover">\
                                        <div class="RichContent-cover-inner" data-index-img-url="'+index_img_url+'"></div>\
                                        <div class="RichContent-cover-play is-hide"><svg viewBox="0 0 64 64" class="Icon Icon--play" width="50" height="50" aria-hidden="true" style="height: 50px; width: 50px;"><title></title><g><path fill-opacity="0.9" fill="#fff" d="M32,64 C14.326888,64 0,49.673112 0,32 C0,14.326888 14.326888,0 32,0 C49.673112,0 64,14.326888 64,32 C64,49.673112 49.673112,64 32,64 Z M32.2363929,61.6 C48.5840215,61.6 61.8363929,48.3476286 61.8363929,32 C61.8363929,15.6523714 48.5840215,2.4 32.2363929,2.4 C15.8887643,2.4 2.63639293,15.6523714 2.63639293,32 C2.63639293,48.3476286 15.8887643,61.6 32.2363929,61.6 Z"></path>   <circle fill-opacity="0.3" fill="#000" cx="32" cy="32" r="29.6"></circle>   <path fill-opacity="0.9" fill="#fff" d="M43.5634409,30.7271505 C44.6882014,31.4301259 44.6868607,32.5707121 43.5634409,33.2728495 L28.4365591,42.7271505 C27.3117986,43.4301259 26.4,42.9221451 26.4,41.5999847 L26.4,22.4000153 C26.4,21.0745235 27.3131393,20.5707121 28.4365591,21.2728495 L43.5634409,30.7271505 Z"></path></g></svg></div>\
                                    </div>\
                                    <div class="RichContent-inner"><span class="RichText CopyrightRichText-richText">'+removeImg(answer_content)+'</span></div>\
                                </div>\
                                <div class="ContentItem-actions">\
                                    <span><button class="AnswerLike Button LikeButton 1ContentItem-action" type="button" data-answer-id="'+answer_id+'"><svg viewBox="0 0 20 18" xmlns="http://www.w3.org/2000/svg" class="Icon 1Icon--like" style="height:16px;width:13px;" width="13" height="16" aria-hidden="true"><title></title><g><path d="M.718 7.024c-.718 0-.718.63-.718.63l.996 9.693c0 .703.718.65.718.65h1.45c.916 0 .847-.65.847-.65V7.793c-.09-.88-.853-.79-.846-.79l-2.446.02zm11.727-.05S13.2 5.396 13.6 2.89C13.765.03 11.55-.6 10.565.53c-1.014 1.232 0 2.056-4.45 5.83C5.336 6.965 5 8.01 5 8.997v6.998c-.016 1.104.49 2 1.99 2h7.586c2.097 0 2.86-1.416 2.86-1.416s2.178-5.402 2.346-5.91c1.047-3.516-1.95-3.704-1.95-3.704l-5.387.007z"></path></g></svg>'+answer_like_nums+'</button></span>\
                                    <button class="Button ContentItem-action Button--plain Button--withIcon Button--withLabel" type="button"><span style="display: inline-flex; align-items: center;">&#8203;<svg class="Zi Zi--Comment Button-zi" fill="currentColor" viewBox="0 0 24 24" width="1.2em" height="1.2em"><path d="M10.241 19.313a.97.97 0 0 0-.77.2 7.908 7.908 0 0 1-3.772 1.482.409.409 0 0 1-.38-.637 5.825 5.825 0 0 0 1.11-2.237.605.605 0 0 0-.227-.59A7.935 7.935 0 0 1 3 11.25C3 6.7 7.03 3 12 3s9 3.7 9 8.25-4.373 9.108-10.759 8.063z" fill-rule="evenodd"></path></svg></span>696 条评论</button>\
                                    <div class="Popover ShareMenu ContentItem-action">\
                                        <div class="" aria-haspopup="true" aria-expanded="false">\
                                            <img class="ShareMenu-fakeQRCode" src="" alt="微信二维码">\
                                            <button class="Button Button--plain Button--withIcon Button--withLabel" type="button"><span style="display: inline-flex; align-items: center;">&#8203;<svg class="Zi Zi--Share Button-zi" fill="currentColor" viewBox="0 0 24 24" width="1.2em" height="1.2em"><path d="M2.931 7.89c-1.067.24-1.275 1.669-.318 2.207l5.277 2.908 8.168-4.776c.25-.127.477.198.273.39L9.05 14.66l.927 5.953c.18 1.084 1.593 1.376 2.182.456l9.644-15.242c.584-.892-.212-2.029-1.234-1.796L2.93 7.89z" fill-rule="evenodd"></path></svg></span>分享</button>\
                                        </div>\
                                    </div>\
                                </div>\
                            </div>';
        }
        
        var appendElement='<div class="List-item">\
        <div class="ContentItem AnswerItem">\
        '+question_title_element+'\
        <div class="ContentItem-meta">\
        <div class="AnswerItem-meta AnswerItem-meta--related">\
        <div class="AuthorInfo">\
        <span class="UserLink AuthorInfo-avatarWrapper"><a class="UserLink-link PeoplePopover" href="/er/'+author_id+'"  data-author-id="'+author_id+'" data-toggle="popover" data-placement="right" data-trigger="manual" data-content="null" data-html="true"><img class="Avatar AuthorInfo-avatar" width="40" height="40" src="'+author_avatar+'" srcset="'+author_avatar+'" alt="'+author_name+'"></a></span>\
        <div class="AuthorInfo-content">\
        <div class="AuthorInfo-head"><span class="UserLink AuthorInfo-name"><a class="UserLink-link" href="/er/'+author_id+'">'+author_name+'</a></span></div>\
        <div class="AuthorInfo-detail"><div class="AuthorInfo-badge"><div class="RichText AuthorInfo-badgeText">'+author_mood+'</div></div></div>\
        </div>\
        </div>\
        <div class="AnswerItem-extraInfo"><span class="Voters"><button class="Button Button--plain" type="button">'+answer_like_nums+' 人赞同了该回答</button></span></div>\
        </div>\
        </div>\
        '+rich_content+'\
        </div>\
        </div>\
        ';
        
        if("prepend"==direction)
            $("#appendArea").prepend(appendElement);
        else
            $("#appendArea").append(appendElement);
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
        var appendElement='<div class="QuestionFrame Card">\
                        <div class="Feed">\
                                '+topic_element+'\
                                <div class="AuthorInfo Feed-meta-author AuthorInfo--plain">\
                                    <span class="UserLink AuthorInfo-avatarWrapper"><a class="UserLink-link PeoplePopover" href="/er/'+author_id+'/" data-author-id="'+author_id+'" data-toggle="popover" data-placement="right" data-trigger="manual" data-content="null" data-html="true"><img src="'+author_avatar+'" width="40" height="40"></a></span>\
                                    <div class="AuthorInfo-content">\
                                        <div class="AuthorInfo-head"><span class="UserLink AuthorInfo-name"><a href="/er/'+author_id+'/" class="UserLink-link 1PeoplePopover" data-author-id="'+author_id+'" data-toggle="popover" data-placement="right" data-trigger="manual" data-content="null" data-html="true">'+author_name+'</a></span></div>\
                                        <div class="AuthorInfo-detail"><div class="AuthorInfo-badge"><div class="RichText AuthorInfo-badgeText">'+author_mood+'</div></div></div>\
                                    </div>\
                                </div>\
                                <div class="ContentItem AnswerItem">\
                                    '+question_element+'\
                                    <div class="RichContent is-collapsed">\
                                        <div class="RichContent-content" data-content-url="/question/'+question_id+'/?ans='+answer_id+'">\
                                            <div class="RichContent-cover"><div class="RichContent-cover-inner" data-index-img-url="'+index_img_url+'"></div></div>\
                                            <div class="RichContent-inner"><span class="RichText CopyrightRichText-richText">'+removeImg(answer_content)+'</span></div>\
                                        </div>\
                                        <div class="ContentItem-actions"><span><button class="AnswerLike Button LikeButton ContentItem-action" type="button" data-answer-id="'+answer_id+'"><svg viewBox="0 0 20 18" xmlns="http://www.w3.org/2000/svg" class="Icon 1Icon--like" style="height:16px;width:13px;" width="13" height="16" aria-hidden="true"><title></title><g><path d="M.718 7.024c-.718 0-.718.63-.718.63l.996 9.693c0 .703.718.65.718.65h1.45c.916 0 .847-.65.847-.65V7.793c-.09-.88-.853-.79-.846-.79l-2.446.02zm11.727-.05S13.2 5.396 13.6 2.89C13.765.03 11.55-.6 10.565.53c-1.014 1.232 0 2.056-4.45 5.83C5.336 6.965 5 8.01 5 8.997v6.998c-.016 1.104.49 2 1.99 2h7.586c2.097 0 2.86-1.416 2.86-1.416s2.178-5.402 2.346-5.91c1.047-3.516-1.95-3.704-1.95-3.704l-5.387.007z"></path></g></svg>'+answer_like_nums+'</button></span></div>\
                                    </div>\
                                </div>\
                        </div>\
                    </div>';
        if("prepend"==direction)
            $("#appendArea").prepend(appendElement);
        else
            $("#appendArea").append(appendElement);
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
        });
    });
}

function checkContentExpand(){
    $(".RichContent-expand").off("click");
    $(".RichContent-expand").each(function(){
        $(this).click(function(){
            $(this).children(".ContentItem-more").addClass("is-hide");
            $(this).siblings(".ContentItem-actions").children(".ContentItem-less").removeClass("is-hide");
            $(this).parent().removeClass("is-collapsed");
            $(this).children(".RichContent-inner").css("max-height","");
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
function checkSearch(e)
{
    $("#SearchPopover").on("input",function(){
        var keyword=$(this).val();
        keyword=keyword.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g,"");
        if (keyword!="")
        {
            console.log(keyword);
            var type="all";
            var order=1;
            var start=0;
            var end=5;
            $.post('/ajax/search/'+type+'/'+order+'/'+start+'/'+end+'/',{keyword:keyword},function(ret)
            {
                console.log(ret);
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

function checkPopoverShow(){
   
    $('.PeoplePopover').off("mouseenter mouseleave");
    $('.PeoplePopover').on("mouseenter mouseleave",function(event){
        if(event.type=="mouseenter")
        {
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
            $("#id_avatar_input").on("change",function(){
               $("#upAvatarModal").modal('show');
                var objUrl = getObjectURL(this.files[0]);
                if (objUrl) { 
                    $("#preview_avatar").attr("src", objUrl);
                    $("#adjust_choosebox").val(50);                    
                    
                    setTimeout(adjustChooseBox,1*1000);
                }
            });
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
    checkPopoverShow();
    checkAnswerLike();
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

$(document).ready(function() {
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