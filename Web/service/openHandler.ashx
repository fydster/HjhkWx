<%@ WebHandler Language="C#" Class="openHandler" %>

using System;
using System.Web;
using Model;
using Data;
using ExtApp.QQ.AI;
using Seascape.WxApi;
using TencentYoutuYun.SDK.Csharp;

public class openHandler : IHttpHandler {

    //微信公众号相关
    public static string appid = com.seascape.tools.BasicTool.GetConfigPara("appid-0000");
    public static string secret = com.seascape.tools.BasicTool.GetConfigPara("secret-0000");
    
    // 设置为你自己的密钥对
    string appid_p = "10107050";
    string secretId = "AKIDZx85pLxhX8VeaHv02wd6KJ3ZrujKrohM";
    string secretKey = "YsxnOltnSs41jDTVIqAF9pGTVLxLUSCh";
    string userid = "365069427";
    
    public void ProcessRequest (HttpContext context) {
        string result = FaceMerge(context);
        //string result = wordseg(context);
        context.Response.ContentType = "text/plain";
        context.Response.Write(result);
    }

    /// <summary>
    /// 解析文本
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string wordseg(HttpContext c)
    {
        string result = "";
        string image = string.IsNullOrEmpty(c.Request["image"]) ? "" : c.Request["image"].ToString();
        string text = string.IsNullOrEmpty(c.Request["text"]) ? "" : c.Request["text"].ToString();
        int model = string.IsNullOrEmpty(c.Request["model"]) ? 1 : Convert.ToInt16(c.Request["model"].ToString());
        if (image.Length > 0 || text.Length > 0)
        {
            image = "D:/HjhkWx/ExtActive/face/attach/17120511433316681.jpg";
            //image = "E:/项目/2016/海景航空/微信平台/HjhkWx/Web/ExtActive/face/17120511223060454.jpg";
            Conf.Instance().setAppInfo(appid_p, secretId, secretKey, userid, Conf.Instance().YOUTU_END_POINT);
            result = Youtu.faceMerge(image, "cf_yuren_cungu");
            //result = new _Wordseg().wordseg(text);
            //result = new _Facemerge().facemerge(image, model, "D:/Works/hjhk/face/attach/1712051.jpg");
            //result = new _Facecosmetic().facecosmetic(image);
            //result = new _Faceage().faceage(image);
        }       
        return result;
    }

    public string FaceMerge(HttpContext c)
    {
        string Img_One = string.IsNullOrEmpty(c.Request["Img_One"]) ? "" : c.Request["Img_One"].ToString();
        //Comm.WriteELog("Img_One:" + Img_One);
        string fileName = "ExtActive/face/attach/" + DateTime.Now.ToString("yyMMddHHmmss") + new Random().Next(11111, 99999).ToString() + ".jpg";
        //Comm.WriteELog("fileName:" + fileName);
        string localPath = c.Server.MapPath("~") + fileName;
        //Comm.WriteELog("localPath:" + localPath);
        string tempSrc = new WxTool().downloadMedia(Img_One, localPath, Comm.Get_Access_Token(c));
        //Comm.WriteELog("tempSrc:" + tempSrc);
        //string result = new _Facemerge().facemerge(localPath, 13, c.Server.MapPath("~") + resultFile);
        //Comm.WriteELog("result:" + result);
        Conf.Instance().setAppInfo(appid_p, secretId, secretKey, userid, Conf.Instance().YOUTU_END_POINT);
        string result = Youtu.faceMerge(localPath, "youtu_68068_20171109171756_140");
        return result;
    }

    /// <summary>
    /// 通过Code获取OpenID不写库
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string CheckLogin(HttpContext c)
    {
        string result = "0";
        string src = string.IsNullOrEmpty(c.Request["src"]) ? "" : c.Request["src"].ToString();
        
        int RNum = new Random().Next(100, 999);
        string dates = DateTime.Now.ToString("yyMMdd");
        if (System.IO.Directory.Exists(c.Server.MapPath("~") + "/attach/" + dates) == false)//如果不存在就创建file文件夹
        {
            System.IO.Directory.CreateDirectory(c.Server.MapPath("~") + "/attach/" + dates);
        }
        string localPath = c.Server.MapPath("~") + "/attach/" + dates + "/c_" + RNum + ".jpg";
        //string tempSrc = new WxTool().downloadMedia(src, localPath, Comm.Get_Access_Token(c));


        //Conf.Instance().setAppInfo(appid, secretId, secretKey, userid, Conf.Instance().YOUTU_END_POINT);
        string pathA = localPath;
        string pathB = c.Server.MapPath("~") + "/03.jpg";
        //result = Youtu.facecompare(pathA, pathB);
        return result;
    }

    public static void WriteELog(string strMemo)
    {
        string filename = "D:/Works/hjhk/log/Ext" + DateTime.Now.ToString("yyMMdd") + ".txt";
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

    /// <summary>
    /// 微信认证
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string WxConfig(HttpContext c)
    {
        Common.WxConfig w = InitJsApi(c);
        if (w != null)
        {
            return w.signature + "|" + w.timestamp + "|" + w.nonce + "|" + appid;
        }
        else
        {
            return "";
        }
    }

    /// <summary>
    /// 初始化微信JS
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public Common.WxConfig InitJsApi(HttpContext c)
    {
        try
        {
            string Urls = c.Request["Url"] == null ? "" : c.Request["Url"].ToString();
            bool isFail = string.IsNullOrEmpty(c.Request["isFail"]) ? false : true;
            if (Urls.IndexOf("#") != -1)
            {
                Urls = Urls.Split('#')[0].ToString();
            }
            Urls = Urls.Replace("%26", "&");
            Urls = Urls.Replace("|", "%7C");
            string jsApi_ticket = "";
            string Access_Token = "";
            if (isFail || c.Cache["Para_JsApiTicket"] == null || c.Cache["Para_JsApiTicket"].ToString().Length == 0)
            {
                Access_Token = Comm.Get_Access_Token(c);
                //获取网页调用临时票据
                string r = "";
                jsApi_ticket = new Common(appid, secret).Get_jsapi_ticket(Access_Token, out r);
                c.Cache.Add("Para_JsApiTicket", jsApi_ticket, null, System.DateTime.UtcNow.AddMinutes(100), TimeSpan.Zero, System.Web.Caching.CacheItemPriority.Normal, null);
            }
            else
            {
                jsApi_ticket = c.Cache["Para_JsApiTicket"].ToString();
            }


            string TempS = "";
            Common.WxConfig w = Common.Get_Config_(Urls, jsApi_ticket, out TempS);
            return w;
        }
        catch
        {
            return null;
        }


    }
    
    public bool IsReusable {
        get {
            return false;
        }
    }

}