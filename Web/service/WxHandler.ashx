<%@ WebHandler Language="C#" Class="WxHandler" %>

using System;
using System.Web;
using System.IO;
using System.Text;
using Model;
using Model.active;
using Seascape.WxApi;
using Data;
using Data.Tmessage;
using Data.active;
using Seascape.WxApi;
using System.Net;
using LitJson;

public class WxHandler : IHttpHandler {

    HttpContext context = null;
    string postStr = "";
    //微信公众号相关
    public static string appid = com.seascape.tools.BasicTool.GetConfigPara("appid-0000");
    public static string secret = com.seascape.tools.BasicTool.GetConfigPara("secret-0000");  
    
    //默认代金券信息
    public static int voucherFee = 120;
    public static string voucherS = "R";
    public static string source = "0000";
    public static string sxSource = "|0000|0359|0355|0001|0357|0352|0358|0350|0356|0349|0353|0354|0351|";
    public static string city = "山西出行";
    public static int isVoucher = 0;
    public static string BaseUrl = "http://hjhk.edmp.cc/";
    
    public void ProcessRequest(HttpContext param_context)
    {
        context = param_context;
        source = string.IsNullOrEmpty(context.Request["source"]) ? "0000" : context.Request["source"].ToString();
        WriteLog("source:-------" + source);
        WriteLog("city:-------" + city);
        OperOpenID(source,param_context);
        WriteLog("city:-------" + city);
        //new voucher().SendVoucher(9431, 8647);
        //return;
        //以写日志为荣,以打断点为耻.
        //WriteLog("before valid \n");
        //valid();//用于验证
        /*
        var echostr = context.Request["echoStr"].ToString();
        if (!string.IsNullOrEmpty(echostr))
        {
            if (checkSignature())
            {
                context.Response.Write(echostr);
                context.Response.End();//推送...不然微信平台无法验证token                
            }
        }
        */
        //WriteLog("after valid, before post \n");
        if (context.Request.HttpMethod.ToLower() == "post")
        {
            System.IO.Stream s = context.Request.InputStream;
            byte[] b = new byte[s.Length];
            s.Read(b, 0, (int)s.Length);
            postStr = System.Text.Encoding.UTF8.GetString(b);
            //WriteLog("SrcText:" + postStr);
            if (!string.IsNullOrEmpty(postStr))
            {
                responseMsg(postStr, param_context);
            }
        }
    }

    public void valid()
    {
        var echostr = context.Request["echoStr"].ToString();
        if (checkSignature() && !string.IsNullOrEmpty(echostr))
        {
            context.Response.Write(echostr);
            context.Response.End();//推送...不然微信平台无法验证token
        }
    }
 
    public bool checkSignature()
    {
        var signature = context.Request["signature"].ToString();
        var timestamp = context.Request["timestamp"].ToString();
        var nonce = context.Request["nonce"].ToString();
        var token = "1796699EE40D4CE7B0EC5003B9D0CA26";
        string[] ArrTmp = { token, timestamp, nonce };
        Array.Sort(ArrTmp);     //字典排序
        string tmpStr = string.Join("", ArrTmp);
        tmpStr = System.Web.Security.FormsAuthentication.HashPasswordForStoringInConfigFile(tmpStr, "SHA1");
        tmpStr = tmpStr.ToLower();
        if (tmpStr == signature)
        {
            return true;
        }
        else
        {
            return false;
        }
    }
 
    public string GetSha1(System.Collections.Generic.List<string> codelist)
    {
        codelist.Sort();
        var combostr = string.Empty;
        for (int i = 0; i < codelist.Count; i++)
        {
            combostr += codelist[i];
        }
        return EncryptToSHA1(combostr);
    }
 
    public string EncryptToSHA1(string str)
    {
        System.Security.Cryptography.SHA1CryptoServiceProvider sha1 = new System.Security.Cryptography.SHA1CryptoServiceProvider();
        byte[] str1 = System.Text.Encoding.UTF8.GetBytes(str);
        byte[] str2 = sha1.ComputeHash(str1);
        sha1.Clear();
        (sha1 as IDisposable).Dispose();
        return Convert.ToBase64String(str2);
    }
 
