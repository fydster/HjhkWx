var _Fly = {
    giftType: 2,
    Init: function () {
        _Fly.GetGift();
        _Fly.giftType = _C.getParam("giftType");
    },
    addGift: function () {
        $.ajax(
        {
            url: _C.ServerUrl,
            context: document.body,
            dataType: "json",
            cache: false,
            data: { fn: 220, uid: _U.uid, streamNo: "GX201707001",giftType:_Fly.giftType, t: new Date() },
            success: function (o) {
                if (o.Return == 0) {
                    
                }
                else {

                }

            }
        }
        );
    },
    GetGift: function () {
        $.ajax(
        {
            url: _C.ServerUrl,
            context: document.body,
            dataType: "json",
            cache: false,
            data: { fn: 218,uid:_U.uid,streamNo:"GX201707001",t: new Date() },
            success: function (o) {
                if (o.Return == 0) {
                    if (o.Info != null) {
                        if (o.Info.state == 0) {
                            $("#go_img").fadeIn();
                            $("#go_img").click(function () {
                                _Fly.HxGift();
                            });
                            $("#divImg").html("<img src=\"/active/student/fund00" + o.Info.giftType + ".jpg\" style=\"width:90%;margin-top:20px;\"/>");
                            $("#divImg").css("text-align", "center");
                        }
                        else {
                            $("#divImg").html("<span style=\"color:#fff;margin-top:100px;text-align:center;\">该奖品已领<br/>领取时间：" + new Date(o.Info.useOn).pattern("yyyy-MM-dd HH:mm:ss") + "</span>");
                        }
                    }
                }
                else {
                    
                }

            }
        }
        );
    },
    HxGift: function () {
        if (!confirm("工作人员已确定该奖品领取完成！")) {
            return;
        }
        $.ajax(
        {
            url: _C.ServerUrl,
            context: document.body,
            dataType: "json",
            cache: false,
            data: { fn: 219, uid: _U.uid, streamNo:"GX201707001", t: new Date() },
            success: function (o) {
                alert(o.Msg);
                if (o.Return == 0) {
                    $("#go_img").hide();
                    $("#divImg").html("<span style=\"color:#fff;margin-top:100px;text-align:center;\">该奖品已领</span>");
                }

            }
        }
        );
    }
}


_Fly.Init();
