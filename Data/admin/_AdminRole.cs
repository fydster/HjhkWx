using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using Model;

namespace Data
{
    public class _AdminRole:DbCenter
    {
        public string GetLimits(int id)
        {
            string Limits = "";
            string sql = "select * from t_admin_role where id = " + id;
            try
            {
                using (DataTable dt = helper.GetDataTable(sql))
                {
                    if (dt != null && dt.Rows.Count > 0)
                    {
                        DataRow r = dt.Rows[0];
                        Limits = r["limits"].ToString();
                    }
                }
            }
            catch
            {
            }
            return Limits;
        }

        public List<roleInfo> GetRoleList()
        {
            List<roleInfo> l = new List<roleInfo>();
            string sql = "select * from t_admin_role order by id asc";
            try
            {
                using (DataTable dt = helper.GetDataTable(sql))
                {
                    Dictionary<int, adminLimit> dic = new _AdminLimit().getLimitDic();
                    foreach (DataRow r in dt.Rows)
                    {
                        roleInfo ad = new roleInfo
                        {
                            id = Convert.ToInt16(r["id"]),
                            roleName = r["roleName"].ToString(),
                            limits = r["limits"].ToString()
                        };
                        string[] arr = ad.limits.Split(',');
                        string limitInfo = "全部";
                        if (ad.limits != "*")
                        {
                            limitInfo = "";
                            foreach (string item in arr)
                            {
                                if (item.Length > 0)
                                {
                                    if (dic.ContainsKey(Convert.ToInt16(item)))
                                    {
                                        if (dic[Convert.ToInt16(item)].pId > 0)
                                        {
                                            limitInfo += dic[Convert.ToInt16(item)].typeName + "-" + dic[Convert.ToInt16(item)].limitName + " , ";
                                        }
                                    }
                                }
                            }
                        }
                        ad.limitInfo = limitInfo;
                        l.Add(ad);
                    }
                }
            }
            catch
            {
            }
            return l;
        }

        public int CheckRole(string roleName)
        {
            int hid = 0;
            string sql = "select * from t_admin_role where roleName = '" + roleName + "'";
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
