var _OrderInfo = {
    ShowOrderInfo: function (orderNo, sObj) {
        var htmlHead = "<tr><th width=\"150\">用户</th><th width=\"150\">工号</th><th width=\"150\">时间</th><th>内容</th></tr>";
        var template = "<tr><td>{3}</td><td>{4}</td><td>{1}</td><td>{2}</td></tr>";
        $.ajax(
				    {
				        url: _Init.ServerUrl,
				        context: document.body,
				        dataType: "json",
				        cache: false,
				        data: { fn: 23, orderNo: orderNo, t: new Date() },
				        success: function (o) {
				            if (o.Return == 0) {
				                $("#allPrice").val(o.Info.allPrice);
				                $("#U_O_AllPrice").find("dd div h1 strong").text(o.Info.allPrice);
				                //业务信息
				                $("#O_PayType").find("dd").html(o.Info.payType.toString().replace("0", "微信支付").replace("1", "现金支付").replace("2", "余额支付"));
				                var isPay = "否";
				                if (o.Info.isPay == 1) {
				                    isPay = "是[" + new Date(o.Info.payOn).pattern("yyyy-MM-dd HH:mm") + "]";
				                }
				                if (o.Info.activeName != null) {
				                    if (o.Info.activeName.length > 0) {
				                        $("#O_Active").find("dd").html(o.Info.activeName);
				                    }
				                }
				                try{
				                    $("#text_orderId").text("[ 订单编号：" + o.Info.id + " ]");
				                }
                                catch(ex){}
				                $("#O_IsPay").find("dd").html(isPay);
				                $("#O_State").find("dd").html(_Init.getState(o.Info.state));
				                $("#P_OrderNo").html(o.Info.orderNo + "&nbsp;&nbsp;&nbsp;编号：" + o.Info.id);
				                $("#O_Service").find("dd").html(o.Info.serviceId.toString().replace("1", "鲜花配送").replace("2", "鲜花配送"));
				                //$("#O_IsVisit").find("dd").html(o.Info.isVisit.toString().replace("1", "是").replace("0", "否"));
				                $("#O_TestOn").find("dd").html(new Date(o.Info.getDate).pattern("yyyy-MM-dd") + "," + o.Info.getTime.toString().replace("-", "点-") + "点");
				                $("#O_AllPrice").text(o.Info.allPrice);

				                //用户信息
				                $("#O_Contact").find("dd").html(o.Info.contact + "&nbsp;");
				                $("#O_Tel").find("dd").html(o.Info.tel);
				                if (o.Info.addr.length > 0) {
				                    $("#O_Addr").find("dd").html(o.Info.addr.toString().replace("^", ""));
				                }
				                if (o.Info.memo.length > 0) {
				                    $("#O_Memo").find("dd").html(o.Info.memo);
				                }
				                if (o.Info.getWorker != null && o.Info.getWorker.toString().length > 0) {
				                    $("#O_GetWorker").find("dd").html("["+o.Info.getWorkerName+"]"+o.Info.getWorkerTel);
				                }
				                if (o.Info.sendWorker != null && o.Info.sendWorker.toString().length > 0) {
				                    $("#O_SendWorker").find("dd").html("["+o.Info.sendWorkerName+"]"+o.Info.sendWorkerTel);
				                }
				                //产品信息
				                $("#O_ShoesNum").find("dd").html(o.Info.shoesNum + "双");

				                var tempHtml = "";
				                if (o.Info.log != null) {
				                    $("#Log_List").html(htmlHead);
				                    for (var i = 0; i < o.Info.log.length; i++) {
				                        var oi = o.Info.log[i];
				                        tempHtml = template.replace("{2}", oi.content);
				                        tempHtml = tempHtml.replace("{1}", new Date(oi.addOn).pattern("yyyy-MM-dd HH:mm"));
				                        if (oi.lType == 0 || oi.lType == 3) {
				                            tempHtml = tempHtml.replace("{3}", oi.uName);
				                        }
				                        else {
				                            tempHtml = tempHtml.replace("{3}", "--");
				                        }
				                        if (oi.lType == 1 || oi.lType == 2) {
				                            tempHtml = tempHtml.replace("{4}", oi.eName);
				                        }
				                        else {
				                            tempHtml = tempHtml.replace("{4}", "--");
				                        }
				                        $("#Log_List").append(tempHtml);
				                    }
				                }
				                $("#ImgList").html("<div style=\"height:70px;\">无</div>");
				                $("#ImgList_Over").html("<div style=\"height:70px;\">无</div>");
				                if (o.Info.la != null) {
				                    $("#ImgList").html("");
				                    $("#ImgList_Over").html("");
				                    for (var i = 0; i < o.Info.la.length; i++) {
				                        if (o.Info.la[i].aType == 3) {
				                            $("#ImgList_Over").append("<img title=\"" + o.Info.la[i].aSrc + "\" src=\"" + _Init.BaseUrl + o.Info.la[i].aSrc + "\" data-toggle=\"click\" data-target=\"#mydialog_pic\" data-mask=\"1\" data-width=\"540\" width=\"70\" height=\"70\" class=\"img-border radius-small padding-little\" />");
				                        }
				                        else {
				                            $("#ImgList").append("<img title=\"" + o.Info.la[i].aSrc + "\" src=\"" + _Init.BaseUrl + o.Info.la[i].aSrc + "\" data-toggle=\"click\" data-target=\"#mydialog_pic\" data-mask=\"1\" data-width=\"540\" width=\"70\" height=\"70\" class=\"img-border radius-small padding-little\" />");
				                        }
				                    }
				                }
				                $showdialogs(sObj);
				            }
				            else {
				            }
				        }
				    }
		    );
    }
}