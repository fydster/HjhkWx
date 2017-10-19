var _Role = {
    BtnCount: 60,
    state: 0,
    Init: function () {
        _Role.state = _C.getParam("state");
        //alert("跳转参数："+_Role.state);
        _Role.initEvent();
    },
    initEvent: function () {
        $("#mobile").keyup(function () {
            var mobile = $("#mobile").val();
            if (mobile.length == 11) {
                $(".am-btn-primary").removeClass("am-disabled");
            }
        });
        $("#code").keyup(function () {
            var code = $("#code").val();
            if (code.length == 4) {
                $(".am-btn-success").removeClass("am-disabled");
            }
        });

        $(".am-btn-success").click(function () {
            _Role.bind();
        });

        $(".am-btn-primary").click(function () {
            var mobile = $("#mobile").val();
            if (mobile.length != 11) {
                $("#mobile").focus();
                return;
            }
            $(".am-btn-primary").removeClass("am-disabled").addClass("am-disabled");//启用按钮
            $(".am-btn-primary").text("( " + _Role.BtnCount + " ) 秒后重新获取");
            InterValObj = setInterval(SetRemainTime, 1000); //启动计时器，1秒执行一次
            _Role.sendCode();
        });
    },
    sendCode: function () {
        var mobile = $("#mobile").val();
        if (mobile.length != 11) {
            $("#mobile").focus();
            return;
        }
        var openId = _U.openId;
        $.ajax(
				{
				    url: _C.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 101,openId:openId,mobile:mobile,uid:_U.uid, t: new Date() },
				    success: function (o) {
				        if (o.Return == 0) {
				            
				        }
				        else {
				            alert(o.Msg);
				            window.clearInterval(InterValObj);//停止计时器
				            $(".am-btn-primary").removeClass("am-disabled");//启用按钮
				            $(".am-btn-primary").text("重新发送验证码");
				            _Role.BtnCount = 60;

				        }
				    }
				}
		);
    },
    bind: function () {
        var mobile = $("#mobile").val();
        var contact = $("#contact").val();
        var code = $("#code").val();
        if (mobile.length == 0 || code.length == 0 || contact.length == 0) {
            return;
        }
        var openId = _U.openId;
        $("#my-modal-loading").modal("open");
        $.ajax(
				{
				    url: _C.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 103, openId: openId,contact:contact, mobile: mobile, uid: _U.uid, code: code, t: new Date() },
				    success: function (o) {
				        $("#my-modal-loading").modal('close');
				        if (o.Return == 0) {
				            var date = new Date();
				            _U.mobile = mobile;
				            _U.contact = contact;
				            date.setTime(date.getTime() + (24 * 30 * 24 * 60 * 60 * 1000)); //12小时过期
				            $.cookie("_Mobile", mobile, { path: '/', expires: date });
				            $.cookie("_Contact", contact, { path: '/', expires: date });
				            $.cookie("_UserInfo", JSON.stringify(_U), { path: '/', expires: date });

				            var state = _Role.state;
				            if (state.length > 5) {
				                _B.source = state.substr(0, 4);
				                _B.state = state.substr(4, 1);
				                _B.appid = state.substr(5, state.length - 5);
				            }
				            //alert("跳转参数：" + _B.state);
				            switch (_B.state) {
				                case "0":
				                    window.location = "c_order_new.html";
				                    break;
				                case "1":
				                    window.location = "c_set.html";
				                    break;
				                case "2":
				                    window.location = "c_uc.html";
				                    break;
				                case "3":
				                    window.location = "c_set_list.html";
				                    break;
				                case "4":
				                    window.location = "c_order_all.html";
				                    break;
				                case "5":
				                    window.location = "c_voucher.html";
				                    break;
				                case "6":
				                    window.location = "c_travel_list.html";
				                    break;
				                case "7":
				                    window.location = "c_train_order.html";
				                    break;
				                default:
				                    window.location = "c_index_home.html";
				                    break;
				            }
				        }
				        else {
				            alert(o.Msg);
				        }
				    }
				}
		);
    }
}

var InterValObj;

function SetRemainTime() {
    if (_Role.BtnCount == 1) {
        window.clearInterval(InterValObj);//停止计时器
        $(".am-btn-primary").removeClass("am-disabled");//启用按钮
        $(".am-btn-primary").text("重新发送验证码");
        _Role.BtnCount = 60;
    }
    else {
        _Role.BtnCount--;
        $(".am-btn-primary").text("( " + _Role.BtnCount + " ) 秒后重新获取");
    }
}
