using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Model.active;
using Model;
using System.Data;

namespace Data.active
{
    public class _Fly:DbCenter
    {
        public int GetPm(int distance)
        {
            int pm = 1;
            string sql = "select count(id) as t from t_active_fly where distance >= " + distance;
            try
            {
                pm = Convert.ToInt16(helper.GetOne(sql));
            }
            catch
            {
                pm = 1;
            }
            return pm;
        }

        public List<FlyPm> GetPmList()
        {
            List<FlyPm> lp = new List<FlyPm>();
            string sql = "SELECT srcUid,count(id) as t from t_user where srcUid > 2000 and date(addOn)<'2016-12-28' and date(addOn)>'2016-12-20' group by srcUid order by t desc  LIMIT 0,50";
            using (DataTable dt = helper.GetDataTable(sql))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    foreach (DataRow r in dt.Rows)
                    {
                        FlyPm b = new FlyPm
                        {
                            uid = Convert.ToInt32(r["srcUid"]),
                            count = Convert.ToInt32(r["t"])
                        };
                        user u = new _User().GetUser("", "", b.uid);
                        if (u != null)
                        {
                            b.nickName = u.nickName;
                            b.openId = u.openId;
                            b.photoUrl = u.photoUrl;
                        }
                        lp.Add(b);
                    }
                }
            }
            return lp;
        }

        public int IsExsit(int uid)
        {
            int id = 0;
            string sql = "select id from t_active_fly where uid = " + uid;
            try
            {
                id = Convert.ToInt16(helper.GetOne(sql));
            }
            catch
            {
                id = 0;
            }
            return id;
        }

    }

}
