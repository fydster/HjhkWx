using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Model.Count;
using com.seascape.tools;

namespace Data.Count
{
    public class _CountFx:DbCenter
    {
        public CountFx GetCount(DateTime sDate, DateTime eDate,int srcUid)
        {
            CountFx ca = new CountFx()
            {
                userCount = 0,
                airOrderCount = 0,
                airFareCount = 0,
                insuranceCount = 0,
                airPrice = 0,
                refundCount = 0,
                userCancel = 0
            };

            //新增用户
            try
            {
                ca.userCount = Convert.ToInt16(helper.GetOne("select count(id) as t from t_user where srcUid = " + srcUid + " and date(addOn) >='" + sDate.ToString("yyyy-MM-dd") + "' and date(addOn) <='" + eDate.ToString("yyyy-MM-dd") + "'"));
                ca.userCancel = Convert.ToInt16(helper.GetOne("select count(id) as t from t_user where srcUid = " + srcUid + " and date(addOn) >='" + sDate.ToString("yyyy-MM-dd") + "' and date(addOn) <='" + eDate.ToString("yyyy-MM-dd") + "' and isSubscribe = 0"));
            }
            catch
            {
                ca.userCount = 0;
                ca.userCancel = 0;
            }

            //机票票数
            try
            {
                string airInfo = BasicTool.webRequest("http://59.49.19.109:8016/weixin/WxHandler.ashx?Fn=11&srcUid=" + srcUid + "&sDate=" + sDate.ToString("yyyy-MM-dd") + "&eDate=" + eDate.ToString("yyyy-MM-dd"));
                if (airInfo.Length > 0 && airInfo.IndexOf("|") > -1)
                {
                    ca.airOrderCount = Convert.ToInt16(airInfo.Split('|')[0]);
                    ca.airFareCount = Convert.ToInt16(airInfo.Split('|')[1]);
                    ca.insuranceCount = Convert.ToInt32(airInfo.Split('|')[2]);
                    ca.airPrice = Convert.ToInt32(airInfo.Split('|')[3]);
                    ca.refundCount = Convert.ToInt16(airInfo.Split('|')[4]);
                }
            }
            catch
            {
                ca.airOrderCount = 0;
                ca.airFareCount = 0;
                ca.insuranceCount = 0;
                ca.airPrice =  0;
                ca.refundCount = 0;
            }

            return ca;
        }
    }
}