    public void responseMsg(string postStr,HttpContext c)
    {
        System.Xml.XmlDocument postObj = new System.Xml.XmlDocument();
        postObj.LoadXml(postStr);
        WriteLog("responseMsg:-------" + postStr);
        //WriteLog("XmlObj:-------" + postObj);
        string FromUserName = "";
        string ToUserName = "";
        string Content = "";
        string VoucherContent = "";
        string GetContent = "";
        string GiftContent = "";
        string StreamNo = "";
        string MsgType = "";
        string srcDesp = "";
        int MenuKey = 0;

        string FContent = "";
        int QjUid = 0;
        int QrCode = 0;
        string FOpenId = "";
        string FNickName = "";
        string kefu = "test1@test";
        int giftType = 1;
        int isGz = 0;
        try
        {
            FromUserName = postObj.GetElementsByTagName("FromUserName").Item(0).InnerText;
            ToUserName = postObj.GetElementsByTagName("ToUserName").Item(0).InnerText;
            MsgType = postObj.GetElementsByTagName("MsgType").Item(0).InnerText;
            GetContent = postObj.GetElementsByTagName("Content").Item(0).InnerText;
            MsgType = MsgType.ToLower();      
        }
        catch(Exception ex)
        {
            WriteLog("Exception" + ex.ToString());
        }
        WriteLog("MsgType:-------" + MsgType);
        switch (MsgType)
        {
            case "text"://文本消息
                if (GetContent == "分销注册")
                {
                    Content = "分销注册，请点击以下链接！\n\n<a href='https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + appid + "&redirect_uri=http%3a%2f%2fhjhk.edmp.cc%2ffx%2fc_reg_fx.html&response_type=code&scope=snsapi_userinfo&state=00000" + appid + "#wechat_redirect'>立即注册</a>";
                }
                else
                {
                    if (GetContent.StartsWith("FXC-"))
                    {
                        try
                        {
                            int fxId = Convert.ToInt32(GetContent.Replace("FXC-", ""));
                            var ofx = new
                            {
                                balance = 2
                            };
                            if (new Main().UpdateDb(ofx, "t_user", "id=" + fxId))
                            {
                                Content = "分销审核完成";
                            }
                        }
                        catch
                        {
                            
                        }
                    }
                    else
                    {
                        Content = "Hello，主人～小编刚被领导训，罚站两分钟，暂时不能接驾，如有急需，请拨0351-8777777";        
                    }
                }
                break;
            case "event"://事件
                string Event = postObj.GetElementsByTagName("Event").Item(0).InnerText;
                WriteLog("EventStr" + Event);
                Event = Event.ToLower();
                switch (Event)
                {
                    case "unsubscribe":
                        var oUN = new
                        {
                            isSubscribe = 0
                        };
                        new Main().UpdateDb(oUN, "t_user", "openId = '" + FromUserName + "'");
                        break;
                    case "subscribe"://关注
                        isGz = 1;
                        try
                        {
                            QrCode = Convert.ToInt32(postObj.GetElementsByTagName("EventKey").Item(0).InnerText.Replace("qrscene_", ""));//是否获取二维码
                        }
                        catch
                        {
                            QrCode = 0;
                        }
                        WriteLog("关注来源" + QrCode);
                        user u = new _User().GetUser(FromUserName, "", 0);
                        Content = city.Replace("出行", "") + "老乡出行首选" + city + "。公务行、差旅行、自由行，提供在线机票、酒店预订，超值低价提醒、自助便捷出行、微信客服时时在线、优享机场贵宾服务。你选择我，我服务您！贵宾专线4006660000";
                        Content = city+ "随时随地为您提供公务行、差旅行、自由行，提供在线机票、酒店预订，超值低价提醒、自助便捷出行、微信客服时时在线、优享机场贵宾服务。你选择我，我服务您！贵宾专线4006660000";
                        if(source=="0000")
                        {
                            Content = "飞行出行，10年专注！\n\n出行预定<a href='https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + appid + "&redirect_uri=http%3a%2f%2fhjhk.edmp.cc%2fc_home.html&response_type=code&scope=snsapi_userinfo&state=00000" + appid + "#wechat_redirect'>点击这里</a>\n\n\n定制低价提醒<a href='https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + appid + "&redirect_uri=http%3a%2f%2fhjhk.edmp.cc%2fc_index_home.html&response_type=code&scope=snsapi_userinfo&state=00000" + appid + "#wechat_redirect'>点击这里</a>。";
                        }
                        if (u == null)
                        {
                            string r = "";
                            Seascape.WxApi.UserInfo ui = Seascape.WxApi.UserInfo.getUserInfoByGlobal(Comm.Get_Access_Token(c), FromUserName, out r);
                            new Main().AddTestLog("r", r);
                            if (ui != null && !string.IsNullOrEmpty(ui.nickname))
                            {
                                u = new user();
                                u.nickName = ui.nickname.Replace("'", "").Replace(@"""", "");
                                u.photoUrl = ui.headimgurl;
                                u.area = ui.country + "|" + ui.province + "|" + ui.city;
                                u.sex = ui.sex;
                                u.openId = ui.openid;
                                u.source = source;
                                u.srcUid = QrCode;
                                u.mobile = "";
                                u.contact = "";
                                u.addOn = DateTime.Now;
                                u.isSubscribe = ui.subscribe;
                                int uid = new Main().AddToDbForId(u, "t_user");
                                //WriteLog("关注uid" + uid);
                                if (uid > 0)
                                {
                                    QjUid = uid;
                                    /*
                                    //WriteLog("关注uid--1" + uid);
                                    int giftNum = new _Gift().IsExsit(uid, 1);
                                    //WriteLog("关注uid--2" + giftNum);
                                    if (giftNum == 0)
                                    {
                                        int giftAll = new _Gift().allNum(1);
                                        int isSend = 1;
                                        
                                        if (giftAll > 4800)
                                        {
                                            isSend = 0;
                                            giftType = 0;
                                        }
                                        
                                        
                                        QjUid = uid;
                                        //WriteLog("关注QjUid" + QjUid);
                                        if (isSend == 1)
                                        {
                                            Gift gt = new Gift
                                            {
                                                addOn = DateTime.Now,
                                                uId = uid,
                                                giftType = 1,
                                                giftName = "宇文河生态庄园门票",
                                                streamNo = "G1" + DateTime.Now.ToString("yyMMddHHmmss") + uid.ToString().PadLeft(5, '0')
                                            };
                                            new Main().AddToDb(gt, "t_active_gift");
                                            GiftContent = "山西出行送你“宇文河生态庄园门票一张”，点击查看兑换方式";
                                            StreamNo = gt.streamNo;   
                                        }
                                    }
                                    */
                                    //送120元代金券--关注人

                                    int VoucherCount = new _Voucher().GetVoucherCount(uid, QrCode);

                                    if (VoucherCount == 0)
                                    {
                                        if (sxSource.IndexOf("|" + source + "|") > -1)
                                        {
                                            new _Voucher().SendVoucher(uid, QrCode);
                                            voucherFee = 120;                                            
                                        }
                                        else
                                        {
                                            new _Voucher().SendVoucherForWs(uid, QrCode);
                                            voucherFee = 120;   
                                        }
                                        
                                        
                                        if (QrCode > 2010)
                                        {
                                            user fuser = new _User().GetUser("", "", QrCode);
                                            if (fuser != null)
                                            {
                                                //Content = "飞行出行，10年专注！\n你的好友" + fuser.nickName + "送您的“山西出行”120元代金礼券，已经存入您的私人飞行账户。\n将这份幸运分享下去，邀请好友关注，立即为TA送出120元飞行代金礼券";
                                                string pm = new _User().getUserPM(QrCode);
                                                if (pm.IndexOf("|") > -1)
                                                {
                                                    FContent = fuser.nickName + "，您的好友[" + u.nickName + "]已经收到您送出的“山西出行”120元代金礼券。\n截止目前，一共有" + pm.Split('|')[0] + "个好友通过您的分享码获得飞行代金礼券";
                                                    FOpenId = fuser.openId;
                                                    FNickName = u.nickName;
                                                    /*
                                                    try
                                                    {
                                                        var allYqNum = Convert.ToInt16(pm.Split('|')[0]);
                                                        if (allYqNum == 3)
                                                        {
                                                            int giftNum = new _Gift().IsExsit(QrCode, 0);
                                                            if (giftNum == 0)
                                                            {
                                                                Gift gt = new Gift
                                                                {
                                                                    addOn = DateTime.Now,
                                                                    uId = QrCode,
                                                                    giftType = 1,
                                                                    giftName = "宇文山庄门票",
                                                                    streamNo = "G1" + DateTime.Now.ToString("yyMMddHHmmss") + QrCode.ToString().PadLeft(5, '0')
                                                                };
                                                                new Main().AddToDb(gt, "t_active_gift");
                                                                GiftContent = "恭喜您获得“宇文山庄门票一张”，兑换时间：“2017年7月15日 上午10点-12点在茂业天地二期大厅”";
                                                                StreamNo = gt.streamNo;
                                                            }
                                                        }
                                                    }
                                                    catch
                                                    {
                                                        
                                                    }*/
                                                }
                                            }
                                        }
                                        /*
                                        if (QrCode > 1000 && QrCode < 2010)
                                        {
                                            user fuser = new _User().GetUser("", "", QrCode);
                                            if (fuser != null)
                                            {
                                                Content = "飞行出行，10年专注！\n" + fuser.nickName + "送您的“山西出行”120元代金礼券，已经存入您的私人飞行账户。\n将这份幸运分享下去，邀请好友关注，立即为TA送出120元飞行代金礼券。";
                                            } 
                                        }
                                        */
                                        VoucherContent = srcDesp + voucherFee + "元代金券,已经存入您的私人飞行账户。";
                                    }
                                    
                                    
                                }
                            }
                        }
                        else
                        {
                            QjUid = u.id;
                            if (u.isSubscribe == 0)
                            {
                                string r = "";
                                Seascape.WxApi.UserInfo ui = Seascape.WxApi.UserInfo.getUserInfoByGlobal(Comm.Get_Access_Token(c), FromUserName, out r);
                                new Main().AddTestLog("r-10", r);
                                if (ui != null && !string.IsNullOrEmpty(ui.nickname))
                                {
                                    u = new user
                                    {
                                        nickName = ui.nickname.Replace("'", "").Replace(@"""", ""),
                                        photoUrl = ui.headimgurl,
                                        area = ui.country + "|" + ui.province + "|" + ui.city,
                                        sex = ui.sex,
                                        isSubscribe = ui.subscribe
                                    };
                                    new Main().UpdateDb(u, "t_user", "id=" + u.id);
                                    
                                    int VoucherCount = new _Voucher().GetVoucherCount(u.id, u.srcUid);

                                    if (VoucherCount == 0)
                                    {
                                        if (sxSource.IndexOf("|" + source + "|") > -1)
                                        {
                                            new _Voucher().SendVoucher(u.id, u.srcUid);
                                            voucherFee = 120;
                                        }
                                        else
                                        {
                                            new _Voucher().SendVoucherForWs(u.id, u.srcUid);
                                            voucherFee = 120;
                                        }

                                        VoucherContent = "飞行出行，10年专注！" + srcDesp + voucherFee + "元代金券,已经存入您的私人飞行账户。";
                                    }
                                   
                                }
                            }
                            
                        }
                        break;
                    case "scan"://已关注的扫描二维码
                        Content = "亲，欢迎再次回到山西出行";
                        //QjUid = 100;
                        try
                        {
                            u = new _User().GetUser(FromUserName, "", 0);
                            QrCode = Convert.ToInt32(postObj.GetElementsByTagName("EventKey").Item(0).InnerText.Replace("SCENE_", ""));//是否获取二维码
                            QjUid = u.id;
                            /*
                            int giftNum = new _Gift().IsExsit(u.id, 1);
                            if (giftNum == 0)
                            {

                                int giftAll = new _Gift().allNum(1);
                                int isSend = 1;
                                if (giftAll > 4800)
                                {
                                    isSend = 0;
                                    giftType = 0;
                                }
                                
                                QjUid = u.id;

                                if (isSend == 1)
                                {
                                    Gift gt = new Gift
                                    {
                                        addOn = DateTime.Now,
                                        uId = u.id,
                                        giftType = 1,
                                        giftName = "宇文河生态庄园门票",
                                        streamNo = "G1" + DateTime.Now.ToString("yyMMddHHmmss") + u.id.ToString().PadLeft(5, '0')
                                    };
                                    new Main().AddToDb(gt, "t_active_gift");
                                    GiftContent = "山西出行送你“宇文河生态庄园门票一张”，点击查看兑换方式";
                                    StreamNo = gt.streamNo;                                    
                                }
                            }
                            */ 
                            /*
                            if (FromUserName == "oKhuCwXUcG1KFsUd0Cti9HakBLC8")
                            {
                                FOpenId = FromUserName;
                                int giftNum = new _Gift().IsExsit(8643, 0);
                                if (giftNum == 0)
                                {
                                    Gift gt = new Gift
                                    {
                                        addOn = DateTime.Now,
                                        uId = 8643,
                                        giftType = 1,
                                        giftName = "宇文山庄门票",
                                        streamNo = "G1" + DateTime.Now.ToString("yyMMddHHmmss") + QrCode.ToString().PadLeft(5, '0')
                                    };
                                    new Main().AddToDb(gt, "t_active_gift");
                                    GiftContent = "恭喜您获得“宇文山庄门票一张”，兑换时间：“2017年7月15日 上午10点-12点在茂业天地二期大厅”";
                                    StreamNo = gt.streamNo;
                                }
                            }*/
                        }
                        catch
                        {
                            QrCode = 0;
                        }
                        //有来源码并且来源吗不是老用户
                        /*
                        if (isVoucher == 0)
                        {
                            user u_ = new _User().GetUser(FromUserName, "", 0);
                            if (u_ != null)
                            {
                                int VoucherCount = new _Voucher().GetVoucherCount(u_.id, QrCode);
                                if (VoucherCount == 0)
                                {
                                    new _Voucher().SendVoucher(u_.id, QrCode);
                                    Content = "飞行出行，10年专注！" + srcDesp + voucherFee + "元代金券,已经存入您的私人飞行账户。";
                                }
                            }

                        }        */                
                        break;
                    case "click":
                        string key = postObj.GetElementsByTagName("EventKey").Item(0).InnerText.Replace("qrscene_", "");//是否获取二维码
                        WriteLog("click" + key);
                        if (key == "SXCX_GJJP")
                        {
                            MenuKey = 1;
                            kefu = "kf2001@gh_e67ca5c82957"; 
                        }
                        if (key == "SXCX_JDYD")
                        {
                            MenuKey = 2;
                            kefu = "kf2002@gh_e67ca5c82957";
                        }
                        Content = "正在为您接通客服，请稍后，您也可以直接拨打客服电话4006660000";
                        if (key == "SXCX_BUILD")
                        {
                            Content = "栏目正在建设中......";
                        }
                        if (key == "SXCX_GYLMK")
                        {
                            Content = "海景航空和中国工商银行联合发行海景工银联名信用卡，老客户办理热线0351-8777777";
                        }
                        break;
                }
                break;
        }
        if (MsgType == "text")
        {
            //var textpl_ = "<xml><ToUserName><![CDATA[" + FromUserName + "]]></ToUserName>" +
            //             "<FromUserName><![CDATA[" + ToUserName + "]]></FromUserName>" +
            //             "<CreateTime>" + ConvertDateTimeInt(DateTime.Now) + "</CreateTime><MsgType><![CDATA[transfer_customer_service]]></MsgType>" +
            //             "</xml> ";
            //WriteLog("客服消息" + textpl_);
            //context.Response.Write(textpl_);
            //context.Response.End();            
            //context.Response.Write("<xml><ToUserName><![CDATA[" + ToUserName + "]]></ToUserName><FromUserName><![CDATA[" + FromUserName + "]]></FromUserName><CreateTime>" + ConvertDateTimeInt(DateTime.Now) + "</CreateTime><MsgType><![CDATA[transfer_customer_service]]></MsgType></xml>");
            //context.Response.End();
        }
        if (MsgType == "event" && MenuKey > 0)
        {
            string url = "https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token=" + Comm.Get_Access_Token(c);
            string content = "{\"touser\":\"" + FromUserName + "\",\"msgtype\":\"text\",\"text\":{\"content\":\"" + Content + "\"}}";
            WriteLog(new WxTool().webRequest(url, content));
            
            var textpl_ = "<xml><ToUserName><![CDATA[" + FromUserName + "]]></ToUserName>" +
             "<FromUserName><![CDATA[" + ToUserName + "]]></FromUserName>" +
             "<CreateTime>" + ConvertDateTimeInt(DateTime.Now) + "</CreateTime><MsgType><![CDATA[transfer_customer_service]]></MsgType>" +
             "<TransInfo><KfAccount><![CDATA[" + kefu + "]]></KfAccount></TransInfo>" +
             "</xml> ";
            WriteLog("客服消息" + textpl_);
            context.Response.Write(textpl_);
            context.Response.End();
        }

