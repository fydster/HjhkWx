<%@ WebHandler Language="C#" Class="Handler" %>

using System;
using System.Web;
using System.Collections.Generic;
using System.Xml;
using System.Text;
using System.IO;
using LitJson;
using com.seascape.tools;
using Model;
using Seascape.WxApi;
using Data.Tmessage;
using Data;

public class Handler : IHttpHandler
{
    public static string HjKeyValue = "Seascape.Fast.Fix";
    public static string appid = com.seascape.tools.BasicTool.GetConfigPara("appid");
    public static string secret = com.seascape.tools.BasicTool.GetConfigPara("secret");    
    //微信支付商户
    public static string mch_id = com.seascape.tools.BasicTool.GetConfigPara("mch_id");
    //微信支付提交服务器IP
    public static string client_ip = com.seascape.tools.BasicTool.GetConfigPara("client_ip");
    //合作伙伴默认每单提取金额
    public static int partnerRedNum = 20*100;

    public static string MsgUrl = "http://hjhk.edmp.cc/service/Handler.ashx";
    
    public void ProcessRequest(HttpContext c)
    {
        string Result = "";
        new Main().AddTestLog("PayCallBack", "-------");
        Result = OperPayResult(c);//处理支付结果
        new Main().AddTestLog("Result", Result);
        c.Response.ContentType = "text/plain";
        c.Response.Write(Result);
    }

    
    /// <summary>
    /// 处理支付返回结果
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string OperPayResult(HttpContext c)
    {  
        XmlDocument Xml = new XmlDocument();
        string Xmls = ConvertStream(c);
        new Main().AddTestLog("PayCallBack-Xmls", Xmls);
        Xml.LoadXml(Xmls);
        string appid = Xml.DocumentElement.SelectSingleNode("appid").InnerText;
        string mch_id = Xml.DocumentElement.SelectSingleNode("mch_id").InnerText;
        string nonce_str = Xml.DocumentElement.SelectSingleNode("nonce_str").InnerText;
        string sign = Xml.DocumentElement.SelectSingleNode("sign").InnerText;
        string result_code = Xml.DocumentElement.SelectSingleNode("result_code").InnerText;
        string openid = Xml.DocumentElement.SelectSingleNode("openid").InnerText;
        string is_subscribe = Xml.DocumentElement.SelectSingleNode("is_subscribe").InnerText;
        string trade_type = Xml.DocumentElement.SelectSingleNode("trade_type").InnerText;
        string bank_type = Xml.DocumentElement.SelectSingleNode("bank_type").InnerText;
        string total_fee = Xml.DocumentElement.SelectSingleNode("total_fee").InnerText;
        string transaction_id = Xml.DocumentElement.SelectSingleNode("transaction_id").InnerText;
        string out_trade_no = Xml.DocumentElement.SelectSingleNode("out_trade_no").InnerText;
        string time_end = Xml.DocumentElement.SelectSingleNode("time_end").InnerText;
        string attach = Xml.DocumentElement.SelectSingleNode("attach").InnerText;
        new Main().AddTestLog("attach", attach);
        string OrderNo = out_trade_no.Split('s')[0];
        try
        {
            string srcNo = "";
            int Result = 0;
            string errMsg = "";
            Double price = 0;
            if (result_code == "SUCCESS")
            {
                new Main().AddTestLog("keyValue", BasicTool.MD5(OrderNo + HjKeyValue).ToUpper());
                if (attach == BasicTool.MD5(OrderNo + HjKeyValue).ToUpper())
                {
                    Result = 1;
                    price = Math.Round(Convert.ToDouble(total_fee), 2) / 100.0;
                    
                    var op = new
                    {
                        enable = 1,
                        out_trade_no = out_trade_no,
                        transaction_id = transaction_id,
                        total_fee = Math.Round(Convert.ToDouble(total_fee), 2)
                    };
                    new Main().UpdateDb(op, "t_wxPay", "OrderNo = '" + OrderNo + "'");

                    var oo = new
                    {
                        isPay = 1,
                        payOn = DateTime.Now
                    };
                    if (OrderNo.StartsWith("T"))
                    {
                        new Main().UpdateDb(oo, "t_train_order", "orderNo = '" + OrderNo + "'");
                        AddTrainLog(OrderNo, "支付成功，系统正在为您出票，请注意查收微信消息", 0, 1);
                        Train.trainOrder torder = new Train._TrainOrder().GetTrainOrderInfo(OrderNo);
                        if (torder != null)
                        {
                            string IssueResult = new Train._applyIssueOrder().applyIssueOrder(torder.outOrderNo);
                            new Main().AddTestLog("Train出票申请", IssueResult);
                        }
                        
                    }
                    
                    //门票
                    if (OrderNo.StartsWith("M"))
                    {
                        new Main().UpdateDb(oo, "t_travel_order", "orderNo = '" + OrderNo + "'");
                        AddTrainLog(OrderNo, "支付成功，系统正在为您出票，请注意查收消息", 0, 1);
                        Travel.travelOrderInfo torderInfo = new Travel._TravelOrder().GetTravelOrderInfo(OrderNo);
                        if (torderInfo != null)
                        {
                            string sorder = new Travel.submitOrder().ToSubmitOrder(torderInfo.orderId, Convert.ToInt16(torderInfo.totalPrice).ToString());
                        }
                        
                    }
                    
                    wxPay wp = new _WxPay().GetWxPay(OrderNo);
                    srcNo = wp.extNo;
                }
            }
            else
            {
                string return_msg = Xml.DocumentElement.SelectSingleNode("return_msg").InnerText;
                var op = new
                {
                    enable = 2,
                    ReturnMsg = result_code
                };
                new Main().UpdateDb(op, "t_wxPay", "OrderNo = '" + OrderNo + "'");
                errMsg = return_msg;
            }

            if (OrderNo.StartsWith("T"))
            {
                string PostUrl = "http://59.49.19.109:8016/weixin/TrainHandler.ashx?Fn=4&";
                string Paras = "orderNo=" + out_trade_no;
                Paras += "&Content=支付完成，本次支付" + (Math.Round(Convert.ToDouble(total_fee) / 100, 2));
                PostUrl += Paras;
                string Rsa = com.seascape.tools.BasicTool.webRequest(PostUrl);
            }
            else
            {
                string PostUrl = "http://59.49.19.109:8016/weixin/WxHandler.ashx?Fn=4&";
                string Paras = "&Result=" + Result;
                Paras += "&OrderNo=" + out_trade_no;
                Paras += "&srcNo=" + srcNo;
                Paras += "&errMsg=" + errMsg;
                Paras += "&price=" + (Math.Round(Convert.ToDouble(total_fee) / 100, 2));
                PostUrl += Paras;
                new Main().AddTestLog("PostUrl", PostUrl);
                BasicTool.webRequest(PostUrl);    
            }
            
        }
        catch
        {
            
        }
        StringBuilder s = new StringBuilder();
        s.Append("<xml>");
        s.Append("<return_code><![CDATA[SUCCESS]]></return_code>");
        s.Append("<return_msg><![CDATA[OK]]></return_msg>");
        s.Append("</xml>");
        return s.ToString();
    }

