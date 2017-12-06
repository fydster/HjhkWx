<%@ WebHandler Language="C#" Class="TrainHandler" %>

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

public class TrainHandler : IHttpHandler {
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
                    Result = trainStationList(c);//获取火车站列表
                    break;
                case 2:
                    Result = select(c);//站站查询
                    break;
                case 3:
                    Result = identityPassengers(c);//乘客身份核验
                    break;
                case 4:
                    Result = bookTickets(c);//创建订单
                    break;
                case 5:
                    Result = GetPayInfo(c);//获取支付字符串
                    break;
                case 6:
                    Result = cancelOrder(c);//取消订单
                    break;
                case 7:
                    Result = refundTicket(c);//退票
                    break;
                case 8:
                    Result = trainStationHotList(c);//获取热门城市列表
                    break;
                case 101:
                    Result = GetOrderList(c);//获取订单列表
                    break;
                case 102:
                    Result = GetOrderInfo(c);//获取订单详情
                    break;
                case 201:
                    Result = selectForBasic(c);//站站查询ToPC
                    break;
                case 202:
                    Result = identityPassengersToBasic(c);//乘客核验TOPC
                    break;
                case 203:
                    Result = bookTicketsForB(c);//占座
                    break;
                case 204:
                    Result = applyIssueOrder(c);//申请出票
                    break;
                case 205:
                    Result = bookTicketsForQp(c);//抢票
                    break;
            }
        }
        catch (Exception e)
        {
            Result = e.Message.ToString();
        }
        return Result;
    }
    
    /// <summary>
    /// 获取火车站列表
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string trainStationList(HttpContext c)
    {
        string list = "";
        if (1==2&&c.Cache["c_trainStationList"] != null)
        {
            list = c.Cache["c_trainStationList"].ToString();
        }
        else
        {
            list = new _Train_city().GetList();            
            c.Cache.Add("c_trainStationList", list, null, System.DateTime.UtcNow.AddDays(30), TimeSpan.Zero, System.Web.Caching.CacheItemPriority.Normal, null);
        }
        return list;
    }

    /// <summary>
    /// 获取火车站列表-热门
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string trainStationHotList(HttpContext c)
    {
        List<trainCity> lt = new List<trainCity>();
        if (c.Cache["c_trainStationHotList"] != null)
        {
            lt = (List<trainCity>)c.Cache["c_trainStationHotList"];
        }
        else
        {
            lt = new _TrainCity().GetHotTrainCityList();
            c.Cache.Add("c_trainStationHotList", lt, null, System.DateTime.UtcNow.AddDays(30), TimeSpan.Zero, System.Web.Caching.CacheItemPriority.Normal, null);
        }
        var o = new { Return = 0, Msg = "", List = lt };
        return JsonMapper.ToJson(o);
    }

    /// <summary>
    /// 获取火车站列表-查询
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string trainStationSearchList(HttpContext c)
    {
        string key = string.IsNullOrEmpty(c.Request["key"]) ? "" : c.Request["key"].ToString();
        int sType = string.IsNullOrEmpty(c.Request["sType"]) ? 0 : Convert.ToInt16(c.Request["sType"].ToString());
        List<trainCity> lt = new List<trainCity>();
        if (c.Cache["c_trainStationHotList"] != null)
        {
            lt = (List<trainCity>)c.Cache["c_trainStationHotList"];
        }
        else
        {
            lt = new _TrainCity().GetHotTrainCityList();
            c.Cache.Add("c_trainStationHotList", lt, null, System.DateTime.UtcNow.AddDays(30), TimeSpan.Zero, System.Web.Caching.CacheItemPriority.Normal, null);
        }
        var o = new { Return = 0, Msg = "", List = lt };
        return JsonMapper.ToJson(o);
    }
    
    /// <summary>
    /// 站站查询
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string select(HttpContext c)
    {
        string list = "";
        string sCity = string.IsNullOrEmpty(c.Request["sCity"]) ? "" : c.Request["sCity"].ToString();
        string tCity = string.IsNullOrEmpty(c.Request["tCity"]) ? "" : c.Request["tCity"].ToString();
        DateTime sDate = string.IsNullOrEmpty(c.Request["sDate"]) ? DateTime.Now : Convert.ToDateTime(c.Request["sDate"].ToString());
        int uid = string.IsNullOrEmpty(c.Request["uid"]) ? 0 : Convert.ToInt32(c.Request["uid"].ToString());
        int sType = string.IsNullOrEmpty(c.Request["sType"]) ? 1 : Convert.ToInt16(c.Request["sType"].ToString());
        try
        {
            sCity = sCity.Replace("tyn", "taiyuan");
            sCity = sCity.Replace("TYN", "taiyuan");
            list = new _Train_select().Select(sCity, tCity, sDate.ToString("yyyyMMdd"), sType);
            searchLog slog = new searchLog
            {
                uId = uid,
                fDate = Convert.ToDateTime(sDate),
                sCode = sCity,
                tCode = tCity,
                addOn = DateTime.Now,
                sType = 1
            };
            new Train.Main().AddToDb(slog, "t_search_log");
        }
        catch
        {
            
        } 
        return list;
    }

    /// <summary>
    /// 站站查询--对本地
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string selectForBasic(HttpContext c)
    {
        string list = "";
        string sCity = string.IsNullOrEmpty(c.Request["sCity"]) ? "" : c.Request["sCity"].ToString();
        string tCity = string.IsNullOrEmpty(c.Request["tCity"]) ? "" : c.Request["tCity"].ToString();
        DateTime sDate = string.IsNullOrEmpty(c.Request["sDate"]) ? DateTime.Now : Convert.ToDateTime(c.Request["sDate"].ToString());

        sCity = c.Server.UrlDecode(sCity);
        tCity = c.Server.UrlDecode(tCity);
        
        Dictionary<string, trainCity> Dic = new Dictionary<string, trainCity>();
        if (c.Cache["TrainCity_Dic"] != null)
        {
            Dic = (Dictionary<string, trainCity>)c.Cache["TrainCity_Dic"];
        }
        else
        {
            Dic = new _TrainCity().GetHotTrainCityDic();
            c.Cache.Add("TrainCity_Dic", Dic, null, System.DateTime.UtcNow.AddDays(600), TimeSpan.Zero, System.Web.Caching.CacheItemPriority.Normal, null);
        }

        if (Dic.ContainsKey(sCity))
        {
            sCity = Dic[sCity].stationCode;
        }

        if (Dic.ContainsKey(tCity))
        {
            tCity = Dic[tCity].stationCode;
        }
        
        try
        {
            list = new _Train_select().Select(sCity, tCity, sDate.ToString("yyyyMMdd"), 1);
        }
        catch
        {

        }
        return list;
    }

    /// <summary>
    /// 创建订单
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string bookTickets(HttpContext c)
    {
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
        
        string contact = string.IsNullOrEmpty(c.Request["contact"]) ? "" : c.Request["contact"].ToString();
        string mobile = string.IsNullOrEmpty(c.Request["mobile"]) ? "" : c.Request["mobile"].ToString();
        int uid = string.IsNullOrEmpty(c.Request["uid"]) ? 0 : Convert.ToInt32(c.Request["uid"].ToString());
        Double ticketPrice = string.IsNullOrEmpty(c.Request["ticketPrice"]) ? 0 : Convert.ToDouble(c.Request["ticketPrice"].ToString());
        Double insurePrice = string.IsNullOrEmpty(c.Request["insurePrice"]) ? 0 : Convert.ToDouble(c.Request["insurePrice"].ToString());

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
                totalPrice = ticketPrice+insurePrice,
                fareNum = fareNum,
                uId = uid,
                orderNo = "T"+DateTime.Now.ToString("yyMMddHHmmss") + uid.ToString().PadLeft(5, '0')
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
            
            if (new Train.Main().AddToDb(tOrder, "t_train_order"))
            {
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
                            passengerName = pF[0].Replace("chd",""),
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
                
                bookTickets = new _BookTickets().bookTickets(LitJson.JsonMapper.ToJson(book));
                
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
                com.seascape.tools.BasicTool.webRequest(MsgUrl);
            }
        }
        catch
        {

        }
        return bookTickets;
    }

    /// <summary>
    /// 占座FORPC
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string bookTicketsForB(HttpContext c)
    {
        string orderNo = string.IsNullOrEmpty(c.Request["orderNo"]) ? "" : c.Request["orderNo"].ToString();
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

        string contact = string.IsNullOrEmpty(c.Request["contact"]) ? "" : c.Request["contact"].ToString();
        string mobile = string.IsNullOrEmpty(c.Request["mobile"]) ? "" : c.Request["mobile"].ToString();
        int uid = string.IsNullOrEmpty(c.Request["uid"]) ? 0 : Convert.ToInt32(c.Request["uid"].ToString());
        Double ticketPrice = string.IsNullOrEmpty(c.Request["ticketPrice"]) ? 0 : Convert.ToDouble(c.Request["ticketPrice"].ToString());
        Double insurePrice = string.IsNullOrEmpty(c.Request["insurePrice"]) ? 0 : Convert.ToDouble(c.Request["insurePrice"].ToString());
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
                orderNo = orderNo,
                isPay = 1
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

            if (new Train.Main().AddToDb(tOrder, "t_train_order"))
            {
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
                            passengerType = Convert.ToInt16(pF[3])
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
                bookTickets = new _BookTickets().bookTickets(LitJson.JsonMapper.ToJson(book));

                int msgCode = 0;

                try
                {
                    JObject jo = (JObject)JsonConvert.DeserializeObject(bookTickets);
                    msgCode = Convert.ToInt16(jo["msgCode"].ToString());
                    string outOrderNo = jo["orderNo"].ToString();
                    string msgInfo = jo["msgInfo"].ToString();
                    string orderNo_Get = jo["outOrderNo"].ToString();

                    var o_ = new
                    {
                        state = 1,
                        outOrderNo = outOrderNo
                    };
                    new Train.Main().UpdateDb(o_, "t_train_order", "orderNo = '" + orderNo_Get + "'");
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
            }
        }
        catch
        {

        }
        return bookTickets;
    }

    /// <summary>
    /// 抢票FORPC
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string bookTicketsForQp(HttpContext c)
    {
        string orderNo = string.IsNullOrEmpty(c.Request["orderNo"]) ? "" : c.Request["orderNo"].ToString();
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

        string contact = string.IsNullOrEmpty(c.Request["contact"]) ? "" : c.Request["contact"].ToString();
        string mobile = string.IsNullOrEmpty(c.Request["mobile"]) ? "" : c.Request["mobile"].ToString();
        string accountNo = string.IsNullOrEmpty(c.Request["accountNo"]) ? "" : c.Request["accountNo"].ToString();
        string accountPwd = string.IsNullOrEmpty(c.Request["accountPwd"]) ? "" : c.Request["accountPwd"].ToString();

        string mainTrainNo = string.IsNullOrEmpty(c.Request["mainTrainNo"]) ? "" : c.Request["mainTrainNo"].ToString();
        string seatClassCode = string.IsNullOrEmpty(c.Request["seatClassCode"]) ? "" : c.Request["seatClassCode"].ToString();
        string mainSeatClass = string.IsNullOrEmpty(c.Request["mainSeatClass"]) ? "" : c.Request["mainSeatClass"].ToString();
        string departDate = string.IsNullOrEmpty(c.Request["departDate"]) ? "" : c.Request["departDate"].ToString();
        string closeTime = string.IsNullOrEmpty(c.Request["closeTime"]) ? "" : c.Request["closeTime"].ToString();

        accountNo = new _Train().Encrypt(accountNo);
        accountPwd = new _Train().Encrypt(accountPwd);
        
        int uid = string.IsNullOrEmpty(c.Request["uid"]) ? 0 : Convert.ToInt32(c.Request["uid"].ToString());
        Double ticketPrice = string.IsNullOrEmpty(c.Request["ticketPrice"]) ? 0 : Convert.ToDouble(c.Request["ticketPrice"].ToString());
        Double insurePrice = string.IsNullOrEmpty(c.Request["insurePrice"]) ? 0 : Convert.ToDouble(c.Request["insurePrice"].ToString());
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
                orderNo = orderNo,
                isPay = 1
            };

            //创建订单对象
            QpBook book = new QpBook
            {
                queryKey = queryKey,
                outOrderNo = tOrder.orderNo,
                trainNo = trainNo,////车次号 ，如果有多车次请用“|”隔开
                mainTrainNo = mainTrainNo,
                fromStation = fromStation,
                toStation = toStation,
                isProduction = "1",
                ticketModel = "0",
                accountNo = accountNo,
                accountPwd = accountPwd,
                acceptNoSeat = "0",
                seatClassCode = seatClassCode,//"secondseat|firstseat", //座席代号，若有多坐席，请用“|”隔开 
                mainSeatClass = mainSeatClass,
                departDate = departDate,
                closeTime = closeTime
            };

            //联系人信息
            contactInfo contactInfo = new contactInfo
            {
                cellphone = mobile,
                person = contact,
                email = ""
            };

            book.contactInfo = contactInfo;


            if (new Train.Main().AddToDb(tOrder, "t_train_order"))
            {
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
                            passengerType = Convert.ToInt16(pF[3])
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
                bookTickets = new _BookGrabTickets().bookTickets(LitJson.JsonMapper.ToJson(book));

                int msgCode = 0;

                try
                {
                    JObject jo = (JObject)JsonConvert.DeserializeObject(bookTickets);
                    msgCode = Convert.ToInt16(jo["msgCode"].ToString());
                    string outOrderNo = jo["orderNo"].ToString();
                    string msgInfo = jo["msgInfo"].ToString();
                    string orderNo_Get = jo["outOrderNo"].ToString();

                    var o_ = new
                    {
                        state = 1,
                        outOrderNo = outOrderNo
                    };
                    new Train.Main().UpdateDb(o_, "t_train_order", "orderNo = '" + orderNo_Get + "'");
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
            }
        }
        catch
        {

        }
        return bookTickets;
    }

    /// <summary>
    /// 取消订单
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string cancelOrder(HttpContext c)
    {
        string info = Sys_Result.GetR(1, "订单取消失败，请稍后再试");
        string orderNo = string.IsNullOrEmpty(c.Request["orderNo"]) ? "" : c.Request["orderNo"].ToString();
        int uid = string.IsNullOrEmpty(c.Request["uid"]) ? 0 : Convert.ToInt32(c.Request["uid"].ToString());
        user user = new _User().GetUser("", "", uid);
        if (orderNo.Length > 0 && uid != null)
        {
            trainOrder to = new _TrainOrder().GetTrainOrderInfo(orderNo);
            if (to.state == 2 && to.outOrderNo.Length > 0)
            {
                try
                {
                    string logInfo = "取消成功";
                    info = new _CancelOrder().CancelOrder(to.outOrderNo);
                    if (info.IndexOf("请求成功") > -1)
                    {
                        var o = new
                        {
                            state = -100
                        };
                        new Train.Main().UpdateDb(o, "t_train_order", "orderNo = '" + orderNo + "'");
                        info = Sys_Result.GetR(0, "订单取消完成");

                        string PostUrl = "http://59.49.19.109:8016/weixin/TrainHandler.ashx?Fn=4&";
                        string Paras = "orderNo=" + orderNo;
                        Paras += "&Content=订单取消完成";
                        Paras += "&state=-1";
                        PostUrl += Paras;
                        WriteLog(PostUrl);
                        string Rsa = com.seascape.tools.BasicTool.webRequest(PostUrl);  
                    }
                    else
                    {
                        logInfo = "订单取消失败，请稍后再试";
                    }
                    trainLog tl = new trainLog
                    {
                        orderNo = orderNo,
                        content = logInfo,
                        addOn = DateTime.Now
                    };
                    new Train.Main().AddToDb(tl, "t_train_log");
                }
                catch
                {

                }       
            }
        }
        return info;
    }

    /// <summary>
    /// 申请出票
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string applyIssueOrder(HttpContext c)
    {
        string info = "";
        string orderNo = string.IsNullOrEmpty(c.Request["orderNo"]) ? "" : c.Request["orderNo"].ToString();
        if (orderNo.Length > 0)
        {
            trainOrder to = new _TrainOrder().GetTrainOrderInfo(orderNo);
            if (to.state == 2 && to.outOrderNo.Length > 0 && to.isPay == 1)
            {
                try
                {
                    string logInfo = "出票提交成功";
                    info = new _applyIssueOrder().applyIssueOrder(to.outOrderNo);
                    if (info.IndexOf("请求成功") > -1)
                    {
                        var o = new
                        {
                            state = 2,
                            ticketOn = DateTime.Now
                        };
                        new Train.Main().UpdateDb(o, "t_train_order", "orderNo = '" + orderNo + "'");
                    }
                    else
                    {
                        logInfo = "订单出票失败，请稍后再试";
                    }
                    trainLog tl = new trainLog
                    {
                        orderNo = orderNo,
                        content = logInfo,
                        addOn = DateTime.Now
                    };
                    new Train.Main().AddToDb(tl, "t_train_log");
                }
                catch
                {

                }
            }
        }
        return info;
    }

    /// <summary>
    /// 申请退票
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string refundTicket(HttpContext c)
    {
        string info = Sys_Result.GetR(1, "订单退票失败，请稍后再试");
        string orderNo = string.IsNullOrEmpty(c.Request["orderNo"]) ? "" : c.Request["orderNo"].ToString();
        string passengerId = string.IsNullOrEmpty(c.Request["passengerId"]) ? "" : c.Request["passengerId"].ToString();
        if (orderNo.Split('_').Length==3)
        {
            orderNo = orderNo.Split('_')[0] + "_" + orderNo.Split('_')[1];
        }
        if (orderNo.Length > 0 && passengerId.Length > 0)
        {
            trainOrder to = new _TrainOrder().GetTrainOrderInfo(orderNo);
            if (to.outOrderNo.Length > 0 && to.isPay == 1)
            {
                try
                {
                    string logInfo = "退票成功";
                    string[] fArr = passengerId.Split(',');
                    foreach (string item in fArr)
                    {
                        if (item.Length > 0)
                        {
                            info = new _applyRefundOrder().applyRefundOrder(to.outOrderNo, item);        
                        }
                    }
                    
                    if (info.IndexOf("请求成功") > -1)
                    {
                        var o = new
                        {
                            isRefund = 1,
                            refundOn = DateTime.Now
                        };
                        new Train.Main().UpdateDb(o, "t_train_order", "orderNo = '" + orderNo + "'");

                        var of = new
                        {
                            state = 1
                        };
                        new Train.Main().UpdateDb(of, "t_train_fare", "orderNo = '" + orderNo + "' and passengerId = '" + passengerId + "'");
                        info = Sys_Result.GetR(0, "订单退票申请完成");
                    }
                    else
                    {
                        logInfo = "订单退票失败，请稍后再试";
                    }
                    trainLog tl = new trainLog
                    {
                        orderNo = orderNo,
                        content = logInfo,
                        addOn = DateTime.Now
                    };
                    new Train.Main().AddToDb(tl, "t_train_log");
                }
                catch
                {

                }
            }
        }
        return info;
    }
    
    /// <summary>
    /// 乘客信息核验
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string identityPassengers(HttpContext c)
    {
        string passengers = string.IsNullOrEmpty(c.Request["passengers"]) ? "" : c.Request["passengers"].ToString();
        string identityResult = "";
        try
        {
            List<identity_passengers> li = new List<identity_passengers>();
            string[] pArr = passengers.Split('@');
            foreach (string item in pArr)
            {
                if (item.Length > 0 && item.IndexOf("|") > -1)
                {
                    string[] pF = item.Split('|');
                    identity_passengers ip = new identity_passengers
                    {
                        passengerName = pF[0],
                        cardNo = pF[1],
                        cardType = pF[2],
                        passengerType = pF[3]
                    };
                    li.Add(ip);
                }   
            }
            if (li.Count > 0)
            {
                identityResult = new _Identity().IdentityPassengers(li);
            }
        }
        catch
        {

        }
        return identityResult;
    }

    /// <summary>
    /// 乘客信息核验
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string identityPassengersToBasic(HttpContext c)
    {
        string passengers = string.IsNullOrEmpty(c.Request["passengers"]) ? "" : c.Request["passengers"].ToString();
        passengers = c.Server.UrlDecode(passengers);
        string identityResult = "";
        try
        {
            List<identity_passengers> li = new List<identity_passengers>();
            string[] pArr = passengers.Split('@');
            foreach (string item in pArr)
            {
                if (item.Length > 0 && item.IndexOf("|") > -1)
                {
                    string[] pF = item.Split('|');
                    identity_passengers ip = new identity_passengers
                    {
                        passengerName = pF[0],
                        cardNo = pF[1],
                        cardType = pF[2],
                        passengerType = pF[3]
                    };
                    li.Add(ip);
                }
            }
            if (li.Count > 0)
            {
                identityResult = new _Identity().IdentityPassengers(li);
            }
        }
        catch
        {

        }
        return identityResult;
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
            List<trainOrderinfo> lt = new _TrainOrder().GetTrainOrderList(uid);
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
            trainOrderinfo lt = new _TrainOrder().GetTrainOrderInfoForAll(OrderNo);
            var o = new { Return = 0, Msg = "", Info = lt };
            return JsonMapper.ToJson(o);
        }

        return Sys_Result.GetR(1, "获取失败");
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
        //OrderNo = OrderNo.Replace("|", "");
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
        Double price = new _TrainOrder().GetOrderPrice(OrderNo);
        string srcNo = OrderNo;
        if (price > 0)
        {
            string body = "山西出行";
            //int userId = Convert.ToInt32(o.order.user_card_mobile);
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

    private void WriteLog(string strMemo)
    {
        string filename = "D:/HjhkWx/log/train_order_" + DateTime.Now.ToString("yyMMdd") + ".txt";
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