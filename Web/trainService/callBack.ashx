<%@ WebHandler Language="C#" Class="TrainHandler" %>

using System;
using System.Web;
using Train;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Text;
using Newtonsoft.Json.Linq;
using Model;
using Seascape.WxApi;

public class TrainHandler : IHttpHandler {

    public string BaseUrl = "http://hjhk.edmp.cc/";
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
    
    public void ProcessRequest (HttpContext c) {
        int F = string.IsNullOrEmpty(c.Request["fn"]) ? 0 : Convert.ToInt16(c.Request["fn"]);
        c.Response.ContentType = "text/plain";
        c.Response.Write(GetResult(F, c));

        /*
         环境：正式 /测试？ 
         联调开始时间：
         账户即channel：
         占座结果推送网关 ：
         出票结果推送网关 ：
         占座&出票结果合并推送网关 ：
         订单过期推送网关 ：
         退款结果推送网关 ：         
       */
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
                case 101:
                    Result = callBack(c,f);
                    break;
                case 102:
                    Result = callBack(c, f);
                    break;
                case 103:
                    Result = callBack(c, f);
                    break;
                case 104:
                    Result = callBack(c, f);
                    break;
                case 105:
                    Result = callBack(c, f);
                    break;
            }
        }
        catch (Exception e)
        {
            Result = "false";// e.Message.ToString();
        }
        return Result;
    }

    public string callBack(HttpContext c,int f)
    {
        string callBack = "succeed";
        string method = string.IsNullOrEmpty(c.Request["method"]) ? "" : c.Request["method"].ToString();
        WriteLog("method:" + method);
        string param = string.IsNullOrEmpty(c.Request["param"]) ? "" : c.Request["param"].ToString();
        WriteLog("param:" + param);
        string sign = string.IsNullOrEmpty(c.Request["sign"]) ? "" : c.Request["sign"].ToString();
        WriteLog("sign:" + sign);

        List<train_para> lt = new List<train_para>();
        lt.Add(new train_para { key = "method", value = method });
        lt.Add(new train_para { key = "param", value = param });
        string signCheck = new _Train().Sign(lt);

        WriteLog("signCheck:" + signCheck);
        
        int code = 0;// BookTicket(param);
        switch (f)
        {
            case 101:
                code = BookTicket(param);
                break;
            case 102:
                code = IssueOrder(param);
                break;
            case 103:
                code = BookTicket(param);
                break;
            case 104:
                code = notifyOvertimeOrder(param);
                break;
            case 105:
                code = refundTicket(param);
                break;
        }
        return callBack;
    }

    /// <summary>
    /// 占座结果推送
    /// </summary>
    /// <param name="jsontext"></param>
    /// <returns></returns>
    public int BookTicket(string jsontext)
    {
        JObject jo = (JObject)JsonConvert.DeserializeObject(jsontext);
        string msgCode = jo["msgCode"].ToString();
        string outOrderNo = jo["orderNo"].ToString();
        string msgInfo = jo["msgInfo"].ToString();
        string orderNo = jo["outOrderNo"].ToString();
        string passengers = jo["passengers"].ToString();
        Double orderAmount = Convert.ToDouble(jo["orderAmount"]);

        List<passengers_back> lp = new List<passengers_back>();
        lp = Newtonsoft.Json.JsonConvert.DeserializeObject<List<passengers_back>>(passengers);
        
        trainLog tl = new trainLog
        {
            orderNo = orderNo,
            content = msgInfo,
            addOn = DateTime.Now,
            lType = 1
        };
        if (Convert.ToInt16(msgCode) == 100)
        {
            var o = new
            {
                state = 2,
                ticketPrice = orderAmount,
                outOrderNo = outOrderNo
            };
            new Main().UpdateDb(o, "t_train_order", "orderNo = '" + orderNo + "'");
            WriteLog("乘客数："+lp.Count);
            string FareInfo = "";
            foreach (passengers_back item in lp)
            {
                var of = new
                {
                    passengerId = item.passengerId,
                    seatNo = item.seatNo,
                    price = Convert.ToDouble(item.price),
                    pTicketNo = item.pTicketNo
                };
                FareInfo += item.seatNo + "|" + of.price + "|" + item.cardNo + "|" + item.pTicketNo + "|" + item.passengerId + "@";
                WriteLog(item.cardNo + "" + item.seatNo);
                new Main().UpdateDb(of, "t_train_fare", "orderNo = '" + orderNo + "' and idCard = '" + item.cardNo + "'");
            }
            trainOrder to = new _TrainOrder().GetTrainOrderInfo(orderNo);
            if (to != null)
            {
                var ou = new
                {
                    totalPrice = to.ticketPrice + to.insurePrice
                };
                new Main().UpdateDb(ou, "t_train_order", "orderNo = '" + orderNo + "'");
                
                int uid = to.uId;
                string content = "座位已申请完成，请点击该消息查看并及时支付，以免座位过期（系统保留座位30分钟）";
                string MsgUrl = BaseUrl + "service/Handler.ashx?fn=90&mType=10&uid=" + uid + "&content=" + content;
                com.seascape.tools.BasicTool.webRequest(MsgUrl);
            }

            //if (1 == 2)
            {
                string PostUrl = "http://59.49.19.109:8016/weixin/TrainHandler.ashx?Fn=2&";
                string Paras = "orderNo=" + orderNo;
                Paras += "&FareInfo=" + FareInfo;
                Paras += "&orderAmount=" + orderAmount;
                Paras += "&insurePrice=" + to.insurePrice;
                PostUrl += Paras;
                WriteLog(PostUrl);
                string Rsa = com.seascape.tools.BasicTool.webRequest(PostUrl);
            }
        }
        else
        {
            var o = new
            {
                state = 10
            };
            new Main().UpdateDb(o, "t_train_order", "orderNo = '" + orderNo + "'");
            trainOrder to = new _TrainOrder().GetTrainOrderInfo(orderNo);
            if (to != null)
            {
                int uid = to.uId;
                string content = "座位申请失败，请重新预定";
                string MsgUrl = BaseUrl + "service/Handler.ashx?fn=90&mType=10&uid=" + uid + "&content=" + content;
                com.seascape.tools.BasicTool.webRequest(MsgUrl);


                string PostUrl = "http://59.49.19.109:8016/weixin/TrainHandler.ashx?Fn=4&";
                string Paras = "orderNo=" + orderNo;
                Paras += "&Content=座位申请失败";
                Paras += "&state=-1";
                PostUrl += Paras;
                WriteLog(PostUrl);
                string Rsa = com.seascape.tools.BasicTool.webRequest(PostUrl);
            }
        }
        new Main().AddToDb(tl, "t_train_log");
        return Convert.ToInt16(msgCode);
    }

    /// <summary>
    /// 出票通知
    /// </summary>
    /// <param name="jsontext"></param>
    /// <returns></returns>
    public int IssueOrder(string jsontext)
    {
        JObject jo = (JObject)JsonConvert.DeserializeObject(jsontext);
        string msgCode = jo["msgCode"].ToString();
        string outOrderNo = jo["orderNo"].ToString();
        string msgInfo = jo["msgInfo"].ToString();
        string orderNo = jo["outOrderNo"].ToString();

        trainLog tl = new trainLog
        {
            orderNo = orderNo,
            content = msgInfo,
            addOn = DateTime.Now,
            lType = 1
        };
        if (Convert.ToInt16(msgCode) == 100)
        {
            var o = new
            {
                state = 3,
                ticketOn = DateTime.Now
            };
            new Main().UpdateDb(o, "t_train_order", "orderNo = '" + orderNo + "'");
            trainOrderinfo to = new _TrainOrder().GetTrainOrderInfoForAll(orderNo);
            if (to != null)
            {
                int uid = to.uId;
                string content = "您预定车票已出，[" + to.trip[0].fromCity + "]至[" + to.trip[0].toCity + "]," + Convert.ToDateTime(to.trip[0].tDate).ToString("yyyy-MM-dd") + ",出发时间" + to.trip[0].sTime + ",到达时间" + to.trip[0].tTime + ",请务必提前取票，点击查看详情";
                string MsgUrl = BaseUrl + "service/Handler.ashx?fn=90&mType=10&uid=" + uid + "&content=" + content;
                com.seascape.tools.BasicTool.webRequest(MsgUrl);
            }

            //if (1 == 2)
            {
                string PostUrl = "http://59.49.19.109:8016/weixin/TrainHandler.ashx?Fn=4&";
                string Paras = "orderNo=" + orderNo;
                Paras += "&Content=出票完成";
                Paras += "&state=2";
                PostUrl += Paras;
                WriteLog(PostUrl);
                string Rsa = com.seascape.tools.BasicTool.webRequest(PostUrl);
            }
        }
        new Main().AddToDb(tl, "t_train_log");
        return Convert.ToInt16(msgCode);
    }

    /// <summary>
    /// 退票通知
    /// </summary>
    /// <param name="jsontext"></param>
    /// <returns></returns>
    public int refundTicket(string jsontext)
    {
        JObject jo = (JObject)JsonConvert.DeserializeObject(jsontext);
        string msgCode = jo["msgCode"].ToString();
        string outOrderNo = jo["orderNo"].ToString();
        string msgInfo = jo["msgInfo"].ToString();
        string orderNo = jo["outOrderNo"].ToString();

        string passengers = jo["passengers"].ToString();

        List<passengers_refund> lp = new List<passengers_refund>();
        lp = Newtonsoft.Json.JsonConvert.DeserializeObject<List<passengers_refund>>(passengers);
        
        trainLog tl = new trainLog
        {
            orderNo = orderNo,
            content = msgInfo,
            addOn = DateTime.Now,
            lType = 1
        };
        if (Convert.ToInt16(msgCode) == 100)
        {
            var o = new
            {
                state = 9,
                refundOn = DateTime.Now
            };
            new Main().UpdateDb(o, "t_train_order", "orderNo = '" + orderNo + "'");
            Double refundPrice = 0;
            int itemNum = 0;
            foreach (passengers_refund item in lp)
            {
                refundPrice = refundPrice + Convert.ToDouble(item.refundPrice);
                OrderRefund(orderNo, Convert.ToDouble(item.refundPrice), item.passengerId, itemNum);
                itemNum++;
            }

            string PostUrl = "http://59.49.19.109:8016/weixin/TrainHandler.ashx?Fn=4&";
            string Paras = "orderNo=" + orderNo;
            Paras += "&refundPrice=" + refundPrice;
            Paras += "&Enable=1&Content=退票完成";
            PostUrl += Paras;
            WriteLog(PostUrl);
            string Rsa = com.seascape.tools.BasicTool.webRequest(PostUrl);           
        }
        new Main().AddToDb(tl, "t_train_log");
        return Convert.ToInt16(msgCode);
    }
    

    /// <summary>
    /// 占座过期通知
    /// </summary>
    /// <param name="jsontext"></param>
    /// <returns></returns>
    public int notifyOvertimeOrder(string jsontext)
    {
        JObject jo = (JObject)JsonConvert.DeserializeObject(jsontext);
        string msgCode = jo["msgCode"].ToString();
        string outOrderNo = jo["orderNo"].ToString();
        string msgInfo = jo["msgInfo"].ToString();
        string orderNo = jo["outOrderNo"].ToString();

        trainLog tl = new trainLog
        {
            orderNo = orderNo,
            content = msgInfo,
            addOn = DateTime.Now,
            lType = 1
        };
        if (Convert.ToInt16(msgCode) == 207)
        {
            var o = new
            {
                state = 8
            };
            new Main().UpdateDb(o, "t_train_order", "orderNo = '" + orderNo + "'");
            
            string PostUrl = "http://59.49.19.109:8016/weixin/TrainHandler.ashx?Fn=4&";
            string Paras = "orderNo=" + orderNo;
            Paras += "&Content=占座过期";
            Paras += "&state=-1";
            PostUrl += Paras;
            WriteLog(PostUrl);
            string Rsa = com.seascape.tools.BasicTool.webRequest(PostUrl);
        }
        new Main().AddToDb(tl, "t_train_log");
        return Convert.ToInt16(msgCode);
    }

    /// <summary>
    /// 退款操作
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public void OrderRefund(string orderNo, Double tpPrice, string passengerId, int itemNum)
    {
        if (orderNo.Length > 0)
        {
            trainOrderinfo o = new _TrainOrder().GetTrainOrderInfoForAll(orderNo);
            if (o != null)
            {
                int state = 1;
                foreach (trainFare item in o.fare)
                {
                    if (item.passengerId == passengerId)
                    {
                        state = item.state;
                    }
                }

                if (state == 1)
                {
                    return;
                }
                //Double syPrice = o.totalPrice - o.refundPrice;
                //if (syPrice > tpPrice)
                {
                    int insurePrice = o.fare[0].insurePrice;
                    if (DateTime.Now.Date >= o.trip[0].tDate.Date)
                    {
                        insurePrice = 0;
                    }
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
                            refund_fee = Convert.ToInt32((tpPrice + insurePrice) * 100),
                            op_user_id = mch_id,
                            OrderNo = orderNo,
                            KeyValue = keyValue
                        };

                        wr.out_refund_no = wr.out_refund_no + "_" + itemNum + "_" + DateTime.Now.ToString("MdHHmmss");
                        
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
                        if (new Main().AddToDb(wr, "t_wxpay_refund"))
                        {
                            if (wr.errMsg == "0")
                            {
                                var o_Refund = new
                                {
                                    state = 1,
                                    refundInsure = tpPrice,
                                    refundOn = DateTime.Now
                                };
                                if (new Main().UpdateDb(o_Refund, "t_train_fare", "orderNo = '" + orderNo + "' and passengerId = '" + passengerId + "'"))
                                {
                                    try
                                    {
                                        AddLog(orderNo, "退票完成，执行退款申请，退款金额：" + Math.Round(Convert.ToDouble(tpPrice+insurePrice), 2).ToString() + "元,退款申请结果：" + errMsg);
                                        if (o != null)
                                        {
                                            int uid = o.uId;
                                            string content = "您的退票已完成！";
                                            string MsgUrl = BaseUrl + "service/Handler.ashx?fn=90&mType=10&uid=" + uid + "&content=" + content;
                                            com.seascape.tools.BasicTool.webRequest(MsgUrl);
                                        }

                                        string PostUrl = "http://59.49.19.109:8016/weixin/TrainHandler.ashx?Fn=4&";
                                        string Paras = "orderNo=" + orderNo;
                                        Paras += "&Enable=2&Content=退款申请完成，退款金额：" + Math.Round(Convert.ToDouble(tpPrice + insurePrice), 2).ToString() + "元";
                                        PostUrl += Paras;
                                        WriteLog(PostUrl);
                                        string Rsa = com.seascape.tools.BasicTool.webRequest(PostUrl);  
                                    }
                                    catch (Exception ex)
                                    {
                                        new Data.Main().AddTestLog("退款日志", ex.ToString());
                                    }
                                }
                            }
                        }
                       
                    }
                }
            }
        }
    }

    private void AddLog(string orderNo,string msgInfo)
    {
        trainLog tl = new trainLog
        {
            orderNo = orderNo,
            content = msgInfo,
            addOn = DateTime.Now,
            lType = 1
        };
        new Main().AddToDb(tl, "t_train_log");
    }
    
    private void WriteLog(string strMemo)
    {
        string filename = "D:/HjhkWx/log/train_" + DateTime.Now.ToString("yyMMdd") + ".txt";
        strMemo = "[" + DateTime.Now.ToString("MM-dd HH:mm:ss") + "]" + strMemo;
        System.IO.StreamWriter sr = null;
        try
        {
            if (!System.IO.File.Exists(filename))
            {
                sr = System.IO.File.CreateText(filename);
            }
            else
            {
                sr = System.IO.File.AppendText(filename);
            }
            sr.WriteLine(strMemo);
        }
        catch
        {
        }
        finally
        {
            if (sr != null)
                sr.Close();
        }
    }
    
    
    
    public bool IsReusable {
        get {
            return false;
        }
    }

}