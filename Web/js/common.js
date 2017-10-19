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
}

var _B = {
    appid: "",
    state: 0,
    source: ""
}

//航班信息
var _F = {
    sType: 1,
    sCity: "",
    tCity: "",
    sDate: "",
    tDate: "",
    sCode: "",
    tCode: "",
    sPort: "",
    tPort: "",
    flihtNo: "",
    flihtName: "",
    sTime: "",
    tTime: "",
    sT: "",
    tT: "",
    cw: "",
    zk: 0,
    price: 0,
    tax: 0,
    jj: 0,
    cs: "",
    aPrice: 0,
    bgrule: "",
    tprule: "",
    gj: ""
}

var _FBack = {
    sType: 1,
    sCity: "",
    tCity: "",
    sDate: "",
    tDate: "",
    sCode: "",
    tCode: "",
    sPort: "",
    tPort: "",
    flihtNo: "",
    flihtName: "",
    sTime: "",
    tTime: "",
    sT: "",
    tT: "",
    cw: "",
    zk: 0,
    price: 0,
    tax: 0,
    jj: 0,
    cs: "",
    aPrice: 0
}

//火车相关信息
var _T = {
    queryKey: "",
    journeyType: "",
    trainNo: "",
    sCode: "",
    sCity: "",
    tCode: "",
    tCity: "",
    sDate: "",
    seat: "",
    seatName: "",
    sTime: "",
    tTime: "",
    queryKey: "",
    price: 0
}

