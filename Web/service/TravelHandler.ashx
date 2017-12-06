<%@ WebHandler Language="C#" Class="TravelHandler" %>

using System;
using System.Web;
using Travel;
using Travel.Order;
using Travel.View;
using Data;
using Model;
using LitJson;
using System.Collections.Generic;
using System.Text;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using NPinyin;
using Seascape.WxApi;
using com.seascape.tools;

public class TravelHandler : IHttpHandler {
    //微信支付商户
    public static string mch_id = com.seascape.tools.BasicTool.GetConfigPara("mch_id");
    //微信支付接收返回地址
    public static string notify_url = com.seascape.tools.BasicTool.GetConfigPara("notify_url");
    //微信支付提交服务器IP
    public static string client_ip = com.seascape.tools.BasicTool.GetConfigPara("client_ip");
    //微信支付密钥
    public static string keyValue = com.seascape.tools.BasicTool.GetConfigPara("keyValue");
    public static string HjKeyValue = "Seascape.Fast.Fix";
    //微信公众号相关
    public static string appid = com.seascape.tools.BasicTool.GetConfigPara("appid-0000");
    public string BaseUrl = "http://hjhk.edmp.cc/";
    
    public void ProcessRequest (HttpContext c) {
        int F = string.IsNullOrEmpty(c.Request["fn"]) ? 0 : Convert.ToInt16(c.Request["fn"]);
        c.Response.ContentType = "text/plain";
        AddQueryLog(c);
        c.Response.Write(GetResult(F, c));
    }

    /// <summary>
    /// 功能导航
    /// </summary>
    /// <param name="f"></param>
    /// <returns></returns>
    public string GetResult(int f, HttpContext c)
    {
        string Result = "";
        try
        {
            switch (f)
            {
                case 1:
                    Result = GetScenicList(c);//获取景区列表
                    break;
                case 2:
                    Result = GetProductInfo(c);//获取门票详情
                    break;
                case 3:
                    Result = GetScenicInfo(c);//获取景区详情
                    break;
                case 4:
                    Result = CreateOrder(c);//创建订单
                    break;
                case 5:
                    Result = orderStatus(c);//查询订单状态
                    break;
                case 6:
                    Result = submitOrder(c);//出票
                    break;
                case 7:
                    Result = cancelOrder(c);//取消订单
                    break;
                case 8:
                    Result = canRefund(c);//查询订单是否可退
                    break;
                case 9:
                    Result = tuiPiao(c);//提交退票申请
                    break;
                case 10:
                    Result = GetScenicListForJson(c);//获取景区JSON列表
                    break;
                case 11:
                    Result = GetScenicInfoForJson(c);//获取景区详情JSON接口
                    break;
                case 12:
                    Result = GetOrderList(c);//获取订单列表
                    break;
                case 13:
                    Result = GetOrderInfo(c);//获取订单详情
                    break;
                case 14:
                    Result = GetPayInfo(c);//获取支付字符串
                    break;
                case 101:
                    Result = "{\"success\": true,\"msg\": \"成功执行\",\"errorCode\": 200}";
                    break;
            }
        }
        catch (Exception e)
        {
            Result = e.Message.ToString();
        }
        new Data.Main().AddTestLog(f.ToString(), Result);
        return Result;
    }

