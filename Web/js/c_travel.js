var _Travel = {
    ID: 0,
    Init: function () {
        _Travel.getList();
    },
    getList: function () {
        $(".priceList").find("ul").html("");
        $.ajax(
				{
				    url: _C.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 120, cType: 0, t: new Date() },
				    success: function (o) {
				        if (o.Return == 0) {
				            var isChd = 0;
				            var url = "";
				            for (var i = 0; i < o.List.length; i++) {
				                var oi = o.List[i];
				                url = "travel/c_travel_list.html?name=" + escape(oi.name) + "&id=" + oi.id;
				                if (oi.pId == 0) {
				                    for (var j = 0; j < o.List.length; j++) {
				                        if (o.List[j].pId == oi.id) {
				                            isChd++;
				                        }
				                    }
				                    if (isChd > 0) {
				                        url = "travel/c_travel_city.html?name=" + escape(oi.name) + "&id=" + oi.id;
				                    }
				                    $(".priceList").find("ul").append("<li data-url=\"" + url + "\"><img src=\"" + oi.logoUrl + "\" class=\"am-radius\"><div class=\"priceInfo\"><span class=\"priceValue\">" + oi.name + "</span></div></li>");
				                }

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
