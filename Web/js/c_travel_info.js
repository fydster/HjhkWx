var _Travel = {
    ID: 0,
    Init: function () {
        _Travel.ID = _C.getParam("ID");
        if (_Travel.ID.length > 0) {
            _Travel.InitInfo();
        }

        $(".am-g").find(".am-u-sm-2").eq(0).click(function () {
            history.back(-1);
        });

        $(".am-g").find(".am-u-sm-2").eq(1).click(function () {
            window.location = "c_travel.html";
        });
    },
    InitInfo: function () {
        $(".content").html("");
        $(".am-u-sm-8").text("");
        $.ajax(
        {
            url: "/service/Handler.ashx",
            context: document.body,
            dataType: "json",
            cache: false,
            data: { fn: 119,id:_Travel.ID,t: new Date() },
            success: function (o) {
                if (o.Return == 0) {
                    if (o.Info != null) {
                        $(".am-u-sm-8").text(o.Info.title);
                        $(".content").html(unescape(o.Info.contents));
                    }
                }

            }
        }
        );
    }
}


_Travel.Init();
