using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;

namespace Train
{
    public class _TrainCity:DbCenter
    {
        public List<trainCity> GetHotTrainCityList()
        {
            List<trainCity> lt = new List<trainCity>();
            string sql = "SELECT * from train_city order by hot DESC LIMIT 0,16 ";
            using (DataTable dt = helper.GetDataTable(sql))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    foreach (DataRow r in dt.Rows)
                    {
                        trainCity to = new trainCity
                        {
                            sName = r["sName"].ToString(),
                            hot = Convert.ToInt32(r["hot"]),
                            stationCode = r["stationCode"].ToString(),
                            match = r["match"].ToString(),
                            priority = Convert.ToInt16(r["priority"])
                        };
                        lt.Add(to);
                    }
                }
            }
            return lt;
        }

        public Dictionary<string,trainCity> GetHotTrainCityDic()
        {
            Dictionary<string, trainCity> Dic = new Dictionary<string, trainCity>();
            string sql = "SELECT * from train_city order by hot DESC";
            using (DataTable dt = helper.GetDataTable(sql))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    foreach (DataRow r in dt.Rows)
                    {
                        trainCity to = new trainCity
                        {
                            sName = r["sName"].ToString(),
                            hot = Convert.ToInt32(r["hot"]),
                            stationCode = r["stationCode"].ToString(),
                            match = r["match"].ToString(),
                            priority = Convert.ToInt16(r["priority"])
                        };
                        if (!Dic.ContainsKey(to.sName))
                        {
                            Dic.Add(to.sName, to);
                        }
                    }
                }
            }
            return Dic;
        }
    }
}
