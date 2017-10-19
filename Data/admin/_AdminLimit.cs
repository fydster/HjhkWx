using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using Model;

namespace Data
{
    public class _AdminLimit:DbCenter
    {
        /// <summary>
        /// 获取权限列表
        /// </summary>
        /// <param name="uid"></param>
        /// <returns></returns>
        public List<adminLimit> getLimit(string limit)
        {
            List<adminLimit> la = new List<adminLimit>();
            string sql = "select * from t_admin_limit where enable = 0 order by des asc";
            try
            {
                using (DataTable dt = helper.GetDataTable(sql))
                {
                    if (dt != null && dt.Rows.Count > 0)
                    {
                        foreach (DataRow r in dt.Rows)
                        {
                            if (limit.IndexOf("," + r["id"] + ",") > -1 || limit=="*")
                            {
                                adminLimit a = new adminLimit
                                {
                                    id = Convert.ToInt16(r["id"]),
                                    limitName = r["limitName"].ToString(),
                                    limitUrl = r["limitUrl"].ToString(),
                                    limitType = Convert.ToInt16(r["limitType"]),
                                    typeName = r["typeName"].ToString(),
                                    icon = r["icon"].ToString(),
                                    aType = Convert.ToInt16(r["aType"]),
                                    pId = Convert.ToInt16(r["pId"])
                                };
                                la.Add(a);
                            }
                        }
                    }
                }
            }
            catch { }
            return la;
        }

        public Dictionary<int, adminLimit> getLimitDic()
        {
            Dictionary<int, adminLimit> dic = new Dictionary<int, adminLimit>();
            string sql = "select * from t_admin_limit where enable = 0 order by des asc";
            try
            {
                using (DataTable dt = helper.GetDataTable(sql))
                {
                    if (dt != null && dt.Rows.Count > 0)
                    {
                        foreach (DataRow r in dt.Rows)
                        {
                            adminLimit a = new adminLimit
                            {
                                id = Convert.ToInt16(r["id"]),
                                limitName = r["limitName"].ToString(),
                                limitUrl = r["limitUrl"].ToString(),
                                limitType = Convert.ToInt16(r["limitType"]),
                                typeName = r["typeName"].ToString(),
                                icon = r["icon"].ToString(),
                                aType = Convert.ToInt16(r["aType"]),
                                pId = Convert.ToInt16(r["pId"])
                            };
                            dic.Add(a.id, a);
                        }
                    }
                }
            }
            catch { }
            return dic;
        }
    }
}
