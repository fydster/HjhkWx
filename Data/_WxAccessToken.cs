using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using Model;

namespace Data
{
    public class _WxAccessToken:DbCenter
    {
        public string GetAccessToken()
        {
            string WxAccessToken = "";
            string sql = "select * from wx_access_token order by id desc limit 0,1";
            try
            {
                using (DataTable dt = helper.GetDataTable(sql))
                {
                    if (dt != null && dt.Rows.Count > 0)
                    {
                        WxAccessToken = dt.Rows[0]["access_token"].ToString();
                        DateTime addOn = Convert.ToDateTime(dt.Rows[0]["addOn"].ToString());
                        if (addOn.AddMinutes(90) < DateTime.Now)
                        {
                            WxAccessToken = "";
                        }
                    }
                }
            }
            catch
            {
            }
            return WxAccessToken;
        }
    }
}
