using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using Model;

namespace Data
{
    /// <summary>
    /// 微信支付流水
    /// </summary>
    public class _WxPay:DbCenter
    {

        /// <summary>
        /// 获取微信支付信息
        /// </summary>
        /// <param name="orderNo"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        public wxPay GetWxPay(string orderNo, int id)
        {
            wxPay la = null;
            string sql = "select * from t_wxPay where enable = 0 and DATE_SUB(NOW(),INTERVAL 110 MINUTE) < payOn and orderNo = '" + orderNo + "'";
            if (id > 0)
            {
                sql = "select * from t_wxPay where enable = 0 and DATE_SUB(NOW(),INTERVAL 110 MINUTE) < payOn and id = " + id;
            }

            try
            {
                using (DataTable dt = helper.GetDataTable(sql))
                {
                    if (dt != null && dt.Rows.Count > 0)
                    {
                        DataRow r = dt.Rows[0];
                        la = new wxPay
                        {
                             enable = Convert.ToInt16(r["enable"]),
                             payServiceId = r["payServiceId"].ToString(),
                        };
                    }
                }
            }
            catch
            {
            }
            return la;
        }

        public wxPay GetWxPay(string orderNo)
        {
            wxPay la = null;
            string sql = "select * from t_wxPay where enable = 1 and orderNo = '" + orderNo + "'";
            try
            {
                using (DataTable dt = helper.GetDataTable(sql))
                {
                    if (dt != null && dt.Rows.Count > 0)
                    {
                        DataRow r = dt.Rows[0];
                        la = new wxPay
                        {
                            id = Convert.ToInt32(r["id"]),
                            orderNo = r["orderNo"].ToString(),
                            out_trade_no = r["out_trade_no"].ToString(),
                            transaction_id = r["transaction_id"].ToString(),
                            total_fee = Math.Round(Convert.ToDouble(r["total_fee"]),2),
                            enable = Convert.ToInt16(r["enable"]),
                            extNo = r["extNo"].ToString()
                        };
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
