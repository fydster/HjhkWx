var _Nav = {
    isOpenInfo: 0,
    id: 0,
    type: 5,
    Init: function () {
        _Nav.initLayot();
        _Nav.getOrder();
        _C.initWx();
        wx.ready(function () {
            //alert("1");
            wx.onMenuShareTimeline({
                title: '山西出行，你选择我，我服务您！', // 分享标题
                link: 'http://hjhk.edmp.cc/c_loading.html?i=7', // 分享链接
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
                link: 'http://hjhk.edmp.cc/c_loading.html?i=7', // 分享链接
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
    initLayot: function () {
        $("#div_addSet").click(function () {
            window.location = "c_index_home.html";
        });
        $("#btn_back").click(function () {
            window.location = "c_index_home.html";
        });
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
                    data: { fn: 214,t: new Date() },
                    success: function (o) {
                        $.hideLoading();
                        var tempHtml = "";
                        obj.html("");
                        if (o != null && o.List.length > 0) {
                            for (var i = 0; i < o.List.length; i++) {
                                var oi = o.List[i];
                                if (oi.sysUrl.length > 0) {
                                    tempHtml = template.replace("{sCity}", oi.sName);
                                    tempHtml = tempHtml.replace("{tCity}", oi.sCity);
                                    tempHtml = tempHtml.replace("{url}", oi.sysUrl);
                                    tempHtml = tempHtml.replace("{btn}", oi.sName.replace("人", "").replace("省", "").replace("市", "").replace("出行", "").replace("旅行网", "") + "人点击关注");
                                    obj.append(tempHtml);
                                }
                            }
                            obj.find("li").click(function () {
                                var trip = $(this).attr("data-url");
                                window.location = trip;
                            });
                        }
                        else {
                            
                        }
                    }
                }
        );
    }
}


_Nav.Init();