    /// <summary>
    /// 按区域获取景区列表
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string GetScenicListForJson(HttpContext c)
    {
        string gtp = "";
        //string paras = "{\"requestHead\": {\"digitalSign\": \"2201503d5e539be5ee249a85abfcfdff\",\"agentAccount\": \"bc083ca5-4f37-40f0-9fc6-638f5d920981\"},\"requestBody\": {\"pageSize\": 10,\"pageIndex\": 1,\"sceneryId\": 41,\"provinceId\": 16,\"cityId\": 226}}";
        //gtp = new _Travel().GetTravelResult(paras, "http://jqapi.lvcang.cn/jingqu/Services/GetSceneryListService.ashx");
        int page = string.IsNullOrEmpty(c.Request["page"]) ? 1 : Convert.ToInt16(c.Request["page"]);
        string city = string.IsNullOrEmpty(c.Request["city"]) ? "" : c.Request["city"];
        if (c.Cache["Scenci_" + city] != null)
        {
            gtp = (string)c.Cache["Scenci_" + city];
        }
        else
        {
            gtp = new scenicList().GetScenicList(city, page, 500);
            c.Cache.Add("Scenci_" + city, gtp, null, System.DateTime.UtcNow.AddDays(1), TimeSpan.Zero, System.Web.Caching.CacheItemPriority.Normal, null);            
        }
        
        return gtp;
    }
    
    /// <summary>
    /// 获取景区列表-入库
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string GetScenicList(HttpContext c)
    {
        string gtp = "";
        //string paras = "{\"requestHead\": {\"digitalSign\": \"2201503d5e539be5ee249a85abfcfdff\",\"agentAccount\": \"bc083ca5-4f37-40f0-9fc6-638f5d920981\"},\"requestBody\": {\"pageSize\": 10,\"pageIndex\": 1,\"sceneryId\": 41,\"provinceId\": 16,\"cityId\": 226}}";
        //gtp = new _Travel().GetTravelResult(paras, "http://jqapi.lvcang.cn/jingqu/Services/GetSceneryListService.ashx");
        int page = string.IsNullOrEmpty(c.Request["page"]) ? 1 : Convert.ToInt16(c.Request["page"]);
        string city = string.IsNullOrEmpty(c.Request["city"]) ? "" : c.Request["city"];
        gtp = new scenicList().GetScenicList(city, page, 500);
        int sNum = 0;
        int pNum = 0;
        JObject jo = (JObject)JsonConvert.DeserializeObject(gtp);
        string errorCode = jo["errorCode"].ToString();
        if (errorCode == "231000")
        {
            string rows = jo["data"]["rows"].ToString();
            List<scenic> ls = new List<scenic>();
            ls = Newtonsoft.Json.JsonConvert.DeserializeObject<List<scenic>>(rows);
            List<string> sqlList = null;
            try
            {
                foreach (scenic item in ls)
                {
                    sqlList = new List<string>();
                    try 
                    {
                        if (new _Travel().GetScenciCount(item.scenicId, 0) == 0)
                        {
                            sqlList.Add("insert into t_travel_scenic(scenicId,scenicName,newPicUrl,address,bizTime,glocation,blocation,addOn) values('" + item.scenicId + "','" + item.scenicName + "','" + item.newPicUrl + "','" + item.address + "','" + item.bizTime + "','" + item.glocation + "','" + item.blocation + "','" + DateTime.Now + "')");
                            sNum++;
                        }
                    }
                    catch (Exception e)
                    {
                        return e.Message;
                    }
                    if (item.ticketList != null)
                    {
                        foreach (tickets it in item.ticketList)
                        {
                            try
                            {
                                if (new _Travel().GetScenciCount(item.scenicId, it.productId) == 0)
                                {
                                    sqlList.Add("insert into t_travel_tickets(scenicId,productId,productName,webPrice,salePrice,tType,addOn) values('" + item.scenicId + "','" + Convert.ToInt32(it.productId) + "','" + it.productName + "','" + Convert.ToDouble(it.webPrice) + "','" + Convert.ToDouble(it.salePrice) + "',0,'" + DateTime.Now + "')");
                                    pNum++;
                                }
                            }
                            catch (Exception e)
                            {
                                return e.Message;
                            }
                        }
                    }

                    if (item.disTickets != null)
                    {
                        foreach (tickets it in item.disTickets)
                        {
                            try
                            {
                                if (new _Travel().GetScenciCount(item.scenicId, it.productId) == 0)
                                {
                                    sqlList.Add("insert into t_travel_tickets(scenicId,productId,productName,webPrice,salePrice,tType,addOn) values('" + item.scenicId + "','" + Convert.ToInt32(it.productId) + "','" + it.productName + "','" + Convert.ToDouble(it.webPrice) + "','" + Convert.ToDouble(it.salePrice) + "',1,'" + DateTime.Now + "')");
                                    pNum++;
                                }
                            }
                            catch (Exception e)
                            {
                                return e.Message;
                            }

                        }
                    }

                    if (sqlList.Count > 0)
                    {
                        new Travel.Main().ExecForSql(sqlList);
                    }
                } 
            }
            catch (Exception e)
            {
                return e.Message;
            }
        }

        return sNum + "--" + pNum;
    }

