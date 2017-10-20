<%@ WebHandler Language="C#" Class="Handler" %>

using System;
using System.Web;
using Model;
using Data;
using Data.Tmessage;
using LitJson;
using System.Collections.Generic;
using com.seascape.tools;
using Seascape.WxApi;
using System.Text;
using Newtonsoft.Json;
using NPinyin;
using Model.Basic;
using Model.active;
using Model.View;
using Model.Count;
using Data.active;
using Data.Count;
using System.Net;
using System.IO;

public class Handler : IHttpHandler {

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
    public static string secret = com.seascape.tools.BasicTool.GetConfigPara("secret-0000");

    //发送短信账号和密码
    public static string smsUser = com.seascape.tools.BasicTool.GetConfigPara("smsUser");
    public static string smsPass = com.seascape.tools.BasicTool.GetConfigPara("smsPass");
    public static string smsMsg = com.seascape.tools.BasicTool.GetConfigPara("smsMsg");
    
    //分页大小
    public static int perPage = 10;
    public static string MsgUrl = "http://hjhk.edmp.cc/service/Handler.ashx";
    public static string BaseUrl = "http://hjhk.edmp.cc/";
    
    public static string DefaultWrokNo = "100";
    public static string _orderNo = "";

    public void ProcessRequest (HttpContext c) {
        int F = string.IsNullOrEmpty(c.Request["fn"]) ? 0 : Convert.ToInt16(c.Request["fn"]);
        int PayS = string.IsNullOrEmpty(c.Request["PayS"]) ? 0 : Convert.ToInt16(c.Request["PayS"]);
        _orderNo = string.IsNullOrEmpty(c.Request["orderNo"]) ? "" : c.Request["orderNo"].ToString();
        if (PayS == 0 && F < 223)
        {
            string source = string.IsNullOrEmpty(c.Request["source"]) ? "0000" : c.Request["source"].ToString();
            OperOpenID(source, c);
        }
        AddQueryLog(c);
        c.Response.ContentType = "text/plain";
        c.Response.Write(GetResult(F, c));
    }

    public void OperOpenID(string source,HttpContext c)
    {
        if (c.Cache["Web_Source"] != null)
        {
            Dictionary<string, source> dic = (Dictionary<string, source>)c.Cache["Web_Source"];
            if (dic.ContainsKey(source))
            {
                appid = dic[source].appid;
                secret = dic[source].secret;
            }
        }
        else
        {
            Dictionary<string, source> dic = new _Source().GetSourceDic();
            c.Cache.Add("Web_Source", dic, null, System.DateTime.UtcNow.AddMinutes(120), TimeSpan.Zero, System.Web.Caching.CacheItemPriority.Normal, null);
            appid = dic[source].appid;
            secret = dic[source].secret;
        }
    }
    
    /// <summary>
    /// 功能导航
    /// </summary>
    /// <param name="f"></param>
    /// <returns></returns>
    public string GetResult(int f, HttpContext c)
    {
        string Result = Sys_Result.GetR(1, "System Exception[" + f + "]");
        try
        {
            switch (f)
            {
                case 1:
                    Result = getOpenId(c);//获取OPENID
                    break;
                case 2:
                    Result = getMember(c);//获取会员信息
                    break;
                case 3:
                    Result = getKfList(c);//获取客服列表
                    break;
                case 4:
                    Result = DoGetImage(c);//下载头像到本地
                    break;
                case 5:
                    Result = CreateCode(c);//生成二维码
                    break;
                case 6:
                    Result = GetSourceInfo(c);//获取公众号基本信息
                    break;
                case 7:
                    Result = getMemberForWx(c);//通过openID获取微信用户信息
                    break;
                case 8:
                    Result = getOpenIdNoInsert(c);//获取openID不写库
                    break;
                case 90:
                    Result = SendTMessage(c);//发送模板消息
                    break;
                case 91:
                    Result = UpdateRemind(c);//更新低价提醒发送状态
                    break;
                case 93:
                    Result = SendTMessageApi(c);//发送微订单提醒模板消息API
                    break;
                case 94:
                    Result = "";//SendRed(1, "R2017070716143108550", "oKhuCwbmyP6uRzWbqw9o8zeHadUo");
                    break;
                case 95:
                    Result = updateSubscribe(c);//更新用户关注状态
                    break;
                case 96:
                    Result = GetMenu(c);//获取公众号菜单
                    break;
                case 97:
                    OperOpenID("0000",c);
                    Result = WxConfig(c);//微信初始化
                    break;
                case 98:
                    Result = InitMenu(c);//初始化菜单
                    break;
                case 99:
                    OperOpenID("0000",c);
                    Result = GetPayInfo(c);//获取支付信息
                    break;
                case 92:
                    Result = GetPayInfoForRed(c);//获取支付信息，红包申请
                    break;
                case 100:
                    Result = getCityCode(c);//获取三字码列表
                    break;
                case 101:
                    Result = SendSmsCode(c);//发送短信验证码
                    break;
                case 102:
                    Result = getClient(c);//获取乘客列表
                    break;
                case 103:
                    Result = BindUInfo(c);//绑定用户
                    break;
                case 104:
                    Result = AddOrder(c);//添加订单
                    break;
                case 105:
                    Result = GetOrderList(c);//获取订单列表
                    break;
                case 106:
                    Result = GetOrderInfo(c);//获取订单详情
                    break;
                case 107:
                    Result = GetRemindList(c);//获取提醒列表
                    break;
                case 108:
                    Result = AddRemind(c);//设置提醒
                    break;
                case 109:
                    Result = AddTgq(c);//添加退改签申请
                    break;
                case 110:
                    Result = GetRemindListForUID(c);//获取用户设置的低价提醒列表
                    break;
                case 111:
                    Result = CancelRemind(c);//取消低价提醒设置
                    break;
                case 112:
                    Result = GetVoucherList(c);//获取代金券列表
                    break;
                case 113:
                    Result = UploadMultimedia(c);//上传多媒体文件
                    break;
                case 114:
                    Result = GetSrcUidList(c);//获取已邀请好友列表
                    break;
                case 115:
                    Result = GetDistanceList(c);//获取空中距离列表
                    break;
                case 116:
                    Result = CreateHB(c);//生成海报
                    break;
                case 117:
                    Result = getPmList(c);//获取排名
                    break;
                case 118:
                    Result = CreateHB_DJP(c);//生成登机牌
                    break;
                case 119:
                    Result = GetContent(c);//获取旅游攻略内容详情
                    break;
                case 120:
                    Result = GetClassList(c);//获取分类列表
                    break;
                case 121:
                    Result = GetContentList(c);//获取内容列表
                    break;
                case 122:
                    Result = getTrainClient(c);//获取火车票乘客
                    break;
                case 201:
                    Result = ActiveSign(c);//活动报名
                    break;
                case 202:
                    Result = ActiveFund(c);//活动抢票
                    break;
                case 203:
                    Result = CreateDyHB(c);//生成代言海报
                    break;
                case 204:
                    Result = GetFireList(c);//获取人气列表
                    break;
                case 205:
                    Result = GetFireNum(c);//获取人气数量
                    break;
                case 206:
                    Result = getLowPrice(c);//获取特价列表
                    break;
                case 207:
                    Result = getGjList(c);//获取国际机票信息
                    break;
                case 208:
                    Result = AddGjAsk(c);//添加国际查询咨询
                    break;
                case 209:
                    Result = AddShare(c);//添加分享数据
                    break;
                case 210:
                    Result = GetAllCount(c);//获取总体统计
                    break;
                case 211:
                    Result = GetAllCountForSource(c);//按区域统计关注
                    break;
                case 212:
                    Result = GetAllCountForSrc(c);//按合作商统计关注
                    break;                                        
                case 213:
                    Result = GetAllCountForYGSrc(c);//按员工统计关注
                    break;
                case 214:
                    Result = GetNav(c);//获取出行导航列表
                    break;
                case 215:
                    Result = AddStudent(c);//一起上大学
                    break;
                case 216:
                    Result = GetStudentList(c);//上大学列表
                    break;
                case 217:
                    Result = GetGiftInfo(c);//获取用户是否参与活动详情
                    break;
                case 218:
                    Result = GetGift(c);//获取礼品详情
                    break;
                case 219:
                    Result = HxGift(c);//核销卡券
                    break;
                case 220:
                    Result = AddGift(c);//添加兑奖礼品
                    break;
                case 221:
                    Result = SendGift(c);//发送礼包
                    break;
                case 222:
                    Result = AddVote(c);//马拉松报名
                    break;
                case 223:
                    Result = GetVoteListForCache(c);//马拉松投票选手列表
                    break;
                case 224:
                    Result = ToVote(c);//投票
                    break;
                case 225:
                    Result = GetVoteListForCache(c);//获取投票选手列表
                    break;
                case 226:
                    Result = GetVotePm(c);//获取排名
                    break;
                case 227:
                    Result = GetVotePmData(c);//获取投票数据
                    break;
                case 228:
                    Result = ToVoteNew(c);//投票新版
                    break;
                case 300:
                    Result = GetFxCount(c);//获取分销总体统计
                    break;
                case 301:
                    Result = GetFxOrderList(c);//获取分销订单列表
                    break;
                case 302:
                    Result = GetFxUserList(c);//获取分销用户列表
                    break;
                case 303:
                    Result = ToRegFx(c);//分销注册
                    break;
                case 304:
                    Result = FxCheck(c);//分销审核
                    break;
                case 888:
                    Result = SendVoteMsg(c);//发送投票提醒消息
                    break;
            }
        }
        catch(Exception e)
        {
            Result = e.Message.ToString();
        }
        new Main().AddTestLog_B("[M]Result-"+f, Result.ToString());
        return Result;
    }

    /// <summary>
    /// 获取客服列表
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string getKfList(HttpContext c)
    {
        string Access_Token = Get_Access_Token(c);
        string url = "https://api.weixin.qq.com/cgi-bin/customservice/getkflist?access_token=" + Access_Token;
        return BasicTool.webRequest(url);
    }

    /// <summary>
    /// 给合作伙伴发送红包
    /// </summary>
    /// <param name="RedNum"></param>
    /// <param name="OrderNo"></param>
    /// <param name="openid"></param>
    /// <returns></returns>
    public string SendRed(int RedNum, string OrderNo, string openid)
    {
        WxRed r = new WxRed();
        r.client_ip = client_ip;
        r.max_value = RedNum;
        r.mch_billno = OrderNo;
        r.mch_id = mch_id;
        r.min_value = RedNum;
        r.re_openid = openid;
        r.total_amount = RedNum;
        r.total_num = 1;
        r.wxappid = appid;
        string m = "";
        string Result = new WxRed().SendRedTest(r, out m);
        return Result + "----" + m;
    }

    /// <summary>
    /// 获取内容详情
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string GetContent(HttpContext c)
    {
        int id = string.IsNullOrEmpty(c.Request["id"]) ? 0 : Convert.ToInt16(c.Request["id"]);
        if (id > 0)
        {
            ContentInfo content = new _Content().GetContent(id);
            if (content != null)
            {
                var o = new { Return = 0, Msg = "", Info = content };
                return JsonMapper.ToJson(o);
            }
        }
        return Sys_Result.GetR(1, "");
    }

