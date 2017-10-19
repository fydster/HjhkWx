using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;

namespace Data.active
{
    public class _ActiveLog:DbCenter
    {
        public int IsExsit(int uid,int activeId)
        {
            int id = 0;
            string sql = "select id from t_active_log where activeId = " + activeId + " and uid = " + uid;
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

        public int getFundId(int uid, int aType)
        {
            int id = 0;
            string sql = "select fid from t_active_fund where aType = " + aType + " and uid = 0 limit 1 ";
            try
            {
                id = Convert.ToInt32(helper.GetOne(sql));
                helper.ExecuteSqlNoResult("update t_active_fund set uid = " + uid + ",addOn = '" + DateTime.Now + "' where fid = " + id);
            }
            catch
            {
                id = 0;
            }
            return id;
        }

        public int CheckFund(int uid)
        {
            int id = 0;
            string sql = "select fid from t_active_fund where uid = " + uid;
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
