using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Model;
using System.Data;

namespace Data
{
    public class _Client:DbCenter
    {
        public List<client> GetClientList(string mobile)
        {
            List<client> lp = new List<client>();
            string sql = "select * from t_client where mobile = '" + mobile + "' and Enable = 0 order by id asc";
            using (DataTable dt = helper.GetDataTable(sql))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    foreach (DataRow r in dt.Rows)
                    {
                        client b = new client
                        {
                            id = Convert.ToInt32(r["Id"]),
                            fare_name = r["fare_name"].ToString(),
                            fare_card = r["fare_card"].ToString(),
                            mobile = r["Mobile"].ToString(),
                            user_py = r["user_py"].ToString().Substring(0,1)
                        };
                        lp.Add(b);
                    }
                }
            }
            return lp;
        }


        public List<client> GetTrainClientList(string mobile)
        {
            List<client> lp = new List<client>();
            string sql = "SELECT id,passengerName,idCard from t_train_fare where orderNo in(SELECT orderNo from t_train_order where mobile = '" + mobile + "')";
            using (DataTable dt = helper.GetDataTable(sql))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    Dictionary<string, int> Dic = new Dictionary<string, int>();
                    foreach (DataRow r in dt.Rows)
                    {
                        if (!Dic.ContainsKey(r["idCard"].ToString()))
                        {
                            client b = new client
                            {
                                id = Convert.ToInt32(r["Id"]),
                                fare_name = r["passengerName"].ToString(),
                                fare_card = r["idCard"].ToString(),
                                mobile = mobile,
                                user_py = ""
                            };
                            lp.Add(b);
                            Dic.Add(b.fare_card, 0);
                        }

                    }
                }
            }
            return lp;
        }
    }
}
