using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Model;
using System.Data;

namespace Data
{
    public class _MsgConfig:DbCenter
    {
        public Dictionary<string, msgConfig> getMessageConfigDic()
        {
            Dictionary<string, msgConfig> Dic = new Dictionary<string, msgConfig>();
            string sql = "select * from t_message_config";
            using (DataTable dt = helper.GetDataTable(sql))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    foreach (DataRow r in dt.Rows)
                    {
                        msgConfig msg = new msgConfig
                        {
                            id = Convert.ToInt16(r["Id"]),
                            msgId = r["msgId"].ToString(),
                            msgName = r["msgName"].ToString(),
                            msgSign = r["msgSign"].ToString(),
                            source = r["source"].ToString()
                        };
                        Dic.Add(msg.msgSign + "_" + msg.source, msg);
                    }
                }
            }
            return Dic;
        }
    }
}