//主函数
var _C = {
    sxCxAppID: "wx9d23334360aa6af4",
    ServerUrl: "/service/Handler.ashx",
    AirUrl: "/service/AirHandler.ashx",
    TrainServerUrl: "/service/TrainHandler.ashx",
    Init: function () {
        if ($.cookie("seascape_def_USER_ID") != null) {
            _U.uid = $.cookie("seascape_def_USER_ID");
        }
        if ($.cookie("_OpenId") != null && $.cookie("_OpenId").length > 1) {
            _U.openId = $.cookie("_OpenId");
        }
        try{
            var state = _C.getParam("state");
            if (state != null) {
                if (state.length > 5) {
                    _B.source = state.substr(0, 4);
                    _B.state = state.substr(4, 1);
                    _B.appid = state.substr(5, state.length - 5);
                    var date = new Date();
                    date.setTime(date.getTime() + (30 * 24 * 60 * 60 * 1000)); //12小时过期
                    $.cookie("_BasicForUrl", JSON.stringify(_B), { path: '/', expires: date });
                }
            }

            if (_B.source.length == 0) {
                var bCookie = $.cookie("_BasicForUrl");
                _B = JSON.parse(bCookie);
            }

            _C.InitWxInfo();
        }
        catch(e){

        }

        var user = $.cookie("_UserInfo");
        if (user != null && _U.openId.length > 1) {
            _U = JSON.parse(user);
        }
        else {
            var openId = $.cookie("_OpenId");
            if (openId != null && openId.length > 1) {
                _C.setUser(openId);
            }
            else {
                var code = _C.getParam("code");
                if (code.length > 0) {
                    _C.getOpenId(code);
                }
            }
        }
    },
    C_ToCSS:function(x, obj) {
        obj.addClass(x + ' animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
            $(this).removeClass(x + ' animated');
        });
    },
    InitWxInfo: function () {
        if (_B == null || _B.source.length == 0) {
            var bCookie = $.cookie("_BasicForUrl");
            _B = JSON.parse(bCookie);
        }
        if (_B == null || _B.source.length == 0) {
            return;
        }
        $.ajax(
        {
            url: _C.ServerUrl,
            context: document.body,
            dataType: "json",
            cache: false,
            data: { fn: 6, sourceStr: _B.source, t: new Date() },
            success: function (o) {
                if (o.Return == 0) {
                    if (o.Info != null) {
                        $("title").text(o.Info.sName);
                    }
                }
                else {
                    $("title").text("山西出行");
                }
            }
        }
        );
    },
    initWx: function () {
        var Url = window.location.href;
        $.ajax(
            {
                url: _C.ServerUrl,
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
    RedirectUrl: function (url, i, scope) {
        //alert(url);
        if (_B == null) {
            _B = {
                appid: _C.sxCxAppID,
                state: 0,
                source: "0000"
            };
        }
        if (scope == "") {
            scope = "snsapi_userinfo";
        }
        if (scope == "snsapi_base") {
            _B.appid = _C.sxCxAppID;
        }
        _B.state = i;
        var paras = _B.source + _B.state + _B.appid;
        //alert(paras);
        window.location = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + _B.appid + "&redirect_uri=http%3a%2f%2fhjhk.edmp.cc%2f" + url + "&response_type=code&scope=" + scope + "&state=" + paras + "#wechat_redirect";
    },
    getOpenId: function (code) {
        $.ajax(
				{
				    url: _C.ServerUrl,
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
				            _C.setUser(o.Msg);
				        }
				    }
				}
		);
    },
    setUser: function (openId) {
        $.ajax(
				{
				    url: _C.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 2, openId: openId,source:_B.source, t: new Date() },
				    success: function (o) {
				        if (o.Return == 0) {
				            var oi = o.Info;
				            _U.uid = oi.id;
				            _U.openId = openId;
				            _U.exOpenID = oi.exOpenID;
				            _U.mobile = oi.mobile;
				            _U.contact = oi.contact;
				            _U.uName = oi.nickName;
				            _U.photoUrl = oi.photoUrl;
				            var date = new Date();
				            date.setTime(date.getTime() + (24 * 30 * 24 * 60 * 60 * 1000));
				            $.cookie("_Mobile", oi.mobile, { path: '/', expires: date });
				            $.cookie("_Contact", oi.contact, { path: '/', expires: date });
				            $.cookie("_NickName", oi.nickName, { path: '/', expires: date });
				            $.cookie("_PhotoUrl", oi.photoUrl, { path: '/', expires: date });
				            $.cookie("_UserInfo", JSON.stringify(_U), { path: '/', expires: date });
				            $.cookie("seascape_def_USER_ID", oi.id, { path: '/', expires: date });
				            //alert($.cookie("_UserInfo"));
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
    //获取订单状态
    getState: function (state) {
        state = state.toString();
        switch (state) {
            case "0":
                return "新订单";
            case "1":
                return "已出票";
            case "2":
                return "已出票";
            case "-100":
                return "已退票";
            case "9":
                return "已改签";
            default:
                return "无效订单";
        }
    },
    getStateForTrain: function (state) {
        state = state.toString();
        switch (state) {
            case "0":
                return "新订单";
            case "1":
                return "申请座位中";
            case "2":
                return "等待出票";
            case "3":
                return "已出票";
            case "8":
                return "占座过期";
            case "9":
                return "已退票";
            case "10":
                return "占座失败";
            case "-100":
                return "订单取消";
            default:
                return "无效订单";
        }
    },
    getStateForTravel: function (state) {
        state = state.toString();
        switch (state) {
            case "0":
                return "新订单";
            case "1":
                return "待支付";
            case "2":
                return "已出票";
            case "3":
                return "已出票";
            case "8":
                return "已过期";
            case "9":
                return "已取消";
            case "10":
                return "已退票";
            case "-100":
                return "订单取消";
            default:
                return "无效订单";
        }
    },
    getWeek: function (date) {
        var week;
        if (new Date(date).getDay() == 0) week = "周日"
        if (new Date(date).getDay() == 1) week = "周一"
        if (new Date(date).getDay() == 2) week = "周二"
        if (new Date(date).getDay() == 3) week = "周三"
        if (new Date(date).getDay() == 4) week = "周四"
        if (new Date(date).getDay() == 5) week = "周五"
        if (new Date(date).getDay() == 6) week = "周六"
        return week;
    },
    dateDiff:function(interval, date1, date2)
    {
        var objInterval = {'D' : 1000 * 60 * 60 * 24, 'H' : 1000 * 60 * 60, 'M' : 1000 * 60, 'S' : 1000, 'T' : 1};
        interval = interval.toUpperCase();
        var intNum = 1000 * 60 * 60 * 24;
        if (interval == "H") { intNum = 1000 * 60 * 60; }
        if (interval == "M") { intNum = 1000 * 60; }
        if (interval == "S") { intNum = 1000; }
        if (interval == "T") { intNum = 1; }
        var dt1 = Date.parse(date1.replace(/-/g, '/'));
        var dt2 = Date.parse(date2.replace(/-/g, '/'));
        try
        {
            return Math.round((dt2 - dt1) / intNum);
        }
        catch (e)
        {
            return 0;
        }
    },
    dateAdd: function (date1, interval,addNum) {
        var objInterval = { 'D': 1000 * 60 * 60 * 24, 'H': 1000 * 60 * 60, 'M': 1000 * 60, 'S': 1000, 'T': 1 };
        interval = interval.toUpperCase();
        var intNum = 1000 * 60 * 60 * 24;
        if (interval == "H") { intNum = 1000 * 60 * 60; }
        if (interval == "M") { intNum = 1000 * 60; }
        if (interval == "S") { intNum = 1000; }
        if (interval == "T") { intNum = 1; }

        var sDate = new Date(date1);
        sDate = sDate.valueOf();
        sDate = sDate + addNum * intNum;
        sDate = new Date(sDate)
        return sDate;
    },
    //判断手机号码是否合法
    IsValidMobile: function (mobile) {
        var myreg = /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
        if (!myreg.test(mobile)) {
            return false;
        }
        else {
            return true;
        }
    },
    getAge: function (UUserCard) {
        if (UUserCard.length == 15) {
            UUserCard = UUserCard.substr(0, 6) + "19" + UUserCard.substr(6, UUserCard.length - 6);
        }
        var myDate = new Date();
        var month = myDate.getMonth() + 1;
        var day = myDate.getDate();
        var age = myDate.getFullYear() - UUserCard.substring(6, 10) - 1;
        if (UUserCard.substring(10, 12) < month || UUserCard.substring(10, 12) == month && UUserCard.substring(12, 14) <= day) {
            age++;
        }
        return age;
    }
}

Date.prototype.pattern = function (fmt) {
    try{
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

_C.Init();