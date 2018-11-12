/*************business common*******************/
function checkAddr(town)
{
    if("000000"==province_value)
    {
        addr_value="000000";
        addr="";
    }
    else if("000000"==city_value)
    {
        addr_value=province_value;
        addr=provinces[provinces_map[province_value]].label;
    }
    else if("000000"==district_value)
    {
        addr_value=province_value+city_value;
        addr=provinces[provinces_map[province_value]].label+citys[citys_map[city_value]].label;
    }
    else
    {
        addr_value=province_value+city_value+district_value;
        addr=provinces[provinces_map[province_value]].label+citys[citys_map[city_value]].label+districts[districts_map[district_value]].label;
        if(""!=town)
            addr+=town;
    }
}
/*************business module*******************/
function checkReviseAndUpdate(){
    $("#update_button").click(function(){
        var business_id=$("#revise_update").attr("data-business-id");
        var url="/ajax/update_business/time/";
        var post_data={'business_id':business_id};
        $.post(url,post_data,function(ret){
            if("fail"!=ret)
            {
                $("#update_button").attr("disabled","true").text("已更新");
                $("#update_time").text(getDateDiff(ret));
            }
        });
    });
    $("#revise_button").click(function(){
        var business_id=$("#revise_update").attr("data-business-id");
        location.href="/business/revise/"+business_id+"/";
    });
}
function initBusinessElement()
{
    var pictures=$("#business-pictures").attr("data-pictures");
    if(""!=pictures)
    {
        pictures_array=pictures.split(";");
        for (var i in pictures_array)
        {
            var picture=pictures_array[i];
            if(picture)
            {
                var img='<img src="'+picture+'" class="origin_image">';
                $("#business-pictures").append(img);
            }
        }
    }
    
    var time=$("#pub_time").text();
    $("#pub_time").text(getDateDiff(time))
    time=$("#update_time").text();
    $("#update_time").text(getDateDiff(time));
    
    checkReviseAndUpdate();
}
/**********businesses module***********/
function appendBusinessesElement(ret)
{
    for (var i in ret)
    {
        var businessInfo_id=ret[i][0];
        var businessInfo_title=ret[i][1];
        var businessInfo_detail=ret[i][2];
        var businessInfo_type=ret[i][3];
        var businessInfo_addr=ret[i][4];
        var businessInfo_addr_value=ret[i][5];
        var businessInfo_contact=ret[i][6];
        var businessInfo_pictures=ret[i][7];
        var businessInfo_pub_date=ret[i][8];
        var businessInfo_update_date=ret[i][9];
        
        if(businessInfo_pictures)
            var picture=businessInfo_pictures.split(";")[0];
        else
            var picture="/static/common/img/business_no_picture.jpg";
        
        var data='<div class="1List-item" style="position: relative;clear:both;">\
        <div class="ContentItem">\
        <div class="ContentItem-left" style="width:100px;padding:10px 10px;float:left;""><a href="/business/'+businessInfo_id+'/" target="_blank"><img class="" style="width:100px;height:75px;" src="'+picture+'" alt=""></a></div>\
        <div class="ContentItem-ritht" style="padding:10px 10px 15px 10px;">\
        <div style="font-size:14px;color:#25d;padding:5px;"><a href="/business/'+businessInfo_id+'/" target="_blank">'+businessInfo_title+'</a></div>\
        <div style="font-size:12px;color:#666;overflow: hidden;white-space: nowrap;">'+businessInfo_detail+'</div>\
        <div class="ContentItem-status">\
        <span class="ContentItem-statusItem" style="font-size:12px;">'+businessInfo_addr+'</span>\
        <span class="ContentItem-statusItem" style="font-size:12px;">'+getDateDiff(businessInfo_update_date)+'</span>\
        </div>\
        </div>\
        </div>\
        </div>';
        $("#appendArea").append(data);
    }
}
function checkSelectDistrict()
{
    $(".select-district").off("click");
    $(".select-district").each(function(){
        $(this).click(function(){
            $(".select.select-district").removeClass("select");
            $(this).addClass("select");
            district_value=$(this).attr("data-addr-value");
            checkAddrGetBusinessData();
        });
    });
}
function checkSelectCity()
{
    $(".select-city").off("click");
    $(".select-city").each(function(){
        $(this).click(function(){
            $(".select.select-city").removeClass("select");
            $(this).addClass("select");
            city_value=$(this).attr("data-addr-value");
            district_value="000000";
            $("#districts").empty().append('<a class="select select-district" href="javascript:;" data-addr-value="000000">全部</a>');
            if("000000"!=city_value)
            {
                districts=citys[citys_map[city_value]].children;
                for (i in districts)
                {
                    var district=districts[i];
                    var value=district.value;
                    var name=district.label;
                    var district_element='<a class="select-district" href="javascript:;" data-addr-value='+value+'>'+name+'</a>';
                    $("#districts").append(district_element);
                    districts_map[value]=i;
                }
                checkSelectDistrict();              
            }
            checkAddrGetBusinessData();
        });
    });
}
function checkSelectProvince()
{
    $(".select-province").off("click");
    $(".select-province").each(function(){
        $(this).click(function(){
            $(".select.select-province").removeClass("select");
            $(this).addClass("select");
            province_value=$(this).attr("data-addr-value");
            city_value=district_value="000000";
            $("#citys").empty().append('<a class="select select-city" href="javascript:;" data-addr-value="000000">全部</a>');
            $("#districts").empty().append('<a class="select select-district" href="javascript:;" data-addr-value="000000">全部</a>');
            if("000000"!=province_value)
            {                
                citys=provinces[provinces_map[province_value]].children;
                for (i in citys)
                {
                    var city=citys[i];
                    var value=city.value;
                    var name=city.label;
                    var city_element='<a class="select-city" href="javascript:;" data-addr-value='+value+'>'+name+'</a>';
                    $("#citys").append(city_element);
                    citys_map[value]=i;
                }
                checkSelectCity();              
            }
            checkAddrGetBusinessData();
        });
    });
}
function checkAddrGetBusinessData()
{
    checkAddr("");
    delCookie("a_v");
    setCookie("a_v",addr_value,30*24*60*60);
    $("#appendArea").empty();
    g_last_getmoredata_index=0;
    getMoreData();
}
function checkBusinessesKeyword()
{
    $("#businessSearchButton").click(function(){
        var keyword=$("#businessSearchInput").val();
        business_keyword=keyword.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g,"");
        $("#appendArea").empty();
        g_last_getmoredata_index=0;
        getMoreData();
    });
}
function checkBusinessesTypeTab()
{
    $(".Businesses-tabs .Tabs-link").off("click");
    $(".Businesses-tabs .Tabs-link").on("click",function(){
        $(".Businesses-tabs .Tabs-link").removeClass("is-active");
        $(this).addClass("is-active");
        g_business_type=$(this).attr("data-business-type");
        $("#appendArea").empty();
        g_last_getmoredata_index=0;
        getMoreData();
    });  
}
function initBusinessesElement()
{
    provinces=getProvinces();
    provinces_map={};
    citys_map={};
    districts_map={};
    province_value=city_value=district_value="000000";
    addr="";
    addr_value="000000";
    business_keyword="";

    for (i in provinces)
    {
        var province=provinces[i];
        var value=province.value;
        var name=province.label;
        var province_element='<a class="select-province" href="javascript:;" data-addr-value='+value+'>'+name+'</a>';
        $("#provinces").append(province_element);        
        provinces_map[value]=i;    
    }  
    checkSelectProvince();
    checkBusinessesTypeTab();
    checkBusinessesKeyword();
    
    var temp=getCookie("a_v");
    if(temp)
    {
        addr_value=temp;
        province_value=addr_value.substr(0,6);
        city_value=addr_value.substr(6,6);
        district_value=addr_value.substr(12,6);   
        if(!province_value)
            province_value="000000";
        if(!city_value)
            city_value="000000";
        if(!district_value)
            district_value="000000";
        
        if('000000'!=province_value){
            $(".select.select-province").removeClass("select");
            $(".select-province").each(function(){
                if($(this).attr("data-addr-value")==province_value){
                    $(this).addClass("select");
                    citys=provinces[provinces_map[province_value]].children;
                    for (i in citys)
                    {
                        var city=citys[i];
                        var value=city.value;
                        var name=city.label;
                        var city_element='<a class="select-city" href="javascript:;" data-addr-value='+value+'>'+name+'</a>';
                        $("#citys").append(city_element);
                        citys_map[value]=i;
                    }
}
            });
            checkSelectCity(); 
        }
        
        if('000000'!=city_value){
            $(".select.select-city").removeClass("select");
            $(".select-city").each(function(){
                if($(this).attr("data-addr-value")==city_value){
                    $(this).addClass("select");
                    districts=citys[citys_map[city_value]].children;
                    for (i in districts)
{
                        var district=districts[i];
                        var value=district.value;
                        var name=district.label;
                        var district_element='<a class="select-district" href="javascript:;" data-addr-value='+value+'>'+name+'</a>';
                        $("#districts").append(district_element);
                        districts_map[value]=i;
                    }
                }
            });
            checkSelectDistrict();
        }
    
        if('000000'!=district_value){
            $(".select.select-district").removeClass("select");
            $(".select-district").each(function(){
                if($(this).attr("data-addr-value")==district_value){
                    $(this).addClass("select");
                }
            });
        }
    
        checkAddrGetBusinessData();       
    
    }
}
/**********business-post module***********/
function initAddrElement()
{
    province_value=addr_value.substr(0,6);
    city_value=addr_value.substr(6,6);
    district_value=addr_value.substr(12,6);   
    if(!province_value)
        province_value="000000";
    if(!city_value)
        city_value="000000";
    if(!district_value)
        district_value="000000";
    
    if(province_value!="000000")
    {
        $("#province_select option").each(function(){
            if($(this).attr("value")==province_value)
                $(this).attr("selected",true);
        });
        citys=provinces[provinces_map[province_value]].children;
        for (i in citys)
        {
            var city=citys[i];
            var value=city.value;
            var name=city.label;
            var city_element='<option value="'+value+'">'+name+'</option>';
            $("#city_select").append(city_element);
            citys_map[value]=i;
        }
        if(city_value!="000000")
        {
            $("#city_select option").each(function(){
                if($(this).attr("value")==city_value)
                    $(this).attr("selected",true);
            });
            districts=citys[citys_map[city_value]].children;           
            for (i in districts)
            {
                var district=districts[i];
                var value=district.value;
                var name=district.label;
                var district_element='<option value="'+value+'">'+name+'</option>';
                $("#district_select").append(district_element);
                districts_map[value]=i;
            }
            if(district_value!="000000")
            {
                $("#district_select option").each(function(){
                    if($(this).attr("value")==district_value)
                        $(this).attr("selected",true);
                });
                $("#town input").removeAttr("disabled");
                addr_temp=provinces[provinces_map[province_value]].label+citys[citys_map[city_value]].label+districts[districts_map[district_value]].label;
                if(addr_temp!=addr)
                {
                    town=addr.substring(addr_temp.length,addr.length);
                    $("#town input").val(town);
                }
            }
        }
    }
}
function initBusinessPostRevise()
{
    $(".BusinessPostHeader-title").text("修改信息");
    $(".BusinessPostRevise").text("修改信息");
    
    var str_business_data=$(".BusinessPost-content").attr("data-business");
	var business_data=JSON.parse(str_business_data);
    id=business_data.id;
    title=business_data.title;
    detail=business_data.detail;
	type=business_data.type;
    addr=business_data.addr;
    addr_value=business_data.addr_value;
    contact=business_data.contact;
    pictures=business_data.pictures;
    
    $("textarea[name='title']").val(title);
    $("textarea[name='detail']").val(detail);
    $("textarea[name='contact']").val(contact);
    $("#type option").each(function(){
        if($(this).attr("value")==type)
            $(this).attr("selected",true);
    });
    
    initAddrElement();
    
    if(pictures)
    {
        pictures_array=pictures.split(";");
        for (var i in pictures_array)
        {
            var picture=pictures_array[i];
            if(picture)
            {
                var img='<div class="BusinessPicture" style="float:left"><img style="padding:5px;width:72px;height:48px;" src="'+picture+'" alt=""><div style="padding-left:30px;font-size:14px;color:red;"><button class="business-picture-delete" type="button">删除</button></div</span>';
                $("#business-pictures").append(img);
            }
        }
        $(".business-picture-delete").off("click");
        $(".business-picture-delete").on("click",function(){
            $(this).parents(".BusinessPicture").remove();
        });
    }

}