    /// <summary>
    /// 输入流转字符串
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string ConvertStream(HttpContext c)
    {
        System.IO.Stream sm = c.Request.InputStream;//获取post数据
        int len = (int)sm.Length;//post数据的长度
        byte[] inputByts = new byte[len];//存储post数据
        sm.Read(inputByts, 0, len);//将post数据写入数组
        sm.Close();//关闭流
        string data = Encoding.GetEncoding("utf-8").GetString(inputByts);//转换为unicode字符串  
        return data;
    }

    /// <summary>
    /// 添加日志
    /// </summary>
    /// <param name="OrderNo"></param>
    /// <param name="Content"></param>
    /// <param name="uid"></param>
    /// <param name="cid"></param>
    /// <param name="aid"></param>
    public void AddLog(string OrderNo, string Content, int uid, string workNo, int lType)
    {
        log l = new log
        {
            addOn = DateTime.Now,
            uId = uid,
            lType = lType,
            workNo = workNo,
            content = Content,
            orderNo = OrderNo
        };
        new Main().AddToDb(l, "t_log");
    }

    public void AddTrainLog(string OrderNo, string Content, int uid, int lType)
    {
        Train.trainLog l = new Train.trainLog
        {
            addOn = DateTime.Now,
            uId = uid,
            lType = lType,
            content = Content,
            orderNo = OrderNo
        };
        new Main().AddToDb(l, "t_train_log");
    }
    
    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}