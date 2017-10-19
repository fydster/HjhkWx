var _Travel = {
    ID: 0,
    Init: function () {
        _Travel.ID = _C.getParam("id");
        _Travel.getList();
        var name = unescape(_C.getParam("name"));
        $(".am-u-sm-8").text(name);

        $(".am-g").find(".am-u-sm-2").eq(0).click(function () {
            history.back(-1);
        });

        $(".am-g").find(".am-u-sm-2").eq(1).click(function () {
            window.location = "c_travel.html";
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
				    data: { fn: 121, cid: _Travel.ID, t: new Date() },
				    success: function (o) {
				        if (o.Return == 0) {
				            var url = "";
				            var tempHtml = "";
				            for (var i = 0; i < o.List.length; i++) {
				                var oi = o.List[i];
				                tempHtml = template.replace("{imgUrl}", oi.imgUrl);
				                tempHtml = tempHtml.replace("{title}", oi.title);
				                tempHtml = tempHtml.replace("{source}", oi.source);
				                tempHtml = tempHtml.replace("{url}", "c_travel_info.html?ID=" + oi.id);
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
