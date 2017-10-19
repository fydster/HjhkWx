using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using Model;

namespace Data
{
    public class _AdminUser:DbCenter
    {
        /// <summary>
        /// 检查用户信息是否正确并返回
        /// </summary>
        /// <param name="mobile"></param>
        /// <param name="pass"></param>
        /// <returns></returns>
        public adminUser checkUser(string uName, string uPass)
        {
            adminUser admin = null;
            string sql = "select * from t_admin_User where uName = '" + uName + "' and uPass = '" + uPass + "' and enable = 0";
            try
            {
                using (DataTable dt = helper.GetDataTable(sql))
                {
                    if (dt != null && dt.Rows.Count > 0)
                    {
                        DataRow r = dt.Rows[0];
                        admin = new adminUser
                        {
                            id = Convert.ToInt16(r["id"]),
                            name = r["name"].ToString(),
                            uName = r["uName"].ToString(),
                            uPass = r["uPass"].ToString(),
                            limits = r["limits"].ToString(),
                            role = Convert.ToInt16(r["role"]),
                            mobile = r["mobile"].ToString(),
                            memo = r["memo"].ToString(),
                            openid = r["openid"].ToString(),
                            enable = Convert.ToInt16(r["enable"]),
                            addOn = Convert.ToDateTime(r["addOn"])
                        };
                        if (admin.role > 0)
                        {
                            admin.limits = new _AdminRole().GetLimits(admin.role);
                        }

                    }
                }
            }
            catch
            {
            }
            return admin;
        }

        public string UpdatePass(string uName, string oldPass, string newPass)
        {
            string upPass = "修改失败";
            oldPass = com.seascape.tools.BasicTool.MD5(oldPass);
            newPass = com.seascape.tools.BasicTool.MD5(newPass);
            if (checkUser(uName, oldPass) != null)
            {
                var o = new
                {
                    password = newPass
                };
                if (new Main().UpdateDb(o, "t_admin_User", "uName = '" + uName + "'"))
                {
                    upPass = "OK";
                }
            }
            else
            {
                upPass = "原始密码错误";
            }
            return upPass;
        }

        /// <summary>
        /// 获取员工列表
        /// </summary>
        /// <param name="isService"></param>
        /// <param name="workNo"></param>
        /// <returns></returns>
        public List<adminUser> GetAdminUserList(string sql)
        {
            List<adminUser> le = null;
            using (DataTable dt = helper.GetDataTable(sql))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    le = new List<adminUser>();
                    foreach (DataRow r in dt.Rows)
                    {
                        adminUser e = new adminUser
                        {
                            id = Convert.ToInt16(r["id"]),
                            name = r["name"].ToString(),
                            uName = r["uName"].ToString(),
                            uPass = r["uPass"].ToString(),
                            limits = r["limits"].ToString(),
                            role = Convert.ToInt16(r["role"]),
                            mobile = r["mobile"].ToString(),
                            memo = r["memo"].ToString(),
                            openid = r["openid"].ToString(),
                            enable = Convert.ToInt16(r["enable"]),
                            addOn = Convert.ToDateTime(r["addOn"])
                        };
                        le.Add(e);
                    }
                }
            }
            return le;
        }

        /// <summary>
        /// 获取员工字典
        /// </summary>
        /// <param name="isService"></param>
        /// <param name="workNo"></param>
        /// <returns></returns>
        public Dictionary<int,string> GetAdminUserDic()
        {
            Dictionary<int, string> dic = new Dictionary<int, string>();
            using (DataTable dt = helper.GetDataTable("select * from t_admin_User"))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    foreach (DataRow r in dt.Rows)
                    {
                        dic.Add(Convert.ToInt16(r["id"]), r["name"].ToString());
                    }
                }
            }
            return dic;
        }

        public int CheckUser(string uName)
        {
            int hid = 0;
            string sql = "select * from t_admin_user where uName = '" + uName + "' and (enable = 0 or enable = 2)";
            using (DataTable dt = helper.GetDataTable(sql))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    hid = Convert.ToInt16(dt.Rows[0]["Id"]);
                }
            }
            return hid;
        }
    }
}
