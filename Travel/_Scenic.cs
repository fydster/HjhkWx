using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;

namespace Travel
{
    public class _Scenic:DbCenter
    {
        public scenic GetScenicInfo(string scenicId)
        {
            scenic to = null;
            string sql = "select * from t_travel_scenic where scenicId = '" + scenicId + "'";
            using (DataTable dt = helper.GetDataTable(sql))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    foreach (DataRow r in dt.Rows)
                    {
                        to = new scenic
                        {
                            scenicId = r["scenicId"].ToString(),
                            scenicName = r["scenicName"].ToString(),
                            address = r["address"].ToString(),
                            glocation = r["glocation"].ToString(),
                            blocation = r["blocation"].ToString(),
                            bizTime = r["bizTime"].ToString(),
                            newPicUrl = r["newPicUrl"].ToString()
                        };
                        to.disTickets = GetTickets(scenicId, 0);
                        to.ticketList = GetTickets(scenicId, 1);
                    }
                }
            }
            return to;
        }

        public List<tickets> GetTickets(string scenicId, int tType)
        {
            List<tickets> lt = new List<tickets>();
            string sql = "select * from t_travel_tickets where scenicId = '" + scenicId + "' and tType = " + tType + " order by salePrice asc";
            using (DataTable dt = helper.GetDataTable(sql))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    foreach (DataRow r in dt.Rows)
                    {
                        tickets to = new tickets
                        {
                            productId = Convert.ToInt32(r["productId"].ToString()),
                            productName = r["productName"].ToString(),
                            salePrice = r["salePrice"].ToString(),
                            webPrice = r["webPrice"].ToString()
                        };
                        lt.Add(to);
                    }
                }
            }
            return lt;
        }

        public string GetProductName(int productID)
        {
            string ProductName = "";
            string sql = "select * from t_travel_tickets where productID = " + productID;
            using (DataTable dt = helper.GetDataTable(sql))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    ProductName = dt.Rows[0]["productName"].ToString();
                }
            }
            return ProductName;
        }
    }
}
