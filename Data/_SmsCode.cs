using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Model;
using System.Data;

namespace Data
{
    public class _SmsCode:DbCenter
    {
        public int GetSmsCount(string mobile,int uid)
        {
            int SmsCodeNum = 0;
            try
            {
                SmsCodeNum = Convert.ToInt32(helper.GetOne("select count(id) as t from t_smscode where (mobile = '" + mobile + "' or uid = " + uid + ") and enable = 0 and datediff('" + DateTime.Now + "',addOn) = 0"));
            }
            catch
            {
                SmsCodeNum = 0;
            }
            return SmsCodeNum;
        }

        /// <summary>
        /// 获取验证码
        /// </summary>
        /// <param name="mobile"></param>
        /// <returns></returns>
        public string GetSmsCode(string mobile,int uid)
        {
            string Result = "";
            string sql = "select * from t_smsCode where mobile = '" + mobile + "' and uid = " + uid + " and enable = 0 order by addOn desc limit 0,1";
            using (DataTable dt = helper.GetDataTable(sql))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    Result = dt.Rows[0]["code"].ToString();
                }
            }
            return Result;
        }
    }
}
