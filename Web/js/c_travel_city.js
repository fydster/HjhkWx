var _Travel = {
    ID: 0,
    Init: function () {
        _Travel.ID = _C.getParam("id");
        _Travel.getList();
        var name = unescape(_C.getParam("name"));
        //$(".am-u-sm-8").text(name);

        $(".am-g").find(".am-u-sm-2").eq(0).click(function () {
            history.back(-1);
        });

        $(".am-g").find(".am-u-sm-2").eq(1).click(function () {
            window.location = "c_travel_index.html";
        });
        _C.initWx();

        wx.ready(function () {
            //alert("1");
            wx.onMenuShareTimeline({
                title: '山西出行，你选择我，我服务您！', // 分享标题
                link: 'http://hjhk.edmp.cc/c_loading.html?i=6', // 分享链接
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
                link: 'http://hjhk.edmp.cc/c_loading.html?i=6', // 分享链接
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
    getList: function () {
        $(".priceList").find("ul").html("");
        var template = $("#template").html();
        $.ajax(
				{
				    url: _C.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 120, isCount: 1, cid: _Travel.ID, t: new Date() },
				    success: function (o) {
				        if (o.Return == 0) {
				            var isChd = 0;
				            var url = "";
				            var tempHtml = "";
				            for (var i = 0; i < o.List.length; i++) {
				                var oi = o.List[i];
				                tempHtml = template.replace("{logourl}", oi.logoUrl);
				                tempHtml = tempHtml.replace("{name}", oi.name);
				                tempHtml = tempHtml.replace("{num}", oi.defaultUrl);
				                tempHtml = tempHtml.replace("{desp}", oi.defaultUrl);
				                tempHtml = tempHtml.replace("{url}", "c_travel_list.html?name=" + escape(oi.name) + "&id=" + oi.id);
				                $(".priceList").find("ul").append(tempHtml);
				            }
				            $(".priceList").find("ul").find("li").click(function () {
				                var url = $(this).attr("data-url");
				                window.location = url;
				            });
				        }
				        else {
				            $(".priceList").find("ul").html("");
				        }
				    }
				}
		);
    }
}


_Travel.Init();
