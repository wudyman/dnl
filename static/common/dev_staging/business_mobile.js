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
function initBusinessElement()
{
    var pictures=$("#business-pictures").attr("data-pictures");
    if(""!=pictures)
    {
        pictures_array=pictures.split(";");
        //console.log(pictures_array);
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
        var businessInfo_update_date=ret[i][8];
        
        if(businessInfo_pictures)
            var picture=businessInfo_pictures.split(";")[0];
        else
            var picture="/static/common/img/business_no_picture.jpg";
        
        var data='<div class="1List-item" style="position: relative;">\
        <div class="ContentItem">\
        <div class="ContentItem-left" style="width:100px;padding:10px 15px;float:left;"><a href="/business/'+businessInfo_id+'/" target="_blank"><img class="" style="width:100px;height:75px;" src="'+picture+'" alt=""></a></div>\
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
    $("#appendArea").empty();
    g_last_getmoredata_index=0;
    getMoreData();
}
function checkBusinessesKeyword()
{
    $("#businessSearchButton").click(function(){
        var keyword=$("#businessSearchInput").val();
        business_keyword=keyword.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g,"");
        console.log(keyword);
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
}
/**********business-post module***********/
function initBusinessPostProvinces()
{
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
}

function initBusinessPostElement()
{
    initBusinessPostProvinces();
    checkBusinessPost();
}
function appendBusinessPostPicture(url)
{
    console.log(url);
    var img='<div class="BusinessPicture" style="float:left"><img style="padding:5px;width:72px;height:48px;" src="'+url+'" alt=""><div style="padding-left:30px;font-size:14px;color:red;"><button class="business-picture-delete" type="button">删除</button></div</span>';
    $("#business-pictures").append(img);
    
    $(".business-picture-delete").off("click");
    $(".business-picture-delete").on("click",function(){
        $(this).parents(".BusinessPicture").remove();
    });
}

function checkBusinessPost()
{
    var title="";
    var detail="";
    var type="";
    var contact="";
    var pictures=""; 
    var town="";
    
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
        if((""!=title)&&(""!=contact)&&("000000"!=province_value))
        {
            $(".BusinessPost").removeAttr("disabled");
        }
        else
        {
            $(".BusinessPost").attr("disabled","");
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
        $("#business-picture-input").click();
    });
    $("#business-picture-input").on("change",function(){
        scaleAndUploadImage("forBusiness",this.files[0],720);
    });
    $(".BusinessPost").click(function(){
        type=$("input[name='type']").val();
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
}
