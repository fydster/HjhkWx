<%@ WebHandler Language="C#" Class="lyHandler" %>

using System;
using System.Collections.Generic;
using System.Web;
using Model;
using Model.travel;
using Data;
using LitJson;


public class lyHandler : IHttpHandler {

    public void ProcessRequest(HttpContext c)
    {
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
                    Result = GetProductList(c);//获取产品列表
                    break;
                case 2:
                    Result = GetProductInfo(c);//获取产品详情
                    break;
                case 3:
                    Result = GetClassList(c);//获取分类列表
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
    /// 获取产品列表
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string GetProductList(HttpContext c)
    {
        int cId = string.IsNullOrEmpty(c.Request["cId"]) ? 0 : Convert.ToInt16(c.Request["cId"]);
        string sql = "select * from t_travel_product where enable = 0 order by isHot desc,addOn desc";
        if (cId > 0)
        {
            sql = "select * from t_travel_product where (cId = " + cId + " or cId in(select id from t_class where pId = " + cId + ")) and enable = 0 order by isTj desc, isHot desc,addOn desc";
        }
        List<travelProductInfo> lt = new _TravelProduct().GetSimpleProductList(sql);
        if (lt != null)
        {
            var o = new { Return = 0, Msg = "", List = lt };
            return JsonMapper.ToJson(o);
        }
        return Sys_Result.GetR(1, "");
    }

    /// <summary>
    /// 获取产品详情
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string GetProductInfo(HttpContext c)
    {
        int productId = string.IsNullOrEmpty(c.Request["productId"]) ? 0 : Convert.ToInt16(c.Request["productId"]);
        travelProductInfo tp = new _TravelProduct().GetInfo(productId);
        if (tp != null)
        {
            var o = new { Return = 0, Msg = "", Info = tp };
            return JsonMapper.ToJson(o);
        }
        return Sys_Result.GetR(1, "");
    }

    /// <summary>
    /// 获取分类列表
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string GetClassList(HttpContext c)
    {
        int cType = string.IsNullOrEmpty(c.Request["cType"]) ? 0 : Convert.ToInt16(c.Request["cType"]);
        int CID = string.IsNullOrEmpty(c.Request["CID"]) ? 0 : Convert.ToInt16(c.Request["CID"]);
        List<tClass> la = new _Class().GetClassListForCID(cType, CID);
        if (la != null && la.Count > 0)
        {
            var o = new { Return = 0, Msg = "", List = la };
            return JsonMapper.ToJson(o);
        }
        return Sys_Result.GetR(1, "");
    }
 
    public bool IsReusable {
        get {
            return false;
        }
    }

}