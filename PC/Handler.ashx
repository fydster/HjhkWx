<%@ WebHandler Language="C#" Class="Handler" %>

using System;
using System.Web;
using Model;
using Model.active;
using Data;
using Data.active;
using Data.Tmessage;
using LitJson;
using System.Collections.Generic;
using com.seascape.tools;
using Seascape.WxApi;

public class Handler : IHttpHandler {
    public static string appid = com.seascape.tools.BasicTool.GetConfigPara("appid-0000");
    public static string secret = com.seascape.tools.BasicTool.GetConfigPara("secret-0000");
    public static string keyValue = com.seascape.tools.BasicTool.GetConfigPara("keyValue");

    //分页大小
    public static int perPage = 15;
    public static adminUser admin = null;
    public static string BaseUrl = "http://hjhk.edmp.cc/";
    
    public void ProcessRequest (HttpContext c) {
        int F = string.IsNullOrEmpty(c.Request["fn"]) ? 0 : Convert.ToInt16(c.Request["fn"]);
        AddQueryLog(c);
        c.Response.ContentType = "text/plain";
        if (F != 0 && F != 19 && F != 40 && F != 888)
        {
            if (LoginCheck(c))
            {
                string submitCheck = string.IsNullOrEmpty(c.Request["submitCheck"]) ? "" : c.Request["submitCheck"].ToString();
                if (submitCheck.Length == 0 || submitCheck.Length > 3)
                {
                    c.Response.Write(GetResult(F, c));
                }
                else
                {
                    new Main().AddTestLog("[A]Result" + F, "重复提交");
                    c.Response.Write(Sys_Result.GetR(1, "System Exception[" + F + "]"));
                }
            }
            else
            {
                c.Response.Write(Sys_Result.GetR(100, "登陆状态失效，请重新登录后再试"));
            }
        }
        else
        {
            c.Response.Write(GetResult(F, c));
        }
    }

