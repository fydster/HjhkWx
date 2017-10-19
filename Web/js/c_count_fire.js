var _OrderList = {
    Init: function () {
        _OrderList.getList();
    },
    getList: function () {
        var template = "<li><div class=\"tnumber\">{n}</div><div class=\"timg\"><img src=\"{photoUrl}\"/></div><div class=\"tname\">{nickName}</div><div class=\"tdate\">{human}</div></li>";
        $.ajax(
				{
				    url: _C.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 204,t: new Date() },
				    success: function (o) {
				        if (o.Return == 0) {
				            //$("#div_info").find("ul").html("");
				            var tempHtml = "";
				            for (var i = 0; i < o.List.length; i++) {
				                var oi = o.List[i];
				                tempHtml = template.replace("{nickName}", oi.contact + "&nbsp;");
				                tempHtml = tempHtml.replace("{n}", (i+1));
				                tempHtml = tempHtml.replace("{human}", oi.fireNum);
				                tempHtml = tempHtml.replace("{photoUrl}", oi.photoUrl);
				                $(".topList").find("ul").append(tempHtml);
				            }
				        }
				    }
				}
		);
    }
}


_OrderList.Init();