    /// <summary>
    /// 获取景区详情
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string GetScenicInfo(HttpContext c)
    {
        string scenicId = string.IsNullOrEmpty(c.Request["scenicId"]) ? "" : c.Request["scenicId"];
        scenic sc = new _Scenic().GetScenicInfo(scenicId);
        if (sc != null)
        {
            var o = new { Return = 0, Msg = "", Info = sc };
            return JsonMapper.ToJson(o);
        }
        return Sys_Result.GetR(1, "");
    }

    /// <summary>
    /// 获取景区详情接口JSON
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string GetScenicInfoForJson(HttpContext c)
    {
        string scenicId = string.IsNullOrEmpty(c.Request["scenicId"]) ? "" : c.Request["scenicId"];
        string gtp = "";
        if (c.Cache["Scenci_" + scenicId] != null)
        {
            gtp = (string)c.Cache["Scenci_" + scenicId];
        }
        else
        {
            gtp = new scenicInfo().GetScenicInfo(scenicId);
            c.Cache.Add("Scenci_" + scenicId, gtp, null, System.DateTime.UtcNow.AddHours(12), TimeSpan.Zero, System.Web.Caching.CacheItemPriority.Normal, null);
        }
        return gtp;
    }
    
    /// <summary>
    /// 获取门票详情
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string GetProductInfo(HttpContext c)
    {
        string gtp = "";
        int productId = string.IsNullOrEmpty(c.Request["productId"]) ? 0 : Convert.ToInt32(c.Request["productId"]);
        gtp = new productInfo().GetProductInfo(productId);
        return gtp;
    }