    /// <summary>
    /// 登陆验证
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public bool LoginCheck(HttpContext c)
    {
        string mobile = string.IsNullOrEmpty(c.Request["mobile_cookie"]) ? "" : c.Request["mobile_cookie"].ToString();
        mobile = mobile.Replace(",", "");
        if (c.Cache["Admin_Info" + mobile] != null)
        {
            admin = (adminUser)c.Cache["Admin_Info" + mobile];
            c.Cache.Add("Admin_Info" + mobile, admin, null, System.DateTime.UtcNow.AddMinutes(600), TimeSpan.Zero, System.Web.Caching.CacheItemPriority.Normal, null);
            return true;
        }
        return false;
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
                case 0:
                    Result = Login(c);//登陆
                    break;
                case 1:
                    Result = GetRoleList(c);//获取角色列表
                    break;
                case 2:
                    Result = GetAdminUserList(c);//获取账户列表
                    break;
                case 3:
                    Result = DelAdmin(c);//删除停用账户
                    break;
                case 4:
                    Result = GetUserList(c);//获取用户列表
                    break;
                case 5:
                    Result = GetLimitList(c);//获取权限列表
                    break;
                case 6:
                    Result = Role(c);//添加修改角色
                    break;
                case 7:
                    Result = DelRole(c);//删除角色
                    break;
                case 8:
                    Result = User(c);//添加修改用户
                    break;
                case 9:
                    Result = tClass(c);//添加修改分类
                    break;
                case 10:
                    Result = GetClassList(c);//获取分类列表
                    break;
                case 11:
                    Result = DelClass(c);//删除分类
                    break;
                case 12:
                    Result = GetClassListForCID(c);//按大类获取分类列表
                    break;
                case 13:
                    Result = ContentS(c);//添加修改内容
                    break;
                case 14:
                    Result = DelContent(c);//删除内容
                    break;
                case 15:
                    Result = CheckContent(c);//审核内容
                    break;
                case 16:
                    Result = GetContent(c);//获取内容详情
                    break;
                case 18:
                    Result = GetLimit(c);//获取菜单权限
                    break;
                case 19:
                    Result = LoginOut(c);//退出系统
                    break;
                case 20:
                    Result = GetContentList(c);//获取内容列表
                    break;
                case 21:
                    Result = HotContent(c);//内容置顶操作
                    break;
                case 22:
                    Result = updateGroup(c);//修改用户分组
                    break;
                case 23:
                    Result = userBind(c);//平台用户绑定和解绑
                    break;
                case 26:
                    Result = GetSysLogList(c);//获取系统日志列表
                    break;
                case 33:
                    Result = GetUserInfo(c);//获取用户详情
                    break;
                case 49:
                    Result = GetUserInfoForTel(c);//获取用户详情，通过手机号码
                    break;
                case 90:
                    Result = UpdatePass(c);//修改密码
                    break;
                case 91:
                    Result = GetVoteList(c);//获取投票用户列表
                    break;
                case 92:
                    Result = GetVoteMx(c);//获取用户投票明细
                    break;
                case 93:
                    Result = GetVotePm(c);//获取用户投票排名
                    break;
                case 888:
                    Result = SendVoteMsg(c);//发送消息
                    break;
            }
        }
        catch(Exception e)
        {
            Result = e.Message.ToString();
        }
        new Main().AddTestLog("[A]Result"+f, Result);
        return Result;
    }

   
    /// <summary>
    /// 用户登陆
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string Login(HttpContext c)
    {
        string uName = string.IsNullOrEmpty(c.Request["uName"]) ? "" : c.Request["uName"].ToString();
        string uPass = string.IsNullOrEmpty(c.Request["uPass"]) ? "" : c.Request["uPass"].ToString();
        if (uName.Length > 0 && uPass.Length > 0)
        {
            adminUser ad = new _AdminUser().checkUser(uName, BasicTool.MD5(uPass));
            if (ad != null)
            {
                admin = ad;
                c.Cache.Remove("Admin_Info" + uName);
                c.Cache.Add("Admin_Info" + uName, ad, null, System.DateTime.UtcNow.AddMinutes(600), TimeSpan.Zero, System.Web.Caching.CacheItemPriority.Normal, null);
                AddAdminLog("", "登录系统");
                var o = new
                {
                    Return = 0,
                    Msg = "",
                    Info = ad
                };
                return JsonMapper.ToJson(o);
            }
        }
        return Sys_Result.GetR(1, "登陆失败");
    }
        
    /// <summary>
    /// 修改密码
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string UpdatePass(HttpContext c)
    {
        string oldpass = string.IsNullOrEmpty(c.Request["oldpass"]) ? "" : c.Request["oldpass"].ToString();
        string newpass = string.IsNullOrEmpty(c.Request["newpass"]) ? "" : c.Request["newpass"].ToString();
        string upPass = "修改失败";
        if (oldpass.Length > 0 && newpass.Length > 5)
        {
            upPass = new _AdminUser().UpdatePass(admin.uName, oldpass, newpass);
            if (upPass == "OK")
            {
                AddAdminLog("", "修改密码");
                return Sys_Result.GetR(0, "修改完成");
            }
        }
        return Sys_Result.GetR(1, upPass);
    }
    
    /// <summary>
    /// 退出系统
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string LoginOut(HttpContext c)
    {
        string uName = string.IsNullOrEmpty(c.Request["uName"]) ? "" : c.Request["uName"].ToString();
        if (uName.Length == 11)
        {
            AddAdminLog("", "退出系统");
            c.Cache.Remove("Admin_Info" + uName);
            return Sys_Result.GetR(0, "");
        }
        return Sys_Result.GetR(1, "");
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
    /// 获取菜单权限
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string GetLimit(HttpContext c)
    {
        if (admin != null)
        {
            string limit = admin.limits;
            List<adminLimit> la = new _AdminLimit().getLimit(limit);
            if (la != null && la.Count > 0)
            {
                var o = new { Return = 0, Msg = "", List = la };
                return JsonMapper.ToJson(o);
            }
        }
        return Sys_Result.GetR(1, "");
    }

    /// <summary>
    /// 获取权限列表
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string GetLimitList(HttpContext c)
    {
        List<adminLimit> la = new _AdminLimit().getLimit("*");
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
        int cType = string.IsNullOrEmpty(c.Request["cType"]) ? 0 : Convert.ToInt16(c.Request["cType"]);
        List<tClass> la = new _Class().GetClassList(cType);
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
    public string GetClassListForCID(HttpContext c)
    {
        int cType = string.IsNullOrEmpty(c.Request["cType"]) ? 0 : Convert.ToInt16(c.Request["cType"]);
        int cId = string.IsNullOrEmpty(c.Request["cId"]) ? 0 : Convert.ToInt16(c.Request["cId"]);
        List<tClass> la = new _Class().GetClassListForCID(cType, cId);
        if (la != null && la.Count > 0)
        {
            var o = new { Return = 0, Msg = "", List = la };
            return JsonMapper.ToJson(o);
        }
        return Sys_Result.GetR(1, "");
    }

    
    /// <summary>
    /// 获取用户详情
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string GetUserInfo(HttpContext c)
    {
        int uid = string.IsNullOrEmpty(c.Request["uid"]) ? -1 : Convert.ToInt16(c.Request["uid"]);
        if (uid > 0)
        {
            user u = new _User().GetUser("", "", uid);
            if (u != null)
            {
                var o = new { Return = 0, Msg = "", Info = u };
                return JsonMapper.ToJson(o);
            }
        }
        return Sys_Result.GetR(1, "");
    }


    /// <summary>
    /// 获取角色列表
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string GetRoleList(HttpContext c)
    {
        List<roleInfo> lo = new _AdminRole().GetRoleList();
        if (lo != null && lo.Count > 0)
        {
            var o = new { Return = 0, Msg = "", List = lo };
            return JsonMapper.ToJson(o);
        }
        return Sys_Result.GetR(1, "");
    }

    /// <summary>
    /// 删除角色
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string DelRole(HttpContext c)
    {
        int id = string.IsNullOrEmpty(c.Request["id"]) ? 0 : Convert.ToInt16(c.Request["id"]);
        string Name = string.IsNullOrEmpty(c.Request["Name"]) ? "" : c.Request["Name"].ToString();
        Name = c.Server.UrlDecode(Name);
        if (id > 0)
        {
            if (new Main().DelDb("t_admin_role", "id=" + id))
            {
                return Sys_Result.GetR(0, "操作完成");
            }
        }
        return Sys_Result.GetR(1, "");
    }
    

    /// <summary>
    /// 添加修改角色
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string Role(HttpContext c)
    {
        int id = string.IsNullOrEmpty(c.Request["id"]) ? 0 : Convert.ToInt16(c.Request["id"]);
        string roleName = string.IsNullOrEmpty(c.Request["roleName"]) ? "" : c.Request["roleName"].ToString();
        string limits = string.IsNullOrEmpty(c.Request["limits"]) ? "" : c.Request["limits"].ToString();
        roleName = c.Server.UrlDecode(roleName);
        if (id == 0)
        {
            if (new _AdminRole().CheckRole(roleName) == 0)
            {
                adminRole p = new adminRole
                {
                    roleName = roleName,
                    limits = limits
                };
                if (new Main().AddToDb(p, "t_admin_role"))
                {
                    AddAdminLog("", "添加角色," + roleName);
                    return Sys_Result.GetR(0, "添加完成");
                }
            }
            else
            {
                return Sys_Result.GetR(1, "该角色名称已存在，不能重复添加");
            }
        }
        else
        {
            if (new _AdminRole().CheckRole(roleName) == 0 || new _AdminRole().CheckRole(roleName) == id)
            {
                var o = new
                {
                    roleName = roleName,
                    limits = limits
                };
                if (new Main().UpdateDb(o, "t_admin_role", "id=" + id))
                {
                    AddAdminLog("", "修改角色" + roleName);
                    return Sys_Result.GetR(0, "修改完成");
                }
            }
            else
            {
                return Sys_Result.GetR(1, "该角色已存在，不能重复");
            }
        }
        return Sys_Result.GetR(1, "添加失败");
    }

    /// <summary>
    /// 添加修改分类
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string tClass(HttpContext c)
    {
        int id = string.IsNullOrEmpty(c.Request["id"]) ? 0 : Convert.ToInt16(c.Request["id"]);
        int pId = string.IsNullOrEmpty(c.Request["pId"]) ? 0 : Convert.ToInt16(c.Request["pId"]);
        int isShow = string.IsNullOrEmpty(c.Request["isShow"]) ? 0 : Convert.ToInt16(c.Request["isShow"]);
        int sType = string.IsNullOrEmpty(c.Request["sType"]) ? 0 : Convert.ToInt16(c.Request["sType"]);
        int cType = string.IsNullOrEmpty(c.Request["cType"]) ? 0 : Convert.ToInt16(c.Request["cType"]);
        string Name = string.IsNullOrEmpty(c.Request["Name"]) ? "" : c.Request["Name"].ToString();
        string LogoUrl = string.IsNullOrEmpty(c.Request["LogoUrl"]) ? "" : c.Request["LogoUrl"].ToString();
        Name = c.Server.UrlDecode(Name);
        if (id == 0)
        {
            if (new _Class().CheckClass(Name, cType,pId) == 0)
            {
                tClass p = new tClass
                {
                    name = Name,
                    logoUrl = LogoUrl,
                    cType = cType,
                    pId = pId,
                    isShow = isShow,
                    sType = sType
                };
                if (new Main().AddToDb(p, "t_class"))
                {
                    AddAdminLog("", "添加分类," + Name);
                    return Sys_Result.GetR(0, "添加完成");
                }
            }
            else
            {
                return Sys_Result.GetR(1, "该分类名称已存在，不能重复添加");
            }
        }
        else
        {
            if (new _Class().CheckClass(Name, cType, pId) == 0 || new _Class().CheckClass(Name, cType, pId) == id)
            {
                var o = new
                {
                    name = Name,
                    logoUrl = LogoUrl,
                    cType = cType,
                    pId = pId,
                    isShow = isShow,
                    sType = sType
                };
                if (new Main().UpdateDb(o, "t_class", "id=" + id))
                {
                    AddAdminLog("", "修改分类" + Name);
                    return Sys_Result.GetR(0, "修改完成");
                }
            }
            else
            {
                return Sys_Result.GetR(1, "该分类已存在，不能重复");
            }
        }
        return Sys_Result.GetR(1, "添加失败");
    }


    /// <summary>
    /// 删除分类
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string DelClass(HttpContext c)
    {
        int id = string.IsNullOrEmpty(c.Request["id"]) ? 0 : Convert.ToInt16(c.Request["id"]);
        int enable = string.IsNullOrEmpty(c.Request["enable"]) ? 1 : Convert.ToInt16(c.Request["enable"]);
        string Name = string.IsNullOrEmpty(c.Request["Name"]) ? "" : c.Request["Name"].ToString();
        Name = c.Server.UrlDecode(Name);
        if (id > 0)
        {
            var o = new
            {
                Enable = enable
            };
            if (new Main().UpdateDb(o, "t_class", "id=" + id))
            {
                return Sys_Result.GetR(0, "操作完成");
            }
        }
        return Sys_Result.GetR(1, "");
    }

    /// <summary>
    /// 添加修改账户
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string User(HttpContext c)
    {
        int id = string.IsNullOrEmpty(c.Request["id"]) ? 0 : Convert.ToInt16(c.Request["id"]);
        int role = string.IsNullOrEmpty(c.Request["role"]) ? 0 : Convert.ToInt16(c.Request["role"]);
        string uName = string.IsNullOrEmpty(c.Request["uName"]) ? "" : c.Request["uName"].ToString();
        string uPass = string.IsNullOrEmpty(c.Request["uPass"]) ? "" : c.Request["uPass"].ToString();
        string name = string.IsNullOrEmpty(c.Request["name"]) ? "" : c.Request["name"].ToString();
        string mobile = string.IsNullOrEmpty(c.Request["mobile"]) ? "" : c.Request["mobile"].ToString();
        string memo = string.IsNullOrEmpty(c.Request["memo"]) ? "" : c.Request["memo"].ToString();
        name = c.Server.UrlDecode(name);
        if (id == 0)
        {
            if (new _AdminUser().CheckUser(uName) == 0)
            {
                adminUser p = new adminUser
                {
                    uName = uName,
                    name = name,
                    uPass = uPass,
                    mobile = mobile,
                    memo = memo,
                    addOn = DateTime.Now,
                    role = role
                };
                if (new Main().AddToDb(p, "t_admin_user"))
                {
                    AddAdminLog("", "添加账户," + name);
                    return Sys_Result.GetR(0, "添加完成");
                }
            }
            else
            {
                return Sys_Result.GetR(1, "该登陆名称已存在，不能重复添加");
            }
        }
        else
        {
            if (new _AdminUser().CheckUser(uName) == 0 || new _AdminUser().CheckUser(uName) == id)
            {
                var o = new
                {
                    uName = uName,
                    name = name,
                    uPass = uPass,
                    mobile = mobile,
                    memo = memo,
                    role = role
                };
                if (new Main().UpdateDb(o, "t_admin_user", "id=" + id))
                {
                    AddAdminLog("", "修改账户" + name);
                    return Sys_Result.GetR(0, "修改完成");
                }
            }
            else
            {
                return Sys_Result.GetR(1, "该账户已存在，不能重复");
            }
        }
        return Sys_Result.GetR(1, "添加失败");
    }

    /// <summary>
    /// 添加修改内容
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string ContentS(HttpContext c)
    {
        int id = string.IsNullOrEmpty(c.Request["id"]) ? 0 : Convert.ToInt16(c.Request["id"]);
        int cId = string.IsNullOrEmpty(c.Request["cId"]) ? 0 : Convert.ToInt16(c.Request["cId"]);
        int cType = string.IsNullOrEmpty(c.Request["cType"]) ? 0 : Convert.ToInt16(c.Request["cType"]);
        string title = string.IsNullOrEmpty(c.Request["title"]) ? "" : c.Request["title"].ToString();
        string source = string.IsNullOrEmpty(c.Request["source"]) ? "" : c.Request["source"].ToString();
        string contents = string.IsNullOrEmpty(c.Request["contents"]) ? "" : c.Request["contents"].ToString();
        string imgUrl = string.IsNullOrEmpty(c.Request["imgUrl"]) ? "" : c.Request["imgUrl"].ToString();

        int isHref = string.IsNullOrEmpty(c.Request["isHref"]) ? 0 : Convert.ToInt16(c.Request["isHref"]);
        string hrefUrl = string.IsNullOrEmpty(c.Request["hrefUrl"]) ? "" : c.Request["hrefUrl"].ToString();

        string wp_tel = string.IsNullOrEmpty(c.Request["wp_tel"]) ? "" : c.Request["wp_tel"].ToString();
        string wp_addr = string.IsNullOrEmpty(c.Request["wp_addr"]) ? "" : c.Request["wp_addr"].ToString();
        string wp_contact = string.IsNullOrEmpty(c.Request["wp_contact"]) ? "" : c.Request["wp_contact"].ToString();
        
        DateTime cDate = string.IsNullOrEmpty(c.Request["cDate"]) ? DateTime.Now : Convert.ToDateTime(c.Request["cDate"].ToString());
        title = c.Server.UrlDecode(title);
        source = c.Server.UrlDecode(source);
        //contents = c.Server.UrlDecode(contents);

        wp_addr = c.Server.UrlDecode(wp_addr);
        wp_contact = c.Server.UrlDecode(wp_contact);
        
        if (id == 0)
        {
            if (new _Content().CheckContent(title,cId) == 0)
            {
                content p = new content
                {
                    cId = cId,
                    cType = cType,
                    title = title,
                    source = source,
                    imgUrl = imgUrl,
                    cDate = cDate,
                    contents = contents,
                    addOn = DateTime.Now,
                    adminId = admin.id,
                    isHref = isHref,
                    hrefUrl = hrefUrl,
                    wp_contact = wp_contact,
                    wp_addr = wp_addr,
                    wp_tel = wp_tel
                };
                if (new Main().AddToDb(p, "t_content"))
                {
                    AddAdminLog("", "添加内容," + title);
                    return Sys_Result.GetR(0, "添加完成");
                }
            }
            else
            {
                return Sys_Result.GetR(1, "该分类下已存在此标题的内容，不能重复添加");
            }
        }
        else
        {
            if (new _Content().CheckContent(title, cId) == 0 || new _Content().CheckContent(title, cId) == id)
            {
                var o = new
                {
                    cId = cId,
                    cType = cType,
                    title = title,
                    source = source,
                    imgUrl = imgUrl,
                    cDate = cDate,
                    contents = contents,
                    adminId = admin.id,
                    isHref = isHref,
                    hrefUrl = hrefUrl,
                    wp_contact = wp_contact,
                    wp_addr = wp_addr,
                    wp_tel = wp_tel
                };
                if (new Main().UpdateDb(o, "t_content", "id=" + id))
                {
                    AddAdminLog("", "修改内容" + title);
                    return Sys_Result.GetR(0, "修改完成");
                }
            }
            else
            {
                return Sys_Result.GetR(1, "该分类下已存在此标题的内容，不能重复");
            }
        }
        return Sys_Result.GetR(1, "添加失败");
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
    /// 删除内容
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string DelContent(HttpContext c)
    {
        int id = string.IsNullOrEmpty(c.Request["id"]) ? 0 : Convert.ToInt16(c.Request["id"]);
        int enable = string.IsNullOrEmpty(c.Request["enable"]) ? 1 : Convert.ToInt16(c.Request["enable"]);
        string title = string.IsNullOrEmpty(c.Request["title"]) ? "" : c.Request["title"].ToString();
        title = c.Server.UrlDecode(title);
        if (id > 0)
        {
            var o = new
            {
                Enable = enable
            };
            if (new Main().UpdateDb(o, "t_content", "id=" + id))
            {
                return Sys_Result.GetR(0, "操作完成");
            }
        }
        return Sys_Result.GetR(1, "");
    }

    /// <summary>
    /// 审核内容
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string CheckContent(HttpContext c)
    {
        int id = string.IsNullOrEmpty(c.Request["id"]) ? 0 : Convert.ToInt16(c.Request["id"]);
        int isCheck = string.IsNullOrEmpty(c.Request["isCheck"]) ? 0 : Convert.ToInt16(c.Request["isCheck"]);
        string title = string.IsNullOrEmpty(c.Request["title"]) ? "" : c.Request["title"].ToString();
        title = c.Server.UrlDecode(title);
        if (id > 0)
        {
            var o = new
            {
                isCheck = isCheck,
                checkId = admin.id
            };
            if (isCheck == 0)
            {
                o = new
                {
                    isCheck = isCheck,
                    checkId = 0
                }; 
            }
            if (new Main().UpdateDb(o, "t_content", "id=" + id))
            {
                return Sys_Result.GetR(0, "操作完成");
            }
        }
        return Sys_Result.GetR(1, "");
    }

    /// <summary>
    /// 置顶操作
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string HotContent(HttpContext c)
    {
        int id = string.IsNullOrEmpty(c.Request["id"]) ? 0 : Convert.ToInt16(c.Request["id"]);
        int isHot = string.IsNullOrEmpty(c.Request["isHot"]) ? 0 : Convert.ToInt16(c.Request["isHot"]);
        if (id > 0)
        {
            var o = new
            {
                isHot = isHot
            };
            if (new Main().UpdateDb(o, "t_content", "id=" + id))
            {
                return Sys_Result.GetR(0, "完成");
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
        int page = string.IsNullOrEmpty(c.Request["page"]) ? 1 : Convert.ToInt16(c.Request["page"]);
        int cId = string.IsNullOrEmpty(c.Request["cId"]) ? 0 : Convert.ToInt16(c.Request["cId"]);
        int isCheck = string.IsNullOrEmpty(c.Request["isCheck"]) ? -1 : Convert.ToInt16(c.Request["isCheck"]);
        int sId = string.IsNullOrEmpty(c.Request["sId"]) ? 0 : Convert.ToInt16(c.Request["sId"]);
        string DateS = string.IsNullOrEmpty(c.Request["DateS"]) ? "" : c.Request["DateS"];
        string DateE = string.IsNullOrEmpty(c.Request["DateE"]) ? "" : c.Request["DateE"];
        string Key = string.IsNullOrEmpty(c.Request["Key"]) ? "" : c.Request["Key"].ToString();

        string keyword = "";
        if (Key.Length > 0)
        {
            keyword += " and (title like '%" + c.Server.UrlDecode(Key) + "%' or contents like '%" + c.Server.UrlDecode(Key) + "%')";
        }
        if (DateS.Length > 0)
        {
            keyword += " and date(addOn) >= '" + DateS + "'";
        }
        if (DateE.Length > 0)
        {
            keyword += " and date(addOn) <= '" + DateE + "'";
        }
        if (cId > 0)
        {
            keyword += " and cId in(select id from t_class where id= " + cId + " or pId = " + cId + ")";
        }
        if (sId > 0)
        {
            keyword += " and cId = " + sId;
        }
        if (isCheck > -1)
        {
            keyword += " and isCheck = " + isCheck;
        }
        string sql = "select * from t_content where enable=0 " + keyword + " order by addOn desc limit " + Convert.ToInt16((page - 1) * perPage) + "," + perPage;
        string sql_c = "select count(*) as t from t_content where enable=0 " + keyword + "";
        {
            int OCount = 1;
            List<ContentInfo> lo = new _Content().GetContentList(sql, sql_c, out OCount);
            if (lo != null && lo.Count > 0)
            {
                var o = new { Return = 0, Msg = OCount, List = lo };
                return JsonMapper.ToJson(o);
            }
        }
        return Sys_Result.GetR(1, "");
    }

    

    /// <summary>
    /// 修改用户分组
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string updateGroup(HttpContext c)
    {
        int cId = string.IsNullOrEmpty(c.Request["cId"]) ? 0 : Convert.ToInt16(c.Request["cId"]);
        string ids = string.IsNullOrEmpty(c.Request["ids"]) ? "" : c.Request["ids"].ToString();
        if (ids.Length > 0)
        {
            var o = new
            {
                cId = cId
            };
            if (new Main().UpdateDb(o, "t_user", "id in(" + ids + ")"))
            {
                return Sys_Result.GetR(0, "操作完成");
            }
        }
        return Sys_Result.GetR(1, "修改失败，请稍后再试");
    }

    /// <summary>
    /// 平台用户恢复绑定和解绑
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string userBind(HttpContext c)
    {
        int uid = string.IsNullOrEmpty(c.Request["uid"]) ? 0 : Convert.ToInt16(c.Request["uid"]);
        int isBind = string.IsNullOrEmpty(c.Request["isBind"]) ? 0 : Convert.ToInt16(c.Request["isBind"]);
        if (uid > 0)
        {
            var o = new
            {
                isBind = isBind
            };
            if (new Main().UpdateDb(o, "t_user", "id=" + uid))
            {
                return Sys_Result.GetR(0, "操作完成");
            }
        }
        return Sys_Result.GetR(1, "修改失败，请稍后再试");
    }
    
    /// <summary>
    /// 获取系统日志
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string GetSysLogList(HttpContext c)
    {
        int page = string.IsNullOrEmpty(c.Request["page"]) ? 1 : Convert.ToInt16(c.Request["page"]);
        string DateS = string.IsNullOrEmpty(c.Request["DateS"]) ? "" : c.Request["DateS"];
        string DateE = string.IsNullOrEmpty(c.Request["DateE"]) ? "" : c.Request["DateE"];
        string Content = string.IsNullOrEmpty(c.Request["Content"]) ? "" : c.Request["Content"];

        string keyword = "";
        if (Content.Length > 0)
        {
            keyword += " and Content like '%" + c.Server.UrlDecode(Content) + "%'";
        }
        if (DateS.Length > 0)
        {
            keyword += " and addOn >= '" + DateS + " 00:00:00'";
        }
        if (DateE.Length > 0)
        {
            keyword += " and addOn <= '" + DateE + " 23:59:59'";
        }
        //if (sourceId == 0 || workNo.Length > 0)
        string sql = "select * from View_Log where 1=1 " + keyword + " order by addOn desc limit " + Convert.ToInt16((page - 1) * perPage) + "," + perPage;
        string sql_c = "select count(*) as t from View_Log where 1=1 " + keyword + "";
        {
            int OCount = 1;
            List<adminLog> lo = new _AdminLog().GetLogList(sql, sql_c, out OCount);
            if (lo != null && lo.Count > 0)
            {
                var o = new { Return = 0, Msg = OCount, List = lo };
                return JsonMapper.ToJson(o);
            }
        }
        return Sys_Result.GetR(1, "");
    }


    /// <summary>
    /// 获取特定分类的用户
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string GetUserList(HttpContext c)
    {
        int page = string.IsNullOrEmpty(c.Request["page"]) ? 1 : Convert.ToInt16(c.Request["page"]);
        string DateS = string.IsNullOrEmpty(c.Request["DateS"]) ? "" : c.Request["DateS"];
        string DateE = string.IsNullOrEmpty(c.Request["DateE"]) ? "" : c.Request["DateE"];
        string Content = string.IsNullOrEmpty(c.Request["Content"]) ? "" : c.Request["Content"];

        string keyword = "";
        if (Content.Length > 0)
        {
            keyword += " and nickName like '%" + c.Server.UrlDecode(Content) + "%'";
        }
        if (DateS.Length > 0)
        {
            keyword += " and addOn >= '" + DateS + " 00:00:00'";
        }
        if (DateE.Length > 0)
        {
            keyword += " and addOn <= '" + DateE + " 23:59:59'";
        }
        //if (sourceId == 0 || workNo.Length > 0)
        string sql = "select * from t_user where srcUid=1500 and isSubscribe=1 " + keyword + " order by addOn desc limit " + Convert.ToInt16((page - 1) * perPage) + "," + perPage;
        string sql_c = "select count(*) as t from t_user where srcUid=1500 and isSubscribe=1 " + keyword + "";
        {
            int OCount = 1;
            List<user> lo = new _User().GetUser(sql, sql_c, out OCount);
            if (lo != null && lo.Count > 0)
            {
                var o = new { Return = 0, Msg = OCount, List = lo };
                return JsonMapper.ToJson(o);
            }
        }
        return Sys_Result.GetR(1, "");
    }

    /// <summary>
    /// 获取参与投票的用户
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string GetVoteList(HttpContext c)
    {
        int page = string.IsNullOrEmpty(c.Request["page"]) ? 1 : Convert.ToInt16(c.Request["page"]);
        string DateS = string.IsNullOrEmpty(c.Request["DateS"]) ? "" : c.Request["DateS"];
        string DateE = string.IsNullOrEmpty(c.Request["DateE"]) ? "" : c.Request["DateE"];
        string bNo = string.IsNullOrEmpty(c.Request["bNo"]) ? "" : c.Request["bNo"];
        string mobile = string.IsNullOrEmpty(c.Request["mobile"]) ? "" : c.Request["mobile"];

        string keyword = "";
        if (bNo.Length > 0)
        {
            keyword += " and bNo = '" + bNo + "'";
        }
        if (mobile.Length > 0)
        {
            keyword += " and mobile = '" + mobile + "'";
        }
        if (DateS.Length > 0)
        {
            keyword += " and addOn >= '" + DateS + " 00:00:00'";
        }
        if (DateE.Length > 0)
        {
            keyword += " and addOn <= '" + DateE + " 23:59:59'";
        }
        //if (sourceId == 0 || workNo.Length > 0)
        string sql = "select * from t_acive_voteuser where 1=1 " + keyword + " order by addOn desc limit " + Convert.ToInt16((page - 1) * perPage) + "," + perPage;
        string sql_c = "select count(*) as t from t_acive_voteuser where 1=1 " + keyword + "";
        {
            int OCount = 1;
            List<VoteUser> lo = new _ActiveVote().GetUser(sql, sql_c, out OCount);
            if (lo != null && lo.Count > 0)
            {
                var o = new { Return = 0, Msg = OCount, List = lo };
                return JsonMapper.ToJson(o);
            }
        }
        return Sys_Result.GetR(1, "");
    }

    /// <summary>
    /// 获取参与投票的用户
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string SendVoteMsg(HttpContext c)
    {
        List<VoteUser> lo = new _ActiveVote().GetVoteUser();
        if (lo != null && lo.Count > 0)
        {
            TMsg_Vote tmo = null;
            string MsgContent = "";
            string token = Get_Access_Token(c);
            /*
            foreach (VoteUser item in lo)
            {
                tmo = new TMsg_Vote().GetMessageBody("尊敬的参赛选手您好，恭喜您进入我们的初赛网络投票环节，点击查看投票详情！", "2017 首届龙城太原 “小龙人”评选大赛,即《2017太原国际马拉松赛吉祥物》代言人选拔赛", DateTime.Now.ToString("yyyy-MM-dd HH:mm"), "查看详情", out MsgContent);
                SendTemplateMessage(c, tmo, new TMsg_Vote().Key(), item.openId, BaseUrl + "active/vote/toGz.html", MsgContent, "0000", token);        
            }
            */
            tmo = new TMsg_Vote().GetMessageBody("尊敬的参赛选手您好，恭喜您进入我们的初赛网络投票环节，点击查看投票详情！", "2017 首届龙城太原 “小龙人”评选大赛,即《2017太原国际马拉松赛吉祥物》代言人选拔赛", DateTime.Now.ToString("yyyy-MM-dd HH:mm"), "查看详情", out MsgContent);
            SendTemplateMessage(c, tmo, new TMsg_Vote().Key(), "oKhuCwXUcG1KFsUd0Cti9HakBLC8", BaseUrl + "active/vote/toGz.html", MsgContent, "0000", token);
            return Sys_Result.GetR(0, "");
        }
        return Sys_Result.GetR(1, "");
    }

    /// <summary>
    /// 获取参与投票的用户
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string GetVoteMx(HttpContext c)
    {
        int page = string.IsNullOrEmpty(c.Request["page"]) ? 1 : Convert.ToInt16(c.Request["page"]);
        string DateS = string.IsNullOrEmpty(c.Request["DateS"]) ? "" : c.Request["DateS"];
        string DateE = string.IsNullOrEmpty(c.Request["DateE"]) ? "" : c.Request["DateE"];
        string bNo = string.IsNullOrEmpty(c.Request["bNo"]) ? "" : c.Request["bNo"];
        string mobile = string.IsNullOrEmpty(c.Request["mobile"]) ? "" : c.Request["mobile"];

        string keyword = "";
        if (bNo.Length > 0)
        {
            keyword += " and bNo = '" + bNo + "'";
        }
        if (DateS.Length > 0)
        {
            keyword += " and addOn >= '" + DateS + " 00:00:00'";
        }
        if (DateE.Length > 0)
        {
            keyword += " and addOn <= '" + DateE + " 23:59:59'";
        }
        //if (sourceId == 0 || workNo.Length > 0)
        string sql = "select * from t_active_vote where 1=1 " + keyword + " order by addOn desc limit " + Convert.ToInt16((page - 1) * perPage) + "," + perPage;
        string sql_c = "select count(*) as t from t_active_vote where 1=1 " + keyword + "";
        {
            int OCount = 1;
            List<Vote> lo = new _ActiveVote().GetVoteMx(sql, sql_c, out OCount);
            if (lo != null && lo.Count > 0)
            {
                var o = new { Return = 0, Msg = OCount, List = lo };
                return JsonMapper.ToJson(o);
            }
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
        List<VotePm> lo = new _ActiveVote().GetVotePm();
        if (lo != null && lo.Count > 0)
        {
            var o = new { Return = 0, Msg = "", List = lo };
            return JsonMapper.ToJson(o);
        }
        return Sys_Result.GetR(1, "");
    }

      
    
    public void SendTemplateMessage(HttpContext c, object o, string key, string openid, string url, string MsgContent,string orderNo,string toUser,int uid)
    {
        TMessage t = new TMessage
        {
            touser = openid,
            data = o,
            template_id = key,
            url = url,
            topcolor = ""
        };
        templateMsg tmp = new templateMsg
        {
            msgBody = MsgContent,
            msgUrl = "",
            sendTime = DateTime.Now,
            msgContent = MsgContent,
            orderNo = orderNo,
            toUser = uid
        };
        new Main().AddToDb(tmp, "t_templatemsg");
        new TMessage().Send_TemplateMsg(t, Get_Access_Token(c));
    }

    /// <summary>
    /// 获取账户列表
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string GetAdminUserList(HttpContext c)
    {
        string key = string.IsNullOrEmpty(c.Request["key"]) ? "" : c.Request["key"].ToString();
        key = c.Server.UrlDecode(key);
        string keyword = "";
        if (key.Length > 0)
        {
            keyword = " and (name like '%" + key + "%' or mobile like '%" + key + "%' or uName like '%" + key + "%' or memo like '%" + key + "%')";
        }
        string sql = "select * from t_admin_user where 1=1 " + keyword + "order by addOn desc";
        List<adminUser> lo = new _AdminUser().GetAdminUserList(sql);
        if (lo != null && lo.Count > 0)
        {
            var o = new { Return = 0, Msg = "", List = lo };
            return JsonMapper.ToJson(o);
        }
        return Sys_Result.GetR(1, "");
    }

    /// <summary>
    /// 删除账户
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string DelAdmin(HttpContext c)
    {
        int id = string.IsNullOrEmpty(c.Request["id"]) ? 0 : Convert.ToInt16(c.Request["id"]);
        int enable = string.IsNullOrEmpty(c.Request["enable"]) ? 1 : Convert.ToInt16(c.Request["enable"]);
        string Name = string.IsNullOrEmpty(c.Request["Name"]) ? "" : c.Request["Name"].ToString();
        Name = c.Server.UrlDecode(Name);
        if (id > 0)
        {
            var o = new
            {
                Enable = enable
            };
            if (new Main().UpdateDb(o, "t_admin_user", "id=" + id))
            {
                return Sys_Result.GetR(0, "操作完成");
            }
        }
        return Sys_Result.GetR(1, "");
    }
    
    /// <summary>
    /// 获取用户详情
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string GetUserInfoForTel(HttpContext c)
    {
        string Mobile = string.IsNullOrEmpty(c.Request["mobile"]) ? "" : c.Request["mobile"].ToString();
        user u = new _User().GetUser("", Mobile, 0);
        if (u != null)
        {
            var o = new { Return = 0, Msg = "", Info = u };
            return JsonMapper.ToJson(o);
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
    public void SendTemplateMessage(HttpContext c, object o, string key, string openid, string url, string MsgContent, string source, string Token)
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
                msgBody = JsonMapper.ToJson(o),
                msgUrl = url,
                openId = openid,
                sendTime = DateTime.Now,
                msgContent = MsgContent,
                orderNo = ""
            };
            new Main().AddToDb(tmp, "t_templateMsg");
        }
        catch { }

        new TMessage().Send_TemplateMsg(t, Token);
    }

   
    /// <summary>
    /// 添加参数日志
    /// </summary>
    /// <param name="c"></param>
    public void AddQueryLog(HttpContext c)
    {
        int F = string.IsNullOrEmpty(c.Request["fn"]) ? 0 : Convert.ToInt16(c.Request["fn"]);
        new Main().AddTestLog("[A]F", F.ToString());
        string Query = "";
        foreach (string p in c.Request.Params.AllKeys)
        {
            Query += p + ":" + c.Request[p].ToString() + "&";
            if (p.IndexOf("ALL_HTTP") != -1)
            {
                break;
            }
        }
        new Main().AddTestLog("[A]Query-" + F.ToString(), Query.ToString());
    }
   
    public void AddAdminLog(string OrderNo, string Content)
    {
        string adminName = "";
        int id = 0;
        if (admin != null)
        {
            adminName = admin.name;
            id = admin.id;
        }
        adminLog l = new adminLog
        {
            addOn = DateTime.Now,
            content = Content,
            orderNo = OrderNo,
            adminName = adminName,
            adminId = id
        };
        new Main().AddToDb(l, "t_admin_log");
    }
    
    public bool IsReusable {
        get {
            return false;
        }
    }

}