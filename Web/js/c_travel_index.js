var _Travel = {
    Init: function () {
        _Travel.getClass();
        _C.initWx();

        wx.ready(function () {
            //alert("1");
            wx.onMenuShareTimeline({
                title: '海景国旅，品质保证，寻找你的诗和远方！', // 分享标题
                link: 'http://hjhk.edmp.cc/travel/c_travel_index.html', // 分享链接
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
                link: 'http://hjhk.edmp.cc/travel/c_travel_index.html', // 分享链接
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

        window.onscroll = function () {
            var scrolltop = document.documentElement.scrollTop || document.body.scrollTop;
            if (scrolltop < 100) {
                $(".toTopBtn").hide();
            } else {
                $(".toTopBtn").show();
            }
        }

        $(".menuTitleMore").click(function () {
            var id = $(this).attr("data-id");
            window.location = "c_travel_more.html?ID=" + id;
        });
    },
    getClass: function () {
        $.showLoading();
        var template = $("#template_p").html();
        var obj = $(".MainBtn").find("ul");
        $.ajax(
                {
                    url: _C.LyUrl,
                    context: document.body,
                    dataType: "json",
                    cache: false,
                    data: { fn: 3,cType:1,CID:_Travel.ID, t: new Date() },
                    success: function (o) {
                        if (o.Return == 0) {			            
                            var tempHtml = "";
                            for (var i = 0; i < o.List.length; i++) {
                                var oi = o.List[i];
                                tempHtml = template.replace(/{id}/g, oi.id);
                                tempHtml = tempHtml.replace("{name}", oi.name);
                                tempHtml = tempHtml.replace("{n}", (i+1).toString());
                                $("#listPanel").append(tempHtml);
                                obj.append("<li><a href=\"c_travel_more.html?ID=" + oi.id + "\"><img src=\"" + oi.logoUrl + "\" /><span>" + oi.name + "</span></a></li>");
                            }
                            _Travel.getList();
                        }
                        else {
                            $("#ListPanel").html("无记录");
                        }
                    }
                }
        );
    },
    getList: function () {
        $(".blockList").find("ul").html("");
        var template = $("#template").html();
        $("#block_70").find("ul").after("<a href='c_travel_city.html?name=%u5C71%u897F&id=36'><img src='/ad/ad6.jpg' style='width:100%;'></a>");
        $.ajax(
				{
				    url: _C.LyUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 1, t: new Date() },
				    success: function (o) {
				        $.hideLoading();
				        if (o.Return == 0) {
				            var isChd = 0;
				            var tempHtml = "";
				            for (var i = 0; i < o.List.length; i++) {
				                var oi = o.List[i];
				                tempHtml = template.replace("{imgUrl}", oi.imgUrl);
				                var price = oi.price;
				                if (price == "0") {
				                    price = "--";
				                }
				                tempHtml = tempHtml.replace("{price}", price);
				                tempHtml = tempHtml.replace("{desp}", oi.desp);
				                tempHtml = tempHtml.replace("{isHref}", oi.isHref);
				                tempHtml = tempHtml.replace(/{title}/g, oi.title);
				                tempHtml = tempHtml.replace("{id}", oi.id);
				                if (isChd == 0 && oi.isTj == 1) {
				                    var obj = $("#top");
				                    obj.find("img").eq(0).attr("src", oi.imgUrl);
				                    obj.find(".adSign").html(oi.price + "<em>元起</em>");
				                    obj.find(".adSignR").text(oi.title);
				                    obj.attr("data-id", oi.id);
				                    obj.click(function () {
				                        var id = $(this).attr("data-id");
				                        var url = "c_travel_Mx.html?id=" + id;
				                        window.location = url;
				                    });
				                    isChd = 1;
				                }
				                if (oi.pId == 0) {
				                    $("#block_" + oi.cId).find("ul").append(tempHtml);
				                }
				                else {
				                    $("#block_" + oi.pId).find("ul").append(tempHtml);
				                }
				            }
				            $(".blockList").find("ul").find("li").click(function () {
				                var id = $(this).attr("data-id");
				                var isHref = $(this).attr("data-isHref");
				                var url = "c_travel_Mx.html?id=" + id;
				                if (isHref == 1) {
				                    url = "c_travel_Mx_s.html?id=" + id;
				                }
				                window.location = url;
				            });
				        }
				        else {
				            $(".blockList").find("ul").html("");
				        }
				    }
				}
		);
    }
}