    /// <summary>
    /// 创建订单
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string CreateOrder(HttpContext c)
    {
        string co = "";
        int uId = string.IsNullOrEmpty(c.Request["uId"]) ? 0 : Convert.ToInt32(c.Request["uId"]);
        string contactName = string.IsNullOrEmpty(c.Request["contactName"]) ? "" : c.Request["contactName"];
        string contactTel = string.IsNullOrEmpty(c.Request["contactTel"]) ? "" : c.Request["contactTel"];
        string scenicId = string.IsNullOrEmpty(c.Request["scenicId"]) ? "" : c.Request["scenicId"];
        int productId = string.IsNullOrEmpty(c.Request["productId"]) ? 0 : Convert.ToInt32(c.Request["productId"]);
        int bookNumber = string.IsNullOrEmpty(c.Request["bookNumber"]) ? 0 : Convert.ToInt16(c.Request["bookNumber"]);
        string startTime = string.IsNullOrEmpty(c.Request["startTime"]) ? "" : c.Request["startTime"];
        Double price = string.IsNullOrEmpty(c.Request["price"]) ? 0 : Convert.ToDouble(c.Request["price"]);
        Double allPrice = price * bookNumber;
        user u = new _User().GetUser("", "", uId);
        if (u != null)
        {
            string orderNo = "MP" + DateTime.Now.ToString("yyMMddHHmmss") + uId.ToString().PadLeft(5, '0');
            createOrderBack cob = new createOrderBack();
            
            try
            {
                co = new createOrderNew().CreateOrder(orderNo, productId, startTime, bookNumber, contactName, contactTel);
                cob = Newtonsoft.Json.JsonConvert.DeserializeObject<createOrderBack>(co);
                if (cob.errorCode == 231000)
                {
                    if (cob.data.orderId > 0)
                    {
                        travelOrder to = new travelOrder
                        {
                            orderId = cob.data.orderId,
                            orderNo = orderNo,
                            uId = uId,
                            addOn = DateTime.Now,
                            contact = contactName,
                            mobile = contactTel,
                            fareNum = bookNumber,
                            productId = productId,
                            scenicId = scenicId,
                            ticketPrice = price,
                            ticketOn = Convert.ToDateTime(startTime),
                            totalPrice = allPrice
                        };
                        if (new Travel.Main().AddToDb(to, "t_travel_order"))
                        {
                            travelLog tLog = new travelLog
                            {
                                addOn = DateTime.Now,
                                content = "提交订单",
                                uId = uId,
                                lType = 0,
                                orderNo = to.orderNo
                            };
                            new Train.Main().AddToDb(tLog, "t_travel_log");
                            var o = new { Return = 0, Msg = to.orderNo, orderId = to.orderId.ToString() };
                            return JsonMapper.ToJson(o);
                            //return Sys_Result.GetR(0, to.orderId.ToString());
                        }
                    }
                }
                else
                {
                    JObject jo = (JObject)JsonConvert.DeserializeObject(co);
                    string msg = jo["msg"].ToString();
                    return Sys_Result.GetR(1, msg);
                }
            }
            catch
            {
                
            }
            
        }
        return Sys_Result.GetR(1, "下单失败，请稍后再试");
    }

    /// <summary>
    /// 获取订单列表
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string GetOrderList(HttpContext c)
    {
        int uid = string.IsNullOrEmpty(c.Request["uid"]) ? 0 : Convert.ToInt32(c.Request["uid"].ToString());
        user u = new _User().GetUser("", "", uid);
        if (u != null)
        {
            List<travelOrderInfo> lt = new _TravelOrder().GetTravelOrderList(uid);
            var o = new { Return = 0, Msg = "", List = lt };
            return JsonMapper.ToJson(o);
        }

        return Sys_Result.GetR(1, "获取失败");
    }

    /// <summary>
    /// 获取订单详情
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string GetOrderInfo(HttpContext c)
    {
        int uid = string.IsNullOrEmpty(c.Request["uid"]) ? 0 : Convert.ToInt32(c.Request["uid"].ToString());
        string OrderNo = c.Request["OrderNo"] == null ? "" : c.Request["OrderNo"].ToString();
        user u = new _User().GetUser("", "", uid);
        if (u != null && OrderNo.Length > 0)
        {
            travelOrderInfo lt = new _TravelOrder().GetTravelOrderInfo(OrderNo);
            var o = new { Return = 0, Msg = "", Info = lt };
            return JsonMapper.ToJson(o);
        }

        return Sys_Result.GetR(1, "获取失败");
    }
    
    /// <summary>
    /// 获取订单状态
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string orderStatus(HttpContext c)
    {
        string gtp = "";
        int orderId = string.IsNullOrEmpty(c.Request["orderId"]) ? 0 : Convert.ToInt32(c.Request["orderId"]);
        gtp = new orderStatus().GetOrderStatus(orderId);
        return gtp;
    }

    /// <summary>
    /// 出票
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string submitOrder(HttpContext c)
    {
        string gtp = "";
        int orderId = string.IsNullOrEmpty(c.Request["orderId"]) ? 0 : Convert.ToInt32(c.Request["orderId"]);
        string pay = string.IsNullOrEmpty(c.Request["pay"]) ? "" : c.Request["pay"];
        gtp = new submitOrder().ToSubmitOrder(orderId, pay);
        return gtp;
    }

