using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using Model;

namespace Data
{
    public class _User:DbCenter
    {
        /// <summary>
        /// 获取用户信息
        /// </summary>
        /// <param name="OpenID"></param>
        /// <param name="mobile"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        public user GetUser(string OpenID, string mobile, int id)
        {
            user u = null;
            string sql = "";
            if (!string.IsNullOrEmpty(mobile))
            {
                sql = "select * from `t_user` where mobile = '" + mobile + "'";
            }
            if (!string.IsNullOrEmpty(OpenID))
            {
                sql = "select * from `t_user` where openid = '" + OpenID + "'";
            }
            if (id > 0)
            {
                sql = "select * from `t_user` where id = " + id;
            }

            try
            {
                using (DataTable dt = helper.GetDataTable(sql))
                {
                    if (dt != null && dt.Rows.Count > 0)
                    {
                        DataRow r = dt.Rows[0];
                        u = new user()
                        {
                            addOn = Convert.ToDateTime(r["addOn"]),
                            area = r["area"].ToString(),
                            contact = r["contact"].ToString(),
                            sex = Convert.ToInt16(r["sex"]),
                            photoUrl = r["photoUrl"].ToString(),
                            nickName = r["nickName"].ToString(),
                            mobile = r["mobile"].ToString(),
                            openId = r["openid"].ToString(),
                            exOpenID = r["exOpenID"].ToString(),
                            srcUid = Convert.ToInt32(r["srcUid"]),
                            unionid = r["unionid"].ToString(),
                            id = Convert.ToInt32(r["id"]),
                            isSubscribe = Convert.ToInt16(r["isSubscribe"]),
                            source = r["source"].ToString()
                        };
                    }
                }
            }
            catch { }
            return u;
        }

        public List<user> GetUser(string sql, string sql_c, out int UCount)
        {
            int Count = 0;
            try
            {
                Count = Convert.ToInt32(helper.GetOne(sql_c));
            }
            catch {
                Count = 0;
            }
            List<user> lu = new List<user>();
            try
            {
                using (DataTable dt = helper.GetDataTable(sql))
                {
                    if (dt != null && dt.Rows.Count > 0)
                    {
                        foreach (DataRow r in dt.Rows)
                        {

                            user u = new user()
                            {
                                addOn = Convert.ToDateTime(r["addOn"]),
                                area = r["area"].ToString(),
                                contact = r["contact"].ToString(),
                                sex = Convert.ToInt16(r["sex"]),
                                photoUrl = r["photoUrl"].ToString(),
                                nickName = r["nickName"].ToString(),
                                mobile = r["mobile"].ToString(),
                                openId = r["openid"].ToString(),
                                exOpenID = r["exOpenID"].ToString(),
                                srcUid = Convert.ToInt32(r["srcUid"]),
                                unionid = r["unionid"].ToString(),
                                id = Convert.ToInt32(r["id"]),
                                isSubscribe = Convert.ToInt16(r["isSubscribe"]),
                                source = r["source"].ToString()
                            };
                            lu.Add(u);
                        }
                    }
                }
            }
            catch { }
            UCount = Count;
            return lu;
        }

        public List<UserInfo> GetUserForMobile(string sql, string sqlid, out int UCount)
        {
            string sql_c = sql.Replace("*", "count(*) as t");
            int Count = 0;
            try
            {
                Count = Convert.ToInt32(helper.GetOne(sql_c));
            }
            catch
            {
                Count = 0;
            }
            List<UserInfo> lu = new List<UserInfo>();
            try
            {
                using (DataTable dt = helper.GetDataTable(sql))
                {
                    if (dt != null && dt.Rows.Count > 0)
                    {
                        foreach (DataRow r in dt.Rows)
                        {

                            UserInfo u = new UserInfo()
                            {
                                addOn = Convert.ToDateTime(r["addOn"]),
                                area = r["area"].ToString(),
                                contact = r["contact"].ToString(),
                                sex = Convert.ToInt16(r["sex"]),
                                photoUrl = r["photoUrl"].ToString(),
                                nickName = r["nickName"].ToString(),
                                mobile = r["mobile"].ToString(),
                                openId = r["openid"].ToString(),
                                id = Convert.ToInt32(r["id"])
                            };
                            lu.Add(u);
                        }
                    }
                }
            }
            catch { }
            UCount = Count;
            return lu;
        }

