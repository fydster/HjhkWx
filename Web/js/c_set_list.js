var _SetList = {
    isOpenInfo: 0,
    id: 0,
    type: 5,
    Init: function () {
        _C.initWx();
        _SetList.initLayot();
        _SetList.getOrder();
        wx.ready(function () {
            //alert("1");
            wx.onMenuShareTimeline({
                title: '山西出行，你选择我，我服务您！', // 分享标题
                link: 'http://hjhk.edmp.cc/c_loading.html?i=4', // 分享链接
                imgUrl: 'http://hjhk.edmp.cc/img/sharelogo.jpg', // 分享图标
                success: function () {
                    //alert("2");
                    //$("#div_img").hide();
                    //window.location = "order_one.html";
                    // 用户确认分享后执行的回调函数
                },
                cancel: function () {
                    //alert("3");
                    //$("#div_img").hide();
                    //$("#my-alert").modal('open');
                    // 用户取消分享后执行的回调函数
                }
            });

            wx.onMenuShareAppMessage({
                title: '山西出行，你选择我，我服务您！', // 分享标题
                desc: '',
                link: 'http://hjhk.edmp.cc/c_loading.html?i=4', // 分享链接
                imgUrl: 'http://hjhk.edmp.cc/img/sharelogo.jpg', // 分享图标
                success: function () {
                    //$("#div_img").hide();
                    //window.location = "order_one.html";
                    // 用户确认分享后执行的回调函数
                },
                cancel: function () {
                    //$("#div_img").hide();
                    //$("#my-alert").modal('open');
                    // 用户取消分享后执行的回调函数
                }
            });
        });
    },
    initLayot: function () {
        $(".am-icon-home").click(function () {
            window.location = "c_index_home.html";
        });
        $("#div_addSet").click(function () {
            window.location = "c_index_home.html";
        });
        $("#btn_cancel").click(function () {
            _SetList.updateState();
        });
    },
    updateState: function () {
        $("#my-modal-loading").modal("open");
        $.ajax(
				{
				    url: _C.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 111,uid:_U.uid,id:_SetList.id, t: new Date() },
				    success: function (o) {
				        $("#my-modal-loading").modal("close");
				        if (o.Return == 0) {
				            _SetList.getOrder();
				        }
				        else {
				            $("#my-confirm").find(".am-modal-bd").text("取消失败，请稍后再试！");
				            $("#my-confirm").modal("open");
				        }
				    }
				}
		);
    },
    getOrder: function () {
        var template = $("#template_SetList").html();
        var obj = $("#ul_order");
        obj.html("<i class=\"am-icon-spinner am-icon-spin\"></i>");
        $.ajax(
                {
                    url: _C.ServerUrl,
                    context: document.body,
                    dataType: "json",
                    cache: false,
                    data: { fn: 110,uid:_U.uid, t: new Date() },
                    success: function (o) {
                        var tempHtml = "";
                        obj.html("");
                        var sName = "";
                        if (o != null && o.Return == 0 && o.List.length > 0) {
                            $("#div_setNo").hide();
                            for (var i = 0; i < o.List.length; i++) {
                                var oi = o.List[i];
                                tempHtml = template.replace("{RecordDate}", new Date(oi.addOn).pattern("yyyy-MM-dd"));
                                tempHtml = tempHtml.replace("{FlihtFrom}", oi.sCity);
                                tempHtml = tempHtml.replace("{FlihtTo}", oi.tCity);
                                tempHtml = tempHtml.replace("{Price}", oi.discount + "折 [ " + oi.lPrice + "元 ]");
                                sName = "进行中";
                                if (oi.enable == 1) {
                                    sName = "已取消";
                                    tempHtml = tempHtml.replace("{stateTheme}", "default");
                                    tempHtml = tempHtml.replace("{btnhide}", "am-hide");
                                }
                                if (oi.enable == 2) {
                                    sName = "已完成";
                                    tempHtml = tempHtml.replace("{stateTheme}", "primary");
                                    tempHtml = tempHtml.replace("{btnhide}", "am-hide");
                                }
                                if (oi.enable == 3) {
                                    sName = "已结束";
                                    tempHtml = tempHtml.replace("{stateTheme}", "primary");
                                    tempHtml = tempHtml.replace("{btnhide}", "am-hide");
                                }
                                if (_C.dateDiff("D", new Date(oi.eDate).pattern("yyyy-MM-dd"), new Date().pattern("yyyy-MM-dd")) > 0) {
                                    sName = "已过期";
                                    tempHtml = tempHtml.replace("{stateTheme}", "default");
                                }
                                tempHtml = tempHtml.replace("{stateTheme}", "success");
                                tempHtml = tempHtml.replace("{btnhide}", "");
                                tempHtml = tempHtml.replace("{state}", sName);
                                tempHtml = tempHtml.replace(/{id}/g, oi.id);
                                tempHtml = tempHtml.replace("{Date}", new Date(oi.sDate).pattern("yyyy-MM-dd") + " 至 " + new Date(oi.eDate).pattern("yyyy-MM-dd"));
                                obj.append(tempHtml);
                            }
                            $(".am-btn-danger").click(function () {
                                var id = $(this).attr("data-id");
                                _SetList.id = id;
                                $("#my-confirm").find(".am-modal-bd").text("确定要取消该提醒吗！");
                                $("#my-confirm").modal("open");
                            });
                        }
                        else {
                            $("#setRemind").click(function () {
                                window.location = "c_index_home.html";
                            });
                        }
                    }
                }
        );
    }
}