var _Travel = {
    city: "山西",
    provice: "北京市|天津市|上海市|重庆市|河北|河南|云南|辽宁|黑龙江|湖南|安徽|山东|新疆|江苏|浙江|江西|湖北|广西|甘肃|山西|内蒙|陕西|吉林|福建|贵州|广东|青海|西藏|四川|宁夏|海南|台湾|香港|澳门",
    Init: function () {
        $(".swiper-container").swiper({
            loop: true,
            autoplay: 3000
        });
        $("form").submit(function () {
            _Travel.toSelect();
            return false;
        });
        _Travel.initProvice();
    },
    toSelect: function () {       
        var key = $("#searchInput").val();
        if (key.length > 0) {
            _Travel.city = key;
            $("#div_provice").find("span").text(key);
            $("#div_provice").show();
            $(".sign-list").hide();
            _Travel.InitInfo();
        }
    },
    initProvice: function () {
        var arr = _Travel.provice.split('|');
        $(".sign-list").html("");
        for (var i = 0; i < arr.length; i++) {
            $(".sign-list").append("<li><span>" + arr[i] + "</span></li>");
        }
        $(".sign-list").find("li").click(function () {
            var city = $(this).find("span").text();
            _Travel.city = city;
            $("#div_provice").find("span").text(city);
            $("#div_provice").show();
            $(".sign-list").hide();
            $("#div_provice").find(".weui-flex__item").eq(1).click(function () {
                $("#div_provice").hide();
                $(".sign-list").show();
                $(".card-list").hide();
            });
            _Travel.InitInfo();
        });
    },
    InitInfo: function () {
        var template = $("#template").html();
        $(".card-list").show();
        $(".sign-list").hide();
        $(".card-list").html("");
        $.showLoading();
        $.ajax(
        {
            url: "/service/travelHandler.ashx",
            context: document.body,
            dataType: "json",
            cache: false,
            data: { fn: 10, city: _Travel.city, t: new Date() },
            success: function (o) {
                $.hideLoading();
                if (o.errorCode == 231000) {
                    var info = o.data;
                    if (info != null) {
                        var obj = info.rows;
                        for (var i = 0; i < obj.length; i++) {
                            var oi = obj[i];
                            tempHtml = template.replace("{scenicName}", oi.scenicName);
                            tempHtml = tempHtml.replace("{salePrice}", oi.salePrice);
                            tempHtml = tempHtml.replace("{bizTime}", "开放时间："+oi.bizTime);
                            if (oi.address != null && oi.address.length == 0) {
                                tempHtml = tempHtml.replace("{address}", "&nbsp;");
                            }
                            else {
                                tempHtml = tempHtml.replace("{address}", oi.address);
                            }
                            tempHtml = tempHtml.replace(/{scenicId}/g, oi.scenicId);
                            if (!isNaN(oi.salePrice)) {
                                $(".card-list").append(tempHtml);
                            }
                        }
                        $(".weui-btn_primary").click(function () {
                            var scenicId = $(this).attr("data-id");
                            window.location = "c_travel_scenci.html?scenicId=" + scenicId;
                        });
                    }
                }
            }
        }
        );
    }
}


_Travel.Init();
