<%@ WebHandler Language="C#" Class="Handler" %>

using System;
using System.Web;
using LitJson;
using System.Collections.Generic;
using com.seascape.tools;
using Seascape.WxApi;
using System.Text;
using Data;

public class Handler : IHttpHandler {

    public static string HjKeyValue = "Seascape.Fast.Fix";

    //微信公众号相关
    public static string appid = com.seascape.tools.BasicTool.GetConfigPara("appid-0000");
    public static string secret = com.seascape.tools.BasicTool.GetConfigPara("secret-0000");    
    
    //分页大小
    public static int perPage = 10;
    public static string BaseUrl = "http://hjhk.edmp.cc/";

    public void ProcessRequest (HttpContext c) {
        AddQueryLog(c);
        int F = string.IsNullOrEmpty(c.Request["fn"]) ? 0 : Convert.ToInt16(c.Request["fn"]);
        c.Response.ContentType = "text/plain";
        //Create(c, "E:/项目/2016/海景航空/微信平台/HjhkWx/Web/poster/temp/753685300853650891.jpg", "89101");
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
                    Result = CreatHB(c);//生成海报
                    break;
                case 100:
                    Result = WxConfig(c);//微信Config
                    break;         
            }
        }
        catch(Exception e)
        {
            Result = e.Message.ToString();
        }
        return Result;
    }


    /// <summary>
    /// 添加参数日志
    /// </summary>
    /// <param name="c"></param>
    public void AddQueryLog(HttpContext c)
    {
        int F = string.IsNullOrEmpty(c.Request["fn"]) ? 0 : Convert.ToInt16(c.Request["fn"]);
        new Main().AddTestLog_B("P[M]F", F.ToString());
        string Query = "";
        foreach (string p in c.Request.Params.AllKeys)
        {
            Query += p + ":" + c.Request[p].ToString() + "&";
            if (p.IndexOf("ALL_HTTP") != -1)
            {
                break;
            }
        }
        new Main().AddTestLog_B("P[M]Query-" + F.ToString(), Query.ToString());
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
            return w.signature + "|" + w.timestamp + "|" + w.nonce + "|" + w.appid;
        }
        else
        {
            return "";
        }
    }

    /// <summary>
    /// 添加修改用户
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string CreatHB(HttpContext c)
    {
        string nick = string.IsNullOrEmpty(c.Request["nick"]) ? "" : c.Request["nick"].ToString();
        string desp = string.IsNullOrEmpty(c.Request["desp"]) ? "" : c.Request["desp"].ToString();
        string serverId = string.IsNullOrEmpty(c.Request["serverId"]) ? "" : c.Request["serverId"].ToString();

        if (serverId.Length > 0)
        {
            string result = BasicTool.MD5(serverId);
            string dates = DateTime.Now.ToString("yyMMdd");
            if (System.IO.Directory.Exists(c.Server.MapPath("~") + "/poster/temp/" + dates) == false)//如果不存在就创建file文件夹
            {
                System.IO.Directory.CreateDirectory(c.Server.MapPath("~") + "/poster/temp/" + dates);
            }
            string localPath = c.Server.MapPath("~") + "/poster/temp/" + dates + "/" + result + ".jpg";
            string tempSrc = new WxTool().downloadMedia(serverId, localPath, Get_Access_Token(c));
            if (tempSrc.Length > 0)
            {
                if (Create(c, localPath, result))
                {
                    var o = new { Return = 0, Msg = dates+"/"+result };
                    return LitJson.JsonMapper.ToJson(o);                    
                }
            }
        }
        var or = new { Return = 1, Msg = "" };
        return LitJson.JsonMapper.ToJson(or);
    }

    /// <summary>
    /// 生成
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public bool Create(HttpContext c,string src,string picName)
    {
        string nick = string.IsNullOrEmpty(c.Request["nick"]) ? "" : c.Request["nick"].ToString();
        string desp = string.IsNullOrEmpty(c.Request["desp"]) ? "" : c.Request["desp"].ToString();
        int type = string.IsNullOrEmpty(c.Request["type"]) ? 0 : Convert.ToInt16(c.Request["type"].ToString());
        
        if (src.Length > 0)
        {
            string dates = DateTime.Now.ToString("yyMMdd");
            if (System.IO.Directory.Exists(c.Server.MapPath("~") + "/poster/result/" + dates) == false)//如果不存在就创建file文件夹
            {
                System.IO.Directory.CreateDirectory(c.Server.MapPath("~") + "/poster/result/" + dates);
            }
            
            //图片地址
            string BgPath = c.Server.MapPath("/poster/img/BGHJ.png");
            if (type == 1)
            {
                BgPath = c.Server.MapPath("/poster/img/BGSX.png");
            }
            string ResultPath = c.Server.MapPath("/poster/result/" + dates + "/" + picName + ".jpg");
            //字体地址
            string FontPath = c.Server.MapPath("/poster/font\\JSJS.ttf");
            string NameFontPath = c.Server.MapPath("/poster/font\\JYY.ttf");
            
            System.Drawing.Image imgUpload = System.Drawing.Image.FromFile(src);
            System.Drawing.Image imgBg = System.Drawing.Image.FromFile(BgPath);     

            //从指定的System.Drawing.Image创建新的System.Drawing.Graphics      
            System.Drawing.Bitmap bmp = new System.Drawing.Bitmap(imgBg.Width, imgBg.Height, System.Drawing.Imaging.PixelFormat.Format32bppArgb);
            System.Drawing.Graphics g = System.Drawing.Graphics.FromImage(bmp);

            g.DrawImage(imgUpload, 115, 224, 410, 540);
            g.DrawImage(imgBg, 0, 0, 640, 1136);
            
            //写名字

            System.Drawing.StringFormat StrFormat = new System.Drawing.StringFormat();
            System.Drawing.Text.PrivateFontCollection fm = new System.Drawing.Text.PrivateFontCollection();
            fm.AddFontFile(FontPath);
            fm.AddFontFile(NameFontPath);
            
            System.Drawing.Font crFont = new System.Drawing.Font(fm.Families[1], 28, System.Drawing.FontStyle.Bold);
            System.Drawing.SolidBrush semiTransBrush2 = new System.Drawing.SolidBrush(System.Drawing.Color.FromArgb(255, 53, 55, 60));
            g.DrawString(nick, crFont, semiTransBrush2, new System.Drawing.PointF(450, 1086), StrFormat);

            crFont = new System.Drawing.Font(fm.Families[0], 18, System.Drawing.FontStyle.Bold);
            semiTransBrush2 = new System.Drawing.SolidBrush(System.Drawing.Color.FromArgb(255, 53, 55, 60));

            int DWidth = 254;
            int DHeight = 965;
            int lineHeight = 40;
            
            int longNum = 15;
            int maxLine = 3;
            if (desp.Length > longNum)
            {
                int lineNum = Convert.ToInt16((desp.Length / longNum) + 0.5);
                if (lineNum > maxLine)
                {
                    lineNum = maxLine;
                }
                string tempdesp = "";
                for (int i = 0; i < lineNum; i++)
                {
                    if (i == (lineNum - 1) && desp.Length < 45)
                    {
                        tempdesp = desp.Substring((i * 15), (desp.Length % longNum));
                    }
                    else
                    {
                        tempdesp = desp.Substring((i * 15), 15);
                    }
                    g.DrawString(tempdesp, crFont, semiTransBrush2, new System.Drawing.PointF(DWidth, DHeight + (i * lineHeight)), StrFormat);
                }
            }
            else
            {
                g.DrawString(desp, crFont, semiTransBrush2, new System.Drawing.PointF(DWidth, DHeight), StrFormat);    
            }
            
            

            bmp.Save(ResultPath, System.Drawing.Imaging.ImageFormat.Jpeg);
            return true;
        }
        return false;
    }
    
    /// <summary>
    /// 获取全局Access_Token
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string Get_Access_Token(HttpContext c)
    {
        string Access_Token = "";
        bool isFail = string.IsNullOrEmpty(c.Request["isFail"]) ? true : true;
        if (isFail || string.IsNullOrEmpty(c.Cache["Global_Access_Token"].ToString()))
        {
            Access_Token = new Common(appid, secret).Get_Access_Token();
            c.Cache.Add("Global_Access_Token", Access_Token, null, System.DateTime.UtcNow.AddMinutes(100), TimeSpan.Zero, System.Web.Caching.CacheItemPriority.Normal, null);
        }
        else
        {
            Access_Token = c.Cache["Global_Access_Token"].ToString();
        }
        return Access_Token;
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
                Access_Token = Get_Access_Token(c);
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