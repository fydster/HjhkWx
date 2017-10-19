//主函数
var _Comm = {
    openId: "",
    sxCxAppID: "wx9d23334360aa6af4",
    ServerUrl: "/service/Handler.ashx",
    Init: function () {
        var openId = $.cookie("_Comm_OpenId");
        if (openId != null && openId.length > 20) {
            _Comm.openId = openId;
        }
        else {
            var code = _Comm.getParam("code");
            if (code.length > 0) {
                _Comm.getOpenId(code);
            }
        }
        
    },
    initWx: function () {
        var Url = window.location.href;
        $.ajax(
            {
                url: _Comm.ServerUrl,
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
                                        'addCard', 'chooseCard', 'openCard','openAddress'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                        });
                    }
                }
            }
        );
    },
    getOpenId: function (code) {
        $.ajax(
				{
				    url: _Comm.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 8, code: code, source: "0000", t: new Date() },
				    success: function (o) {
				        //alert(o.Return);
				        if (o.Return == 0) {
				            var date = new Date();
				            date.setTime(date.getTime() + (30 * 24 * 60 * 60 * 1000)); //12小时过期
				            $.cookie("_Comm_OpenId", o.Msg, { path: '/', expires: date });
				        }
				    }
				}
		);
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

_Comm.Init();