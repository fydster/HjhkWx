var _Home = {
    Init: function () {
        _Home.initLayot();
        _Home.InitWxInfo();
        _C.initWx();
        wx.ready(function () {
            //alert("1");
            wx.onMenuShareTimeline({
                title: '山西出行，你选择我，我服务您！', // 分享标题
                link: 'http://hjhk.edmp.cc/c_home.html', // 分享链接
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
                link: 'http://hjhk.edmp.cc/c_home.html', // 分享链接
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
    InitWxInfo: function () {
        if (_B.source.length == 0) {
            var bCookie = $.cookie("_BasicForUrl");
            _B = JSON.parse(bCookie);
        }
        if (_B.source.length == 0) {
            return;
        }
        $.ajax(
        {
            url: _C.ServerUrl,
            context: document.body,
            dataType: "json",
            cache: false,
            data: { fn: 6, sourceStr: _B.source, t: new Date() },
            success: function (o) {
                if (o.Return == 0) {
                    if (o.Info != null) {
                        $("title").text(o.Info.sName);
                    }
                }

            }
        }
        );
    },
    initLayot: function () {

        $(".swiper-container").swiper({
            loop: true,
            autoplay: 3000
        });

        var h = window.screen.height;

        var midMenu = $(".midMenu").find("li");
        midMenu.eq(0).click(function () {
            window.location = "c_index_home.html?selectType=1";
        });
        midMenu.eq(1).click(function () {
            window.location = "c_index_gj.html";
        });
        midMenu.eq(2).click(function () {
            window.location = "c_index_home.html?selectType=0";
        });
        midMenu.eq(3).click(function () {
            window.location = "app/hotel/index.aspx";
        });
        midMenu.eq(4).click(function () {
            window.location = "c_set_list.html";
        });
        midMenu.eq(6).click(function () {
            window.location = "travel/c_travel_city.html?name=%u5C71%u897F&id=36";
        });
        midMenu.eq(5).click(function () {
            window.location = "c_travel_home.html";
        });
        midMenu.eq(7).click(function () {
            window.location = "c_nav.html";
        });
    }
}
