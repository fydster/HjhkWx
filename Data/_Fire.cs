using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using Model;
using Model.View;

namespace Data
{
    public class _Fire:DbCenter
    {
        public List<fire> GetFireList()
        {
            List<fire> lc = new List<fire>();

            string sql = "select srcUid,count(id) as b from t_user where srcUid > 0 and date(addOn) > '2017-05-01'  group by srcUid order by b desc";
            using (DataTable dt = helper.GetDataTable(sql))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    foreach (DataRow r in dt.Rows)
                    {
                        fire o = new fire()
                        {
                            nickName = "",
                            photoUrl = "",
                            uId = Convert.ToInt32(r["srcUid"]),
                            fireNum = Convert.ToInt16(r["b"])
                        };
                        user u = new _User().GetUser("", "", o.uId);
                        if (u != null)
                        {
                            o.nickName = u.nickName;
                            o.contact = u.contact;
                            o.photoUrl = u.photoUrl;
                        }
                        lc.Add(o);
                    }
                }
            }
            return lc;
        }


        public int GetFireNum(int uid)
        {
            int Num = 0;

            string sql = "select count(id) as b from t_user where srcUid = " + uid + " and date(addOn) > '2017-05-01'";
            using (DataTable dt = helper.GetDataTable(sql))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    Num = Convert.ToInt16(dt.Rows[0]["b"]);
                }
            }
            return Num;
        }
    }
}
