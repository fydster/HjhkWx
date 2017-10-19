var _Fly = {
    Init: function () {
        _Fly.AddHB();
        _C.initWx();

        wx.ready(function () {
            //alert("1");
            wx.onMenuShareTimeline({
                title: '宇文山庄门票免费领啦！', // 分享标题
                link: 'http://hjhk.edmp.cc/active/student/c_init.html', // 分享链接
                imgUrl: 'http://hjhk.edmp.cc/img/logo.jpg', // 分享图标
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
                title: '宇文山庄门票免费领啦！', // 分享标题
                desc: '',
                link: 'http://hjhk.edmp.cc/active/student/c_init.html', // 分享链接
                imgUrl: 'http://hjhk.edmp.cc/img/logo.jpg', // 分享图标
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
    AddHB: function () {
        $.ajax(
        {
            url: _C.ServerUrl,
            context: document.body,
            dataType: "json",
            cache: false,
            data: { fn: 217,uid:_U.uid,t: new Date() },
            success: function (o) {
                $("#img_qrcode").attr("src", "/active/student/userPic/" + _U.uid + ".jpg");
                if (o.Return == 1) {
                    alert("您已参与过该活动，每人限领一张门票！");
                }

            }
        }
        );
    }
}


_Fly.Init();
