using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;

namespace Travel
{
    public class _TravelOrder:DbCenter
    {
        public Double GetOrderPrice(string orderNo)
        {
            Double OrderPrice = 0;
            try
            {
                OrderPrice = Convert.ToDouble(helper.GetOne("select totalPrice from t_travel_order where orderNo = '" + orderNo + "'"));
            }
            catch
            {
                OrderPrice = 0;
            }
            return OrderPrice;
        }

        public travelOrderInfo GetTravelOrderInfo(string orderNo)
        {
            travelOrderInfo to = null;
            string sql = "select * from t_travel_order where orderNo = '" + orderNo + "'";
            using (DataTable dt = helper.GetDataTable(sql))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    foreach (DataRow r in dt.Rows)
                    {
                        to = new travelOrderInfo
                        {
                            orderId = Convert.ToInt32(r["orderId"].ToString()),
                            state = Convert.ToInt16(r["state"]),
                            orderNo = orderNo,
                            addOn = Convert.ToDateTime(r["addOn"]),
                            ticketPrice = Convert.ToDouble(r["ticketPrice"]),
                            totalPrice = Convert.ToDouble(r["totalPrice"]),
                            refundPrice = Convert.ToDouble(r["refundPrice"]),
                            uId = Convert.ToInt32(r["uId"]),
                            contact = r["contact"].ToString(),
                            mobile = r["mobile"].ToString(),
                            fareNum = Convert.ToInt16(r["fareNum"]),
                            isPay = Convert.ToInt16(r["isPay"]),
                            productId = Convert.ToInt32(r["productId"]),
                            ticketOn = Convert.ToDateTime(r["ticketOn"]),
                            productName = ""
                        };
                        to.productName = new _Scenic().GetProductName(to.productId);
                    }
                }
            }
            return to;
        }


        public List<travelOrderInfo> GetTravelOrderList(int uid)
        {
            List<travelOrderInfo> lt = new List<travelOrderInfo>();
            string sql = "select * from t_travel_order where uid = " + uid + " order by id desc";
            using (DataTable dt = helper.GetDataTable(sql))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    foreach (DataRow r in dt.Rows)
                    {
                        travelOrderInfo to = new travelOrderInfo
                        {
                            orderId = Convert.ToInt32(r["orderId"].ToString()),
                            state = Convert.ToInt16(r["state"]),
                            orderNo = r["orderNo"].ToString(),
                            addOn = Convert.ToDateTime(r["addOn"]),
                            ticketPrice = Convert.ToDouble(r["ticketPrice"]),
                            totalPrice = Convert.ToDouble(r["totalPrice"]),
                            refundPrice = Convert.ToDouble(r["refundPrice"]),
                            uId = Convert.ToInt32(r["uId"]),
                            contact = r["contact"].ToString(),
                            mobile = r["mobile"].ToString(),
                            fareNum = Convert.ToInt16(r["fareNum"]),
                            isPay = Convert.ToInt16(r["isPay"]),
                            ticketOn = Convert.ToDateTime(r["ticketOn"]),
                            productId = Convert.ToInt32(r["productId"]),
                            productName = ""
                        };
                        to.productName = new _Scenic().GetProductName(to.productId);
                        lt.Add(to);
                    }
                }
            }
            return lt;
        }
    }
}