function initBusinessPostElement()
{
    title="";
    detail="";
    type="";
    contact="";
    pictures="";
    town="";
    
    provinces=getProvinces();
    provinces_map={};
    citys_map={};
    districts_map={};
    province_value=city_value=district_value="000000";
    addr="";
    addr_value="000000";

    for (i in provinces)
    {
        var province=provinces[i];
        var value=province.value;
        var name=province.label;
        var province_element='<option value="'+value+'">'+name+'</option>';
        $("#province_select").append(province_element);        
        provinces_map[value]=i;    
    }  

    if("true"==$(".BusinessPost-content").attr("data-revise")){
        initBusinessPostRevise();
    }
    
    var temp=getCookie("a_v");
    if(temp){
        addr_value=temp;
        initAddrElement();
    }
    checkBusinessPost();
}
function appendBusinessPostPicture(url)
{
    var img='<div class="BusinessPicture" style="float:left"><img style="padding:5px;width:72px;height:48px;" src="'+url+'" alt=""><div style="padding-left:30px;font-size:14px;color:red;"><button class="business-picture-delete" type="button">删除</button></div</span>';
    $("#business-pictures").append(img);
    
    $(".business-picture-delete").off("click");
    $(".business-picture-delete").on("click",function(){
        $(this).parents(".BusinessPicture").remove();
    });
}

