var _Fly = {
    sCity: "太原",
    distance: 0,
    cityNum: 0,
    cityType: 0,
    isInter: 0,
    Init: function () {
        _Fly.initLayot();
    },
    initLayot: function () {
        var w = window.screen.width;
        var h = window.screen.height;
        var bgw = w;
        var bgh = parseInt(bgw * 243 / 640);
        $(".inputPanel").css("height", bgh + "px");
        $(".inputPanel").css("width", bgw + "px");
        $(".inputPanel").css("background-size", bgw + "px " + bgh + "px");
        var leftw = parseInt(w / 6.6);
        $(".inputPanel").find("span input").css("margin-left", leftw + "px");
        //$(".inputPanel").find("span select").css("margin-left", leftw + "px");
        var lefth = parseInt(w / 12);
        $(".inputPanel").find("span").eq(0).css("padding-top", lefth + "px");
        lefth = parseInt(w / 10.3);
        $(".inputPanel").find("span").eq(1).css("padding-top", lefth + "px");
        var inputw = parseInt(w / 1.5);
        $(".inputPanel").find("span input").css("width", inputw + "px");
        //$(".inputPanel").find("span select").css("width", inputw + "px");
        var inputh = parseInt(w / 13.5);
        $(".inputPanel").find("span input").css("height", inputh + "px");
        //$(".inputPanel").find("span select").css("height", inputh + "px");
        $(".inputPanel").find("span input").eq(0).click(function () {
            $("#my-actions").modal("open");
        });
        $(".inputPanel").find("span input").eq(1).click(function () {
            $(".inputPanel").find("span input").eq(0).val(_Fly.sCity);
            $("#my-actions-city").modal("open");
        });
        $("#scityList").find("li").click(function () {
            _Fly.sCity = $(this).text();
            $("#my-actions").modal("close");
            $(".inputPanel").find("span input").eq(0).val(_Fly.sCity);
            $(".cityList").find(".num").text("0");
            $(".inputPanel").find("span input").eq(1).val("");
            _Fly.InitCityCode();
        });

        $("#cityListBar").find(".am-u-sm-6").click(function () {
            $("#cityListBar").find(".am-u-sm-6").find("img").remove();
            var cityType = $(this).attr("data-type");
            _Fly.cityType = cityType;
            $(this).append("<img src=\"angleDown.png\" style=\"width:10px;margin-top:-11px;\"/>");
            _Fly.showCity();
        });

        $(".am-btn-warning").click(function () {
            var anum = 0;
            $(".cityList").find("li button").each(function () {
                var num = parseInt($(this).find("span").eq(1).text());
                if (num > 0) {
                    anum++;
                }
            });
            $(".inputPanel").find("span input").eq(1).val("已选" + anum + "个城市");
            _Fly.cityNum = anum;
            _Fly.GetDistance();
        });

        $("#btn_create").click(function () {
            if (_Fly.cityNum > 0 && _Fly.distance > 0) {
                _Fly.AddHB();
            }
            else {
                $("#my-alert").modal("open");
            }
        });

        _Fly.InitCityCode();
        setTimeout(_Fly.InitQrCode, 200);
        setTimeout(_Fly.InitPhoto, 200);
    },
    GetDistance: function () {
        var distance = 0;
        _Fly.isInter = 0;
        $(".cityList").find("li").each(function () {
            var anum = parseInt($(this).find("button span").eq(1).text());
            var d = parseInt($(this).attr("data-long"));
            if (anum > 0) {
                if ($(this).attr("data-type") == "1") {
                    _Fly.isInter = 1;
                }
            }
            distance += anum * d;
        });
        _Fly.distance = distance;
    },
    showCity: function () {
        $(".cityList").find("li").each(function () {
            if ($(this).attr("data-type") == _Fly.cityType) {
                $(this).show();
            }
            else {
                $(this).hide();
            }
        });
        $(".cityList").find("li").eq(0).find("button").focus();
    },
    InitCityCode: function () {
        var temp = $("#template").html();
        $(".cityList").html("");
        $.ajax(
        {
            url: _C.ServerUrl,
            context: document.body,
            dataType: "json",
            cache: false,
            data: { fn: 115,t: new Date() },
            success: function (o) {
                if (o.Return == 0) {
                    if (o.List != null) {
                        var oi = o.List;
                        for (var j = 0; j < oi.length; j++) {
                            th = temp.replace(/{city}/g, oi[j].tCity);
                            th = th.replace(/{cityType}/g, oi[j].cityType);
                            th = th.replace("{fly}", oi[j].d);
                            $(".cityList").append(th);
                        }
                        _Fly.showCity();
                        $(".cityList").find("button").click(function () {
                            var obj = $(this).parent();
                            var num = parseInt(obj.find("span").eq(1).text());
                            num = num + 1;
                            obj.find("span").eq(1).text(num);
                        });

                        $(".cityList").find(".am-icon-minus").click(function () {
                            var obj = $(this).parent().parent();
                            var num = parseInt(obj.find("span").eq(1).text());
                            num = num - 1;
                            if (num < 0) {
                                num = 0;
                            }
                            obj.find("span").eq(1).text(num);
                        });
                    }
                }

            }
        }
        );
    },
    AddHB: function () {
        $("#my-modal-loading").modal("open");
        $.ajax(
        {
            url: _C.ServerUrl,
            context: document.body,
            dataType: "json",
            cache: false,
            data: { fn: 116,isInter:_Fly.isInter,uid:_U.uid,nickName:_U.nickName,cityNum:_Fly.cityNum,distance:_Fly.distance, t: new Date() },
            success: function (o) {
                if (o.Return == 0) {
                    window.location = "a_result.html";
                }

            }
        }
        );
    },
    InitQrCode: function () {
        $.ajax(
        {
            url: _C.ServerUrl,
            context: document.body,
            dataType: "json",
            cache: false,
            data: { fn: 5, uid: _U.uid,t: new Date() },
            success: function (o) {
                if (o.Return == 0) {
                }
            }
        }
        );
    },
    InitPhoto: function () {
        $.ajax(
        {
            url: _C.ServerUrl,
            context: document.body,
            dataType: "json",
            cache: false,
            data: { fn: 4, uid: _U.uid, t: new Date() },
            success: function (o) {
                if (o.Return == 0) {
                }
            }
        }
        );
    }
}


_Fly.Init();
