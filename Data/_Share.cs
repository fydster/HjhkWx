using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;

namespace Data
{
    public class _Share:DbCenter
    {
        public Dictionary<string, int> GetShareDic()
        {
            Dictionary<string, int> lp = new Dictionary<string, int>();
            string sql = "SELECT uId,fType,count(id) as t from t_share GROUP BY uId,fType";
            using (DataTable dt = helper.GetDataTable(sql))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    foreach (DataRow r in dt.Rows)
                    {
                        if (!lp.ContainsKey(r["uId"].ToString() + "_" + r["fType"].ToString()))
                        {
                            lp.Add((r["uId"].ToString() + "_" + r["fType"].ToString()), Convert.ToInt16(r["t"]));
                        }
                    }
                }
            }
            return lp;
        }
    }
}
