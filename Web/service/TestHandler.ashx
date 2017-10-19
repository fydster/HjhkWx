<%@ WebHandler Language="C#" Class="TestHandler" %>

using System;
using System.Web;
using Train;
using System.Collections.Generic;
using com.seascape.tools;
using Seascape.WxApi;
using Model;
using Data;
using LitJson;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;



public class TestHandler : IHttpHandler {
    public string BaseUrl = "http://hjhk.edmp.cc/";
    
    public void ProcessRequest (HttpContext context) {
        
        context.Response.ContentType = "text/plain";
        string result = bookTickets(context);
        context.Response.Write(result);
    }

    /// <summary>
    /// 创建订单
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string bookTickets(HttpContext c)
    {
        try
        {
            WriteLog("测试开始");
            string passengersInfo = string.IsNullOrEmpty(c.Request["passengers"]) ? "" : c.Request["passengers"].ToString();
            int fareNum = string.IsNullOrEmpty(c.Request["fareNum"]) ? 0 : Convert.ToInt32(c.Request["fareNum"].ToString());
            Double perTicketPrice = string.IsNullOrEmpty(c.Request["perTicketPrice"]) ? 0 : Convert.ToDouble(c.Request["perTicketPrice"].ToString());

            //_T.trainNo + "@" + _T.sCity + "@" + _T.sCode + "@" + _T.tCity + "@" + _T.tCode + "@" + _T.sDate + "@" + _T.seat + "@" + _T.seatName + "@" + _T.sTime + "@" + _T.tTime
            string TripInfo = string.IsNullOrEmpty(c.Request["TripInfo"]) ? "" : c.Request["TripInfo"].ToString();
            string[] tripArr = TripInfo.Split('@');
            string trainNo = tripArr[0];
            string fromCity = tripArr[1];
            string toCity = tripArr[3];
            string fromStation = tripArr[2];
            string toStation = tripArr[4];
            string sDate = tripArr[5];
            string sTime = tripArr[8];
            string tTime = tripArr[9];
            string seat = tripArr[6];
            string seatName = tripArr[7];
            string queryKey = tripArr[10];
            WriteLog("---1---");
            string contact = string.IsNullOrEmpty(c.Request["contact"]) ? "" : c.Request["contact"].ToString();
            string mobile = string.IsNullOrEmpty(c.Request["mobile"]) ? "" : c.Request["mobile"].ToString();
            int uid = string.IsNullOrEmpty(c.Request["uid"]) ? 0 : Convert.ToInt32(c.Request["uid"].ToString());
            Double ticketPrice = string.IsNullOrEmpty(c.Request["ticketPrice"]) ? 0 : Convert.ToDouble(c.Request["ticketPrice"].ToString());
            Double insurePrice = string.IsNullOrEmpty(c.Request["insurePrice"]) ? 0 : Convert.ToDouble(c.Request["insurePrice"].ToString());
            WriteLog("---2---");
            int insurePrice_per = Convert.ToInt16(insurePrice / fareNum);
            string bookTickets = "";
            try
            {
                //添加订单
                trainOrder tOrder = new trainOrder
                {
                    addOn = DateTime.Now,
                    contact = contact,
                    insurePrice = insurePrice,
                    mobile = mobile,
                    ticketPrice = ticketPrice,
                    totalPrice = ticketPrice + insurePrice,
                    fareNum = fareNum,
                    uId = uid,
                    orderNo = "T" + DateTime.Now.ToString("yyMMddHHmmss") + uid.ToString().PadLeft(5, '0')
                };

                //创建订单对象
                bookTickets book = new bookTickets
                {
                    queryKey = queryKey,
                    journeyType = "1",
                    userAccount = "",
                    outOrderNo = tOrder.orderNo,
                    trainNo = trainNo,
                    fromStation = fromStation,
                    toStation = toStation,
                    isPost = 0,
                    isOnLine = 1,
                    noticeType = 0,
                    batchNumber = "",
                    isProduction = "1",
                    ticketModel = "0",
                    accountNo = "",
                    accountPwd = "",
                    acceptNoSeat = "0"
                };

                //联系人信息
                contactInfo contactInfo = new contactInfo
                {
                    cellphone = mobile,
                    person = contact,
                    email = ""
                };

                book.contactInfo = contactInfo;

                //邮寄信息
                postalInfo post = new postalInfo
                {
                    person = "",
                    cellphone = "",
                    province = "",
                    city = "",
                    district = "",
                    address = "",
                    zip = ""
                };

                book.postalInfo = post;
                WriteLog("---3---");
                string sql = "";
                if (new Train.Main().AddToDb(tOrder, "t_train_order"))
                {
                    WriteLog("---sql---" + sql);
                    WriteLog("---4---");
                    //添加行程
                    trainTrip tTrip = new trainTrip
                    {
                        fromCity = fromCity,
                        fromStation = fromStation,
                        toCity = toCity,
                        toStation = toStation,
                        trainNo = trainNo,
                        queryKey = queryKey,
                        orderNo = tOrder.orderNo,
                        seatClass = seat,
                        seatName = seatName,
                        ticketPrice = perTicketPrice,
                        tDate = Convert.ToDateTime(sDate),
                        sTime = sTime,
                        tTime = tTime
                    };
                    string FlihtInfo = trainNo + "@" + fromStation + "@" + toStation + "@" + fromCity + "@" + toCity + "@" + tTrip.tDate + "@" + sTime + "@" + tTime + "@" + seatName;

                    new Train.Main().AddToDb(tTrip, "t_train_trip");
                    //添加乘客

                    List<passengers> lp = new List<passengers>();

                    string[] pArr = passengersInfo.Split('@');
                    string FareInfo = "";
                    foreach (string item in pArr)
                    {
                        if (item.Length > 0 && item.IndexOf("|") > -1)
                        {
                            string[] pF = item.Split('|');
                            trainFare tFare = new trainFare
                            {
                                addOn = DateTime.Now,
                                birthday = DateTime.Now.Date,
                                idCard = pF[1],
                                idType = Convert.ToInt16(pF[2]),
                                orderNo = tOrder.orderNo,
                                passengerName = pF[0].Replace("chd", ""),
                                passengerType = Convert.ToInt16(pF[3]),
                                insurePrice = insurePrice_per
                            };
                            if (tFare.idCard.Length == 18)
                            {
                                tFare.birthday = Train.Main.GetBirth(tFare.idCard);
                            }
                            new Train.Main().AddToDb(tFare, "t_train_fare");

                            //乘客信息
                            passengers passenger = new passengers
                            {
                                passengerType = pF[3],
                                passengerName = pF[0].Replace("chd", ""),
                                idType = pF[2],
                                idCard = pF[1],
                                birthday = "",
                                insureCount = 0,
                                insurePrice = 0,
                                insurNo = "",
                                sex = "0",
                                seatClass = seat,
                                ticketPrice = perTicketPrice.ToString()
                            };
                            if (passenger.idCard.Length == 18)
                            {
                                passenger.sex = Train.Main.GetSex(passenger.idCard).ToString();
                                passenger.birthday = Train.Main.GetBirth(passenger.idCard).ToString("yyyy-MM-dd");
                            }
                            lp.Add(passenger);
                            //passengerName|cardNo|cardType|passengerType|price
                            FareInfo += passenger.passengerName + "|" + passenger.idCard + "|" + passenger.idType + "|" + passenger.passengerType + "|0@";
                        }
                    }

                    book.passengers = lp;
                    //return "";

                    bookTickets = "22222";// new _BookTickets().bookTickets(LitJson.JsonMapper.ToJson(book));

                    int msgCode = 0;

                    try
                    {
                        JObject jo = (JObject)JsonConvert.DeserializeObject(bookTickets);
                        msgCode = Convert.ToInt16(jo["msgCode"].ToString());
                        string outOrderNo = jo["orderNo"].ToString();
                        string msgInfo = jo["msgInfo"].ToString();
                        string orderNo = jo["outOrderNo"].ToString();

                        var o_ = new
                        {
                            state = 1,
                            outOrderNo = outOrderNo
                        };
                        new Train.Main().UpdateDb(o_, "t_train_order", "orderNo = '" + orderNo + "'");
                    }
                    catch
                    {

                    }

                    //订单日志
                    string content = "订单提交失败";
                    if (msgCode == 100)
                    {
                        content = "订单提交成功";
                    }
                    trainLog tLog = new trainLog
                    {
                        addOn = DateTime.Now,
                        content = content,
                        uId = uid,
                        lType = 0,
                        orderNo = tOrder.orderNo
                    };
                    new Train.Main().AddToDb(tLog, "t_train_log");

                    //写回本地
                    //if (1 == 2)
                    {
                        string PostUrl = "http://59.49.19.109:8016/weixin/TrainHandler.ashx?Fn=1&";
                        string Paras = "Fliht_type=1";
                        Paras += "&FlihtInfo=" + FlihtInfo;
                        Paras += "&FareInfo=" + FareInfo;
                        Paras += "&User_tel=" + mobile;
                        Paras += "&Fare_num=" + fareNum;
                        Paras += "&jp_total_price=" + ticketPrice.ToString();
                        Paras += "&bx_total_price=" + insurePrice.ToString();
                        Paras += "&uid=" + uid;
                        Paras += "&User_name=" + contact;
                        Paras += "&OrderNo=" + tOrder.orderNo;
                        PostUrl += Paras;
                        WriteLog(PostUrl);
                        string Rsa = BasicTool.webRequest(PostUrl);
                    }
                    string MsgContent = "有火车票新订单，请注意查看";
                    string MsgUrl = BaseUrl + "service/Handler.ashx?fn=90&mType=10&uid=2012&content=" + MsgContent;
                    BasicTool.webRequest(MsgUrl);
                }
            }
            catch
            {

            }
            return bookTickets;
        }
        catch (Exception e)
        {
            WriteLog(e.Message);
            return "----";
        }
    }

    private void WriteLog(string strMemo)
    {
        string filename = "D:/HjhkTest/log/train_order_" + DateTime.Now.ToString("yyMMdd") + ".txt";
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