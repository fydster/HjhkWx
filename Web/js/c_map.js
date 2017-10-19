var _Index = {
    bgNum: 1,
    Init: function () {
        _Index.initLayot();
        _Index.getBeauti();
    },
    initLayot: function () {
        $(".am-icon-chevron-left").click(function () {
            window.location = "c_index_home.html";
        });
        $(".am-icon-home").click(function () {
            window.location = "c_index_home.html";
        });
    },
    getBeauti: function () {
        var template = $("#template_li").html();
        $.ajax(
				{
				    url: _C.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 110, t: new Date() },
				    success: function (o) {
				        if (o.Return == 0) {
				            var obj = $(".am-list");
				            var tempHtml = "";
				            for (var i = 0; i < o.List.length; i++) {
				                var oi = o.List[i];
				                tempHtml = template.replace("{Name}", oi.Name);
				                tempHtml = tempHtml.replace("{addr}", oi.Addr);
				                tempHtml = tempHtml.replace("{Id}", oi.Id);
				                obj.append(tempHtml);
				            }
				            $(".am-list-date").click(function () {
				                var id = $(this).attr("data-id");
				                window.location = "map/" + id + ".html";
				            });
				        }
				    }
				}
		);
    }
}


_Index.Init();
