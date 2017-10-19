using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using Model;
using com.seascape.tools;

namespace Data
{
    public class _CountAll : DbCenter
    {
        public CountAll GetCount(DateTime sDate,DateTime eDate)
        {
            CountAll ca = new CountAll()
            {
                userCount = 0,
                userCountNo = 0,
                searchCount = 0,
                shareF = 0,
                shareP = 0,
                trainSearchCount = 0,
                airOrderCount = 0,
                airFareCount = 0,
                trainOrderCount = 0,
                trainFareCount = 0,
                hotelOrderCount = 0,
                hotelRoomsCount = 0,
                hotelSearchCount = 0
            };

            //新增用户
            try
            {
                ca.userCount = Convert.ToInt16(helper.GetOne("select count(id) as t from t_user where date(addOn) >='" + sDate.ToString("yyyy-MM-dd") + "' and date(addOn) <='" + eDate.ToString("yyyy-MM-dd") + "'"));
            }
            catch
            {
                ca.userCount = 0;
            }

            //新增用户(未关注)
            try
            {
                ca.userCountNo = Convert.ToInt16(helper.GetOne("select count(id) as t from t_user where date(addOn) >='" + sDate.ToString("yyyy-MM-dd") + "' and date(addOn) <='" + eDate.ToString("yyyy-MM-dd") + "' and isSubscribe = 0"));
            }
            catch
            {
                ca.userCountNo = 0;
            }

            //查询统计
            try
            {
                ca.searchCount = Convert.ToInt16(helper.GetOne("select count(id) as t from t_search_log where date(addOn) >='" + sDate.ToString("yyyy-MM-dd") + "' and date(addOn) <='" + eDate.ToString("yyyy-MM-dd") + "' and sType = 0"));
            }
            catch
            {
                ca.searchCount = 0;
            }

            //火车查询统计
            try
            {
                ca.trainSearchCount = Convert.ToInt16(helper.GetOne("select count(id) as t from t_search_log where date(addOn) >='" + sDate.ToString("yyyy-MM-dd") + "' and date(addOn) <='" + eDate.ToString("yyyy-MM-dd") + "' and sType = 1"));
            }
            catch
            {
                ca.trainSearchCount = 0;
            }

            //酒店查询统计
            try
            {
                ca.hotelSearchCount = Convert.ToInt16(helper.GetOne("select count(id) as t from t_search_log where date(addOn) >='" + sDate.ToString("yyyy-MM-dd") + "' and date(addOn) <='" + eDate.ToString("yyyy-MM-dd") + "' and sType = 2"));
            }
            catch
            {
                ca.hotelSearchCount = 0;
            }

            //特价分享
            try
            {
                ca.shareF = Convert.ToInt16(helper.GetOne("select count(id) as t from t_share where date(addOn) >='" + sDate.ToString("yyyy-MM-dd") + "' and date(addOn) <='" + eDate.ToString("yyyy-MM-dd") + "' and fType = 0"));
            }
            catch
            {
                ca.shareF = 0;
            }

            //特价发给朋友
            try
            {
                ca.shareP = Convert.ToInt16(helper.GetOne("select count(id) as t from t_share where date(addOn) >='" + sDate.ToString("yyyy-MM-dd") + "' and date(addOn) <='" + eDate.ToString("yyyy-MM-dd") + "' and fType = 1"));
            }
            catch
            {
                ca.shareP = 0;
            }

            //火车票订单
            try
            {
                ca.trainOrderCount = Convert.ToInt16(helper.GetOne("SELECT count(id)  as t from t_train_order where date(addOn) >='" + sDate.ToString("yyyy-MM-dd") + "' and date(addOn) <='" + eDate.ToString("yyyy-MM-dd") + "' and state = 3  and uId > 0"));
            }
            catch
            {
                ca.trainOrderCount = 0;
            }


            //火车票票数
            try
            {
                ca.trainFareCount = Convert.ToInt16(helper.GetOne("SELECT sum(fareNum)  as t from t_train_order where date(addOn) >='" + sDate.ToString("yyyy-MM-dd") + "' and date(addOn) <='" + eDate.ToString("yyyy-MM-dd") + "' and state = 3  and uId > 0"));
            }
            catch
            {
                ca.trainFareCount = 0;
            }


            //酒店订单
            try
            {
                ca.hotelOrderCount = Convert.ToInt16(helper.GetOne("SELECT count(id)  as t from hotel_order where date(addOn) >='" + sDate.ToString("yyyy-MM-dd") + "' and date(addOn) <='" + eDate.ToString("yyyy-MM-dd") + "'"));
            }
            catch
            {
                ca.hotelOrderCount = 0;
            }


            //酒店房间数
            try
            {
                ca.hotelRoomsCount = Convert.ToInt16(helper.GetOne("SELECT sum(NumberOfRooms)  as t from hotel_order where date(addOn) >='" + sDate.ToString("yyyy-MM-dd") + "' and date(addOn) <='" + eDate.ToString("yyyy-MM-dd") + "'"));
            }
            catch
            {
                ca.hotelRoomsCount = 0;
            }

            //机票票数
            try
            {
                string airInfo = BasicTool.webRequest("http://59.49.19.109:8016/weixin/WxHandler.ashx?Fn=10&sDate=" + sDate.ToString("yyyy-MM-dd") + "&eDate=" + eDate.ToString("yyyy-MM-dd"));
                if (airInfo.Length > 0 && airInfo.IndexOf("|") > -1)
                {
                    ca.airOrderCount = Convert.ToInt16(airInfo.Split('|')[0]);
                    ca.airFareCount = Convert.ToInt16(airInfo.Split('|')[1]);
                }
            }
            catch
            {
                ca.airOrderCount = 0;
                ca.airFareCount = 0;
            }

            return ca;
        }

