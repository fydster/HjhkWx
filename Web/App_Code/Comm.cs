using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Seascape.WxApi;

/// <summary>
/// Comm 的摘要说明
/// </summary>
public class Comm
{
    //微信公众号相关
    public static string appid = com.seascape.tools.BasicTool.GetConfigPara("appid-0000");
    public static string secret = com.seascape.tools.BasicTool.GetConfigPara("secret-0000");


    /// <summary>
    /// 获取全局Access_Token
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public static string Get_Access_Token(HttpContext c)
    {
        string Access_Token = "";
        if (c.Cache["Global_Access_Token_" + appid] == null)
        {
            Access_Token = new Common(appid, secret).Get_Access_Token();
            c.Cache.Add("Global_Access_Token_" + appid, Access_Token, null, System.DateTime.UtcNow.AddMinutes(100), TimeSpan.Zero, System.Web.Caching.CacheItemPriority.Normal, null);
        }
        else
        {
            Access_Token = c.Cache["Global_Access_Token_" + appid].ToString();
        }
        return Access_Token;
    }

    public static string Get_Access_Token_appid(HttpContext c, string appid, string secret)
    {
        string Access_Token = "";
        if (c.Cache["Global_Access_Token_" + appid] == null)
        {
            Access_Token = new Common(appid, secret).Get_Access_Token();
            c.Cache.Add("Global_Access_Token_" + appid, Access_Token, null, System.DateTime.UtcNow.AddMinutes(100), TimeSpan.Zero, System.Web.Caching.CacheItemPriority.Normal, null);
        }
        else
        {
            Access_Token = c.Cache["Global_Access_Token_" + appid].ToString();
        }
        return Access_Token;
    }

    public static void WriteELog(string strMemo)
    {
        string filename = "D:/HjhkWx/log/Ext" + DateTime.Now.ToString("yyMMdd") + ".txt";
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

	public Comm()
	{
		//
		// TODO: 在此处添加构造函数逻辑
		//
	}
}