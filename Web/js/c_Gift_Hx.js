var _Fly = {
    streamNo: "",
    Init: function () {
        _Fly.streamNo = _C.getParam("streamNo").replace("#","");
        $("#div_streamNo").html(_Fly.streamNo);
        //_Fly.AddHB();
        _Fly.GetGift();
    },
    GetGift: function () {
        $.ajax(
        {
            url: _C.ServerUrl,
            context: document.body,
            dataType: "json",
            cache: false,
            data: { fn: 218,uid:_U.uid,streamNo:_Fly.streamNo,t: new Date() },
            success: function (o) {
                if (o.Return == 0) {
                    if (o.Info != null) {
                        if (o.Info.state == 0) {
                            $(".weui-btn").click(function () {
                                _Fly.HxGift();
                            });
                        }
                        else {
                            $(".weui-flex").html("已核销,核销时间：" + new Date(o.Info.useOn).pattern("yyyy-MM-dd HH:mm:ss"));
                            //$(".weui-flex").hide();
                        }
                    }
                }
                else {
                    $.alert(o.Msg);
                    $(".weui-flex").hide();
                }

            }
        }
        );
    },
    HxGift: function () {
        if (!confirm("确定要核销！")) {
            return;
        }
        $.ajax(
        {
            url: _C.ServerUrl,
            context: document.body,
            dataType: "json",
            cache: false,
            data: { fn: 219, uid: _U.uid, streamNo: _Fly.streamNo, t: new Date() },
            success: function (o) {
                $.alert(o.Msg);
                if (o.Return == 0) {
                    $(".weui-flex").html("已核销");
                    //$(".weui-flex").hide();
                }

            }
        }
        );
    }
}


_Fly.Init();
