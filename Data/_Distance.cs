using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using Model;

namespace Data
{
    public class _Distance:DbCenter
    {
        public List<distance> GetDistance(string sCity)
        {
            List<distance> lp = new List<distance>();
            string sql = "select * from t_distance order by descNum desc,id asc";
            using (DataTable dt = helper.GetDataTable(sql))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    foreach (DataRow r in dt.Rows)
                    {
                        distance b = new distance
                        {
                            d = Convert.ToInt32(r["distance"]),
                            cityType = Convert.ToInt16(r["cityType"]),
                            //sCity = r["sCity"].ToString(),
                            tCity = r["tCity"].ToString(),
                        };
                        lp.Add(b);
                    }
                }
            }
            return lp;
        }


        public List<distanceList> GetDistanceList()
        {
            List<distanceList> lp = new List<distanceList>();
            string sql = "select distinct sCity from t_distance";
            using (DataTable dt = helper.GetDataTable(sql))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    foreach (DataRow r in dt.Rows)
                    {
                        distanceList b = new distanceList
                        {
                            sCity = r["sCity"].ToString()
                        };
                        b.ld = GetDistance(b.sCity);
                        lp.Add(b);
                    }
                }
            }
            return lp;
        }
    }
}