    /// <summary>
    /// 取消订单
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string cancelOrder(HttpContext c)
    {
        string gtp = "";
        int orderId = string.IsNullOrEmpty(c.Request["orderId"]) ? 0 : Convert.ToInt32(c.Request["orderId"]);
        string orderNo = string.IsNullOrEmpty(c.Request["orderNo"]) ? "" : c.Request["orderNo"];
        string remark = string.IsNullOrEmpty(c.Request["remark"]) ? "" : c.Request["remark"];
        gtp = new cancelOrder().ToCancelOrder(orderId, remark);
        JObject jo = (JObject)JsonConvert.DeserializeObject(gtp);
        string errorCode = jo["errorCode"].ToString();
        if (errorCode == "231000")
        {
            var o = new
            {
                state = 9
            };
            new Travel.Main().UpdateDb(o, "t_travel_order", "orderId = " + orderId);


            wxPay wp = new Data._WxPay().GetWxPay(orderNo);
            if (wp != null)
            {
                WxPayRefund wr = new WxPayRefund
                {
                    addOn = DateTime.Now,
                    appid = appid,
                    mch_id = mch_id,
                    nonce_str = com.seascape.tools.BasicTool.MD5(DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + new Random().Next(1000, 9999).ToString()),
                    total_fee = Convert.ToInt32(wp.total_fee),
                    out_refund_no = wp.out_trade_no,
                    out_trade_no = wp.out_trade_no,
                    transaction_id = wp.transaction_id,
                    refundOn = DateTime.Now,
                    refund_fee = Convert.ToInt32(wp.total_fee),
                    op_user_id = mch_id,
                    OrderNo = orderNo,
                    KeyValue = keyValue
                };

                wr.out_refund_no = wr.out_refund_no + "_" + DateTime.Now.ToString("MdHHmmss");

                string r = "";
                string errMsg = "";
                try
                {
                    errMsg = new WxPayRefund().WxRefund(wr, out r);
                }
                catch
                {
                    errMsg = "退款失败";
                }
                wr.errMsg = errMsg;
                if (errMsg == "0")
                {
                    errMsg = "提交成功";
                }
                if (new Data.Main().AddToDb(wr, "t_wxpay_refund"))
                {
                    if (wr.errMsg == "0")
                    {
                        AddLog(orderNo, "退票完成，执行退款申请，退款金额：" + Math.Round(Convert.ToDouble(wr.total_fee), 2).ToString() + "元,退款申请结果：" + errMsg, 0);
                    }
                    else
                    {
                        AddLog(orderNo, "退票失败" + errMsg, 0);
                    }
                }

            }
        }
        return gtp;
    }

    /// <summary>
    /// 查询订单是否可退
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string canRefund(HttpContext c)
    {
        string gtp = "";
        int orderId = string.IsNullOrEmpty(c.Request["orderId"]) ? 0 : Convert.ToInt32(c.Request["orderId"]);
        gtp = new canRefund().GetCanRefund(orderId);
        return gtp;
    }

    /// <summary>
    /// 提交退票
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string tuiPiao(HttpContext c)
    {
        string gtp = "";
        int orderId = string.IsNullOrEmpty(c.Request["orderId"]) ? 0 : Convert.ToInt32(c.Request["orderId"]);
        int causeType = string.IsNullOrEmpty(c.Request["causeType"]) ? 0 : Convert.ToInt32(c.Request["causeType"]);
        string causeContent = string.IsNullOrEmpty(c.Request["causeContent"]) ? "" : c.Request["causeContent"];
        gtp = new tuiPiao().ToTuiPiao(orderId, causeType, causeContent);
        return gtp;
    }


    /// <summary>
    /// 获取支付相关信息--字符串
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string GetPayInfo(HttpContext c)
    {
        string OrderNo = c.Request["OrderNo"] == null ? "" : c.Request["OrderNo"].ToString();
        int uid = string.IsNullOrEmpty(c.Request["uid"]) ? 0 : Convert.ToInt32(c.Request["uid"]);
        string openId = c.Request["openId"] == null ? "" : c.Request["openId"].ToString();
        WxPay.WxPayConfig wc = OperPay(OrderNo, "", uid, openId);
        if (wc != null)
        {
            return wc.appid + "|" + wc.nonce + "|" + wc.package + "|" + wc.signature + "|" + wc.timestamp;
        }
        else
        {
            return "";
        }
    }