    /// <summary>
    /// 获取内容列表
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string GetContentList(HttpContext c)
    {
        int cid = string.IsNullOrEmpty(c.Request["cid"]) ? 0 : Convert.ToInt16(c.Request["cid"].ToString());
        string sql = "select * from t_content where cid = " + cid + " and enable = 0 order by ishot desc,addOn asc";
        List<SimpleContent> la = new _Content().GetSimpleContentList(sql);
        if (la != null && la.Count > 0)
        {
            var o = new { Return = 0, Msg = "", List = la };
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
        int cid = string.IsNullOrEmpty(c.Request["cid"]) ? 0 : Convert.ToInt16(c.Request["cid"].ToString());
        int isCount = string.IsNullOrEmpty(c.Request["isCount"]) ? 0 : Convert.ToInt16(c.Request["isCount"].ToString());
        if (isCount == 0)
        {
            if (cid > 0)
            {
                List<tClass> la = new _Class().GetClassListForCID(0, cid);
                if (la != null && la.Count > 0)
                {
                    var o = new { Return = 0, Msg = "", List = la };
                    return JsonMapper.ToJson(o);
                }
            }
            else
            {
                List<tClass> la = new _Class().GetClassList(0);
                if (la != null && la.Count > 0)
                {
                    var o = new { Return = 0, Msg = "", List = la };
                    return JsonMapper.ToJson(o);
                }
            }
        }
        else
        {
            List<ClassInfo> la = new _Class().GetClassListForCount(cid);
            if (la != null && la.Count > 0)
            {
                var o = new { Return = 0, Msg = "", List = la };
                return JsonMapper.ToJson(o);
            }
        }
        return Sys_Result.GetR(1, "");
    }
    
    /// <summary>
    /// 通过Code获取OpenID
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string getOpenId(HttpContext c)
    {
        string code = string.IsNullOrEmpty(c.Request["code"]) ? "" : c.Request["code"].ToString();
        string source = string.IsNullOrEmpty(c.Request["source"]) ? "0000" : c.Request["source"].ToString();
        int uid = string.IsNullOrEmpty(c.Request["uid"]) ? 0 : Convert.ToInt32(c.Request["uid"]);
        new Main().AddTestLog("code", code);
        int srcUid = 0;
        //兴业银行
        if (source == "0099")
        {
            srcUid = 1003;
            source = "0000";
        }

        //107广播
        if (source == "0098")
        {
            srcUid = 1208;
            source = "0000";
        }

        Dictionary<string, source> dic = new Dictionary<string, source>();
        
        if (c.Cache["Web_Source"] != null)
        {
            dic = (Dictionary<string, source>)c.Cache["Web_Source"];
            if (dic.ContainsKey(source))
            {
                appid = dic[source].appid;
                secret = dic[source].secret;
            }
        }
        else
        {
            dic = new _Source().GetSourceDic();
            c.Cache.Add("Web_Source", dic, null, System.DateTime.UtcNow.AddDays(7), TimeSpan.Zero, System.Web.Caching.CacheItemPriority.Normal, null);
            appid = dic[source].appid;
            secret = dic[source].secret;
        }
        
        Common.appid = appid;
        Common.secret = secret;
        new Main().AddTestLog("GetOpenIdInfo", source + "--" + appid + "--" + secret);
        access_token_UserInfo at = Common.Get_access_token_UserInfo(code);

        if (!string.IsNullOrEmpty(at.openid) && source != "0000")
        {

            Common.appid = dic["0000"].appid;
            Common.secret = dic["0000"].secret;
            new Main().AddTestLog("GetOpenIdInfo-0000", source + "--" + appid + "--" + secret);
            at = Common.Get_access_token_UserInfo(code);
        }
        
        if (!string.IsNullOrEmpty(at.openid))
        {
            new Main().AddTestLog("openid", at.openid);
            {
                if (uid > 0)
                {
                    var o = new
                    {
                        exOpenID = at.openid
                    };
                    new Main().UpdateDb(o, "t_user", "id=" + uid);
                }
                else
                {
                    //------------------写用户------------------
                    user u = new _User().GetUser(at.openid, "", 0);
                    if (u != null)
                    {
                    }
                    else
                    {
                        u = new user();
                        string r = "";
                        Seascape.WxApi.UserInfo ui = Seascape.WxApi.UserInfo.getUserInfoByCode(at.access_token, at.openid, out r);
                        new Main().AddTestLog("r", r);
                        if (ui != null && !string.IsNullOrEmpty(ui.nickname))
                        {
                            source = source.Replace("i", "1");
                            u.nickName = ui.nickname.Replace("'", "").Replace(@"""", "");
                            u.photoUrl = ui.headimgurl;
                            u.area = ui.country + "|" + ui.province + "|" + ui.city;
                            u.sex = ui.sex;
                            u.openId = ui.openid;
                            u.source = source;
                            u.mobile = "";
                            u.srcUid = srcUid;
                            u.contact = "";
                            u.addOn = DateTime.Now;
                            u.isSubscribe = ui.subscribe;
                            new Main().AddToDb(u, "t_user");
                        }
                        else
                        {
                            source = source.Replace("i", "1");
                            u.nickName = "";
                            u.photoUrl = "";
                            u.area = "";
                            u.sex = 10;
                            u.openId = at.openid;
                            u.source = source;
                            u.mobile = "";
                            u.srcUid = srcUid;
                            u.contact = "";
                            u.addOn = DateTime.Now;
                            new Main().AddToDb(u, "t_user");
                        }
                    }
                    //------------------------------------------
                }
            }
            
            return Sys_Result.GetR(0, at.openid);
        }
        else
        {
            
            new Main().AddTestLog("openid", at.errcode.ToString());
            return Sys_Result.GetR(1, at.errcode.ToString());
        }
    }


    /// <summary>
    /// 通过Code获取OpenID不写库
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string getOpenIdNoInsert(HttpContext c)
    {
        string code = string.IsNullOrEmpty(c.Request["code"]) ? "" : c.Request["code"].ToString();
        string source = string.IsNullOrEmpty(c.Request["source"]) ? "0000" : c.Request["source"].ToString();
        Common.appid = appid;
        Common.secret = secret;
        access_token_UserInfo at = Common.Get_access_token_UserInfo(code);

        if (!string.IsNullOrEmpty(at.openid))
        {
            return Sys_Result.GetR(0, at.openid);
        }
        else
        {
            return Sys_Result.GetR(1, at.errcode.ToString());
        }
    }

    /// <summary>
    /// 通过Code获取OpenID
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string updateSubscribe(HttpContext c)
    {
        int count = 0;
        string nextOpenid = "";
        string openId = string.IsNullOrEmpty(c.Request["next_openid"]) ? "" : c.Request["next_openid"].ToString();
        string JsonData = new Common(appid, secret).GetSubUser(Get_Access_Token(c), openId);
        UserL ul = new UserL();
        if (JsonData.Length > 0)
        {
            try
            {
                ul = Newtonsoft.Json.JsonConvert.DeserializeObject<UserL>(JsonData);
                if (ul != null)
                {
                    string openids = "";
                    int i = 0;
                    count = ul.count;
                    nextOpenid = ul.next_openid;
                    foreach (string item in ul.data.openid)
                    {
                        openids = openids + "'" + item + "',";
                        i++;
                        if (i == 100)
                        {
                            openids = openids.Substring(0, openids.Length - 1);
                            var o = new
                            {
                                isSubscribe = 1
                            };
                            new Main().UpdateDb(o, "t_user", "openid in(" + openids + ")");
                            i = 0;
                            openids = "";
                        }
                    }
                }
            }
            catch
            {
                
            }
        }
        return count + "-" + nextOpenid;
    }


    /// <summary>
    /// 获取用户信息
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string getMember(HttpContext c)
    {
        string openId = string.IsNullOrEmpty(c.Request["openId"]) ? "" : c.Request["openId"].ToString();
        string source = string.IsNullOrEmpty(c.Request["source"]) ? "" : c.Request["source"].ToString();
        //new DataOper().AddTestLog("openId", openId);
        //BeauticianInfo bInfo = new _Beautician().GetBeautiInfo(openId);
        if (openId.Length > 0)
        {
            //uInfo uinfo = null;
            //List<employee> el = new _Employee().GetEmployeeList(-1, "", openId);
            user u = new _User().GetUser(openId, "", 0);
            if (u != null)
            {
                //List<uInfo> ulist = new _UInfo().GetUInfoList(0, u.id);
                
                //if (ulist != null && ulist.Count > 0)
                //{
                //    uinfo = ulist[0];
                //}
                /*
                if (el != null)
                {
                    var o = new { Return = 0, Msg = "", eInfo = el[0], Info = u,bInfo = bInfo };
                    return LitJson.JsonMapper.ToJson(o);
                }
                else
                {
                    var o = new { Return = 0, Msg = "", eInfo = el, Info = u, bInfo = bInfo };
                    return LitJson.JsonMapper.ToJson(o);
                }*/
                var o = new { Return = 0, Msg = "", Info = u };
                return LitJson.JsonMapper.ToJson(o);
                
            }
            else
            {
                u = new user();
                string r = "";
                Seascape.WxApi.UserInfo ui = Seascape.WxApi.UserInfo.getUserInfoByGlobal(Get_Access_Token(c), openId, out r);
                //new Main().AddTestLog("r", r);
                if (ui != null && !string.IsNullOrEmpty(ui.nickname))
                {
                    u.nickName = ui.nickname.Replace("'", "").Replace(@"""", "");
                    u.photoUrl = ui.headimgurl;
                    u.area = ui.country + "|" + ui.province + "|" + ui.city;
                    u.sex = ui.sex;
                    u.openId = ui.openid;
                    u.source = source;
                    u.mobile = "";
                    u.contact = "";
                    u.addOn = DateTime.Now;
                    u.isSubscribe = ui.subscribe;
                    var o = new { Return = 0, Msg = "", Info = u };
                    new Main().AddToDb(u, "t_user");
                    return LitJson.JsonMapper.ToJson(o);
                }
                else
                {
                    var o = new { Return = 0, Msg = "", Info = u };
                    return LitJson.JsonMapper.ToJson(o);
                }
            }
        }
        return Sys_Result.GetR(1, "");
    }


    /// <summary>
    /// 获取用户信息
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string getMemberForWx(HttpContext c)
    {
        string openId = string.IsNullOrEmpty(c.Request["openId"]) ? "" : c.Request["openId"].ToString();
        string source = string.IsNullOrEmpty(c.Request["source"]) ? "" : c.Request["source"].ToString();
        if (openId.Length > 0)
        {
            user u = new _User().GetUser(openId, "", 0);
            string r = "";
            try
            {
                Seascape.WxApi.UserInfo ui = Seascape.WxApi.UserInfo.getUserInfoByGlobal(Get_Access_Token(c), openId, out r);
                new Main().AddTestLog("r-wx" + openId, r);
                if (ui != null && !string.IsNullOrEmpty(ui.nickname))
                {
                    u.nickName = ui.nickname.Replace("'", "").Replace(@"""", "");
                    u.photoUrl = ui.headimgurl;
                    u.area = ui.country + "|" + ui.province + "|" + ui.city;
                    u.sex = ui.sex;
                    u.openId = ui.openid;
                    u.source = source;
                    u.mobile = "";
                    u.contact = "";
                    u.addOn = DateTime.Now;
                    u.isSubscribe = ui.subscribe;
                    var o = new { Return = 0, Msg = "", Info = u };
                    //new Main().AddToDb(u, "t_user");
                    return LitJson.JsonMapper.ToJson(o);
                }
                else
                {
                    var o = new { Return = 0, Msg = "", Info = u };
                    return LitJson.JsonMapper.ToJson(o);
                }
            }
            catch
            {
                var o = new { Return = 0, Msg = "", Info = u };
                return LitJson.JsonMapper.ToJson(o);
            }
            
        }
        return Sys_Result.GetR(1, "");
    }

    /// <summary>
    /// 获取邀请好友列表
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string GetSrcUidList(HttpContext c)
    {
        int uid = string.IsNullOrEmpty(c.Request["uid"]) ? 0 : Convert.ToInt32(c.Request["uid"].ToString());
        List<user> lu = new _User().GetUserForMobile(uid);
        if (lu != null && lu.Count > 0)
        {
            var o = new { Return = 0, Msg = "", List = lu };
            return LitJson.JsonMapper.ToJson(o);
        }
        return Sys_Result.GetR(1, "");
    }

    /// <summary>
    /// 获取所属公众号基本信息  特价折扣信息时时变动，以查询预定时折扣为准
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string GetSourceInfo(HttpContext c)
    {
        string source = string.IsNullOrEmpty(c.Request["sourceStr"]) ? "0000" : c.Request["sourceStr"].ToString();
        if (c.Cache["WxInfo_" + source] != null)
        {

            var o = new { Return = 0, Msg = "", Info = (source)c.Cache["WxInfo_" + source] };
                return LitJson.JsonMapper.ToJson(o);
        }
        else
        {
            Dictionary<string, source> dic = new _Source().GetSourceDic();
            if (dic.ContainsKey(source))
            {
                c.Cache.Add("WxInfo_" + source, dic[source], null, System.DateTime.UtcNow.AddDays(120), TimeSpan.Zero, System.Web.Caching.CacheItemPriority.Normal, null);
                var o = new { Return = 0, Msg = "", Info = dic[source] };
                return LitJson.JsonMapper.ToJson(o);
            }
            
        }
        
        return Sys_Result.GetR(1, "");
    }


    /// <summary>
    /// 获取距离列表
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string GetDistanceList(HttpContext c)
    {
        if (1==2&&c.Cache["Web_Distance"] != null)
        {
            List<distance> lo = (List<distance>)c.Cache["Web_Distance"];
            if (lo != null && lo.Count > 0)
            {
                var o = new { Return = 0, Msg = "", List = lo };
                return JsonMapper.ToJson(o);
            }
        }
        else
        {
            List<distance> lo = new _Distance().GetDistance("");
            c.Cache.Add("Web_Distance", lo, null, System.DateTime.UtcNow.AddDays(120), TimeSpan.Zero, System.Web.Caching.CacheItemPriority.Normal, null);
            if (lo != null && lo.Count > 0)
            {
                var o = new { Return = 0, Msg = "", List = lo };
                return JsonMapper.ToJson(o);
            }
        }
        return Sys_Result.GetR(1, "");
    }

    /// <summary>
    /// 生成海报
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string CreateHB(HttpContext c)
    {
        int uid = string.IsNullOrEmpty(c.Request["uid"]) ? 0 : Convert.ToInt32(c.Request["uid"]);
        int cityNum = string.IsNullOrEmpty(c.Request["cityNum"]) ? 0 : Convert.ToInt16(c.Request["cityNum"]);
        int isInter = string.IsNullOrEmpty(c.Request["isInter"]) ? 0 : Convert.ToInt16(c.Request["isInter"]);
        int distance = string.IsNullOrEmpty(c.Request["distance"]) ? 0 : Convert.ToInt32(c.Request["distance"]);
        string nickName = "";
        if (uid > 0 && cityNum > 0 && distance > 0)
        {
            user u = new _User().GetUser("", "", uid);
            if (u != null)
            {
                nickName = u.nickName;
            }
            
            int id = new Data.active._Fly().IsExsit(uid);
            Model.active.Fly fly = new Model.active.Fly()
            {
                uId = uid,
                cityNum = cityNum,
                distance = distance,
                addOn = DateTime.Now,
                pm = 0
            };
            fly.pm = new Data.active._Fly().GetPm(fly.distance);
            if (id == 0)
            {
                new Main().AddToDb(fly, "t_active_fly");
            }
            else
            {
                new Main().UpdateDb(fly, "t_active_fly", "id=" + id);
            }
            string FilePath = c.Server.MapPath("/active/userPic/" + uid + ".jpg");
            string CodePath = c.Server.MapPath("/pic/qrcode/" + uid + ".jpg");
            string logoPath = c.Server.MapPath("/active/logo.jpg");
            string MbPath01 = c.Server.MapPath("/active/bg1.png");
            string MbPath02 = c.Server.MapPath("/active/02.png");
            if (fly.cityNum > 3)
            {
                MbPath02 = c.Server.MapPath("/active/03.png");
            }
            if (fly.cityNum > 10)
            {
                MbPath02 = c.Server.MapPath("/active/04.png");
            }
            if (isInter == 1)
            {
                MbPath02 = c.Server.MapPath("/active/01.png");
            }
            string ResultPath = c.Server.MapPath("/active/result/" + uid + ".jpg");
            string FontPath = c.Server.MapPath("/active/fonts\\FZLBJW.TTF");
            string NumFontPath = c.Server.MapPath("/active/fonts\\FZCQJW.TTF");
            string NameFontPath = c.Server.MapPath("/active/fonts\\msyh.ttc");
            System.Drawing.Image imgBack = System.Drawing.Image.FromFile(MbPath01);     //相框图片  
            System.Drawing.Image img = System.Drawing.Image.FromFile(FilePath);        //照片图片
            System.Drawing.Image imgt = System.Drawing.Image.FromFile(MbPath02);        //照片图片
            System.Drawing.Image imgc = System.Drawing.Image.FromFile(CodePath);        //照片图片
            System.Drawing.Image imgl = System.Drawing.Image.FromFile(logoPath);        //照片图片

            //从指定的System.Drawing.Image创建新的System.Drawing.Graphics      
            System.Drawing.Bitmap bmp = new System.Drawing.Bitmap(imgt.Width, imgt.Height, System.Drawing.Imaging.PixelFormat.Format32bppArgb);
            System.Drawing.Graphics g = System.Drawing.Graphics.FromImage(bmp);
            //头像位置 68 54 180 180
            //头部昵称 109 264
            //飞行里程 304 612
            //飞行城市 335 696
            //飞行排名 400 770
            //二维码 95 944 127 127
            //底部昵称 425 1069
            g.DrawImage(imgBack, 0, 0);
            g.DrawImage(img, 58, 54, 190, 190);
            g.DrawImage(imgt, 0, 0, 640, 1136);
            
            g.DrawImage(imgc, 94, 945, 127, 127);
            g.DrawImage(imgl, 144, 994, 27, 27);
            /*
            if (fly.cityNum < 3)
            {
                g.DrawImage(imgc, 86, 875, 126, 116);
                g.DrawImage(imgl, 130, 924, 27, 27);
            }
            if (fly.cityNum > 2 && fly.cityNum < 10)
            {
                g.DrawImage(imgc, 93, 874, 126, 116);
                g.DrawImage(imgl, 140, 924, 27, 27);
            }
            if (fly.cityNum > 9)
            {
                g.DrawImage(imgc, 93, 872, 126, 116);
                g.DrawImage(imgl, 140, 924, 27, 27);
            }
            */
            //写名字
            
            System.Drawing.StringFormat StrFormat = new System.Drawing.StringFormat();
            System.Drawing.Text.PrivateFontCollection fm = new System.Drawing.Text.PrivateFontCollection();
            fm.AddFontFile(FontPath);
            fm.AddFontFile(NumFontPath);
            fm.AddFontFile(NameFontPath);
            System.Drawing.Font crFont = new System.Drawing.Font(fm.Families[2], 24, System.Drawing.FontStyle.Regular);
            System.Drawing.SolidBrush semiTransBrush2 = new System.Drawing.SolidBrush(System.Drawing.Color.FromArgb(255, 255, 255, 255));
            g.DrawString(nickName, crFont, semiTransBrush2, new System.Drawing.PointF(90, 264), StrFormat);

            crFont = new System.Drawing.Font(fm.Families[0], 14, System.Drawing.FontStyle.Bold);
            semiTransBrush2 = new System.Drawing.SolidBrush(System.Drawing.Color.FromArgb(255, 255, 255, 255));
            g.DrawString(nickName, crFont, semiTransBrush2, new System.Drawing.PointF(421, 1042), StrFormat);
            
            crFont = new System.Drawing.Font(fm.Families[1], 36, System.Drawing.FontStyle.Bold);
            semiTransBrush2 = new System.Drawing.SolidBrush(System.Drawing.Color.FromArgb(255, 241, 199, 29));
            int distanceLeft = 275;
            if (distance < 10000)
            {
                distanceLeft = 300;
            }
            if (distance > 10000 && distance < 100000)
            {
                distanceLeft = 285;
            }
            g.DrawString(distance.ToString(), crFont, semiTransBrush2, new System.Drawing.PointF(distanceLeft, 545), StrFormat);

            crFont = new System.Drawing.Font(fm.Families[1], 36, System.Drawing.FontStyle.Bold);
            semiTransBrush2 = new System.Drawing.SolidBrush(System.Drawing.Color.FromArgb(250, 241, 199, 29));
            g.DrawString(cityNum.ToString().ToString(), crFont, semiTransBrush2, new System.Drawing.PointF(310, 632), StrFormat);

            if (fly.pm == 0)
            {
                fly.pm = 1;
            }
            
            crFont = new System.Drawing.Font(fm.Families[1], 36, System.Drawing.FontStyle.Bold);
            semiTransBrush2 = new System.Drawing.SolidBrush(System.Drawing.Color.FromArgb(255, 241, 199, 29));
            g.DrawString(fly.pm.ToString().ToString(), crFont, semiTransBrush2, new System.Drawing.PointF(380, 722), StrFormat);
            
            bmp.Save(ResultPath, System.Drawing.Imaging.ImageFormat.Jpeg);
            return Sys_Result.GetR(0, "");
        }
        return Sys_Result.GetR(1, "");
    }

    /// <summary>
    /// 生成海报-门票
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string CreateHBForGift(HttpContext c)
    {
        int uid = string.IsNullOrEmpty(c.Request["uid"]) ? 0 : Convert.ToInt32(c.Request["uid"]);
        if (uid > 0)
        {
            string FilePath = c.Server.MapPath("/active/student/userPic/" + uid + ".jpg");
            if (System.IO.File.Exists(FilePath))
            {
                return "/active/student/userPic/" + uid + ".jpg";
            }
            string CodePath = c.Server.MapPath("/pic/qrcode/" + uid + ".jpg");
            string MbPath01 = c.Server.MapPath("/active/student/bg.png");

            System.Drawing.Image imgBack = System.Drawing.Image.FromFile(MbPath01);     //相框图片  
            System.Drawing.Image imgc = System.Drawing.Image.FromFile(CodePath);        //照片图片

            //从指定的System.Drawing.Image创建新的System.Drawing.Graphics      
            System.Drawing.Bitmap bmp = new System.Drawing.Bitmap(imgBack.Width, imgBack.Height, System.Drawing.Imaging.PixelFormat.Format32bppArgb);
            System.Drawing.Graphics g = System.Drawing.Graphics.FromImage(bmp);
            g.DrawImage(imgBack, 0, 0);
            g.DrawImage(imgc, 474, 68, 138, 138);

            bmp.Save(FilePath, System.Drawing.Imaging.ImageFormat.Jpeg);
            return "/active/student/userPic/" + uid + ".jpg";
        }
        return "";
    }


    /// <summary>
    /// 生成海报-登机牌
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string CreateHB_DJP(HttpContext c)
    {
        string uName = c.Request["uName"] == null ? "" : c.Request["uName"].ToString();
        int uid = string.IsNullOrEmpty(c.Request["uid"]) ? 0 : Convert.ToInt32(c.Request["uid"]);
        if (uid > 0 && uName.Length>0)
        {
            string CodePath = c.Server.MapPath("/pic/qrcode/" + uid + ".jpg");
            string logoPath = c.Server.MapPath("/active/logo.jpg");
            string MbPath02 = c.Server.MapPath("/active/djpBg03.png");
            string MbPath01 = c.Server.MapPath("/active/djpBg02.png");

            string ResultPath = c.Server.MapPath("/active/result/djp/" + uid + ".jpg");
            string FontPath = c.Server.MapPath("/active/fonts\\FZLBJW.TTF");
            string NumFontPath = c.Server.MapPath("/active/fonts\\FZCQJW.TTF");
            string NameFontPath = c.Server.MapPath("/active/fonts\\Bobz.ttf");
            System.Drawing.Image imgt = System.Drawing.Image.FromFile(MbPath02);        //照片图片
            System.Drawing.Image imgc = System.Drawing.Image.FromFile(CodePath);        //照片图片
            System.Drawing.Image imgl = System.Drawing.Image.FromFile(logoPath);        //照片图片
            System.Drawing.Image imgb = System.Drawing.Image.FromFile(MbPath01);        //照片图片

            //从指定的System.Drawing.Image创建新的System.Drawing.Graphics      
            System.Drawing.Bitmap bmp = new System.Drawing.Bitmap(imgt.Width, imgt.Height, System.Drawing.Imaging.PixelFormat.Format32bppArgb);
            System.Drawing.Graphics g = System.Drawing.Graphics.FromImage(bmp);
            //头像位置 68 54 180 180
            //头部昵称 109 264
            //飞行里程 304 612
            //飞行城市 335 696
            //飞行排名 400 770
            //二维码 95 944 127 127
            //底部昵称 425 1069
            g.DrawImage(imgt, 0, 0, 1600, 1200);

            g.DrawImage(imgc, 174, 740, 100, 100);
            g.DrawImage(imgl, 206, 780, 20, 20);
            g.DrawImage(imgb, 174, 740, 100, 100);
            /*
            if (fly.cityNum < 3)
            {
                g.DrawImage(imgc, 86, 875, 126, 116);
                g.DrawImage(imgl, 130, 924, 27, 27);
            }
            if (fly.cityNum > 2 && fly.cityNum < 10)
            {
                g.DrawImage(imgc, 93, 874, 126, 116);
                g.DrawImage(imgl, 140, 924, 27, 27);
            }
            if (fly.cityNum > 9)
            {
                g.DrawImage(imgc, 93, 872, 126, 116);
                g.DrawImage(imgl, 140, 924, 27, 27);
            }
            */
            //写名字

            string pys = Pinyin.GetPinyin(uName.Substring(0, 1), Encoding.UTF8);
            string pyt = Pinyin.GetPinyin(uName.Substring(1, uName.Length - 1), Encoding.UTF8);
            string py = pys.ToUpper() + "/" + pyt.ToUpper();
            
            System.Drawing.StringFormat StrFormat = new System.Drawing.StringFormat();
            System.Drawing.Text.PrivateFontCollection fm = new System.Drawing.Text.PrivateFontCollection();
            fm.AddFontFile(FontPath);
            fm.AddFontFile(NumFontPath);
            fm.AddFontFile(NameFontPath);
            System.Drawing.Font crFont = new System.Drawing.Font(fm.Families[0], 20, System.Drawing.FontStyle.Regular);
            System.Drawing.SolidBrush semiTransBrush2 = new System.Drawing.SolidBrush(System.Drawing.Color.FromArgb(255, 58, 54, 55));
            g.DrawString(py, crFont, semiTransBrush2, new System.Drawing.PointF(284, 614), StrFormat);

            crFont = new System.Drawing.Font(fm.Families[0], 20, System.Drawing.FontStyle.Bold);
            semiTransBrush2 = new System.Drawing.SolidBrush(System.Drawing.Color.FromArgb(255, 58, 54, 55));
            g.DrawString(py, crFont, semiTransBrush2, new System.Drawing.PointF(1160, 592), StrFormat);

            crFont = new System.Drawing.Font(fm.Families[0], 20, System.Drawing.FontStyle.Bold);
            semiTransBrush2 = new System.Drawing.SolidBrush(System.Drawing.Color.FromArgb(255, 58, 54, 55));
            g.DrawString(py, crFont, semiTransBrush2, new System.Drawing.PointF(1436, 580), StrFormat);
            
            bmp.Save(ResultPath, System.Drawing.Imaging.ImageFormat.Jpeg);
            return Sys_Result.GetR(0, "");
        }
        return Sys_Result.GetR(1, "");
    }

    /// <summary>
    /// 获取排名列表
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string getPmList(HttpContext c)
    {
        List<FlyPm> lc = new _Fly().GetPmList();
        if (lc != null && lc.Count > 0)
        {
            var or = new { Return = 0, Msg = lc.Count, List = lc };
            return LitJson.JsonMapper.ToJson(or);
        }
        return Sys_Result.GetR(1, "无记录");
    }

    /// <summary>
    /// 下载图片到本地
    /// </summary>
    /// <param name="url"></param>
    /// <param name="path"></param>
    public string DoGetImage(HttpContext c)
    {
        int uid = string.IsNullOrEmpty(c.Request["uid"]) ? 0 : Convert.ToInt32(c.Request["uid"].ToString());
        string photo = "";
        user u = new _User().GetUser("", "", uid);
        if (u != null)
        {
            photo = u.photoUrl;
        }

        if (photo.Length > 0)
        {
            string path = c.Server.MapPath("/active/userPic/" + uid + ".jpg");
            HttpWebRequest req = (HttpWebRequest)WebRequest.Create(photo);

            req.ServicePoint.Expect100Continue = false;
            req.Method = "GET";
            req.KeepAlive = true;

            req.ContentType = "image/png";
            HttpWebResponse rsp = (HttpWebResponse)req.GetResponse();

            System.IO.Stream stream = null;

            try
            {
                // 以字符流的方式读取HTTP响应
                stream = rsp.GetResponseStream();
                System.Drawing.Image.FromStream(stream).Save(path);
            }
            finally
            {
                // 释放资源
                if (stream != null) stream.Close();
                if (rsp != null) rsp.Close();
            }
            return Sys_Result.GetR(0, "");  
        }
        return Sys_Result.GetR(1, "");
    }

    /// <summary>
    /// 用户二维码生成
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string CreateCode(HttpContext c)
    {
        string access_token = Get_Access_Token(c);
        int uid = string.IsNullOrEmpty(c.Request["uid"]) ? 0 : Convert.ToInt32(c.Request["uid"]);
        if (uid > 0)
        {
            string FilePath = c.Server.MapPath("/pic/QrCode/" + uid + ".jpg");
            if (File.Exists(FilePath))
            {
                return Sys_Result.GetR(0, "");    
            }
            int SceneID = uid;
            string Result = new Common(appid, secret).GetQR_Code(access_token, FilePath, SceneID);
            return Sys_Result.GetR(0, "");
        }
        return Sys_Result.GetR(1, "");
    }

    /// <summary>
    /// 礼包下发
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string SendGift(HttpContext c)
    {
        string openId = c.Request["openId"] == null ? "" : c.Request["openId"].ToString();
        int uid = string.IsNullOrEmpty(c.Request["uid"]) ? 0 : Convert.ToInt32(c.Request["uid"]);
        int giftType = string.IsNullOrEmpty(c.Request["giftType"]) ? 0 : Convert.ToInt16(c.Request["giftType"]);
        if (uid > 0)
        {
            int giftNum = new _Gift().IsExsit(uid, giftType);
            string giftName = "宇文河生态庄园门票";
            string hxurl = "/active/student/c_gift_hx.html?streamNo=";
            if (giftType == 11)
            {
                giftName = "最美证件照";
                hxurl = "/active/student/c_gift_hx_js.html?streamNo=";
            }
            if (giftNum == 0)
            {
                Gift gt = new Gift
                {
                    addOn = DateTime.Now,
                    uId = uid,
                    giftType = giftType,
                    giftName = giftName,
                    streamNo = "G" + giftType + DateTime.Now.ToString("yyMMddHHmmss") + uid.ToString().PadLeft(5, '0')
                };
                new Main().AddToDb(gt, "t_active_gift");
                string GiftContent = "山西出行送你“" + giftName + "”，点击查看兑换方式";

                string MsgContent = "";
                TMsg_Gift tmo = new TMsg_Gift().GetMessageBody(GiftContent, giftName, gt.streamNo, "截至2017年10月30日", "点击查看兑换方式", out MsgContent);
                SendTemplateMessage(c, tmo, new TMsg_Gift().Key(), openId, BaseUrl + hxurl + gt.streamNo, MsgContent, "0000");
                
                return Sys_Result.GetR(0, "领取完成，请按照微信消息中的说明使用");    
            }
            
        }
        return Sys_Result.GetR(1, "领取失败，每人限领取一次");
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
            //return w.signature + "|" + w.timestamp + "|" + w.nonce + "|" + w.appid;
            return w.signature + "|" + w.timestamp + "|" + w.nonce + "|" + appid;
        }
        else
        {
            return "";
        }
    }

    /// <summary>
    /// 获取城市三字码
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string getCityCode(HttpContext c)
    {
        int isHot = string.IsNullOrEmpty(c.Request["isHot"]) ? 0 : Convert.ToInt16(c.Request["isHot"]);
        if (1==2&&c.Cache["Web_CityCode_" + isHot] != null)
        {
            List<cityInfo> l = (List<cityInfo>)c.Cache["Web_CityCode_" + isHot];
            var or = new { Return = 0, Msg = "", List = l };
            return LitJson.JsonMapper.ToJson(or);
        }
        List<cityInfo> lc = new _CityCode().GetCityList(isHot);
        if (lc != null && lc.Count > 0)
        {
            c.Cache.Add("Web_CityCode_" + isHot, lc, null, System.DateTime.UtcNow.AddDays(10), TimeSpan.Zero, System.Web.Caching.CacheItemPriority.Normal, null);
            var or = new { Return = 0, Msg = "", List = lc };
            return LitJson.JsonMapper.ToJson(or);
        }
        return Sys_Result.GetR(0, "");
    }

    /// <summary>
    /// 获取乘客列表
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string getClient(HttpContext c)
    {
        string mobile = c.Request["mobile"] == null ? "" : c.Request["mobile"].ToString();
        if (mobile.Length > 0)
        {
            List<client> lc = new _Client().GetClientList(mobile);
            string PostUrl = "http://59.49.19.109:8016/weixin/WxHandler.ashx?Fn=6&";
            string Paras = "&mobile=" + mobile;
            PostUrl += Paras;
            string oi = BasicTool.webRequest(PostUrl);
            try
            {
                lc = Newtonsoft.Json.JsonConvert.DeserializeObject<List<client>>(oi);
                //o = (OrderInfo)Newtonsoft.Json.JsonConvert.DeserializeObject(oi, o.GetType());
            }
            catch
            {

            }
            //List<client> lc = new _Client().GetClientList(mobile);
            if (lc != null && lc.Count > 0)
            {
                var or = new { Return = 0, Msg = lc.Count, List = lc };
                return LitJson.JsonMapper.ToJson(or);    
            }
        }
        return Sys_Result.GetR(1, "无记录");
    }

    /// <summary>
    /// 获取火车乘客列表
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string getTrainClient(HttpContext c)
    {
        string mobile = c.Request["mobile"] == null ? "" : c.Request["mobile"].ToString();
        if (mobile.Length > 0)
        {
            List<client> lc = new _Client().GetTrainClientList(mobile);
            if (lc != null && lc.Count > 0)
            {
                foreach (client item in lc)
                {
                    item.user_py = Pinyin.GetPinyin(item.fare_name).Substring(0, 1);
                }
                var or = new { Return = 0, Msg = lc.Count, List = lc };
                return LitJson.JsonMapper.ToJson(or);
            }
        }
        return Sys_Result.GetR(1, "无记录");
    }

    /// <summary>
    /// 获取特价列表
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string getLowPrice(HttpContext c)
    {
        string lowPrice = "";
        //c.Cache.Remove("LowPrice");
        if (c.Cache["LowPrice"] != null)
        {
            lowPrice = c.Cache["LowPrice"].ToString();
        }
        else
        {
            string PostUrl = "http://59.49.19.109:8016/weixin/WxHandler.ashx?Fn=8";
            lowPrice = BasicTool.webRequest(PostUrl);
            c.Cache.Remove("LowPrice");
            c.Cache.Add("LowPrice", lowPrice, null, System.DateTime.UtcNow.AddMinutes(30), TimeSpan.Zero, System.Web.Caching.CacheItemPriority.Normal, null);
        }
        return lowPrice;
    }

    /// <summary>
    /// 获取国际机票
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string getGjList(HttpContext c)
    {
        List<airGj> lag = new List<airGj>();
        lag.Add(new airGj { sCode = "TYN", sCity = "太原", tCode = "SIN", tCity = "新加坡", sPort = "武宿机场T2", tPort = "樟宜国际机场", sTime = "11:40", tTime = "22:30", price = 1100, tax = 1215, zzCity = "广州", zzPort = "白云机场", zzsTime = "14:25", zztTime = "18:25", airCo = "南航", airCoNo = "CZ", plane = "320(大)" });
        lag.Add(new airGj { sCode = "TYN", sCity = "太原", tCode = "AKL", tCity = "奥克兰", sPort = "武宿机场T2", tPort = "奥克兰国际机场", sTime = "19:30", tTime = "16:00", price = 1080, tax = 1990, zzCity = "广州", zzPort = "白云机场", zzsTime = "22:15", zztTime = "00:30", airCo = "南航", airCoNo = "CZ", plane = "320(大)" });
        lag.Add(new airGj { sCode = "TYN", sCity = "太原", tCode = "CHC", tCity = "基督城", sPort = "武宿机场T2", tPort = "克赖斯特彻奇国际机场", sTime = "19:30", tTime = "16:10", price = 2410, tax = 1938, zzCity = "广州", zzPort = "白云机场", zzsTime = "22:15", zztTime = "00:50", airCo = "南航", airCoNo = "CZ", plane = "320(大)" });
        lag.Add(new airGj { sCode = "TYN", sCity = "太原", tCode = "MEL", tCity = "墨尔本", sPort = "武宿机场T2", tPort = "图拉曼里机场", sTime = "14:35", tTime = "08:40", price = 1190, tax = 1626, zzCity = "广州", zzPort = "白云机场", zzsTime = "17:25", zztTime = "21:00", airCo = "南航", airCoNo = "CZ", plane = "320(大)" });
        lag.Add(new airGj { sCode = "TYN", sCity = "太原", tCode = "BNE", tCity = "布里斯班", sPort = "武宿机场T2", tPort = "布里斯班机场", sTime = "14:35", tTime = "08:25", price = 1800, tax = 1673, zzCity = "广州", zzPort = "白云机场", zzsTime = "17:25", zztTime = "21:20", airCo = "南航", airCoNo = "CZ", plane = "320(大)" });
        lag.Add(new airGj { sCode = "TYN", sCity = "太原", tCode = "ADL", tCity = "阿德莱德", sPort = "武宿机场T2", tPort = "阿德来德机场", sTime = "19:30", tTime = "16:00", price = 1240, tax = 1642, zzCity = "广州", zzPort = "白云机场", zzsTime = "22:15", zztTime = "00:30", airCo = "南航", airCoNo = "CZ", plane = "320(大)" });
        lag.Add(new airGj { sCode = "TYN", sCity = "太原", tCode = "SYD", tCity = "悉尼", sPort = "武宿机场T2", tPort = "金斯福德史密斯机场", sTime = "14:35", tTime = "08:25", price = 1190, tax = 1693, zzCity = "广州", zzPort = "白云机场", zzsTime = "17:25", zztTime = "21:10", airCo = "南航", airCoNo = "CZ", plane = "320(大)" });
        lag.Add(new airGj { sCode = "TYN", sCity = "太原", tCode = "PER", tCity = "佩斯", sPort = "武宿机场T2", tPort = "珀斯机场 ", sTime = "14:35", tTime = "06:00", price = 1280, tax = 1604, zzCity = "广州", zzPort = "白云机场", zzsTime = "17:25", zztTime = "22:20", airCo = "南航", airCoNo = "CZ", plane = "320(大)" });

        lag.Add(new airGj { sCode = "TYN", sCity = "太原", tCode = "MFM", tCity = "澳门", sPort = "武宿机场T2", tPort = "澳门国际机场", sTime = "19:30", tTime = "22:30", price = 2100, tax = 378, zzCity = "", zzPort = "", zzsTime = "", zztTime = "", airCo = "澳航", airCoNo = "NX", plane = "321(大)" });
        lag.Add(new airGj { sCode = "TYN", sCity = "太原", tCode = "HKG", tCity = "香港", sPort = "武宿机场T2", tPort = "香港国际机场", sTime = "08:30", tTime = "11:35", price = 1710, tax = 348, zzCity = "", zzPort = "", zzsTime = "", zztTime = "", airCo = "东航", airCoNo = "MU", plane = "73E(大)" });
        lag.Add(new airGj { sCode = "TYN", sCity = "太原", tCode = "LAX", tCity = "洛杉矶", sPort = "武宿机场T2", tPort = "洛杉矶国际机场", sTime = "09:10", tTime = "12:00", price = 1800, tax = 2878, zzCity = "北京", zzPort = "首都机场 ", zzsTime = "10:25", zztTime = "15:00", airCo = "国航", airCoNo = "CA", plane = "733(大)" });
        lag.Add(new airGj { sCode = "TYN", sCity = "太原", tCode = "SFO", tCity = "旧金山", sPort = "武宿机场T1", tPort = "旧金山国际机场", sTime = "07:30", tTime = "09:30", price = 5920, tax = 2874, zzCity = "上海", zzPort = "浦东机场", zzsTime = "09:45", zztTime = "00:00", airCo = "东航", airCoNo = "MU", plane = "773(大)" });
        lag.Add(new airGj { sCode = "TYN", sCity = "太原", tCode = "LHR", tCity = "伦敦", sPort = "武宿机场T2", tPort = "希斯罗机场", sTime = "07:30", tTime = "18:40", price = 8970, tax = 3657, zzCity = "上海", zzPort = "浦东机场", zzsTime = "09:45", zztTime = "13:20", airCo = "东航", airCoNo = "MU", plane = "773(大)" });
        lag.Add(new airGj { sCode = "TYN", sCity = "太原", tCode = "YYZ", tCity = "多伦多", sPort = "武宿机场T2", tPort = "多伦多机场", sTime = "07:30", tTime = "14:25", price = 9700, tax = 2725, zzCity = "上海", zzPort = "浦东机场", zzsTime = "09:45", zztTime = "12:10", airCo = "东航", airCoNo = "MU", plane = "773(大)" });
        lag.Add(new airGj { sCode = "TYN", sCity = "太原", tCode = "YVR", tCity = "温哥华", sPort = "武宿机场T1", tPort = "温哥华机场  ", sTime = "07:30", tTime = "06:00", price = 7690, tax = 2688, zzCity = "上海", zzPort = "浦东机场", zzsTime = "09:45", zztTime = "13:30", airCo = "东航", airCoNo = "MU", plane = "33H(大)" });
        lag.Add(new airGj { sCode = "TYN", sCity = "太原", tCode = "KUL", tCity = "吉隆坡", sPort = "武宿机场T2", tPort = "吉隆坡机场 ", sTime = "12:55", tTime = "22:00", price = 1300, tax = 1170, zzCity = "厦门", zzPort = "厦门机场", zzsTime = "15:30", zztTime = "17:35", airCo = "厦航", airCoNo = "MF", plane = "738(大)" });

        lag.Add(new airGj { sCode = "TYN", sCity = "太原", tCode = "MRU", tCity = "毛里求斯", sPort = "武宿机场T2", tPort = "毛里求斯机场", sTime = "09:10", tTime = "08:45", price = 6050, tax = 2969, zzCity = "北京", zzPort = "首都机场", zzsTime = "10:20", zztTime = "00:45", airCo = "毛里求斯航", airCoNo = "MK", plane = "343(大)" });
        lag.Add(new airGj { sCode = "TYN", sCity = "太原", tCode = "MLE", tCity = "马尔代夫", sPort = "武宿机场T2", tPort = "马累机场", sTime = "07:35", tTime = "19:55", price = 6230, tax = 1486, zzCity = "昆明", zzPort = "长水机场", zzsTime = "10:30", zztTime = "15:50", airCo = "东航", airCoNo = "MU", plane = "73E(大)" });
        lag.Add(new airGj { sCode = "TYN", sCity = "太原", tCode = "CNX", tCity = "清迈", sPort = "武宿机场T1", tPort = "清迈机场", sTime = "07:35", tTime = "15:25", price = 1920, tax = 1307, zzCity = "昆明", zzPort = "长水机场", zzsTime = "10:30", zztTime = "14:30", airCo = "东航", airCoNo = "MU", plane = "73E(大)" });
        lag.Add(new airGj { sCode = "TYN", sCity = "太原", tCode = "DXB", tCity = "迪拜", sPort = "武宿机场T2", tPort = "迪拜机场", sTime = "11:40", tTime = "23:20", price = 4350, tax = 1270, zzCity = "广州", zzPort = "白云机场", zzsTime = "14:25", zztTime = "19:00", airCo = "南航", airCoNo = "CZ", plane = "33B(大)" });
        lag.Add(new airGj { sCode = "TYN", sCity = "太原", tCode = "HAN", tCity = "河内", sPort = "武宿机场T2", tPort = "河内机场 ", sTime = "07:35", tTime = "16:40", price = 1420, tax = 1227, zzCity = "昆明", zzPort = "长水机场", zzsTime = "10:30", zztTime = "14:10", airCo = "东航", airCoNo = "MU", plane = "737(大)" });
        var o = new { Return = 0, Msg = "", List = lag };
        return JsonMapper.ToJson(o);
    }

    /// <summary>
    /// 活动报名
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string ActiveSign(HttpContext c)
    {
        int uId = string.IsNullOrEmpty(c.Request["uId"]) ? 0 : Convert.ToInt32(c.Request["uid"]);
        int activeId = string.IsNullOrEmpty(c.Request["activeId"]) ? 0 : Convert.ToInt16(c.Request["activeId"]);
        user u = new _User().GetUser("", "", uId);
        if (u != null)
        {
            try
            {
                if (new _ActiveLog().IsExsit(uId, activeId) == 0)
                {
                    ActiveLog al = new ActiveLog
                    {
                        uId = uId,
                        nickName = u.nickName,
                        photoUrl = u.photoUrl,
                        activeId = activeId,
                        addOn = DateTime.Now
                    };
                    new Main().AddToDb(al, "t_active_log");   
                }
            }
            catch
            {

            }
        }
        return Sys_Result.GetR(1, "");
    }

    /// <summary>
    /// 获取人气列表
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string GetFireList(HttpContext c)
    {
        List<Model.View.fire> la = new _Fire().GetFireList();
        if (la != null && la.Count > 0)
        {
            var o = new { Return = 0, Msg = "", List = la };
            return JsonMapper.ToJson(o);
        }
        return Sys_Result.GetR(1, "");
    }

    /// <summary>
    /// 获取人气数
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string GetFireNum(HttpContext c)
    {
        int uid = string.IsNullOrEmpty(c.Request["uid"]) ? 0 : Convert.ToInt32(c.Request["uid"]);
        int Num = new _Fire().GetFireNum(uid);
        var o = new { Return = 0, Msg = "", Info = Num };
        return JsonMapper.ToJson(o);
    }
    
    /// <summary>
    /// 生成海报
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string CreateDyHB(HttpContext c)
    {
        int uid = string.IsNullOrEmpty(c.Request["uid"]) ? 0 : Convert.ToInt32(c.Request["uid"]);
        int hType = string.IsNullOrEmpty(c.Request["hType"]) ? 0 : Convert.ToInt16(c.Request["hType"]);
        string serverId = string.IsNullOrEmpty(c.Request["serverId"]) ? "" : c.Request["serverId"].ToString();
        string content = c.Request["content"] == null ? "" : c.Request["content"].ToString();
        string contact = c.Request["contact"] == null ? "" : c.Request["contact"].ToString();
        user u = new _User().GetUser("", "", uid);
        if (u != null)
        {
            var ou = new
            {
                contact = contact
            };
            new Main().UpdateDb(ou, "t_user", "id=" + uid);
                        
            string CodePath = c.Server.MapPath("/pic/qrcode/" + uid + ".jpg");
            string LogoPath = c.Server.MapPath("/pic/logoNew.jpg");
            if (!File.Exists(CodePath))
            {
                string Result = new Common(appid, secret).GetQR_Code(Get_Access_Token(c), CodePath, uid);
            }

            string fileName = "";

            if (hType == 2)
            {
                fileName = c.Server.MapPath("/pic/userCode/" + uid + ".jpg");
                if (File.Exists(fileName))
                {
                    return Sys_Result.GetR(0, "/pic/userCode/" + uid + ".jpg");
                }
                string userPath = DoGetImage(c, u.photoUrl, uid);
                if (userPath.Length > 0)
                {
                    System.Drawing.Image imgBack = System.Drawing.Image.FromFile(CodePath);
                    System.Drawing.Image imgu = System.Drawing.Image.FromFile(userPath);
                    if (imgu.Width == 120 || imgu.Height == 120)
                    {
                        imgu = System.Drawing.Image.FromFile(LogoPath);
                        System.Drawing.Bitmap bmp = new System.Drawing.Bitmap(200, 200, System.Drawing.Imaging.PixelFormat.Format32bppArgb);
                        System.Drawing.Graphics g = System.Drawing.Graphics.FromImage(bmp);
                        g.DrawImage(imgBack, 0, 0, 200, 200);
                        g.DrawImage(imgu, 79, 79, 45, 45);
                        bmp.Save(fileName, System.Drawing.Imaging.ImageFormat.Jpeg);    
                    }
                    else
                    {
                        System.Drawing.Bitmap bmp = new System.Drawing.Bitmap(200, 200, System.Drawing.Imaging.PixelFormat.Format32bppArgb);
                        System.Drawing.Graphics g = System.Drawing.Graphics.FromImage(bmp);
                        g.DrawImage(imgBack, 0, 0, 200, 200);
                        g.DrawImage(imgu, 90, 90, 35, 35);
                        bmp.Save(fileName, System.Drawing.Imaging.ImageFormat.Jpeg);                            
                    }
                }
                return Sys_Result.GetR(0, "/pic/userCode/" + uid + ".jpg");
            }

            string dates = DateTime.Now.ToString("yyMMdd");
            if (System.IO.Directory.Exists(c.Server.MapPath("~") + "/attach/" + dates) == false)//如果不存在就创建file文件夹
            {
                System.IO.Directory.CreateDirectory(c.Server.MapPath("~") + "/attach/" + dates);
            }
                        
            if (hType == 0)
            {
                string localPath = c.Server.MapPath("~") + "/attach/" + dates + "/" + DateTime.Now.ToString("yyMMddHHmmdd") + "_" + uid + ".jpg";
                string tempSrc = new WxTool().downloadMedia(serverId, localPath, Get_Access_Token(c));
                new Main().AddTestLog("tempSrc", tempSrc);


                string MbPath = c.Server.MapPath("/pic/mb/mb21.png");
                string MbPath_W = c.Server.MapPath("/pic/mb/mb12.png");
                //string UserPath = c.Server.MapPath("/qrcode/userPic/" + uid + ".jpg");
                //string logoPath = c.Server.MapPath("/images/codelogo.png");

                fileName = "/attach/" + dates + "/" + DateTime.Now.ToString("yyMMddHHmmss") + "_0_" + uid + ".jpg";
                string ResultPath = c.Server.MapPath("~") + fileName;
                string FontPath = c.Server.MapPath("/fonts\\ybhs2.ttc");
                int drcWidth = 560;
                int wType = 0;

                System.Drawing.Image imgBack = System.Drawing.Image.FromFile(localPath);
                System.Drawing.Image img = System.Drawing.Image.FromFile(MbPath);
                //System.Drawing.Image imgUser = System.Drawing.Image.FromFile(UserPath);
                if (imgBack.Width > imgBack.Height)
                {
                    img = System.Drawing.Image.FromFile(MbPath_W);
                    drcWidth = 560;
                    wType = 1;
                }
                System.Drawing.Image imgc = System.Drawing.Image.FromFile(CodePath);
                //System.Drawing.Image imgl = System.Drawing.Image.FromFile(logoPath);        

                //从指定的System.Drawing.Image创建新的System.Drawing.Graphics      
                System.Drawing.Bitmap bmp = new System.Drawing.Bitmap(img.Width, img.Height, System.Drawing.Imaging.PixelFormat.Format32bppArgb);
                System.Drawing.Graphics g = System.Drawing.Graphics.FromImage(bmp);
                int Width = imgBack.Width;
                int Height = imgBack.Height;

                int drcHeight = Convert.ToInt16(drcWidth * Height / Width);

                if (wType == 0)
                {
                    //g.DrawImage(imgBack, 35, 90, drcWidth, drcHeight);
                    g.DrawImage(imgBack, 30, 148, drcWidth, drcHeight);
                    g.DrawImage(img, 0, 0, img.Width, img.Height);
                    g.DrawImage(imgc, 71, 730, 112, 112);
                    //g.DrawImage(imgUser, 516, 846, 30, 30);
                }
                else
                {
                    g.DrawImage(imgBack, 35, 116, drcWidth, drcHeight);
                    g.DrawImage(img, 0, 0, img.Width, img.Height);
                    g.DrawImage(imgc, 48, 430, 62, 62);
                    //g.DrawImage(imgUser, 67, 532, 19, 19);
                }

                if (content.Length > 0)
                {
                    System.Drawing.StringFormat StrFormat = new System.Drawing.StringFormat();
                    System.Drawing.Text.PrivateFontCollection fm = new System.Drawing.Text.PrivateFontCollection();
                    fm.AddFontFile(FontPath);
                    System.Drawing.Font crFont = new System.Drawing.Font(fm.Families[0], 28, System.Drawing.FontStyle.Regular);
                    System.Drawing.SolidBrush semiTransBrush2 = new System.Drawing.SolidBrush(System.Drawing.Color.FromArgb(255, 0, 0, 0));
                    if (wType == 0)
                    {
                        if (content.Length < 10)
                        {
                            g.DrawString(content, crFont, semiTransBrush2, new System.Drawing.PointF(190, 950), StrFormat);
                        }
                        else
                        {
                            g.DrawString(content.Substring(0, 9), crFont, semiTransBrush2, new System.Drawing.PointF(190, 950), StrFormat);
                            g.DrawString(content.Substring(9, content.Length - 9), crFont, semiTransBrush2, new System.Drawing.PointF(190, 1010), StrFormat);
                        }
                    }
                    else
                    {
                        if (content.Length < 10)
                        {
                            g.DrawString(content, crFont, semiTransBrush2, new System.Drawing.PointF(120, 505), StrFormat);
                        }
                        else
                        {
                            g.DrawString(content.Substring(0, 9), crFont, semiTransBrush2, new System.Drawing.PointF(120, 495), StrFormat);
                            g.DrawString(content.Substring(9, content.Length - 9), crFont, semiTransBrush2, new System.Drawing.PointF(120, 540), StrFormat);
                        }

                    }
                }
                

                bmp.Save(ResultPath, System.Drawing.Imaging.ImageFormat.Jpeg);
            }
            else
            {
                string MbPath = c.Server.MapPath("/pic/mb/mb3.jpg");
                string FontPath = c.Server.MapPath("/fonts\\ybhs2.ttf");
                fileName = "/attach/" + dates + "/" + DateTime.Now.ToString("yyMMddHHmmss") + "_0_" + uid + ".jpg";
                string ResultPath = c.Server.MapPath("~") + fileName;

                System.Drawing.Image img = System.Drawing.Image.FromFile(MbPath);
                System.Drawing.Image imgc = System.Drawing.Image.FromFile(CodePath);
                //System.Drawing.Image imgl = System.Drawing.Image.FromFile(logoPath);        

                //从指定的System.Drawing.Image创建新的System.Drawing.Graphics      
                System.Drawing.Bitmap bmp = new System.Drawing.Bitmap(img.Width, img.Height, System.Drawing.Imaging.PixelFormat.Format32bppArgb);
                System.Drawing.Graphics g = System.Drawing.Graphics.FromImage(bmp);
                g.DrawImage(img, 0, 0, img.Width, img.Height);
                g.DrawImage(imgc, 102, 896, 125, 125);
                try
                {
                    System.Drawing.StringFormat StrFormat = new System.Drawing.StringFormat();
                    System.Drawing.Text.PrivateFontCollection fm = new System.Drawing.Text.PrivateFontCollection();
                    fm.AddFontFile(FontPath);
                    System.Drawing.Font crFont = new System.Drawing.Font(fm.Families[0], 52, System.Drawing.FontStyle.Regular);
                    System.Drawing.Font crFontSm = new System.Drawing.Font(fm.Families[0], 28, System.Drawing.FontStyle.Regular);
                    System.Drawing.SolidBrush semiTransBrush2 = new System.Drawing.SolidBrush(System.Drawing.Color.FromArgb(255, 255, 255, 255));
                    g.DrawString("我是", crFontSm, semiTransBrush2, new System.Drawing.PointF(40, 655), StrFormat);
                    g.DrawString(contact, crFont, semiTransBrush2, new System.Drawing.PointF(100, 630), StrFormat);
                }
                catch(Exception e)
                {
                    new Main().AddTestLog("createErr", e.ToString());
                } 
                               
                bmp.Save(ResultPath, System.Drawing.Imaging.ImageFormat.Jpeg);
            }

            return Sys_Result.GetR(0, fileName);
        }
        return Sys_Result.GetR(1, "");
    }

    public string DoGetImage(HttpContext c, string photo, int uid)
    {
        string path = c.Server.MapPath("/pic/user/" + uid + ".jpg");
        if (File.Exists(path))
        {
            return path;
        }
        HttpWebRequest req = (HttpWebRequest)WebRequest.Create(photo);

        req.ServicePoint.Expect100Continue = false;
        req.Method = "GET";
        req.KeepAlive = true;

        req.ContentType = "image/png";
        HttpWebResponse rsp = (HttpWebResponse)req.GetResponse();

        System.IO.Stream stream = null;

        try
        {
            // 以字符流的方式读取HTTP响应
            stream = rsp.GetResponseStream();
            System.Drawing.Image.FromStream(stream).Save(path);
        }
        finally
        {
            // 释放资源
            if (stream != null) stream.Close();
            if (rsp != null) rsp.Close();
        }
        return path;
    }
    
    
    /// <summary>
    /// 活动抢票
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string ActiveFund(HttpContext c)
    {
        int uId = string.IsNullOrEmpty(c.Request["uId"]) ? 0 : Convert.ToInt32(c.Request["uid"]);
        int aType = string.IsNullOrEmpty(c.Request["aType"]) ? 0 : Convert.ToInt16(c.Request["aType"]);
        user u = new _User().GetUser("", "", uId);
        if (u != null)
        {
            try
            {
                if (new _ActiveLog().CheckFund(uId) == 0)
                {
                    int fid = new _ActiveLog().getFundId(uId, aType);
                    if (fid > 0)
                    {
                        return Sys_Result.GetR(0, fid.ToString());
                    }
                }
            }
            catch
            {

            }
        }
        return Sys_Result.GetR(1, "");
    }

    /// <summary>
    /// 发送短信
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string SendSmsCode(HttpContext c)
    {
        string mobile = c.Request["mobile"] == null ? "" : c.Request["mobile"].ToString();
        string openID = c.Request["openID"] == null ? "" : c.Request["openID"].ToString();
        int uId = string.IsNullOrEmpty(c.Request["uId"]) ? 0 : Convert.ToInt32(c.Request["uId"]);
        int Code = new Random().Next(1000, 9999);
        user u = new _User().GetUser(openID, "", uId);
        if (u != null)
        {
            try
            {
                int SmsCodeNum_Day = new _SmsCode().GetSmsCount(mobile,uId);
                if (SmsCodeNum_Day > 5)
                {
                    return Sys_Result.GetR(1, "请勿频繁获取验证码");
                }
                else
                {
                    //cn.com.seascape.emp.SMSAPI s = new cn.com.seascape.emp.SMSAPI();
                    //s.SendMessage(smsUser, smsPass, mobile, smsMsg.Replace("{Code}", Code.ToString()), "");
                    string PostUrl = "http://59.49.19.109:8016/weixin/TrainHandler.ashx?Fn=3&mobile=" + mobile + "&msg=" + smsMsg.Replace("{Code}", Code.ToString());
                    BasicTool.webRequest(PostUrl);
                    smscode sc = new smscode { code = Code.ToString(), mobile = mobile,openId = openID,uid = uId,addOn = DateTime.Now };
                    if (new Main().AddToDb(sc, "t_smsCode"))
                    {
                        return Sys_Result.GetR(0, "");
                    }
                }
            }
            catch
            {

            }   
        }
        return Sys_Result.GetR(1, "短信发送失败，请稍后再试");
    }
    
    /// <summary>
    /// 用户绑定
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string BindUInfo(HttpContext c)
    {
        string openId = string.IsNullOrEmpty(c.Request["openId"]) ? "" : c.Request["openId"].ToString();
        string mobile = string.IsNullOrEmpty(c.Request["mobile"]) ? "" : c.Request["mobile"].ToString();
        string contact = string.IsNullOrEmpty(c.Request["contact"]) ? "" : c.Request["contact"].ToString();
        int uid = string.IsNullOrEmpty(c.Request["uid"]) ? 0 : Convert.ToInt32(c.Request["uid"]);
        string code = string.IsNullOrEmpty(c.Request["code"]) ? "" : c.Request["code"].ToString();
        user user = new _User().GetUser("", "", uid);      
        if (user != null)
        {
            string code_s = new _SmsCode().GetSmsCode(mobile, uid);
            if (code_s == code)
            {
                var o_user = new
                {
                    mobile = mobile,
                    contact = contact
                };
                new Main().UpdateDb(o_user, "t_user", "id=" + uid);
                int fareNum = 0;
                List<client> lc = new _Client().GetClientList(mobile);
                if (lc != null && lc.Count > 0)
                {
                    fareNum = lc.Count;
                }
                var or = new { Return = 0, Msg = "", Info = fareNum };
                return LitJson.JsonMapper.ToJson(or);                
            }
            else
            {
                return Sys_Result.GetR(1, "绑定失败,验证码错误");
            }
        }
        return Sys_Result.GetR(1, "绑定失败");
    }


    /// <summary>
    /// 用户绑定
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string AddShare(HttpContext c)
    {
        int uid = string.IsNullOrEmpty(c.Request["uid"]) ? 0 : Convert.ToInt32(c.Request["uid"]);
        int fType = string.IsNullOrEmpty(c.Request["fType"]) ? 0 : Convert.ToInt16(c.Request["fType"].ToString());
        user user = new _User().GetUser("", "", uid);
        if (user != null)
        {
            share sh = new share
            {
                uId = uid,
                fType = fType,
                addOn = DateTime.Now
            };
            if (new Main().AddToDb(sh, "t_share"))
            {
                return Sys_Result.GetR(0, "");    
            }
        }
        return Sys_Result.GetR(1, "");
    }

    /// <summary>
    /// 设置提醒
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string AddRemind(HttpContext c)
    {
        string sCode = string.IsNullOrEmpty(c.Request["sCode"]) ? "" : c.Request["sCode"].ToString();
        string tCode = string.IsNullOrEmpty(c.Request["tCode"]) ? "" : c.Request["tCode"].ToString();
        string sCity = string.IsNullOrEmpty(c.Request["sCity"]) ? "" : c.Request["sCity"].ToString();
        string tCity = string.IsNullOrEmpty(c.Request["tCity"]) ? "" : c.Request["tCity"].ToString();
        DateTime sDate = string.IsNullOrEmpty(c.Request["sDate"]) ? DateTime.Now : Convert.ToDateTime(c.Request["sDate"].ToString());
        DateTime eDate = string.IsNullOrEmpty(c.Request["eDate"]) ? DateTime.Now : Convert.ToDateTime(c.Request["eDate"].ToString());
        int lPrice = string.IsNullOrEmpty(c.Request["lPrice"]) ? 0 : Convert.ToInt16(c.Request["lPrice"].ToString());
        int discount = string.IsNullOrEmpty(c.Request["discount"]) ? 0 : Convert.ToInt16(c.Request["discount"].ToString());
        int uid = string.IsNullOrEmpty(c.Request["uid"]) ? 0 : Convert.ToInt32(c.Request["uid"]);
        user u = new _User().GetUser("", "", uid);
        if (u != null)
        {
            int days = (sDate - DateTime.Now.Date).Days;
            Remind r = new Remind
            {
                sCode = sCode,
                tCode = tCode,
                sCity = sCity,
                tCity = tCity,
                sDate = sDate,
                eDate = eDate,
                lPrice = lPrice,
                discount = discount,
                uid = uid,
                days = days,
                addOn = DateTime.Now
            };
            new Main().AddToDb(r, "t_remind");
        }
        return Sys_Result.GetR(0,"设置完成");
    }

    /// <summary>
    /// 取消低价提醒
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string CancelRemind(HttpContext c)
    {
        int id = string.IsNullOrEmpty(c.Request["id"]) ? 0 : Convert.ToInt16(c.Request["id"].ToString());
        int uid = string.IsNullOrEmpty(c.Request["uid"]) ? 0 : Convert.ToInt32(c.Request["uid"]);
        user u = new _User().GetUser("", "", uid);
        if (u != null && id > 0)
        {
            var o = new
            {
                enable = 1
            };
            new Main().UpdateDb(o, "t_remind", "id=" + id);
            return Sys_Result.GetR(0, "设置完成");
        }
        return Sys_Result.GetR(1, "设置失败");
    }
    
    /// <summary>
    /// 添加订单
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string AddOrder(HttpContext c)
    {
        int uid = string.IsNullOrEmpty(c.Request["uid"]) ? 0 : Convert.ToInt32(c.Request["uid"].ToString());
        string User_name = string.IsNullOrEmpty(c.Request["User_name"]) ? "" : c.Request["User_name"].ToString();
        int Fliht_type = string.IsNullOrEmpty(c.Request["Fliht_type"]) ? 1 : Convert.ToInt16(c.Request["Fliht_type"].ToString());
        string FlihtInfo = string.IsNullOrEmpty(c.Request["FlihtInfo"]) ? "" : c.Request["FlihtInfo"].ToString();
        string FlihtInfo_Back = string.IsNullOrEmpty(c.Request["FlihtInfo_Back"]) ? "" : c.Request["FlihtInfo_Back"].ToString();
        string FareInfo = string.IsNullOrEmpty(c.Request["FareInfo"]) ? "" : c.Request["FareInfo"].ToString();
        string User_tel = string.IsNullOrEmpty(c.Request["User_tel"]) ? "" : c.Request["User_tel"].ToString();
        string Send_Type = string.IsNullOrEmpty(c.Request["Send_type"]) ? "" : c.Request["Send_type"].ToString();
        string post_addr = string.IsNullOrEmpty(c.Request["post_addr"]) ? "" : c.Request["post_addr"].ToString();
        string post_name = string.IsNullOrEmpty(c.Request["post_name"]) ? "" : c.Request["post_name"].ToString();
        string post_tel = string.IsNullOrEmpty(c.Request["post_tel"]) ? "" : c.Request["post_tel"].ToString();

        string cjfbx_remark = string.IsNullOrEmpty(c.Request["cjfbx_remark"]) ? "" : c.Request["cjfbx_remark"].ToString();
        int cjfbx_total_price = string.IsNullOrEmpty(c.Request["cjfbx_total_price"]) ? 0 : Convert.ToInt16(c.Request["cjfbx_total_price"].ToString());

        int voucherFee = string.IsNullOrEmpty(c.Request["voucherFee"]) ? 0 : Convert.ToInt16(c.Request["voucherFee"].ToString());
        int voucherId = string.IsNullOrEmpty(c.Request["voucherId"]) ? 0 : Convert.ToInt32(c.Request["voucherId"].ToString());
        
        int Fare_num = string.IsNullOrEmpty(c.Request["Fare_num"]) ? 0 : Convert.ToInt16(c.Request["Fare_num"].ToString());
        int jp_total_price = string.IsNullOrEmpty(c.Request["jp_total_price"]) ? 0 : Convert.ToInt16(c.Request["jp_total_price"].ToString());
        int jj_total_price = string.IsNullOrEmpty(c.Request["jj_total_price"]) ? 0 : Convert.ToInt16(c.Request["jj_total_price"].ToString());
        int ry_total_price = string.IsNullOrEmpty(c.Request["ry_total_price"]) ? 0 : Convert.ToInt16(c.Request["ry_total_price"].ToString());
        int bx_total_price = string.IsNullOrEmpty(c.Request["bx_total_price"]) ? 0 : Convert.ToInt16(c.Request["bx_total_price"].ToString());
        
        
        int jp_total_price_back = string.IsNullOrEmpty(c.Request["jp_total_price_back"]) ? 0 : Convert.ToInt16(c.Request["jp_total_price_back"].ToString());
        int jj_total_price_back = string.IsNullOrEmpty(c.Request["jj_total_price_back"]) ? 0 : Convert.ToInt16(c.Request["jj_total_price_back"].ToString());
        int ry_total_price_back = string.IsNullOrEmpty(c.Request["ry_total_price_back"]) ? 0 : Convert.ToInt16(c.Request["ry_total_price_back"].ToString());
        int bx_total_price_back = string.IsNullOrEmpty(c.Request["bx_total_price_back"]) ? 0 : Convert.ToInt16(c.Request["bx_total_price_back"].ToString());
        
        user u = new _User().GetUser("", "", uid);
        if (u != null)
        {
            string PostUrl = "http://59.49.19.109:8016/weixin/WxHandler.ashx?Fn=1&";
            string Paras = "Fliht_type=" + Fliht_type;
            Paras += "&FlihtInfo=" + FlihtInfo;
            Paras += "&FlihtInfo_Back=" + FlihtInfo_Back;
            Paras += "&FareInfo=" + FareInfo.ToString().Replace(".00", "");
            Paras += "&User_tel=" + User_tel;
            Paras += "&Fare_num=" + Fare_num;
            Paras += "&jp_total_price=" + jp_total_price.ToString().Replace(".00","");
            Paras += "&jj_total_price=" + jj_total_price.ToString().Replace(".00", "");
            Paras += "&ry_total_price=" + ry_total_price.ToString().Replace(".00", "");

            Paras += "&jp_total_price_back=" + jp_total_price_back.ToString().Replace(".00", "");
            Paras += "&jj_total_price_back=" + jj_total_price_back.ToString().Replace(".00", "");
            Paras += "&ry_total_price_back=" + ry_total_price_back.ToString().Replace(".00", "");

            Paras += "&cjfbx_remark=" + cjfbx_remark;
            Paras += "&cjfbx_total_price=" + cjfbx_total_price.ToString().Replace(".00", "");

            Paras += "&voucherFee=" + voucherFee;
            Paras += "&voucherId=" + voucherId;
            
            Paras += "&bx_total_price=" + bx_total_price.ToString().Replace(".00", "");
            Paras += "&bx_total_price_back=" + bx_total_price_back.ToString().Replace(".00", "");
            Paras += "&uid=" + uid;
            Paras += "&srcUid=" + u.srcUid;
            Paras += "&User_name=" + User_name;
            Paras += "&Send_type=" + Send_Type;
            if (Send_Type == "邮寄")
            {
                Paras += "&post_addr=" + post_addr;
                Paras += "&post_name=" + post_name;
                Paras += "&post_tel=" + post_tel;                
            }
            PostUrl += Paras;
//          return PostUrl;
            string Rsa = BasicTool.webRequest(PostUrl);
            new Main().AddTestLog_B("[O]Result-", Rsa.ToString());
            if (Rsa.IndexOf("False") == -1 && Rsa.ToUpper().IndexOf("ERROR") == -1)
            {
                //string MsgContent = "";
                //TMsg_Work tmo = new TMsg_Work().GetMessageBody("您的订单我们已经收到，我们正在处理，感谢您的选择！", DateTime.Now.ToString("yyyyMMddHHmm"), DateTime.Now.ToString("yyyy-MM-dd HH:mm"), "[山西出行]", out MsgContent);
                //SendTemplateMessage(c, tmo, new TMsg_Work().Key(), u.openId, BaseUrl + "c_list.html", MsgContent,u.source);

                //处理优惠券
                var orderNo = Rsa;
                if (Rsa.IndexOf("|") > -1)
                {
                    orderNo = Rsa.Split('|')[0];
                }
                if (voucherFee > 0 && voucherId > 0)
                {
                    var ov = new
                    {
                        orderNo = orderNo,
                        useOn = DateTime.Now,
                        useFee = voucherFee,
                        enable = 1
                    };
                    new Main().UpdateDb(ov, "t_voucher", "id=" + voucherId);
                }
            }
            return Rsa;            
        }
        
        return Sys_Result.GetR(1, "添加失败");
    }

    /// <summary>
    /// 获取订单列表
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string GetOrderList(HttpContext c)
    {
        int uid = string.IsNullOrEmpty(c.Request["uid"]) ? 0 : Convert.ToInt32(c.Request["uid"]);
        user u = new _User().GetUser("", "", uid);
        if (u != null)
        {
            string PostUrl = "http://59.49.19.109:8016/weixin/WxHandler.ashx?Fn=2&";
            string Paras = "&uid=" + uid;
            PostUrl += Paras;
            string Result =  BasicTool.webRequest(PostUrl);
            if (Result.IndexOf("False") > -1)
            {
                return Sys_Result.GetR(1, "添加失败");
            }
            else
            {
                return Result;
            }
        }

        return Sys_Result.GetR(1, "添加失败");
    }

    /// <summary>
    /// 获取待提醒列表
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string GetRemindList(HttpContext c)
    {
        string sql = "select * from t_remind where enable = 0 and DATE(lastOn)<>DATE('" + DateTime.Now.Date + "') and DATE(eDate) > '" + DateTime.Now.Date + "'";
        List<Remind> lr = new _Remind().GetRemindList(sql);
        if (lr != null && lr.Count > 0)
        {
            sql = "update t_remind set aNum = aNum + 1,lastOn = '" + DateTime.Now + "' where  enable = 0 and DATE(lastOn)<>DATE('" + DateTime.Now.Date + "') and DATE(eDate) > '" + DateTime.Now.Date + "'";
            List<string> ls = new List<string>();
            ls.Add(sql);
            new Main().ExecForSql(ls);
            return JsonMapper.ToJson(lr);
        }
        return "False";
    }

    /// <summary>
    /// 获取用户低价提醒设置列表
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string GetRemindListForUID(HttpContext c)
    {
        int uid = string.IsNullOrEmpty(c.Request["uid"]) ? 0 : Convert.ToInt32(c.Request["uid"]);
        if (uid > 0)
        {
            string sql = "select * from t_remind where uid = " + uid + " order by addOn desc";
            List<Remind> lr = new _Remind().GetRemindList(sql);
            if (lr != null && lr.Count > 0)
            {
                var o = new { Return = 0, Msg = "", List = lr };
                return JsonMapper.ToJson(o);
            }    
        }
        return Sys_Result.GetR(1, "获取失败");
    }

    /// <summary>
    /// 获取总体统计
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string GetAllCount(HttpContext c)
    {
        string sDate = string.IsNullOrEmpty(c.Request["sDate"]) ? "" : c.Request["sDate"].ToString();
        string eDate = string.IsNullOrEmpty(c.Request["eDate"]) ? "" : c.Request["eDate"].ToString();
        int uid = string.IsNullOrEmpty(c.Request["uid"]) ? 0 : Convert.ToInt32(c.Request["uid"]);
        
        if (sDate.Length > 0 && eDate.Length > 0)
        {
            CountAll ca = new _CountAll().GetCount(Convert.ToDateTime(sDate), Convert.ToDateTime(eDate));
            if (ca != null)
            {
                var o = new { Return = 0, Msg = "", Info = ca };
                return JsonMapper.ToJson(o);
            }
        }
        return Sys_Result.GetR(1, "获取失败");
    }

    /// <summary>
    /// 获取分销总体统计
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string GetFxCount(HttpContext c)
    {
        string sDate = string.IsNullOrEmpty(c.Request["sDate"]) ? "" : c.Request["sDate"].ToString();
        string eDate = string.IsNullOrEmpty(c.Request["eDate"]) ? "" : c.Request["eDate"].ToString();
        string openId = string.IsNullOrEmpty(c.Request["openId"]) ? "" : c.Request["openId"].ToString();
        int uid = string.IsNullOrEmpty(c.Request["uid"]) ? 0 : Convert.ToInt32(c.Request["uid"]);

        bool isValid = false;
        
        if (openId.Length > 0)
        {
            user u = new _User().GetUser(openId, "", 0);
            if (u != null)
            {
                if (u.id == uid)
                {
                    isValid = true;
                }
            }
        }

        if (isValid && sDate.Length > 0 && eDate.Length > 0)
        {
            CountFx ca = new _CountFx().GetCount(Convert.ToDateTime(sDate), Convert.ToDateTime(eDate),uid);
            if (ca != null)
            {
                var o = new { Return = 0, Msg = "", Info = ca };
                return JsonMapper.ToJson(o);
            }
        }
        return Sys_Result.GetR(1, "获取失败");
    }


    /// <summary>
    /// 获取分销订单明细
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string GetFxOrderList(HttpContext c)
    {
        string sDate = string.IsNullOrEmpty(c.Request["sDate"]) ? "" : c.Request["sDate"].ToString();
        string eDate = string.IsNullOrEmpty(c.Request["eDate"]) ? "" : c.Request["eDate"].ToString();
        string openId = string.IsNullOrEmpty(c.Request["openId"]) ? "" : c.Request["openId"].ToString();
        int uid = string.IsNullOrEmpty(c.Request["uid"]) ? 0 : Convert.ToInt32(c.Request["uid"]);

        bool isValid = false;

        if (openId.Length > 0)
        {
            user u = new _User().GetUser(openId, "", 0);
            if (u != null)
            {
                if (u.id == uid)
                {
                    isValid = true;
                }
            }
        }

        if (isValid && sDate.Length > 0 && eDate.Length > 0)
        {
            string airInfo = BasicTool.webRequest("http://59.49.19.109:8016/weixin/WxHandler.ashx?Fn=12&srcUid=" + uid + "&sDate=" + sDate + "&eDate=" + eDate);
            if (airInfo.Length > 0)
            {
                return airInfo;
            }
        }
        return "";
    }

    /// <summary>
    /// 获取分销用户明细
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string GetFxUserList(HttpContext c)
    {
        string sDate = string.IsNullOrEmpty(c.Request["sDate"]) ? "" : c.Request["sDate"].ToString();
        string eDate = string.IsNullOrEmpty(c.Request["eDate"]) ? "" : c.Request["eDate"].ToString();
        string openId = string.IsNullOrEmpty(c.Request["openId"]) ? "" : c.Request["openId"].ToString();
        int uid = string.IsNullOrEmpty(c.Request["uid"]) ? 0 : Convert.ToInt32(c.Request["uid"]);

        bool isValid = false;

        if (openId.Length > 0)
        {
            user u = new _User().GetUser(openId, "", 0);
            if (u != null)
            {
                if (u.id == uid)
                {
                    isValid = true;
                }
            }
        }

        if (isValid && sDate.Length > 0 && eDate.Length > 0)
        {
            List<user> ca = new _User().GetUserWithFx(uid, sDate, eDate);
            if (ca != null)
            {
                var o = new { Return = 0, Msg = "", List = ca };
                return JsonMapper.ToJson(o);
            }
        }
        return Sys_Result.GetR(1, "获取失败");
    }

    /// <summary>
    /// 分销注册
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string ToRegFx(HttpContext c)
    {
        string mobile = string.IsNullOrEmpty(c.Request["mobile"]) ? "" : c.Request["mobile"].ToString();
        string contact = string.IsNullOrEmpty(c.Request["contact"]) ? "" : c.Request["contact"].ToString();
        string openId = string.IsNullOrEmpty(c.Request["openId"]) ? "" : c.Request["openId"].ToString();
        int uid = string.IsNullOrEmpty(c.Request["uid"]) ? 0 : Convert.ToInt32(c.Request["uid"]);

        bool isValid = false;

        if (openId.Length > 0)
        {
            user u = new _User().GetUser(openId, "", 0);
            if (u != null)
            {
                if (u.id == uid)
                {
                    if (u.balance == 1)
                    {
                        return Sys_Result.GetR(1, "您已注册过，请直接联系业务人员开通！");
                    }
                    if (u.balance == 2)
                    {
                        return Sys_Result.GetR(1, "您已注册过，请直接在个人中心-我的分销进入！");
                    }
                    isValid = true;
                }
            }
        }

        if (isValid && mobile.Length > 0 && contact.Length > 0)
        {
            var o = new
            {
                balance = 1
            };
            if (new Main().UpdateDb(o, "t_user", "openId = '" + openId + "'"))
            {
                string MsgContent = "";
                TMsg_Work tmo = new TMsg_Work().GetMessageBody("有新分销注册，分销ID:"+uid+"！", DateTime.Now.ToString("yyyyMMddHHmm"), DateTime.Now.ToString("yyyy-MM-dd HH:mm"), "[山西出行]", out MsgContent);
                SendTemplateMessage(c, tmo, new TMsg_Work().Key(), "oKhuCwXUcG1KFsUd0Cti9HakBLC8", "", MsgContent, "0000");
                return Sys_Result.GetR(0, "");
            }
        }
        return Sys_Result.GetR(1, "申请失败，请刷新页面后重新再试！");
    }

    /// <summary>
    /// 分销验证
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string FxCheck(HttpContext c)
    {
        string openId = string.IsNullOrEmpty(c.Request["openId"]) ? "" : c.Request["openId"].ToString();
        int uid = string.IsNullOrEmpty(c.Request["uid"]) ? 0 : Convert.ToInt32(c.Request["uid"]);

        bool isValid = false;

        if (openId.Length > 0)
        {
            user u = new _User().GetUser(openId, "", 0);
            if (u != null)
            {
                if (u.id == uid)
                {
                    if (u.balance == 2)
                    {
                        isValid = true;    
                    }
                }
            }
        }

        if (isValid)
        {
            string FilePath = c.Server.MapPath("/pic/QrCode/" + uid + ".jpg");
            if (!File.Exists(FilePath))
            {
                int SceneID = uid;
                string Result = new Common(appid, secret).GetQR_Code(Get_Access_Token(c), FilePath, SceneID);    
            }
            return Sys_Result.GetR(0, "");
        }
        return Sys_Result.GetR(1, "您的分销资质还未审核通过，请联系业务人员进行审核后再打开！");
    }

    /// <summary>
    /// 获取总体统计
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string GetAllCountForSource(HttpContext c)
    {
        string sDate = string.IsNullOrEmpty(c.Request["sDate"]) ? "" : c.Request["sDate"].ToString();
        string eDate = string.IsNullOrEmpty(c.Request["eDate"]) ? "" : c.Request["eDate"].ToString();
        int uid = string.IsNullOrEmpty(c.Request["uid"]) ? 0 : Convert.ToInt32(c.Request["uid"]);

        if (sDate.Length > 0 && eDate.Length > 0)
        {
            List<CountSource> ca = new _CountAll().GetCountSource(Convert.ToDateTime(sDate), Convert.ToDateTime(eDate));
            if (ca != null)
            {
                var o = new { Return = 0, Msg = "", List = ca };
                return JsonMapper.ToJson(o);
            }
        }
        return Sys_Result.GetR(1, "无数据");
    }

    /// <summary>
    /// 马拉松体育家庭报名
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string AddVote(HttpContext c)
    {
        string bNo = string.IsNullOrEmpty(c.Request["bNo"]) ? "" : c.Request["bNo"].ToString();
        string Contact = string.IsNullOrEmpty(c.Request["Contact"]) ? "" : c.Request["Contact"].ToString();
        string Mobile = string.IsNullOrEmpty(c.Request["Mobile"]) ? "" : c.Request["Mobile"].ToString();
        string Img_One = string.IsNullOrEmpty(c.Request["Img_One"]) ? "" : c.Request["Img_One"].ToString();
        string Img_Home = string.IsNullOrEmpty(c.Request["Img_Home"]) ? "" : c.Request["Img_Home"].ToString();
        int uid = string.IsNullOrEmpty(c.Request["uid"]) ? 0 : Convert.ToInt32(c.Request["uid"]);

        user u = new _User().GetUser("", "", uid);
        if (u != null)
        {
            string dates = DateTime.Now.ToString("yyMMdd");
            if (System.IO.Directory.Exists(c.Server.MapPath("~") + "/attach/vote/" + bNo + "-" + Mobile) == false) 
            {
                System.IO.Directory.CreateDirectory(c.Server.MapPath("~") + "/attach/vote/" + bNo + "-" + Mobile);
            }
            //个人运动电子照片
            string localPath = c.Server.MapPath("~") + "/attach/vote/" + bNo + "-" + Mobile + "/01.jpg";
            string tempSrc = new WxTool().downloadMedia(Img_One, localPath, Get_Access_Token(c));
            string Img_one_src = "/attach/vote/" + bNo + "-" + Mobile + "/01.jpg";

            //家庭运动电子照片
            localPath = c.Server.MapPath("~") + "/attach/vote/" + bNo + "-" + Mobile + "/02.jpg";
            tempSrc = new WxTool().downloadMedia(Img_Home, localPath, Get_Access_Token(c));
            string Img_home_src = "/attach/vote/" + bNo + "-" + Mobile + "/02.jpg";
            
            VoteUser vote = new VoteUser
            {
                bNo = bNo,
                Contact = Contact,
                Mobile = Mobile,
                Img_one = Img_one_src,
                Img_home = Img_home_src,
                addOn = DateTime.Now,
                uid = uid,
                openId = u.openId
            };
            if (new Main().AddToDb(vote, "t_acive_voteuser"))
            {
                return Sys_Result.GetR(0, "报名资料上传完成！");
            }
        }     
        
        return Sys_Result.GetR(1, "上传失败，请稍后再试！");
    }

    /// <summary>
    /// 马拉松体育家庭报名
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string ToVote(HttpContext c)
    {
        string bNo = string.IsNullOrEmpty(c.Request["bNo"]) ? "" : c.Request["bNo"].ToString();
        string openId = string.IsNullOrEmpty(c.Request["openId"]) ? "" : c.Request["openId"].ToString();
        int uid = string.IsNullOrEmpty(c.Request["uid"]) ? 0 : Convert.ToInt32(c.Request["uid"]);
        new Main().AddTestLog("Vote", bNo + "-" + openId + "-" + uid);

        int StartNum = Convert.ToInt32(DateTime.Now.ToString("MddHH"));
        if (StartNum < 83100)
        {
            return Sys_Result.GetR(1, "投票未开始，【2017年8月31日（周四）0：00开始】！");
        }
        if (StartNum > 90423)
        {
            return Sys_Result.GetR(1, "投票已结束，感谢您的参与！");
        }
        
        user u = new _User().GetUser(openId, "", uid);
        if (u != null)
        {
            if (uid == 0)
            {
                uid = u.id;
            }
            
            int v = new _ActiveVote().GetVote(uid);
            
            if (v == 0)
            //if (c.Cache["Web_Vote_" + openId] == null)
            {
                string[] arr = bNo.Split(',');
                if (arr.Length < 4)
                {
                    foreach (string item in arr)
                    {
                        Vote vote = new Vote
                        {
                            bNo = item,
                            nickName = u.nickName,
                            photoUrl = u.photoUrl,
                            addOn = DateTime.Now,
                            uid = u.id,
                        };
                        new Main().AddToDb(vote, "t_active_vote");
                    }
                }
                //c.Cache.Add("Web_Vote_" + openId, "1", null, System.DateTime.UtcNow.AddDays(1), TimeSpan.Zero, System.Web.Caching.CacheItemPriority.Normal, null);
                return Sys_Result.GetR(0, "投票完成，感谢您的参与！");
            }
            else
            {
                return Sys_Result.GetR(1, "投票失败，今日已投过，不能重复投票！");
            }
        }

        return Sys_Result.GetR(2, "投票失败，如果未关注，请先关注，如果已关注，请点击“刷新页面”后再试！");
    }

    /// <summary>
    /// 马拉松投票
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string ToVoteNew(HttpContext c)
    {
        string bNo = string.IsNullOrEmpty(c.Request["bNo"]) ? "" : c.Request["bNo"].ToString();
        string openId = string.IsNullOrEmpty(c.Request["openId"]) ? "" : c.Request["openId"].ToString();
        new Main().AddTestLog("Vote", bNo + "-" + openId);
        user u = new _User().GetUser(openId, "", 0);
        try
        {
            string r = "";
            Seascape.WxApi.UserInfo ui = Seascape.WxApi.UserInfo.getUserInfoByGlobal(Get_Access_Token(c), openId, out r);
            new Main().AddTestLog("r-new" + openId, r);
            if (ui != null && !string.IsNullOrEmpty(ui.nickname))
            {
                if (ui.subscribe == 0)
                {
                    return Sys_Result.GetR(2, "投票失败，请先关注微信公众平台！");
                }
            }
            else
            {
                return Sys_Result.GetR(2, "投票失败，请先关注微信公众平台！");
            }
        }
        catch
        {
            if (u != null && u.isSubscribe == 1)
            {
                
            }
            else
            {
                return Sys_Result.GetR(2, "投票失败，如果未关注，请先关注，如果已关注，请点击“刷新页面”后再试！");
            }
        }
        
        
        if (bNo.Length != 7)
        {
            return Sys_Result.GetR(1, "投票失败，非法投票");
        }

        int StartNum = Convert.ToInt32(DateTime.Now.ToString("MddHH"));
        if (StartNum < 83100)
        {
            return Sys_Result.GetR(1, "投票未开始，【2017年8月31日（周四）0：00开始】！");
        }
        if (StartNum > 90500)
        {
            return Sys_Result.GetR(1, "投票已结束，感谢您的参与！");
        }


        int v = new _ActiveVote().GetVote(u.id);

        if (v == 0)
        {
            string[] arr = bNo.Split(',');
            if (arr.Length < 4)
            {
                foreach (string item in arr)
                {
                    Vote vote = new Vote
                    {
                        bNo = item,
                        nickName = u.nickName,
                        photoUrl = u.photoUrl,
                        addOn = DateTime.Now,
                        uid = u.id,
                    };
                    new Main().AddToDb(vote, "t_active_vote");
                }
            }
            return Sys_Result.GetR(0, "投票完成，感谢您的参与！");
        }
        else
        {
            return Sys_Result.GetR(1, "投票失败，今日已投过，不能重复投票！");
        }
    }

    /// <summary>
    /// 获取候选人列表
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string GetVoteList(HttpContext c)
    {
        List<VoteUser> la = new _ActiveVote().GetVoteUser();
        if (la != null && la.Count > 0)
        {
            Dictionary<string, int> Dic = new _ActiveVote().GetVoteDic();
            foreach (VoteUser item in la)
            {
                if (Dic.ContainsKey(item.bNo))
                {
                    item.voteNum = Dic[item.bNo];
                }
                else
                {
                    item.voteNum = 0;
                }
            }
            var o = new { Return = 0, Msg = "", List = la };
            return JsonMapper.ToJson(o);
        }
        return Sys_Result.GetR(1, "");
    }

    /// <summary>
    /// 获取候选人列表
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string GetVoteListForCache(HttpContext c)
    {
        List<VoteUser> la = new List<VoteUser>();
        if (c.Cache["MLS_Vote_List"] == null)
        {
            la = new _ActiveVote().GetVoteUser();
            c.Cache.Add("MLS_Vote_List", la, null, System.DateTime.UtcNow.AddDays(4), TimeSpan.Zero, System.Web.Caching.CacheItemPriority.Normal, null);
        }
        else
        {
            la = (List<VoteUser>)c.Cache["MLS_Vote_List"];
            
        }
        if (la != null && la.Count > 0)
        {
            Dictionary<string, int> Dic = new _ActiveVote().GetVoteDic();
            foreach (VoteUser item in la)
            {
                item.openId = "";
                item.Img_home = "";
                item.Mobile = "";
                if (Dic.ContainsKey(item.bNo))
                {
                    item.voteNum = Dic[item.bNo];
                }
                else
                {
                    item.voteNum = 0;
                }
            }
            var o = new { Return = 0, Msg = "", List = la };
            return JsonMapper.ToJson(o);
        }
        return Sys_Result.GetR(1, "");
    }

    /// <summary>
    /// 发送通知
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string SendVoteMsg(HttpContext c)
    {
        List<VoteUser> lo = new _ActiveVote().GetVoteUser();
        if (lo != null && lo.Count > 0)
        {
            string token = Get_Access_Token(c);
            string url = "https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token=" + token;
            string Msg = "尊敬的候选人您好，感谢您参与本次活动，投票必须先关注微信公众平台，否则会投票失败。";
            string content = "";
            /*
            foreach (VoteUser item in lo)
            {
                content = "{\"touser\":\""+item.openId+"\",\"msgtype\":\"text\",\"text\":{\"content\":\"" + Msg + "\"}}";
                new WxTool().webRequest(url, content);              
            }
            */
            content = "{\"touser\":\"oKhuCwXUcG1KFsUd0Cti9HakBLC8\",\"msgtype\":\"text\",\"text\":{\"content\":\"" + Msg + "\"}}";
            new WxTool().webRequest(url, content);
            return Sys_Result.GetR(0, "");
        }
        return Sys_Result.GetR(1, "");
    }

    /// <summary>
    /// 获取投票结果
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string GetVotePm(HttpContext c)
    {
        List<VotePmInfo> lo = new List<VotePmInfo>();
        if (c.Cache["MLS_VOTE_PM"] == null)
        {
            lo = new _ActiveVote().GetVotePmInfo();
            c.Cache.Add("MLS_VOTE_PM", lo, null, System.DateTime.UtcNow.AddMinutes(30), TimeSpan.Zero, System.Web.Caching.CacheItemPriority.Normal, null);
        }
        else
        {
            lo = (List<VotePmInfo>)c.Cache["MLS_VOTE_PM"];
        }
        if (lo != null && lo.Count > 0)
        {
            var o = new { Return = 0, Msg = "", List = lo };
            return JsonMapper.ToJson(o);
        }
        return Sys_Result.GetR(1, "");
    }

    /// <summary>
    /// 获取投票结果
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string GetVotePmData(HttpContext c)
    {
        List<VotePm> lo = new _ActiveVote().GetVotePm();
        if (lo != null && lo.Count > 0)
        {
            var o = new { Return = 0, Msg = "", List = lo };
            return JsonMapper.ToJson(o);
        }
        return Sys_Result.GetR(1, "");
    }


    /// <summary>
    /// 获取总体统计
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string GetAllCountForSrc(HttpContext c)
    {
        string sDate = string.IsNullOrEmpty(c.Request["sDate"]) ? "" : c.Request["sDate"].ToString();
        string eDate = string.IsNullOrEmpty(c.Request["eDate"]) ? "" : c.Request["eDate"].ToString();
        int uid = string.IsNullOrEmpty(c.Request["uid"]) ? 0 : Convert.ToInt32(c.Request["uid"]);

        if (sDate.Length > 0 && eDate.Length > 0)
        {
            List<CountSrcUid> ca = new _CountAll().GetCountSrc(Convert.ToDateTime(sDate), Convert.ToDateTime(eDate));
            if (ca != null)
            {
                var o = new { Return = 0, Msg = "", List = ca };
                return JsonMapper.ToJson(o);
            }
        }
        return Sys_Result.GetR(1, "无数据");
    }


    /// <summary>
    /// 获取总体统计-内部员工
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string GetAllCountForYGSrc(HttpContext c)
    {
        string sDate = string.IsNullOrEmpty(c.Request["sDate"]) ? "" : c.Request["sDate"].ToString();
        string eDate = string.IsNullOrEmpty(c.Request["eDate"]) ? "" : c.Request["eDate"].ToString();
        int uid = string.IsNullOrEmpty(c.Request["uid"]) ? 0 : Convert.ToInt32(c.Request["uid"]);

        if (sDate.Length > 0 && eDate.Length > 0)
        {
            List<CountSrcUid> ca = new _CountAll().GetCountSrcForYG(Convert.ToDateTime(sDate), Convert.ToDateTime(eDate));
            if (ca != null)
            {
                var o = new { Return = 0, Msg = "", List = ca };
                return JsonMapper.ToJson(o);
            }
        }
        return Sys_Result.GetR(1, "无数据");
    }
    /// <SUMMARY> 
    /// 上传多媒体文件,返回 MediaId 
    /// </SUMMARY> 
    /// <PARAM name="ACCESS_TOKEN"></PARAM> 
    /// <PARAM name="Type"></PARAM> 
    /// <RETURNS></RETURNS> 
    public string UploadMultimedia(HttpContext c)
    {
        string result = "";
        int uid = string.IsNullOrEmpty(c.Request["uid"]) ? 0 : Convert.ToInt32(c.Request["uid"]);
        string wxurl = "http://file.api.weixin.qq.com/cgi-bin/media/upload?access_token=" + Get_Access_Token(c) + "&type=image";
        string filepath = c.Server.MapPath("\\pic\\ad") + "\\" + uid + ".jpg";
        WebClient myWebClient = new WebClient();
        myWebClient.Credentials = CredentialCache.DefaultCredentials;
        string media_id = "";
        try
        {
            byte[] responseArray = myWebClient.UploadFile(wxurl, "POST", filepath);
            result = System.Text.Encoding.Default.GetString(responseArray, 0, responseArray.Length);
            UploadMM _mode = Newtonsoft.Json.JsonConvert.DeserializeObject<UploadMM>(result);
            media_id = _mode.media_id;
            result = SendKfMessage(c, media_id);
        }
        catch (Exception ex)
        {
            result = "Error:" + ex.Message;
        }
        return media_id + "|--2--" + result;
    }

    /// <summary>
    /// 发送客服消息
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string SendKfMessage(HttpContext c, string MEDIA_ID)
    {
        int uid = string.IsNullOrEmpty(c.Request["uid"]) ? 0 : Convert.ToInt32(c.Request["uid"]);
        user u = new _User().GetUser("", "", uid);
        string rsa = "";
        string PostUrl = "";
        if (u != null)
        {
            PostUrl = "https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token=" + Get_Access_Token(c);
            string Message = "{\"touser\":\"" + u.openId + "\",\"msgtype\":\"image\",\"image\":{\"media_id\":\"" + MEDIA_ID + "\"}}";
            rsa = new Common(appid, secret).webRequest(PostUrl, Message.ToString());
        }
        return rsa + "|--3--" + PostUrl;
    }
    
    /// <summary>
    /// 获取用户代金券列表
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string GetVoucherList(HttpContext c)
    {
        int uid = string.IsNullOrEmpty(c.Request["uid"]) ? 0 : Convert.ToInt32(c.Request["uid"]);
        if (uid > 0)
        {
            List<voucher> lr = new _Voucher().GetVoucherList(uid);
            if (lr != null && lr.Count > 0)
            {
                var o = new { Return = 0, Msg = "", List = lr };
                return JsonMapper.ToJson(o);
            }
        }
        return Sys_Result.GetR(1, "获取失败");
    }

    /// <summary>
    /// 更新已发提醒
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string UpdateRemind(HttpContext c)
    {
        string ids = string.IsNullOrEmpty(c.Request["ids"]) ? "" : c.Request["ids"].ToString();
        string ids_fail = string.IsNullOrEmpty(c.Request["ids_fail"]) ? "" : c.Request["ids_fail"].ToString();
        List<string> ls = new List<string>();
        if (ids.Length > 0)
        {
            string sql = "update t_remind set lastOn = '" + DateTime.Now + "',sNum = sNum + 1,enable = 2 where id in(" + ids + ")";
            ls.Add(sql);    
        }
        if (ids_fail.Length > 0)
        {
            string sql = "update t_remind set lastOn = '" + DateTime.Now + "',sNum = sNum + 1,enable = 3 where id in(" + ids + ")";
            ls.Add(sql);
        }
        //sql = "update t_remind set enable = 1 where sNum = 3";
        //ls.Add(sql);
        if (ls.Count > 0)
        {
            new Main().ExecForSql(ls);
        }
        
        return "OK";
    }

    /// <summary>
    /// 获取订单详情
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string GetOrderInfo(HttpContext c)
    {
        int uid = string.IsNullOrEmpty(c.Request["uid"]) ? 0 : Convert.ToInt32(c.Request["uid"]);
        string OrderNo = string.IsNullOrEmpty(c.Request["OrderNo"]) ? "" : c.Request["OrderNo"].ToString();
        user u = new _User().GetUser("", "", uid);
        if (u != null && OrderNo.Length > 0)
        {
            string PostUrl = "http://59.49.19.109:8016/weixin/WxHandler.ashx?Fn=3&";
            string Paras = "&uid=" + uid;
            Paras += "&Order_no=" + OrderNo;
            PostUrl += Paras;
            return BasicTool.webRequest(PostUrl);
        }

        return Sys_Result.GetR(1, "添加失败");
    }

    /// <summary>
    /// 添加退改签申请
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string AddTgq(HttpContext c)
    {
        int uid = string.IsNullOrEmpty(c.Request["uid"]) ? 0 : Convert.ToInt32(c.Request["uid"]);
        int Ask_type = string.IsNullOrEmpty(c.Request["Ask_type"]) ? 0 : Convert.ToInt16(c.Request["Ask_type"].ToString());
        string OrderNo = string.IsNullOrEmpty(c.Request["orderNo"]) ? "" : c.Request["orderNo"].ToString();
        user u = new _User().GetUser("", "", uid);
        if (u != null && OrderNo.Length > 0)
        {
            string PostUrl = "http://59.49.19.109:8016/weixin/WxHandler.ashx?Fn=7&";
            string Paras = "&uid=" + uid;
            Paras += "&Order_no=" + OrderNo;
            Paras += "&Ask_type=" + Ask_type;
            PostUrl += Paras;
            return BasicTool.webRequest(PostUrl);
        }

        return Sys_Result.GetR(1, "添加失败");
    }

    /// <summary>
    /// 添加退改签申请
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string AddGjAsk(HttpContext c)
    {
        int uid = string.IsNullOrEmpty(c.Request["uid"]) ? 0 : Convert.ToInt32(c.Request["uid"]);
        string Memo = string.IsNullOrEmpty(c.Request["Memo"]) ? "" : c.Request["Memo"].ToString();
        string Contact = string.IsNullOrEmpty(c.Request["Contact"]) ? "" : c.Request["Contact"].ToString();
        string Mobile = string.IsNullOrEmpty(c.Request["Mobile"]) ? "" : c.Request["Mobile"].ToString();
        user u = new _User().GetUser("", "", uid);
        if (u != null)
        {
            string PostUrl = "http://59.49.19.109:8016/weixin/WxHandler.ashx?Fn=9&";
            string Paras = "&uid=" + uid;
            Paras += "&Contact=" + Contact;
            Paras += "&Mobile=" + Mobile;
            Paras += "&Memo=" + Memo;
            PostUrl += Paras;
            return BasicTool.webRequest(PostUrl);
        }

        return Sys_Result.GetR(1, "添加失败");
    }

    /// <summary>
    /// 获取订单详情
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public OrderInfo OrderInfo(string OrderNo,int uid)
    {
        OrderInfo o = new OrderInfo();
        string PostUrl = "http://59.49.19.109:8016/weixin/WxHandler.ashx?Fn=3&";
        string Paras = "&uid=" + uid;
        Paras += "&Order_no=" + OrderNo;
        PostUrl += Paras;
        string oi = BasicTool.webRequest(PostUrl);
        try
        {
            o = Newtonsoft.Json.JsonConvert.DeserializeObject<OrderInfo>(oi);
            //o = (OrderInfo)Newtonsoft.Json.JsonConvert.DeserializeObject(oi, o.GetType());
        }
        catch
        {
            
        }
        return o;
    }

    /// <summary>
    /// 获取订单总价
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public Double Price(string OrderNo, int uid)
    {
        Double Price = 0;
        string PostUrl = "http://59.49.19.109:8016/weixin/WxHandler.ashx?Fn=5&";
        string Paras = "&uid=" + uid;
        Paras += "&Order_no=" + OrderNo;
        PostUrl += Paras;
        string oi = BasicTool.webRequest(PostUrl);
        try
        {
            Price = Convert.ToInt32(oi);
        }
        catch
        {
            Price = 0;
        }
        return Price;
    }
    
    /// <summary>
    /// 支付完成后发送模板消息
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string SendTMessage(HttpContext c)
    {
        string Content = string.IsNullOrEmpty(c.Request["Content"]) ? "" : c.Request["Content"].ToString();
        int uid = string.IsNullOrEmpty(c.Request["uid"]) ? 0 : Convert.ToInt32(c.Request["uid"]);
        int mType = string.IsNullOrEmpty(c.Request["mType"]) ? 0 : Convert.ToInt16(c.Request["mType"]);
        int isPay = string.IsNullOrEmpty(c.Request["isPay"]) ? 0 : Convert.ToInt16(c.Request["isPay"]);

        if (isPay == 1)
        {
            Content = "您的订单我们已经收到，请您尽快支付，以免价格发生变化。";
        }

        if (isPay == 2)
        {
            Content = "您的订单我们已经收到，我们正在处理，感谢您的选择！";
        }
        
        //给用户发送提交订单成功模板消息
        string MsgContent = "";
        user u = new _User().GetUser("", "", uid);
        if (u != null)
        {
            
            string Msg = Content;
            if (mType == 0)
            {
                TMsg_Work tmo = new TMsg_Work().GetMessageBody(Msg, DateTime.Now.ToString("yyyyMMddHHmm"), DateTime.Now.ToString("yyyy-MM-dd HH:mm"), "[山西出行]", out MsgContent);
                SendTemplateMessage(c, tmo, new TMsg_Work().Key(), u.openId, BaseUrl + "c_order_all.html", MsgContent, u.source);    
            }
            else
            {
                if (mType == 10)
                {
                    TMsg_Work tmo = new TMsg_Work().GetMessageBody(Msg, DateTime.Now.ToString("yyyyMMddHHmm"), DateTime.Now.ToString("yyyy-MM-dd HH:mm"), "[山西出行]", out MsgContent);
                    SendTemplateMessage(c, tmo, new TMsg_Work().Key(), u.openId, BaseUrl + "c_order_all.html?oType=1", MsgContent, u.source);
                }
                else
                {
                    TMsg_Work tmo = new TMsg_Work().GetMessageBody(Msg, DateTime.Now.ToString("yyyyMMddHHmm"), DateTime.Now.ToString("yyyy-MM-dd HH:mm"), "[山西出行]", out MsgContent);
                    SendTemplateMessage(c, tmo, new TMsg_Work().Key(), u.openId, BaseUrl + "c_index_home.html", MsgContent, u.source);                    
                }
            }
            
        }
        return Sys_Result.GetR(0, "");
    }

    /// <summary>
    /// 支付完成后发送模板消息
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string SendTMessageApi(HttpContext c)
    {
        string first = string.IsNullOrEmpty(c.Request["first"]) ? "" : c.Request["first"].ToString();
        string remark = string.IsNullOrEmpty(c.Request["remark"]) ? "" : c.Request["remark"].ToString();
        string keyword1 = string.IsNullOrEmpty(c.Request["keyword1"]) ? "" : c.Request["keyword1"].ToString();
        string keyword2 = string.IsNullOrEmpty(c.Request["keyword2"]) ? "" : c.Request["keyword2"].ToString();
        string orderNo = string.IsNullOrEmpty(c.Request["orderNo"]) ? "" : c.Request["orderNo"].ToString();
        int uid = string.IsNullOrEmpty(c.Request["uid"]) ? 0 : Convert.ToInt32(c.Request["uid"]);
        //给用户发送提交订单成功模板消息
        string MsgContent = "";
        first = c.Server.UrlDecode(first);
        remark = c.Server.UrlDecode(remark);
        keyword1 = c.Server.UrlDecode(keyword1);
        keyword2 = c.Server.UrlDecode(keyword2);
        orderNo = c.Server.UrlDecode(orderNo);
        user u = new _User().GetUser("", "", uid);
        if (u != null)
        {
            TMsg_Work tmo = new TMsg_Work().GetMessageBody(first, keyword1, keyword2, remark, out MsgContent);
            SendTemplateMessage(c, tmo, new TMsg_Work().Key(), u.openId, BaseUrl + "app/hotel/orderdetail.html?orderNo=" + orderNo, MsgContent, u.source);

        }
        return "OK";
    }

    /// <summary>
    /// 获取模板消息ID
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    private Dictionary<string, msgConfig> GetMessageConfig(HttpContext c)
    {
        if (1==2&&c.Cache["Message_Config"] != null)
        {
            return (Dictionary<string, msgConfig>)c.Cache["Message_Config"];
        }
        Dictionary<string, msgConfig> msg = new _MsgConfig().getMessageConfigDic();
        c.Cache.Add("Message_Config", msg, null, System.DateTime.UtcNow.AddDays(120), TimeSpan.Zero, System.Web.Caching.CacheItemPriority.Normal, null);
        return msg;
    }

    private string GetMsgID(HttpContext c, string source, string msgSign)
    {
        Dictionary<string, msgConfig> msg = GetMessageConfig(c);
        if (msg.ContainsKey(msgSign + "_" + source))
        {
            return msg[msgSign + "_" + source].msgId;
        }
        return msgSign;
    }
    
    /// <summary>
    /// 退款后发送模板消息
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string SendTempLateMsgForPC_Refund(HttpContext c)
    {
        string allPrice = string.IsNullOrEmpty(c.Request["allPrice"]) ? "" : c.Request["allPrice"];
        string orderNo = string.IsNullOrEmpty(c.Request["orderNo"]) ? "" : c.Request["orderNo"];
        int uid = string.IsNullOrEmpty(c.Request["uid"]) ? 0 : Convert.ToInt32(c.Request["uid"]);
        if (uid > 0 && allPrice.Length > 0)
        {
            user u = new _User().GetUser("", "", uid);
            if (u != null)
            {
                
            }
        }
        return Sys_Result.GetR(1, "");
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
        //替换MSGID
        string MsgId = "";
        MsgId = GetMsgID(c, source, t.template_id);
        t.template_id = MsgId;
        try
        {
            templateMsg tmp = new templateMsg
            {
                msgId = MsgId,
                msgBody = JsonMapper.ToJson(o),
                msgUrl = url,
                openId = openid,
                sendTime = DateTime.Now,
                msgContent = MsgContent,
                orderNo = _orderNo
            };
            new Main().AddToDb(tmp, "t_templateMsg");
        }
        catch { }
        
        new TMessage().Send_TemplateMsg(t, Get_Access_Token(c));
    }

    /// <summary>
    /// 获取全局Access_Token
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string Get_Access_Token(HttpContext c)
    {
        /*
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
        */

        string AccessRsa = "";
        string Access_Token = new _WxAccessToken().GetAccessToken();
        //WriteLog("--1--" + Access_Token + "--");
        if (Access_Token.Length > 0)
        {
            AccessRsa = Access_Token;
        }
        else
        {
            //WriteLog("--5--" + Access_Token + "--");
            Access_Token = new Common(appid, secret).Get_Access_Token();
            WxAccessToken wx = new WxAccessToken
            {
                access_token = Access_Token,
                addOn = DateTime.Now
            };
            new Main().AddToDb(wx, "wx_access_token");
            AccessRsa = Access_Token;
        }
        return AccessRsa;        
    }

    /// <summary>
    /// 获取全局Access_Token
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string Get_Access_Token_New(HttpContext c)
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
    /// 添加日志
    /// </summary>
    /// <param name="OrderNo"></param>
    /// <param name="Content"></param>
    /// <param name="uid"></param>
    /// <param name="cid"></param>
    /// <param name="aid"></param>
    public void AddLog(string OrderNo, string Content, int uid,string workNo,int lType)
    {
        log l = new log
        {
            addOn = DateTime.Now,
            uId = uid,
            lType = lType,
            workNo = workNo,
            content = Content,
            orderNo = OrderNo
        };
        new Main().AddToDb(l, "t_log");
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
        Double price = Price(OrderNo, uid);
        string srcNo = OrderNo;
        if (price > 0)
        {
            string body = "山西出行";
            if (OrderNo.IndexOf("|") > -1)
            {
                OrderNo = OrderNo.Split('|')[0];
            }
            //int userId = Convert.ToInt32(o.order.user_card_mobile);
            user u = new _User().GetUser("", "", uid);
            if (u == null)
            {
                return null;
            }
            if (openId.Length == 0)
            {
                openId = u.exOpenID;
            }
            if (openId.Length < 10)
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
                new Main().AddTestLog_B("[M]Pay-Return:", errMsg.ToString());
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
                    new Main().AddToDb(p, "t_wxPay");
                }
            }

            if (prepayID.Length > 0)
            {
                return new WxPay().Get_Config_Pay("prepay_id=" + prepayID, appid, keyValue);
            }
        }
        return wp;
    }


    /// <summary>
    /// 获取支付相关信息--字符串
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string GetPayInfoForRed(HttpContext c)
    {
        string OrderNo = DateTime.Now.ToString("yyyyMMddHHmmss") + "2012";
        int uid = 2012;
        string openId = "oKhuCwbmyP6uRzWbqw9o8zeHadUo";
        //OrderNo = OrderNo.Replace("|", "");
        WxPay.WxPayConfig wc = OperPayForRed(OrderNo, "", uid, openId);
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
    public WxPay.WxPayConfig OperPayForRed(string OrderNo, string prepayID, int uid, string openId)
    {
        WxPay.WxPayConfig wp = null;
        Double price = 1;
        string srcNo = OrderNo;
        if (price > 0)
        {
            string body = "山西出行";
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
                w.total_fee = 1;
                w.KeyValue = keyValue;
                w.trade_type = "JSAPI";
                w.attach = BasicTool.MD5(OrderNo + HjKeyValue).ToUpper();
                string errMsg = "";
                prepayID = new WxPay().Get_prepay_id(w, out errMsg);
                new Main().AddTestLog_B("[M]Pay-Return:", errMsg.ToString());
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
                    new Main().AddToDb(p, "t_wxPay");
                }
            }

            if (prepayID.Length > 0)
            {
                return new WxPay().Get_Config_Pay("prepay_id=" + prepayID, appid, keyValue);
            }
        }
        return wp;
    }

    /// <summary>
    /// 获取公众号菜单
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string GetMenu(HttpContext c)
    {
        string ACCESS_TOKEN = Get_Access_Token(c);
        string GetUrl = " https://api.weixin.qq.com/cgi-bin/get_current_selfmenu_info?access_token=" + ACCESS_TOKEN;
        return new Common(appid, secret).webRequest(GetUrl, "");
    }

    /// <summary>
    /// 获取导航
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string GetNav(HttpContext c)
    {
        List<source> ls = new _Source().GetSourceListForNav();
        var o = new { Return = 0, Msg = "", List = ls };
        return JsonMapper.ToJson(o);
    }


    /// <summary>
    /// 一起上大学活动
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string AddStudent(HttpContext c)
    {
        int uid = string.IsNullOrEmpty(c.Request["uid"]) ? 0 : Convert.ToInt32(c.Request["uid"]);
        int sType = string.IsNullOrEmpty(c.Request["sType"]) ? 0 : Convert.ToInt16(c.Request["sType"].ToString());
        string srcProvice = c.Request["srcProvice"] == null ? "" : c.Request["srcProvice"].ToString();
        string srcCity = c.Request["srcCity"] == null ? "" : c.Request["srcCity"].ToString();
        string toProvice = c.Request["toProvice"] == null ? "" : c.Request["toProvice"].ToString();
        string toCity = c.Request["toCity"] == null ? "" : c.Request["toCity"].ToString();
        string contact = c.Request["contact"] == null ? "" : c.Request["contact"].ToString();
        string mobile = c.Request["mobile"] == null ? "" : c.Request["mobile"].ToString();
        string colage = c.Request["colage"] == null ? "" : c.Request["colage"].ToString();
        string memo = c.Request["memo"] == null ? "" : c.Request["memo"].ToString();
        user user = new _User().GetUser("", "", uid);
        if (user != null)
        {
            int uNum = new _Student().GetStudentNum(uid,sType);
            if (uNum == 0)
            {
                Student sh = new Student
                {
                    uId = uid,
                    srcCity = srcCity,
                    srcProvice = srcProvice,
                    toCity = toCity,
                    toProvice = toProvice,
                    contact = contact,
                    mobile = mobile,
                    colage = colage,
                    nickName = user.nickName,
                    photoUrl = user.photoUrl,
                    addOn = DateTime.Now,
                    sType = sType,
                    memo = memo
                };
                if (new Main().AddToDb(sh, "t_active_student"))
                {
                    if (sType == 0)
                    {
                        return Sys_Result.GetR(0, "报名成功");    
                    }
                    else
                    {
                        return Sys_Result.GetR(0, "报名成功");    
                    }
                }
            }
            else 
            {
                return Sys_Result.GetR(1, "您已报过，不用重复报名");              
            }
        }
        return Sys_Result.GetR(1, "");
    }

    /// <summary>
    /// 获取上大学老乡列表
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string GetStudentList(HttpContext c)
    {
        string name = c.Request["name"] == null ? "" : c.Request["name"].ToString();
        string keyword = " and sType = 0 ";
        if (name.Length > 0)
        {
            name = c.Server.UrlDecode(name);
            keyword = " and srcCity = '" + name + "'";
        }
        List<Student> la = new _Student().GetStudentList(keyword);
        if (la != null && la.Count > 0)
        {
            var o = new { Return = 0, Msg = "", List = la };
            return JsonMapper.ToJson(o);
        }
        return Sys_Result.GetR(1, "");
    }

    /// <summary>
    /// 获取用户是否已兑奖
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string GetGift(HttpContext c)
    {
        int uid = string.IsNullOrEmpty(c.Request["uid"]) ? 0 : Convert.ToInt32(c.Request["uid"]);
        string streamNo = c.Request["streamNo"] == null ? "" : c.Request["streamNo"].ToString();
        user u = new _User().GetUser("", "", uid);
        if (uid > 0 && u != null)
        {
            Gift gift = new _Gift().GetGift(uid, streamNo);
            if (gift != null)
            {
                var o = new { Return = 0, Msg = "", Info = gift };
                return JsonMapper.ToJson(o);
            }
            
        }
        return Sys_Result.GetR(1, "未找到符合条件的兑换券");
    }


    /// <summary>
    /// 添加礼品
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string AddGift(HttpContext c)
    {
        int uid = string.IsNullOrEmpty(c.Request["uid"]) ? 0 : Convert.ToInt32(c.Request["uid"]);
        int giftType = string.IsNullOrEmpty(c.Request["giftType"]) ? 2 : Convert.ToInt16(c.Request["giftType"]);
        string streamNo = c.Request["streamNo"] == null ? "" : c.Request["streamNo"].ToString();
        user u = new _User().GetUser("", "", uid);
        if (uid > 0 && u != null)
        {
            int giftNum = new _Gift().IsExsit(uid, giftType);
            if (giftNum == 0)
            {
                Gift gt = new Gift
                {
                    addOn = DateTime.Now,
                    uId = uid,
                    giftType = giftType,
                    giftName = "宇文山庄门票",
                    streamNo = streamNo
                };
                new Main().AddToDb(gt, "t_active_gift");
                return Sys_Result.GetR(0, "");
            }
        }
        return Sys_Result.GetR(1, "");
    }

    /// <summary>
    /// 核销礼券
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string HxGift(HttpContext c)
    {
        int uid = string.IsNullOrEmpty(c.Request["uid"]) ? 0 : Convert.ToInt32(c.Request["uid"]);
        string streamNo = c.Request["streamNo"] == null ? "" : c.Request["streamNo"].ToString();
        user u = new _User().GetUser("", "", uid);
        if (uid > 0 && u != null)
        {
            var o = new
            {
                state = 1,
                useOn = DateTime.Now
            };
            new Main().UpdateDb(o, "t_active_gift", " uid=" + uid + " and streamNo = '" + streamNo + "'");
            return Sys_Result.GetR(0, "核销完成");
        }
        return Sys_Result.GetR(1, "核销失败，请稍后再试");
    }
    
    /// <summary>
    /// 获取用户是否参与活动情况
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string GetGiftInfo(HttpContext c)
    {
        int uid = string.IsNullOrEmpty(c.Request["uid"]) ? 0 : Convert.ToInt32(c.Request["uid"]);
        user u = new _User().GetUser("", "", uid);
        if (uid > 0 && u != null)
        {
            int isGift = new _Gift().IsExsit(uid, 1);
            if (isGift == 0)
            {
                string FilePath = c.Server.MapPath("/pic/QrCode/" + uid + ".jpg");
                if (!System.IO.File.Exists(FilePath))
                {
                    string access_token = Get_Access_Token(c);
                    int SceneID = uid;
                    string Result = new Common(appid, secret).GetQR_Code(access_token, FilePath, SceneID);
                }
                string Path = CreateHBForGift(c);
                return Sys_Result.GetR(0, Path);           
            }
        }
        return Sys_Result.GetR(1, "");
    }
    
    /// <summary>
    /// 发送菜单
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string InitMenu(HttpContext c)
    {
        string errmsg = "";
        {
            string paras = "";
            List<source> ls = new _Source().GetSourceList();
            foreach (source source in ls)
            {
                if (source.appid.Length == 0 || source.isVoucher > 90)
                {
                    continue;
                }
                paras = source.sCode + "0" + source.appid;
                StringBuilder sb = new StringBuilder();
                sb.Append("{");
                sb.Append("    \"button\": [");
                sb.Append("                {");
                sb.Append("                    \"type\": \"view\", ");
                sb.Append("                    \"name\": \"出行预订\", ");
                sb.Append("                    \"url\": \"https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + source.appid + "&redirect_uri=http%3a%2f%2fhjhk.edmp.cc%2fc_home.html&response_type=code&scope=snsapi_userinfo&state=" + source.sCode + source.appid + "#wechat_redirect\"");
                sb.Append("                },");         
                /*
                sb.Append("        {");
                sb.Append("           \"name\": \"出行预订\", ");
                sb.Append("            \"sub_button\": [");
                sb.Append("                 {");
                sb.Append("                     \"type\": \"view\", ");
                sb.Append("                      \"name\": \"飞机票\", ");
                sb.Append("                      \"url\": \"https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + source.appid + "&redirect_uri=http%3a%2f%2fhjhk.edmp.cc%2fc_index_home.html&response_type=code&scope=snsapi_userinfo&state=" + source.sCode + "1" + source.appid + "#wechat_redirect\"");
                sb.Append("                  }, ");
                sb.Append("                 {");
                sb.Append("                     \"type\": \"view\", ");
                sb.Append("                      \"name\": \"火车票\", ");
                sb.Append("                      \"url\": \"https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + source.appid + "&redirect_uri=http%3a%2f%2fhjhk.edmp.cc%2fc_index_home.html&response_type=code&scope=snsapi_userinfo&state=" + paras + "#wechat_redirect\"");
                sb.Append("                  }, ");                
                sb.Append("                 {");
                sb.Append("                     \"type\": \"view\", ");
                sb.Append("                      \"name\": \"国际机票\", ");
                sb.Append("                      \"url\": \"https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + source.appid + "&redirect_uri=http%3a%2f%2fhjhk.edmp.cc%2fc_index_gj.html&response_type=code&scope=snsapi_userinfo&state=" + paras + "#wechat_redirect\"");
                sb.Append("                  },");
                sb.Append("                 {");
                sb.Append("                     \"type\": \"view\", ");
                sb.Append("                      \"name\": \"酒店预订\", ");
                //sb.Append("                      \"url\": \"http://m.ctrip.com/html5/hotel/?allianceid=409660&sid=900826&ouid=H5B2Bonline&sourceid=2055&Popup=close&autoawaken=close&from=http%3A%2F%2Fm.ctrip.com%2Fwebapp%2Fmkt%2Fb2b-online%2Flink_record\"");
                sb.Append("                      \"url\": \"https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + source.appid + "&redirect_uri=http%3a%2f%2fhjhk.edmp.cc%2fapp%2fhotel%2findex.aspx&response_type=code&scope=snsapi_userinfo&state=" + source.sCode + "1" + source.appid + "#wechat_redirect\"");
                sb.Append("                  },");
                
                sb.Append("                 {");
                sb.Append("                     \"type\": \"view\", ");
                sb.Append("                      \"name\": \"动车高铁\", ");
                sb.Append("                      \"url\": \"http://kuai.nuomi.com/webapp/train/index.html?us=tr_wise_tit&ala_adapt=iphone&from=singlemessage&isappinstalled=1\"");
                sb.Append("                  },");                
                 
                sb.Append("                 {");
                sb.Append("                     \"type\": \"view\", ");
                sb.Append("                      \"name\": \"滴滴打车\", ");
                sb.Append("                      \"url\": \"http://common.diditaxi.com.cn/general/webEntry?wx=true&bizid=257&channel=70365&code=011lr4fi1INYEy0Lvoei1oM2fi1lr4fV&state=123\"");
                sb.Append("                  }");
                

                sb.Append("                 {");
                sb.Append("                     \"type\": \"view\", ");
                sb.Append("                      \"name\": \"出行导航\", ");
                sb.Append("                      \"url\": \"https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + source.appid + "&redirect_uri=http%3a%2f%2fhjhk.edmp.cc%2fc_nav.html&response_type=code&scope=snsapi_userinfo&state=" + paras + "#wechat_redirect\"");
                sb.Append("                  }");
                sb.Append("            ]");
                sb.Append("        },");
                 */ 
                if (source.sCode == "0001")
                {
                    sb.Append("                {");
                    sb.Append("                    \"type\": \"view\", ");
                    sb.Append("                    \"name\": \"旅游资讯\", ");
                    sb.Append("                    \"url\": \"http://hjhk.edmp.cc/travel/c_travel_city.html?name=%u5C71%u897F&id=36\"");
                    sb.Append("                },");

                    sb.Append("        {");
                    sb.Append("           \"name\": \"会员专享\", ");
                    sb.Append("            \"sub_button\": [");
                    sb.Append("                {");
                    sb.Append("                    \"type\": \"view\", ");
                    sb.Append("                    \"name\": \"个人中心\", ");
                    sb.Append("                    \"url\": \"https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + source.appid + "&redirect_uri=http%3a%2f%2fhjhk.edmp.cc%2fc_uc.html&response_type=code&scope=snsapi_userinfo&state=" + paras + "#wechat_redirect\"");
                    sb.Append("                },");
                    /*
                    sb.Append("                {");
                    sb.Append("                    \"type\": \"click\", ");
                    sb.Append("                    \"name\": \"工银联名卡\", ");
                    sb.Append("                    \"key\": \"SXCX_GYLMK\"");
                    sb.Append("                },");
                    */
                    sb.Append("                {");
                    sb.Append("                    \"type\": \"view\", ");
                    sb.Append("                    \"name\": \"工银联名卡\", ");
                    sb.Append("                    \"url\": \"http://mp.weixin.qq.com/s/TqjPXw9kGeteUkLqpogQXA\"");
                    sb.Append("                },");                    
                    sb.Append("                 {");
                    sb.Append("                     \"type\": \"view\", ");
                    sb.Append("                      \"name\": \"差旅管家\", ");
                    sb.Append("                      \"url\": \"http://mp.weixin.qq.com/s/ZPU2KyX62TbNZmXa1Zv-pQ\"");
                    sb.Append("                  },");
                    sb.Append("                 {");
                    sb.Append("                     \"type\": \"view\", ");
                    sb.Append("                      \"name\": \"低价提醒\", ");
                    sb.Append("                      \"url\": \"https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + source.appid + "&redirect_uri=http%3a%2f%2fhjhk.edmp.cc%2fc_set_list.html&response_type=code&scope=snsapi_userinfo&state=" + paras + "#wechat_redirect\"");
                    sb.Append("                  },");                    
                    sb.Append("                 {");
                    sb.Append("                     \"type\": \"view\", ");
                    sb.Append("                      \"name\": \"投诉建议\", ");
                    sb.Append("                      \"url\": \"http://182.92.79.96:801/yj.asp\"");
                    sb.Append("                  }");                 
                    sb.Append("            ]");
                    sb.Append("        }");
                    sb.Append("    ]");
                    sb.Append("}");
                }
                else
                {
                    if (source.isVoucher == 0)
                    {
                        /*
                        sb.Append("                {");
                        sb.Append("                    \"type\": \"view\", ");
                        sb.Append("                    \"name\": \"太马投票\", ");
                        sb.Append("                    \"url\": \"https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx9d23334360aa6af4&redirect_uri=http%3a%2f%2fhjhk.edmp.cc%2factive%2fvote%2fvote.html&response_type=code&scope=snsapi_base&state=00001wx9d23334360aa6af4#wechat_redirect\"");
                        sb.Append("                },");
                        */
                        sb.Append("                {");
                        sb.Append("                    \"type\": \"view\", ");
                        sb.Append("                    \"name\": \"旅游资讯\", ");
                        sb.Append("                    \"url\": \"http://hjhk.edmp.cc/travel/c_travel_city.html?name=%u5C71%u897F&id=36\"");
                        sb.Append("                },");
                        /*
                        
                        sb.Append("        {");
                        sb.Append("           \"name\": \"爱心送考\", ");
                        sb.Append("            \"sub_button\": [");
                        sb.Append("                {");
                        sb.Append("                    \"type\": \"view\", ");
                        sb.Append("                    \"name\": \"领取移动流量包\", ");
                        sb.Append("                    \"url\": \"http://wap.sx.10086.cn/m/hellouniv.html\"");
                        sb.Append("                },");
                        sb.Append("                {");
                        sb.Append("                    \"type\": \"view\", ");
                        sb.Append("                    \"name\": \"更多礼包\", ");
                        sb.Append("                    \"url\": \"https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + source.appid + "&redirect_uri=http%3a%2f%2fhjhk.edmp.cc%2factive%2fstudent%2fc_gift_other.html&response_type=code&scope=snsapi_userinfo&state=" + source.sCode + "0" + source.appid + "#wechat_redirect\"");
                        sb.Append("                },");
                        sb.Append("                {");
                        sb.Append("                    \"type\": \"view\", ");
                        sb.Append("                    \"name\": \"立即报名\", ");
                        sb.Append("                    \"url\": \"https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + source.appid + "&redirect_uri=http%3a%2f%2fhjhk.edmp.cc%2factive%2fstudent%2fc_index.html&response_type=code&scope=snsapi_userinfo&state=" + source.sCode + "1" + source.appid + "#wechat_redirect\"");
                        sb.Append("                },");
                        sb.Append("                {");
                        sb.Append("                    \"type\": \"view\", ");
                        sb.Append("                    \"name\": \"组团上大学\", ");
                        sb.Append("                    \"url\": \"https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + source.appid + "&redirect_uri=http%3a%2f%2fhjhk.edmp.cc%2factive%2fstudent%2fc_pm_all.html&response_type=code&scope=snsapi_userinfo&state=" + source.sCode + "1" + source.appid + "#wechat_redirect\"");
                        sb.Append("                }");                                                                                 
                        sb.Append("            ]");
                        sb.Append("        },"); 
                        */

                        /*
                        sb.Append("                {");
                        sb.Append("                    \"type\": \"view\", ");
                        sb.Append("                    \"name\": \"MY飞行图\", ");
                        sb.Append("                    \"url\": \"https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + source.appid + "&redirect_uri=http%3a%2f%2fhjhk.edmp.cc%2factive%2fa_start.html&response_type=code&scope=snsapi_userinfo&state=" + paras + "#wechat_redirect\"");
                        sb.Append("                },");
                        
                        sb.Append("        {");
                        sb.Append("           \"name\": \"活动专区\", ");
                        sb.Append("            \"sub_button\": [");
                        
                        sb.Append("                {");
                        sb.Append("                    \"type\": \"view\", ");
                        sb.Append("                    \"name\": \"三八女神节\", ");
                        sb.Append("                    \"url\": \"http://hjhk.edmp.cc/active/38/a_fund.html\"");
                        sb.Append("                },");     
                         
                        sb.Append("                {");
                        sb.Append("                    \"type\": \"view\", ");
                        sb.Append("                    \"name\": \"我的飞行图\", ");
                        sb.Append("                    \"url\": \"https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + source.appid + "&redirect_uri=http%3a%2f%2fhjhk.edmp.cc%2factive%2fa_start.html&response_type=code&scope=snsapi_userinfo&state=" + paras + "#wechat_redirect\"");
                        sb.Append("                },");
                        /*
                        sb.Append("                {");
                        sb.Append("                    \"type\": \"view\", ");
                        sb.Append("                    \"name\": \"人气分享榜\", ");
                        sb.Append("                    \"url\": \"http://hjhk.edmp.cc/active/a_pm.html\"");
                        sb.Append("                },");
                        
                        sb.Append("                {");
                        sb.Append("                    \"type\": \"view\", ");
                        sb.Append("                    \"name\": \"旅游资讯\", ");
                        sb.Append("                    \"url\": \"http://hjhk.edmp.cc/travel/c_travel_city.html?name=%u5C71%u897F&id=36\"");
                        sb.Append("                },");
                        sb.Append("                {");
                        sb.Append("                    \"type\": \"view\", ");
                        sb.Append("                    \"name\": \"快速办卡\", ");
                        sb.Append("                    \"url\": \"https://wm.cib.com.cn/application/cardapp/cappl/ApplyCard/toSelectCard?id=9d6bff4c16ef4525b7d6555caec4c8ca\"");
                        sb.Append("                }");                        
                        sb.Append("            ]");
                        sb.Append("        },");                        
                        */
                    }
                    else
                    {
                        
                        sb.Append("                {");
                        sb.Append("                    \"type\": \"view\", ");
                        sb.Append("                    \"name\": \"旅游资讯\", ");
                        sb.Append("                    \"url\": \"http://hjhk.edmp.cc/travel/c_travel_city.html?name=%u5C71%u897F&id=36\"");
                        sb.Append("                },");
                         
                    }
                    sb.Append("        {");
                    sb.Append("           \"name\": \"服务中心\", ");
                    sb.Append("            \"sub_button\": [");
                    sb.Append("                {");
                    sb.Append("                    \"type\": \"view\", ");
                    sb.Append("                    \"name\": \"个人中心\", ");
                    sb.Append("                    \"url\": \"https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + source.appid + "&redirect_uri=http%3a%2f%2fhjhk.edmp.cc%2fc_uc.html&response_type=code&scope=snsapi_userinfo&state=" + paras + "#wechat_redirect\"");
                    sb.Append("                },");
                    if (source.isVoucher == 0)
                    {
                        /*
                        sb.Append("                {");
                        sb.Append("                    \"type\": \"view\", ");
                        sb.Append("                    \"name\": \"积分兑换\", ");
                        sb.Append("                    \"url\": \"http://mp.weixin.qq.com/s/qKzs-63sZ-uuZcX8-HyMeg\"");
                        sb.Append("                },");
                        */
                        sb.Append("                {");
                        sb.Append("                    \"type\": \"view\", ");
                        sb.Append("                    \"name\": \"快速办卡\", ");
                        sb.Append("                    \"url\": \"https://wm.cib.com.cn/application/cardapp/cappl/ApplyCard/toSelectCard?id=9d6bff4c16ef4525b7d6555caec4c8ca\"");
                        sb.Append("                },");   
                    }
                    /*
                    sb.Append("                 {");
                    sb.Append("                     \"type\": \"view\", ");
                    sb.Append("                      \"name\": \"我的订单\", ");
                    sb.Append("                      \"url\": \"https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + source.appid + "&redirect_uri=http%3a%2f%2fhjhk.edmp.cc%2fc_list.html&response_type=code&scope=snsapi_userinfo&state=" + paras + "#wechat_redirect\"");
                    sb.Append("                  },");
                    */ 
                    sb.Append("                 {");
                    sb.Append("                     \"type\": \"view\", ");
                    sb.Append("                      \"name\": \"低价提醒\", ");
                    sb.Append("                      \"url\": \"https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + source.appid + "&redirect_uri=http%3a%2f%2fhjhk.edmp.cc%2fc_set_list.html&response_type=code&scope=snsapi_userinfo&state=" + paras + "#wechat_redirect\"");
                    sb.Append("                  },");
                    if (source.isVoucher == 0)
                    {
                        sb.Append("                 {");
                        sb.Append("                    \"type\": \"view\", ");
                        sb.Append("                    \"name\": \"爱心送考\", ");
                        sb.Append("                    \"url\": \"https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + source.appid + "&redirect_uri=http%3a%2f%2fhjhk.edmp.cc%2factive%2fstudent%2fc_home.html&response_type=code&scope=snsapi_userinfo&state=" + source.sCode + "0" + source.appid + "#wechat_redirect\"");
                        sb.Append("                 },");                                            
                    }
                    sb.Append("                 {");
                    sb.Append("                     \"type\": \"view\", ");
                    sb.Append("                      \"name\": \"关于我们\", ");
                    sb.Append("                      \"url\": \"http://mp.weixin.qq.com/s/YYPIMEHpp8iU0JVCUoUqoQ\"");
                    sb.Append("                  }");                       
                    sb.Append("            ]");
                    sb.Append("        }");
                    sb.Append("    ]");
                    sb.Append("}");
                }
                
                appid = source.appid;
                secret = source.secret;
                string ACCESS_TOKEN = Get_Access_Token_New(c);
                string GetUrl = " https://api.weixin.qq.com/cgi-bin/menu/create?access_token=" + ACCESS_TOKEN;
                string JsonStr = new Common(appid, secret).webRequest(GetUrl, sb.ToString());
                JsonData jd = JsonMapper.ToObject(JsonStr);
                if (jd["errcode"].ToString() == "0")
                {
                    
                }
                else
                {
                    try
                    {
                        errmsg += source.sCode + "[" + jd["errcode"].ToString() + "]" + jd["errmsg"].ToString() + "<br/>";
                    }
                    catch { 
                    
                    }
                }
            }
            if (errmsg.Length == 0)
            {
                return "{Return:0,Msg:'OK'}";    
            }
        }
        return "{Return:1,Msg:'" + errmsg + "'}";
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
            //new Main().AddTestLog("Urls", Urls);
            string jsApi_ticket = "";
            string Access_Token = "";
            if (isFail || c.Cache["Para_JsApiTicket"] == null || c.Cache["Para_JsApiTicket"].ToString().Length == 0)
            {
                Access_Token = Get_Access_Token(c);
                //获取网页调用临时票据
                string r = "";
                jsApi_ticket = new Common(appid, secret).Get_jsapi_ticket(Access_Token, out r);
                //new Main().AddTestLog("r", r);
                //new Main().AddTestLog("jsApi_ticket", jsApi_ticket);
                c.Cache.Add("Para_JsApiTicket", jsApi_ticket, null, System.DateTime.UtcNow.AddMinutes(100), TimeSpan.Zero, System.Web.Caching.CacheItemPriority.Normal, null);
            }
            else
            {
                jsApi_ticket = c.Cache["Para_JsApiTicket"].ToString();
            }


            string TempS = "";
            //new Main().AddTestLog("isFail-Urls", isFail.ToString() + Urls);
            Common.WxConfig w = Common.Get_Config_(Urls, jsApi_ticket, out TempS);
            //new Main().AddTestLog("TempS", TempS);
            return w;
        }
        catch
        {
            return null;
        }


    }

    /// <summary>
    /// 添加参数日志
    /// </summary>
    /// <param name="c"></param>
    public void AddQueryLog(HttpContext c)
    {
        int F = string.IsNullOrEmpty(c.Request["fn"]) ? 0 : Convert.ToInt16(c.Request["fn"]);
        new Main().AddTestLog_B("[M]F", F.ToString());
        string Query = "";
        foreach (string p in c.Request.Params.AllKeys)
        {
            Query += p + ":" + c.Request[p].ToString() + "&";
            if (p.IndexOf("ALL_HTTP") != -1)
            {
                break;
            }
        }
        new Main().AddTestLog_B("[M]Query-"+F.ToString(), Query.ToString());
    }
    
    public bool IsReusable {
        get {
            return false;
        }
    }

}