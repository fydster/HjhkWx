//主函数
var _C = {
    ServerUrl: "Handler.ashx",
    WxServerUrl: "/service/Handler.ashx",
    serverId: "",
    imgNum: 0,
    Init: function () {
        $("#btn_create").click(_C.ReadyHB);
        _C.initWx();
        _C.initPhoto("btn_uploadImg");
    },
    initPhoto: function (id) {
        $("#" + id).click(function () {
            wx.chooseImage({
                count: 1, // 默认9
                sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                success: function (res) {
                    var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                    _C.serverId = res.localIds;
                    if (res.localIds.length == 1) {
                        /*
                        $("#imgList").html("<img id=\"Img_" + _Role.imgNum + "\" src=\"" + localIds + "\" style=\"height:6.5rem;width:6.5rem;margin-left:0.2rem;\" class=\"am-img-thumbnail\">");
                        $("#Img_" + _Role.imgNum).click(function () {
                            if (confirm("确定要删除吗！")) {
                                $(this).remove();
                            }
                        });
                        _C.imgNum++;
                        */
                    }
                    else {
                        for (var i = 0; i < res.localIds.length; i++) {
                            /*
                            $("#imgList").html("<img id=\"Img_" + _Role.imgNum + "\" src=\"" + res.localIds[i] + "\" style=\"height:6.5rem;width:6.5rem;margin-left:0.2rem;\" class=\"am-img-thumbnail\">");
                            $("#Img_" + _Role.imgNum).click(function () {
                                if (confirm("确定要删除吗！")) {
                                    $(this).remove();
                                }
                            });
                            _Role.imgNum++;
                            */
                        }
                    }
                }
            });
        });
    },
    initWx: function () {
        var Url = window.location.href;
        $.ajax(
            {
                url: _C.WxServerUrl,
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
                                        'addCard', 'chooseCard', 'openCard'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                        });
                    }
                }
            }
        );
    },
    UploadImg: function () {
        wx.uploadImage({
            localId: _C.serverId + "",// 需要上传的图片的本地ID，由chooseImage接口获得
            isShowProgressTips: 1, // 默认为1，显示进度提示
            success: function (res) {
                var serverId = res.serverId; // 返回图片的服务器端ID
                _C.serverId = serverId;
                _C.CreateHB();
            }
        });
    },
    ReadyHB: function () {
        var nick = $("#nick").val();
        var desp = $("#desp").val();
        if (nick.length == 0) {
            alert("你的大名还没有留下！");
            return;
        }
        if (desp.length == 0) {
            alert("说点祝福语吧！");
            return;
        }
        if (_C.serverId.length == 0) {
            alert("你还没有选择照片！");
            return;
        }
        else {
            _C.UploadImg();
        }
    },
    CreateHB: function () {
        var nick = $("#nick").val();
        var desp = $("#desp").val();
        $("#my-modal-loading").modal("open");
        $.ajax(
				{
				    url: _C.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 1, serverId: _C.serverId, nick: nick, desp: desp, t: new Date() },
				    success: function (o) {
				        $("#my-modal-loading").modal("close");
				        if (o.Return == 0) {
				            window.location = "Result.html?no=" + o.Msg;
				        }
				        else {
				            alert(o.Msg);
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
_C.Init();