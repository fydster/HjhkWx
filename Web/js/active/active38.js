var _Active = {
    Init: function () {
        window.location = "a_fund.html";
        setTimeout(_Active.AddBm, 500);
        _C.initWx();
        wx.ready(function () {
            wx.onMenuShareTimeline({
                title: "和女神一起泡温泉", // 分享标题
                desp: "和女神一起泡温泉",
                link: 'http://mp.weixin.qq.com/s/5lHz8maX-FnKhuj8WaOF7w', // 分享链接
                imgUrl: 'http://hjhk.edmp.cc/active/38/share.jpg', // 分享图标
                success: function () {
                    //$("#div_img").hide();
                    //window.location = "order.html?aid=2";
                    // 用户确认分享后执行的回调函数
                },
                cancel: function () {
                    //$("#div_img").hide();
                    //$("#my-alert").modal('open');
                    // 用户取消分享后执行的回调函数
                }
            });

            wx.onMenuShareAppMessage({
                title: "和女神一起泡温泉", // 分享标题
                desp: "和女神一起泡温泉",
                link: 'http://mp.weixin.qq.com/s/5lHz8maX-FnKhuj8WaOF7w', // 分享链接
                imgUrl: 'http://hjhk.edmp.cc/active/38/share.jpg', // 分享图标
                success: function () {
                    //$("#div_img").hide();
                    //window.location = "order.html?aid=2";
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
    AddBm: function () {
        $.ajax(
           {
               url: _C.ServerUrl,
               context: document.body,
               dataType: "json",
               cache: false,
               data: { fn: 201, uid: _U.uid,activeId:1, t: new Date() },
               success: function (o) {
                   if (o.Return == 0) {

                   }

               }
           }
        );
    }
}


_Active.Init();
