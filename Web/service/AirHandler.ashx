<%@ WebHandler Language="C#" Class="AirHandler" %>

using System;
using System.Web;
using System.Text;
using System.Collections.Generic;
using System.Xml;
using Newtonsoft.Json;
using Model;
using Data;

public class AirHandler : IHttpHandler {
    
    public void ProcessRequest (HttpContext c) {

        string scity = string.IsNullOrEmpty(c.Request["scity"]) ? "" : c.Request["scity"].ToString();
        string tcity = string.IsNullOrEmpty(c.Request["tcity"]) ? "" : c.Request["tcity"].ToString();
        string date = string.IsNullOrEmpty(c.Request["date"]) ? "" : c.Request["date"].ToString();

        string openId = string.IsNullOrEmpty(c.Request["openId"]) ? "" : c.Request["openId"].ToString();
        int uid = string.IsNullOrEmpty(c.Request["uid"]) ? 0 : Convert.ToInt32(c.Request["uid"].ToString());

        if (1 == 2 && uid < 2000 && openId.Length < 15)
        {
            c.Response.ContentType = "text/plain";
            c.Response.Write("Error");
        }
        else
        {
            c.Response.ContentType = "text/plain";
            string Result = GetAv(scity, tcity, date);

            searchLog slog = new searchLog
            {
                uId = uid,
                fDate = Convert.ToDateTime(date),
                sCode = scity,
                tCode = tcity,
                addOn = DateTime.Now,
                sType = 0
            };
            new Main().AddToDb(slog, "t_search_log");
            
            c.Response.Write(Result);
        }

    }

    public string GetAv(string scity, string tcity, string airdate)
    {
        string Result = "";
        string retString = GetXtyResult(scity + tcity, airdate.Replace("-", "."));
        XmlDocument xmlDocument = new XmlDocument();
        xmlDocument.LoadXml(retString);

        Result = Newtonsoft.Json.JsonConvert.SerializeXmlNode(xmlDocument);  
        return Result;
    }
    
    public string GetXtyResult(string trip, string fdate)
    {
        string posturl = "http://www.skyecho.com/cgishell/module/xml/air_list.pl";
        string username = "TYN105";
        string pass = "j#L7a$HdfG";

        string Corp_ID = "TYN105";
        string Air_date = fdate;
        string Trip = trip;
        string Order_by = "1";
        string Order_type = "1";
        string Show_all = "Y";

        string Sign = "F115A650E737B70472BB380C8BEAF5B7";

        SortedDictionary<string, string> dictArg = new SortedDictionary<string, string>();
        dictArg.Add("Corp_ID", Corp_ID);
        dictArg.Add("Air_date", Air_date);
        dictArg.Add("Trip", Trip);
        dictArg.Add("Share", "N");
        dictArg.Add("Show_all", Show_all);
        dictArg.Add("Order_by", Order_by);
        dictArg.Add("Order_type", Order_type);


        Dictionary<string, string> dicArray = new Dictionary<string, string>();
        foreach (KeyValuePair<string, string> temp in dictArg)
        {
            dicArray.Add(temp.Key, temp.Value);
        }
        StringBuilder prestr = new StringBuilder();
        foreach (KeyValuePair<string, string> temp in dicArray)
        {
            prestr.AppendFormat("{0}={1}&", temp.Key, temp.Value);
        }

        //去掉最後一個&字符
        int nLen = prestr.Length;
        prestr.Remove(nLen - 1, 1);
        string waitSing = prestr.ToString();
        waitSing += pass;

        string sign = System.Web.Security.FormsAuthentication.HashPasswordForStoringInConfigFile(waitSing.ToString(), "MD5").ToUpper();


        System.Net.HttpWebRequest request = (System.Net.HttpWebRequest)System.Net.WebRequest.Create(posturl);
        request.ContentType = "application/x-www-form-urlencoded";
        request.Method = "POST";
        request.Timeout = 20000;

        byte[] btBodys = Encoding.UTF8.GetBytes(prestr.Append(string.Format("&Sign={0}", sign)).ToString());
        request.ContentLength = btBodys.Length;
        request.GetRequestStream().Write(btBodys, 0, btBodys.Length);

        System.Net.HttpWebResponse response = (System.Net.HttpWebResponse)request.GetResponse();

        System.IO.StreamReader streamReader = new System.IO.StreamReader(response.GetResponseStream(), Encoding.GetEncoding("gb2312"));
        string retString = streamReader.ReadToEnd();
        response.Close();
        streamReader.Close();
        request.Abort();

        //WriteLog(retString);
        if (retString.IndexOf("ERROR") > -1)
        {
            WriteLog("ERROR----" + trip + "----" + fdate + "----" + retString);
        }
        
        return retString;
    }


    private void WriteLog(string strMemo)
    {
        string filename = "D:/HjhkWx/log/AVH_" + DateTime.Now.ToString("yyMMdd") + ".txt";
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