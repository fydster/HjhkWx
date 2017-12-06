var _SetList = {
    isOpenInfo: 0,
    id: 0,
    type: 5,
    Init: function () {
        _SetList.initLayot();
        _SetList.getOrder();
        _SetList.getUser();
        _C.initWx();
        $("#subscribe").click(function () {
            window.location = "http://mp.weixin.qq.com/s/ZJ-QXQkMTVQRUWEyzOdGPw";
        });
        wx.ready(function () {
            //alert("1");
            wx.onMenuShareTimeline({
                title: '山西出行特价机票，订到就是赚到！', // 分享标题
                link: 'http://hjhk.edmp.cc/c_lowPrice.html', // 分享链接
                imgUrl: 'http://hjhk.edmp.cc/img/logo.jpg', // 分享图标
                success: function () {
                    //alert("2");
                    //$("#div_img").hide();
                    //window.location = "order_one.html";
                    // 用户确认分享后执行的回调函数
                    $.ajax(
                        {
                            url: _C.ServerUrl,
                            context: document.body,
                            dataType: "json",
                            cache: false,
                            data: { fn: 209, uid: _U.uid, fType: 0, t: new Date() },
                            success: function (o) {
                                alert(o.Return);
                            }
                        }
                    );
                },
                cancel: function () {
                    //alert("3");
                    //$("#div_img").hide();
                    //$("#my-alert").modal('open');
                    // 用户取消分享后执行的回调函数
                }
            });

            wx.onMenuShareAppMessage({
                title: '山西出行特价机票，订到就是赚到！', // 分享标题
                desc: '说走就走的旅程',
                link: 'http://hjhk.edmp.cc/c_lowPrice.html', // 分享链接
                imgUrl: 'http://hjhk.edmp.cc/img/logo.jpg', // 分享图标
                success: function () {
                    //$("#div_img").hide();
                    //window.location = "order_one.html";
                    // 用户确认分享后执行的回调函数
                    $.ajax(
                        {
                            url: _C.ServerUrl,
                            context: document.body,
                            dataType: "json",
                            cache: false,
                            data: { fn: 209, uid: _U.uid, fType: 1, t: new Date() },
                            success: function (o) {
                            }
                        }
                    );
                },
                cancel: function () {
                    //$("#div_img").hide();
                    //$("#my-alert").modal('open');
                    // 用户取消分享后执行的回调函数
                }
            });
        });
    },
    initLayot: function () {
        $("#div_addSet").click(function () {
            window.location = "c_index_home.html";
        });
        $("#btn_back").click(function () {
            window.location = "c_index_home.html";
        });
    },
    getUser: function () {
        $.ajax(
                {
                    url: _C.ServerUrl,
                    context: document.body,
                    dataType: "json",
                    cache: false,
                    data: { fn: 7, openId: $.cookie("_OpenId"), t: new Date() },
                    success: function (o) {
                        if (o.Return == 0) {
                            if (o.Info != null) {
                                if (o.Info.isSubscribe == 0) {
                                    setTimeout(function () {
                                        $("#subscribe").fadeIn();
                                    }, 1000);
                                }
                            }
                        }
                    }
                }
        );
    },
    getOrder: function () {
        var template = $("#template_ul").html();
        var obj = $("#ul_order");
        $.showLoading();
        $.ajax(
                {
                    url: _C.ServerUrl,
                    context: document.body,
                    dataType: "json",
                    cache: false,
                    data: { fn: 206,t: new Date() },
                    success: function (o) {
                        $.hideLoading();
                        var tempHtml = "";
                        obj.html("");
                        if (o != null && o.length > 0) {
                            for (var i = 0; i < o.length; i++) {
                                var oi = o[i];
                                tempHtml = template.replace("{sCity}", oi.startCity);
                                tempHtml = tempHtml.replace("{tCity}", oi.toCity);
                                tempHtml = tempHtml.replace("{price}", oi.price);
                                tempHtml = tempHtml.replace("{zhekou}", parseFloat(parseInt(oi.zhekou)/10).toFixed(1) + "折");
                                tempHtml = tempHtml.replace("{fDate}", new Date(oi.fDate).pattern("M月-d日"));
                                tempHtml = tempHtml.replace("{trip}", oi.startCity + "|" + oi.toCity + "|" + oi.startCode + "|" + oi.toCode + "|" + oi.fDate);
                                obj.append(tempHtml);
                            }
                            obj.find("li").click(function () {
                                var trip = $(this).attr("data-trip");
                                if (trip.length > 0) {
                                    _SetList.ToSelectAir(trip);
                                }
                            });
                        }
                        else {
                            
                        }
                    }
                }
        );
    },
    ToSelectAir: function (trip) {
        var tArr = trip.split("|");
        var date = new Date();
        date.setTime(date.getTime() + (24 * 60 * 60 * 1000)); //12小时过期
        _F.sCity = tArr[0];
        _F.tCity = tArr[1];
        _F.Date = new Date(tArr[4]).pattern("yyyy-MM-dd");
        _F.sDate = new Date(tArr[4]).pattern("yyyy-MM-dd");
        /*
        if ($("#e-datepicker").attr("data-date").length > 0) {
            _F.tDate = new Date($("#e-datepicker").attr("data-date")).pattern("yyyy-MM-dd");
            _F.sType = 2;
        }
        */
        _F.sCode = tArr[2];
        _F.tCode = tArr[3];
        var s = JSON.stringify(_F);
        $.cookie("Trip_select", s, { path: '/', expires: date });
        window.location = "c_trip_new.html?s=1";
    }
}


_SetList.Init();
