var _Travel = {
    city: "山西",
    Init: function () {
        $(".swiper-container").swiper({
            loop: true,
            autoplay: 3000
        });
        $("form").submit(function () {
            _Travel.toSelect();
            return false;
        });
        $("#div_provice").find(".weui-flex__item").eq(1).click(function () {
            window.location = "c_travel_search.html";
        });
        _Travel.InitInfo();
        _C.initWx();

        wx.ready(function () {
            //alert("1");
            wx.onMenuShareTimeline({
                title: '山西出行，你选择我，我服务您！', // 分享标题
                link: 'http://hjhk.edmp.cc/c_loading.html?i=5', // 分享链接
                imgUrl: 'http://hjhk.edmp.cc/img/sharelogo.jpg', // 分享图标
                success: function () {
                    //alert("2");
                    //$("#div_img").hide();
                    //window.location = "order_one.html";
                    // 用户确认分享后执行的回调函数
                },
                cancel: function () {
                    //alert("3");
                    //$("#div_img").hide();
                    //$("#my-alert").modal('open');
                    // 用户取消分享后执行的回调函数
                }
            });

            wx.onMenuShareAppMessage({
                title: '山西出行，你选择我，我服务您！', // 分享标题
                desc: '',
                link: 'http://hjhk.edmp.cc/c_loading.html?i=5', // 分享链接
                imgUrl: 'http://hjhk.edmp.cc/img/sharelogo.jpg', // 分享图标
                success: function () {
                    //$("#div_img").hide();
                    //window.location = "order_one.html";
                    // 用户确认分享后执行的回调函数
                },
                cancel: function () {
                    //$("#div_img").hide();
                    //$("#my-alert").modal('open');
                    // 用户取消分享后执行的回调函数
                }
            });
        });
    },
    toSelect: function () {
        var key = $("#searchInput").val();
        if (key.length > 0) {
            _Travel.city = key;
            document.activeElement.blur();
            _Travel.InitInfo();
        }
    },
    InitInfo: function () {
        var template = $("#template").html();
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