    /// <summary>
    /// 处理支付
    /// </summary>
    /// <param name="OrderNo"></param>
    /// <param name="prepayID"></param>
    /// <returns></returns>
    public WxPay.WxPayConfig OperPay(string OrderNo, string prepayID, int uid, string openId)
    {
        WxPay.WxPayConfig wp = null;
        //OrderInfo o = OrderInfo(OrderNo, uid);
        Double price = new _TravelOrder().GetOrderPrice(OrderNo);
        string srcNo = OrderNo;
        if (price > 0)
        {
            string body = "山西出行";
            user u = new _User().GetUser("", "", uid);
            if (openId.Length == 0)
            {
                openId = u.openId;
            }
            if (u == null)
            {
                return null;
            }
            if (openId.Length == 0)
            {
                openId = u.exOpenID;
            }
            if (openId.Length == 0)
            {
                openId = u.openId;
            }
            if (prepayID.Length == 0)
            {
                WxPay w = new WxPay();
                w.appid = appid;
                w.body = body;
                w.detail = body;
                w.mch_id = mch_id;
                w.nonce_str = BasicTool.MD5(OrderNo + DateTime.Now).ToUpper();
                w.notify_url = notify_url;
                w.openid = openId;
                w.out_trade_no = OrderNo + "s" + new Random().Next(100, 999);
                w.spbill_create_ip = client_ip;
                w.total_fee = Convert.ToInt32(price * 100);
                w.KeyValue = keyValue;
                w.trade_type = "JSAPI";
                w.attach = BasicTool.MD5(OrderNo + HjKeyValue).ToUpper();
                string errMsg = "";
                prepayID = new WxPay().Get_prepay_id(w, out errMsg);
                if (prepayID.Length > 0)
                {
                    wxPay p = new wxPay
                    {
                        orderNo = OrderNo,
                        payOn = DateTime.Now,
                        payServiceId = prepayID,
                        price = price,
                        returnMsg = "",
                        state = 0,
                        extNo = srcNo
                    };
                    new Train.Main().AddToDb(p, "t_wxPay");
                }
            }

            if (prepayID.Length > 0)
            {
                return new WxPay().Get_Config_Pay("prepay_id=" + prepayID, appid, keyValue);
            }
        }
        return wp;
    }

    /// <summary>
    /// 添加参数日志
    /// </summary>
    /// <param name="c"></param>
    public void AddQueryLog(HttpContext c)
    {
        int F = string.IsNullOrEmpty(c.Request["fn"]) ? 0 : Convert.ToInt16(c.Request["fn"]);
        new Data.Main().AddTestLog_B("[M]F", F.ToString());
        string Query = "";
        foreach (string p in c.Request.Params.AllKeys)
        {
            Query += p + ":" + c.Request[p].ToString() + "&";
            if (p.IndexOf("ALL_HTTP") != -1)
            {
                break;
            }
        }
        new Data.Main().AddTestLog_B("[M]Query-" + F.ToString(), Query.ToString());
    }

    /// <summary>
    /// 添加日志
    /// </summary>
    /// <param name="OrderNo"></param>
    /// <param name="Content"></param>
    /// <param name="uid"></param>
    /// <param name="cid"></param>
    /// <param name="aid"></param>
    public void AddLog(string OrderNo, string Content, int uid)
    {
        travelLog l = new travelLog
        {
            addOn = DateTime.Now,
            uId = uid,
            content = Content,
            orderNo = OrderNo
        };
        new Travel.Main().AddToDb(l, "t_travel_log");
    }
    
    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}