function checkBusinessPost()
{
    function checkAddrSelectChange()
    {
        $("#province_select").on("change",function(){
            $("#town input").attr("disabled","true").val("");
            province_value = $("#province_select option:selected").attr("value");
            checkBusinessPostValid();
            city_value=district_value="000000";
            $("#city_select").empty().append('<option value="000000">请选择城市（全部）</option>');
            $("#district_select").empty().append('<option value="000000">请选择地区（全部）</option>');
            if("000000"==province_value)
                return;
            citys=provinces[provinces_map[province_value]].children;
            
            for (i in citys)
            {
                var city=citys[i];
                var value=city.value;
                var name=city.label;
                var city_element='<option value="'+value+'">'+name+'</option>';
                $("#city_select").append(city_element);
                citys_map[value]=i;
            }
            
        });
        $("#city_select").on("change",function(){
            $("#town input").attr("disabled","true").val("");
            city_value = $("#city_select option:selected").attr("value");
            district_value="000000";
            $("#district_select").empty().append('<option value="000000">请选择城市（全部）</option>');
            if("000000"==city_value)
                return;
            districts=citys[citys_map[city_value]].children;
            
            for (i in districts)
            {
                var district=districts[i];
                var value=district.value;
                var name=district.label;
                var district_element='<option value="'+value+'">'+name+'</option>';
                $("#district_select").append(district_element);
                districts_map[value]=i;
            }
        });
        $("#district_select").on("change",function(){
            $("#town input").attr("disabled","true").val("");
            district_value = $("#district_select option:selected").attr("value");
            if("000000"!=district_value)
                $("#town input").removeAttr("disabled");
        });
    }     
    
    function checkBusinessPostValid()
    {
        if((""!=title)&&(""!=detail)&&(""!=contact)&&("000000"!=province_value))
        {
            $(".BusinessPostRevise").removeAttr("disabled");
        }
        else
        {
            $(".BusinessPostRevise").attr("disabled","");
        }
    }
    function checkBusinessPostTitle()
    {
        $(".BusinessPost-title textarea").on("input",function(){
            
            title=$("textarea[name='title']").val();
            checkBusinessPostValid();
        });
    }

    function checkBusinessPostDetail()
    {
        $(".BusinessPost-detail textarea").on("input",function(){
            detail=$("textarea[name='detail']").val();
            checkBusinessPostValid();
        });
    }
    function checkBusinessPostContact()
    {
        $(".BusinessPost-contact textarea").on("input",function(){
            contact=$("textarea[name='contact']").val();
            checkBusinessPostValid();
        });
    }

    $("#business-picture-select").click(function(){
        if($(".BusinessPicture").length>=8)
            alert("超出图片上传个数限制，不超过8张！");
        else
        $("#business-picture-input").click();
    });
    $("#business-picture-input").on("change",function(){
        scaleAndUploadImage("forBusiness",this.files[0],720);
    });
    $(".BusinessPostRevise").click(function(){
        type=$("#type option:selected").attr("value");
        $("input[name='type']").val(type);
        if(title.length>LITTLE_TEXT_MAX_LENGTH)
        {
            title=title.substr(0,LITTLE_TEXT_MAX_LENGTH-1);
            $("textarea[name='title']").val(title);
        }
        if(detail.length>MIDDLE_TEXT_MAX_LENGTH)
        {
            detail=detail.substr(0,MIDDLE_TEXT_MAX_LENGTH-1);
            $("textarea[name='detail']").val(detail);
        }
        town=$("input[name='town']").val();
        checkAddr(town);
        pictures=""
        $(".BusinessPicture img").each(function(){
                pictures+=$(this).attr("src")+";";
        });
        $("input[name='addr']").val(addr);
        $("input[name='addr_value']").val(addr_value);
        $("input[name='pictures']").val(pictures);
        $(this).closest("form").submit();
    });
    checkAddrSelectChange();
    checkBusinessPostTitle();
    checkBusinessPostDetail();
    checkBusinessPostContact();
    checkBusinessPostValid();
}
