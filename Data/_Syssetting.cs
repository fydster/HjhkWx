using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using Model;

namespace Data
{
    public class _Syssetting:DbCenter
    {
        public List<syssetting> GetSyssettingList(string key)
        {
            List<syssetting> lp = new List<syssetting>();
            string sql = "select * from syssetting";
            if (key.Length > 0)
            {
                sql = "select * from syssetting where key = '" + key + "'";
            }
            using (DataTable dt = helper.GetDataTable(sql))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    foreach (DataRow r in dt.Rows)
                    {
                        syssetting b = new syssetting
                        {
                            Key = r["Key"].ToString(),
                            Value = r["Value"].ToString()
                             
                        };
                        lp.Add(b);
                    }
                }
            }
            return lp;
        }

        public Dictionary<string,string> GetSyssettingDic()
        {
            Dictionary<string, string> lp = new Dictionary<string, string>();
            string sql = "select * from syssetting";
            using (DataTable dt = helper.GetDataTable(sql))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    foreach (DataRow r in dt.Rows)
                    {
                        if (!lp.ContainsKey(r["Key"].ToString()))
                        {
                            lp.Add(r["Key"].ToString(), r["Value"].ToString());
                        }
                    }
                }
            }
            return lp;
        }
    }
}
