//用户信息
var _U = {
    uid: 0,
    openId: "",
    exOpenID: "",
    uName: "",
    addr: "",
    contact: "",
    mobile: "",
    photoUrl: "",
    uType: "",
    workNo: "",
    isSubscribe: 1
}

var _Student = {
    sxCxAppID: "wx9d23334360aa6af4",
    ServerUrl: "/service/Handler.ashx",
    isOpenInfo: 0,
    isSubscribe: 1,
    Init: function () {
        var user = $.cookie("_UserInfo");
        if (user != null && _U.openId.length > 1) {
            _U = JSON.parse(user);
            $(".weui-btn_plain-primary").click(function () {
                _Student.ToVote();
            });
            _Student.GetUser(_U.openId);
        }
        else {
            var openId = $.cookie("_OpenId");
            if (openId != null && openId.length > 1) {
                _U.openId = openId;
                $(".weui-btn_plain-primary").click(function () {
                    _Student.ToVote();
                });
                _Student.GetUser(_U.openId);
            }
            else {
                var code = _Student.getParam("code");
                if (code.length > 0) {
                    _Student.getOpenId(code);
                }
            }
        }

        window.onpopstate = function () {
            if (_Student.isOpenInfo == 1) {
                $('.weui-msg').fadeOut();
            }
        }

        
        _Student.initEvent();
    },
    initWx: function () {
        var Url = window.location.href;
        $.ajax(
            {
                url: _Student.ServerUrl,
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
				    url: _Student.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 1, code: code, source: _B.source, t: new Date() },
				    success: function (o) {
				        //alert(o.Return);
				        if (o.Return == 0) {
				            var date = new Date();
				            date.setTime(date.getTime() + (30 * 24 * 60 * 60 * 1000)); //12小时过期
				            $.cookie("_OpenId", o.Msg, { path: '/', expires: date });
				            $(".weui-btn_plain-primary").click(function () {
				                _Student.ToVote();
				            });
				            _U.openId = o.Msg;
				            _Student.GetUser(_U.openId);
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
    },
    GetUser: function (openId) {
        $.ajax(
				{
				    url: _Student.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 7, openId: openId, source: "0000", t: new Date() },
				    success: function (o) {
				        if (o.Return == 0) {
				            var oi = o.Info;
				            _Student.isSubscribe = oi.isSubscribe;
				            _U.isSubscribe = oi.isSubscribe;
				            //_U.uid = oi.id;
				            _U.openId = openId;
				            _U.exOpenID = oi.exOpenID;
				            _U.mobile = oi.mobile;
				            _U.contact = oi.contact;
				            _U.uName = oi.nickName;
				            _U.photoUrl = oi.photoUrl;
				            var date = new Date();
				            date.setTime(date.getTime() + (30 * 24 * 60 * 60 * 1000));
				            $.cookie("_UserInfo", JSON.stringify(_U), { path: '/', expires: date });
				        }
				    }
				}
		);
    },
    initEvent: function () {
        $("img.lazy").lazyload({ effect: "fadeIn", threshold: 180 });
        $(".box").find(".info").find("span").eq(3).text("--票");
        _Student.initWx();
        wx.ready(function () {
            wx.onMenuShareTimeline({
                title: '我参与了2017 首届龙城太原 “小龙人”评选大赛，快来支持我吧！', // 分享标题
                link: 'http://hjhk.edmp.cc/active/vote/toGz.html', // 分享链接
                imgUrl: 'http://hjhk.edmp.cc/active/vote/img/bottom.jpg', // 分享图标
                success: function () {
                },
                cancel: function () {
                }
            });

            wx.onMenuShareAppMessage({
                title: '我参与了2017 首届龙城太原 “小龙人”评选大赛，快来支持我吧！', // 分享标题
                desc: '',
                link: 'http://hjhk.edmp.cc/active/vote/toGz.html', // 分享链接
                imgUrl: 'http://hjhk.edmp.cc/active/vote/img/bottom.jpg', // 分享图标
                success: function () {

                },
                cancel: function () {
                }
            });
        });


        $("#toSelect").click(function () {
            var bNo = $("#bNo").val();
            if (bNo.length > 0 && !isNaN(bNo)) {
                $("#Main").find(".box").hide();
                if (bNo.length == 6) {
                    bNo = "0" + bNo;
                }
                if (bNo.length == 5) {
                    bNo = "00" + bNo;
                }
                if (bNo.length == 4) {
                    bNo = "000" + bNo;
                }
                if (bNo.length == 3) {
                    bNo = "0000" + bNo;
                }
                if (bNo.length == 2) {
                    bNo = "00000" + bNo;
                }
                $("#s_" + bNo).show();
            }
            else {
                $("#Main").find(".box").show();
            }
        });
        _Student.GetVoteUser();
    },
    ToVote: function () {
        if (_Student.isSubscribe == 0) {
            $.alert("投票前请先关注山西出行", function () {
                window.location = "http://hjhk.edmp.cc/active/vote/toGz.html";
            });
            return;
        }
        var obj = document.getElementsByName("voteAgree");
        var arr = new Array();
        var n = 0;
        for (var i = 0; i < obj.length; i++) {
            if (obj[i].checked) {
                arr[n] = obj[i].value;
                n++;
            }
        }
        var bNo = arr.join(",");
        if (n == 0) {
            $.toast("至少选择1个候选人", "text");
            return;
        }
        if (n > 3) {
            $.toast("最多选择3个候选人", "text");
            return;
        }
        $.showLoading();
        $.ajax(
				{
				    url: _Student.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 224, uid: _U.uid, openId: _U.openId, bNo: bNo, t: new Date() },
				    success: function (o) {
				        $.hideLoading();
				        if (o.Return < 2) {
				            $.alert(o.Msg);
				        }
				        if (o.Return == 2) {
				            $.alert(o.Msg, function () {
				                window.location = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx9d23334360aa6af4&redirect_uri=http%3a%2f%2fhjhk.edmp.cc%2factive%2fvote%2fvote.html&response_type=code&scope=snsapi_base&state=00001wx9d23334360aa6af4#wechat_redirect";
				            });
				        }
				        
				    }
				}
		);
    },
    GetVoteUser: function () {
        var template = $("#template").html();
        //$.showLoading();
        $.ajax(
				{
				    url: _Student.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 227, uid: _U.uid, openId: _U.openId, t: new Date() },
				    success: function (o) {
				        //$.hideLoading();
				        if (o.Return == 0) {
				            var tempHtml = "";
				            var n = 0;
				            for (var i = 0; i < o.List.length; i++) {
				                var oi = o.List[i];
				                $("#s_" + oi.bNo).find(".info").find("span").eq(3).text(oi.num + "票");
				            }
				        }
				    }
				}
		);
    }
}


_Student.Init();
