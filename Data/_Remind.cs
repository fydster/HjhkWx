using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using Model.Basic;

namespace Data
{
    public class _Remind:DbCenter
    {
        public List<Remind> GetRemindList(string sql)
        {
            List<Remind> lr = new List<Remind>();
            using (DataTable dt = helper.GetDataTable(sql))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    foreach (DataRow r in dt.Rows)
                    {
                        Remind b = new Remind
                        {
                            id = Convert.ToInt16(r["id"]),
                            uid = Convert.ToInt32(r["uid"]),
                            days = Convert.ToInt32(r["days"]),
                            enable = Convert.ToInt16(r["enable"]),
                            sNum = Convert.ToInt16(r["sNum"]),
                            lPrice = Convert.ToInt16(r["lPrice"]),
                            sCode = r["sCode"].ToString(),
                            sCity = r["sCity"].ToString(),
                            tCode = r["tCode"].ToString(),
                            tCity = r["tCity"].ToString(),
                            addOn = Convert.ToDateTime(r["AddOn"]),
                            sDate = Convert.ToDateTime(r["sDate"]),
                            eDate = Convert.ToDateTime(r["eDate"]),
                            lastOn = Convert.ToDateTime(r["lastOn"]),
                            discount = Convert.ToInt16(r["discount"])
                        };
                        lr.Add(b);
                    }
                }
            }
            return lr;
        }
    }
}