        if (QrCode == 1500)
        {
            Content = "2017 首届龙城太原 “小龙人”评选大赛,即 《2017太原国际马拉松赛吉祥物》代言人选拔赛网络投票 ";
            //Content = Content + "\n\n<a href='https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx9d23334360aa6af4&redirect_uri=http%3a%2f%2fhjhk.edmp.cc%2factive%2fvote%2fsign.html&response_type=code&scope=snsapi_userinfo&state=00000wx9d23334360aa6af4#wechat_redirect'>点击这里报名</a>";
            Content = Content + "\n\n<a href='https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx9d23334360aa6af4&redirect_uri=http%3a%2f%2fhjhk.edmp.cc%2factive%2fvote%2fvote.html&response_type=code&scope=snsapi_base&state=00001wx9d23334360aa6af4#wechat_redirect'>点击这里开始投票</a>";
        }
      
        var time = DateTime.Now;
        var textpl = "<xml><ToUserName><![CDATA[" + FromUserName + "]]></ToUserName>" +
                     "<FromUserName><![CDATA[" + ToUserName + "]]></FromUserName>" +
                     "<CreateTime>" + ConvertDateTimeInt(DateTime.Now) + "</CreateTime><MsgType><![CDATA[text]]></MsgType>" +
                     "<Content><![CDATA[" + Content + "]]></Content><FuncFlag>0</FuncFlag></xml> ";
        WriteLog("客服消息" + textpl);
        context.Response.Write(textpl);