        public List<user> GetUserForMobile(int uid)
        {
            string sql = "select * from t_user where source = " + uid + " order by addOn desc";
            List<user> lu = new List<user>();
            try
            {
                using (DataTable dt = helper.GetDataTable(sql))
                {
                    if (dt != null && dt.Rows.Count > 0)
                    {
                        foreach (DataRow r in dt.Rows)
                        {
                            user u = new user()
                            {
                                addOn = Convert.ToDateTime(r["addOn"]),
                                area = r["area"].ToString(),
                                contact = r["contact"].ToString(),
                                sex = Convert.ToInt16(r["sex"]),
                                photoUrl = r["photoUrl"].ToString(),
                                nickName = r["nickName"].ToString(),
                                mobile = r["mobile"].ToString(),
                                openId = r["openid"].ToString(),
                                exOpenID = r["exOpenID"].ToString(),
                                srcUid = Convert.ToInt32(r["srcUid"]),
                                unionid = r["unionid"].ToString(),
                                id = Convert.ToInt32(r["id"]),
                                isSubscribe = Convert.ToInt16(r["isSubscribe"]),
                                source = r["source"].ToString()
                            };
                            lu.Add(u);
                        }
                    }
                }
            }
            catch { }
            return lu;
        }

        public Dictionary<int, string> GetComInfo(string sqlid)
        {
            Dictionary<int, string> DicCom = new Dictionary<int, string>();
            if (sqlid.Length > 0)
            {
                string sql = "select userId,contact,tel from t_order where userId in(" + sqlid + ")";
                using (DataTable dt = helper.GetDataTable(sql))
                {
                    if (dt != null && dt.Rows.Count > 0)
                    {
                        int uid = 0;
                        foreach (DataRow r in dt.Rows)
                        {
                            uid = Convert.ToInt32(r["userId"]);
                            if (!DicCom.ContainsKey(uid))
                            {
                                DicCom.Add(uid, r["contact"].ToString() + "|" + r["tel"].ToString());
                            }
                        }
                    }
                }
            }
            return DicCom;
        }

        public Dictionary<int, string> GetUIDSourceDic()
        {
            Dictionary<int, string> DicCom = new Dictionary<int, string>();
            string sql = "select id,nickName from t_user where id > 0 and id < 2000";
            using (DataTable dt = helper.GetDataTable(sql))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    int uid = 0;
                    foreach (DataRow r in dt.Rows)
                    {
                        uid = Convert.ToInt32(r["id"]);
                        DicCom.Add(uid, r["nickName"].ToString());
                    }
                }
            }
            return DicCom;
        }

        public Dictionary<int, string> GetUIDSourceDicForYG()
        {
            Dictionary<int, string> DicCom = new Dictionary<int, string>();
            string sql = "select id,contact from t_user where bid = 100";
            using (DataTable dt = helper.GetDataTable(sql))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    int uid = 0;
                    foreach (DataRow r in dt.Rows)
                    {
                        uid = Convert.ToInt32(r["id"]);
                        DicCom.Add(uid, r["contact"].ToString());
                    }
                }
            }
            return DicCom;
        }

        public string getUserPM(int srcUid)
        {
            string pm = "0|0";
            try
            {
                int count = Convert.ToInt32(helper.GetOne("SELECT count(id) as t from t_user where srcUid = " + srcUid + " and date(addOn)>'2017-07-11'"));
                if (count > 0)
                {
                    using (DataTable dt = helper.GetDataTable("SELECT srcUid,count(id) as t from t_user where srcUid > 0  and date(addOn)>'2017-07-11' group by srcUid HAVING(t>" + count + ")"))
                    {
                        pm = count + "|" + (dt.Rows.Count + 1);
                    }
                    
                }
            }
            catch
            {

            }
            return pm;
        }
    }
}
