using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using Model;

namespace Data
{
    public class _CityCode:DbCenter
    {
        public List<cityInfo> GetCityList(int isHot)
        {
            List<cityInfo> lp = new List<cityInfo>();
            string[] lArr = "A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z".Split(',');
            if (isHot == 1)
            {
                cityInfo ci = new cityInfo
                {
                    letter = ""
                };
                ci.city = GetCityCode(1, "");
                lp.Add(ci);
            }
            else
            {
                foreach (string l in lArr)
                {
                    cityInfo ci = new cityInfo
                    {
                        letter = l
                    };
                    ci.city = GetCityCode(0, l);
                    lp.Add(ci);
                }
            }
            return lp;
        }

        public List<cityCode> GetCityCode(int isHot,string letter)
        {
            List<cityCode> lc = new List<cityCode>();
            string sql = "select * from web_city where simplename like '" + letter + "%'  order by id asc";
            if (isHot > 0)
            {
                sql = "select * from web_city where isHot = '1'";
            }
            using (DataTable dt = helper.GetDataTable(sql))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    foreach (DataRow r in dt.Rows)
                    {
                        cityCode b = new cityCode
                        {
                            cityName = r["cityName"].ToString(),
                            airPort = r["airPortName"].ToString(),
                            code = r["cityCode"].ToString()
                        };
                        lc.Add(b);
                    }
                }
            }
            return lc;
        }
    }
}
