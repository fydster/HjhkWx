using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using Model;

namespace Data
{
    public class _Syslog:DbCenter
    {
        public List<syslog> GetLogList(string sql,string sql_c,out int Count)
        {
            List<syslog> ls = new List<syslog>();
            
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
                            syslog s = new syslog
                            {
                                orderNo = r["orderNo"].ToString(),
                                addOn = Convert.ToDateTime(r["addOn"]),
                                uid = Convert.ToInt32(r["uid"]),
                                workNo = r["workNo"].ToString(),
                                adminName = r["adminName"].ToString(),
                                content = r["content"].ToString(),
                                lType = Convert.ToInt16(r["lType"]),
                                lt = Convert.ToInt16(r["lt"]),
                                uName = "--"
                            };
                            if (s.uid > 0)
                            {
                                user u = new _User().GetUser("", "", s.uid);
                                if (u != null)
                                {
                                    s.uName = u.contact;
                                    if (s.uName.Length == 0)
                                    {
                                        s.uName = u.nickName;
                                    }
                                }
                            }
                            else
                            {
                                if (s.lType == 5) 
                                {
                                    s.adminName = "[" + s.workNo + "]" + s.adminName;
                                }
                                
                            }
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
