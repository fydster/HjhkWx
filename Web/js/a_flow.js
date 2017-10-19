var _Flow = {
    Init: function () {
        _Flow.initLayot();
        _Flow.getOrder();
        //_C.initWx();
    },
    initLayot: function () {

    },
    getOrder: function () {
        var template = $("#template_Flow").html();
        var obj = $(".infoList");
        obj.html("<i class=\"am-icon-spinner am-icon-spin\"></i>");
        $.ajax(
                {
                    url: _C.ServerUrl,
                    context: document.body,
                    dataType: "json",
                    cache: false,
                    data: { fn: 114,uid:_U.uid, t: new Date() },
                    success: function (o) {
                        var tempHtml = "";
                        obj.html("");
                        if (o.Return == 0) {
                            $("#uidNumInfo").find("span").text(o.List.length);
                            for (var i = 0; i < o.List.length; i++) {
                                var oi = o.List[i];
                                tempHtml = template.replace("{img}", oi.photoUrl);
                                tempHtml = tempHtml.replace("{nickName}", oi.nickName);
                                tempHtml = tempHtml.replace("{date}", new Date(oi.addOn).pattern("yyyy-MM-dd"));
                                obj.append(tempHtml);
                            }
                        }
                        else {
                            obj.html("<li>还没有好友加入，加油哦！</li>");
                        }
                    }
                }
        );
    }
}


_Flow.Init();
