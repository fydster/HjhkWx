using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using Model;

namespace Data
{
    public class _Custom:DbCenter
    {
        public List<custom> GetCustomList(string keyWord,int page,int perPage,out int UCount)
        {
            List<custom> lc = new List<custom>();

            string sql = "select * from t_user where 1=1 " + keyWord + " order by addOn desc";
            Dictionary<int, user> Dic = new Dictionary<int, user>();
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
                                id = Convert.ToInt32(r["id"]),
                                source = r["source"].ToString()
                            };
                            if (!Dic.ContainsKey(u.id))
                            {
                                Dic.Add(u.id, u);
                            }
                        }
                    }
                }
            }
            catch { }

            int Count = 0;
            try
            {
                Count = Convert.ToInt32(helper.GetOne("select count(distinct userId) as t from t_order where userId in(select id from t_user where 1=1 " + keyWord + ") and isPay = 1 and state < 9"));
            }
            catch
            {
                Count = 0;
            }
            UCount = Count;
            //统计数据
            sql = "select userId,count(*) as t,sum(allPrice) as p from t_order where userId in(select id from t_user where 1=1 " + keyWord + ") and isPay = 1 and state < 9 group by userId order by t desc limit " + (page - 1) * perPage + "," + perPage;        
            try
            {
                using (DataTable dt = helper.GetDataTable(sql))
                {
                    if (dt != null && dt.Rows.Count > 0)
                    {
                        user u = null;
                        foreach (DataRow r in dt.Rows)
                        {
                            u = null;
                            if (Dic.ContainsKey(Convert.ToInt16(r["userId"])))
                            {
                                u = (user)Dic[Convert.ToInt16(r["userId"])];
                            }
                            if (u != null)
                            {
                                custom c = new custom()
                                {
                                    addOn = u.addOn,
                                    area = u.area,
                                    contact = u.contact,
                                    sex = u.sex,
                                    photoUrl = u.photoUrl,
                                    nickName = u.nickName,
                                    mobile = u.mobile,
                                    openId = u.openId,
                                    id = u.id,
                                    source = u.source,
                                    sourceName = ""
                                };
                                c.orderNum = Convert.ToInt16(r["t"]);
                                c.orderAll = Convert.ToDouble(r["p"]);
                                try
                                {
                                    if (Convert.ToInt16(c.source) > 0)
                                    {
                                        user us = new _User().GetUser("", "", Convert.ToInt16(c.source));
                                        if (us != null)
                                        {
                                            c.sourceName = us.nickName;
                                        }
                                    }

                                }
                                catch { }
                                lc.Add(c);
                            }
                        }
                    }
                }
            }
            catch { }
            return lc;
        }
    }
}
