function checkSelectDistrict()
{
    $(".select-district").off("click");
    $(".select-district").each(function(){
        $(this).click(function(){
            $(".select.select-district").removeClass("select");
            $(this).addClass("select");
            district_value=$(this).attr("data-addr-value");
            console.log(district_value);
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
        });
    });
}

function initBusinessElement()
{
    provinces=getProvinces();
    provinces_map={};
    citys_map={};
    districts_map={};
    province_value=city_value=district_value="000000";
    addr="";

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
}

function addrSelectChange(type)
{
    $("#addr_detail input").attr("disabled","true");
    $("#addr_detail input").val("");
    if("province"==type)
    {
        province_value = $("#province_select option:selected").attr("value");
        city_value=district_value="000000";
        $("#city_select").empty().append('<option value="000000">全部</option>');
        $("#district_select").empty().append('<option value="000000">全部</option>');
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
    }
    else if("city"==type)
    {
        city_value = $("#city_select option:selected").attr("value");
        district_value="000000";
        $("#district_select").empty().append('<option value="000000">全部</option>');
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
    }
    else if("district"==type)
    {
        district_value = $("#district_select option:selected").attr("value");
        if("000000"!=district_value)
            $("#addr_detail input").removeAttr("disabled");
    }
}
function initBusinessPostProvinces()
{
    provinces=getProvinces();
    provinces_map={};
    citys_map={};
    districts_map={};
    province_value=city_value=district_value="000000";
    addr="";

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

function checkBusinessPost()
{
    var title="";
    var detail="";
    var type="";
    var addr="";
    var addr_value="";
    var contact="";
    var pictures="";    
    
    function checkBusinessPostValid()
    {
        if((""!=title)&&(""!=contact))
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
    function getAddr()
    {
        if("000000"==province_value)
            temp="全国";
        else if("000000"==city_value)
            temp=provinces[provinces_map[province_value]].label+"全部";
        else if("000000"==district_value)
            temp=provinces[provinces_map[province_value]].label+citys[citys_map[city_value]].label+"全部";
        else
            temp=provinces[provinces_map[province_value]].label+citys[citys_map[city_value]].label+districts[districts_map[district_value]].label;
        return temp;
    }
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
        addr_value=province_value+city_value+district_value;
        addr=getAddr();
        $("input[name='addr']").val(addr);
        $("input[name='addr_value']").val(addr_value);
        $("input[name='pictures']").val(pictures);
        console.log(type);
        console.log(title);
        console.log(detail);
        console.log(contact);
        console.log(addr_value);
        console.log(addr);
        $(this).closest("form").submit();
    });
    checkBusinessPostTitle();
    checkBusinessPostDetail();
    checkBusinessPostContact();
}