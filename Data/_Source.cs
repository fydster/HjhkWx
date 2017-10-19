using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using Model;

namespace Data
{
    public class _Source:DbCenter
    {
        public Dictionary<string,source> GetSourceDic()
        {
            Dictionary<string, source> dic = new Dictionary<string, source>();
            string sql = "select * from t_source where Enable = 0 order by id asc";
            using (DataTable dt = helper.GetDataTable(sql))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    foreach (DataRow r in dt.Rows)
                    {
                        source b = new source
                        {
                            id = Convert.ToInt16(r["id"]),
                            sName = r["sName"].ToString(),
                            sCode = r["sCode"].ToString(),
                            appid = r["appid"].ToString(),
                            secret = r["secret"].ToString(),
                            uName = r["uName"].ToString(),
                            uMobile = r["uMobile"].ToString(),
                            wxUser = r["wxUser"].ToString(),
                            wxPass = r["wxPass"].ToString(),
                            isVoucher = Convert.ToInt16(r["isVoucher"]),
                            respContent = r["respContent"].ToString(),
                            sCity = r["sCity"].ToString(),
                            cityCode = r["cityCode"].ToString(),
                            addOn = Convert.ToDateTime(r["addOn"]),
                            sysUrl = r["sysUrl"].ToString(),
                            descNum = Convert.ToInt16(r["descNum"])
                        };
                        if (!dic.ContainsKey(b.sCode))
                        {
                            dic.Add(b.sCode, b);
                        }
                    }
                }
            }
            return dic;
        }


        public List<source> GetSourceList()
        {
            List<source> dic = new List<source>();
            string sql = "select * from t_source where Enable = 0 order by id asc";
            using (DataTable dt = helper.GetDataTable(sql))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    foreach (DataRow r in dt.Rows)
                    {
                        source b = new source
                        {
                            id = Convert.ToInt16(r["id"]),
                            sName = r["sName"].ToString(),
                            sCode = r["sCode"].ToString(),
                            appid = r["appid"].ToString(),
                            secret = r["secret"].ToString(),
                            uName = r["uName"].ToString(),
                            uMobile = r["uMobile"].ToString(),
                            wxUser = r["wxUser"].ToString(),
                            wxPass = r["wxPass"].ToString(),
                            isVoucher = Convert.ToInt16(r["isVoucher"]),
                            respContent = r["respContent"].ToString(),
                            sCity = r["sCity"].ToString(),
                            cityCode = r["cityCode"].ToString(),
                            addOn = Convert.ToDateTime(r["addOn"]),
                            sysUrl = r["sysUrl"].ToString(),
                            descNum = Convert.ToInt16(r["descNum"])
                        };
                        dic.Add(b);
                    }
                }
            }
            return dic;
        }


        public List<source> GetSourceListForNav()
        {
            List<source> dic = new List<source>();
            string sql = "select * from t_source where Enable = 0 and isVoucher < 90 order by descNum desc,id asc";
            using (DataTable dt = helper.GetDataTable(sql))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    foreach (DataRow r in dt.Rows)
                    {
                        source b = new source
                        {
                            id = Convert.ToInt16(r["id"]),
                            sName = r["sName"].ToString(),
                            sCode = r["sCode"].ToString(),
                            appid = r["appid"].ToString(),
                            secret = r["secret"].ToString(),
                            uName = r["uName"].ToString(),
                            uMobile = r["uMobile"].ToString(),
                            wxUser = r["wxUser"].ToString(),
                            wxPass = r["wxPass"].ToString(),
                            isVoucher = Convert.ToInt16(r["isVoucher"]),
                            respContent = r["respContent"].ToString(),
                            sCity = r["sCity"].ToString(),
                            cityCode = r["cityCode"].ToString(),
                            addOn = Convert.ToDateTime(r["addOn"]),
                            sysUrl = r["sysUrl"].ToString(),
                            descNum = Convert.ToInt16(r["descNum"])
                        };
                        dic.Add(b);
                    }
                }
            }
            return dic;
        }
    }
}
