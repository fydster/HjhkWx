using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using Model;

namespace Data
{
    public class _AdminLog:DbCenter
    {
        public List<adminLog> GetLog(string keyWord)
        {
            List<adminLog> ll = new List<adminLog>();
            string sql = "select * from t_admin_log where 1=1 " + keyWord + " order by addOn desc";
            try
            {
                using (DataTable dt = helper.GetDataTable(sql))
                {
                    if (dt != null && dt.Rows.Count > 0)
                    {
                        foreach (DataRow r in dt.Rows)
                        {
                            adminLog l = new adminLog { addOn = Convert.ToDateTime(r["addOn"]), id = Convert.ToInt16(r["id"]), content = r["content"].ToString(), adminName = r["adminName"].ToString(), orderNo = r["orderNo"].ToString(), adminId = Convert.ToInt16(r["adminId"].ToString()) };
                            ll.Add(l);
                        }
                    }
                }
            }
            catch
            {
            }
            return ll;
        }

        public List<adminLog> GetLogList(string sql, string sql_c, out int Count)
        {
            List<adminLog> ls = new List<adminLog>();

            int LogCount = 1;
            try
            {
                LogCount = Convert.ToInt32(helper.GetOne(sql_c));
            }
            catch
            {
                LogCount = 1;
            }
            Count = LogCount;

            using (DataTable dt = helper.GetDataTable(sql))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    try
                    {
                        foreach (DataRow r in dt.Rows)
                        {
                            adminLog s = new adminLog
                            {
                                orderNo = r["orderNo"].ToString(),
                                addOn = Convert.ToDateTime(r["addOn"]),
                                adminId = Convert.ToInt32(r["adminId"]),
                                adminName = r["adminName"].ToString(),
                                content = r["content"].ToString()
                            };
                            ls.Add(s);
                        }
                    }
                    catch (Exception ex)
                    {

                    }
                }
            }
            return ls;
        }
    }
}
