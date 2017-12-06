<%@ WebHandler Language="C#" Class="CodeHandler" %>

using System;
using System.Web;

public class CodeHandler : IHttpHandler {
    
    public void ProcessRequest (HttpContext context) {
        context.Response.ContentType = "text/plain";
        //string img = new QrCode().toCodeImg("hello word", context, 1280);
        string file = context.Server.MapPath("/srouce/adCode/") + "171127174711001280.jpg";
        string r = new QrCode().DecodeQrCode(file);
        context.Response.Write("Hello World1111111----" + r);
    }
 
    public bool IsReusable {
        get {
            return false;
        }
    }

}