        if (isGz == 1)
        {
            string Common_Info = "山西出行是国有企业-山西省文旅投资控股集团有限公司下属集团控股子公司－海景航空商旅倾力打造的本土互联网综合商旅平台，集国内国际机票、公务票、酒店、动车火车票、景区门票预订，机票低价提醒、国内外旅游服务、旅游攻略发布、航班动态追踪等实用功能于一体的商旅平台。\n\n山西出行让您的旅程更便捷、更自由。让世界各地的游客出行山西时，感受到周到而贴心的服务。24小时专属服务，本地服务更靠谱。";
            string url_Common = "https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token=" + Comm.Get_Access_Token(c);
            string content_Common = "{\"touser\":\"" + FromUserName + "\",\"msgtype\":\"text\",\"text\":{\"content\":\"" + Common_Info + "\"}}";
            WriteLog(new WxTool().webRequest(url_Common, content_Common));            
        }
       
        
        if (QrCode == 1500)
        {
            
        }
        else
        {
            //下发代金券提醒
            if (VoucherContent.Length > 0)
            {
                string url = "https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token=" + Comm.Get_Access_Token(c);
                string content = "{\"touser\":\"" + FromUserName + "\",\"msgtype\":\"text\",\"text\":{\"content\":\"" + VoucherContent + "\"}}";
                WriteLog(new WxTool().webRequest(url, content));
            }

            if (FContent.Length > 0 && FOpenId.Length > 0)
            {
                string MsgContent = "";
                TMsg_Voucher tmo = new TMsg_Voucher().GetMessageBody(FContent, FNickName, DateTime.Now.ToString("yyyy-MM-dd HH:mm"), "", out MsgContent);
                SendTemplateMessage(c, tmo, new TMsg_Voucher().Key(), FOpenId, BaseUrl + "", MsgContent, source);
            }

            //下发礼品领取提醒
            /*
            if (QjUid > 0 && giftType > 0)
            {
                string MsgContent = "";
                TMsg_Gift tmo = new TMsg_Gift().GetMessageBody(GiftContent, "宇文河生态庄园门票一张", StreamNo, "截至2017年10月30日", "点击查看兑换方式", out MsgContent);
                SendTemplateMessage(c, tmo, new TMsg_Gift().Key(), FromUserName, BaseUrl + "/active/student/c_gift_hx.html?streamNo=" + StreamNo, MsgContent, source);

                Gift gt = new Gift
                {
                    addOn = DateTime.Now,
                    uId = QjUid,
                    giftType = 11,
                    giftName = "免费拍照—出入境证件照&最美证件照",
                    streamNo = "Ga" + DateTime.Now.ToString("yyMMddHHmmss") + QjUid.ToString().PadLeft(5, '0')
                };
                new Main().AddToDb(gt, "t_active_gift");
                GiftContent = "山西出行送你“免费拍照—出入境证件照&最美证件照”，点击查看兑换方式";

                tmo = new TMsg_Gift().GetMessageBody(GiftContent, "免费拍照—出入境证件照&最美证件照", gt.streamNo, "截至2017年10月30日", "点击查看兑换方式", out MsgContent);
                SendTemplateMessage(c, tmo, new TMsg_Gift().Key(), FromUserName, BaseUrl + "/active/student/c_gift_hx_js.html?streamNo=" + gt.streamNo, MsgContent, source);
            }
        
            //下发礼品领取提醒-未获取门票
            if (QjUid > 0 && giftType == 0)
            {
                string noTicket = "哎呦,主人~您来晚了，门票已经被别人领回家了 继续关注我们，还有更多爱心礼包发放哦~记住，下次早点来";
                string url = "https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token=" + Get_Access_Token(c);
                string content = "{\"touser\":\"" + FromUserName + "\",\"msgtype\":\"text\",\"text\":{\"content\":\"" + noTicket + "\"}}";
                WriteLog(new WxTool().webRequest(url, content));
            }
            */
            if (QjUid > 0 && QrCode != 1211)
            {
                string hd = "";// "重金寻人\n\n<a href='https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx9d23334360aa6af4&redirect_uri=http%3a%2f%2fhjhk.edmp.cc%2factive%2fstudent%2fc_find.html&response_type=code&scope=snsapi_base&state=00000wx9d23334360aa6af4#wechat_redirect'>点击这里</a> 报名\n\n\n<a href='http://mp.weixin.qq.com/s/Ld57b3JfsKjgdd7ZJaGzkg'>点击这里</a> 查看详情";
                string hdurl = "";//"https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token=" + Get_Access_Token(c);
                string hdcontent = "";//"{\"touser\":\"" + FromUserName + "\",\"msgtype\":\"text\",\"text\":{\"content\":\"" + hd + "\"}}";
                //WriteLog(new WxTool().webRequest(hdurl, hdcontent));

                hd = "山西出行2017高考季“找个老乡 一起上大学”爱心送考生公益活动，专属礼包开领啦\n\n↓↓↓";
                hd = hd + "\n\n状元免票 <a href='http://mp.weixin.qq.com/s/7lTGYy_PiHxXNXOb9GOvBA'>点击这里</a>";
                hd = hd + "\n\n学子专享 <a href='http://mp.weixin.qq.com/s/SUmtTfFJ3sGL9DrSrIkNHw'>点击这里</a>";
                hd = hd + "\n\n贫困助学 <a href='https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx9d23334360aa6af4&redirect_uri=http%3a%2f%2fhjhk.edmp.cc%2factive%2fstudent%2fc_find.html&response_type=code&scope=snsapi_userinfo&state=00000wx9d23334360aa6af4#wechat_redirect'>点击这里</a>";
                hd = hd + "\n\n移动流量 <a href='http://wap.sx.10086.cn/m/hellouniv.html'>点击这里</a>";
                hd = hd + "\n\n其他礼包 <a href='https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx9d23334360aa6af4&redirect_uri=http%3a%2f%2fhjhk.edmp.cc%2factive%2fstudent%2fc_gift_other.html&response_type=code&scope=snsapi_userinfo&state=00000wx9d23334360aa6af4#wechat_redirect'>点击这里</a>";
                hdurl = "https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token=" + Comm.Get_Access_Token(c);
                hdcontent = "{\"touser\":\"" + FromUserName + "\",\"msgtype\":\"text\",\"text\":{\"content\":\"" + hd + "\"}}";
                //WriteLog(new WxTool().webRequest(hdurl, hdcontent));

                //SendImage(QjUid,c,FromUserName);
                //jWPDnLKdX671tqzxYkcrJSuvsDUu8n5RAwysiIwczS7GbAB_vs9JbnuxPK7x9n_L
                string url = "https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token=" + Comm.Get_Access_Token(c);
                string content = "{\"touser\":\"" + FromUserName + "\",\"msgtype\":\"image\",\"image\":{\"media_id\":\"jWPDnLKdX671tqzxYkcrJSuvsDUu8n5RAwysiIwczS7GbAB_vs9JbnuxPK7x9n_L\"}}";
                //WriteLog(new WxTool().webRequest(url, content));
            }
            //状元免票
            //http://mp.weixin.qq.com/s/7lTGYy_PiHxXNXOb9GOvBA
            //学子专享特价
            //http://mp.weixin.qq.com/s/SUmtTfFJ3sGL9DrSrIkNHw
            //贫困助学
            //https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx9d23334360aa6af4&redirect_uri=http%3a%2f%2fhjhk.edmp.cc%2factive%2fstudent%2fc_index.html&response_type=code&scope=snsapi_userinfo&state=00000wx9d23334360aa6af4#wechat_redirect
            //领取移动流量
            //http://wap.sx.10086.cn/m/hellouniv.html
        }
        
