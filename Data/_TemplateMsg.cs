using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using Model;

namespace Data
{
    public class _TemplateMsg:DbCenter
    {

        public List<templateMsg> GetTemplateMsg(string keyWord,int page,int perPage,out int Count)
        {
            int SCount = 0;
            string sql_count = "select count(id) as t from t_templateMsg where 1=1 " + keyWord;
            try
            {
                using (DataTable dt = helper.GetDataTable(sql_count))
                {
                    if (dt != null && dt.Rows.Count > 0)
                    {
                        SCount = Convert.ToInt16(dt.Rows[0]["t"]);
                    }
                }
            }
            catch { }
            Count = SCount;

            List<templateMsg> la = new List<templateMsg>();
            string sql = "select * from t_templateMsg where 1=1 " + keyWord + " order by sendTime desc limit " + Convert.ToInt16((page - 1) * perPage) + "," + perPage;
            try
            {
                using (DataTable dt = helper.GetDataTable(sql))
                {
                    if (dt != null && dt.Rows.Count > 0)
                    {
                        foreach (DataRow r in dt.Rows)
                        {
                            templateMsg a = new templateMsg 
                            {
                                id = Convert.ToInt32(r["id"]),
                                openId = r["openId"].ToString(),
                                msgBody = r["msgBody"].ToString(),
                                msgContent = r["msgContent"].ToString(),
                                msgUrl = r["msgUrl"].ToString(),
                                msgId = r["msgId"].ToString(),
                                toUser = Convert.ToInt16(r["toUser"]),
                                orderNo = r["orderNo"].ToString(),
                                sendTime = Convert.ToDateTime(r["sendTime"])
                            };
                            la.Add(a);
                        }
                    }
                }
            }
            catch
            {
            }
            return la;
        }
    }
}
