var _Fly = {
    Init: function () {
        $("li").click(function () {
            var giftType = $(this).attr("data-id");
            _Fly.GetGift(giftType);
        });
    },
    GetGift: function (giftType) {
        $.showLoading();
        $.ajax(
        {
            url: _C.ServerUrl,
            context: document.body,
            dataType: "json",
            cache: false,
            data: { fn: 221, uid: _U.uid, openId: _U.openId,giftType:giftType,t: new Date() },
            success: function (o) {
                $.hideLoading();
                $.alert(o.Msg);
            }
        }
        );
    }
}


_Fly.Init();
