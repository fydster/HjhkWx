var _Travel = {
    ID: 0,
    Top: 0,
    Init: function () {
        _Travel.ID = _C.getParam("id");
        if (_Travel.ID.length > 0) {
            _Travel.getInfo();
        }

        _C.initWx();

        wx.ready(function () {
            //alert("1");
            wx.onMenuShareTimeline({
                title: '海景国旅，品质保证，寻找你的诗和远方！', // 分享标题
                link: 'http://hjhk.edmp.cc/travel/c_travel_Mx.html?id='+_Travel.ID, // 分享链接
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
                title: '海景国旅，品质保证，寻找你的诗和远方！', // 分享标题
                desc: '',
                link: 'http://hjhk.edmp.cc/travel/c_travel_Mx.html?id=' + _Travel.ID, // 分享链接
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

        $("#wxService").click(function () {
            $("#QrCode").popup();
        });
        $(".weui-icon-cancel").click(function () {
            $.closePopup();
        });
    },
    getInfo: function () {
        $.showLoading();
        $.ajax(
				{
				    url: _C.LyUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 2,productId:_Travel.ID, t: new Date() },
				    success: function (o) {
				        $.hideLoading();
				        if (o.Return == 0) {
				            var oi = o.Info;
				            $("#topImg").attr("src", oi.imgUrl);
				            $(".pTitle").text(oi.title);
				            $(".txtPrice").html(oi.price + "<em>元起/人</em>");
				            $(".infoPanel").html(unescape(oi.contents));

				            $(".infoPanel").css("width", "100%");
				        }
				        else {

				        }
				    }
				}
		);
    }
}

