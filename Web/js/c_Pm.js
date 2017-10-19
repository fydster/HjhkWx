var _Fly = {
    Init: function () {
        _Fly.initEvent();
    },
    initEvent: function () {
        var w = window.screen.width;
        var h = window.screen.height;

        _Fly.InitPm();
    },
    InitPm: function () {
        var temp = "<li class=\"bg1\"><span class=\"leftp\">&nbsp;</span><span class=\"photo\"><img src=\"{photoUrl}\" /></span><span class=\"nick\">{nickName}</span><span class=\"cengji\">{count}</span></li>";
        $.ajax(
        {
            url: "/service/Handler.ashx",
            context: document.body,
            dataType: "json",
            cache: false,
            data: { fn: 117,t: new Date() },
            success: function (o) {
                if (o.Return == 0) {
                    if (o.List != null) {
                        var oi = o.List;
                        var nickName = "";
                        for (var j = 0; j < oi.length; j++) {
                            nickName = oi[j].nickName;
                            if (nickName.length > 10) {
                                nickName = nickName.substr(0, 10);
                            }
                            th = temp.replace(/{photoUrl}/g, oi[j].photoUrl);
                            th = th.replace(/{nickName}/g, nickName);
                            th = th.replace("{count}", oi[j].count);
                            $(".pList").append(th);
                        }
                    }
                }

            }
        }
        );
    }
}


_Fly.Init();
