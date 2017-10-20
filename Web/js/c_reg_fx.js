var _Reg = {
    Init: function () {
        $("#btn_Qrcode").click(function () {
            _Reg.toReg();
        });
    },
    toReg: function () {
        var contact = $("#contact").val();
        var mobile = $("#mobile").val();
        if (contact.length == 0 || mobile.length == 0) {
            $.alert("请填写完整后再提交");
            return;
        }
        $.showLoading();
        $.ajax(
				{
				    url: _C.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 303, uid: $.cookie("seascape_def_USER_ID"), openId: $.cookie("_OpenId"), mobile: mobile, contact: contact, t: new Date() },
				    success: function (o) {
				        $.hideLoading();
				        if (o.Return == 0) {
				            var date = new Date();
				            date.setTime(date.getTime() + (24 * 30 * 24 * 60 * 60 * 1000));
				            $.cookie("_IsFx", $.cookie("seascape_def_USER_ID"), { path: '/', expires: date });
				            $.alert("提交申请完成，请联系业务人员进行审核开通!", function () {
				                window.location = "/c_uc.html";
				            });
				        }
				        else {
				            $.alert(o.Msg);
				        }
				    }
				}
		);
    }
}
