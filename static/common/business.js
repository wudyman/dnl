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
            $("#districts").empty().append('<a class="select select-district" href="javascript:;" data-addr-value="0">全市</a>');
            if("0"!=city_value)
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
            $("#citys").empty().append('<a class="select select-city" href="javascript:;" data-addr-value="0">全省</a>');
            $("#districts").empty().append('<a class="select select-district" href="javascript:;" data-addr-value="0">全市</a>');
            if("0"!=province_value)
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

function appendBusinessElement()
{
    provinces=getProvinces();
    provinces_map={};
    citys_map={};
    districts_map={};
    province_value=city_value=district_value="0";
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