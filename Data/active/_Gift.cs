using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Model.active;
using System.Data;

namespace Data.active
{
    public class _Gift:DbCenter
    {
        public int IsExsit(int uid,int giftType)
        {
            int id = 0;
            string sql = "select id from t_active_gift where giftType = " + giftType + " and uid = " + uid;
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

        public Gift GetGift(int uid, string streamNo)
        {
            Gift g = null;
            string sql = "select * from t_active_gift where streamNo = '" + streamNo + "' and uid = " + uid;
            using (DataTable dt = helper.GetDataTable(sql))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    g = new Gift
                    {
                        giftName = dt.Rows[0]["giftName"].ToString(),
                        state = Convert.ToInt16(dt.Rows[0]["state"]),
                        useOn = Convert.ToDateTime(dt.Rows[0]["useOn"]),
                        addOn = Convert.ToDateTime(dt.Rows[0]["addOn"]),
                        giftType = Convert.ToInt16(dt.Rows[0]["giftType"])
                    };
                }
            }
            return g;
        }


        public int allNum(int giftType)
        {
            int id = 0;
            string sql = "select count(id) as t from t_active_gift where giftType = " + giftType ;
            try
            {
                id = Convert.ToInt32(helper.GetOne(sql));
            }
            catch
            {
                id = 0;
            }
            return id;
        }
    }
}
