<%@ WebHandler Language="C#" Class="CountHandler" %>

using System;
using System.Web;
using Model.Count;
using Model;
using Data;
using System.Collections.Generic;
using com.seascape.tools;

public class CountHandler : IHttpHandler {

    public void ProcessRequest(HttpContext c)
    {
        int F = string.IsNullOrEmpty(c.Request["fn"]) ? 0 : Convert.ToInt16(c.Request["fn"]);
        c.Response.ContentType = "text/plain";
        c.Response.Write(GetResult(F, c));
    }

    public string GetResult(int f, HttpContext c)
    {
        string Result = Sys_Result.GetR(1, "System Exception[" + f + "]");
        try
        {
            switch (f)
            {
                case 1:
                    Result = AddMobile(c);
                    break;
                case 100:
                    Result = AddOrder(c);//添加订单
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
    /// 设置提醒
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string AddMobile(HttpContext c)
    {
        string mobile = string.IsNullOrEmpty(c.Request["mobile"]) ? "" : c.Request["mobile"].ToString();
        string sign = string.IsNullOrEmpty(c.Request["uid"]) ? "" : c.Request["uid"].ToString();
        string bNo = string.IsNullOrEmpty(c.Request["state"]) ? "" : c.Request["state"].ToString();
        if (mobile.Length > 0)
        {
            CountMobile r = new CountMobile
            {
                mobile = mobile,
                sign = sign,
                bNo = bNo,
                addOn = DateTime.Now
            };
            if (new Main().AddToDb(r, "count_mobile"))
            {
                return Sys_Result.GetR(0, "完成");
            }            
        }
        return Sys_Result.GetR(1, "失败");
    }


    /// <summary>
    /// 添加订单数据
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string AddOrder(HttpContext c)
    {
        string paras = string.IsNullOrEmpty(c.Request["paras"]) ? "" : c.Request["paras"].ToString();
        if (paras.Length > 0)
        {
            string[] arr = paras.Split('|');
            //uid|orderType|state|orderNo|addOn|ticketCount|price|contact|mobile|ticketOn|isRefund
            try
            {
                CountOrder co = new CountOrder
                {
                    uId = Convert.ToInt32(arr[0]),
                    orderType = Convert.ToInt16(arr[1]),
                    state = Convert.ToInt16(arr[2]),
                    orderNo = arr[3],
                    addOn = Convert.ToDateTime(arr[4]),
                    ticketCount = Convert.ToInt16(arr[5]),
                    price = Convert.ToDouble(arr[6]),
                    contact = arr[7],
                    mobile = arr[8],
                    ticketOn = Convert.ToDateTime(arr[9]),
                    isRefund = Convert.ToInt16(arr[10])
                };

                if (co.orderNo.Length > 0)
                {
                    if (new _CountOrder().IsOrderExsit(co.orderNo) > 0)
                    {
                        return "IsExsit";
                    }
                }
                else
                {
                    return "";
                }

                if (co.uId > 0)
                {
                    user u = new _User().GetUser("", "", co.uId);
                    if (u != null)
                    {
                        co.srcUid = u.srcUid;
                        co.source = u.source;
                    }
                    if (co.source.Length < 4)
                    {
                        co.source = "0000";
                    }
                }
                
                if (new Main().AddToDb(co, "t_count_order"))
                {
                    return "OK";
                }
            }
            catch
            {
                return Sys_Result.GetR(1, "失败");
            }
        }
        return Sys_Result.GetR(1, "失败");
    }
 
    public bool IsReusable {
        get {
            return false;
        }
    }

}