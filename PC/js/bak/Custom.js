var _Custom = {
    Default_Page_Size: 100,
    Page_Now: 1,
    id: 0,
    init: function () {
        var NowDate = new Date().pattern("yyyy-MM-dd");
        //$('#DateS').val(NowDate);
        $('#DateE').val(NowDate);
        $('#DateS').datetimepicker({
            lang: 'ch',
            timepicker: false,
            format: 'Y-m-d',
            formatDate: 'Y-m-d'
        });
        $('#DateE').datetimepicker({
            lang: 'ch',
            timepicker: false,
            format: 'Y-m-d',
            formatDate: 'Y-m-d'
        });
        $("#btn_save").unbind().bind("click", function () {
            _Custom.AddFlower();
        });
        $("#btn_showAdd").click(function () {
            $("#panel_add").show();
            $("#panel_select").hide();
            $(".tab").hide();
        });
        $("#btn_Cancel").click(function () {
            _Custom.id = 0;
            $("#fName_a").val("");
            $("#mobile_a").val("");
            $("#contact_a").val("");
            $("#tel_a").val("");
            $("#City_a").val("");
            $("#wxNo_a").val("");
            $("#Area_a").val("");
            $("#addr_a").val("");
            $("#btn_save").text("添加美容院");
            $("#panel_add").hide();
            $("#panel_select").show();
            $(".tab").show();
        });
        _Custom.getUserList(1);
    },
    AddFlower: function () {
        var fName = $("#fName_a").val();
        var contact = $("#contact_a").val();
        var mobile = $("#mobile_a").val();
        var tel = $("#tel_a").val();
        var wxNo = $("#wxNo_a").val();
        var area = $("#Area_a").val();
        var addr = $("#addr_a").val();
        var cityId = $("#City_a").val();
        if (fName.length == 0 || contact.length == 0 || mobile.length == 0 || addr.length == 0 || area.length == 0) {
            alert("请填写完整再提交！")
            return;
        }
        $.ajax(
                {
                    url: _Init.ServerUrl,
                    context: document.body,
                    dataType: "json",
                    cache: false,
                    data: { fn: 56, id: _Custom.id, cityId:cityId,fName: escape(fName), contact: escape(contact), mobile: mobile, tel: tel, wxNo: wxNo, area: escape(area), addr: escape(addr), t: new Date() },
                    success: function (o) {
                        alert(o.Msg);
                        if (o.Return == 0) {
                            $("#fName_a").val("");
                            $("#mobile_a").val("");
                            $("#contact_a").val("");
                            $("#tel_a").val("");
                            $("#wxNo_a").val("");
                            $("#Area_a").val("");
                            $("#addr_a").val("");
                            $("#btn_save").text("添加美容院");
                            _Custom.id = 0;
                            $("#panel_add").hide();
                            $("#panel_select").show();
                            $(".tab").show();
                            _Custom.getUserList(1);
                        }
                    }
                }
        );
    },
    showInfo: function (id, info) {
        _Custom.id = id;
        var para = info.toString().split("@");
        $("#fName_a").val(para[0]);
        $("#mobile_a").val(para[2]);
        $("#contact_a").val(para[1]);
        $("#tel_a").val(para[3]);
        $("#wxNo_a").val(para[6]);
        $("#City_a").val(para[7]);
        $("#Area_a").val(para[4]);
        $("#addr_a").val(para[5]);
        $("#btn_save").text("确认修改");
        $("#panel_add").show();
        $("#panel_select").hide();
        $(".tab").hide();
    },
    delFlower: function (id) {
        if (!confirm("确定要删除该美容院！")) {
            return;
        }
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 57, id: id, t: new Date() },
				    success: function (o) {
				        alert(o.Msg);
				        if (o.Return == 0) {
				            _Custom.getUserList(_Custom.Page_Now);
				        }
				    }
				}
		);
    },
    SumPage: function (page) {
        _Custom.getUserList(page);
    },
    getUserList: function (page) {
        //_UserInfo.hideUserInfo();
        _Custom.Page_Now = page;
        var htmlHead = "<tr><th width=\"60\">编号</th><th width=\"60\">城市</th><th width=\"80\">区域</th><th width=\"120\">店名</th><th width=\"80\">注册日期</th><th width=\"80\">姓名</th><th width=\"100\">手机号码</th><th width=\"200\">地址</th><th width=\"90\">下单数量</th><th width=\"120\">详情</th></tr>";
        var template = "<tr class=\"{c}\"><td>{11}</td><td>{10}</td><td>{6}</td><td>{1}</td><td>{2}</td><td>{3}</td><td>{4}</td><td>{7}</td><td>{8}</td><td>{9}</td></tr>";
        var btnTemplate = "<button class=\"button button-small border-main\" onclick=\"_Custom.showInfo({id},'{info}');\">修改</button>&nbsp;<button class=\"button button-small border-dot\" onclick=\"_Custom.delFlower({id});\">删除</button>";
        var DateS = $("#DateS").val();
        var DateE = $("#DateE").val();
        var Mobile = $("#Mobile").val();
        var Contact = $("#Contact").val();
        var Isorder = $("#Isorder").val();
        $("#UserList").html("正在载入.....");
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 55, Isorder:Isorder,Contact: escape(Contact), Mobile: Mobile, DateE: DateE, DateS: DateS, page: page, t: new Date() },
				    success: function (o) {
				        if (o.Return == 0) {
				            $("#UserList").html(htmlHead);
				            var tempHtml = "";
				            var cName = "current";
				            var isReg = "";
				            for (var i = 0; i < o.List.length; i++) {
				                cName = "current";
				                if (i % 2 == 1) {
				                    cName = "blue";
				                }
				                var oi = o.List[i];
				                isReg = "";
				                if (oi.isReg == 1) {
				                    isReg = "<span class=\"tag bg-dot\">已认证</span>";
				                }
				                tempHtml = template.replace("{1}", isReg+oi.fName);
				                tempHtml = tempHtml.replace("{2}", new Date(oi.addOn).pattern("yyyy-MM-dd HH:mm"));
				                tempHtml = tempHtml.replace("{3}", oi.contact);
				                tempHtml = tempHtml.replace("{11}", oi.id);
					            tempHtml = tempHtml.replace("{4}", oi.mobile + "<br/><span class=\"tag bg-green-light\">验证码：" + oi.code + "</span>");
				                tempHtml = tempHtml.replace("{5}", oi.tel);
				                tempHtml = tempHtml.replace("{6}", oi.area);
				                tempHtml = tempHtml.replace("{7}", oi.addr);
				                tempHtml = tempHtml.replace("{8}", oi.wxNo.replace("0", "<span class=\"tag bg-sub\">未下单</span>"));
				                tempHtml = tempHtml.replace("{10}", oi.cityId.toString().replace("1","太原"));
				                tempHtml = tempHtml.replace("{9}", btnTemplate.replace(/{id}/g, oi.id).replace("{info}", oi.fName + "@" + oi.contact + "@" + oi.mobile + "@" + oi.tel + "@" + oi.area + "@" + oi.addr + "@" + oi.wxNo + "@" + oi.cityId));
				                tempHtml = tempHtml.replace("{c}", cName);
				                $("#UserList").append(tempHtml);
				            }
				            _Init.ShowPage(page, o.Msg, "_Custom", _Custom.Default_Page_Size);
				            //_UserList.ShowPage(page, o.Msg);
				        }
				        else {
				            $("#UserList").html("无记录");
				            $("#PagePanel").hide();
				        }
				    }
				}
		);
    }
}