        public List<CountSource> GetCountSource(DateTime sDate, DateTime eDate)
        {
            List<CountSource> lc = new List<CountSource>();
            string sql = "SELECT source,count(id) as t from t_user where date(addOn) >='" + sDate.ToString("yyyy-MM-dd") + "' and date(addOn) <='" + eDate.ToString("yyyy-MM-dd") + "' GROUP BY source order by t desc";
            using (DataTable dt = helper.GetDataTable(sql))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    Dictionary<string, source> Dic = new _Source().GetSourceDic();
                    foreach (DataRow r in dt.Rows)
                    {
                        CountSource b = new CountSource
                        {
                            source = r["source"].ToString(),
                            uNum = Convert.ToInt16(r["t"].ToString()),
                            sName = ""
                        };
                        if (Dic.ContainsKey(b.source))
                        {
                            b.sName = Dic[b.source].sName;
                        }
                        lc.Add(b);
                    }
                }
            }
            return lc;
        }

        public List<CountSrcUid> GetCountSrc(DateTime sDate, DateTime eDate)
        {
            List<CountSrcUid> lc = new List<CountSrcUid>();
            string sql = "SELECT srcUid,count(id) as t from t_user where date(addOn) >='" + sDate.ToString("yyyy-MM-dd") + "' and date(addOn) <='" + eDate.ToString("yyyy-MM-dd") + "' and srcUid < 2000 and srcUid  > 0 GROUP BY srcUid order by t desc";
            using (DataTable dt = helper.GetDataTable(sql))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    Dictionary<int, string> Dic = new _User().GetUIDSourceDic();
                    foreach (DataRow r in dt.Rows)
                    {
                        CountSrcUid b = new CountSrcUid
                        {
                            uId = Convert.ToInt32(r["srcUid"].ToString()),
                            uNum = Convert.ToInt16(r["t"].ToString()),
                            nickName = ""
                        };
                        if (Dic.ContainsKey(b.uId))
                        {
                            b.nickName = Dic[b.uId];
                        }
                        lc.Add(b);
                    }
                }
            }
            return lc;
        }

        public List<CountSrcUid> GetCountSrcForYG(DateTime sDate, DateTime eDate)
        {
            List<CountSrcUid> lc = new List<CountSrcUid>();
            string sql = "SELECT srcUid,count(id) as t from t_user where date(addOn) >='" + sDate.ToString("yyyy-MM-dd") + "' and date(addOn) <='" + eDate.ToString("yyyy-MM-dd") + "' and srcUid in(select id from t_user where bid = 100) GROUP BY srcUid order by t desc";
            using (DataTable dt = helper.GetDataTable(sql))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    Dictionary<int, string> Dic = new _User().GetUIDSourceDicForYG();
                    foreach (DataRow r in dt.Rows)
                    {
                        CountSrcUid b = new CountSrcUid
                        {
                            uId = Convert.ToInt32(r["srcUid"].ToString()),
                            uNum = Convert.ToInt16(r["t"].ToString()),
                            nickName = ""
                        };
                        if (Dic.ContainsKey(b.uId))
                        {
                            b.nickName = Dic[b.uId];
                        }
                        lc.Add(b);
                    }
                }
            }
            return lc;
        }
    }
}
