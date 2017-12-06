var USER_INFO_URL = "";
var AJAX_SERVER_URL = "/service/Handler.ashx";
var _C = {
    init: function (callback) {
        var userId = $.cookie("C_User_ID");
        if (userId != null && userId.length > 0) {
            callback.Init();
        }
        else {
            var openId = $.cookie("C_User_OpenId");
            if (openId != null && openId.length > 0) {
                _C.setUser(openId, callback);
            }
            else {
                var code = _Tool.getParam("code");
                if (code.length > 0) {
                    _C.getOpenId(code, callback);
                }
                else {
                    window.location = USER_INFO_URL;
                }
            }
        }
    },
    getOpenId: function (code, callback) {
        $.ajax(
				{
				    url: AJAX_SERVER_URL,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 1, code: code,t: new Date() },
				    success: function (o) {
				        if (o.Return == 0) {
				            _Tool.addCookie("C_User_OpenId", o.Msg);
				            _C.setUser(o.Msg, callback);
				        }
				    }
				}
		);
    },
    setUser: function (openId, callback) {
        $.ajax(
				{
				    url: AJAX_SERVER_URL,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 2, openId: openId, t: new Date() },
				    success: function (o) {
				        if (o.Return == 0) {
				            var oi = o.Info;
				            _Tool.addCookie("C_User_ID", oi.id);
				            _Tool.addCookie("C_User_OpenId", oi.openId);
				            _Tool.addCookie("C_User_NickName", oi.nickName);
				            _Tool.addCookie("C_User_PhotoUrl", oi.photoUrl);
				            _Tool.addCookie("C_User_Mobile", oi.mobile);
				            _Tool.addCookie("C_User_Contact", oi.contact);
				        }
				        callback.Init();
				    }
				}
		);
    },
    initWx: function () {
        var Url = window.location.href;
        $.ajax(
            {
                url: AJAX_SERVER_URL,
                context: document.body,
                dataType: "text",
                cache: true,
                data: { fn: 97, Url: Url, t: new Date() },
                success: function (o) {
                    if (o.length > 0) {
                        var os = o.split("|");
                        wx.config({
                            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                            appId: os[3], // 必填，公众号的唯一标识
                            timestamp: os[1], // 必填，生成签名的时间戳
                            nonceStr: os[2], // 必填，生成签名的随机串
                            signature: os[0],// 必填，签名，见附录1
                            jsApiList: ['checkJsApi', 'onMenuShareTimeline', 'onMenuShareAppMessage',
                                        'onMenuShareQQ', 'onMenuShareWeibo', 'hideMenuItems',
                                        'showMenuItems', 'hideAllNonBaseMenuItem', 'showAllNonBaseMenuItem',
                                        'translateVoice', 'startRecord', 'stopRecord', 'onRecordEnd',
                                        'playVoice', 'pauseVoice', 'stopVoice', 'uploadVoice',
                                        'downloadVoice', 'chooseImage', 'previewImage', 'uploadImage',
                                        'downloadImage', 'getNetworkType', 'openLocation',
                                        'getLocation', 'hideOptionMenu', 'showOptionMenu',
                                        'closeWindow', 'scanQRCode', 'chooseWXPay', 'openProductSpecificView',
                                        'addCard', 'chooseCard', 'openCard', 'openAddress'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                        });
                    }
                }
            }
        );
    }
}


var _Tool = {
    addCookie: function (name, key) {
        var date = new Date();
        date.setTime(date.getTime() + (30 * 24 * 60 * 60 * 1000));
        $.cookie(name, key, { path: '/', expires: date });
    },
    getParam: function (pname) {
        var aQuery = window.location.href.split("?");
        var avar = "";
        if (aQuery.length > 1) {
            var aBuf = aQuery[1].split("&");
            for (var i = 0, iLoop = aBuf.length; i < iLoop; i++) {
                var aTmp = aBuf[i].split("="); //分离key与Value
                if (aTmp[0] == pname) {
                    avar = aTmp[1];
                    break;
                }
            }
        }
        return avar;
    }
}


Date.prototype.pattern = function (fmt) {
    try {
        var o = {
            "M+": this.getMonth() + 1, //月份           
            "d+": this.getDate(), //日           
            "h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时           
            "H+": this.getHours(), //小时           
            "m+": this.getMinutes(), //分           
            "s+": this.getSeconds(), //秒           
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度           
            "S": this.getMilliseconds() //毫秒           
        };
        var week = {
            "0": "/u65e5",
            "1": "/u4e00",
            "2": "/u4e8c",
            "3": "/u4e09",
            "4": "/u56db",
            "5": "/u4e94",
            "6": "/u516d"
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        if (/(E+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f" : "/u5468") : "") + week[this.getDay() + ""]);
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
    }
    catch (e) {

    }

    return fmt;
}