        context.Response.End();
    }
     
    private DateTime UnixTimeToTime(string timeStamp)
    {
        DateTime dtStart = TimeZone.CurrentTimeZone.ToLocalTime(new DateTime(1970, 1, 1));
        long lTime = long.Parse(timeStamp + "0000000");
        TimeSpan toNow = new TimeSpan(lTime);
        return dtStart.Add(toNow);
    }
 
    private int ConvertDateTimeInt(System.DateTime time)
    {
        System.DateTime startTime = TimeZone.CurrentTimeZone.ToLocalTime(new System.DateTime(1970, 1, 1));
        return (int)(time - startTime).TotalSeconds;
    }

    public void SendImage(int uid, HttpContext c, string openId)
    {
        string FilePath = c.Server.MapPath("/active/student/adNew.jpg");
        string url = string.Format("http://file.api.weixin.qq.com/cgi-bin/media/upload?access_token={0}&type={1}", Comm.Get_Access_Token(c), "image");
        string json = HttpUploadFile(url, FilePath);
        WriteLog(json);
        JsonData j = JsonMapper.ToObject(json);
        try
        {
            string media_id = j["media_id"].ToString();
            WriteLog(media_id);
            url = "https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token=" + Comm.Get_Access_Token(c);
            string content = "{\"touser\":\"" + openId + "\",\"msgtype\":\"image\",\"image\":{\"media_id\":\"" + media_id + "\"}}";
            WriteLog(new WxTool().webRequest(url, content));
        }
        catch (Exception e)
        {

        }
    }

    public static string HttpUploadFile(string url, string path)//这个方法是两个URL第一个url是条到微信的，第二个是本地图片路径
    {
        // 设置参数
        HttpWebRequest request = WebRequest.Create(url) as HttpWebRequest;
        CookieContainer cookieContainer = new CookieContainer();
        request.CookieContainer = cookieContainer;
        request.AllowAutoRedirect = true;
        request.Method = "POST";
        string boundary = DateTime.Now.Ticks.ToString("X"); // 随机分隔线
        request.ContentType = "multipart/form-data;charset=utf-8;boundary=" + boundary;
        byte[] itemBoundaryBytes = Encoding.UTF8.GetBytes("\r\n--" + boundary + "\r\n");
        byte[] endBoundaryBytes = Encoding.UTF8.GetBytes("\r\n--" + boundary + "--\r\n");

        int pos = path.LastIndexOf("\\");
        string fileName = path.Substring(pos + 1);

        //请求头部信息
        StringBuilder sbHeader = new StringBuilder(string.Format("Content-Disposition:form-data;name=\"file\";filename=\"{0}\"\r\nContent-Type:application/octet-stream\r\n\r\n", fileName));
        byte[] postHeaderBytes = Encoding.UTF8.GetBytes(sbHeader.ToString());

        FileStream fs = new FileStream(path, FileMode.Open, FileAccess.Read);
        byte[] bArr = new byte[fs.Length];
        fs.Read(bArr, 0, bArr.Length);
        fs.Close();

        Stream postStream = request.GetRequestStream();
        postStream.Write(itemBoundaryBytes, 0, itemBoundaryBytes.Length);
        postStream.Write(postHeaderBytes, 0, postHeaderBytes.Length);
        postStream.Write(bArr, 0, bArr.Length);
        postStream.Write(endBoundaryBytes, 0, endBoundaryBytes.Length);
        postStream.Close();

        //发送请求并获取相应回应数据
        HttpWebResponse response = request.GetResponse() as HttpWebResponse;
        //直到request.GetResponse()程序才开始向目标网页发送Post请求
        Stream instream = response.GetResponseStream();
        StreamReader sr = new StreamReader(instream, Encoding.UTF8);
        //返回结果网页（html）代码
        string content = sr.ReadToEnd();
        return content;
    }
 
    private void WriteLog(string strMemo)
    {
        string filename = "D:/HjhkWx/log/"+DateTime.Now.ToString("yyMMdd")+".txt";
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
    /// 发送模板消息
    /// </summary>
    /// <param name="o"></param>
    /// <param name="key"></param>
    /// <param name="openid"></param>
    /// <param name="url"></param>
    public void SendTemplateMessage(HttpContext c, object o, string key, string openid, string url, string MsgContent,string source)
    {
        TMessage t = new TMessage
        {
            touser = openid,
            data = o,
            template_id = key,
            url = url,
            topcolor = ""
        };
        try
        {
            templateMsg tmp = new templateMsg
            {
                msgId = key,
                msgBody = LitJson.JsonMapper.ToJson(o),
                msgUrl = url,
                openId = openid,
                sendTime = DateTime.Now,
                msgContent = MsgContent,
                orderNo = ""
            };
            new Main().AddToDb(tmp, "t_templateMsg");
        }
        catch { }
        new TMessage().Send_TemplateMsg(t, Comm.Get_Access_Token(c));
    }
        

    public void OperOpenID(string source, HttpContext c)
    {
        if (1 == 2 && c.Cache["Web_Source"] != null)
        {
            System.Collections.Generic.Dictionary<string, source> dic = (System.Collections.Generic.Dictionary<string, source>)c.Cache["Web_Source"];
            if (dic.ContainsKey(source))
            {
                appid = dic[source].appid;
                secret = dic[source].secret;
                city = dic[source].sName;
                isVoucher = dic[source].isVoucher;
            }
        }
        else
        {
            System.Collections.Generic.Dictionary<string, source> dic = new _Source().GetSourceDic();
            c.Cache.Add("Web_Source", dic, null, System.DateTime.UtcNow.AddMinutes(120), TimeSpan.Zero, System.Web.Caching.CacheItemPriority.Normal, null);
            appid = dic[source].appid;
            secret = dic[source].secret;
            city = dic[source].sName;
            isVoucher = dic[source].isVoucher;
        }
    }
 
    public bool IsReusable
    {
        get
        {
            return false;
        }
    }
}