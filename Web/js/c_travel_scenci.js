var _Book = null;
var _Travel = {
    scenicId: "",
    Init: function () {
        _Travel.scenicId = _C.getParam("scenicId");
        if (_Travel.scenicId.length > 0) {
            _Travel.InitInfoForJson();
        }
    },
    InitInfoForJson: function () {
        var template = $("#template").html();
        $(".card-list").html("");
        $.showLoading();
        $.ajax(
        {
            url: "/service/travelHandler.ashx",
            context: document.body,
            dataType: "json",
            cache: false,
            data: { fn: 11, scenicId: _Travel.scenicId, t: new Date() },
            success: function (o) {

                $.hideLoading();
                if (o.errorCode == 231000) {
                    var Info = o.data;
                    if (Info != null) {
                        $(".topTitle").text(Info.scenicName);
                        $("img").eq(0).attr("src", Info.defaultPic);
                        $(".rightT").eq(0).text(Info.scenicName);
                        $(".rightT").eq(1).text(Info.scenicAddress);
                        $(".rightT").eq(2).text(Info.openTime);
                        var obj = Info.ticketList;
                        if (obj.length == 0) {
                            obj = Info.disTickets;
                        }
                        _Book = Info.bookNotice;
                        if (obj != null) {
                            var tempHtml = "";
                            for (var i = 0; i < obj.length; i++) {
                                var oi = obj[i];
                                tempHtml = template.replace("{productName}", oi.productName);
                                tempHtml = tempHtml.replace("{salePrice}", oi.salePrice);
                                tempHtml = tempHtml.replace("{webPrice}", oi.webPrice);
                                tempHtml = tempHtml.replace(/{productId}/g, oi.productId);
                                $(".card-list").append(tempHtml);
                            }
                            $(".weui-btn_primary").click(function () {
                                var productId = $(this).attr("data-id");
                                window.location = "c_travel.html?scenicId=" + _Travel.scenicId + "&productID=" + productId;
                            });
                            $(".weui-btn_default").click(function () {
                                _Travel.initBook();
                            });
                        }
                    }
                }
            }
        }
        );
    },
    initBook: function () {
        if (_Book != null) {
            var book = "";
            if (_Book.length > 0) {
                var iObj = eval(_Book);
                for (var i = 0; i < iObj.length; i++) {
                    var bi = iObj[i];
                    if (bi.name.indexOf("途牛") > -1 || bi.value.indexOf("途牛") > -1) { continue; }
                    if (bi.name.indexOf("驴妈妈") > -1 || bi.value.indexOf("驴妈妈") > -1) { continue; }
                    book += "<strong>" + bi.name + "</strong>:" + unescape(bi.value) + "<br>";
                }
                $("#bookNotice").find("div").eq(1).html(book);
                $("#bookNotice").show();
                $(".weui-icon-cancel").click(function () {
                    $("#bookNotice").hide();
                });
            }
        }
    },
    InitInfo: function () {
        var template = $("#template").html();
        $(".card-list").html("");
        $.ajax(
        {
            url: "/service/travelHandler.ashx",
            context: document.body,
            dataType: "json",
            cache: false,
            data: { fn: 3, scenicId: _Travel.scenicId, t: new Date() },
            success: function (o) {
                if (o.Return == 0) {
                    if (o.Info != null) {
                        $(".topTitle").text(o.Info.scenicName);
                        $("img").eq(0).attr("src", o.Info.newPicUrl);
                        $(".rightT").eq(0).text(o.Info.scenicName);
                        $(".rightT").eq(1).text(o.Info.address);
                        $(".rightT").eq(2).text(o.Info.bizTime);
                        var obj = o.Info.ticketList;
                        if (obj.length == 0) {
                            obj = o.Info.disTickets;
                        }
                        if (obj != null) {
                            var tempHtml = "";
                            for (var i = 0; i < obj.length; i++) {
                                var oi = obj[i];
                                tempHtml = template.replace("{productName}", oi.productName);
                                tempHtml = tempHtml.replace("{salePrice}", oi.salePrice);
                                tempHtml = tempHtml.replace("{webPrice}", oi.webPrice);
                                tempHtml = tempHtml.replace(/{productId}/g, oi.productId);
                                $(".card-list").append(tempHtml);
                            }
                            $(".weui-btn_primary").click(function () {
                                var productId = $(this).attr("data-id");
                                window.location = "c_travel.html?scenicId=" + _Travel.scenicId + "&productID=" + productId;
                            });
                        }
                    }
                }

            }
        }
        );
    }
}


_Travel.Init();
